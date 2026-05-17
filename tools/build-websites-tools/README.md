# build-websites-tools

Shared build-time enforcement gates for every owned portfolio website. **Build script once, use many.**

> Companion to `~/Desktop/Projects/build-websites-template/` — the methodology (markdown docs). This package is the implementation (executable gates) of the methodology's QA layer.

## What it provides

| Gate | What it enforces |
|--|--|
| `gate-ada` | WCAG 2.1 AA via axe-core/playwright. Fails on any critical/serious/moderate violation across every route in `gate.config.json`. Same engine ada-audit-tool sells as a $49 product. |
| `gate-seo` | Google indexing rules at BUILD TIME: HTTP 200, no `<meta robots noindex>`, no `X-Robots-Tag: noindex`, canonical matches request path, sitemap-vs-routes consistency, robots.txt valid, structural meta (title 10-70ch, description 50-160ch, OG, Twitter card, single h1, heading hierarchy, image alt), JSON-LD present, sitemap-backed route coverage, and internal-link canonicality (no links to redirect aliases or off-sitemap pages unless explicitly allowlisted). Blocks the exact failure modes Google flags as "Excluded by noindex," "Page with redirect," and "Discovered, currently not indexed." |

## Consumption pattern (per site)

Each consuming site (`siteclinic-web/`, future ADA rebuild, future daily-rise refresh, etc.) carries **two files only** for gate wiring:

### 1. `package.json` — file dep + scripts

```json
{
  "devDependencies": {
    "build-websites-tools": "file:./tools/build-websites-tools"
  },
  "scripts": {
    "gate:ada": "gate-ada",
    "gate:seo": "gate-seo",
    "gate:all": "npm run gate:ada && npm run gate:seo",
    "prebuild": "npm run gate:all"
  }
}
```

### 2. `gate.config.json` — site-specific config

```json
{
  "routes": ["/", "/about", "/pricing"],
  "baseUrl": "http://localhost:3000",
  "allowedOffSitemapRoutes": ["/thank-you"],
  "expectedRedirects": [
    { "source": "/old-pricing", "destination": "/pricing", "status": 308 }
  ],
  "queryLandingPages": [
    {
      "route": "/pricing",
      "query": "website audit pricing",
      "requiredTerms": ["website", "audit", "pricing"]
    }
  ]
}
```

That's it. No gate logic in the site repo. No copy-pasted scripts. No drift surface.

Important boundary for standalone website repos:

- `file:../build-websites-tools` is only safe inside the parent local workspace
- standalone GitHub/Vercel repos must vendor the package under `tools/build-websites-tools`
- standalone consumers should keep the portable gate contract: browser mode when Chromium is available, truthful JSDOM HTML-snapshot fallback when cloud builders cannot launch Chromium

## Config schema

| Field | Required | Type | Validation |
|--|--|--|--|
| `routes` | yes | `string[]` | Non-empty, every entry must start with `/` |
| `baseUrl` | yes | `string` | Must start with `http://` or `https://`. Can be overridden by `GATE_BASE_URL` env var (useful for running gates against staging or production from CI). |
| `launchCommand` | no | `string` | Shell command the gate can use to start a local server when `baseUrl` is local and nothing is already listening. |
| `startupTimeoutMs` | no | `number` | Positive integer wait budget for `launchCommand` readiness. |
| `allowedOffSitemapRoutes` | no | `string[]` | Internal same-origin paths intentionally linked but excluded from sitemap (for example a thank-you page). Every entry must start with `/`. |
| `expectedRedirects` | no | `{ source, destination, status }[]` | Redirect contracts the SEO gate verifies. `source` and `destination` must start with `/`; `status` must be a 3xx integer. |
| `queryLandingPages` | no | `{ route, query, requiredTerms? }[]` | Strategic landing pages that must stay query-matched, internally discoverable, and present in both `routes` and the sitemap. `route` must start with `/`; `query` must be non-empty; `requiredTerms` entries must be non-empty strings. |

Validation is strict: malformed or missing `gate.config.json` exits with a loud error message, not a silent default.

## Runtime requirements

Consuming site must have:
- A running web server at `baseUrl` (typically `npm run dev` in another terminal during local development, or `next start` / static-served `site/` for static sites)

The gates assume the routes in `gate.config.json` are reachable at `baseUrl + route`. `gate:seo` is browserless and now also checks every sitemap-backed page plus internal same-origin links, so redirect aliases and orphaned pages fail during the build instead of surfacing later in Search Console. `gate:ada` uses a real browser when Chromium is available and falls back to a JSDOM HTML snapshot when it is not. That keeps standalone cloud builds portable without turning the gate into silent static analysis.

`queryLandingPages` adds the next layer: it fails the build if a declared high-value landing page stops behaving like the obvious answer surface for the query it is supposed to win. The gate enforces that each declared landing page:

- exists in the canonical route contract;
- exists in the sitemap;
- is linked from another canonical page;
- keeps query-match signals in its title/H1/meta summary.

## Page win rule

The builder is not just a tag-checker. Every generated page should be built to win the full search and conversion chain:

1. match a real tracked query closely enough to earn impressions;
2. present a title/meta/opening block strong enough to capture clicks for its position;
3. make the owned domain and the specific page the obvious answer surface for the query;
4. carry enough proof, trust, and structure that the page can be cited instead of a generic homepage;
5. move the visitor into the intended next action instead of stopping at "traffic happened."

Short version:

`query intent -> impression -> CTR capture -> answer ownership -> conversion`

The practical builder rule is:

- do not build generic SEO pages;
- do not expect the homepage to resolve every intent;
- build exact-match pages for high-value query clusters;
- make the correct page, not just the correct domain, easy for search and AI systems to choose;
- include the trust/proof/CTA structure needed for the page to convert after it ranks.

Builder truth boundary:

- the builder can enforce `100%` of the canonical surface is technically indexable and strategically coherent;
- the builder cannot force Google to recrawl immediately;
- Search Console cleanup after a fix may lag, but shipping a technically broken crawl graph is never acceptable.

This doctrine is what turns "a better page" into a reusable build pattern for every future site.

## Status

**Phase 1**: gate-ada + gate-seo, consumed by `siteclinic-web` only.

**Phase B (future)**: extract template scaffolding so `npx create-siteclinic-web` produces a doctrine-compliant site skeleton from a single `site.config.ts` input. Package structure here is already compatible with that shape — don't pre-build the generator until rule-of-three is satisfied (2-3 hand-built consumers).

## Anti-patterns

Refuse:
- Re-implementing `gate:ada` inside a consuming site's `scripts/` directory because "we need a slightly different axe config." Extend the shared gate or accept the shared config.
- Sites that carry their own `gate-*.ts` files. After this package exists, that pattern is a drift surface.
- Bypassing `prebuild` with `--no-verify` or skipping the gate. The "100/100 ADA + Google indexing rules enforced" doctrine is non-negotiable per operator directive 2026-05-11.

## Source

- Operator directives:
  - 2026-05-11 "every owned website must be authored through build-websites-template + design-os-template"
  - 2026-05-11 "build script once, use many"
- Reference memory:
  - `~/.claude/projects/-Users-johnliddy-Desktop-Projects-BabyMilestone/memory/feedback_websites_built_through_builder_tool.md`
  - `~/.claude/projects/-Users-johnliddy-Desktop-Projects-BabyMilestone/memory/feedback_builder_tool_proto_patterns.md`
