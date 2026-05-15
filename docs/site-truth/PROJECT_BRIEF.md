# PROJECT_BRIEF — siteclinic.io

> Doctrine: `/Users/johnliddy/Desktop/Projects/build-websites-template/01-discovery-and-source-of-truth.md`
>
> Companion docs (same directory):
> - `SOURCE_OF_TRUTH.md` — verified facts about Site Clinic the business
> - `ENTITLEMENT_CONTRACT.md` — canonical free / trial / paid / revocable boundary
> - `OWNER_WISHLIST_INTAKE.md` — owner wishes, separated from verified facts (pending)
>
> Status: **Phase 0 draft**. Source-grounded where possible, flagged where verification is required.

---

## 1. Site identity

| Field | Value | Confidence |
|--|--|--|
| Canonical domain | `siteclinic.io` | Repo-confirmed (`site-monitor/src/app/welcome/page.tsx:11`, `vercel.json` host redirects) |
| Production repo | `github.com/drjliddy-max/site-monitor` | Vercel-confirmed |
| Production framework | Next.js 16.2.1, React 19.2 | Repo-confirmed (`package.json`) |
| GA4 measurement ID | `G-CKCC40VRPH` | Repo-confirmed + doctrine-shared (`build-websites-template/04-tracking-and-monitoring.md:11`) |
| Stripe billing | Live | Repo-confirmed (`stripe` dep + setup scripts) |
| Founder | John Liddy | Repo-confirmed (`page.tsx:64-72` JSON-LD) |
| Contact email | `hello@siteclinic.io` | Repo-confirmed (`page.tsx:60` JSON-LD) |
| Cross-references (JSON-LD `sameAs`) | adaauditreport.com, theparticipationeffect.com, daily-rise.com | Repo-confirmed (`page.tsx:67-73`) |

---

## 2. Top 3 business goals

> Doctrine prompt: *What are the top 3 business goals for the website?*

1. **Be the parent sales platform for the connected portfolio.** Site Clinic sells every recurring-value service the workspace produces (monitoring, blog automation, AI/SEO instrumentation, developer API access). Every child product is acquired or upsold through this surface, not by isolating its own sales funnel.
2. **Convert technical trust into paid recurring monitoring.** The 30-day free trial → Basic ($49) / Pro ($149) / Agency ($349) ladder is the primary revenue funnel. Marketing exists to move evidence-led visitors into trial, not to sell ideas about visibility.
3. **Demonstrate the platform by running on it.** Every claim Site Clinic makes about monitoring, ADA, SEO, AI visibility, and blog automation must be visibly true *of siteclinic.io itself*. Recursive dogfooding is the proof of service.

**`NEEDS_VERIFICATION`**: confirm these are the operator's actual top 3 vs. an inferred reading of current copy and pricing.

---

## 3. First action a new visitor should take

> Doctrine prompt: *What action should a new visitor take first?*

**Verified-from-current-implementation**: the live primary CTA is **"Start free trial"** (hero + nav + pricing), opening `CheckoutButton` → Stripe checkout. Secondary CTA is **"See the proof"** → `/case-studies`.

**`NEEDS_VERIFICATION`** (operator decision for the rebuild):
- Should the rebuild keep "Start free trial" as the single primary action, or split between trial start and developer/MCP signup (since the developer layer is now a real second funnel)?
- Should the secondary path lead to case studies, to the developer docs, or to a free public scan (the current cross-link points to adaauditreport.com)?

---

## 4. What the site should feel like

> Doctrine prompt: *What should the site feel like?*

Working hypothesis from current copy and pricing:

> *Restrained, evidence-led SaaS aesthetic for non-technical small-business owners who are tired of being sold ideas and want to see what something actually does. Calm authority, not startup theater.*

Translation rules (per `02-design-direction.md`):
- keep evidence-led, not jargon
- keep professional, not generic SaaS
- keep clarity, not minimalism-as-aesthetic
- keep portfolio coherence, not isolated visual identity per child product

**`NEEDS_VERIFICATION`**: confirm the one-sentence thesis above is the operator's intent, or rewrite. Doctrine requires exactly one sentence.

---

## 5. Must stay from the current site

> Doctrine prompt: *What must stay from the old site?*

Drawn from current `src/app/welcome/page.tsx`:

- The 30-day free trial framing on every tier
- The three-tier ladder (Basic $49 / Pro $149 / Agency $349) and "Most popular" emphasis on Pro
- The cream + sage palette direction (`#FAF7F2` background, `#3D7468` accent) — see `SOURCE_OF_TRUTH.md` for the exact tokens currently in use
- The portfolio cross-references in JSON-LD (`sameAs`) — these are SEO + entity-graph load-bearing, not decoration
- The shared GA4 ID `G-CKCC40VRPH` per workspace doctrine
- The honest-evidence language ("Claims stay inside the evidence we can actually show.") — this is the brand voice
- The dual developer offerings (Public API + MCP) — both are real product surfaces with real Stripe-backed accounts
- The entitlement boundary: customer-owned websites and exported artifacts stay portable; Site Monitor, connected data, API/MCP execution, scheduler jobs, Blog Writer operations, and future proof generation are subscription-controlled

**`NEEDS_VERIFICATION`**: operator confirms or strikes each.

---

## 6. Must be removed / fixed

> Doctrine prompt: *What must be removed?*

Drawn from the dump in `/Users/johnliddy/Desktop/Projects/siteclinic_ada_design_dump.md`:

- **887-line single-file `welcome/page.tsx`** — violates "start from a proven template, customize heavily, but do not rebuild the wheel" (build-standard §51). Should be decomposed into named components driven by doctrine-authored tokens.
- **Inline `PALETTE` const with `bg-[#FAF7F2]` literals** — violates "palette tokens" as a required design deliverable (design-direction §57). Tokens must live in a CSS module, not a JS object inside the page.
- **DM Serif Display declared inline but never loaded** — falls back to Georgia silently. Either load it via `next/font/google` or drop the declaration and own the Georgia fallback.
- **No `OWNER_WISHLIST_INTAKE.md` / `PROJECT_BRIEF.md` / `SOURCE_OF_TRUTH.md` prior to this draft** — doctrine §76: "The source-of-truth doc outranks the old site, mockups, and remembered details." Site Clinic has been shipping without one.
- **No documented design thesis** — doctrine §17: required deliverable.
- **Co-location of marketing, dashboard, developer portal, API routes, Inngest crons, and MCP servers in one Next.js app** — violates the structural dependency-direction rule. The rebuild does not need to split repos, but it needs an enforced directory boundary inside the repo so marketing changes cannot regress operations.
- **Cookie consent gate for GA4 status: unverified.** Doctrine §15: "load GA4 only after acceptance." Must be confirmed or implemented.
- **Security headers status: unverified.** Doctrine §35: HSTS + nosniff + SAMEORIGIN required.

---

## 7. Required vs deferred features

> Doctrine prompt: *Which pages or features are required now versus later?*

### Required for Phase 3 (SC marketing rebuild)
- Hero with verified evidence framing
- Pricing (Basic / Pro / Agency, 30-day trial, cancel anytime)
- Case studies (proof artifacts — must link to real reports)
- About (founder + portfolio cross-references)
- Pricing-detail page (existing `/welcome/pricing`)
- Compare-to-alternatives page (existing `/welcome/compare/...`)
- Contact (existing `/welcome/contact`)
- Privacy + Terms + Accessibility (build standard required pages)
- Developers section (API + MCP, customer-facing surface)
- Cookie consent banner gating GA4
- Search Console verified property
- Site Monitor self-onboarding row in `src/config/clients.ts`

### Deferred
- Multi-language
- Blog on siteclinic.io itself (blog-writer-siteclinic registry exists but publishing target is `NEEDS_VERIFICATION`)
- Customer testimonials beyond founder-side claims (depends on case-study evidence inventory)

---

## 8. Approved claims, testimonials, photos

> Doctrine prompt: *Which claims, testimonials, or photos are still approved for public use?*

**Approved (repo-evidenced, doctrine-aligned)**:
- "Visibility management and website health dashboard." (`layout.tsx:18`)
- "Site Clinic is not just a nightly monitor. It is the operating layer for technical health, accessibility, search visibility, AI retrieval readiness, and the next actions that actually move a website forward." (page.tsx hero subhead)
- "Claims stay inside the evidence we can actually show." (page.tsx hero footer)
- Pricing facts as listed in page.tsx pricing section
- Founder identity: John Liddy
- Portfolio cross-reference: ADA Audit Report, The Participation Effect, Daily Rise
- Hello email: hello@siteclinic.io

**`NEEDS_VERIFICATION`**:
- Case study list (which case studies are still customer-approved for public link from siteclinic.io)
- Founder photo usage rights / file (`john-liddy.jpg`, `john-liddy-author.jpg` exist in adaauditreport.com `site/` — need confirmation those are reusable on siteclinic.io)
- Whether any external testimonial quotes are currently approved (none found in the codebase)

---

## 9. Compliance-sensitive statements

> Doctrine §18: *any compliance-sensitive statements that must be verified before publishing*

Site Clinic-specific:
- "Best when your application owns the UX, orchestration, and storage around audits and scans." — soft, low compliance risk.
- "$5K–$25K+ typical settlement for small businesses" — this is a Site Clinic-adjacent claim primarily made on adaauditreport.com; if it appears on siteclinic.io it must cite Seyfarth Shaw LLP ADA Title III Report and be marked as small-business-specific.
- "WCAG 2.1 AA–aligned" framing — never claim "fully compliant" (per global CLAUDE.md §16 + ada-audit-tool CLAUDE.md Hard Gate Rule §93).
- AI visibility claims — must use "observed on" not "sitewide" unless proven (global §8).

---

## 10. Cross-references this site must stay consistent with

- `adaauditreport.com` — child product, must show identical pricing/positioning where they overlap
- `babymilestonejournal.com`, `daily-rise.com`, `theparticipationeffect.com` — portfolio sameAs entities, must remain reachable and represented
- Site Monitor canonical projection (`automationTruth.ts`) — pricing, plan limits, and feature surfaces shown on siteclinic.io must derive from the same source as the customer dashboard
- ADA seeder canonical doctrine (`ada-audit-tool/docs/`) — any ADA claim on siteclinic.io must reduce to the same canonical audit that the seeder pipeline produces

---

## 11. Operator action items

1. Confirm or rewrite the design thesis sentence (§4).
2. Confirm top-3 goals (§2).
3. Decide primary vs. secondary CTA for the rebuild (§3).
4. Review and approve §5 / §6 lists.
5. Provide approved case study inventory + photo approvals (§8).
6. Fill `OWNER_WISHLIST_INTAKE.md` (separate doc).
7. After this brief is approved, the rebuild moves to Phase 1 (doctrine docs for adaauditreport.com).
