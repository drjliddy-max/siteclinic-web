import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Eyebrow } from "@/components/Eyebrow";
import { Button } from "@/components/Button";
import { DEVELOPERS_DOCS } from "@/lib/developersDocsConfig";

/*
 * Developer Documentation — siteclinic.io/developers/docs
 *
 * §5b iteration 8: cherry-picked from
 * site-monitor/src/app/developers/docs/page.tsx, scoped narrowly:
 *
 * The source's 7-item LinkGrid (Quickstart + Authentication + Rate Limits +
 * Error Handling + Webhooks + Code Examples + MCP) is TRIMMED in this
 * iteration. Only Quickstart resolves now. The other 6 sub-doc routes
 * would create 6 new same-origin 404s if rendered as links — operator's
 * stated post-iter-8 expectation is "/developers/api-reference and
 * /developers/mcp remaining," not 8 forward 404s.
 *
 * The 6 future docs are listed in the "More guides coming" section
 * WITHOUT links, so they're not broken links — they're explicit roadmap
 * markers. Each cherry-picks in its own iteration and gets a real link
 * added here at that time.
 *
 * Cross-origin to app.siteclinic.io for the API explorer (auth-gated).
 *
 * Migration unit pattern:
 *   1. This page          → src/app/developers/docs/page.tsx  ✓
 *   2. Sitemap entry      → src/app/sitemap.ts adds /developers/docs
 *   3. Legacy redirect    → next.config.ts adds /welcome/developers/docs → /developers/docs
 *   4. Gate coverage      → gate.config.json adds /developers/docs
 */

const APP_API_EXPLORER = "https://app.siteclinic.io/developers/api-explorer";

const PAGE_URL = "https://siteclinic.io/developers/docs";
const DESCRIPTION =
  "Site Clinic developer documentation — quickstart, authentication, rate limits, error handling, webhooks, code examples, and MCP integration.";

// MCP integration ships as its own page at /developers/mcp (iter 9). The
// other 5 sub-docs ship at /developers/docs/<slug> (iter 13) and are
// iterated from DEVELOPERS_DOCS config.

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://siteclinic.io/developers/docs#page",
  url: PAGE_URL,
  name: "Developer Documentation — Site Clinic",
  description: DESCRIPTION,
  isPartOf: { "@id": "https://siteclinic.io/#website" },
  about: { "@id": "https://siteclinic.io/#org" },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Developers", item: "https://siteclinic.io/developers" },
      { "@type": "ListItem", position: 2, name: "Documentation", item: PAGE_URL },
    ],
  },
};

export const metadata: Metadata = {
  title: "Developer Documentation — Site Clinic",
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Developer Documentation — Site Clinic",
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: "Site Clinic",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Developer Documentation — Site Clinic",
    description: DESCRIPTION,
  },
};

export default function DeveloperDocsPage() {
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
          <Link
            href="/developers"
            className="hover:text-[var(--color-ink)]"
          >
            Developers
          </Link>
          <span className="mx-2" aria-hidden="true">›</span>
          <span className="text-[var(--color-ink)]">Documentation</span>
        </nav>

        <section className="pb-12">
          <div className="mb-3">
            <Eyebrow>Documentation</Eyebrow>
          </div>
          <h1
            className="text-4xl md:text-5xl tracking-tight leading-[1.05] mb-5 text-[var(--color-ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Docs for onboarding, auth, quotas, and{" "}
            <em
              className="text-[var(--color-accent)]"
              style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
            >
              real implementation work.
            </em>
          </h1>
          <p
            className="text-lg text-[var(--color-ink-soft)] leading-relaxed max-w-3xl"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Start with the quickstart if you want the fastest path to a
            successful API call. Documentation grows by iteration — guides
            for authentication, rate limits, error handling, webhooks, code
            examples, and MCP integration land as their contracts firm up.
          </p>
        </section>

        <section className="bg-[var(--color-surface)] border-2 border-[var(--color-accent)] rounded-2xl p-7 mb-6 shadow-sm">
          <div className="mb-3">
            <Eyebrow withDot>Start here</Eyebrow>
          </div>
          <h2
            className="text-2xl tracking-tight mb-3 text-[var(--color-ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Quickstart Guide
          </h2>
          <p className="text-base text-[var(--color-ink-soft)] leading-relaxed mb-5 max-w-2xl">
            Create an account, install the SDK, and make your first
            successful request in a few minutes. The fastest path from zero
            to a real ADA audit response.
          </p>
          <Button href="/developers/docs/quickstart" variant="primary">
            Open quickstart →
          </Button>
        </section>

        <section className="mt-12">
          <div className="max-w-2xl mb-6">
            <div className="mb-3">
              <Eyebrow>Reference surfaces</Eyebrow>
            </div>
            <h2
              className="text-2xl tracking-tight mb-3 text-[var(--color-ink)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Reference + explorer
            </h2>
            <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">
              The API reference lists every endpoint family. The API
              explorer (auth-gated at{" "}
              <code className="text-[var(--color-ink)] bg-[var(--color-bg)] px-1.5 py-0.5 rounded text-[0.92em]">
                app.siteclinic.io
              </code>
              ) lets you exercise requests from the browser.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href="/developers/api-reference" variant="secondary">
              API reference
            </Button>
            <Button href={APP_API_EXPLORER} variant="secondary">
              API explorer
            </Button>
          </div>
        </section>

        <section className="mt-16">
          <div className="max-w-2xl mb-6">
            <div className="mb-3">
              <Eyebrow>Guides</Eyebrow>
            </div>
            <h2
              className="text-2xl tracking-tight mb-3 text-[var(--color-ink)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Implementation guides
            </h2>
            <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">
              Practical guides for the workflows you hit after the first
              successful API call.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {DEVELOPERS_DOCS.map((guide) => (
              <Link
                key={guide.slug}
                href={`/developers/docs/${guide.slug}`}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 hover:bg-[var(--color-surface-hover)] transition-colors no-underline block"
              >
                <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)] mb-1">
                  {guide.cardEyebrow}
                </div>
                <div className="text-sm font-semibold text-[var(--color-ink)] mb-1">
                  {guide.cardTitle}
                </div>
                <div className="text-xs text-[var(--color-ink-soft)] leading-relaxed">
                  {guide.cardDescription}
                </div>
              </Link>
            ))}
            <Link
              href="/developers/mcp"
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 hover:bg-[var(--color-surface-hover)] transition-colors no-underline block"
            >
              <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)] mb-1">
                Agents
              </div>
              <div className="text-sm font-semibold text-[var(--color-ink)] mb-1">
                MCP integration
              </div>
              <div className="text-xs text-[var(--color-ink-soft)] leading-relaxed">
                Run Site Clinic as an MCP server for agent clients.
              </div>
            </Link>
          </div>
        </section>

        <section className="mt-16 text-center">
          <p className="text-sm text-[var(--color-ink-soft)]">
            Have a question that is not in the docs yet?{" "}
            <Link
              href="/contact"
              className="text-[var(--color-accent)] underline underline-offset-[3px]"
            >
              Reach the developer support surface
            </Link>
            .
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
