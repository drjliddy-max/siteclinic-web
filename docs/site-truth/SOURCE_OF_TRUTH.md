# SOURCE_OF_TRUTH — siteclinic.io

> Doctrine: `/Users/johnliddy/Desktop/Projects/build-websites-template/01-discovery-and-source-of-truth.md`
>
> Non-negotiable (doctrine §76): *The source-of-truth doc outranks the old site, mockups, and remembered details.*
>
> Confidence tiers used below:
> - **VERIFIED-REPO** — cited from source file with path (and line where applicable)
> - **VERIFIED-LIVE** — verified against the production deployment by the operator
> - **NEEDS_VERIFICATION** — claim cannot be grounded in the repo; operator confirmation required
>
> No field is left implicit. If it cannot be verified, it is marked.

---

## 1. Basic info

| Field | Value | Confidence |
|--|--|--|
| Legal/business name | — | **NEEDS_VERIFICATION** (no entity name in repo) |
| DBA / brand name | Site Clinic | **VERIFIED-REPO** (`src/app/welcome/page.tsx:24`, `layout.tsx:17`) |
| Canonical domain | `siteclinic.io` | **VERIFIED-REPO** (`page.tsx:11`, `vercel.json` host redirects, Vercel project mapping) |
| Secondary domains / aliases | `www.siteclinic.io` | **VERIFIED-REPO** (`vercel.json` redirects `www.` → apex) |
| Mailing address | — | **NEEDS_VERIFICATION** (not in repo) |
| Phone | — | **NEEDS_VERIFICATION** (not in repo) |
| Primary contact email | `hello@siteclinic.io` | **VERIFIED-REPO** (`page.tsx:60` JSON-LD `publisher.email`) |
| Hours | — | **NEEDS_VERIFICATION** (SaaS — likely N/A; operator confirms whether a support window should be published) |
| Founder | John Liddy | **VERIFIED-REPO** (`page.tsx:64-72` JSON-LD `creator`, `page.tsx:86-89` `ORGANIZATION_SCHEMA.founder`) |
| Founder role | Founder | **VERIFIED-REPO** (`page.tsx:66`) |

---

## 2. Positioning

> Doctrine: who the business is for, what it leads with, what should not be emphasized.

### Who Site Clinic is for
- Small-business website owners who need ongoing technical health, ADA, SEO, and AI-retrieval monitoring
- Agencies running multiple client sites under one operating loop (Agency tier targets up to 25 sites)
- Developer teams that want Site Clinic capabilities through a public API or MCP layer rather than a dashboard
- Confidence: **VERIFIED-REPO** — derived from `page.tsx` pricing tier copy and `DEVELOPER_OFFERINGS` array, lines 113–154.

### What Site Clinic leads with
- Evidence over claims ("Claims stay inside the evidence we can actually show.")
- One operating loop: measure → diagnose → recommend → implement → verify → prove
- Recurring monitoring as the product; one-time audits live on adaauditreport.com
- Confidence: **VERIFIED-REPO** — `page.tsx` loop section and footer disclaimer.

### What Site Clinic does NOT emphasize
- Lawsuit fear / legal-risk framing — Site Clinic stays technical and outcome-led; legal framing lives on adaauditreport.com only (per ada-audit-tool CLAUDE.md Hard Gate Rule)
- "Comprehensive / complete / fully compliant" language (banned per global CLAUDE.md §16 + ada-audit-tool §93)
- Generic SaaS aesthetics (per `02-design-direction.md` anti-patterns)
- Multiple competing accent colors / decorative dark-mode-by-default

---

## 3. Team

| Member | Credential / role | Publishability |
|--|--|--|
| John Liddy | Founder | **VERIFIED-REPO** — name + role published in JSON-LD on both siteclinic.io and adaauditreport.com |
| — | — | **NEEDS_VERIFICATION** — is anyone else publishable as team? Site Clinic's `page.tsx` references no other named individuals. Operator confirms team list. |

Photo assets candidate inventory:
- `/Users/johnliddy/Desktop/Projects/ada-audit-tool/site/john-liddy.jpg` — exists; reuse on siteclinic.io requires operator approval
- `/Users/johnliddy/Desktop/Projects/ada-audit-tool/site/john-liddy-author.jpg` — exists, currently used as Open Graph image on adaauditreport.com; reuse on siteclinic.io requires operator approval

---

## 4. Product surface

> What Site Clinic actually sells. This must match dashboard reality and Stripe configuration exactly (cross-portfolio truth rule).

### Subscription tiers
| Tier | Price | Limit | Trial | Source |
|--|--|--|--|--|
| Basic | $49 / month | 1 site | 14-day free trial | **VERIFIED-REPO** `page.tsx:610-630` |
| Pro | $149 / month | Up to 5 sites, 25 pages each | 14-day free trial | **VERIFIED-REPO** `page.tsx:632-655` |
| Agency | $349 / month | Up to 25 sites, 25 pages each | 14-day free trial | **VERIFIED-REPO** `page.tsx:657-678` |

JSON-LD `Offer` block declares `priceCurrency: "USD"` (page.tsx:46-55). **NEEDS_VERIFICATION**: confirm Stripe products + prices match these tier figures exactly in the live Stripe dashboard.

### Companion / cross-sell product
- **ADA Audit Report** — one-time $49 audit, lives at adaauditreport.com — **VERIFIED-REPO** (`page.tsx:681` footer cross-link)

### Developer surface
- **Perfect Website API** — public REST + JS/Python SDKs — **VERIFIED-REPO** (`page.tsx:113-133` DEVELOPER_OFFERINGS[0])
- **Site Clinic MCP** — Model Context Protocol tool layer — **VERIFIED-REPO** (`page.tsx:134-154` DEVELOPER_OFFERINGS[1])
- Both gated by API key auth + Stripe-backed billing — **VERIFIED-REPO** (welcome page copy; mcp-server.ts in site-monitor)

### What Site Monitor actually monitors per onboarded site (doctrine §29)
- uptime
- redirects
- SEO checks
- security headers
- performance
- ADA / accessibility findings
- Search Console visibility
- GA4 engagement
- AI referrer visibility where applicable

Source: `build-websites-template/04-tracking-and-monitoring.md:27-39`. Each must remain reflected in dashboard reality.

---

## 5. Reputation signals

| Platform | Status |
|--|--|
| Case studies | Live (linked from `page.tsx:238` "See the proof" → `/case-studies`); also `src/app/case-studies/` directory exists. Specific approved case studies: **NEEDS_VERIFICATION** |
| Reviews on external platforms | **NEEDS_VERIFICATION** |
| Industry recognitions | **NEEDS_VERIFICATION** |
| Certifications | **NEEDS_VERIFICATION** (axe-core engine usage is verified on ada side; on Site Clinic side this is implicit) |
| Associations | **NEEDS_VERIFICATION** |
| Portfolio cross-references (`sameAs`) | **VERIFIED-REPO** — `page.tsx:67-73`: adaauditreport.com, theparticipationeffect.com, daily-rise.com |

---

## 6. Tracking + monitoring (doctrine §04 compliance)

| Element | Status | Confidence |
|--|--|--|
| GA4 measurement ID `G-CKCC40VRPH` | Loaded via `next/script strategy="lazyOnload"` | **VERIFIED-REPO** `page.tsx:167-176` |
| Cookie consent banner gating GA4 | — | **NEEDS_VERIFICATION** — doctrine §15 requires GA4 to load only after consent; need to confirm welcome page consent gate matches the pattern used in `ada-audit-tool/site/index.html` (which gates on `localStorage.getItem('cookies_ok')`) |
| Privacy policy reflects actual tracking behavior | — | **NEEDS_VERIFICATION** — `welcome/privacy/page.tsx` exists but I have not verified its content matches actual GA4 + Stripe + Inngest tracking |
| Search Console property verified | — | **NEEDS_VERIFICATION** — operator confirms |
| Sitemap reachable at `/sitemap.xml` | — | **NEEDS_VERIFICATION** — `src/app/sitemap.ts` exists in repo, must confirm output |
| `robots.txt` reachable | — | **NEEDS_VERIFICATION** — `src/app/robots.ts` exists in repo, must confirm output |

---

## 7. Site Monitor onboarding state (doctrine §06 compliance)

| Required entry | Status |
|--|--|
| Client row in `src/config/clients.ts` for `siteclinic.io` | **NEEDS_VERIFICATION** — must verify the parent platform self-monitors. This is the recursive dogfooding requirement from the platform plan §5 layer 4. |
| Site config entry in the health route | **NEEDS_VERIFICATION** |
| SEO config entry | **NEEDS_VERIFICATION** |
| Search Console property entry | **NEEDS_VERIFICATION** |
| GA4 hostname mapping includes `siteclinic.io` and `www.siteclinic.io` | **NEEDS_VERIFICATION** |
| Scoped dashboard renders for the slug | **NEEDS_VERIFICATION** |

Reference example to mirror: `liddy-podiatry-site` / `liddypodiatry.com` — doctrine §34 names Liddy as the reference. Replicate the same config shape for Site Clinic itself.

---

## 8. Security + a11y baseline (doctrine §03 compliance)

| Required header / behavior | Status |
|--|--|
| `Strict-Transport-Security` | **NEEDS_VERIFICATION** |
| `X-Content-Type-Options: nosniff` | **NEEDS_VERIFICATION** |
| `X-Frame-Options: SAMEORIGIN` | **NEEDS_VERIFICATION** |
| `lang="en"` on `<html>` | **VERIFIED-REPO** (`layout.tsx:33`) |
| Semantic landmarks (`<main>`, `<nav>`, `<header>`, `<footer>`) | **VERIFIED-REPO** (`welcome/page.tsx:178, 200`) — partial; full audit pending |
| Visible focus states | **NEEDS_VERIFICATION** |
| Accessible color contrast | **NEEDS_VERIFICATION** — the inline `PALETTE` was never run through a contrast audit; the dashboard tokens in `globals.css` were not (this is the same kind of audit that produced ADA's `#B84616`-not-`#E8622A` correction) |
| Forms with labels + instructions | **VERIFIED-REPO** — partial; `CheckoutButton.tsx` form has proper `<label>` + `aria-describedby` |

---

## 9. Design tokens currently in use

> Doctrine §57: palette tokens are a required design deliverable. They must live in a tokens module, not inline literals.

Currently, the welcome page uses an **inline JS object** rather than tokens (`src/app/welcome/page.tsx:102-111`):

```ts
const PALETTE = {
  bg: "bg-[#FAF7F2]",          // cream background
  surface: "bg-white",
  ink: "text-[#1F2937]",
  inkSoft: "text-[#6B7280]",
  line: "border-[#E5DCC8]",    // warm cream border
  sage: "bg-[#3D7468]",        // primary sage
  sageText: "text-[#3D7468]",
  sageHover: "hover:bg-[#264C44]",
};
// Plus inline elsewhere: border-[#D9CFBA] (inner card border), hover:bg-[#F8F5EF] (secondary button hover)
```

The actual token block in `globals.css` is for the DARK DASHBOARD theme, not the welcome page, and contains no cream/sage tokens. This is a doctrine violation that the Phase 3 rebuild must close.

Fonts currently declared:
- `Geist`, `Geist_Mono` — loaded via `next/font/google` in `layout.tsx` — **VERIFIED-LOADED**
- `'DM Serif Display'` — referenced inline on every heading via `style={{ fontFamily: ... }}` — **DECLARED BUT NEVER LOADED**, falls back to `Georgia, serif`. Confirmed via grep across the repo.

This is the second doctrine violation — every declared font token must have a loader.

---

## 10. Accuracy deltas (doctrine §61)

| Field | Current state | Verified target | Action needed |
|--|--|--|--|
| Design tokens | Inline JS object in `welcome/page.tsx` | Tokens module (CSS custom properties or Tailwind v4 `@theme`) | Phase 3 — refactor during SC marketing rebuild |
| DM Serif Display | Declared inline, never loaded | Load via `next/font/google` or remove the declaration | Phase 3 |
| Marketing page structure | 887-line single-file `welcome/page.tsx` | Decomposed into named components per doctrine §53 | Phase 3 |
| Internal directory boundary | Marketing + dashboard + developers + API + crons + MCP all in `src/app/` | Enforced sub-tree per concern (`src/marketing/`, `src/app/(dashboard)/`, etc.) | Phase 4 |
| Self-monitoring | siteclinic.io not (yet verified to be) in its own clients.ts | clients.ts row + Search Console property + GA4 host map for siteclinic.io | Phase 4 |
| Cookie consent gate | Status unknown | GA4 loads only after consent; banner present | **NEEDS_VERIFICATION** then Phase 3 fix if missing |
| Repo naming inversion | Repo is `site-monitor`, deploys are `siteclinic.io` | Either rename the repo to `siteclinic` or document the inversion in repo README + Vercel project description | Phase 4 — operator decision |

---

## 11. Cross-portfolio truth constraints

Per global CLAUDE.md "ADA business model IS trust and truth" and ada-audit-tool's equality doctrine, the following must remain consistent across all surfaces:

- Pricing tiers shown on siteclinic.io = Stripe products = customer dashboard plan limits
- ADA score on siteclinic.io for any monitored site = canonical audit value from ada-audit-tool service (no client-side derivation)
- Plan feature lists on siteclinic.io = `automationTruth.ts` capability surface
- Portfolio cross-references (`sameAs`) consistent with adaauditreport.com's structured data

A divergence in any of these is a P0 trust violation per the operator rule "one drift visible to a customer = customer lost permanently."

---

## 12. Open verification items (operator action)

1. **Legal entity, address, phone** — fill §1.
2. **Cookie consent gate** — verify present or implement (§6).
3. **Sitemap + robots.txt live output** — verify generated output matches doctrine (§6).
4. **Search Console property** — verify or create (§7).
5. **Security headers** — verify or add via Next.js middleware / `vercel.json` (§8).
6. **Self-monitoring row** — verify siteclinic.io is in `src/config/clients.ts` and onboarded (§7).
7. **Approved case studies + photos** — confirm publish-rights inventory (§5, §3).
8. **Stripe product-to-tier mapping** — verify Stripe dashboard shows exactly Basic $49 / Pro $149 / Agency $349 (§4).
9. **Privacy policy accuracy** — confirm `/welcome/privacy/page.tsx` content matches actual GA4 + Stripe + Inngest + MCP behavior (§6).

Once these are resolved, this SOURCE_OF_TRUTH becomes the load-bearing reference for the Phase 3 rebuild and for every cross-portfolio claim referencing siteclinic.io.
