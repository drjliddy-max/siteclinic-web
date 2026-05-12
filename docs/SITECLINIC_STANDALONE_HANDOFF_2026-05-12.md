# Siteclinic-web Standalone Handoff — 2026-05-12

## Current truth

- `siteclinic-web` is now the staged standalone marketing repo target for `siteclinic.io`.
- The app passes:
  - `npm run build`
  - prebuild gates `gate:ada` and `gate:seo`
- The standalone Vercel production deploy is now green at:
  - `https://siteclinic-ayii00h02-john-liddys-projects.vercel.app`
- The shared website builder contract is now portable:
  - repo-local `tools/build-websites-tools`
  - no cross-repo `file:../...` dependency
  - `gate:ada` launches a temporary local site server when needed
  - browser mode when Chromium is available
  - truthful JSDOM fallback when cloud builders cannot launch Chromium
- The standalone repo now includes the Site Clinic blog lane:
  - `src/blog-schedule.json`
  - `src/app/blog`
  - `.siteclinic/automation/blog-writer-siteclinic/`
  - `.github/workflows/blog-writer-siteclinic-publish.yml`

## Important boundary

- This repo is ready for GitHub + Vercel staging.
- This repo is **not** proof that apex cutover is already done.
- Until explicit cutover, the live `siteclinic.io` host still lives in `site-monitor`.
- GoDaddy DNS truth right now:
  - `A @ 76.76.21.21` exists
  - `CNAME www cname.vercel-dns.com.` exists
  - `A app 76.76.21.21` is still missing
- Vercel truth right now:
  - `siteclinic.io` is still attached to the live `site-monitor` project
  - `app.siteclinic.io` is attached to the `site-monitor` project but remains misconfigured until the missing DNS record is added
- Site Monitor now models `blog-writer-siteclinic` as **disabled** on purpose.
- Do not enable that job before apex cutover, or live `/blog` content will drift from the destination repo.

## Parallel-work rules

- Treat `siteclinic-web` as the destination marketing repo.
- Treat `site-monitor` as the still-live operator + legacy host until cutover.
- Do not delete the old Site Clinic blog lane files from `site-monitor` until cutover is complete.
- Do not claim migration complete unless:
  - GitHub repo exists
  - Vercel project exists
  - apex `siteclinic.io` points here
  - `app.siteclinic.io` carries the operator surface
  - Stripe/Inngest/CORS/cookie boundaries are verified

## Last-step cutover checklist

1. Create the GitHub repo and push this code.
2. Create the Vercel project and verify preview/staging.
3. Verify standalone `siteclinic-web` pages and `/blog` render correctly at the deployed URL.
4. Move operator/API surface to `app.siteclinic.io` and verify the public DNS record resolves.
5. Verify CORS, Stripe webhook target, Inngest endpoint target, and cookie scope.
6. Flip apex `siteclinic.io` to this project.
7. Only then enable `blog-writer-siteclinic` in Site Monitor and remove the legacy mirror from `site-monitor`.
