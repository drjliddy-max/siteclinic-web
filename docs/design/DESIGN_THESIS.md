# Design thesis — siteclinic.io

> Doctrine: `/Users/johnliddy/Desktop/Projects/build-websites-template/02-design-direction.md`
>
> Locked 2026-05-11 (`MIGRATION_PLAN.md` §6 row 5). Source of truth for every visual decision on siteclinic.io. Conflicting design choices revert to this line.

## The one sentence

> Restrained, evidence-led SaaS for non-technical small-business owners who are tired of being sold ideas and want to see what something actually does. Calm authority, not startup theater.

## Translation rules (doctrine §22)

Keep the business intent. Do not copy outdated motifs.

- Keep **evidence**, not jargon
- Keep **professional**, not generic SaaS
- Keep **clarity**, not minimalism-as-aesthetic
- Keep **portfolio coherence**, not isolated visual identity per child product

## Core visual standards (doctrine §33)

- Strong typographic hierarchy (one display serif, one body sans, no third typeface)
- One clear visual direction — cream surface, sage accent, single italic emphasis
- Real photography where possible (founder photo, real case-study screenshots)
- Whitespace used intentionally
- Motion used sparingly (one pulsing eyebrow dot signals life, that's it)
- Responsive layouts only
- Accessibility is part of the aesthetic, not a later fix

## Anti-patterns (doctrine §43)

Refuse:

- Generic startup SaaS aesthetics for a trust-heavy product
- Decorative dark-mode-by-default
- Stock-photo overload
- Autoplay sliders, image maps
- Multiple competing accent colors
- Default-template layouts with no visual point of view
- Emoji-prefixed feature lists (cycle through visual styles, compete with everything else)
- Bold-mid-paragraph for emphasis (use sub-heads instead)
- More than one primary button variant on the page

## Required design deliverables (doctrine §54)

| # | Deliverable | Location |
|--|--|--|
| 1 | Design thesis (this file) | `docs/design/DESIGN_THESIS.md` |
| 2 | Palette tokens | `src/app/globals.css` (`@theme` block) |
| 3 | Type system | `src/app/layout.tsx` (`next/font/google` declarations) + this doc §"Type system" below |
| 4 | Layout principles | this doc §"Layout principles" below |
| 5 | Imagery direction | this doc §"Imagery" below |
| 6 | What we are deliberately NOT doing | this doc §"Out of scope" below |

## Palette tokens (locked)

Pulled verbatim from siteclinic.io's current `welcome/page.tsx` `PALETTE` constant. Same look, structurally correct.

| Token | Value | Use |
|--|--|--|
| `--color-bg` | `#FAF7F2` | page background |
| `--color-surface` | `#FFFFFF` | card / panel surface |
| `--color-surface-hover` | `#F8F5EF` | secondary button hover |
| `--color-border` | `#E5DCC8` | default border (cards, dividers) |
| `--color-border-inner` | `#D9CFBA` | nested-card border (one step heavier) |
| `--color-ink` | `#1F2937` | primary text |
| `--color-ink-soft` | `#6B7280` | secondary text |
| `--color-accent` | `#3D7468` | sage primary accent (button fill, eyebrow text, links) |
| `--color-accent-hover` | `#264C44` | sage hover state |

No second accent. No decorative warm orange. No competing brand colors. Sage carries 100% of the brand-color load.

## Type system

| Token | Font | Weights | Use |
|--|--|--|--|
| `--font-display` | DM Serif Display | 400, 400 italic | `<h1>`, `<h2>`, italic accent line |
| `--font-body` | Geist | 400, 500, 600 | everything else |

Loaded via `next/font/google` in `src/app/layout.tsx`. Self-hosted at build time. No `<link>` to `fonts.googleapis.com`, no FOIT, no `display: swap` concerns — Next handles all of it.

**Italic is loaded explicitly.** Hero `<h1>` includes `<em>` accent line(s); without italic in the loaded weights, the browser synthesizes fake italic and the headline reads broken at display sizes.

Type scale (per doctrine §02 + parallel ADA spec):

- Hero `<h1>`: 48px / line-height 1.05 / weight 400, italic accent line in `--color-accent`
- Section `<h2>`: 30px / line-height 1.1 / weight 400, italic accent line in `--color-accent`
- Card title: 15px / weight 500
- Body: 14px / line-height 1.65
- Small / label: 11–12px

## Layout principles

- Max container width: 1100px
- Section padding: 56px–80px vertical desktop, 28px–40px mobile
- Card padding: 20px–28px
- Card gap: 6px (tight grids) to 20px (loose grids)
- Border radius: cards 12px, buttons 8px, pills 100px
- Hairline borders: 0.5px solid `--color-border`
- One primary CTA pattern (sage filled), one secondary (outlined hairline), one text-link (sage underlined with `text-underline-offset: 3px`)
- One italic emphasis line per hero/h2 in `--color-accent`. No bolding in body copy.

## Imagery

- Founder photo: John Liddy (available at `ada-audit-tool/site/john-liddy.jpg` — operator confirms reuse rights)
- Case-study screenshots: real artifacts from approved customer audits — see PROJECT_BRIEF §8 approved-claims list
- No stock photography
- No decorative illustrations
- No emoji icons (cycle visual styles, compete with hierarchy)

## Out of scope (we are deliberately NOT doing)

- Dark mode (light-only system — operator demographic + buyer context)
- Multiple accent colors
- Multiple display fonts
- Decorative animations beyond the single pulsing eyebrow dot
- Hero video / autoplay anything
- Carousels / sliders
- Pop-up modals on entry
- Cookie banners that block content (lazy-load post-consent only)
- Three-paragraph testimonials with photos (one quote, one name, one role — if any)
- Numerical-pressure billboards ("4,600+ lawsuits!" in 80px). Stats become evidence-shaped instead

## Customer-as-user north star

Operator is 66, former business owner — IS the target buyer. Validated signal from parallel design-review session 2026-05-11: *"I feel like I can actually see what's being presented. The original feels so busy I don't know where to click."*

This is a structural visual-hierarchy validation, not aesthetic preference. Every design choice on siteclinic.io scores against: "would a non-technical 60+ business owner know where to click within 3 seconds?" If a design has multiple competing accents, multiple button variants, multiple type emphases, or emoji-prefixed lists, it has failed the test.

See memory: `feedback_customer_as_user_visual_hierarchy.md`.
