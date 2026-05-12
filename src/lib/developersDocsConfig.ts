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
