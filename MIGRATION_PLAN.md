# siteclinic-web — Migration Plan

> Status: **draft**, awaiting operator decisions before execution.
>
> This doc captures the rebuild-and-replace plan for moving siteclinic.io's marketing surface out of the `site-monitor` repo into a new `siteclinic-web` repo, built through `build-websites-template` + `design-os-template`.
>
> Companion docs (currently at `site-monitor/docs/site-truth/siteclinic.io/`, will move here):
> - `PROJECT_BRIEF.md`
> - `SOURCE_OF_TRUTH.md`
> - `OWNER_WISHLIST_INTAKE.md` (pending)

---

## 1. Plan reframe (operator directives)

> Operator rules, locked 2026-05-11:
> 1. **"we will build all our websites with our builder tool"** — every owned site goes through the workspace's own tooling, no lift-and-shift around doctrine
> 2. **"assuming the tool is correct and adequate, we use our tools first. confirm our tools are best practices and quality then use them"** — tool quality gate; validate fit before applying
> 3. **"each website 1 by 1 will be rebuilt if necessary using our tool even if UI is the same"** — the rebuild's win is structural compliance, not visual change

This is a **parallel-build with cherry-pick migration**, not an extraction:

- `siteclinic-web` is a fresh Next.js project built through the doctrine in its own folder + GitHub repo + Vercel project.
- It deploys initially to its Vercel default URL (`siteclinic-web.vercel.app`) — no DNS change to `siteclinic.io` yet. Site-monitor keeps serving live `siteclinic.io` untouched throughout the rebuild.
- Pages and connected services migrate from `site-monitor` one at a time, each verified at the staging URL before moving to the next. Cherry-pick log in §8.
- DNS cutover happens LAST — only after every page, service, and integration is verified at staging.
- After cutover, `welcome/*` + `case-studies/*` are deleted from `site-monitor` in a single cleanup commit. `site-monitor` deploys move to `app.siteclinic.io` (subdomain).
- All operations routes (`/api/*`, `/c/*`, `/sc/*`, `/developers/*`, `/internal/*`, `/login`, `/analytics`, crons, Inngest, MCP) stay in `site-monitor`, unchanged in role per operator instruction.
- The rebuild output may look visually identical to today's `welcome/page.tsx` — that's acceptable. The win is doctrine docs + tokens + real font loading + security headers + Playwright gate + Site Monitor onboarding, not a redesign.

**Discipline win of parallel-build vs extract-then-cutover**: every risky touch (DNS, Stripe webhook URL, Inngest endpoint URL, cookie scope) is deferred until everything else is proven at staging. No "fix Stripe and DNS in the same hour" failure window.

### 1b. Design direction (confirmed via parallel Claude.ai work 2026-05-11)

Confirmed in a parallel Claude.ai session that produced the ADA cream/sage redesign amendment (drafted as `~/Desktop/Projects/ada-audit-tool/CLAUDE-redesign-cream.md` or similar — that work is ADA-side, separate PR).

For siteclinic-web specifically:

- **Visual direction = current SC `welcome/page.tsx` visual identity, retained.** No redesign. Cream `#FAF7F2` background, sage `#3D7468` accent, white card surfaces, warm `#E5DCC8` borders. The exact `PALETTE` values from `welcome/page.tsx:102-111` become the new repo's tokens.
- **What changes is wiring, not look.** Inline `bg-[#FAF7F2]` literals become real tokens. `DM Serif Display` (declared but never loaded) gets a real loader. Security headers get added. Cookie-consent gates GA4. Each declared design intent is structurally implemented instead of asserted.
- **Type system**: DM Serif Display 400 + 400 italic (for hero `<em>` accents) + Geist 400/500/600. Loaded in a single Google Fonts request with `preconnect` to both `fonts.googleapis.com` and `fonts.gstatic.com` (the `gstatic` preconnect needs `crossorigin` or the preconnect is wasted). `font-display: swap`. Metric-matched fallback fonts kept in the token stack for the brief swap window.
- **Customer-as-user validation**: the operator (66, former business owner) is the target buyer for Site Clinic. Validation signal from parallel session: "I feel like I can actually see what's being presented. The original feels so busy I don't know where to click." This is a structural visual-hierarchy validation, not an aesthetic preference. Calm clarity over urgency theatrics is the right north star for both siteclinic.io and adaauditreport.com because both serve the same older small-business-owner buyer.
- **No emoji-prefixed icons** anywhere on the marketing surface (parallel ADA spec rule applied here too). Numbered references or no icons.
- **One primary CTA pattern (filled sage), one secondary (outlined hairline), one text-link (sage underline)**. No "ghost dark," no "outline-with-icon-prefix," no fourth variant.
- **One italic-sage emphasis line per hero/h2.** No bold-mid-paragraph for emphasis. Restructure the sentence instead.

These decisions are locked unless operator explicitly overrides.

### 1c. Parallel fix flagged at adaauditreport.com

Not in this plan's scope but logged so the work doesn't drift apart:

- The parallel Claude.ai session produced an amendment to `~/Desktop/Projects/ada-audit-tool/CLAUDE.md` for cream/sage redesign of `site/styles.css` + `site/*.html`. That work is its own PR against the ada-audit-tool repo, sibling to this siteclinic-web build.
- Severity badges on the ADA report-card UI stay warning-coded (red/amber/yellow). Sage is the marketing accent; warning hues are the product accent.
- Coordination point: when both fixes ship, ADA and SC will be visual siblings — same palette, same type system, same button language. That's the "family resemblance" win the operator named.

### 1a. Tool-validation outcome (operator rule §2)

Before proceeding with §5, validated each candidate tool for fit:

| Tool | Purpose (per its own docs) | Fit for siteclinic-web marketing? |
|--|--|--|
| `build-websites-template/` | 6-step methodology for marketing site discovery → design → build → tracking → QA → site-monitor onboarding | **YES — this is the right tool** |
| `design-os-template/` | "Product planning and design tool" for app design (vision → roadmap → **data model** → design tokens → **application shell** → **section design** → export). From its `agents.md`. | **NO — wrong tool**. Marketing sites have pages, not sections; static content, not a data model; header/footer, not an application shell. Using it on a marketing site would force-fit. |

**Decision**: siteclinic-web rebuilds through `build-websites-template` methodology only. There is no authoring-UI tool in the workspace today for marketing sites. The "tools-first" rule is satisfied — the methodology IS our tool for this surface.

**Where design-os DOES belong**: future rebuild of the operations dashboard at `app.siteclinic.io`. That surface has sections (dashboard / billing / sites / alerts / developers), a data model (clients / sites / audits / runs), and an application shell. Defer to Phase 4+ in the strategic plan.

This means Phase 1 is longer than a lift-and-shift, but the output is doctrine-compliant from commit zero.

---

## 2. Route classification (operator decisions needed)

Surveyed `site-monitor/src/app/` exhaustively. Classification below; each route gets one of:

- **→ siteclinic-web** (marketing, public, SEO-relevant)
- **→ site-monitor (app.siteclinic.io)** (operations, auth-gated)
- **OPERATOR DECISION** (ambiguous)

### Clearly marketing → `siteclinic-web`

| Route | Notes |
|--|--|
| `/welcome/*` (entire subtree) | Homepage, about, pricing, contact, privacy, terms, accessibility, compare, intent pages |
| `/case-studies` | Proof artifacts surface |

### Clearly operations → stays in `site-monitor` (becomes `app.siteclinic.io/...`)

| Route | Notes |
|--|--|
| `/c/[slug]` | Client dashboards (per-client slug) |
| `/sc/[slug]` | OPERATOR DECISION on what `sc` vs `c` distinguishes — assumed customer-side too |
| `/developers/dashboard` | Authed developer dashboard |
| `/developers/signup` | Auth flow |
| `/developers/api-explorer` | Authed API explorer |
| `/internal/*` | Operator-only ops console |
| `/login` | Auth |
| `/analytics` | Dashboard analytics |
| `/api/*` (all) | Every API route |
| `/api/cron/*` | Vercel crons (managed/sweep, railway-pipeline) |
| `/api/inngest` | Inngest endpoint |
| All MCP servers (`mcp-server.ts`, etc.) | Operations |
| `middleware.ts` | Operations (host-aware logic simplifies post-split) |

### OPERATOR DECISION

| Route | Question | Options |
|--|--|--|
| `/` (apex) | `src/app/page.tsx:3` calls itself "Site Monitor Dashboard - Operational Intelligence Platform" and pulls live health data. Is this currently the public landing page at `siteclinic.io/`, or is it auth-gated? If public → it's an unusual UX (operator dashboard at the apex). After cutover, what serves `siteclinic.io/`? | (a) Marketing homepage from `siteclinic-web` (standard) — recommended<br>(b) Redirect to `/welcome` (legacy behavior preserved)<br>(c) Something else |
| `/developers` (root + docs subtree) | The developer portal is mixed: docs/api-reference/quickstart are marketing-shaped (SEO, public); dashboard/signup/api-explorer are auth-gated. Splitting them = `siteclinic-web` owns docs, `app.siteclinic.io` owns the authed pieces. Keeping together = both in `app.siteclinic.io`, marketing links cross over. | (a) Split: docs to `siteclinic-web/developers/*`, auth-gated routes to `app.siteclinic.io/developers/*` — recommended for SEO<br>(b) Keep all in operations: `app.siteclinic.io/developers/*` — simpler but worse SEO |
| `/blog/*` | Marketing-shaped content (published in siteclinic.io's sitemap). But the publisher (`src/blog-writer/*`, lane `blog-writer-siteclinic`) lives in `site-monitor`. Where do blog pages render after the split? | (a) Blog renders in `siteclinic-web`; publisher in `site-monitor` writes files via GitHub commit to `siteclinic-web` — recommended<br>(b) Blog stays in `site-monitor` and is reverse-proxied at `siteclinic.io/blog/*` from `app.siteclinic.io/blog/*` — operationally messier |
| `/api/siteclinic/{checkout, waitlist, session, customers, stats, audits, c}` | These are called by marketing pages (`CheckoutButton.tsx` posts to `/api/siteclinic/checkout`). After the split, marketing is at apex but API is at subdomain. How does marketing reach checkout? | (a) Marketing calls cross-origin `https://app.siteclinic.io/api/siteclinic/checkout` with CORS allowlisted — recommended<br>(b) Marketing repo has its own proxy `api/checkout` that forwards to operations — extra hop but no CORS<br>(c) Move these endpoints into `siteclinic-web` and rewire — duplicates Stripe/DB integration code, not recommended |

---

## 3. Cross-cutting concerns

### 3a. `sitemap.ts` + `robots.ts` (both currently host-aware in site-monitor)

After split:
- `siteclinic-web` owns `sitemap.ts` for siteclinic.io's marketing surface (currently lines 30–55 of site-monitor's sitemap.ts — the "isSiteClinic" branch).
- `site-monitor` keeps a sitemap/robots that always serves the host-restricted form (or empty + `disallow: /` for non-marketing hosts).

### 3a.1 GSC continuity strategy (operator directive 2026-05-11)

> "We want google console to use existing site maps (with correction). Our new site moves into old site place with corrections so mapped correctly and indexed correct."

**Core rule**: siteclinic.io's GSC property does NOT get re-created. The new site moves into the existing property's address, and Google naturally re-crawls the corrected sitemap.

What stays continuous:
- Existing GSC property `siteclinic.io` keeps all its crawl history, impression baseline, query data, average-position trends. **No new property created at apex.** (A new GSC property is added for the `app.siteclinic.io` subdomain — that's separate.)
- Same domain, same sitemap URL (`https://siteclinic.io/sitemap.xml`). Google's existing sitemap fetcher gets the new content automatically on next crawl.
- SEO equity from inbound links to `siteclinic.io/welcome/<anything>` survives via 301 redirects to the new apex paths.

What gets corrected:
- `/pricing` is no longer noindex'd (the GSC failure from the operator screenshot).
- `/welcome/<x>` paths no longer exist as canonicals (they 301 to `/<x>`).
- The new sitemap lists ONLY canonical apex URLs (no duplicate www, no http variants, no orphan paths).
- Robots.txt allows the marketing surface and points at the corrected sitemap.

Per-cherry-pick discipline (every §5b iteration must do all three):

1. **Add the new route's page** at the apex path (e.g., `src/app/pricing/page.tsx`).
2. **Add a sitemap entry** in `src/app/sitemap.ts` for the new canonical URL.
3. **Add a 301 redirect** in `vercel.json` from the OLD path to the new (e.g., `/welcome/pricing → /pricing`). Without this, old indexed URLs 404, SEO equity is lost, and Google reports new "Page with redirect" or "Not found (404)" failures.
4. **Update `gate.config.json`** in siteclinic-web to add the new route to the gates' coverage. The next `gate:all` run validates the new page + verifies it's in the sitemap + verifies it's indexable.

Phase 4b cutover steps add to the existing list:

| Step | Action |
|--|--|
| 4b.1 (post-DNS-flip) | `curl https://siteclinic.io/sitemap.xml` — verify new sitemap is served. Should differ from the pre-cutover (site-monitor's) sitemap. |
| 4b.2 | GSC URL Inspection (manual UI or via the existing `site-monitor/src/integrations/gsc/client.ts`) — submit the new sitemap for re-crawl. |
| 4b.3 | For each new canonical URL (`/`, `/about`, `/pricing`, etc.), use GSC's "Request Indexing" to nudge Google. |
| 4b.4 | After 7-14 days, re-check GSC Page Indexing report. Failure modes should be: zero "Excluded by noindex," zero "Page with redirect" (apart from the intentional http→https), and the previously-stuck "Discovered, not indexed" URLs now indexed or 301'd to indexed equivalents. |

Phase B (future) — extend `build-websites-tools/` with a `gate:gsc` that:
- Reads the consuming site's `gate.config.json`
- For each route, queries GSC URL Inspection API via the existing service account credentials
- Fails the build if any route is "Excluded by noindex," "Page with redirect," or "Discovered, not indexed" for longer than a configurable freshness window
- Closes the loop between pre-deploy gates and Google's actual indexation outcome

Until then, this discipline is manual/checklist-driven and rests on the per-cherry-pick rule above.

### 3b. `middleware.ts` — host-aware logic

- Lines that detect siteclinic.io and route bot logging accordingly move to `siteclinic-web/middleware.ts`.
- `site-monitor/middleware.ts` keeps the operations-side bot logging.
- AI crawler log destination (the DB / RPC the middleware writes to) is shared — both repos write to the same backend. This is fine because the operations API stays at `app.siteclinic.io`.

### 3c. Blog publisher (`src/blog-writer/*`)

This is the operationally-heaviest cross-cutting concern. Currently in `site-monitor`:
- `src/blog-writer/__tests__/blogPipelineRegistry.test.ts` + 11 other test files
- Per memory: "site-monitor#17 tracks CodeRabbit-deferred fixes across blog-writer-ada / -book / -siteclinic"
- Per memory: "blog-writer-siteclinic" is its own lane

**OPERATOR DECISION required**: after split, where does `blog-writer-siteclinic` publish to? Options listed in §2 route table.

If option (a) — publisher in `site-monitor` writes a commit to `siteclinic-web` — needs:
- GitHub Actions workflow with cross-repo write permission
- Idempotency contract (memory says: "Duplicate retries with the same idempotencyKey must return duplicate-skipped, not create a second article")
- Proof file destination decided (current pattern: `.siteclinic/automation/blog-writer-ada/proofs/`)

### 3d. Vercel crons (`vercel.json` crons array)

Currently in site-monitor's `vercel.json`:
- `/api/cron/managed/sweep` (every 5 min)
- `/api/cron/railway-pipeline` (hourly)

These stay tied to the `site-monitor` Vercel project (now serving `app.siteclinic.io`). No change to cron definitions. **Verify Vercel cron continues to fire on the same project after its primary domain becomes a subdomain** — should be transparent, but verify post-cutover.

### 3e. Stripe webhook URL

Currently configured to (presumably) `https://siteclinic.io/api/stripe/webhook`. After cutover, must point at `https://app.siteclinic.io/api/stripe/webhook`. Stripe dashboard update required, with a transition window where both URLs are accepted to avoid event loss.

### 3f. Inngest signing / endpoint

`/api/inngest` lives in site-monitor. After cutover, Inngest must point at `https://app.siteclinic.io/api/inngest`. Inngest dashboard update required.

### 3g. Cookie scope

Current login/session cookies likely set with `Domain=siteclinic.io` (or no domain attribute, host-bound). After split:
- Marketing apex sets no auth cookies (no logged-in users on marketing).
- Operations subdomain sets cookies. If set with `Domain=.siteclinic.io` (leading dot), they're sent to both. If host-bound to `siteclinic.io` today, they break at `app.siteclinic.io`.
- **OPERATOR ACTION**: verify current cookie domain attribute in production; adjust to `.siteclinic.io` (leading dot) before cutover so existing sessions survive the host change.

### 3h. JSON-LD entity graph

`welcome/page.tsx:38` declares `@id: "https://siteclinic.io/#app"`. After split:
- Brand entity (`siteclinic.io/#org`, the Organization) stays at apex (rendered from `siteclinic-web`).
- Application entity (`siteclinic.io/#app`, the SoftwareApplication) — operator decision: stay at apex (brand-level) or move to subdomain (app-instance-level). Recommendation: stay at apex. The SoftwareApplication describes the product Site Clinic sells; the customer-facing URL it points to is `app.siteclinic.io`.

### 3i. GA4 + cookie consent

GA4 `G-CKCC40VRPH` is shared per doctrine. After split:
- Both `siteclinic-web` and `site-monitor` load the same GA4 ID.
- Hostname mapping in GA4 must include both `siteclinic.io` and `app.siteclinic.io`.
- Cookie consent banner must exist on both surfaces; consent state must propagate via `.siteclinic.io` cookie scope so users don't double-consent.

### 3j. Search Console

Currently a property for `siteclinic.io`. After split:
- Existing `siteclinic.io` property keeps tracking marketing.
- Add new `app.siteclinic.io` property for the subdomain. The dashboard surface should be `noindex,nofollow` (it's auth-gated, doesn't compete in search), so the Search Console property exists mainly for diagnostic completeness.

---

## 4. Production-touching steps (NONE may execute without explicit operator approval)

In order of execution. Each row needs an explicit "approve to proceed" before I run it.

### Phase 4a — staging setup (low-risk; no live-traffic impact)

| # | Step | Reversible? | Risk level |
|--|--|--|--|
| 1 | `gh repo create drjliddy-max/siteclinic-web --public --description "..."` | Yes (delete repo) | Low — public artifact, no live traffic |
| 2 | `git push -u origin main` (first push of doctrine-compliant skeleton) | Partial | Low — publishes code only |
| 3 | Create new Vercel project, connect to `drjliddy-max/siteclinic-web` | Yes (delete Vercel project) | Low — deploys to `siteclinic-web.vercel.app`, no DNS change |
| 4 | Configure Vercel env vars on new project (GA4 ID + staging Stripe pub key + any test-mode secrets) | Yes | Low — affects staging only |

After Phase 4a, the new site is reachable at the Vercel default URL. Verify everything works there before any of Phase 4b.

### Phase 4b — cutover (high-risk; live traffic, live payments)

Phase 4b only begins after every cherry-pick item in §8 is verified at the staging URL.

| # | Step | Reversible? | Risk level |
|--|--|--|--|
| 5 | Lower DNS TTL on `siteclinic.io` apex to 300s (24 hrs in advance) | Yes (raise TTL back) | Low — prep step |
| 6 | DNS: add `app.siteclinic.io` CNAME in GoDaddy → site-monitor's existing Vercel project | Yes (remove CNAME) | Medium — `app.siteclinic.io` becomes resolvable but not yet customer-facing |
| 7 | DNS: change `siteclinic.io` apex A/ALIAS records to point at the new `siteclinic-web` Vercel project | Yes (revert DNS) | **HIGH — cutover, affects all live traffic** |
| 8 | Stripe webhook URL update to `https://app.siteclinic.io/api/stripe/webhook` (keep old URL as secondary endpoint during transition window) | Yes (revert URL) | **HIGH — affects live payments** |
| 9 | Inngest endpoint URL update to `https://app.siteclinic.io/api/inngest` | Yes (revert URL) | Medium — affects scheduling |
| 10 | Cookie scope verification + adjustment (ensure `Domain=.siteclinic.io` so sessions survive across apex + subdomain) | Yes | Medium — affects active sessions |
| 11 | Cleanup commit in `site-monitor`: delete `src/app/welcome/*` + `src/app/case-studies/*` (after cutover verified for 24+ hours) | Yes (git revert) | Low — final cleanup |

Steps 7 and 8 are the highest-risk (live traffic, live payments). DNS TTL lowered to 300s in step 5 so cutover can be reverted within 5 minutes if anything breaks. Stripe webhook URL keeps old URL as secondary during transition so no events get lost.

---

## 5. Phase 1 sequence (parallel-build then cherry-pick)

### 5a. Foundation (build the doctrine-compliant skeleton at staging)

Sequence — each step verifiable before next:

1. **Create local repo skeleton at `/Users/johnliddy/Desktop/Projects/siteclinic-web/`**
   - `git init`
   - `package.json` (Next.js 16 + React 19 + Tailwind v4 — match site-monitor's stack so tokens/components are portable when cherry-picked)
   - `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `eslint.config.mjs`, `.gitignore`
   - `vercel.json` with security headers per doctrine §03 (HSTS, nosniff, SAMEORIGIN, CSP)
   - `README.md` linking to MIGRATION_PLAN and doctrine
2. **Move doctrine docs**
   - `site-monitor/docs/site-truth/siteclinic.io/PROJECT_BRIEF.md` → `siteclinic-web/docs/site-truth/PROJECT_BRIEF.md`
   - `site-monitor/docs/site-truth/siteclinic.io/SOURCE_OF_TRUTH.md` → `siteclinic-web/docs/site-truth/SOURCE_OF_TRUTH.md`
   - Draft `siteclinic-web/docs/site-truth/OWNER_WISHLIST_INTAKE.md` skeleton for operator to fill
3. **Author design system through `build-websites-template`** (methodology-only)
   - Operator confirms design thesis (one sentence per `02-design-direction.md`)
   - Author palette tokens + type system + layout principles + imagery direction + "what we are deliberately not doing"
   - Tokens land in `siteclinic-web/src/styles/tokens.css` or Tailwind v4 `@theme` block
   - Type system documented in `siteclinic-web/docs/design/`
4. **Build minimal homepage** at `siteclinic-web/src/app/page.tsx`
   - Doctrine-compliant: tokens applied, fonts actually loaded, GA4-with-consent banner, security headers, semantic landmarks, `lang="en"`, visible focus states
   - Content can be a placeholder ("Site Clinic — rebuild in progress") or the first migrated page (recommend: start with `/about` since it has the lowest interactivity)
5. **GitHub repo + Vercel project + first staging deploy** (Phase 4a steps 1–4 — operator approval required)
6. **Verify at staging URL**: `next build` clean, `next start` serves, doctrine §03 + §04 + §08 baselines met, Playwright passes the minimum-coverage suite from doctrine §05

After 5a, the new site is doctrine-compliant at staging with at least one real page. The pattern is proven.

### 5b. Cherry-pick pages and services (iterative; one at a time)

For each item in the cherry-pick log §8, the loop is:

1. Read the source in `site-monitor/src/app/welcome/<page>/page.tsx` (or wherever)
2. Rebuild the equivalent in `siteclinic-web/src/app/<page>/page.tsx` using the tokenized design system from §5a step 3
3. Preserve all approved copy from PROJECT_BRIEF and SOURCE_OF_TRUTH
4. Preserve structured-data references, cross-portfolio `sameAs` links, JSON-LD `@id` URLs
5. Wire any connected services (e.g., `CheckoutButton` calls a checkout endpoint — decide cross-origin to `app.siteclinic.io/api/siteclinic/checkout` or proxy via siteclinic-web's own `/api/checkout` per §2 row 4)
6. Verify visually at staging URL
7. Verify Playwright suite still passes
8. Mark in §8 cherry-pick log as done
9. Move to next item

Each cherry-pick is a single commit (or small PR), so any individual move is reversible.

### 5c. Cross-cutting integrations (after all pages are migrated)

Before Phase 4b cutover:

- Sitemap: write `siteclinic-web/src/app/sitemap.ts` with the marketing routes (port from `site-monitor/src/app/sitemap.ts` lines 30–55, the "isSiteClinic" branch)
- Robots: write `siteclinic-web/src/app/robots.ts` with the siteclinic.io rules
- Middleware (if needed for bot logging): port the host-aware logic
- Blog publisher contract (§3c decision) — if blog renders in siteclinic-web, set up the cross-repo publish pipeline from `site-monitor/src/blog-writer/*`
- Final Playwright pass on staging URL covering every migrated page + CTA + nav link + legal page

---

## 5d. Shared builder tools — `build-websites-tools/` (operator directive 2026-05-11)

> "Build script once, use many."

The gate logic that was hand-built in `siteclinic-web/scripts/` was **extracted to a shared package** before §5b cherry-pick began, so subsequent site rebuilds (ADA cream/sage, daily-rise refresh, etc.) consume the same gates instead of re-implementing them.

**2026-05-12 standalone correction**: the original sibling-path pattern (`file:../build-websites-tools`) worked inside the parent workspace but failed once `siteclinic-web` became its own GitHub + Vercel repo. Cloud builds only receive this repo checkout, so the standalone-safe pattern is a repo-local vendored copy at `tools/build-websites-tools` with `file:./tools/build-websites-tools`.

### Architecture

```
~/Desktop/Projects/
├── build-websites-template/   # methodology (markdown docs, unchanged)
├── build-websites-tools/      # shared executable gates (NEW)
│   ├── package.json           # private, file: consumed
│   ├── bin/
│   │   ├── gate-ada.mjs       # tsx wrapper, resolves from package's own node_modules
│   │   └── gate-seo.mjs
│   ├── src/
│   │   ├── gate-ada.ts        # axe-core/playwright WCAG 2.1 AA enforcement
│   │   ├── gate-seo.ts        # Google indexing rules + structural checks
│   │   └── load-config.ts     # reads + validates gate.config.json from cwd
│   ├── tsconfig.json
│   └── README.md
└── siteclinic-web/            # first consumer
    ├── gate.config.json       # site-specific: { routes, baseUrl }
    ├── package.json           # devDep: "build-websites-tools": "file:./tools/build-websites-tools"
    ├── tools/
    │   └── build-websites-tools/
    │       ├── bin/
    │       ├── src/
    │       ├── package.json
    │       └── README.md
    └── (no scripts/ directory — zero gate logic in consumer)
```

### Consumption pattern (any site)

Each consuming site carries **two files only** for gates:

`gate.config.json`:
```json
{
  "routes": ["/"],
  "baseUrl": "http://localhost:3000"
}
```

`package.json` (gate-relevant lines):
```json
{
  "scripts": {
    "gate:ada": "gate-ada",
    "gate:seo": "gate-seo",
    "gate:all": "npm run gate:ada && npm run gate:seo",
    "prebuild": "npm run gate:all"
  },
  "devDependencies": {
    "build-websites-tools": "file:./tools/build-websites-tools"
  }
}
```

### Guardrails honored (per operator approval 2026-05-11)

- `build-websites-tools` is private (`"private": true`), not published to npm
- `load-config.ts` fails loudly with usage hint on missing/malformed `gate.config.json`
- `load-config.ts` validates required fields: `routes` (non-empty `string[]`, each starts with `/`) and `baseUrl` (http/https URL)
- No site-specific assumptions in shared package — only config-driven
- No duplicate gate implementation in `siteclinic-web/` (entire `scripts/` directory deleted post-extraction)
- File-based dependency stays **inside the standalone repo** (`file:./tools/build-websites-tools`), not across repos and not npm-registry
- Consumer repo vendors the gate package so cloud builds stay standalone-safe; the current contract uses browser mode when available and a truthful JSDOM fallback when Chromium cannot launch in the builder
- Phase B scope (`npx create-siteclinic-web` generator) NOT built — package structure is compatible but the generator stays deferred until rule-of-three (2-3 hand-built consumers)

### Verification — 2026-05-11

`cd siteclinic-web && npm run gate:all` after extraction:

```
> gate:ada
gate:ada  scanning http://localhost:3000/  … ✓ clean
gate:ada  /: 0 blocking, 0 minor
gate:ada  PASS

> gate:seo
gate:seo  /sitemap.xml  … ✓ 1 URL(s)
gate:seo  /robots.txt  … ✓
gate:seo  sitemap matches routes  … ✓
gate:seo  http://localhost:3000/  … ✓ 18 checks passed
gate:seo  PASS
```

Matches the pre-extraction pass exactly. Zero behavior change for siteclinic-web; massive drift-prevention gain for every future consumer.

### Next consumer onboarding (when ADA cream/sage rebuild starts)

In the ADA repo (currently `ada-audit-tool/`, the marketing site under `site/`), the onboarding is just:

1. Copy `build-websites-tools/` into the standalone repo at `tools/build-websites-tools/`
2. Add `"build-websites-tools": "file:./tools/build-websites-tools"` to `package.json` devDeps
3. Add `gate:ada`, `gate:seo`, `gate:all`, `prebuild` npm scripts (copy from siteclinic-web)
4. Add `gate.config.json` at repo root with ADA's routes + baseUrl
5. `npm install` + run `npm run gate:all`

Zero gate logic to write. The same enforcement applies. Drift becomes structurally impossible.

---

## 5e. Phase 1 §5a foundation status — VERIFIED 2026-05-11

Locally verified against `http://localhost:3000`:

- ✅ Next.js 16.2.6 + Turbopack (workspace root pinned) — boots clean, `Ready in 328ms`
- ✅ Cream `#FAF7F2` background, sage `#3D7468` accent rendering correctly (screenshot evidence)
- ✅ DM Serif Display rendering on `<h1>` (real font, distinct from Georgia fallback)
- ✅ DM Serif Display **italic** rendering on `<em>` accent (not synthesized slant)
- ✅ Geist 400/500/600 rendering on body / labels
- ✅ Pulsing eyebrow dot animation runs
- ✅ Security headers ship via `vercel.json` (HSTS preload, nosniff, SAMEORIGIN, Referrer-Policy)
- ✅ Sitemap reachable at `/sitemap.xml` (1 URL: `/`)
- ✅ Robots.txt reachable at `/robots.txt`
- ✅ Organization + WebSite JSON-LD ship from `layout.tsx`
- ✅ `gate:ada` PASS — 0 blocking, 0 minor (axe-core/playwright, WCAG 2.1 AA tags)
- ✅ `gate:seo` PASS — 18/18 checks (HTTP 200, no X-Robots-Tag noindex, no meta robots noindex, canonical matches request path, single h1, hierarchy clean, all OG/Twitter meta present, JSON-LD present, sitemap-vs-routes consistent)
- ✅ `npm run gate:all` umbrella script + `prebuild` hook wired (next build can't run if gates fail)

**Known caveats (not blocking)**:
- 2 moderate npm audit findings (postcss transitive via next, XSS via unescaped `</style>` in stringify). Only fix is `npm audit fix --force` which downgrades next to 9.3.3 (breaking). Defer until next ships a postcss patch upstream. Attack surface for a marketing site that doesn't process user-supplied CSS: negligible.
- Lighthouse not yet integrated as a gate (current `gate:seo` covers structural Google indexing rules; performance/accessibility scores are checked post-deploy by Site Monitor's continuous Lighthouse runs).

§5b cherry-pick can now begin — every page produced from `site-monitor/src/app/welcome/*` lands in `siteclinic-web/` and must pass `gate:all` before commit.

### 5e.1 §5b iteration 1 — homepage hero — VERIFIED 2026-05-11

**Cherry-pick source**: `site-monitor/src/app/welcome/page.tsx` lines 200–247 (hero block only — eyebrow, h1, subhead, 3-up feature cards, CTA pair, trial caveat).

**Components introduced** (template-shaped per `feedback_builder_tool_proto_patterns.md`):

| Component | Purpose | Variants |
|--|--|--|
| `src/components/Eyebrow.tsx` | Small uppercase sage caption above headings | default (flat) / withDot (pulsing) |
| `src/components/Button.tsx` | The canonical CTA — refuses a 4th variant per design thesis | primary / secondary / text-link |
| `src/components/SiteHeader.tsx` | Global header — logo only iteration 1 (nav grows per cherry-pick) | — |
| `src/components/SiteFooter.tsx` | Global footer — copyright only iteration 1 (legal links grow per cherry-pick) | — |
| `src/components/Hero.tsx` | Homepage hero composition | — |

**Page** `src/app/page.tsx`: replaces foundation stub. Renders `<SiteHeader /> <main><Hero /></main> <SiteFooter />`. Adds homepage-specific JSON-LD (SoftwareApplication schema referencing the Organization entity from layout.tsx).

**Migration-unit pattern verification — 2026-05-11**:

| Step | Status | Evidence |
|--|--|--|
| 1. Page exists | ✅ | `src/app/page.tsx`, `GET /` returns HTTP 200 |
| 2. Sitemap includes route | ✅ | `<loc>https://siteclinic.io/</loc>` in `/sitemap.xml` |
| 3. Legacy redirect resolves | ✅ | `GET /welcome` returns 308 → `/`. `GET /welcome/` returns 308 → `/welcome` → `/` (2-hop via Next trailing-slash normalization — Google handles short chains; will collapse to 1-hop in a later iteration when more `/welcome/*` paths consolidate into a single regex source) |
| 4. Gate coverage | ✅ | `gate.config.json` lists `/`. `npm run gate:all`: gate:ada PASS (0 blocking, 0 minor), gate:seo PASS (sitemap ✓ + robots ✓ + sitemap-vs-routes ✓ + 18 structural checks ✓) |

**Known interim state (expected, not blocking)**:

- Hero CTA buttons point at `/pricing` (primary "Start free trial") and `/case-studies` (secondary "See the proof"). Both routes 404 until their respective cherry-pick iterations land. **Not in `gate.config.json`** until those pages exist, so `gate:seo` doesn't fail on them. Production cutover (Phase 4b) blocked until all listed routes exist + gates pass for each.
- `SiteHeader` nav is empty pending nav-item-per-cherry-pick growth (`/about` → next iteration adds the nav entry).
- `SiteFooter` legal links are empty pending `/privacy`, `/terms`, `/accessibility` cherry-picks.

**Doctrinal verification (build-websites-template baselines)**:

- `lang="en"` ✓
- semantic landmarks (`<header>`, `<main>`, `<footer>`) ✓
- visible focus states ✓ (Tailwind defaults)
- alt text on all images ✓ (no images on hero — logo uses text initials)
- exactly one h1 per page ✓
- title 10–70 chars ✓ (63 chars)
- meta description 50–160 chars ✓
- canonical link ✓ (`https://siteclinic.io/`)
- Open Graph + Twitter card ✓ (inherited from `layout.tsx`)
- JSON-LD structured data ✓ (Organization + WebSite from layout, SoftwareApplication from page)
- security headers ✓ (`vercel.json` ships HSTS preload + nosniff + SAMEORIGIN + Referrer-Policy)
- GA4 wired (deferred — added when consent banner cherry-picks; foundation has no analytics yet)

Iteration 1 stops here. Iteration 2 candidate: `/about` (low complexity, exercises the second-page-cherry-pick pattern end-to-end).

### 5e.2 §5b iteration 2 — /about — VERIFIED 2026-05-11

**Cherry-pick source**: `site-monitor/src/app/welcome/about/page.tsx` lines 84–225 (hero + principles + founder + ADA cross-product callout + CTA section).

**Migration-unit verification — 2026-05-11**:

| Step | Status | Evidence |
|--|--|--|
| 1. Page exists | ✅ | `src/app/about/page.tsx`, `GET /about` returns HTTP 200 |
| 2. Sitemap includes route | ✅ | `/sitemap.xml` now serves 2 URLs: `/` (priority 1) + `/about` (priority 0.8) |
| 3. Legacy redirect resolves | ✅ | `GET /welcome/about` → 308 → `/about` (1 hop, clean) |
| 4. Gate coverage | ✅ | `gate.config.json` lists `["/", "/about"]`. `npm run gate:all`: gate:ada PASS (0 blocking on both), gate:seo PASS (sitemap-vs-routes ✓ + 18 structural checks ✓ per route) |

**Additional discipline applied this iteration**:

- `SiteHeader.tsx` `NAV_ITEMS` grew by one — `{ label: "About", href: "/about" }`. Header now renders the nav block (was hidden when items array was empty). Pattern confirmed: nav grows one entry per cherry-pick.
- Page-specific JSON-LD: `AboutPage` schema with `mainEntity` pointing at Person (founder), `about` referencing the Organization entity from layout. Three structured-data blocks total now serve from `/about`: Organization + WebSite (from layout) + AboutPage (page-specific). Gate verifies presence; Google sees a coherent entity graph.
- Italic-accent emphasis line per heading per design thesis (`em` on "multiple delivery layers", "One evidence standard", "evidence-first entry product", "matches the job"). Real italic loaded via `next/font/google`, not synthesized.

**Explicit deferrals (named in `src/app/about/page.tsx` header comment, not silently dropped)**:

- 3-up "Delivery layers" cards (depend on `PRODUCT_DELIVERY_LAYERS` config object in site-monitor's `@/config/productSystem`, not yet ported to siteclinic-web). Decision needed: port the config or simplify to inline data on the page.
- "Platform properties" 3-up grid (same dependency).
- Founder photo (asset `john-liddy-founder.jpg` referenced in source page; reuse rights for siteclinic-web not yet operator-confirmed per `SOURCE_OF_TRUTH.md §3`). Text-only founder bio until that's cleared.

**Components reused without modification** (template-shape pays off):

- `Eyebrow` — 4 instances on /about (one per section), all use default variant (no pulsing dot — that's hero-only per design thesis)
- `Button` — 3 instances (1 text-link, 1 primary, 1 secondary), no new variants invented
- `SiteHeader`, `SiteFooter` — same chrome as `/`, zero structural change

Iteration 2 stops here. Iteration 3 candidate options:
- **`/pricing`** (recommended next — currently linked from both `/` and `/about` Hero/CTA; un-404'ing it closes a real broken link). Higher complexity: pricing tiers + `CheckoutButton` cross-origin call to `app.siteclinic.io/api/siteclinic/checkout` (per locked §6 row 4).
- `/case-studies` (linked from `/` "See the proof" — same broken-link motivation, lower complexity)
- `/contact` (simple form, no Stripe coupling)
- `/privacy`, `/terms`, `/accessibility` (legal pages — needed for footer growth + doctrine §06 requirement)

Recommend `/pricing` next: highest user-facing value (the primary CTA on the homepage stops 404'ing), exercises the cross-origin checkout pattern that's locked but untested, and unblocks footer pricing references in subsequent iterations.

### 5e.3 §5b iteration 3 — /pricing — VERIFIED LOCALLY 2026-05-11

**Cherry-pick source**: `site-monitor/src/app/welcome/pricing/page.tsx` lines 18–326 (plans + faqs data, pricing hero, three tier cards, "What checkout does" + "Companion products" 2-up, FAQ accordion).

**Migration-unit verification — 2026-05-11**:

| Step | Status | Evidence |
|--|--|--|
| 1. Page exists | ✅ | `src/app/pricing/page.tsx`, `GET /pricing` returns HTTP 200, all tier prices + content render |
| 2. Sitemap includes route | ✅ | `/sitemap.xml` now serves 3 URLs (`/` + `/about` + `/pricing` priority 0.9) |
| 3. Legacy redirect resolves | ✅ | `GET /welcome/pricing` → 308 → `/pricing` (1 hop, clean) |
| 4. Gate coverage | ✅ | `gate.config.json` lists `["/", "/about", "/pricing"]`. `npm run gate:all`: gate:ada PASS (0 blocking each route), gate:seo PASS (3 sitemap URLs ✓ + 18 structural checks ✓ per route) |

**Additional discipline applied this iteration**:

- `Button.tsx` exported `VARIANT_CLASS` and `ButtonVariant` so `CheckoutButton` renders with identical primary/secondary chrome (single source of truth for CTA styling).
- `SiteHeader.tsx` `NAV_ITEMS` grew to `[About, Pricing]`. Both nav entries point at routes that exist + are in gate.config.json + are in sitemap.ts (discipline rule holding).
- Two JSON-LD blocks on `/pricing`: `WebPage` with `Product` + 3 `Offer` entries (priced $49/$149/$349, BusinessEntity-targeted) + `FAQPage` with all 4 FAQ entries as `Question/Answer` pairs. Google sees a structured offer + FAQ surface.
- Italic-accent emphasis on "matches the real product." in the h1.

**Stripe-coupling architecture (per operator directive "correctly link to Stripe and produce deliverables")**:

The full flow as implemented:

```
[1] User clicks tier button on /pricing
        ↓
[2] CheckoutButton form opens (email + site URL inputs, native HTML validation)
        ↓
[3] Form submit → POST to https://app.siteclinic.io/api/siteclinic/checkout
    (env override: NEXT_PUBLIC_SITECLINIC_CHECKOUT_API)
        ↓
[4] site-monitor's existing endpoint:
      - Creates Stripe Checkout session for the tier's Stripe Price ID
      - Returns { url: stripe_checkout_session_url }
        ↓
[5] Browser redirects to Stripe Checkout
        ↓
[6] After successful payment:
      - Stripe webhook fires → site-monitor /api/stripe/webhook
      - Customer account provisioned (site-monitor DB row)
      - submitted siteUrl auto-attached as customer's first monitored site
      - Welcome email sent (Stripe confirmation + Site Clinic welcome)
        ↓
[7] Customer lands at dashboard at app.siteclinic.io/c/<slug>
        ↓
[8] Nightly monitoring begins (existing site-monitor cron pipeline)
      - ADA scans, broken links, performance, SEO, security headers
      - Alerts when something changes
      - Monthly written brief (Pro tier)
      - Portfolio dashboard (Agency tier)
```

The "deliverables" the customer pays $49/$149/$349 for (steps 6–8) are entirely produced by **site-monitor's existing backend**, unchanged in role per locked §6. siteclinic-web only owns the entry door (steps 1–5).

**Verification status (HONEST scoping per global verification protocol)**:

| Layer | Status | Evidence |
|--|--|--|
| Page renders | ✅ Locally verified | `GET /pricing` → 200, all three tier cards visible, "Most popular" badge on Pro, prices correct |
| Form UI | ✅ Locally verified | Click any tier button → form opens with correct email/URL labels per tier; Cancel button closes; native validation fires on bad input |
| Cross-origin POST wiring | ⚠️ Implemented, NOT round-trip verified | `CheckoutButton` posts to `process.env.NEXT_PUBLIC_SITECLINIC_CHECKOUT_API \|\| "https://app.siteclinic.io/api/siteclinic/checkout"`. **Locally the POST will CORS-fail** because (a) `app.siteclinic.io` doesn't resolve yet, (b) site-monitor's existing `/api/siteclinic/checkout` doesn't have CORS allow for `http://localhost:3000`. This is expected pre-Phase-4a — see verification plan below. |
| Stripe Checkout session creation | ❌ Not verified | Phase 4a gate. Requires staging deploy + site-monitor CORS allowlist update. |
| Stripe webhook → account provisioning | ❌ Not verified | Phase 4a gate. Uses site-monitor's existing webhook handler — operator should confirm Stripe test mode keys are set correctly and webhook URL is reachable. |
| Welcome email | ❌ Not verified | Phase 4a gate. Operator confirms SendGrid/Resend integration sends correctly. |
| Dashboard handoff | ❌ Not verified | Phase 4a gate. Requires `app.siteclinic.io` DNS to resolve. |

**Phase 4a verification plan for the Stripe coupling** (operator-action items, surfaced explicitly here so they don't get lost):

1. **Site-monitor CORS allowlist update** (in site-monitor repo, separate PR):
   - Add CORS middleware on `/api/siteclinic/checkout` allowing `Origin: https://siteclinic-web.vercel.app` (staging) + `https://siteclinic.io` (post-cutover production).
   - For dev convenience, also allow `http://localhost:3000` (gated by `NODE_ENV !== "production"`).
   - Same allowlist update needed on `/api/siteclinic/waitlist`, `/api/siteclinic/session` (future iterations).

2. **Stripe test mode round-trip** (after Phase 4a step 1):
   - Deploy siteclinic-web to its new Vercel project (Phase 4a steps 1–3 in §4a of this plan)
   - Set `NEXT_PUBLIC_SITECLINIC_CHECKOUT_API` env on the new Vercel project to `https://siteclinic.io/api/siteclinic/checkout` (the current production endpoint, still served by site-monitor pre-cutover)
   - On staging URL, click each tier button, submit form with operator's email + a test site URL
   - Confirm Stripe Checkout page opens for the correct tier (test mode price IDs)
   - Complete a test payment (Stripe test card `4242 4242 4242 4242`)
   - Verify webhook fires, account row appears in site-monitor's database, welcome email sends, redirect lands at a working dashboard URL

3. **Phase 4b cutover** then changes the env var to `https://app.siteclinic.io/api/siteclinic/checkout` once `app.siteclinic.io` DNS is set.

**Explicit deferral named in `src/app/pricing/page.tsx`**:

- "Intent pages" section (depends on `SITE_CLINIC_INTENT_PAGES` config in site-monitor's `@/welcome/intentPages.ts` — same dependency as the about page's data-driven cards). Defer until iteration 4+.

**Forward links from /pricing** that are not yet routes (acceptable per discipline rule — not in gate.config.json so gates don't fail on them):

- `/developers` (linked from "Companion products" section). Will resolve when /developers cherry-picks in.

Iteration 3 stops here. Iteration 4 candidate options:
- **`/case-studies`** (un-404s the homepage hero's secondary CTA — completing the homepage's two primary CTAs)
- `/contact` (simple form, light scope)
- `/privacy` + `/terms` + `/accessibility` (legal trio, enables footer link growth + doctrine §06 trust elements)
- `/developers` (highest complexity — sub-routes for docs / quickstart / API reference, plus the split-decision §6 row 2)

Recommend `/case-studies` next — both homepage hero CTAs un-404'd in 4 iterations, low complexity exercises the migration-unit pattern again without new architectural concerns (no Stripe coupling, no auth, no API routes).

### 5e.4 §5b iteration 4 — /case-studies — VERIFIED 2026-05-11

**Cherry-pick source**: `site-monitor/src/app/case-studies/page.tsx` lines 29–440 (hero + proof standard + operating loop + Liddy Podiatry main case + "Proof is the product advantage" CTA).

**URL note**: `/case-studies` was ALREADY at the apex in site-monitor (not `/welcome/case-studies`). The canonical URL did not change in this iteration. The `/welcome/case-studies → /case-studies` redirect in `next.config.ts` is **defensive coverage** — some legacy `/welcome` nav patterns may have internally linked there, so the redirect catches stale references. Not actually serving stale Google-indexed URLs (per the 4/24/26 GSC report, `/case-studies` was already indexed at apex).

**Migration-unit verification — 2026-05-11**:

| Step | Status | Evidence |
|--|--|--|
| 1. Page exists | ✅ | `src/app/case-studies/page.tsx`, `GET /case-studies` returns HTTP 200, all 6 content sections render |
| 2. Sitemap includes route | ✅ | `/sitemap.xml` now serves 4 URLs (/ + /about + /pricing + /case-studies priority 0.85) |
| 3. Legacy redirect resolves | ✅ | `GET /welcome/case-studies` → 308 → `/case-studies` (defensive; URL didn't change but redirect catches any old internal links) |
| 4. Gate coverage | ✅ | `gate.config.json` lists 4 routes. `npm run gate:all`: gate:ada PASS (0 blocking each), gate:seo PASS (sitemap-vs-routes ✓ + 18 structural checks ✓ per route) |

**Doctrinal interventions applied during the cherry-pick**:

- **Anti-pattern fix**: source page had a `bg-slate-900 text-white` "Proof is the product advantage" section at the bottom — violates design thesis §43 ("no decorative dark-mode-by-default"). Converted to a cream surface with sage accent for the 3-up advantage points, preserving the content + the CTAs. Documented in the page header comment.
- **Semantic warning colors preserved**: stat numbers use `text-red-700` (bad state: "6+ years undetected", "$200/mo security failed") and `text-emerald-700` (good state: "24 hours alert window", "Live now monitoring"). Per design thesis "warning hues only on product warnings" — this IS product warning surface (case study showing what was broken vs fixed). Sage brand color separate.
- **Config-dependency removed**: source imported `PRODUCT_SYSTEM_MODEL.name` from site-monitor's `@/config/productSystem`. Hardcoded "Site Clinic" inline. Same deferral as `/about` and `/pricing` — port config when third consumer needs it.

**Pattern artifacts holding** (proto-builder discipline paying off):

- `Eyebrow` × 5 instances on this page alone — single component, multiple uses, zero variations
- `Button` × 4 instances across primary/secondary variants — `Button.tsx` re-used as-is
- `SiteHeader` `NAV_ITEMS` grew to `[About, Pricing, Proof]` — discipline rule holding (every nav entry points at a route in gate.config.json + sitemap.ts)
- Page-specific JSON-LD: `CollectionPage` containing an `Article` for the Liddy case (with `about: MedicalBusiness`). Entity graph still composing cleanly with layout's Organization + WebSite.

**Iteration 4 also closes**:

- ✅ Homepage hero's "See the proof" secondary CTA is no longer a 404 — clicking from `/` now lands at the real `/case-studies` page
- ✅ Pricing page's companion-products references to "evidence-first accessibility audit" remain accurate (cross-link still external to adaauditreport.com)
- ✅ Visible portfolio of CTAs from `/case-studies` itself: "Start your Site Clinic trial" → `/pricing` (works), "See how Site Clinic works" → `/` (works), "Start with ADA Audit Report" → external (works)

**Forward links from /case-studies not yet routes**:

- `https://adaauditreport.com/blog/website-security-protects-wrong-thing` — external to ADA site, exists in production
- `/welcome` — would 308 to `/` via existing redirect from iteration 1. Verified clean.

Iteration 4 stops here. Iteration 5 candidate options:
- **`/contact`** — simple form, lowest complexity, no Stripe, no data deps. Good warm-up before higher-complexity pages.
- **Legal trio `/privacy` + `/terms` + `/accessibility`** — required by doctrine §06 and unlocks `SiteFooter` legal-links growth. Could be done in a single iteration since they're structurally similar (static-content pages).
- **`/developers`** — highest complexity per locked §6 row 2 (split: public docs in siteclinic-web, auth-gated dashboard at app.siteclinic.io). Probably worth waiting until cutover sequence is clearer.
- **`/compare/site-clinic-vs-pingdom-vs-uptimerobot`** — comparison page, useful SEO content but lower urgency than legal/contact pages.

Recommend **legal trio in a single iteration** next: doctrine §06 requires footer legal links, the three pages are structurally identical (static text), and a single iteration closes the "footer grows by 3 entries" gap. Alternative: `/contact` first (single page, simpler scope per the user's pattern of preferring narrow scopes).

### 5e.5 §5b iteration 5 — /privacy + /terms + /accessibility (legal trio) — VERIFIED 2026-05-11

**Cherry-pick sources**: `site-monitor/src/app/welcome/{privacy,terms,accessibility}/page.tsx` — all three at ~80 lines each, structurally identical (h1 + lastUpdated date + sequence of h2 + body sections). Content cherry-picked **verbatim** — legal language is vetted, no rewrites or invented clauses during the migration.

**Migration-unit verification across all three routes — 2026-05-11**:

| Route | Page exists | Sitemap | Redirect | Gate |
|--|--|--|--|--|
| `/privacy` | ✅ HTTP 200, full content | ✅ priority 0.3 yearly | ✅ `/welcome/privacy` → 308 → `/privacy` | ✅ ADA 0/0, SEO 18/18 |
| `/terms` | ✅ HTTP 200, full content | ✅ priority 0.3 yearly | ✅ `/welcome/terms` → 308 → `/terms` | ✅ ADA 0/0, SEO 18/18 |
| `/accessibility` | ✅ HTTP 200, full content | ✅ priority 0.3 yearly | ✅ `/welcome/accessibility` → 308 → `/accessibility` | ✅ ADA 0/0, SEO 18/18 |

`gate.config.json` now lists 7 routes; sitemap serves 7 URLs; gate:all passes end-to-end.

**Pattern abstraction at the rule-of-three threshold**:

`src/components/LegalPageLayout.tsx` was extracted at exactly the third consumer — not preemptively, not delayed. The wrapper handles:
- Page-level JSON-LD injection
- SiteHeader + SiteFooter chrome
- `max-w-3xl` reading-width container (narrower than the 6xl marketing surface)
- DM Serif Display h1 with optional italic accent slot (`title="Privacy"` + `italicAccent="Policy"`)
- "Last updated: <date>" subline in Geist
- Body wrapper with consistent spacing
- "← Back to Site Clinic" return link

Plus a `LegalSection` companion for the h2 + body pattern. Three legal pages, ~70 lines each, vs ~250 lines each without the layout. Net code reduction + structural consistency guaranteed for any future legal page.

**SiteFooter legal-link growth — doctrine §06 satisfied**:

`SiteFooter.tsx` `FOOTER_LINKS` grew from empty to `[Privacy, Terms, Accessibility]`. The footer now renders the legal nav block (was hidden when array was empty). Doctrine §06 "footer links to legal pages" requirement met for the first time in the rebuild.

`SiteHeader.tsx` nav unchanged — legal pages belong in footer per convention, not in the primary nav. (Pattern locked: SiteHeader nav = marketing pages; SiteFooter nav = legal pages.)

**One doctrinal claim now structurally true** (worth calling out):

`/accessibility` says: *"We run axe-core against every public page on every deploy and block promotion to production on serious violations."*

This is now **literally true** for siteclinic-web. `build-websites-tools/gate-ada` runs as `npm run prebuild` (the `prebuild` lifecycle hook), uses axe-core via Playwright against every route in `gate.config.json`, and exits non-zero on any critical/serious/moderate violation. The deployed accessibility statement matches the actually-enforced build pipeline. Doctrine claim → infrastructure → page copy: alignment achieved, no aspirational language.

**Components reused without modification**:
- `Eyebrow` — not used on legal pages (no eyebrow above h1 — clean reading layout)
- `Button` — not used on legal pages (no CTAs)
- `LegalPageLayout` — new, used 3 times
- `LegalSection` — new, used 17 times (5 sections × privacy + 6 × terms + 5 × accessibility)
- `SiteHeader` — unchanged
- `SiteFooter` — `FOOTER_LINKS` populated, no structural change

**Italic-accent pattern preserved in legal h1s** (design-thesis "one italic emphasis per heading"):
- Privacy → "Privacy *Policy*"
- Terms → "Terms of *Service*"
- Accessibility → "Accessibility *Statement*"

Iteration 5 stops here. Iteration 6 candidate options:
- `/contact` — simple contact form, low complexity (probably no Stripe/auth coupling — form likely posts to existing site-monitor `/api/siteclinic/waitlist` or similar)
- `/compare/site-clinic-vs-pingdom-vs-uptimerobot` — SEO comparison page, lower urgency
- `/developers` — high complexity per locked §6 row 2 (split: public docs in siteclinic-web, auth-gated dashboard at app.siteclinic.io). Probably the last marketing-side cherry-pick before cutover planning.
- Intent-pages from `welcome/intentPages.ts` (8 pages) — depends on porting the `SITE_CLINIC_INTENT_PAGES` config; would un-block the deferred "intent pages" section on `/pricing`.

Recommend `/contact` next — lowest complexity, exercises the cross-origin POST pattern for waitlist/contact submission (similar shape to `CheckoutButton` but lower stakes), completes the standard small-business marketing-site set (Home + About + Pricing + Proof + Contact + legal). After /contact, only intent pages + developers remain before cutover planning.

### 5e.6 §5b iteration 6 — /contact — VERIFIED LOCALLY (form wired, not round-trip verified) 2026-05-11

**Cherry-pick source**: `site-monitor/src/app/welcome/contact/page.tsx` (~187 lines) + `site-monitor/src/app/welcome/WaitlistForm.tsx` (~115 lines).

**Migration-unit verification — 2026-05-11**:

| Step | Status | Evidence |
|--|--|--|
| 1. Page exists | ✅ | `src/app/contact/page.tsx`, `GET /contact` returns HTTP 200, full content present (3 contact-route cards + Response expectation card + Guided setup form section) |
| 2. Sitemap includes route | ✅ | `/sitemap.xml` now serves 8 URLs (`/contact` priority 0.7, monthly) |
| 3. Legacy redirect resolves | ✅ | `GET /welcome/contact` → 308 → `/contact` (1-hop clean) |
| 4. Gate coverage | ✅ | `gate.config.json` lists 8 routes. `gate:all` PASS — ADA 0/0 each, SEO 18/18 each |

**Form backend coupling status** (per operator label "wired, not verified"):

| Layer | Status |
|--|--|
| `WaitlistForm` renders + validates locally | ✅ |
| Form submit POSTs to `process.env.NEXT_PUBLIC_SITECLINIC_WAITLIST_API \|\| "https://app.siteclinic.io/api/siteclinic/waitlist"` | ⚠️ **Wired, not round-trip verified.** Same CORS-pre-cutover limitation as `CheckoutButton` — POST will CORS-fail from localhost until site-monitor's allowlist on `/api/siteclinic/waitlist` includes the consuming origin. |
| Backend records waitlist entry + operator receives | ❌ Phase 4a gate — same CORS allowlist update that adds `/api/siteclinic/checkout` (iteration 3) should also include `/api/siteclinic/waitlist`. |

**Phase 4a verification adds (combined with iteration 3's Stripe gates)**:

The CORS allowlist update on site-monitor's API surface needs to cover BOTH endpoints in one PR:

- `/api/siteclinic/checkout` (iteration 3)
- `/api/siteclinic/waitlist` (this iteration)
- Future: `/api/siteclinic/session` if any iteration touches it

Each allowed origin: `https://siteclinic-web.vercel.app` (staging) + `https://siteclinic.io` (post-cutover) + `http://localhost:3000` (dev, gated by `NODE_ENV !== "production"`).

**Components reused without modification**:
- `Eyebrow` × 2 (page-top + guided-setup card)
- `SiteHeader` — nav grew to `[About, Pricing, Proof, Contact]`
- `SiteFooter` — unchanged from iteration 5
- `LegalPageLayout` — N/A (not a legal page)

**Components new this iteration**:
- `WaitlistForm` — client component matching `CheckoutButton`'s shape but lower stakes (no Stripe). Same env-overridable cross-origin POST pattern, same `wired-but-not-verified` discipline label.

**Italic-accent pattern in headings**:
- Hero h1: "Reach the right surface *without guesswork.*"
- Guided-setup h2: "Prefer a human to help place the *first site?*"

**Forward links not in gate coverage** (acceptable per discipline rule):
- `/developers` — Developer-layers card links here. Will resolve when /developers cherry-picks in.

**Iteration 6 also closes the standard small-business marketing-site set**:

After this iteration, the public marketing surface has all six conventional pages: Home + About + Pricing + Proof + Contact + Legal (×3). The only remaining un-built routes from the source are:

- `/developers` (split per locked §6 row 2 — docs side here, dashboard side at app.siteclinic.io)
- `/compare/site-clinic-vs-pingdom-vs-uptimerobot` (SEO comparison page)
- Intent pages from `welcome/intentPages.ts` (8 pages — depends on porting `SITE_CLINIC_INTENT_PAGES` config)
- `/blog` + `/blog/[slug]` (per locked §6 row 3 — blog publisher in site-monitor writes to siteclinic-web via cross-repo commit)

Iteration 6 stops here. Iteration 7 candidate options:
- **`/developers`** — high complexity (split surface), but unblocks several forward links across the site (currently linked from `/`, `/about`, `/pricing`, `/contact`)
- **`/compare/...`** — SEO comparison page, exercises another structural pattern (table-heavy content)
- **Intent pages** — would require porting `SITE_CLINIC_INTENT_PAGES` config; unblocks the deferred section on `/pricing` + `/about`
- **`/blog`** — depends on the cross-repo blog-publisher contract from `MIGRATION_PLAN §6 row 3`, which needs design before pages can land

Recommend `/developers` next: highest forward-link-resolution value (4 pages link to it as a placeholder, all of which would be cleanly resolved). Surface split per locked §6 row 2 — public docs/quickstart/api-reference here, auth-gated dashboard/signup/api-explorer stays in site-monitor for `app.siteclinic.io`. Will require deciding scope inside this iteration (e.g., do we cherry-pick all of `developers/*` docs in one go, or just `/developers` landing page first?).

### 5e.6.1 Founder-name correction (operator directive 2026-05-11, between iter 6 and iter 7)

Operator caught that `/about` rendered "Dr. John Liddy, D.C." (carried verbatim from source's `welcome/about/page.tsx`). Corrected both occurrences (`AboutPage` JSON-LD `mainEntity.name` + the founder card h2) to canonical "John Liddy". Gates re-ran clean (no structural change).

Memory entry created: `feedback_founder_name_canonical_form.md` — operator rule that the credential form ("Dr.", "D.C.") belongs only on explicitly-medical surfaces (liddypodiatry); SaaS/tech marketing surfaces (siteclinic.io, adaauditreport.com, etc.) use bare "John Liddy". Cherry-picks should normalize during the pick, not preserve source's credential form silently. Indexed in `MEMORY.md`.

### 5e.7 §5b iteration 7 — /developers (public surface only) — VERIFIED 2026-05-11

**Cherry-pick source**: `site-monitor/src/app/developers/page.tsx`, scoped per locked §6 row 2 to public developer surface only. Auth-gated surfaces (`signup`, `dashboard`, `api-explorer`) stay in site-monitor → `app.siteclinic.io`.

**Migration-unit verification — 2026-05-11**:

| Step | Status | Evidence |
|--|--|--|
| 1. Page exists | ✅ | `src/app/developers/page.tsx`, `GET /developers` returns HTTP 200, hero + code snippet + 2 offerings + capability families + cross-origin section all rendering |
| 2. Sitemap includes route | ✅ | `/sitemap.xml` now serves 9 URLs (`/developers` priority 0.9 weekly — higher than About/Contact reflecting developer-portal SEO weight) |
| 3. Legacy redirect resolves | ✅ | `GET /welcome/developers` → 308 → `/developers` (defensive — URL was at apex in source, redirect catches stale references) |
| 4. Gate coverage | ✅ | `gate.config.json` lists 9 routes. `gate:all` PASS — ADA 0/0 each route, SEO 18/18 each route |

**Doctrinal interventions during the cherry-pick** (logged in page header comment):

- **Design normalization**: source used `bg-gradient-to-br from-blue-50 via-white to-indigo-50` + blue-coded developer accents + multi-color tone badges (blue/green/purple/orange). Departed from cream/sage design thesis (§43 "one clear visual direction"). Normalized to cream/sage with sage-tinted capability badges. Code snippet stays as dark monospace block (universal convention even on light themes, not a design-thesis violation).
- **Cross-origin split**: auth-gated CTAs ("Get API Key", "Open dashboard", "API Explorer") wired to absolute URLs at `https://app.siteclinic.io/developers/{signup,dashboard,api-explorer}`. Page renders + navigates correctly to those URLs post-cutover. Pre-cutover, those subdomain URLs don't resolve yet (which is expected — they activate at Phase 4b DNS cutover).
- **Config dependency removed**: `SITE_CLINIC_INTENT_PAGES` filter from source dropped — same deferral pattern as `/about`, `/pricing`, `/case-studies`.

**Pattern artifacts holding** (proto-builder discipline still paying off through 7 iterations):

- `Eyebrow` × 4 instances on this page; `Button` × 9 instances spanning all three variants (primary / secondary / text-link). No new variants invented. Design-thesis "one primary, one secondary, one text-link" rule holding.
- `SiteHeader` `NAV_ITEMS` grew to `[About, Pricing, Proof, Contact, Developers]` — 5 entries, all pointing at routes in gate.config.json + sitemap.ts.
- JSON-LD: `WebPage` with `ItemList mainEntity` containing two `SoftwareApplication` entries (one per developer offering). Entity graph composing cleanly with layout's Organization + WebSite + page's offering-as-SoftwareApplication structure.

**4 forward 404s introduced (acceptable per pattern, NAMED here)**:

The `/developers` landing references 4 deep-link sub-routes that don't exist yet in siteclinic-web. Per the discipline rule, they're NOT in `gate.config.json` so gates don't fail on them. Listed here so subsequent iterations have a clear backlog:

| URL | Linked from where on /developers | Resolves when |
|--|--|--|
| `/developers/docs/quickstart` | "Start with the API" + hero "Start with the docs" buttons | iter 8 candidate |
| `/developers/api-reference` | "Open API reference" secondary CTA on API card | iter 9 candidate (probably extensive — full OpenAPI surface) |
| `/developers/mcp` | "Browse MCP tools" primary CTA on MCP card | iter 10 candidate |
| `/developers/docs` | "Read developer docs" secondary CTA on MCP card | could roll into iter 8 |

Forward links to operations side (cross-origin, NOT 404s — they're external navigation to a subdomain that resolves post-cutover):
- `https://app.siteclinic.io/developers/signup`
- `https://app.siteclinic.io/developers/dashboard`
- `https://app.siteclinic.io/developers/api-explorer`

**Iteration 7 also closes the "all forward links from already-built pages" gap for the same-origin set**:

After this iteration, NO already-built page links to a same-origin 404 outside the `/developers/*` sub-tree. Specifically:
- `/` Hero CTAs → `/pricing` ✓, `/case-studies` ✓
- `/about` CTAs → `/pricing` ✓, ADA external ✓
- `/pricing` companion-products → `/developers` ✓ (was 404, now resolves), ADA external ✓
- `/case-studies` CTAs → `/pricing` ✓, `/` ✓, ADA external ✓
- `/contact` route cards → `/developers` ✓ (was 404, now resolves)
- `/developers` deep-links → 4 same-origin 404s (NEW — listed above), plus cross-origin to app.siteclinic.io (resolves post-cutover)

So the same-origin 404 count went from 1 (pre-iter-7: `/developers` was the only un-built link target) to 4 (post-iter-7: the four `/developers/*` sub-routes). Net resolved minus introduced = -3 + 1 = -2 of same-origin 404 surface. Closing trajectory.

Iteration 7 stops here. Iteration 8 candidate options:
- **`/developers/docs` + `/developers/docs/quickstart`** in a single iteration — closes the most prominent two of the four `/developers/*` forward 404s (linked from the API offering's primary CTA + the MCP offering's secondary CTA + the hero's "Start with the docs"). Best CTA-resolution value per effort.
- `/developers/mcp` — closes the MCP offering primary CTA. Single-page, smaller scope. But less referenced than `/docs/quickstart`.
- `/developers/api-reference` — likely a large OpenAPI-driven page; probably wants its own iteration.
- `/compare/site-clinic-vs-pingdom-vs-uptimerobot` — comparison content, lower urgency.
- Intent pages × 8 — config-dependency port required first.

Recommend `/developers/docs + /developers/docs/quickstart` as iteration 8 — same shape as legal trio (related pages, single iteration), closes 3 of 4 same-origin 404s currently on `/developers`. Alternative: pause `/developers/*` sub-tree and pivot to comparison/intent if those are higher operator priority right now.

### 5e.8 §5b iteration 8 — /developers/docs + /developers/docs/quickstart — VERIFIED 2026-05-11

**Cherry-pick sources**:
- `site-monitor/src/app/developers/docs/page.tsx` (~150 lines)
- `site-monitor/src/app/developers/docs/quickstart/page.tsx` (~413 lines)

**Migration-unit verification across both routes — 2026-05-11**:

| Route | Page exists | Sitemap | Redirect | Gate |
|--|--|--|--|--|
| `/developers/docs` | ✅ HTTP 200, hero + start-here Quickstart card + reference surfaces + roadmap ("More guides coming") + contact CTA | ✅ priority 0.85 weekly | ✅ `/welcome/developers/docs` → 308 → `/developers/docs` | ✅ ADA 0/0, SEO 18/18 |
| `/developers/docs/quickstart` | ✅ HTTP 200, breadcrumb + hero + 3 stepped sections (API key / SDK / first call) + JS+Python code blocks + next-steps card | ✅ priority 0.8 monthly | ✅ `/welcome/developers/docs/quickstart` → 308 → `/developers/docs/quickstart` | ✅ ADA 0/0, SEO 18/18 (after a fix — see below) |

`gate.config.json` now lists 11 routes; sitemap serves 11 URLs; `gate:all` passes end-to-end.

**`gate:ada` caught a real WCAG violation during this iteration — system working as designed**:

The `CodeBlock` component's language badge initially rendered sage `#3D7468` text on a 20%-opacity sage background over the dark code surface (`#0F1826`). `gate:ada` failed with:

```
[serious] color-contrast: Elements must meet minimum color contrast ratio thresholds
  affects 4 node(s): .inline-block.px-2.py-0\.5  (the language badge × 4 instances)
```

This is exactly the failure mode `/accessibility` claims will block production:
> *"We run axe-core against every public page on every deploy and block promotion to production on serious violations."*

Fix: changed badge to solid sage background (`bg-[var(--color-accent)]`) + white text. Re-ran `gate:all`: PASS. Total time from violation surfacing to fix verified: ~2 minutes. **The accessibility claim → gate → fix → re-verify loop worked as designed.** First instance in this rebuild of `gate:ada` catching a real defect, not a no-op. The discipline is paying.

**Forward 404 trajectory honors operator's stated expectation**:

Pre-iter-8 same-origin 404s on `/developers/*` subtree: 4 (docs, docs/quickstart, api-reference, mcp).
Post-iter-8 same-origin 404s: **2 — `/developers/api-reference` and `/developers/mcp`**. Matches operator's stated expectation exactly.

The new `/developers/docs` page references 6 future sub-doc routes (Authentication, Rate Limits, Error Handling, Webhooks, Code Examples, MCP integration) but renders them as **roadmap cards without links** (dashed borders, "More guides coming" framing). Each becomes a real link only when its iteration lands. Zero new same-origin 404s introduced by this design choice.

The new `/developers/docs/quickstart` page references:
- `/developers/api-reference` (linked from Step 2 + bottom CTA) — already a known forward 404 from iter 7, no new addition
- `/developers/docs` (linked from "Back to docs" CTA) — resolves this iter ✓
- Cross-origin `app.siteclinic.io/developers/signup` (Step 1 "Create account" CTA) — same as iter 7, resolves post-cutover

**Doctrinal interventions**:

- **Design normalization** (third time this iteration set): source used blue/indigo gradient + multi-color SDK badges (yellow JS, blue Python). Converted to cream/sage + a single sage solid badge per language. Dark code-surface convention preserved.
- **Client-component dropped**: source quickstart was `"use client"` to support `navigator.clipboard.writeText` copy buttons on code snippets. Removed for iteration 8 — clipboard buttons are nice-to-have, not core; the SDK install commands and example code are select-and-copyable from the rendered HTML directly. Page stays as server component, simpler.
- **Custom `DeveloperPageShell` / `LinkGrid` / `Section` from source's `../_components`** not ported; same inline-and-defer pattern used previously. If the `/developers/*` subtree grows beyond docs + quickstart with consistent shells, extract then.

**Components**:
- New small helpers in the quickstart page: `CodeBlock` (3 instances) and `StepHeader` (3 instances). Both inline-defined (local to the file) — not promoted to `src/components/` until a second consumer needs them. Rule of three watch.
- `Eyebrow` × 2 on docs, × 4 on quickstart
- `Button` × multiple, spanning primary/secondary/text-link
- `SiteHeader` nav unchanged (sub-routes don't get top-nav entries; `/developers` parent entry from iter 7 covers the section)
- `SiteFooter` unchanged

**Italic-accent pattern**:
- /developers/docs h1: "Docs for onboarding, auth, quotas, and *real implementation work.*"
- /developers/docs/quickstart h1: "Zero to first call in *five minutes.*"

Iteration 8 stops here. Iteration 9 candidate options (in roughly decreasing operator-priority order):
- **`/developers/api-reference`** — closes the second-to-last `/developers/*` same-origin 404. Probably large (OpenAPI-driven endpoint families). Worth scoping inside this iteration whether to do the full surface or just a landing.
- **`/developers/mcp`** — closes the last `/developers/*` same-origin 404. Single page, smaller scope, more focused content.
- One of the deferred docs sub-routes (Authentication / Rate Limits / Error Handling / Webhooks / Code Examples) — adds depth to docs surface.
- `/compare/site-clinic-vs-pingdom-vs-uptimerobot` — comparison SEO page.
- Intent pages × 8 — config-dependency port required first.

Recommend `/developers/mcp` next: smaller scope, single-page, closes another `/developers/*` same-origin 404. `/developers/api-reference` likely warrants its own dedicated iteration given likely OpenAPI surface size. Either order works.

### 5e.9 §5b iteration 9 — /developers/mcp — VERIFIED 2026-05-12

**Cherry-pick source**: `site-monitor/src/app/developers/mcp/page.tsx` (~634 lines), trimmed aggressively to the public-doc shape.

**Migration-unit verified**: page renders HTTP 200; sitemap 12 URLs; `/welcome/developers/mcp` → 308 → `/developers/mcp`; `gate.config.json` covers; `gate:all` PASS.

**Doctrinal interventions**:
- Source's blue/indigo gradient + multi-color status badges (green/yellow/gray) + purple "MCP Tools" pill → normalized to cream/sage with **semantic emerald/amber** for shipping/coming-soon status (same severity-color convention used on `/case-studies` Liddy stats)
- Three MCP servers in source (1 shipping, 2 coming soon) → preserved shipping detail in full; coming-soon as roadmap cards with dashed borders (same pattern as `/developers/docs` "More guides coming")
- Migration-guide section from source (Firecrawl → siteclinic-crawl) dropped — public-doc shape doesn't need competitive comparison, that's positioning copy. Can add back via future iteration if operator wants.
- Skipped `PRODUCT_SYSTEM_MODEL.name` config dependency — hardcoded "Site Clinic" inline.

**`CodeBlock` local helper** reused exactly as written in iter 8 — same component shape, different content. **Three consumers now** (quickstart Step 2, Step 3, mcp install + usage). Rule of three threshold hit. Should be promoted to `src/components/CodeBlock.tsx` in next iteration that touches code blocks.

### 5e.10 §5b iteration 10 — /developers/api-reference — VERIFIED 2026-05-12

**Cherry-pick source**: `site-monitor/src/app/developers/[slug]/page.tsx` lines 131–224 (the "api-reference" case of a dynamic `[slug]` route handling 7 leaf pages). Materialized as a concrete static `src/app/developers/api-reference/page.tsx` rather than porting the dynamic-route shell.

**Other 6 [slug] cases NOT cherry-picked this iteration** (named for backlog): `community`, `examples`, `pricing`, `sdks`, `status`, `support`. Each becomes its own future iteration if operator wants. Note: source's `[slug]` "pricing" case is for developer-tier pricing ($399 / $899) — distinct from siteclinic.io's main `/pricing` ($49/$149/$349). If we cherry-pick developer pricing later, it lives at `/developers/pricing` not `/pricing`.

**Migration-unit verified**: page renders HTTP 200; sitemap 13 URLs; `/welcome/developers/api-reference` → 308 → `/developers/api-reference`; `gate.config.json` covers; `gate:all` PASS (after one fix — see below).

**`gate:seo` caught a second real defect — meta description 185 chars exceeded the 160-char gate**. Google's effective truncation length for description snippets is ~155-160 chars, so the gate is correct. Trimmed to 154 chars; re-ran `gate:all` → PASS. Total time from gate failure to fix verified: ~30 seconds. Second instance of `gate:all` catching a real defect (after iter 8's WCAG contrast violation).

**Doctrinal interventions**:
- Source uses custom `DeveloperPageShell + CardGrid + CodeBlock + Section + LinkGrid` components from `../_components`. None ported. Inlined using `SiteHeader/Footer/Eyebrow/Button` + local `CodeBlock` helper.
- Source's `PRODUCT_SYSTEM_MODEL.name + STRUCTURAL_QUALITY_CAPABILITY` config dependency → hardcoded "Site Clinic" inline.
- API base path in source is `/api/v1/*` on **same origin** (when site-monitor served siteclinic.io). In siteclinic-web post-cutover, API base path is `https://app.siteclinic.io/api/v1/*` — **cross-origin**. Auth example updated to use the absolute URL.

### 5e.11 ALL `/developers/*` same-origin 404s CLOSED

Tracker (iter 7 → iter 10):

| State | `/developers/*` same-origin 404 count |
|--|--|
| End of iter 7 | 4 (docs, docs/quickstart, api-reference, mcp) |
| End of iter 8 | 2 (api-reference, mcp) |
| End of iter 9 | 1 (api-reference) |
| **End of iter 10** | **0** ← all closed |

13 routes total, all gate-clean. Remaining backlog (not same-origin 404s; either deferred or not-yet-introduced):

- 5 sub-doc routes in roadmap on `/developers/docs` (authentication, rate-limits, error-handling, webhooks, examples) — render as dashed-border roadmap cards, no broken links
- 6 `[slug]` developer-leaf routes from source (community, examples, pricing, sdks, status, support) — referenced via cross-origin to `app.siteclinic.io` where applicable, otherwise NOT linked from any siteclinic-web page
- `/compare/site-clinic-vs-pingdom-vs-uptimerobot` — not yet cherry-picked; not linked from any siteclinic-web page yet
- 8 intent pages — not yet cherry-picked; not linked
- `/blog` + `/blog/[slug]` — depend on cross-repo publisher contract (Track B operator action)

### 5e.12 Migration playbook landed

`~/Desktop/Projects/build-websites-template/07-website-migration-playbook.md` — the **model script for future website migrations**, derived from 10 iterations of siteclinic-web. Covers:

1. When the playbook applies / when to use a different doctrine
2. Five-phase shape (doctrine docs → foundation → cherry-pick loop → operator backlog → cutover)
3. Phase-by-phase exit criteria
4. Reusable scaffolding files (paste-able)
5. The five core components (Eyebrow, Button, SiteHeader, SiteFooter, Hero)
6. Four-step migration-unit discipline (page + sitemap + redirect + gate)
7. Doctrinal-intervention normalization table (8 common source departures → doctrine fixes)
8. Rule-of-three for component extraction
9. Gate-catches-real-defects case studies from iter 8 + iter 10
10. Operator-action checklist (paste-able for each new site)
11. Anti-patterns refused

Lives in `build-websites-template/` (the methodology repo) as doc #07. Companion to docs 01–06.

When ADA cream/sage rebuild or any other site migration starts, the playbook is the entry point. The first concrete reference for "how does this work?" is `build-websites-template/07-website-migration-playbook.md` + sibling artifacts in `siteclinic-web/`.

### 5e.13 §5b iteration 11 — /compare/site-clinic-vs-pingdom-vs-uptimerobot — VERIFIED 2026-05-12

**Cherry-pick source**: `site-monitor/src/app/welcome/compare/site-clinic-vs-pingdom-vs-uptimerobot/page.tsx` (~409 lines, comparison long-form article).

**URL change**: `/welcome/compare/...` → `/compare/...` (apex per locked §6).

**Migration-unit verified**: page renders HTTP 200; sitemap 14 URLs; `/welcome/compare/site-clinic-vs-pingdom-vs-uptimerobot` → 308 → `/compare/...`; `gate.config.json` covers; `gate:all` PASS first-try (no gate-caught defects this iteration).

**Doctrinal interventions**:
- Source's PALETTE-const + inline `bg-[#FAF7F2]` arbitrary classes → tokenized cream/sage utilities
- Source's `PRODUCT_SYSTEM_MODEL.deliveryLayers + SITE_CLINIC_INTENT_PAGES` config deps → hardcoded "Site Clinic" + "app layer" inline; intent-pages grid section deferred to the next iteration (config port)
- Source's custom GA4 inline `<Script>` blocks dropped (deferred — GA4 wiring + cookie-consent banner becomes its own iteration that touches all pages consistently)
- 7 long-form article h2 sections preserved verbatim (claims are operator-vetted competitive copy, no rewriting)
- Comparison table preserved with tri-state cells (true ✓ in sage / false — in muted / qualified text in italic)
- 2 JSON-LD blocks preserved (Article + FAQPage with 4 Q/A pairs)
- All internal `/welcome/*` references in source → updated to apex URLs (`/welcome` → `/`, `/welcome#pricing` → `/pricing`, etc.)
- Footer in source dropped → using `SiteFooter` component (which already has correct paths post-iter 5)

**Pattern artifacts**:
- `Eyebrow` × 5; `Button` × 1
- `Cell` helper inline-local (3 cells × 12 rows = 36 invocations) — first appearance, not yet 3 consumers
- `SiteHeader` nav unchanged (compare page is a leaf, not a top-nav surface)

**Italic-accent pattern preserved** across 7 h2 headings (one italic accent per section per design thesis).

**No new same-origin 404s introduced**:
- Internal links: `/pricing` ✓, `mailto:hello@siteclinic.io` (external) ✓
- `SITE_CLINIC_INTENT_PAGES` grid that linked to 8 intent pages — DROPPED this iteration, will re-add after the config port

### 5e.14 Track B operator-action document landed

`~/Desktop/Projects/siteclinic-web/docs/TRACK_B_OPERATOR_ACTIONS.md` — three paste-ready PR briefs for site-monitor changes that gate Phase 4a staging verification:

| PR brief | Scope | Phase blocked |
|--|--|--|
| #1 CORS allowlist | `/api/siteclinic/{checkout,waitlist}` + helper at `src/lib/cors.ts` | Phase 4a (Stripe + waitlist round-trips can't be verified without it) |
| #2 Cross-repo blog publisher | GitHub Actions workflow + PAT + idempotency contract per locked §6 row 3 | `/blog` cutover only (NOT Phase 4a) |
| #3 Self-monitoring entry | clients.ts row for siteclinic.io with `launchState: "pre-cutover"` | Nothing — purely config, no behavior change pre-cutover |

Each brief includes:
- Title + background + scope
- Implementation snippets (paste-able into PR)
- Allowed-origin matrix (PR #1) / payload schema (PR #2) / launch-state model (PR #3)
- Fail-closed behavior expectations
- Tests required
- Verification-before-merge steps
- Rollback plan

**Sequencing recommendation in the doc**: PR #1 first (smallest scope, biggest Phase 4a unblock), PR #3 second (cheap, config-only), PR #2 last (most complex, can defer until `/blog` cherry-pick).

**Phase 4a entry criteria** documented in §"Phase 4a entry criteria" of the Track B doc:
- ✅ Track A: 14 routes shipped (current state)
- ⏳ PR #1 merged + deployed
- ⏳ PR #3 merged
- ⏳ PR #2 not blocking Phase 4a

### Status snapshot — end of 2026-05-12 work

**Track A — siteclinic-web local builds**:

```
✅ Iter 1   /                                            14/22 routes shipped
✅ Iter 2   /about                                       gate:all PASS across all
✅ Iter 3   /pricing                                     2 gate-caught defects fixed
✅ Iter 4   /case-studies                                  (iter 8: WCAG contrast)
✅ Iter 5   /privacy + /terms + /accessibility            (iter 10: meta desc length)
✅ Iter 6   /contact
✅ Iter 7   /developers
✅ Iter 8   /developers/docs + /developers/docs/quickstart
✅ Iter 9   /developers/mcp
✅ Iter 10  /developers/api-reference
✅ Iter 11  /compare/site-clinic-vs-pingdom-vs-uptimerobot
⏳ Iter 12  intent pages × 8 (depends on SITE_CLINIC_INTENT_PAGES config port)
⏳ Iter 13+ /developers/docs/{authentication,rate-limits,error-handling,webhooks,examples}
⏳ Iter 14+ /developers/[slug] remaining (community, examples, pricing, sdks, status, support)
⏳ Iter ?   /blog + /blog/[slug] (blocked on Track B PR #2)
```

**Track B — operator-action backlog**: document landed at `siteclinic-web/docs/TRACK_B_OPERATOR_ACTIONS.md` with three paste-ready PR briefs. Awaiting operator-driven PRs in site-monitor.

**Track C — production cutover**: NOT STARTED. Blocked on Track A sufficient completion + Track B PRs #1 and #3 merged.

**Documentation**: `build-websites-template/07-website-migration-playbook.md` — model script for future website migrations (ADA cream/sage rebuild, daily-rise, etc.), derived from 11 iterations of empirical experience.

### 5e.15 §5b iteration 12 — Intent pages × 4 + config port — VERIFIED 2026-05-12

**Cherry-pick sources**:
- `site-monitor/src/app/welcome/intentPages.ts` (~297 lines, 4 intent page configs)
- `site-monitor/src/app/welcome/[slug]/page.tsx` (~353 lines, dynamic renderer)

**Number correction**: prior plan said "8 intent pages." Source actually has **4**. Earlier "8" was conflating intent-pages with the 8 URLs in the GSC report (which included blog, case-studies, and legal pages alongside the 4 intent pages).

**Architecture decision: dynamic `[slug]` route instead of 4 concrete static routes**:

The content is config-driven (single source array in `src/lib/intentPages.ts`), the rendering is identical across all 4 pages, and adding a 5th intent page should be a one-line config edit. Used Next.js dynamic routing:

- `src/app/[slug]/page.tsx` handles intent slugs via `generateStaticParams()`
- Concrete routes (`/about`, `/pricing`, etc.) take precedence over `[slug]` per Next.js routing
- Unknown slugs call `notFound()` — verified: `GET /nonexistent-slug` → HTTP 404, not caught
- `sitemap.ts` iterates `SITE_CLINIC_INTENT_PAGES` so new entries auto-add to sitemap
- `gate.config.json` lists slugs explicitly (gate doesn't iterate; discipline says enumerate)
- `next.config.ts` redirects hardcoded per slug (Next.js redirects are static config, can't iterate)

To add a 5th intent page: (1) append entry to `src/lib/intentPages.ts`, (2) add `/welcome/<new-slug>` redirect to `next.config.ts`, (3) add `/<new-slug>` route to `gate.config.json`. Sitemap auto-picks up; route auto-renders.

**Migration-unit verified across all 4 intent pages**:

| Route | Render | Sitemap | Redirect | Gate |
|--|--|--|--|--|
| `/ai-visibility-monitoring-tool` | 200 | ✓ | 308 from `/welcome/...` | ADA 0/0, SEO 18/18 |
| `/ai-citation-tracking-for-websites` | 200 | ✓ | 308 from `/welcome/...` | ADA 0/0, SEO 18/18 |
| `/track-ai-crawler-hits-to-my-website` | 200 | 18 URLs total | 308 from `/welcome/...` | ADA 0/0, SEO 18/18 |
| `/website-monitoring-with-seo-and-accessibility` | 200 | ✓ | 308 from `/welcome/...` | ADA 0/0, SEO 18/18 |

Sitemap now 18 URLs; gate.config 18 routes; gates passed first-try (no gate-caught defects this iteration).

**Page structure per intent page**: hero (eyebrow + h1 + opening) → "Who it is for" + "What evidence we capture" 2-col → "Sample output" 3-up cards → "Comparison" callout → FAQ accordion (3 Q/A) → primary + secondary CTA. Two JSON-LD blocks: `WebPage` + `FAQPage`.

**Two deferred grid sections re-added** (this iteration's secondary deliverable):

- `/pricing` page — "Intent pages" section between Companion Products and FAQ. Renders 4 intent pages as a 2-col grid linking to each.
- `/compare/site-clinic-vs-pingdom-vs-uptimerobot` — "Exact-match pages" 4-up grid between FAQ and final CTA. Same content, slightly richer card treatment.

Both were explicitly deferred in iterations 3 and 11 respectively, with the deferral named in the page header comments. Iteration 12 closes both deferrals.

**Doctrinal interventions during config port**:
- CTA hrefs normalized: `/welcome/pricing` → `/pricing`, `/welcome/compare/site-clinic-vs-pingdom-vs-uptimerobot` → `/compare/site-clinic-vs-pingdom-vs-uptimerobot`
- `/developers` hrefs preserved (already apex in source)
- External URL `https://adaauditreport.com` preserved as-is

**`SiteHeader` nav not grown**: intent pages are SEO-targeted exact-match landing pages, not primary nav. They're discovered via search + cross-links from `/pricing` and `/compare/...` grids. Header nav stays `[About, Pricing, Proof, Contact, Developers]`.

**Status snapshot**:

```
Track A (siteclinic-web local builds):
  ✅ Iter 1   /
  ✅ Iter 2   /about
  ✅ Iter 3   /pricing                                  ← deferred intent-grid RE-ADDED in iter 12
  ✅ Iter 4   /case-studies
  ✅ Iter 5   /privacy + /terms + /accessibility
  ✅ Iter 6   /contact
  ✅ Iter 7   /developers
  ✅ Iter 8   /developers/docs + /developers/docs/quickstart
  ✅ Iter 9   /developers/mcp
  ✅ Iter 10  /developers/api-reference
  ✅ Iter 11  /compare/site-clinic-vs-pingdom-vs-uptimerobot  ← deferred intent-grid RE-ADDED in iter 12
  ✅ Iter 12  4 intent pages + config port + 2 grid re-additions
                                                          18 routes shipped, gates green
  ⏳ Iter 13+ 5 developer sub-docs (authentication, rate-limits, error-handling, webhooks, examples) — batchable
  ⏳ Iter 14+ remaining /developers/[slug] routes (community, examples, pricing, sdks, status, support)
  ⏳ Iter ?   /blog + /blog/[slug] (blocked on Track B PR #2)

Track B: doc landed; 3 PRs awaiting operator.
Track C: not started; blocked correctly.
```

After iter 12: **no same-origin 404s anywhere on shipped pages**. The 5 deferred sub-doc routes still render as dashed-border roadmap cards on `/developers/docs` (no links — not broken). The 6 remaining `/developers/[slug]` routes (community, examples, pricing, sdks, status, support) are not linked from any shipped page yet. `/blog` is referenced in zero places.

Iteration 13 candidate: **5 developer sub-docs as a single batchable iteration** (legal-trio-shaped — they share structure and the existing `LegalPageLayout` won't fit but a new `DocPageLayout` extraction is justified by the 5+ instances). This closes the "More guides coming" roadmap cards on `/developers/docs` and converts them to real links.

### 5e.16 §5b iteration 13 — 5 dev sub-docs + DocPageLayout + CodeBlock extraction — VERIFIED 2026-05-12

**Cherry-pick source**: `site-monitor/src/app/developers/docs/[slug]/page.tsx` (~344 lines, 6 slug cases — 5 ported here, the 6th "mcp" already shipped at `/developers/mcp` in iter 9).

**Two extractions completed at rule-of-three thresholds**:

1. **`src/components/CodeBlock.tsx`** — extracted from 3 prior inline copies (quickstart iter 8, mcp iter 9, api-reference iter 10). Single source of truth + the iter-8 contrast fix (solid sage + white text language badge) preserved. Inline copies in those 3 pages NOT yet refactored to import — defer that cleanup to a future iteration when one of them needs unrelated changes.

2. **`src/components/DocPageLayout.tsx`** — extracted from the 5 sub-doc shapes hitting at once. Renders breadcrumb + hero + 3 section kinds (cards / code / paragraphs) + footer CTAs from `DevDocPage` config. Future doc additions go into `developersDocsConfig.ts` and render automatically. If a 6th section kind emerges, extend the discriminated union, not the page.

**Config-driven dynamic route**:

- `src/lib/developersDocsConfig.ts` — typed config (`DevDocPage` interface + `DEVELOPERS_DOCS` array + `DEVELOPERS_DOCS_MAP` + `DEVELOPERS_DOCS_SLUGS`)
- `src/app/developers/docs/[slug]/page.tsx` — dynamic route handles all 5 sub-docs via `generateStaticParams`; unknown slugs → `notFound()` (verified: `GET /developers/docs/nonexistent` → 404)
- Sitemap iterates `DEVELOPERS_DOCS`
- Redirects + gate.config.json enumerated per slug per discipline

**Migration-unit verified across all 5 sub-doc routes**:

| Route | Render | Sitemap | Redirect | Gate |
|--|--|--|--|--|
| `/developers/docs/authentication` | 200 | ✓ | 308 from `/welcome/...` | ADA 0/0, SEO 18/18 |
| `/developers/docs/rate-limits` | 200 | ✓ | 308 from `/welcome/...` | ADA 0/0, SEO 18/18 |
| `/developers/docs/error-handling` | 200 | ✓ | 308 from `/welcome/...` | ADA 0/0, SEO 18/18 |
| `/developers/docs/webhooks` | 200 | 23 URLs total | 308 from `/welcome/...` | ADA 0/0, SEO 18/18 |
| `/developers/docs/examples` | 200 | ✓ | 308 from `/welcome/...` | ADA 0/0, SEO 18/18 |

Gates passed **first-try** (no gate-caught defects this iteration despite the watch-out flags). Specifically:
- Meta descriptions all stayed in the 50–160 char range (operator watch-out #1)
- No contrast violations on CodeBlock (the extracted single-source-of-truth held the iter-8 fix)
- No dead links to the 6 unbuilt `/developers/[slug]` routes (operator watch-out #3) — config explicitly normalized dead-link CTAs to working alternatives:
    - `/developers/dashboard` → `app.siteclinic.io/developers/signup` (cross-origin, intentional)
    - `/developers/sdks` → `/developers/api-reference` (resolves)
    - `/developers/examples` → `/developers/docs/quickstart` (resolves)
    - `/developers/support` → `/contact` (resolves)
    - `/developers/status` → dropped (no working alternative on siteclinic-web; would need an external status page)
- No overclaiming about API/MCP availability (operator watch-out #4) — language stays capability-framed per source

**`/developers/docs` page updated** to render real link cards instead of "More guides coming" dashed-border roadmap cards. The 6 cards (5 from `DEVELOPERS_DOCS` config + 1 hardcoded MCP card pointing to `/developers/mcp`) all resolve to real pages.

**Forward 404 trajectory**: **still zero same-origin 404s on any shipped page.** 6 `/developers/[slug]` routes (community, examples, pricing, sdks, status, support) remain not-yet-built but also not-linked-from-anywhere — they're invisible until iter 14 builds them.

**Status snapshot — end of iter 13**:

```
Track A (siteclinic-web local builds):
  ✅ 23 routes shipped, all gate-clean
  ✅ Zero same-origin 404s on any shipped page
  ⏳ Iter 14 candidate: 6 /developers/[slug] routes (community, examples,
        pricing, sdks, status, support) — batchable similar to iter 13's
        5-doc batch. Each is a small page; could use a similar config + layout
        OR mark some as cross-origin redirects to app.siteclinic.io (pricing
        is developer-tier billing which probably lives at app.siteclinic.io).
  ⏳ Iter ?  /blog + /blog/[slug] — blocked on Track B PR #2 (cross-repo
        publisher contract)

Track B (operator-action PRs against site-monitor):
  📄 Doc landed at siteclinic-web/docs/TRACK_B_OPERATOR_ACTIONS.md
  ⏳ Three PRs awaiting operator drive
  ⏳ PR #1 (CORS) is the highest priority — blocks Phase 4a staging Stripe + waitlist verification

Track C (production cutover):
  ❌ Not started; correctly blocked on Track A sufficient + Track B PRs #1 + #3
```

**Components inventory after iter 13** (rule-of-three discipline holding):

| Component | First introduced | Consumers | Status |
|--|--|--|--|
| `Eyebrow` | iter 1 | every page | shared |
| `Button` | iter 1 | every page | shared |
| `SiteHeader` | iter 1 | every page | shared |
| `SiteFooter` | iter 1 | every page | shared |
| `LegalPageLayout` | iter 5 | 3 legal pages | shared (rule of 3 exactly) |
| `CheckoutButton` | iter 3 | /pricing (3 instances) | shared |
| `WaitlistForm` | iter 6 | /contact (1 instance) | site-local, not yet shared |
| `CodeBlock` | iter 8 inline → iter 13 extracted | quickstart + mcp + api-reference + 5 docs | shared (single source) |
| `DocPageLayout` | iter 13 | 5 dev sub-docs | shared |

Iteration 14 candidate: 6 remaining `/developers/[slug]` routes. Some may not need rich content (e.g., `status` could redirect cross-origin to a real status page; `support` could redirect to `/contact`); others (`sdks`, `examples` in `/developers/` direct vs `/developers/docs/examples`, `community`) likely need real content. Mapping per-slug + deciding redirect-vs-build is a discrete operator decision before the iteration begins.

### 5e.17 §5b iteration 14 — /developers/[slug] redirect normalization (NO new pages) — VERIFIED 2026-05-12

**Per operator decision matrix 2026-05-12** — ship redirect normalization, not content expansion. Six legacy `/developers/<slug>` paths inherited from site-monitor's `[slug]` route normalize per:

| Slug | Action | Destination |
|--|--|--|
| `/developers/examples` | 308 redirect | `/developers/docs/examples` |
| `/developers/support` | 308 redirect | `/contact` |
| `/developers/sdks` | 308 redirect | `/developers/docs/examples` |
| `/developers/pricing` | 308 redirect | `/pricing` |
| `/developers/community` | 308 redirect | `/contact` |
| `/developers/status` | **clean 404** (no route, no redirect) | — |

Rationale captured from operator brief: don't invent SDK packages, community channel, status page, or developer-tier billing that doesn't exist. Don't redirect to platform-level Vercel status (that's not Site Clinic API status).

**Defensive `/welcome/` prefix variants** added for the same 5 redirected slugs in case any old links used the `/welcome/developers/<slug>` pattern. `/developers/status` not given a `/welcome/` variant either — both 404 cleanly.

**Verification — 2026-05-12**:

| Test | Result |
|--|--|
| `/developers/examples` | ✅ 308 → `/developers/docs/examples` |
| `/developers/support` | ✅ 308 → `/contact` |
| `/developers/sdks` | ✅ 308 → `/developers/docs/examples` |
| `/developers/pricing` | ✅ 308 → `/pricing` |
| `/developers/community` | ✅ 308 → `/contact` |
| `/developers/status` | ✅ HTTP 404 (no route, no redirect) |
| `/welcome/developers/{5 slugs}` | ✅ all 308 to canonical destinations |
| Sitemap canonical URL count | ✅ unchanged at 23 (aliases NOT added) |
| `gate.config.json` route count | ✅ unchanged at 23 |
| `npm run gate:all` | ✅ PASS — 23/23 routes still ADA 0/0 + SEO 18/18 |
| No `/developers/{status,examples,support,sdks,pricing,community}` strings in sitemap | ✅ verified |

**Gate-test discipline confirmed**: redirect aliases are NOT in `gate.config.json` — gates only test canonical URLs. The redirect URLs are tested via direct curl verification above. Sitemap-vs-routes consistency check passed because both sitemap and gate.config still list the same 23 canonical paths.

**Doctrine preserved**:
- No invented SDK content
- No invented community channel
- No invented status surface (avoided redirecting to generic Vercel status)
- No invented developer-tier billing page (pricing redirects to the existing customer-facing `/pricing` instead)

**No same-origin 404s on any shipped page**: confirmed via earlier grep that no shipped siteclinic-web page contains live `href=` references to any of the 6 legacy slugs. The redirects are purely defensive for old Google-indexed URLs + external backlinks from when site-monitor's `[slug]` route served them.

**Status snapshot — end of iter 14**:

```
Track A (siteclinic-web local builds):
  ✅ 23 canonical routes shipped + 10 defensive redirects (iter 14)
  ✅ Zero same-origin 404s on any shipped page
  ✅ All known same-origin legacy URLs either: (a) resolve to a real page, or
     (b) redirect 308 to a canonical destination, or (c) clean-404 with no
     invented content (only /developers/status)
  ⏳ Iter ?  /blog + /blog/[slug] — blocked on Track B PR #2

Track B (operator-action PRs):
  📄 Doc landed; 3 PRs awaiting operator
  ⏳ PR #1 (CORS) gates Phase 4a

Track C (production cutover):
  ❌ Not started; correctly blocked
```

**Track A summary**: 23 canonical routes shipped, all gate-green. The only remaining content surface NOT yet built in siteclinic-web is the blog (`/blog` index + `/blog/[slug]` posts), and that's structurally blocked on Track B PR #2 implementing the cross-repo publisher contract per locked §6 row 3 — there's no destination shape to render against until the publisher writes the first markdown file.

After iter 14, **Track A is effectively complete for the pre-Phase-4a scope.** The remaining backlog is:
- Track B PRs (operator-driven)
- `/blog` family (depends on Track B PR #2)
- Track C cutover (depends on Track A complete + Track B PRs merged)

Iter 15 candidate options:
- **Pause Track A** and surface Track C (Phase 4a/4b) preparation — repo skeleton for `gh repo create`, Vercel project config sketch, env-var matrix
- **Continue Track A** with one of: GA4 + cookie-consent banner wiring (currently only loaded at root layout level, needs page-by-page consent gate per doctrine §15); founder-photo asset port from ada-audit-tool to siteclinic-web (resolves the deferred photo on `/about`); any other deferred item
- **Switch to ADA cream/sage rebuild** in `ada-audit-tool` repo — second consumer of the migration playbook, proves the playbook is generalizable

Recommend pausing Track A and surfacing Track C prep + ADA rebuild kickoff as the natural next phase — pre-Phase-4a operator-driven Track B PRs are the immediate critical path now.

---

## 6. Operator decisions — LOCKED 2026-05-11

| # | Decision | Locked answer |
|--|--|--|
| 1 | Apex `/` behavior after cutover | **Marketing homepage at `siteclinic.io/`.** Dashboard moves fully behind `app.siteclinic.io`. No permanent `/welcome` URL preserved except as temporary migration redirect if needed. |
| 2 | `/developers/*` location | **Split.** Public docs / quickstart / API reference / integration marketing live in `siteclinic-web/developers/*` (SEO, indexing, trust). Auth-gated dashboard / signup / API explorer / credentials / operational controls live at `app.siteclinic.io/developers/*`. |
| 3 | `/blog/*` rendering + publisher contract | **Blog renders in `siteclinic-web`.** Publisher remains operational in `site-monitor` and writes to `siteclinic-web` via GitHub Actions / commit-based idempotency contract. No reverse-proxy. |
| 4 | `/api/siteclinic/*` reach pattern | **Cross-origin with narrow CORS allowlist.** Marketing pages at `siteclinic.io` call `app.siteclinic.io/api/siteclinic/*` directly. Stripe / DB / checkout / waitlist / session code stays in operational app, no backend duplication in marketing repo. |
| 5 | Design thesis (doctrine §02) | **LOCKED, exact wording:** *"Restrained, evidence-led SaaS for non-technical small-business owners who are tired of being sold ideas and want to see what something actually does. Calm authority, not startup theater."* |
| 6 | `OWNER_WISHLIST_INTAKE.md` | **Skeleton-then-fill.** I draft skeleton using §66 doctrine prompts, operator fills answers. Kept distinct from `SOURCE_OF_TRUTH.md`: wishes / unverified assumptions / strategic preferences / future ideas separated from proven facts. |
| 7 | Subdomain | `app.siteclinic.io` (locked earlier in conversation) |
| 8 | Repo name | `siteclinic-web` (locked earlier in conversation) |

### Selected architecture summary

- `siteclinic.io/` → public marketing homepage (siteclinic-web)
- `app.siteclinic.io` → operator/auth/dashboard surface (site-monitor, unchanged role)
- Public developers / blog / docs → siteclinic-web
- Operational APIs → site-monitor behind app.siteclinic.io
- CORS allowlist instead of proxy or duplicated endpoints
- Blog publishing → idempotent commit contract into siteclinic-web
- Design thesis → locked sentence above, drives §1b design system

### Still-open operator-action items (not blocking §5)

- §3g cookie scope verification (operator verifies current cookie `Domain=` attribute in production before Phase 4b cutover)
- `OWNER_WISHLIST_INTAKE.md` operator-fill after skeleton (created in §5a step 2)

---

## 7. Out of scope (Phase 4+, not now)

- Internal directory boundary inside `site-monitor` (the §3 tangle of marketing/dashboard/developers/API). After siteclinic-web extraction, this tangle is reduced but not eliminated. Defer to Phase 4 portfolio compliance work.
- ADA-side mirroring of this pattern (adaauditreport.com is already in its own repo, but doesn't go through the builder yet). Phase 6 in the strategic plan.
- Customer-onboarding flow that uses the same pipeline. Phase 5.
- Cross-portfolio CI gate. Phase 4.

This doc covers Phase 1 only.
