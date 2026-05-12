import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Eyebrow } from "@/components/Eyebrow";
import { Button } from "@/components/Button";

/*
 * API Reference — siteclinic.io/developers/api-reference
 *
 * §5b iteration 10: cherry-picked from
 * site-monitor/src/app/developers/[slug]/page.tsx (the "api-reference" case
 * of the dynamic [slug] route, lines 131–224).
 *
 * The source uses a dynamic [slug] route to render 7 different developer
 * leaf pages (api-reference, community, examples, pricing, sdks, status,
 * support). For siteclinic-web we materialize them as concrete static
 * routes one at a time so:
 *   - Sitemap entries are explicit
 *   - Gate coverage is route-specific
 *   - Forward 404s are visible and named
 *   - Cherry-pick discipline applies route-by-route
 *
 * This iteration only cherry-picks the api-reference case. The other 6
 * cases (community, examples, pricing, sdks, status, support) become
 * future-state roadmap, not in this iteration's scope.
 */

const APP_API_EXPLORER = "https://app.siteclinic.io/developers/api-explorer";

const PAGE_URL = "https://siteclinic.io/developers/api-reference";
const DESCRIPTION =
  "Site Clinic public API reference: /api/v1 base path, Bearer-key + account-slug auth, and endpoint families for ADA, Health, AI, Keys, Usage, Migration.";

const ENDPOINT_FAMILIES = [
  {
    name: "ADA",
    path: "/api/v1/ada/*",
    description:
      "Queue audits, fetch results, and retrieve report artifacts for accessibility workflows.",
  },
  {
    name: "Health",
    path: "/api/v1/health/*",
    description:
      "Run performance, security, and SEO checks for a target URL or property.",
  },
  {
    name: "AI",
    path: "/api/v1/ai/*",
    description:
      "Retrieve current public AI-visibility signal snapshots, claim boundaries, and structured-content readiness exposed by the API today.",
  },
  {
    name: "Keys",
    path: "/api/v1/keys",
    description:
      "Create, list, rotate, disable, and inspect API keys from your own developer account.",
  },
  {
    name: "Usage",
    path: "/api/v1/usage/*",
    description:
      "Fetch current-period usage, included quota, and remaining capacity before you cross plan limits.",
  },
  {
    name: "Migration",
    path: "/api/v1/migration/*",
    description:
      "Review migration-analysis jobs for database modernization and implementation planning.",
  },
] as const;

const AUTH_EXAMPLE = `curl -X GET "https://app.siteclinic.io/api/v1/usage/stats?account=your-account-slug" \\
  -H "Authorization: Bearer sc_live_your_api_key" \\
  -H "x-siteclinic-account-slug: your-account-slug"`;

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": "https://siteclinic.io/developers/api-reference#article",
  url: PAGE_URL,
  headline: "API Reference — Site Clinic Perfect Website API",
  description: DESCRIPTION,
  isPartOf: { "@id": "https://siteclinic.io/#website" },
  about: { "@id": "https://siteclinic.io/#org" },
  inLanguage: "en-US",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Developers", item: "https://siteclinic.io/developers" },
      { "@type": "ListItem", position: 2, name: "API Reference", item: PAGE_URL },
    ],
  },
};

export const metadata: Metadata = {
  title: "API Reference — Site Clinic",
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "API Reference — Site Clinic",
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: "Site Clinic",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "API Reference — Site Clinic",
    description: DESCRIPTION,
  },
};

function CodeBlock({
  language,
  code,
}: {
  language: string;
  code: string;
}) {
  return (
    <div className="bg-[#0F1826] rounded-lg overflow-hidden">
      <div className="px-4 py-2 text-xs border-b border-[#1e2a44]">
        <span
          className="inline-block px-2 py-0.5 rounded bg-[var(--color-accent)] text-white font-medium"
          style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
        >
          {language}
        </span>
      </div>
      <pre
        className="p-4 overflow-x-auto text-white text-sm leading-relaxed whitespace-pre"
        style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
      >
        {code}
      </pre>
    </div>
  );
}

export default function ApiReferencePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <SiteHeader />
      <main
        className="flex-1 max-w-4xl mx-auto px-6 pb-20 w-full"
        style={{ fontFamily: "var(--font-body)" }}
      >
        <nav
          aria-label="Breadcrumb"
          className="pt-8 pb-4 text-sm text-[var(--color-ink-soft)]"
        >
          <Link href="/developers" className="hover:text-[var(--color-ink)]">
            Developers
          </Link>
          <span className="mx-2" aria-hidden="true">›</span>
          <span className="text-[var(--color-ink)]">API Reference</span>
        </nav>

        <section className="pb-10">
          <div className="mb-3">
            <Eyebrow>API Reference</Eyebrow>
          </div>
          <h1
            className="text-4xl md:text-5xl tracking-tight leading-[1.05] mb-5 text-[var(--color-ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Current endpoints, auth pattern, and{" "}
            <em
              className="text-[var(--color-accent)]"
              style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
            >
              account operations.
            </em>
          </h1>
          <p
            className="text-lg text-[var(--color-ink-soft)] leading-relaxed max-w-3xl"
            style={{ fontFamily: "var(--font-body)" }}
          >
            The current public API is exposed through Site Clinic&apos;s
            operations subdomain at{" "}
            <code className="text-[var(--color-ink)] bg-[var(--color-surface)] px-1.5 py-0.5 rounded text-[0.9em]">
              /api/v1
            </code>{" "}
            and covers the subset of capabilities that are already
            contract-ready.
          </p>
        </section>

        <section className="grid sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-soft)] mb-2">
              Base path
            </div>
            <code
              className="text-base font-semibold text-[var(--color-ink)] block mb-2"
              style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
            >
              /api/v1/*
            </code>
            <p className="text-xs text-[var(--color-ink-soft)] leading-relaxed">
              On the operations subdomain (app.siteclinic.io).
            </p>
          </div>
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-soft)] mb-2">
              Keys
            </div>
            <div className="text-base font-semibold text-[var(--color-ink)] mb-2">
              Live + test keys
            </div>
            <p className="text-xs text-[var(--color-ink-soft)] leading-relaxed">
              Use live keys for production, test keys for integration work.
            </p>
          </div>
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-soft)] mb-2">
              Account context
            </div>
            <div className="text-base font-semibold text-[var(--color-ink)] mb-2">
              Slug required
            </div>
            <p className="text-xs text-[var(--color-ink-soft)] leading-relaxed">
              Pass <code className="text-[var(--color-ink)]">?account=</code>{" "}
              or{" "}
              <code className="text-[var(--color-ink)]">
                x-siteclinic-account-slug
              </code>{" "}
              header.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <div className="mb-3">
            <Eyebrow>Endpoint families</Eyebrow>
          </div>
          <h2
            className="text-2xl tracking-tight mb-4 text-[var(--color-ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Six families currently public
          </h2>
          <p className="text-sm text-[var(--color-ink-soft)] mb-6 max-w-2xl">
            Site Clinic is one product system with multiple delivery layers.
            The public API only exposes capabilities that are currently ready
            for developer use. Internal-only capabilities stay internal.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {ENDPOINT_FAMILIES.map((family) => (
              <div
                key={family.name}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5"
              >
                <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)] mb-2">
                  {family.name}
                </div>
                <code
                  className="text-sm font-semibold text-[var(--color-ink)] block mb-2"
                  style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
                >
                  {family.path}
                </code>
                <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">
                  {family.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <div className="mb-3">
            <Eyebrow>Authentication</Eyebrow>
          </div>
          <h2
            className="text-2xl tracking-tight mb-4 text-[var(--color-ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Bearer key + account slug
          </h2>
          <p className="text-sm text-[var(--color-ink-soft)] mb-6 max-w-2xl">
            Send the API key as a Bearer token in the{" "}
            <code className="text-[var(--color-ink)]">Authorization</code>{" "}
            header. For account-scoped routes, also include the account slug
            either as a query parameter or as the{" "}
            <code className="text-[var(--color-ink)]">
              x-siteclinic-account-slug
            </code>{" "}
            header.
          </p>
          <CodeBlock language="cURL" code={AUTH_EXAMPLE} />
        </section>

        <section className="mb-12">
          <div className="mb-3">
            <Eyebrow>Response shape</Eyebrow>
          </div>
          <h2
            className="text-2xl tracking-tight mb-4 text-[var(--color-ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <code className="text-[var(--color-ink)] text-[0.85em]">data</code>{" "}
            +{" "}
            <code className="text-[var(--color-ink)] text-[0.85em]">meta</code>{" "}
            envelopes
          </h2>
          <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed max-w-3xl mb-4">
            Successful responses return a top-level{" "}
            <code className="text-[var(--color-ink)]">data</code> object plus
            a <code className="text-[var(--color-ink)]">meta</code> block
            with request IDs, versioning, and usage accounting where
            supported.
          </p>
          <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed max-w-3xl">
            Errors return a structured{" "}
            <code className="text-[var(--color-ink)]">error</code> object
            with a code, message, and request identifier for support
            follow-up. Detailed error-code documentation and key-management
            rules are forthcoming guides under{" "}
            <Link
              href="/developers/docs"
              className="text-[var(--color-accent)] underline underline-offset-[3px]"
            >
              developer docs
            </Link>
            .
          </p>
        </section>

        <section className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-7 text-center">
          <p className="text-sm text-[var(--color-ink-soft)] mb-4">
            Exercise these endpoints interactively from a browser session.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button href={APP_API_EXPLORER} variant="primary">
              Open API explorer
            </Button>
            <Button href="/developers/docs/quickstart" variant="secondary">
              Read quickstart
            </Button>
            <Button href="/developers/mcp" variant="text-link">
              MCP tools →
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
