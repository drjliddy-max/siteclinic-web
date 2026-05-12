# siteclinic-web

Public marketing surface for **siteclinic.io** — the parent sales platform for the connected portfolio (Site Monitor recurring monitoring, ADA Audit Report, developer API + MCP, blog).

Operations dashboard (`/c/*`, `/sc/*`, `/api/*`, `/developers/dashboard`, `/internal/*`, Inngest crons, MCP servers) lives separately in the `site-monitor` repo and deploys to `app.siteclinic.io`.

## Doctrine

Built through `build-websites-template/` (the 6-doc methodology). Source-of-truth artifacts:

- `docs/site-truth/PROJECT_BRIEF.md` — top-3 goals, must-stay / must-remove, approved claims, operator action items
- `docs/site-truth/SOURCE_OF_TRUTH.md` — verified facts about siteclinic.io with VERIFIED-REPO / VERIFIED-LIVE / NEEDS_VERIFICATION confidence tiers
- `docs/site-truth/OWNER_WISHLIST_INTAKE.md` — owner wishes / strategic preferences / future ideas, separated from proven facts
- `docs/design/DESIGN_THESIS.md` — locked one-sentence design thesis driving the visual system
- `MIGRATION_PLAN.md` — the parallel-build + cherry-pick migration from `site-monitor/src/app/welcome/*`

## Stack

- Next.js 16 + React 19
- Tailwind v4 (config-in-CSS via `@theme` block in `src/app/globals.css`)
- DM Serif Display + Geist via `next/font/google` (self-hosted at build, no external CDN dependency, no FOIT)
- Static-friendly: no auth, no DB, no API routes. Cross-origin calls to `app.siteclinic.io/api/*` for checkout / waitlist / session per the locked architecture (MIGRATION_PLAN §6 row 4).

## Status

Phase 1 of the strategic portfolio plan. See `MIGRATION_PLAN.md` for the full sequence.

Current staged state:

- standalone marketing routes are built here
- the Site Clinic blog lane is wired here
- local gates and production build pass
- the repo is ready for GitHub + Vercel staging

Important boundary:

- apex cutover is **not** complete yet
- live `siteclinic.io` still remains in `site-monitor` until the explicit migration switch
