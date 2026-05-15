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
3. Build a fast, accessible, mobile-first website with semantic HTML.
4. Include title, description, canonical URL, Open Graph tags, sitemap, robots.txt, and schema where appropriate.
5. Use clear calls to action and a working contact path.
6. Prepare deployment instructions for Vercel or the selected host.
7. Prepare DNS instructions for the domain registrar.
8. Prepare Search Console, GA4, and conversion-event setup notes.
9. Prepare Site Clinic monitoring handoff: live URL, scan scope, expected checks, and first proof notes.
10. Verify the build with typecheck/build/lint/accessibility/SEO checks available in the project.

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
                  "AI can write the steps for GitHub, GoDaddy, Vercel, Search Console, and GA4, but the customer still owns logins, billing, domain authorization, and final approvals.",
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
                  "Keep registrar access ready, decide whether DNS moves to Vercel or stays at the registrar, and do not change records until the deployment target is ready.",
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
    secondaryCta: { label: "Start monitoring", href: "/pricing" },
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
