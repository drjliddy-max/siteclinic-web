# Blog Writer Site Clinic Publishing Contract

This repo owns the publishing boundary for the `blog-writer-siteclinic` automation.

The workflow entrypoint is:

- `.github/workflows/blog-writer-siteclinic-publish.yml`

This is a publishing contract, not a content-generation contract.
The caller must stage a draft in:

- `.siteclinic/automation/blog-writer-siteclinic/drafts/<slug>.md`

Every staged draft must also carry pipeline-resolved image metadata in front matter:

- `image_url`
- `image_alt`
- `image_source`
- `image_license`

The workflow accepts these required `workflow_dispatch` inputs:

- `jobKey`
- `idempotencyKey`
- `correlationId`
- `targetDate`

Expected values:

- `jobKey` must be `blog-writer-siteclinic`
- `idempotencyKey` must be unique for the publish request
- `correlationId` ties proof back to the caller
- `targetDate` must match exactly one queued item in `src/blog-schedule.json`

What the workflow does:

1. Validates required inputs.
2. Checks for an existing success proof for the same `idempotencyKey`.
3. If a success proof already exists, returns `duplicate-skipped` for that exact request key.
4. Resolves the queued post for `targetDate`.
5. Loads the staged markdown draft for the queued slug.
6. Moves the queued slot to `published[]` in `src/blog-schedule.json`.
7. Writes a machine-readable proof file in `.siteclinic/automation/blog-writer-siteclinic/proofs/`.
8. Commits and pushes the publish only after the publish work completes.
9. Uploads the correlated proof as a GitHub Actions artifact.

Stack note:

- `siteclinic-web` is the standalone Next.js marketing repo for `siteclinic.io`.
- Site Monitor still owns scheduler orchestration and operator APIs at `app.siteclinic.io`.
- Until apex cutover is complete, success of the workflow proves repo publish completion, not DNS cutover status.

Important truth boundary:

- Workflow dispatch is not publish success.
- Success means the publish work completed, a correlated proof file exists, AND the rendered route in this repo can serve `/blog/<slug>`.
- DNS/apex cutover to make that route live at `https://siteclinic.io/blog/<slug>` is a separate migration step.

Success proof fields include:

- `jobKey`
- `idempotencyKey`
- `correlationId`
- `targetDate`
- `success`
- `outcome`
- `slug`
- `changedFiles`
- `queueDecision`
- `publishedDate`
- `draftPath`
- `repoProofPath`
- `articlePath`
- `commitSha`
- `completedAt`

Possible `outcome` values:

- `created`
- `updated`
- `duplicate-skipped`
- `failed`

Readiness verification:

- Run `node .siteclinic/automation/blog-writer-siteclinic/verifyReadiness.mjs --from YYYY-MM-DD --slots 4`
- The verifier checks the next scheduled Tuesday/Thursday publish slots against `src/blog-schedule.json`.
- It fails closed when a slot has no queued item, when a queued slug has no staged draft, or when queue dates drift off the scheduler cadence.
- It also surfaces image-contract truth for each published/ready slot so Site Monitor can reject posts that are missing their attached image metadata.
