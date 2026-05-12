# Site Clinic Website Lane

Pipeline ID: `siteclinic-content`
Owner product: Site Clinic
Website repo: `siteclinic-web`

## Truth boundary

This repo is the standalone marketing and publishing surface for `siteclinic.io`.
Site Monitor continues to own scheduler orchestration, proof verification, and operator-facing APIs at `app.siteclinic.io`.

The Site Clinic blog lane is considered fully attached here when this repo has:

- `src/blog-schedule.json`
- `.siteclinic/automation/blog-writer-siteclinic/`
- the Next.js `/blog` and `/blog/[slug]` routes
- the publish workflow under `.github/workflows/`

Until apex cutover is complete, the old `site-monitor` website remains the live production host. This repo is the destination of the migration, not proof that DNS has already moved.
