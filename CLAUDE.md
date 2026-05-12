# Site Clinic Web

This repo owns the public `siteclinic.io` marketing surface and the standalone Site Clinic blog lane.

## Current truth

- `siteclinic-web` is the staged standalone marketing repo.
- `site-monitor` still owns the live apex host until explicit cutover.
- `app.siteclinic.io` remains the operations/API surface.
- `blog-writer-siteclinic` is wired for this repo but must stay disabled until apex cutover is complete.
- current DNS truth:
  - GoDaddy has `A @ 76.76.21.21`
  - GoDaddy has `CNAME www cname.vercel-dns.com.`
  - GoDaddy is still missing `A app 76.76.21.21`
- current Vercel truth:
  - `siteclinic.io` is still attached to the live `site-monitor` project
  - `app.siteclinic.io` is attached but not fully configured until that DNS record exists

## Migration boundary

Do not claim the migration is complete until all of these are true:

1. the standalone Vercel project is green
2. `siteclinic.io` apex traffic points at this repo
3. `app.siteclinic.io` owns the operator/API surface
4. the legacy Site Clinic blog lane has been removed from `site-monitor`

Until then:

- the old Site Clinic lane in `site-monitor` is an intentional mirror, not drift
- this repo is staged truth, not live-host truth

## Builder truth

This repo vendors the gate package at `tools/build-websites-tools`.

Do not switch back to `file:../build-websites-tools`.

Why:

- sibling workspace paths work locally
- standalone GitHub/Vercel builds only receive this repo checkout
- cross-repo `file:../...` dependencies break cloud builds

If another standalone website repo is created, copy the gate package into that repo and depend on `file:./tools/build-websites-tools` unless the builder is later published or moved into a real monorepo/workspace install model.

The current deployer contract is:

- repo-local `tools/build-websites-tools`
- no `file:../...` dependency across repos
- `gate:ada` prefers browser mode when Chromium is available
- `gate:ada` falls back truthfully to JSDOM HTML-snapshot mode when cloud builders cannot launch Chromium
- `gate:seo` is browserless and portable by default
- `gate:seo` now also validates sitemap-backed routes and internal-link canonicality so redirect aliases and off-sitemap links fail the build early

Do not reintroduce a required root-level `postinstall: "playwright install chromium"` unless the shared gate package changes again and this contract is explicitly updated.

## Blog lane truth

- publisher directory: `.siteclinic/automation/blog-writer-siteclinic`
- schedule file: `src/blog-schedule.json`
- drafts live in the local publisher dir
- post pages render here under `src/app/blog/*`

Any later AI work must keep the blog lane consistent with the standalone host and must not reattach publishing back into `site-monitor` after cutover.
