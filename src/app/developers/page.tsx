import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Eyebrow } from "@/components/Eyebrow";
import { Button } from "@/components/Button";

/*
 * Developers landing — siteclinic.io/developers
 *
 * §5b iteration 7: cherry-picked from
 * site-monitor/src/app/developers/page.tsx, scoped per locked §6 row 2
 * to the PUBLIC developer surface only.
 *
 * Cross-origin links to operations side (auth-gated):
 *   - "Get API Key" / "Sign in" / "Open dashboard"  → app.siteclinic.io/developers/signup|dashboard
 *   - "Try API Explorer"                             → app.siteclinic.io/developers/api-explorer
 *
 * These are NAVIGATION links (not API calls) — no CORS concern, just
 * normal anchor tags pointing at the operations subdomain. Will resolve
 * after Phase 4b DNS cutover. Until then, the auth-gated side stays on
 * its current URLs in site-monitor — operator-facing pre-cutover.
 *
 * DESIGN NORMALIZATION:
 *   Source page uses blue/indigo gradient (`from-blue-50 via-white to-indigo-50`)
 *   and blue-coded developer accents that depart from siteclinic-web's
 *   cream/sage palette. Converted to consistent cream/sage to maintain
 *   "one clear visual direction" per docs/design/DESIGN_THESIS.md.
 *   Code snippet stays as dark monospace block — universal convention even
 *   on light themes, not a design-thesis violation.
 *
 * DEFERRED (4 forward 404s — acceptable per pattern; not in gate.config.json):
 *   - /developers/docs           — public docs landing
 *   - /developers/docs/quickstart — public quickstart
 *   - /developers/api-reference  — public OpenAPI reference
 *   - /developers/mcp            — public MCP guide
 *
 *   All four cherry-pick in subsequent iterations. The /developers
 *   landing references them via primary/secondary CTAs on each offering
 *   card; these CTAs 404 until their iterations land. Same interim-state
 *   pattern used for /pricing → /case-studies before iter 4.
 *
 *   SITE_CLINIC_INTENT_PAGES filter from source dropped — same config
 *   dependency the about / pricing / case-studies cherry-picks deferred.
 *
 * Migration unit pattern:
 *   1. This page          → src/app/developers/page.tsx  ✓
 *   2. Sitemap entry      → src/app/sitemap.ts adds /developers
 *   3. Legacy redirect    → next.config.ts adds /welcome/developers → /developers
 *      (defensive — source had /developers at apex already, but some legacy
 *      links may use /welcome/developers)
 *   4. Gate coverage      → gate.config.json adds /developers
 */

const HERO_SNIPPET = `npm install @siteclinic/api

const client = new SiteClinic({
  apiKey: 'sc_live_...'
});

const audit = await client.ada.audit('https://example.com');`;

const DEVELOPER_OFFERINGS = [
  {
    eyebrow: "Public API layer",
    title: "Perfect Website API",
    summary:
      "Direct integration for developers building product features, agency tooling, dashboards, onboarding flows, internal jobs, and customer-facing automation on top of Site Clinic analysis.",
    bestFor:
      "Choose this when your application owns the user experience and you want full control over request timing, retries, storage, UI, and downstream workflows.",
    advantages: [
      "Call Site Clinic directly through REST, JavaScript, or Python without adding an agent layer.",
      "Use one account for API keys, live and test environments, usage monitoring, billing, and quota enforcement.",
      "Fit audits and health data into your existing product architecture, queues, webhooks, and reporting models.",
    ],
    deliverables: [
      "Public endpoint families for ADA, health, AI, migration, usage, and API-key operations.",
      "Official SDKs, API explorer, quickstart docs, OpenAPI reference, and structured errors with request IDs.",
      "Webhooks, Stripe-backed billing, quota tracking, and self-serve key management in the developer dashboard.",
    ],
    primaryHref: "/developers/docs/quickstart",
    primaryLabel: "Start with the API",
    secondaryHref: "/developers/api-reference",
    secondaryLabel: "Open API reference",
  },
  {
    eyebrow: "Public tool layer",
    title: "Site Clinic MCP",
    summary:
      "A hosted API-backed Model Context Protocol server for teams who want a reviewed agent surface when specific Site Clinic capabilities are explicitly promoted as named tools.",
    bestFor:
      "Choose this when developers are working through AI assistants or coding agents and want the same public API system of record exposed through a curated tool catalog as promotions land.",
    advantages: [
      "Gives agents a curated tool layer instead of relying on brittle prompt instructions or improvised request formats.",
      "Keeps the public API as the system of record while making agent workflows faster to adopt across engineering teams.",
      "Lets you mix human-written product code with agent-driven analysis workflows under the same auth and quota model.",
    ],
    deliverables: [
      "Documented MCP scaffold with Site Clinic API-key auth and the same billing surface as the API product.",
      "A thin stdio wrapper over the public API, with named tool access gated by explicit capability promotion.",
      "A practical bridge for internal copilots, support agents, QA workflows, and code-assistant integrations.",
    ],
    primaryHref: "/developers/mcp",
    primaryLabel: "Browse MCP tools",
    secondaryHref: "/developers/docs",
    secondaryLabel: "Read developer docs",
  },
] as const;

const CAPABILITY_FAMILIES = [
  {
    code: "ADA",
    title: "ADA Compliance",
    body:
      "Public ADA audit workflows and related report-generation surfaces.",
  },
  {
    code: "SPD",
    title: "Performance",
    body:
      "Health and performance checks that are already stable enough for developer use.",
  },
  {
    code: "AI",
    title: "AI & SEO",
    body:
      "Current public AI and SEO analysis endpoints for promoted visibility workflows.",
  },
  {
    code: "MIG",
    title: "Migration",
    body:
      "Migration and implementation helpers that already have bounded public contracts.",
  },
] as const;

const PAGE_URL = "https://siteclinic.io/developers";
const DESCRIPTION =
  "Public developer entry to Site Clinic's API and MCP layers, with docs, reference links, and implementation guidance.";

// Operations-side URLs (cross-origin to app.siteclinic.io per locked §6 row 2)
const APP_SIGNUP = "https://app.siteclinic.io/developers/signup";
const APP_DASHBOARD = "https://app.siteclinic.io/developers/dashboard";
const APP_API_EXPLORER = "https://app.siteclinic.io/developers/api-explorer";

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://siteclinic.io/developers#page",
  url: PAGE_URL,
  name: "Perfect Website API — Site Clinic Developers",
  description: DESCRIPTION,
  isPartOf: { "@id": "https://siteclinic.io/#website" },
  about: { "@id": "https://siteclinic.io/#org" },
  mainEntity: {
    "@type": "ItemList",
    name: "Site Clinic developer layers",
    itemListElement: [
      {
        "@type": "SoftwareApplication",
        position: 1,
        name: "Perfect Website API",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web",
        description:
          "Public REST + SDK access to Site Clinic ADA, health, AI, SEO, migration, and usage capabilities.",
      },
      {
        "@type": "SoftwareApplication",
        position: 2,
        name: "Site Clinic MCP",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web",
        description:
          "Model Context Protocol server exposing Site Clinic capabilities as curated agent tools.",
      },
    ],
  },
};

export const metadata: Metadata = {
  title: "Perfect Website API — Site Clinic",
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Perfect Website API — Site Clinic",
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: "Site Clinic",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Perfect Website API — Site Clinic",
    description: DESCRIPTION,
  },
};

export default function DevelopersPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <SiteHeader />
      <main className="flex-1 max-w-6xl mx-auto px-6 pb-20 w-full">
        <section className="pt-12 pb-14 max-w-4xl mx-auto text-center">
          <div className="mb-3 flex justify-center">
            <Eyebrow>Developers</Eyebrow>
          </div>
          <h1
            className="text-4xl md:text-5xl tracking-tight leading-[1.05] mb-5 text-[var(--color-ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Site Clinic for developers.{" "}
            <em
              className="text-[var(--color-accent)]"
              style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
            >
              Public API + MCP.
            </em>
          </h1>
          <p
            className="text-lg text-[var(--color-ink-soft)] leading-relaxed max-w-3xl mx-auto"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Add Site Clinic capabilities to your application through the API,
            or use MCP when agent workflows are the right surface. Public
            capabilities are available here only after their contracts and
            safety expectations are ready for developer use.
          </p>

          <div
            className="bg-[#0F1826] text-left rounded-lg p-6 mt-10 mb-8 max-w-2xl mx-auto"
            aria-label="Quickstart code example"
          >
            <div
              className="text-emerald-400 text-sm mb-2"
              style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
            >
              {"// Get started in 30 seconds"}
            </div>
            <pre
              className="overflow-x-auto whitespace-pre-wrap text-white text-sm leading-relaxed"
              style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
            >
              {HERO_SNIPPET}
            </pre>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <Button href={APP_SIGNUP} variant="primary">
              Get an API key
            </Button>
            <Button href="/developers/docs/quickstart" variant="secondary">
              Start with the docs
            </Button>
            <Button href={APP_API_EXPLORER} variant="secondary">
              Open API explorer
            </Button>
          </div>
        </section>

        <section
          className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 md:p-10"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <div className="max-w-3xl mb-10">
            <div className="mb-3">
              <Eyebrow>Choose your surface</Eyebrow>
            </div>
            <h2
              className="text-3xl tracking-tight leading-[1.1] mb-4 text-[var(--color-ink)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Two public developer paths{" "}
              <em
                className="text-[var(--color-accent)]"
                style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
              >
                inside one product system.
              </em>
            </h2>
            <p className="text-base text-[var(--color-ink-soft)] leading-relaxed">
              The API and MCP are public developer layers in the same product
              system, but they solve different integration problems. The API
              is the direct product surface. MCP is the agent surface built
              on top of stable capabilities. New capabilities do not ship
              into both automatically.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {DEVELOPER_OFFERINGS.map((offering) => (
              <div
                key={offering.title}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-7 flex flex-col"
              >
                <div className="inline-flex w-fit rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
                  {offering.eyebrow}
                </div>
                <h3 className="mt-4 text-2xl font-semibold text-[var(--color-ink)]">
                  {offering.title}
                </h3>
                <p className="mt-3 text-[var(--color-ink-soft)] leading-relaxed">
                  {offering.summary}
                </p>

                <div className="mt-5 rounded-xl border border-[var(--color-border-inner)] bg-[var(--color-surface)] p-5">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
                    Best when
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-soft)]">
                    {offering.bestFor}
                  </p>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-[var(--color-border-inner)] bg-[var(--color-surface)] p-5">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
                      Advantages
                    </div>
                    <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[var(--color-ink-soft)]">
                      {offering.advantages.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span
                            className="text-[var(--color-accent)] flex-shrink-0"
                            aria-hidden="true"
                          >
                            •
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl border border-[var(--color-border-inner)] bg-[var(--color-surface)] p-5">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
                      Deliverables
                    </div>
                    <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[var(--color-ink-soft)]">
                      {offering.deliverables.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span
                            className="text-[var(--color-accent)] flex-shrink-0"
                            aria-hidden="true"
                          >
                            •
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button href={offering.primaryHref} variant="primary">
                    {offering.primaryLabel}
                  </Button>
                  <Button href={offering.secondaryHref} variant="secondary">
                    {offering.secondaryLabel}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          className="mt-16"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <div className="max-w-3xl mx-auto text-center mb-10">
            <div className="mb-3 flex justify-center">
              <Eyebrow>What is public today</Eyebrow>
            </div>
            <h2
              className="text-3xl tracking-tight leading-[1.1] mb-4 text-[var(--color-ink)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Current public capability{" "}
              <em
                className="text-[var(--color-accent)]"
                style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
              >
                families.
              </em>
            </h2>
            <p className="text-base text-[var(--color-ink-soft)] leading-relaxed">
              Contract-ready coverage for the capability subset that has
              already graduated into the public developer layers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CAPABILITY_FAMILIES.map((cap) => (
              <div
                key={cap.code}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 text-center"
              >
                <div
                  className="w-14 h-14 rounded-full bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 flex items-center justify-center mx-auto mb-4 text-[var(--color-accent)] font-bold text-sm tracking-wider"
                  style={{ fontFamily: "var(--font-body)" }}
                  aria-hidden="true"
                >
                  {cap.code}
                </div>
                <h3 className="text-base font-semibold text-[var(--color-ink)] mb-2">
                  {cap.title}
                </h3>
                <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">
                  {cap.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 md:p-10 mt-16"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <div className="max-w-3xl">
            <div className="mb-3">
              <Eyebrow>Where to manage your account</Eyebrow>
            </div>
            <h2
              className="text-2xl tracking-tight leading-[1.1] mb-4 text-[var(--color-ink)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              The dashboard, signup, and API explorer live at{" "}
              <em
                className="text-[var(--color-accent)]"
                style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
              >
                app.siteclinic.io.
              </em>
            </h2>
            <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed mb-6 max-w-2xl">
              Public docs, API reference, and MCP guides live here on{" "}
              <code className="text-[var(--color-ink)] bg-[var(--color-bg)] px-1.5 py-0.5 rounded text-[0.92em]">
                siteclinic.io
              </code>
              . Anything that needs to know who you are — account creation,
              API key management, live dashboards, the API explorer — lives
              on{" "}
              <code className="text-[var(--color-ink)] bg-[var(--color-bg)] px-1.5 py-0.5 rounded text-[0.92em]">
                app.siteclinic.io
              </code>
              .
            </p>
            <div className="flex flex-wrap gap-3">
              <Button href={APP_SIGNUP} variant="primary">
                Sign up
              </Button>
              <Button href={APP_DASHBOARD} variant="secondary">
                Open dashboard
              </Button>
              <Button href={APP_API_EXPLORER} variant="text-link">
                API explorer →
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
