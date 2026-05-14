import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Eyebrow } from "@/components/Eyebrow";
import { Button } from "@/components/Button";

/*
 * Quickstart Guide — siteclinic.io/developers/docs/quickstart
 *
 * §5b iteration 8: cherry-picked from
 * site-monitor/src/app/developers/docs/quickstart/page.tsx.
 *
 * DESIGN NORMALIZATION:
 *   Source used blue/indigo gradients + multi-color SDK badges (yellow/blue)
 *   and was a `"use client"` component to support clipboard-copy buttons
 *   on code snippets. For iteration 8 we keep the dark-code-block convention
 *   but skip the clipboard buttons — they're a nice-to-have, require client
 *   component + browser API surface, and aren't needed to convey the
 *   quickstart's information. Users can select + copy normally. The page
 *   stays as a server component, which is simpler.
 *
 *   Cross-origin links to app.siteclinic.io for signup (auth-gated per
 *   locked §6 row 2).
 *
 * STRUCTURE PRESERVED:
 *   - Breadcrumb (Developers › Documentation › Quickstart)
 *   - Three-step progression (Get API Key → Install SDK → First API Call)
 *   - Code examples in JS and Python for each step
 *
 * Migration unit pattern:
 *   1. This page          → src/app/developers/docs/quickstart/page.tsx  ✓
 *   2. Sitemap entry      → src/app/sitemap.ts adds /developers/docs/quickstart
 *   3. Legacy redirect    → next.config.ts adds /welcome/developers/docs/quickstart → /developers/docs/quickstart
 *   4. Gate coverage      → gate.config.json adds /developers/docs/quickstart
 */

const APP_SIGNUP = "https://app.siteclinic.io/developers/signup";

const INSTALL_JS = `npm install @siteclinic/api`;
const INSTALL_PY = `pip install siteclinic`;

const EXAMPLE_JS = `import SiteClinic from '@siteclinic/api';

const client = new SiteClinic({
  apiKey: 'sc_live_your_api_key_here'
});

async function analyzeWebsite() {
  const audit = await client.ada.audit('https://example.com');
  console.log(\`Violations: \${audit.violations.length}\`);
  return audit;
}

analyzeWebsite();`;

const EXAMPLE_PY = `import siteclinic

client = siteclinic.SiteClinic(api_key='sc_live_your_api_key_here')

audit = client.ada.audit('https://example.com')
print(f'Violations: {len(audit.violations)}')`;

const PAGE_URL = "https://siteclinic.io/developers/docs/quickstart";
const DESCRIPTION =
  "Get started with the Site Clinic API in under 5 minutes: account, API key, SDK install, and first successful ADA audit call.";

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": "https://siteclinic.io/developers/docs/quickstart#article",
  url: PAGE_URL,
  headline: "Quickstart Guide — Site Clinic API",
  description: DESCRIPTION,
  isPartOf: { "@id": "https://siteclinic.io/#website" },
  about: { "@id": "https://siteclinic.io/#org" },
  inLanguage: "en-US",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Developers", item: "https://siteclinic.io/developers" },
      { "@type": "ListItem", position: 2, name: "Documentation", item: "https://siteclinic.io/developers/docs" },
      { "@type": "ListItem", position: 3, name: "Quickstart", item: PAGE_URL },
    ],
  },
};

export const metadata: Metadata = {
  title: "Quickstart Guide — Site Clinic API",
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Quickstart Guide — Site Clinic API",
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: "Site Clinic",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quickstart Guide — Site Clinic API",
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
        {/* Language badge: solid sage with white text. Sage-tint-with-sage-text
            fails WCAG AA contrast against the dark code surface — caught by
            gate:ada and confirmed via the /accessibility claim ("block promotion
            on serious violations"). */}
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

function StepHeader({
  number,
  title,
}: {
  number: number;
  title: string;
}) {
  return (
    <div className="flex items-center gap-4 mb-4">
      <div
        className="w-10 h-10 rounded-full bg-[var(--color-accent)] text-white flex items-center justify-center font-semibold text-sm flex-shrink-0"
        style={{ fontFamily: "var(--font-body)" }}
        aria-hidden="true"
      >
        {number}
      </div>
      <h2
        className="text-2xl tracking-tight text-[var(--color-ink)]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h2>
    </div>
  );
}

export default function QuickstartPage() {
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
          <Link
            href="/developers/docs"
            className="hover:text-[var(--color-ink)]"
          >
            Documentation
          </Link>
          <span className="mx-2" aria-hidden="true">›</span>
          <span className="text-[var(--color-ink)]">Quickstart</span>
        </nav>

        <section className="pb-10">
          <div className="mb-3">
            <Eyebrow>Quickstart</Eyebrow>
          </div>
          <h1
            className="text-4xl md:text-5xl tracking-tight leading-[1.05] mb-5 text-[var(--color-ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            API quickstart: first call in{" "}
            <em
              className="text-[var(--color-accent)]"
              style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
            >
              five minutes.
            </em>
          </h1>
          <p
            className="text-lg text-[var(--color-ink-soft)] leading-relaxed max-w-3xl"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Create a developer account, generate an API key, install the SDK,
            and make your first successful request. Developer plans begin with
            a 30-day trial and include live and test keys.
          </p>
        </section>

        <section className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 mb-8">
          <div className="mb-2">
            <Eyebrow>Building a website?</Eyebrow>
          </div>
          <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">
            This page is for API implementation. If the goal is a finished
            website, start with{" "}
            <Link
              href="/developers/docs/foundation"
              className="text-[var(--color-accent)] underline underline-offset-[3px]"
            >
              Client Foundation
            </Link>{" "}
            to choose the build path, requirements, proof artifacts, and
            current product boundaries first.
          </p>
        </section>

        <section className="space-y-10">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8">
            <StepHeader number={1} title="Get your API key" />
            <p className="text-base text-[var(--color-ink-soft)] leading-relaxed mb-5">
              Sign up for a Site Clinic developer account, verify your email,
              and generate a key. Live and test keys are issued separately so
              you can develop without affecting usage on a real workload.
            </p>
            <ul className="space-y-2 text-sm text-[var(--color-ink-soft)] mb-6">
              <li className="flex gap-2">
                <span
                  className="text-[var(--color-accent)] flex-shrink-0"
                  aria-hidden="true"
                >
                  ✓
                </span>
                <span>Create your developer account</span>
              </li>
              <li className="flex gap-2">
                <span
                  className="text-[var(--color-accent)] flex-shrink-0"
                  aria-hidden="true"
                >
                  ✓
                </span>
                <span>Verify your email address</span>
              </li>
              <li className="flex gap-2">
                <span
                  className="text-[var(--color-accent)] flex-shrink-0"
                  aria-hidden="true"
                >
                  ✓
                </span>
                <span>Generate your first API key</span>
              </li>
            </ul>
            <Button href={APP_SIGNUP} variant="primary">
              Create account →
            </Button>
          </div>

          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8">
            <StepHeader number={2} title="Install the SDK" />
            <p className="text-base text-[var(--color-ink-soft)] leading-relaxed mb-6">
              Choose your preferred language. Official SDKs cover JavaScript
              (Node + browser) and Python (3.8+). The REST API is also
              callable from any HTTP client.
            </p>
            <div className="space-y-4 mb-4">
              <CodeBlock language="javascript" code={INSTALL_JS} />
              <CodeBlock language="python" code={INSTALL_PY} />
            </div>
            <p className="text-sm text-[var(--color-ink-soft)]">
              Prefer REST directly?{" "}
              <Link
                href="/developers/api-reference"
                className="text-[var(--color-accent)] underline underline-offset-[3px]"
              >
                View the API reference
              </Link>
              .
            </p>
          </div>

          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8">
            <StepHeader number={3} title="Make your first call" />
            <p className="text-base text-[var(--color-ink-soft)] leading-relaxed mb-6">
              Run an ADA audit against a known URL. The response includes
              violations, severity, request ID, and structured remediation
              guidance.
            </p>
            <div className="space-y-4">
              <CodeBlock language="javascript" code={EXAMPLE_JS} />
              <CodeBlock language="python" code={EXAMPLE_PY} />
            </div>
          </div>
        </section>

        <section
          className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-7 mt-12"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <div className="mb-3">
            <Eyebrow>What is next</Eyebrow>
          </div>
          <h2
            className="text-2xl tracking-tight mb-4 text-[var(--color-ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Once your first call works
          </h2>
          <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed mb-5">
            Wire usage limits + retries (rate-limits guide is coming next),
            handle structured errors with request IDs (error-handling guide
            is coming), and decide whether async webhooks fit your workflow
            better than polling.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button href="/developers/docs" variant="secondary">
              ← Back to docs
            </Button>
            <Button href="/developers/api-reference" variant="text-link">
              API reference →
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
