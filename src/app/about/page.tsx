import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Eyebrow } from "@/components/Eyebrow";
import { Button } from "@/components/Button";

/*
 * About page — siteclinic.io/about
 *
 * §5b iteration 2: cherry-picked from
 * site-monitor/src/app/welcome/about/page.tsx, narrative sections only.
 *
 * DEFERRED to a later iteration (and explicitly noted, not silently dropped):
 *   - 3-up "Delivery layers" cards (depend on `PRODUCT_DELIVERY_LAYERS`
 *     config in site-monitor, not yet ported to siteclinic-web)
 *   - "Platform properties" 3-up grid (depend on PRODUCT_SYSTEM_MODEL config)
 *   - Founder photo (asset `john-liddy-founder.jpg` not yet confirmed
 *     publish-rights-cleared per SOURCE_OF_TRUTH.md §3 — text-only bio
 *     until operator confirms photo reuse)
 *
 * Migration unit pattern (operator rule 2026-05-11):
 *   1. This page          → src/app/about/page.tsx  ✓
 *   2. Sitemap entry      → src/app/sitemap.ts adds /about  (this iteration)
 *   3. Legacy redirect    → next.config.ts adds /welcome/about → /about
 *   4. Gate coverage      → gate.config.json adds /about
 */

const PRINCIPLES = [
  {
    title: "Evidence before claims",
    body:
      "We do not want a sales story, dashboard story, and delivery story that disagree. Support needs to be inspectable and claims need to be scoped.",
  },
  {
    title: "Capabilities graduate by layer",
    body:
      "Platform ambition does not grant shipping rights. Each capability has to earn its way into the app, API, MCP, and public marketing separately.",
  },
  {
    title: "Small-business reality first",
    body:
      "These products were built around the actual operator problem: the site drifts quietly while the owner is busy running the business.",
  },
] as const;

const ABOUT_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": "https://siteclinic.io/about#about-page",
  url: "https://siteclinic.io/about",
  name: "About — Site Clinic",
  description:
    "How Site Clinic works as one product system with app, API, and MCP delivery layers, and why capability maturity stays separate from platform ambition.",
  isPartOf: { "@id": "https://siteclinic.io/#website" },
  about: { "@id": "https://siteclinic.io/#org" },
  mainEntity: {
    "@type": "Person",
    name: "John Liddy",
    jobTitle: "Founder",
    worksFor: { "@id": "https://siteclinic.io/#org" },
  },
};

export const metadata: Metadata = {
  title: "About — Site Clinic",
  description:
    "How Site Clinic works as one product system with app, API, and MCP delivery layers, and why capability maturity stays separate from platform ambition.",
  alternates: { canonical: "https://siteclinic.io/about" },
  openGraph: {
    title: "About — Site Clinic",
    description:
      "How Site Clinic fits as one product system with app, API, and MCP delivery layers.",
    url: "https://siteclinic.io/about",
    siteName: "Site Clinic",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About — Site Clinic",
    description:
      "One product system with delivery layers for the app, API, and MCP.",
  },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ABOUT_JSON_LD) }}
      />
      <SiteHeader />
      <main className="flex-1 max-w-6xl mx-auto px-6 pb-20 w-full">
        <section className="pt-12 pb-14 max-w-4xl">
          <div className="mb-3">
            <Eyebrow>About Site Clinic</Eyebrow>
          </div>
          <h1
            className="text-4xl md:text-5xl tracking-tight leading-[1.05] mb-5 text-[var(--color-ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            One product system with{" "}
            <em
              className="text-[var(--color-accent)]"
              style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
            >
              multiple delivery layers.
            </em>
          </h1>
          <p
            className="text-lg text-[var(--color-ink-soft)] leading-relaxed max-w-3xl"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Site Clinic exists because website risk is rarely one thing.
            Accessibility drift, broken links, weak metadata, crawl issues,
            security headers, AI retrieval, and proof of what changed all
            degrade quietly. The system is built to measure that reality,
            prioritize the next move, and keep the evidence trail honest
            across the app, API, and agent layers.
          </p>
        </section>

        <section className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
          <div
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <div className="mb-3">
              <Eyebrow>Why the system looks like this</Eyebrow>
            </div>
            <h2
              className="text-3xl tracking-tight leading-[1.1] mb-5 text-[var(--color-ink)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Different layers.{" "}
              <em
                className="text-[var(--color-accent)]"
                style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
              >
                One evidence standard.
              </em>
            </h2>
            <div className="space-y-5">
              {PRINCIPLES.map((item) => (
                <div key={item.title}>
                  <div className="font-semibold mb-1 text-[var(--color-ink)]">
                    {item.title}
                  </div>
                  <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <div className="mb-3">
              <Eyebrow>Founder</Eyebrow>
            </div>
            <h2
              className="text-2xl tracking-tight mb-3 text-[var(--color-ink)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              John Liddy
            </h2>
            <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">
              John ran multiple small businesses long before Site Clinic
              existed. The product came from the operator view first: real
              websites break in quiet ways, owners are busy, and the harm
              shows up later unless someone is watching carefully and telling
              the truth about what changed.
            </p>
          </div>
        </section>

        <section
          className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 mt-16"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <div className="mb-3">
            <Eyebrow>Entry point</Eyebrow>
          </div>
          <h2
            className="text-3xl tracking-tight leading-[1.1] mb-4 text-[var(--color-ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            ADA Audit Report remains an{" "}
            <em
              className="text-[var(--color-accent)]"
              style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
            >
              evidence-first entry product.
            </em>
          </h2>
          <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed max-w-3xl">
            The one-time accessibility audit is still a valid way into the
            system, but it is not a fourth delivery layer. It is an
            evidence-first entry point that can hand off into the Site Clinic
            application layer when recurring monitoring or verification is the
            right next step.
          </p>
          <div className="mt-5">
            <Button href="https://adaauditreport.com" variant="text-link">
              Open ADA Audit Report →
            </Button>
          </div>
        </section>

        <section
          className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 mt-16 text-center"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <div className="mb-3">
            <Eyebrow>Where to start</Eyebrow>
          </div>
          <h2
            className="text-3xl tracking-tight leading-[1.1] mb-4 text-[var(--color-ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Start with the layer that{" "}
            <em
              className="text-[var(--color-accent)]"
              style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
            >
              matches the job.
            </em>
          </h2>
          <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed max-w-2xl mx-auto">
            Need recurring monitoring and proof? Start with the Site Clinic
            app layer. Need a one-time accessibility artifact first? Use ADA
            Audit Report. Need to embed contract-ready checks into your own
            software or workflow? Use the developer layers. Present-tense
            claims always follow actual capability maturity.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Button href="/pricing" variant="primary">
              See Site Clinic pricing
            </Button>
            <Button href="https://adaauditreport.com" variant="secondary">
              Visit ADA Audit Report
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
