# OWNER_WISHLIST_INTAKE — siteclinic.io

> Doctrine: `/Users/johnliddy/Desktop/Projects/build-websites-template/01-discovery-and-source-of-truth.md` §66
>
> **Purpose**: capture owner wishes, unverified assumptions, strategic preferences, and future ideas. **Kept strictly separate from `SOURCE_OF_TRUTH.md`**, which only holds proven facts.
>
> **Status**: skeleton draft 2026-05-11. Operator fills answers below each prompt. Once answered, this becomes load-bearing for the Phase 3 rebuild alongside `PROJECT_BRIEF.md` + `SOURCE_OF_TRUTH.md`.
>
> **Reading rules** (per doctrine non-negotiable in §76): if a wish here contradicts a fact in `SOURCE_OF_TRUTH.md`, the fact wins. If a wish contradicts the design thesis in `docs/design/DESIGN_THESIS.md`, surface the conflict explicitly before any work — don't quietly accommodate.

---

## 1. Top 3 business goals for siteclinic.io (doctrine §68)

> Operator wishes here may be aspirational. They are not yet proven outcomes.

1. _(operator fill)_
2. _(operator fill)_
3. _(operator fill)_

Working hypothesis from `PROJECT_BRIEF.md` §2 (carry over or rewrite):

1. Be the parent sales platform for the connected portfolio.
2. Convert technical trust into paid recurring monitoring (Basic / Pro / Agency ladder).
3. Demonstrate the platform by running on it (recursive dogfooding).

**Operator response**:

---

## 2. First action a new visitor should take (doctrine §69)

> The CTA that the entire homepage is engineered to produce.

Current behavior: hero "Start free trial" → Stripe checkout. Secondary: "See the proof" → `/case-studies`.

Possible alternative actions to consider:
- Free public scan (cross-link to adaauditreport.com)
- Developer signup (new growing funnel — currently secondary)
- Schedule a 15-min intro call (high-trust, low-volume)

**Operator response**:

---

## 3. What should the site feel like (doctrine §70)

> Owner adjectives. Counter-adjectives ("not X"). What trust should feel like in this niche.

Locked design thesis (`docs/design/DESIGN_THESIS.md`): *"Restrained, evidence-led SaaS for non-technical small-business owners who are tired of being sold ideas and want to see what something actually does. Calm authority, not startup theater."*

Optional additional adjectives operator wants captured beyond the thesis:

**Operator response** (adjectives to add / counter-adjectives "not X" to call out):

---

## 4. What must stay from the current site (doctrine §71)

> Specific pages, copy fragments, visual elements, claims, or features that are non-negotiable.

Carryover candidates from `PROJECT_BRIEF.md` §5:
- 30-day free trial framing
- Three-tier pricing ladder (Basic $49 / Pro $149 / Agency $349)
- Cream + sage palette direction (now locked in DESIGN_THESIS)
- Portfolio cross-references in JSON-LD (`sameAs`)
- Shared GA4 ID `G-CKCC40VRPH`
- Evidence-led copy voice ("Claims stay inside the evidence we can actually show")
- Dual developer offerings (API + MCP)

**Operator response** (confirm carryovers, add anything else operator wants preserved):

---

## 5. What must be removed (doctrine §72)

> Things on the current site that the operator wants gone in the rebuild.

Candidates from `PROJECT_BRIEF.md` §6:
- 887-line single-file `welcome/page.tsx` (replaced by decomposed components)
- Inline `PALETTE` const + `bg-[#FAF7F2]` literals (replaced by tokens)
- Silent DM Serif Display fallback to Georgia (replaced by `next/font/google`)
- Co-location of marketing + dashboard + dev portal + API + crons + MCP in one Next.js app (split via this Phase 1)

Operator-driven removals — anything else the operator finds busy / confusing / off-message:

**Operator response**:

---

## 6. Required vs deferred features (doctrine §73)

> Operator priorities for ship order.

### Currently planned for Phase 3 rebuild (per `PROJECT_BRIEF.md` §7):
- Hero / pricing / case studies / about / pricing-detail / compare / contact / privacy / terms / accessibility / developers (split) / consent banner / Search Console / Site Monitor self-onboarding

### Deferred:
- Multi-language
- Blog on siteclinic.io itself (publishing pipeline contract — `MIGRATION_PLAN.md` §6 row 3 — landed; render comes in Phase 3 or Phase 4)
- Customer testimonials beyond founder-side claims (depends on inventory)

Operator additions / re-prioritization:

**Operator response**:

---

## 7. Approved claims, testimonials, photos (doctrine §74)

> Specific claims / quotes / images the operator confirms are publish-rights-cleared.

**Pre-confirmed (from `SOURCE_OF_TRUTH.md` §8, repo-evidenced)**:
- Brand copy: "Visibility management and website health dashboard."
- Operating-loop copy: "Site Clinic is not just a nightly monitor..."
- Founder identity: John Liddy
- Pricing: Basic $49 / Pro $149 / Agency $349 + 30-day free trial
- Portfolio cross-references: adaauditreport.com, theparticipationeffect.com, daily-rise.com

**Needs operator confirmation**:
- Case study list — which existing case studies are publish-cleared for siteclinic.io
- Founder photo file (`john-liddy.jpg` / `john-liddy-author.jpg` from ada-audit-tool/site/) — reuse rights on siteclinic.io
- Any external customer testimonial quotes
- Any axe-core / Microsoft / Google reference language (used on adaauditreport.com; verify use on siteclinic.io)

**Operator response**:

---

## 8. Strategic preferences (not in doctrine — added per locked decision §6 row 6)

> Distinguish strategic wishes from facts. These shape later phases.

### 8a. Naming inversion (operator-noted in conversation)
The repo is named `site-monitor` but its production deploy is `siteclinic.io`. After Phase 1 cutover, repo `site-monitor` deploys `app.siteclinic.io` (name matches role). Operator stance:
- (a) Keep repo named `site-monitor` (name maps to internal product) — recommended, lowest cost
- (b) Rename repo to `siteclinic-app` or `siteclinic-operations` (mirror domain)
- (c) Other

**Operator response**:

### 8b. White-label / agency client dashboards
Future possibility: Agency-tier customers wanting client dashboards without "Site Clinic" branding. Operator stance:
- (a) Defer entirely — not on roadmap
- (b) Plan for it (per-agency CNAME `<agency>.app.siteclinic.io`) post-cutover
- (c) Productize as a separate Agency-tier feature

**Operator response**:

### 8c. Productization of `build-websites-template` as a customer service line
Operator floated: "design tool should be available on siteclinic for customer use" — but `design-os-template` is borrowed/revised from a public repo (Brian Casel's Builder Methods), so the customer-facing service is more likely the **methodology** as paid engagement than the **tool** as SaaS. Operator stance:
- (a) Methodology stays internal — service line not productized
- (b) Productize as a service engagement ("Site Clinic builds your website + onboards it into monitoring")
- (c) Productize the methodology only (sell `build-websites-template` as a guided doc/service)

**Operator response**:

### 8d. Recursive self-monitoring
Per `MIGRATION_PLAN.md` strategic plan §5 layer 4: siteclinic.io itself becomes the first client row in Site Monitor's `clients.ts`. Site Monitor monitors siteclinic.io the way it monitors a paying customer. Operator confirms or adjusts:
- (a) Yes, full self-monitoring — recommended for dogfooding
- (b) Partial (uptime + SEO only, skip ADA / AI visibility / billing-related signals)
- (c) Defer to Phase 5

**Operator response**:

---

## 9. Future ideas (out of Phase 1 scope; logged for context)

> Things the operator has mentioned in conversation that aren't blocking but should not be forgotten.

- Domain inventory: `sitemonitor.io` is available for $300+ on GoDaddy — operator decided NOT to purchase (subdomain pattern wins). Logged 2026-05-11.
- Possible white-label agency dashboards (see §8b)
- Blog writer productization (currently internal blog-writer-ada / -book / -siteclinic lanes)
- Customer-facing website-build service line (see §8c)

---

## 10. What this site does NOT need to do (doctrine §75 spirit)

> The clearest way to scope a site is to name what it is not.

- Not a developer-only documentation site (that's `siteclinic.io/developers/*` — its own surface)
- Not an audit-purchase funnel (that's adaauditreport.com)
- Not a customer dashboard (that's `app.siteclinic.io`)
- Not a personal portfolio for the founder
- Not a content/blog property in the editorial sense (blog exists but supports the sales loop, not standalone)
- Not a community forum

**Operator additions**:

---

## Sign-off

Once §1–§8 are answered, this doc plus `PROJECT_BRIEF.md` plus `SOURCE_OF_TRUTH.md` form the complete pre-design source-of-truth for the Phase 3 rebuild. The Phase 1 §5b cherry-pick work proceeds against this trio.

**Operator complete**: ☐ ___________
**Date**: ___________
