# Track B — Operator Actions on `site-monitor`

> Three paste-ready PR briefs for changes that must land in the `site-monitor` repo before Phase 4a staging verification can prove siteclinic-web's cross-origin coupling works.
>
> **Track B is the gating dependency for Phase 4a (staging) and Phase 4b (production cutover).** None of these PRs are reversible-by-the-agent — each one touches a production-adjacent surface and needs operator-driven review/merge.
>
> Status of Track A (local builds) as of this doc: **14 of ~22 planned routes shipped + gate-clean**. Track A and Track B can proceed in parallel; Track C cannot start until both Track A is sufficiently complete AND all three Track B PRs are merged + deployed.

---

## PR brief #1 — CORS allowlist on `/api/siteclinic/*`

### Title

`feat(siteclinic): CORS allowlist for cross-origin requests from siteclinic-web`

### Background

After Phase 4b cutover, siteclinic.io will be served by the new `siteclinic-web` repo (Next.js 16 app). Operations APIs continue to live in `site-monitor` and will be reachable at `app.siteclinic.io/api/*`.

Two endpoints will receive **cross-origin POSTs** from siteclinic-web's marketing surface:

| Marketing-side call site | Endpoint hit | Body shape |
|--|--|--|
| `/pricing` → `CheckoutButton` | `POST /api/siteclinic/checkout` | `{ tier: "basic"\|"pro"\|"agency", email: string, siteUrl: string }` |
| `/contact` → `WaitlistForm` | `POST /api/siteclinic/waitlist` | `{ email: string, siteUrl?: string }` |

Today these endpoints are same-origin (siteclinic.io → siteclinic.io) and don't need CORS. After cutover they become cross-origin (siteclinic.io → app.siteclinic.io) and the browser will refuse the POST without explicit `Access-Control-Allow-Origin` headers.

This PR adds a narrow allowlist on those two endpoints so the cross-origin POST works for the legitimate origins only.

### Scope

Touch only these two API route handlers in `site-monitor`:

- `src/app/api/siteclinic/checkout/route.ts`
- `src/app/api/siteclinic/waitlist/route.ts`

Do not change any other API route. Do not add a global CORS middleware — keep the allowlist scoped per-endpoint so the surface is auditable.

### Implementation

Add a small CORS helper (one file, ~40 lines) and apply it to both routes:

```ts
// src/lib/cors.ts
import type { NextRequest } from "next/server";

const PROD_ORIGINS = [
  "https://siteclinic.io",
  "https://www.siteclinic.io",
];

const STAGING_ORIGIN_PATTERN = /^https:\/\/siteclinic-web-[a-z0-9-]+-drjliddy-max\.vercel\.app$/;

const DEV_ORIGINS =
  process.env.NODE_ENV === "production"
    ? []
    : ["http://localhost:3000", "http://localhost:3001"];

export function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  if (PROD_ORIGINS.includes(origin)) return true;
  if (STAGING_ORIGIN_PATTERN.test(origin)) return true;
  if (DEV_ORIGINS.includes(origin)) return true;
  return false;
}

export function corsHeaders(origin: string | null): Record<string, string> {
  if (!isAllowedOrigin(origin)) {
    return {}; // FAIL-CLOSED: refuse the origin by omitting the allow header
  }
  return {
    "Access-Control-Allow-Origin": origin!,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

export function handleOptions(req: NextRequest): Response {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(req.headers.get("origin")),
  });
}
```

In each route handler (`checkout/route.ts` and `waitlist/route.ts`):

```ts
import { corsHeaders, handleOptions } from "@/lib/cors";

export async function OPTIONS(req: NextRequest) {
  return handleOptions(req);
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  // ... existing checkout/waitlist logic ...
  const responseBody = JSON.stringify(/* existing payload */);
  return new Response(responseBody, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(origin),
    },
  });
}
```

### Allowed-origin matrix

| Environment | Allowed origins | Source |
|--|--|--|
| Production | `https://siteclinic.io`, `https://www.siteclinic.io` | Hardcoded in `PROD_ORIGINS` |
| Vercel preview | `https://siteclinic-web-<sha>-drjliddy-max.vercel.app` | Regex match — covers any preview deploy of `siteclinic-web` repo |
| Local dev | `http://localhost:3000`, `http://localhost:3001` | Gated by `NODE_ENV !== "production"` |
| Anything else | Refused | Fail-closed default |

### Fail-closed behavior expectations

- **Browser sees no `Access-Control-Allow-Origin` header** when origin is not in allowlist → browser blocks the response → cross-origin POST fails at the client.
- **Server still processes the request** if the body is valid (the POST handler runs regardless of origin) — this is intentional so server-to-server calls without an `Origin` header continue to work. The CORS check is enforced by the browser, not the server.
- **NO wildcard `*`** in `Access-Control-Allow-Origin`. The endpoint accepts credentials/cookies and a wildcard would be both wrong and dangerous.

### Tests required in the PR

Add at minimum:

```ts
// src/app/api/siteclinic/__tests__/cors.test.ts
import { isAllowedOrigin } from "@/lib/cors";

describe("CORS allowlist", () => {
  test("production origins pass", () => {
    expect(isAllowedOrigin("https://siteclinic.io")).toBe(true);
    expect(isAllowedOrigin("https://www.siteclinic.io")).toBe(true);
  });
  test("Vercel preview origins pass", () => {
    expect(isAllowedOrigin("https://siteclinic-web-abc123-drjliddy-max.vercel.app")).toBe(true);
  });
  test("localhost passes in dev", () => {
    // (gate based on NODE_ENV)
  });
  test("arbitrary origins refused", () => {
    expect(isAllowedOrigin("https://evil.example.com")).toBe(false);
    expect(isAllowedOrigin("https://siteclinic.io.evil.example.com")).toBe(false);
    expect(isAllowedOrigin(null)).toBe(false);
  });
});
```

### Verification before merge

1. Local test: run site-monitor dev server, POST from `http://localhost:3000` to `/api/siteclinic/checkout` with `Origin: http://localhost:3000` header → response includes `Access-Control-Allow-Origin: http://localhost:3000`
2. Local test: POST same request with `Origin: https://evil.example.com` → response has NO allow header (fail-closed)
3. After deploy: from siteclinic-web staging deploy, click a `/pricing` tier button, submit form → form opens Stripe Checkout in new tab. If it fails with CORS error in browser console, the allowlist regex is wrong.

### Rollback plan

If the allowlist is too strict and blocks a legitimate caller post-deploy: revert the route handler change, redeploy. CORS-blocked requests return 0 bytes to the browser; the server-side endpoint continues working for any direct (non-browser) caller, so no data is lost or corrupted by a bad allowlist.

---

## PR brief #2 — Cross-repo blog publisher contract

### Title

`feat(blog-writer): siteclinic publisher commits to siteclinic-web repo`

### Background

Per locked `MIGRATION_PLAN.md §6 row 3` (blog rendering decision):

> *"Blog renders in `siteclinic-web`; publisher in `site-monitor` writes commits to `siteclinic-web` via GitHub Actions / commit-based idempotency contract. No reverse-proxy."*

After Phase 4b cutover, `siteclinic.io/blog/*` and `siteclinic.io/blog` will be served by the new `siteclinic-web` Next.js app. The `blog-writer-siteclinic` lane in `site-monitor/src/blog-writer/` continues to generate blog content (Tue/Thu schedule per existing cron) but must now write the generated markdown into the `siteclinic-web` repo via cross-repo commit, not into site-monitor's own `src/app/blog/` directory.

Existing reference implementation: `blog-writer-ada` already follows this exact pattern (writes commits to `ada-audit-tool` repo via GitHub Actions with idempotency keys). Mirror that contract.

### Scope

Files touched in `site-monitor`:

- `src/blog-writer/lanes/siteclinic/` (the lane's existing publish target needs to change from local to cross-repo)
- `.github/workflows/blog-writer-siteclinic-publish.yml` (new — or update existing)
- `src/blog-writer/__tests__/` (contract test for the destination)

Files touched in `siteclinic-web` (when the workflow first runs):

- `data/blog/*.md` (where the publisher writes markdown)
- `data/blog/index.json` (the blog index that `/blog` page reads)

### Contract specification

#### Payload / schema

Each blog post is one markdown file with frontmatter:

```markdown
---
slug: "monitoring-vs-operations"
title: "Monitoring vs operations — where Site Clinic actually operates"
description: "..."  # 50–160 chars per gate:seo
publishedAt: "2026-05-12"
author: "John Liddy"  # canonical form per feedback_founder_name_canonical_form.md
heroImage: "/images/blog/monitoring-vs-operations.jpg"
heroImageAlt: "..."
tags: ["monitoring", "operations", "platform"]
---

Article body in markdown.
```

`data/blog/index.json` is a derived index updated by the publisher:

```json
{
  "lastUpdated": "2026-05-12T08:13:00Z",
  "posts": [
    { "slug": "monitoring-vs-operations", "title": "...", "publishedAt": "2026-05-12" }
  ]
}
```

#### Image requirement

The publisher must include a hero image referenced in `heroImage`. Per `MEMORY.md` (book-blog visual provenance policy): blog posts without an approved hero image fail readiness. Apply the same rule here — siteclinic-web's blog renderer fails the post if `heroImage` is missing or the file isn't checked in.

#### Idempotency

Each scheduled run carries:
- `jobKey` — unique per scheduled run (e.g., `siteclinic-blog-2026-05-12-tue`)
- `idempotencyKey` — derived from jobKey + post slug
- `correlationId` — for tracing across logs

If the same `idempotencyKey` is presented again, the publisher must return `duplicate-skipped` and NOT create a second commit. This matches the existing `blog-writer-ada` contract.

#### Cross-repo commit mechanics

Use GitHub Actions in `site-monitor`:

```yaml
# .github/workflows/blog-writer-siteclinic-publish.yml
name: blog-writer-siteclinic publish
on:
  workflow_dispatch:
    inputs:
      jobKey: { required: true, type: string }
      idempotencyKey: { required: true, type: string }
      correlationId: { required: true, type: string }
      targetDate: { required: true, type: string }
permissions:
  contents: read
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout site-monitor
        uses: actions/checkout@v4

      - name: Generate post (using existing blog-writer pipeline)
        run: |
          # invoke existing src/blog-writer/lanes/siteclinic logic
          # output: posts/<slug>.md + posts/<slug>-meta.json

      - name: Checkout siteclinic-web (cross-repo)
        uses: actions/checkout@v4
        with:
          repository: drjliddy-max/siteclinic-web
          token: ${{ secrets.SITECLINIC_WEB_DEPLOY_TOKEN }}  # PAT with repo:write to siteclinic-web only
          path: siteclinic-web-checkout

      - name: Check idempotency + commit
        run: |
          # If posts/<slug>.md already exists with matching idempotencyKey
          # in commit message, exit 0 with "duplicate-skipped"
          # Otherwise: copy generated post + index update, commit, push

      - name: Write proof file
        run: |
          # Append to site-monitor's .siteclinic/automation/blog-writer-siteclinic/proofs/
          # with the correlationId + sha of the destination commit
```

A `SITECLINIC_WEB_DEPLOY_TOKEN` secret is required — a fine-grained PAT scoped only to `drjliddy-max/siteclinic-web` with `Contents: read+write` permission. Created via GitHub UI, stored as a site-monitor repo secret.

### Publish verification command

Run after each scheduled job:

```bash
# In site-monitor
node --import tsx scripts/verifyBlogPublishSiteclinic.ts --jobKey <jobKey> --correlationId <correlationId>
```

Verifier checks:
1. Proof file exists at `.siteclinic/automation/blog-writer-siteclinic/proofs/<correlationId>.json`
2. Proof file contains the destination commit SHA
3. Querying GitHub API: that commit exists in `drjliddy-max/siteclinic-web` `main`
4. The file `data/blog/<slug>.md` exists in that commit
5. The hero image referenced in frontmatter exists in that commit
6. Site Monitor sees the published page within 10 minutes (post-cutover, when GA4 + sitemap pings work)

If any step fails: alert via existing operator-notification path.

### Tests required in the PR

- Unit: idempotencyKey collision returns `duplicate-skipped`, doesn't create second commit
- Unit: missing hero image rejects the post pre-commit
- Unit: PAT-less local run dry-runs cleanly (CI doesn't accidentally publish without auth)
- Integration: scheduled-run wires through to actions/workflow_dispatch and exits 0 with proof file written

### Verification before merge

1. Configure `SITECLINIC_WEB_DEPLOY_TOKEN` secret in site-monitor settings
2. Trigger workflow manually via `gh workflow run` with test inputs
3. Verify file appears in siteclinic-web repo + sitemap.xml updates + site renders correctly
4. Re-trigger with same idempotencyKey, verify "duplicate-skipped" exit
5. Trigger with new idempotencyKey, verify second post commits cleanly

### Rollback plan

If a bad post commits: operator rolls back via git revert in siteclinic-web repo. Vercel rebuilds, the post disappears. The publisher's idempotencyKey is preserved so it won't auto-retry. Manual operator action required to re-publish a fixed version (new idempotencyKey).

---

## PR brief #3 — Self-monitoring entry for siteclinic.io

### Title

`feat(clients): add siteclinic.io as a Site Monitor client (self-monitoring)`

### Background

Per `MIGRATION_PLAN.md` strategic plan §5 layer 4 (recursive dogfooding):

> *"Site Monitor monitors siteclinic.io the way it monitors a paying customer. Anything that breaks for Site Clinic is what would break for a customer — found by the operator before any customer sees it."*

After Phase 4b cutover, the new siteclinic-web deployment serves siteclinic.io and should be monitored by Site Monitor's own dashboard (the one the operator showed in the dashboard screenshot earlier in this session — 6 sites currently tracked). Adding siteclinic.io makes the 7th tracked site and closes the recursive-self-monitoring loop.

**This PR does NOT imply production cutover is complete.** Adding the entry IS preparation; the entry becomes active when DNS flips. Pre-cutover, the entry can be configured but will see the old site-monitor-served siteclinic.io until cutover.

### Scope

Files touched in `site-monitor`:

- `src/config/clients.ts` (new client row)
- `src/config/seoChecks.ts` or equivalent SEO config (add domain entry)
- `src/config/aiCrawlerHostMap.ts` or equivalent (AI crawler attribution mapping)
- GA4 host mapping config (add `siteclinic.io` if not already there — likely already is since site-monitor currently serves it)
- Search Console property tracking (add if not already)

Reference example to mirror: `liddy-podiatry-site` client row in the same config file. The dashboard already monitors Liddy Podiatry & Prevention, ADA Audit Report, Daily Rise, The Participation Effect, Baby Milestone Journal, and Site Clinic (the old one) — same pattern, new entry.

### Expected monitoring class

Tier the new entry as **internal-self-monitor** (or whatever existing tier names match). The site is NOT a paying customer; the dashboard should be able to distinguish "site we own" from "site a customer pays for" so:

- Internal-self-monitor sites do NOT count against any paid plan quota
- Internal-self-monitor sites do NOT trigger customer-billing webhooks
- Internal-self-monitor sites DO get all the same checks (uptime, SEO, security, ADA, performance, AI visibility) at the same cadence as paying customers

### Launch-state classification

Add a launch-state field to the client row indicating where in the lifecycle this site is:

```ts
{
  slug: "siteclinic-io-self",
  siteName: "Site Clinic (self-monitoring)",
  canonicalDomain: "siteclinic.io",
  contactName: "John Liddy",
  projectKey: "siteclinic",
  platform: "vercel",
  plan: "internal-self-monitor",
  createdAt: "2026-05-12",
  launchState: "pre-cutover",  // → "live" after Phase 4b cutover succeeds
  notes: "Recursive self-monitoring per strategic plan §5 layer 4. Pre-cutover the dashboard observes the OLD site-monitor-served siteclinic.io; post-cutover it observes the new siteclinic-web deployment.",
}
```

The launch-state field exists so dashboards can render appropriate status (e.g., "pre-cutover" entries don't flag old-site issues as new-site failures).

### Important — what this PR does NOT do

- Does NOT change DNS
- Does NOT trigger any production deploy of siteclinic-web (Track C)
- Does NOT verify the new site is correctly built (Track A)
- Does NOT verify cross-origin POSTs work (PR brief #1's job)
- Does NOT publish blog posts to the new repo (PR brief #2's job)

The entry being present in `clients.ts` is purely configuration. It activates real monitoring of the new site only after DNS cutover happens (Track C Phase 4b).

### Tests required in the PR

- Client config loads without error
- Dashboard renders the new entry without breaking other client rows
- Pre-cutover behavior: entry observes old siteclinic.io (current behavior preserved)
- Hostname-resolution logic handles `siteclinic.io` consistently between this new entry and any other code that references the domain

### Verification before merge

1. `npm run dev` in site-monitor — dashboard loads, new entry appears
2. Click the new client entry slug → dashboard renders scoped data (initially shows the OLD site since DNS hasn't flipped — that's correct pre-cutover state)
3. No regression in other client entries
4. SEO check fires for `siteclinic.io` on next scheduled run

### Rollback plan

Remove the client row, redeploy. No state has been written to any external system (Stripe, Search Console, GA4) by this PR alone, so removal is clean.

---

## Sequencing recommendation

Do the three PRs in this order:

1. **PR #1 (CORS)** — smallest scope, blocks Phase 4a staging verification of Stripe + waitlist flows. Highest priority.
2. **PR #3 (self-monitoring)** — config-only, no behavior change pre-cutover. Cheap, low-risk, sets up post-cutover observation. Can happen any time.
3. **PR #2 (cross-repo publisher)** — most complex, requires PAT setup and GitHub Actions workflow design. Can lag the others if siteclinic-web's `/blog` route isn't a Phase 1 cutover blocker (which it isn't — `/blog` isn't yet built in siteclinic-web Track A).

**PR #2 can defer until Track A reaches the `/blog` iteration** since there's no destination route to write to before then. PR #1 and PR #3 should be ready before any Track C staging happens.

---

## Phase 4a entry criteria (after Track B PRs merge)

Phase 4a (staging deploy + cross-origin round-trip verification) can begin when:

- ✅ Track A: siteclinic-web has at minimum `/`, `/pricing`, `/contact`, `/about`, `/case-studies`, legal trio — currently true (14 routes shipped)
- ⏳ PR #1 (CORS allowlist) merged and deployed to site-monitor production
- ⏳ PR #3 (self-monitoring entry) merged
- ⏳ PR #2 (cross-repo publisher) NOT a blocker for Phase 4a — only blocks `/blog` cutover

Operator drives Track C (Phase 4a + Phase 4b). Agent can prepare repo + Vercel project scaffolding but must NOT execute the production-touching steps without per-step approval.

---

## Document maintenance

Update this doc when:
- A new operator-action item emerges during Track A cherry-pick (e.g., a page references a third site-monitor endpoint that needs CORS)
- A PR brief above lands and merges (mark as DONE with date + commit SHA)
- The launch-state model evolves and the self-monitoring entry shape needs updating

When operator says "PR #X merged" for any of these, mark the corresponding PR brief as `STATUS: MERGED (yyyy-mm-dd, <sha>)` at the top of that brief's section.
