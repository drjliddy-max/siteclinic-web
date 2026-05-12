import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Eyebrow } from "@/components/Eyebrow";
import { Button } from "@/components/Button";
import {
  SITE_CLINIC_INTENT_PAGE_MAP,
  SITE_CLINIC_INTENT_SLUGS,
} from "@/lib/intentPages";

/*
 * Dynamic [slug] route — renders the 4 Site Clinic intent pages.
 *
 * §5b iteration 12. Replaces site-monitor's welcome/[slug]/page.tsx
 * (~353 lines) plus the SITE_CLINIC_INTENT_PAGES config it depended on.
 *
 * Routing precedence:
 *   - Concrete routes (/about, /pricing, /contact, /case-studies, /privacy,
 *     /terms, /accessibility, /developers, /compare/*) take precedence over
 *     this dynamic [slug] match.
 *   - This handler only fires for single-segment paths NOT matched above.
 *   - If the slug is not in SITE_CLINIC_INTENT_SLUGS, `notFound()` returns
 *     a 404 — typos and unknown apex paths still 404 as expected.
 *
 * Why dynamic [slug] instead of 4 concrete routes:
 *   - Content is config-driven (SITE_CLINIC_INTENT_PAGES in src/lib/)
 *   - Rendering is identical across all 4 — duplication would be pure boilerplate
 *   - Adding a 5th intent page is a one-line config edit + a sitemap/gate update,
 *     not a new route file
 *   - sitemap.ts iterates the config; gate covers each concrete URL by slug
 *
 * Migration unit pattern:
 *   1. This page          → src/app/[slug]/page.tsx (handles 4 slugs)  ✓
 *   2. Sitemap entries    → src/app/sitemap.ts iterates SITE_CLINIC_INTENT_PAGES
 *   3. Legacy redirects   → 4 entries in next.config.ts for /welcome/<slug> → /<slug>
 *   4. Gate coverage      → all 4 slug routes in gate.config.json
 */

export function generateStaticParams() {
  return SITE_CLINIC_INTENT_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = SITE_CLINIC_INTENT_PAGE_MAP[slug];
  if (!page) return {};

  const canonical = `https://siteclinic.io/${slug}`;
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical },
    openGraph: {
      title: page.title,
      description: page.description,
      url: canonical,
      siteName: "Site Clinic",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
    },
  };
}

export default async function IntentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = SITE_CLINIC_INTENT_PAGE_MAP[slug];
  if (!page) notFound();

  const canonical = `https://siteclinic.io/${slug}`;
  const isExternalSecondary =
    page.secondaryCtaHref.startsWith("http://") ||
    page.secondaryCtaHref.startsWith("https://");

  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonical}#page`,
    url: canonical,
    name: page.title,
    description: page.description,
    isPartOf: { "@id": "https://siteclinic.io/#website" },
    about: { "@id": "https://siteclinic.io/#org" },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${canonical}#faqs`,
    isPartOf: { "@id": `${canonical}#page` },
    mainEntity: page.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <SiteHeader />
      <main
        className="flex-1 max-w-4xl mx-auto px-6 pb-20 w-full"
        style={{ fontFamily: "var(--font-body)" }}
      >
        <section className="pt-12 pb-10">
          <div className="mb-3">
            <Eyebrow>Site Clinic intent page</Eyebrow>
          </div>
          <h1
            className="text-4xl md:text-5xl tracking-tight leading-[1.05] mb-5 text-[var(--color-ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {page.h1}
          </h1>
          <p className="text-lg text-[var(--color-ink-soft)] leading-relaxed max-w-3xl">
            {page.opening}
          </p>
        </section>

        <section className="grid lg:grid-cols-2 gap-6 mb-10">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-7">
            <div className="mb-3">
              <Eyebrow>Who it is for</Eyebrow>
            </div>
            <ul className="space-y-3 text-sm text-[var(--color-ink-soft)] leading-relaxed">
              {page.whoItIsFor.map((item) => (
                <li key={item} className="flex gap-2">
                  <span
                    className="text-[var(--color-accent)] flex-shrink-0"
                    aria-hidden="true"
                  >
                    →
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-7">
            <div className="mb-3">
              <Eyebrow>What evidence we capture</Eyebrow>
            </div>
            <ul className="space-y-3 text-sm text-[var(--color-ink-soft)] leading-relaxed">
              {page.evidenceCaptures.map((item) => (
                <li key={item} className="flex gap-2">
                  <span
                    className="text-[var(--color-accent)] flex-shrink-0"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <div className="mb-3">
            <Eyebrow>Sample output</Eyebrow>
          </div>
          <h2
            className="text-2xl tracking-tight leading-[1.1] mb-6 text-[var(--color-ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            What you actually see
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {page.sampleOutput.map((item) => (
              <div
                key={item.label}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5"
              >
                <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)] mb-2">
                  {item.label}
                </div>
                <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 mb-12">
          <div className="mb-3">
            <Eyebrow>Comparison</Eyebrow>
          </div>
          <h2
            className="text-2xl tracking-tight leading-[1.1] mb-4 text-[var(--color-ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {page.comparisonTitle}
          </h2>
          <p className="text-[var(--color-ink-soft)] leading-relaxed mb-5">
            {page.comparisonBody}
          </p>
          <ul className="space-y-3 text-sm text-[var(--color-ink-soft)] leading-relaxed">
            {page.comparisonPoints.map((point) => (
              <li key={point} className="flex gap-2">
                <span
                  className="text-[var(--color-accent)] flex-shrink-0"
                  aria-hidden="true"
                >
                  •
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="max-w-4xl mb-12">
          <div className="mb-3">
            <Eyebrow>FAQ</Eyebrow>
          </div>
          <h2
            className="text-2xl tracking-tight mb-6 text-[var(--color-ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Straight answers
          </h2>
          <div className="space-y-4">
            {page.faqs.map((faq) => (
              <details
                key={faq.question}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 group"
              >
                <summary className="font-semibold cursor-pointer list-none flex items-center justify-between text-[var(--color-ink)]">
                  {faq.question}
                  <span
                    className="text-[var(--color-ink-soft)] text-xl group-open:rotate-45 transition-transform"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-4 text-sm text-[var(--color-ink-soft)] leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section className="bg-[var(--color-surface)] border-2 border-[var(--color-accent)] rounded-2xl p-7 text-center">
          <p className="text-[var(--color-ink-soft)] mb-5">
            Ready to put this monitoring loop on your site?
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button href={page.primaryCtaHref} variant="primary">
              {page.primaryCtaLabel}
            </Button>
            <Button
              href={page.secondaryCtaHref}
              variant={isExternalSecondary ? "secondary" : "secondary"}
            >
              {page.secondaryCtaLabel}
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
