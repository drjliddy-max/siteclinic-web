/*
 * Developer-docs config — drives the dynamic [slug] route at
 * /developers/docs/[slug].
 *
 * Ported in §5b iteration 13 from
 * site-monitor/src/app/developers/docs/[slug]/page.tsx with these
 * normalizations:
 *
 *   - 6 slug cases in source → 5 here. "mcp" already shipped as its own
 *     concrete page at /developers/mcp (iter 9), so the docs/mcp variant
 *     is intentionally not here. /developers/docs landing references
 *     /developers/mcp directly.
 *   - Forward-link dead-link CTAs replaced with working alternatives.
 *     Note (iter 14 follow-up): the 6 legacy /developers/<slug> paths now
 *     have proper 308 redirects in next.config.ts per the operator decision
 *     matrix, so the original CTAs would also work via redirect. The
 *     in-config rewrites here just avoid the extra hop. Updated mappings:
 *       /developers/dashboard  → app.siteclinic.io cross-origin (intentional)
 *       /developers/sdks       → /developers/api-reference (in-config) /
 *                                /developers/docs/examples (iter-14 redirect target)
 *       /developers/examples   → /developers/docs/quickstart (in-config) /
 *                                /developers/docs/examples (iter-14 redirect target)
 *       /developers/support    → /contact (matches iter-14 redirect)
 *       /developers/status     → dropped (iter-14: clean 404, no redirect)
 *       /developers/pricing    → app.siteclinic.io/developers/signup (in-config) /
 *                                /pricing (iter-14 redirect target)
 *
 *   - Inline content links (e.g., "check platform status" in error-handling)
 *     became "Related" entries instead of inline links, keeping the page
 *     body pure-string for config-driven rendering.
 *
 * Each doc renders via DocPageLayout with these section kinds:
 *   - "cards": grid of items (eyebrow? + title + description)
 *   - "code":  CodeBlock (language + code)
 *   - "paragraphs": one or more text paragraphs
 */

const APP_SIGNUP = "https://app.siteclinic.io/developers/signup";

const BUILD_WEBSITE_WITH_AI_PROMPT = `You are helping me build and launch a small-business website using the Site Clinic Web Builder standard.

Goal:
Build a real website that can be deployed, monitored, indexed, and improved. Do not stop at a mockup. End with a working project, clear launch checklist, and proof of what was verified.

Tooling rule:
- Site Clinic Web Builder is the workflow standard.
- Codex, Claude Code, Cowork, or another coding agent is the execution surface.
- If you can edit files, run commands, deploy, and verify, execute the work directly.
- If you cannot edit files or access the project, produce an implementation-ready handoff and tell me exactly which tool/action is needed next.

My starting point:
- Website status: [no website / old website / rebuilding existing site]
- Business name:
- Domain registrar: [GoDaddy / Namecheap / Cloudflare / other]
- Domain name:
- GitHub account/repo owner:
- Local project folder:
- Deployment target: [Vercel preferred / other]
- Human account access ready: [GitHub / Vercel / domain registrar / Stripe if payments are needed / Google Search Console / GA4]
- Agent-access tokens available where appropriate: [GitHub token / Vercel token / Site Clinic API key / Site Clinic MCP config / other]
- Manual-only steps expected: [GoDaddy DNS / billing / account ownership / Google verification]
- Business type and service area:
- Primary offer:
- Target customer:
- Required pages:
- Contact method:
- Brand assets available:
- Existing copy/assets:
- Legal/compliance needs:

Required build standard:
1. Ask for any missing foundation inputs before making irreversible choices.
2. Use the Site Clinic Web Builder standard for page structure, on-page SEO, accessibility, launch proof, and monitoring handoff.
3. Create or update the project in the agreed folder/repository.
4. Build a fast, accessible, mobile-first website with semantic HTML.
5. Include title, description, canonical URL, Open Graph tags, sitemap, robots.txt, and schema where appropriate.
6. Use clear calls to action and a working contact path.
7. Prepare deployment instructions for Vercel or the selected host.
8. Prepare DNS instructions for the domain registrar. Treat GoDaddy DNS as a human browser step unless the account explicitly provides safe API access.
9. Prepare Search Console, GA4, and conversion-event setup notes.
10. Prepare Site Clinic monitoring handoff: live URL, scan scope, expected checks, and first proof notes.
11. Verify the build with typecheck/build/lint/accessibility/SEO checks available in the project.

Definition of done:
- Website runs locally.
- Production deployment path is clear.
- Domain/DNS steps are written.
- Sitemap and robots exist.
- Core metadata and schema exist.
- Main CTA/contact path works.
- No obvious mobile or accessibility blockers.
- Launch-day measurement plan exists.
- Site Clinic monitoring can be connected after the URL is live.

If you are Codex, Claude Code, Cowork, or another coding agent:
Edit the files directly, run the available checks, summarize changed files, and report verification evidence. If a step requires an external account action, write the exact instruction for me and pause only for that action.`;

const ACCOUNT_SETUP_PROMPT = `You are helping me prepare accounts, API access, DNS, deployment, and secrets for a Site Clinic website build.

Goal:
Get the project ready for an AI coding agent or developer without exposing passwords, confusing account ownership, or changing DNS too early.

My current status:
- Domain registrar: [GoDaddy / other]
- Domain name:
- GitHub account exists: [yes / no]
- GitHub repo exists: [yes / no]
- Vercel account exists: [yes / no]
- Site Clinic account exists: [yes / no]
- Site Clinic API key exists: [yes / no / not needed yet]
- Site Clinic MCP access needed: [yes / no / not sure]
- Site Clinic MCP capabilities needed: [crawler / scheduler / not sure]
- Scheduler-owned workflows needed: [blog writer pipeline / proof runs / recurring checks / not sure]
- Stripe/payment account needed: [yes / no]
- Google Search Console property exists: [yes / no]
- GA4 property exists: [yes / no]
- Local project folder exists: [yes / no]

Rules:
1. Never ask me to paste account passwords.
2. Tell me which steps Codex can do with a token and which steps I must do in a browser.
3. Treat GoDaddy DNS as a manual browser step unless I explicitly say API access is available.
4. Explain whether I need Site Clinic API, Site Clinic MCP, both, or neither for this phase. If MCP is needed, say whether this is crawler, scheduler, or another confirmed supported capability. If recurring content is needed, treat Blog Writer as a scheduler-owned Site Clinic pipeline unless a direct MCP tool is explicitly configured.
5. Do not change DNS until the Vercel deployment target is ready and the required records are known.
6. Store tokens only in the approved local environment or hosting secret manager.
7. End with a checklist showing: GitHub ready, project folder ready, deployment ready, DNS action ready, Search Console/GA4 ready, Site Clinic API/MCP ready if needed, scheduler-owned workflows ready if needed, Site Clinic monitoring ready.

If you are Codex:
Inspect the repo if one exists, tell me exactly which external account actions are needed, then continue after I confirm those are complete.`;

export type DocSection =
  | {
      kind: "cards";
      items: Array<{ eyebrow?: string; title: string; description: string }>;
    }
  | { kind: "code"; language: string; code: string }
  | { kind: "paragraphs"; paragraphs: string[] };

export type DocSectionBlock = {
  heading?: string;
  body: DocSection[];
};

export type DocCta = {
  label: string;
  href: string;
};

export type DevDocPage = {
  slug: string;
  cardEyebrow: string;
  cardTitle: string;
  cardDescription: string;
  title: string;
  description: string;
  hero: string;
  sections: DocSectionBlock[];
  primaryCta: DocCta;
  secondaryCta: DocCta;
};

export const DEVELOPERS_DOCS: DevDocPage[] = [
  {
    slug: "foundation",
    cardEyebrow: "Step 0",
    cardTitle: "Client Foundation",
    cardDescription:
      "Choose the build path, confirm requirements, and understand what the API does before implementation starts.",
    title: "Client Foundation — Site Clinic Onboarding",
    description:
      "Step 0 for Site Clinic onboarding: build categories, client requirements, trial boundaries, API truth, and website completion standards.",
    hero:
      "Before you create an API key or install an MCP server, decide what kind of Site Clinic implementation you are actually starting. A finished website, an API integration, a monitoring account, and an agent-assisted workflow have different requirements and proof artifacts.",
    sections: [
      {
        heading: "Choose the right path",
        body: [
          {
            kind: "cards",
            items: [
              {
                eyebrow: "Website build",
                title: "Finished website delivery",
                description:
                  "Use this path when the goal is a deployed website with content, domain routing, monitoring, and launch proof. The API can support checks, but it does not replace the website project itself.",
              },
              {
                eyebrow: "Developer API",
                title: "Product or workflow integration",
                description:
                  "Use this path when your app, agency tooling, or internal system needs ADA, health, AI visibility, usage, or report data through authenticated API requests.",
              },
              {
                eyebrow: "Existing site",
                title: "Monitoring and proof loop",
                description:
                  "Use this path when a site already exists and the job is recurring scans, alerts, dashboard review, fixes, and verified improvement evidence.",
              },
              {
                eyebrow: "MCP",
                title: "Agent tool access",
                description:
                  "Use this path only when your team already works through an MCP-capable coding assistant and wants curated Site Clinic tools exposed through that client.",
              },
            ],
          },
        ],
      },
      {
        heading: "Minimum requirements",
        body: [
          {
            kind: "cards",
            items: [
              {
                title: "Account and billing",
                description:
                  "A Site Clinic account starts the current public monitoring and developer/API layers through Stripe Checkout. Public plans begin with a 30-day trial before paid billing continues.",
              },
              {
                title: "Website inputs",
                description:
                  "A finished website still needs business name, offer, audience, pages, copy direction, brand assets, contact details, legal links, and launch domain decisions.",
              },
              {
                title: "Implementation environment",
                description:
                  "Developer/API work assumes someone can run a project locally or in a hosted build environment, store secrets, deploy code, and read request logs.",
              },
              {
                title: "Proof expectations",
                description:
                  "Each implementation should leave evidence: deployed URL, dashboard access, scan results, request IDs, usage records, and before/after verification where applicable.",
              },
            ],
          },
        ],
      },
      {
        heading: "Website truth",
        body: [
          {
            kind: "paragraphs",
            paragraphs: [
              "Site Clinic can support finished website delivery, but the public API is not a magic website generator. The API returns structured analysis and workflow data. A real website still requires a project, content, design choices, deployment, domain setup, and monitoring configuration.",
              "Web Builder assisted delivery is the correct path when the client outcome is a complete website. Developer docs are the correct path when the client outcome is an integration that calls Site Clinic services from their own code.",
              "The 30-day trial is for recurring Site Clinic access such as monitoring and developer/API usage. A custom finished website build is a separate delivery scope; otherwise the build work would become a free one-time deliverable that survives cancellation while the recurring product turns off.",
              "AI assistance on the website itself is a future upgrade. The current foundation should explain the available product surfaces clearly before asking a client to choose tools they may not need.",
            ],
          },
        ],
      },
      {
        heading: "30-day trial and delivery boundary",
        body: [
          {
            kind: "paragraphs",
            paragraphs: [
              "The public developer account flow is Stripe-backed and includes a 30-day trial for the selected developer plan. During the trial, the account can create test and live API keys and use the included plan quotas.",
              "If a client wants Site Clinic to build a complete website, that work needs its own paid build agreement, conversion to a paid plan, or an explicitly limited demo scope before delivery begins. The trial can prove the workflow, monitoring, and API access, but it should not promise a keepable custom website for free.",
              "API keys are for authenticated programmatic access. They should be stored as secrets, separated by environment, and rotated when ownership or exposure risk changes.",
              "MCP access uses the same product truth as the API: it is an agent surface over promoted Site Clinic capabilities, not a separate promise that every internal tool is public or production-ready.",
            ],
          },
        ],
      },
      {
        heading: "Completion standard",
        body: [
          {
            kind: "cards",
            items: [
              {
                title: "For a website build",
                description:
                  "A live URL, domain routing, working contact path, core pages, metadata, accessibility pass, monitoring setup, and launch notes.",
              },
              {
                title: "For an API integration",
                description:
                  "A successful authenticated request, error handling, quota awareness, stored request IDs, usage dashboard visibility, and a production-secret plan.",
              },
              {
                title: "For monitoring",
                description:
                  "A tracked site, recurring scan cadence, dashboard proof, alert path, and a documented fix-and-verify loop.",
              },
              {
                title: "For MCP",
                description:
                  "A configured MCP client, documented tool list, API-key authentication, and proof that the invoked tool produced the expected Site Clinic evidence.",
              },
            ],
          },
        ],
      },
    ],
    primaryCta: { label: "Start API quickstart", href: "/developers/docs/quickstart" },
    secondaryCta: { label: "See MCP guide", href: "/developers/mcp" },
  },
  {
    slug: "build-website-with-ai",
    cardEyebrow: "Website build",
    cardTitle: "Build Website With AI",
    cardDescription:
      "Use the Site Clinic Web Builder standard as a copy-paste build brief for Codex, Claude Code, Cowork, or another implementation agent.",
    title: "Build Website With AI — Site Clinic Foundation",
    description:
      "Use Site Clinic Web Builder with Codex, Claude Code, Cowork, or another coding agent to create, deploy, measure, and monitor a small-business website.",
    hero:
      "This is the operating brief for a customer who has zero steps done, a customer who just bought a domain, or a developer helping many sites. Site Clinic Web Builder is the workflow standard. Codex, Claude Code, Cowork, or another coding agent is the execution surface. Codex is preferred when files, checks, commits, and verification need to happen in the same workspace.",
    sections: [
      {
        heading: "Web Builder, AI prompt, or Codex prompt?",
        body: [
          {
            kind: "cards",
            items: [
              {
                eyebrow: "Workflow",
                title: "Site Clinic Web Builder standard",
                description:
                  "Use this as the source of truth for page structure, on-page SEO, accessibility, deployment handoff, Site Monitor connection, and launch proof.",
              },
              {
                eyebrow: "Use any AI",
                title: "General AI prompt",
                description:
                  "Use the brief to think through structure, content, checklist, page plan, DNS steps, and launch requirements. This is useful when you want planning help or a written implementation package.",
              },
              {
                eyebrow: "Preferred",
                title: "Codex execution prompt",
                description:
                  "Use the same brief in Codex when you want the agent to create files, edit code, run checks, inspect errors, commit changes, and leave verification evidence in the repo.",
              },
              {
                eyebrow: "Also valid",
                title: "Claude Code or Cowork-style agents",
                description:
                  "Use these when they are the available coding surface. The standard is the same: they should follow the Web Builder contract, edit the project, and report proof.",
              },
              {
                eyebrow: "Boundary",
                title: "Account actions stay human-owned",
                description:
                  "AI can use approved tokens for GitHub, Vercel, Stripe, or Site Clinic API work, but the customer still owns logins, billing, domain authorization, and final approvals.",
              },
            ],
          },
        ],
      },
      {
        heading: "Branching setup checklist",
        body: [
          {
            kind: "cards",
            items: [
              {
                eyebrow: "No website",
                title: "Start from account and project foundation",
                description:
                  "Create or confirm GitHub, make a project folder or repository, choose Vercel or another host, gather business inputs, then use Web Builder through Codex or another coding agent to build and deploy.",
              },
              {
                eyebrow: "New domain",
                title: "GoDaddy or registrar path",
                description:
                  "Keep registrar access ready, decide whether DNS moves to Vercel or stays at the registrar, and do not change records until the deployment target is ready. Treat GoDaddy DNS as manual for novice onboarding.",
              },
              {
                eyebrow: "Existing website",
                title: "Rebuild or improve without losing continuity",
                description:
                  "Inventory current URLs, preserve or redirect valuable pages, keep Search Console continuity, and connect the live site to Site Clinic before and after launch.",
              },
              {
                eyebrow: "Agency",
                title: "Multi-site handoff",
                description:
                  "Use one intake per site: domain, repo owner, client label, analytics access, dashboard owner, reporting cadence, and proof requirements.",
              },
            ],
          },
        ],
      },
      {
        heading: "Before Codex can execute",
        body: [
          {
            kind: "cards",
            items: [
              {
                eyebrow: "Can be tokenized",
                title: "GitHub, Vercel, Stripe, Site Clinic",
                description:
                  "These can often be connected through CLI auth, API keys, or app tokens. Use least-privilege access and store secrets only in local env files or the hosting secret manager.",
              },
              {
                eyebrow: "Human-owned",
                title: "GoDaddy DNS and billing",
                description:
                  "For this flow, GoDaddy is a browser step. Codex should write the exact A, CNAME, TXT, or nameserver instructions, but the account owner makes the change.",
              },
              {
                eyebrow: "Google setup",
                title: "Search Console and GA4",
                description:
                  "Codex can prepare tags and verification files when the repo is available. The owner still confirms property access and submits sitemaps in the Google account.",
              },
            ],
          },
        ],
      },
      {
        heading: "Copy-paste build prompt",
        body: [
          {
            kind: "paragraphs",
            paragraphs: [
              "Paste this into Codex, Claude Code, Cowork, or another implementation assistant. Replace the bracketed fields first. If you are using Codex, keep the project folder open so it can edit files, run checks, and commit. If you are using a chat-only AI, use the output as a handoff for Codex or your developer.",
            ],
          },
          {
            kind: "code",
            language: "prompt",
            code: BUILD_WEBSITE_WITH_AI_PROMPT,
          },
        ],
      },
      {
        heading: "What every user must end with",
        body: [
          {
            kind: "cards",
            items: [
              {
                title: "Project ownership",
                description:
                  "A GitHub owner or repo decision, a local project folder, and a written note about who owns future changes.",
              },
              {
                title: "Deployment path",
                description:
                  "A host selected, Vercel preferred when possible, with build command, environment variables, and production deployment steps known.",
              },
              {
                title: "Domain path",
                description:
                  "Registrar access confirmed, DNS strategy chosen, and exact records or nameserver steps documented before cutover.",
              },
              {
                title: "Measurement path",
                description:
                  "Search Console, GA4, conversion events, sitemap submission, and launch-day indexing checks written down.",
              },
              {
                title: "Monitoring path",
                description:
                  "The live URL, scan scope, Site Clinic dashboard owner, alert expectations, and first proof notes are ready.",
              },
              {
                title: "Next service step",
                description:
                  "The customer knows whether the next step is build website, connect monitoring, create service pages, start blog authority, or run proof review.",
              },
            ],
          },
        ],
      },
    ],
    primaryCta: { label: "Open Start Here", href: "/start-here" },
    secondaryCta: { label: "Prepare accounts, API, MCP, and DNS", href: "/developers/docs/accounts-dns-secrets" },
  },
  {
    slug: "accounts-dns-secrets",
    cardEyebrow: "Setup",
    cardTitle: "Accounts, API, MCP, DNS, and Secrets",
    cardDescription:
      "Know which steps an AI coding agent can execute with Site Clinic API/MCP access and which steps the human owner must complete in GitHub, Vercel, GoDaddy, Stripe, and Google.",
    title: "Accounts, API, MCP, DNS, and Secrets — Site Clinic Setup",
    description:
      "Prepare GitHub, Vercel, GoDaddy DNS, Stripe, Google Search Console, GA4, Site Clinic API keys, and MCP access before a website build.",
    hero:
      "A beginner-friendly website build fails when account ownership is fuzzy. This page separates what Codex or another coding agent can do with safe GitHub, Vercel, Site Clinic API, or MCP access from what the site owner must do manually in a browser.",
    sections: [
      {
        heading: "Who does what",
        body: [
          {
            kind: "cards",
            items: [
              {
                eyebrow: "Agent-ready",
                title: "GitHub",
                description:
                  "Codex can create branches, edit files, commit, and push when the repo is available and GitHub access is approved. The human owner should create or approve the account and repo ownership.",
              },
              {
                eyebrow: "Agent-ready",
                title: "Vercel",
                description:
                  "A coding agent can prepare deploy settings and run Vercel commands when authenticated. The human owner approves project ownership, billing, domains, and production promotion.",
              },
              {
                eyebrow: "Manual",
                title: "GoDaddy DNS",
                description:
                  "Treat GoDaddy DNS as a browser step for novice onboarding. Codex should provide exact records, but the owner logs into GoDaddy and applies them.",
              },
              {
                eyebrow: "Credentialed",
                title: "Stripe",
                description:
                  "Stripe keys and webhooks can be wired by an agent only after the owner creates or approves the Stripe account. Never paste secret keys into public files or chat logs.",
              },
              {
                eyebrow: "Owner verified",
                title: "Search Console and GA4",
                description:
                  "Codex can add verification files, tags, and analytics snippets. The human owner verifies properties, submits sitemaps, and confirms access in Google.",
              },
              {
                eyebrow: "Product access",
                title: "Site Clinic API",
                description:
                  "The Site Clinic API is the programmatic layer for scans, usage, reporting, and evidence workflows. API keys belong in local or hosted secret storage, never in public code.",
              },
              {
                eyebrow: "Agent tools",
                title: "Site Clinic MCP",
                description:
                  "MCP is the agent-facing tool layer. Use it when Codex, Claude Code, Cowork, or another MCP-capable assistant needs confirmed Site Clinic tools such as crawler or scheduler operations instead of hand-written API calls.",
              },
              {
                eyebrow: "Scheduler workflow",
                title: "Blog Writer pipeline",
                description:
                  "Blog Writer is a scheduler-owned Site Clinic content pipeline. Treat it as an entitled automation workflow, not as a direct MCP tool unless a specific MCP tool is configured and documented.",
              },
            ],
          },
        ],
      },
      {
        heading: "Where Site Clinic API and MCP fit",
        body: [
          {
            kind: "paragraphs",
            paragraphs: [
              "The Site Clinic API, confirmed MCP surfaces, scheduler, crawler, and Blog Writer pipeline are part of onboarding, not an afterthought. API access is for software and workflows that need authenticated Site Clinic data. MCP access is for agent clients that need supported Site Clinic tools available inside the coding or operations assistant.",
              "A novice website build can finish without MCP if a human or Codex is only building files. MCP becomes useful when the agent should ask Site Clinic for evidence, trigger supported crawler checks, inspect proof runs, work through monitored-site context, or operate scheduler-owned workflows.",
              "The Blog Writer pipeline is an advanced Site Clinic workflow owned by the scheduler. A site should not be put on recurring content production until the site, keyword/source files, image policy, publish target, schedule ownership, and Site Monitor reporting are all configured.",
              "The safe rule is: website ownership and DNS stay human-controlled; repo and deploy work can be delegated to Codex when authenticated; Site Clinic API/MCP access gives the agent the evidence and workflow layer, but only after keys and scope are deliberately set.",
            ],
          },
          {
            kind: "cards",
            items: [
              {
                eyebrow: "Use API when",
                title: "A product or workflow needs data",
                description:
                  "Use API keys for backend jobs, dashboards, customer workflows, webhooks, reporting, or scheduled checks.",
              },
              {
                eyebrow: "Use MCP when",
                title: "An agent needs Site Clinic tools",
                description:
                  "Use MCP when a coding assistant should call confirmed crawler, scheduler, proof, monitoring, or remediation capabilities directly as tools.",
              },
              {
                eyebrow: "Use scheduler when",
                title: "Work should recur",
                description:
                  "Use the scheduler for recurring checks, Blog Writer publishing, proof runs, and other cadence-owned workflows. Do not create repo-local timers when Site Clinic owns the cadence.",
              },
              {
                eyebrow: "Use crawler when",
                title: "The site needs evidence",
                description:
                  "Use crawler capabilities for crawlability, SEO, accessibility, indexing, content, and technical proof signals that should feed Site Monitor.",
              },
              {
                eyebrow: "Use blog writer when",
                title: "The site is ready for authority content",
                description:
                  "Use Blog Writer only after the site has its project folder, keyword clusters, image handling, publishing target, scheduler ownership, and monitoring contract ready.",
              },
              {
                eyebrow: "Use neither when",
                title: "The task is only a manual account step",
                description:
                  "DNS changes, billing approvals, domain ownership, and Google account verification stay browser-led by the owner.",
              },
            ],
          },
        ],
      },
      {
        heading: "Entitlements and paywall boundary",
        body: [
          {
            kind: "paragraphs",
            paragraphs: [
              "Public docs can explain the setup path, but operational access is not public. API keys, MCP tool use, scheduler-owned automation, Blog Writer runs, and Site Monitor dashboards should require an authenticated Site Clinic account with the correct trial, paid plan, or managed-service entitlement.",
              "Site Monitor is the evidence dashboard and should reflect only the capabilities enabled for that account or site. If an account is not entitled to API, MCP, scheduler, Blog Writer, or client dashboard access, the UI should show setup guidance or upgrade/contact steps instead of executable controls.",
              "Blog Writer is especially sensitive because it can publish content. Treat it as a paid or explicitly approved workflow with per-site configuration, proof artifacts, image requirements, governance checks, and Site Monitor visibility before any recurring run is considered active.",
            ],
          },
          {
            kind: "cards",
            items: [
              {
                eyebrow: "Free/public",
                title: "Docs and readiness guidance",
                description:
                  "Public pages may teach setup, DNS, account preparation, launch checklists, and what evidence Site Clinic will verify.",
              },
              {
                eyebrow: "Authenticated",
                title: "API and MCP access",
                description:
                  "API keys and MCP-capable tool access require a Site Clinic account, scoped credentials, plan limits, and revocation/rotation controls.",
              },
              {
                eyebrow: "Entitled workflow",
                title: "Scheduler and Blog Writer",
                description:
                  "Recurring checks, Blog Writer publishing, proof runs, and managed client workflows require explicit account/site entitlement and Site Monitor reporting.",
              },
              {
                eyebrow: "Dashboard",
                title: "Site Monitor visibility",
                description:
                  "Client-facing dashboards should show only the sites, workflows, runs, proofs, and recommendations the account is allowed to access.",
              },
            ],
          },
        ],
      },
      {
        heading: "Blog Writer MCP direction",
        body: [
          {
            kind: "paragraphs",
            paragraphs: [
              "The current Blog Writer truth is scheduler-owned automation with repo-owned publishing and proof verification. It should not be exposed as a blind publish button.",
              "The correct future MCP shape is an internal content-operations surface: list sites, inspect site context, read keyword queues, check readiness, validate drafts, list proofs, dispatch an approved publisher workflow, and verify the live result.",
              "Start read-only and dry-run first. Write or dispatch tools should require explicit entitlement, operator confirmation, correlated proof, and live URL verification before Site Monitor records success.",
            ],
          },
          {
            kind: "cards",
            items: [
              {
                eyebrow: "Safe first tools",
                title: "Inspect and validate",
                description:
                  "Expose read-only tools for site context, keyword queues, readiness, governance gates, and existing publish proofs before enabling execution.",
              },
              {
                eyebrow: "Controlled execution",
                title: "Dispatch, then verify",
                description:
                  "When enabled, MCP should dispatch the reliable repo-owned publisher workflow and require proof correlation plus live URL verification.",
              },
              {
                eyebrow: "Not allowed",
                title: "Blind publish",
                description:
                  "Do not let an agent write directly to production blog content without queue state, governance checks, entitlement, proof artifacts, and Site Monitor reporting.",
              },
            ],
          },
        ],
      },
      {
        heading: "DNS path for a new GoDaddy domain",
        body: [
          {
            kind: "paragraphs",
            paragraphs: [
              "Do not change DNS first. Build or deploy the site first, then use the host's exact domain instructions. For Vercel, this usually means adding the domain in Vercel, then applying either nameservers or DNS records in GoDaddy.",
              "For an apex domain, the host may ask for an A record. For a www subdomain, the host may ask for a CNAME. For verification, the host or Google may ask for a TXT record. The owner should copy the values exactly and wait for propagation.",
              "The safe novice rule is simple: Codex writes the record list and verification checklist; the domain owner changes GoDaddy in the browser; Site Clinic verifies the live result after propagation.",
            ],
          },
        ],
      },
      {
        heading: "Secrets and tokens",
        body: [
          {
            kind: "cards",
            items: [
              {
                title: "Do not share passwords",
                description:
                  "Use OAuth, CLI login, scoped API keys, or environment variables. Passwords and recovery codes stay with the account owner.",
              },
              {
                title: "Use least privilege",
                description:
                  "Give the agent or developer only the access needed for the task: repo, deployment project, test Stripe key, or Site Clinic API key.",
              },
              {
                title: "Keep secrets out of Git",
                description:
                  "Store secrets in .env.local, Vercel environment variables, or the approved secret manager. Never commit live keys.",
              },
              {
                title: "Rotate after handoff",
                description:
                  "When a contractor, agent, or temporary workflow is done, rotate keys and remove access that is no longer needed.",
              },
            ],
          },
        ],
      },
      {
        heading: "Copy-paste account setup prompt",
        body: [
          {
            kind: "paragraphs",
            paragraphs: [
              "Use this prompt before the website build prompt when the customer is new to GitHub, Vercel, DNS, or analytics setup.",
            ],
          },
          {
            kind: "code",
            language: "prompt",
            code: ACCOUNT_SETUP_PROMPT,
          },
        ],
      },
    ],
    primaryCta: { label: "Build website with AI", href: "/developers/docs/build-website-with-ai" },
    secondaryCta: { label: "Open Start Here", href: "/start-here" },
  },
  {
    slug: "authentication",
    cardEyebrow: "Security",
    cardTitle: "Authentication",
    cardDescription:
      "Live + test keys, Bearer auth, rotation.",
    title: "Authentication — Site Clinic API",
    description:
      "Site Clinic API authentication: Bearer tokens, live + test keys, rotation, and per-key scoping via the developer dashboard.",
    hero:
      "Every API request uses a Bearer token. Keep live keys for production traffic, test keys for integration work, and rotate credentials from the developer dashboard when ownership changes.",
    sections: [
      {
        body: [
          {
            kind: "cards",
            items: [
              {
                eyebrow: "Live",
                title: "sc_live_*",
                description:
                  "Use for production jobs, customer workflows, and any billing-impacting traffic.",
              },
              {
                eyebrow: "Test",
                title: "sc_test_*",
                description:
                  "Use for local development, CI, previews, and sandbox experimentation.",
              },
              {
                eyebrow: "Scopes",
                title: "Per-key control",
                description:
                  "Create focused keys by environment and workload instead of sharing one credential everywhere.",
              },
            ],
          },
        ],
      },
      {
        heading: "Header format",
        body: [
          {
            kind: "code",
            language: "Authorization",
            code: "Authorization: Bearer sc_live_your_api_key_here",
          },
        ],
      },
      {
        heading: "Key-management guidance",
        body: [
          {
            kind: "paragraphs",
            paragraphs: [
              "Rotate keys when teammates change, secrets appear in logs, or you split a shared workload into separate services.",
              "The dashboard shows key prefixes, last-used timestamps, environments, and activation state so you can audit access without exposing full credentials.",
            ],
          },
        ],
      },
    ],
    primaryCta: { label: "Manage keys", href: APP_SIGNUP },
    secondaryCta: {
      label: "← Back to quickstart",
      href: "/developers/docs/quickstart",
    },
  },
  {
    slug: "rate-limits",
    cardEyebrow: "Operations",
    cardTitle: "Rate Limits & Quotas",
    cardDescription:
      "Plan limits, usage endpoints, retry patterns.",
    title: "Rate Limits & Quotas — Site Clinic API",
    description:
      "Site Clinic plan-level rate limits, quota endpoints, and safe retry behavior with jittered exponential backoff.",
    hero:
      "Rate limits protect the platform and make usage predictable. Pair exponential backoff with the usage endpoints so you can slow down before you hit hard limits.",
    sections: [
      {
        body: [
          {
            kind: "cards",
            items: [
              {
                eyebrow: "Developer",
                title: "100 requests / minute",
                description:
                  "Designed for early production traffic, internal tooling, and integration partners.",
              },
              {
                eyebrow: "Enterprise",
                title: "500 requests / minute",
                description:
                  "For multi-tenant products, agency workloads, and heavier scheduled processing.",
              },
              {
                eyebrow: "Usage",
                title: "Quota visibility",
                description:
                  "Read /api/v1/usage/stats and /api/v1/usage/quota to monitor burn rate inside your app.",
              },
            ],
          },
        ],
      },
      {
        heading: "Backoff guidance",
        body: [
          {
            kind: "paragraphs",
            paragraphs: [
              "Use jittered exponential backoff on 429 responses and avoid parallel retry storms from multiple workers sharing one key.",
              "Plan for graceful degradation if you are close to plan quota late in the billing period.",
            ],
          },
        ],
      },
      {
        heading: "Quota exceeded",
        body: [
          {
            kind: "paragraphs",
            paragraphs: [
              "A quota error means the request is valid but your current billing period has exhausted the included units for that workload. Check the dashboard, review overage expectations, or upgrade the plan before resuming high-volume jobs.",
            ],
          },
        ],
      },
    ],
    primaryCta: { label: "Open API reference", href: "/developers/api-reference" },
    secondaryCta: { label: "← Back to docs", href: "/developers/docs" },
  },
  {
    slug: "error-handling",
    cardEyebrow: "Reliability",
    cardTitle: "Error Handling",
    cardDescription:
      "Request IDs, structured errors, failure classification.",
    title: "Error Handling — Site Clinic API",
    description:
      "Site Clinic API errors: structured error objects with code, message, request ID. Validation vs auth vs system failure classification.",
    hero:
      "Every API error should be handled by code and readable by humans. Site Clinic returns structured error objects so apps can log, retry, or display the right next step.",
    sections: [
      {
        heading: "Typical error shape",
        body: [
          {
            kind: "code",
            language: "JSON",
            code: `{
  "error": {
    "code": "validation_error",
    "message": "The supplied URL is invalid.",
    "request_id": "req_1234567890abcdef"
  }
}`,
          },
        ],
      },
      {
        heading: "Validation errors",
        body: [
          {
            kind: "paragraphs",
            paragraphs: [
              "Validation errors mean the request shape or input values are not acceptable. Fix the payload and retry without delay.",
            ],
          },
        ],
      },
      {
        heading: "Authentication errors",
        body: [
          {
            kind: "paragraphs",
            paragraphs: [
              "Authentication errors usually come from missing Bearer headers, inactive keys, or mixing live and test credentials with the wrong environment.",
            ],
          },
        ],
      },
      {
        heading: "System failures",
        body: [
          {
            kind: "paragraphs",
            paragraphs: [
              "Unexpected server errors should be logged with the request ID and routed to support. If the issue looks widespread, contact support before retrying aggressively.",
            ],
          },
        ],
      },
    ],
    primaryCta: { label: "Contact support", href: "/contact" },
    secondaryCta: { label: "← Back to docs", href: "/developers/docs" },
  },
  {
    slug: "webhooks",
    cardEyebrow: "Async flows",
    cardTitle: "Webhooks",
    cardDescription:
      "Callback URLs, async completions, idempotent processing.",
    title: "Webhooks — Site Clinic API",
    description:
      "Site Clinic webhook patterns: callback URLs for async completions, idempotent handlers, fast acknowledgment, safe replay.",
    hero:
      "Long-running workflows can call back into your app when results are ready. Webhook handlers should be idempotent, fast, and easy to replay from logs.",
    sections: [
      {
        heading: "Recommended pattern",
        body: [
          {
            kind: "cards",
            items: [
              {
                title: "Provide a callback URL",
                description:
                  "Attach a callback URL when you queue work that may complete outside the original request window.",
              },
              {
                title: "Persist event IDs",
                description:
                  "Store event identifiers and request IDs so retries do not create duplicate downstream work.",
              },
              {
                title: "Acknowledge quickly",
                description:
                  "Accept the webhook, enqueue internal processing, and keep the handler itself lightweight.",
              },
            ],
          },
        ],
      },
      {
        heading: "Operational note",
        body: [
          {
            kind: "paragraphs",
            paragraphs: [
              "Treat webhook consumers the same way you treat Stripe webhooks: verify authenticity, make handlers idempotent, and log enough metadata to replay failures safely.",
            ],
          },
        ],
      },
    ],
    primaryCta: { label: "See code examples", href: "/developers/docs/examples" },
    secondaryCta: { label: "← Back to docs", href: "/developers/docs" },
  },
  {
    slug: "examples",
    cardEyebrow: "Implementation",
    cardTitle: "Code Examples",
    cardDescription:
      "Common code paths for audits, health, AI visibility.",
    title: "Code Examples — Site Clinic API",
    description:
      "Site Clinic JavaScript + Python reference snippets for the first wave of API integrations: usage stats, quota, audit workflows.",
    hero:
      "Use these patterns as starting points for real integrations, then adapt them for your own job queues, dashboards, or customer workflows.",
    sections: [
      {
        heading: "JavaScript overview",
        body: [
          {
            kind: "code",
            language: "javascript",
            code: `import SiteClinic from "@siteclinic/api";

const client = new SiteClinic({ apiKey: "sc_live_your_api_key" });

const usage = await client.usage.getStats();
const quota = await client.usage.getQuota();

console.log(usage.data.results);
console.log(quota.data.results);`,
          },
        ],
      },
      {
        heading: "Python overview",
        body: [
          {
            kind: "code",
            language: "python",
            code: `from siteclinic import SiteClinic

client = SiteClinic(api_key="sc_live_your_api_key")

usage = client.usage.get_stats()
quota = client.usage.get_quota()

print(usage.data.results)
print(quota.data.results)`,
          },
        ],
      },
    ],
    primaryCta: { label: "Open API reference", href: "/developers/api-reference" },
    secondaryCta: { label: "← Back to docs", href: "/developers/docs" },
  },
];

export const DEVELOPERS_DOCS_MAP: Record<string, DevDocPage> = Object.fromEntries(
  DEVELOPERS_DOCS.map((doc) => [doc.slug, doc]),
);

export const DEVELOPERS_DOCS_SLUGS = DEVELOPERS_DOCS.map((doc) => doc.slug);
