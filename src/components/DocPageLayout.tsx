import type { ReactNode } from "react";
import Link from "next/link";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { Eyebrow } from "./Eyebrow";
import { Button } from "./Button";
import { CodeBlock } from "./CodeBlock";
import type {
  DevDocPage,
  DocSection,
  DocSectionBlock,
} from "@/lib/developersDocsConfig";

/*
 * DocPageLayout — shared layout for /developers/docs/[slug] pages.
 *
 * Extracted in §5b iteration 13 — 5 doc pages (authentication, rate-limits,
 * error-handling, webhooks, examples) share identical chrome and renderer
 * shape. Driven by DevDocPage config from src/lib/developersDocsConfig.ts.
 *
 * Section kinds rendered:
 *   - "cards":      responsive grid of cards (eyebrow? + title + description)
 *   - "code":       CodeBlock (delegates to src/components/CodeBlock.tsx)
 *   - "paragraphs": one or more text paragraphs
 *
 * Same migration-unit discipline applies: every doc that uses this layout
 * has its slug in sitemap.ts, gate.config.json, and a /welcome/<slug>
 * redirect in next.config.ts.
 *
 * If a 6th doc shape emerges that doesn't fit cards/code/paragraphs, EXTEND
 * the discriminated union in developersDocsConfig.ts and add a new branch
 * in renderSection here. Do NOT special-case at the consuming page.
 */

function renderSection(section: DocSection, key: string): ReactNode {
  switch (section.kind) {
    case "cards":
      return (
        <div
          key={key}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {section.items.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
            >
              {item.eyebrow && (
                <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)] mb-2">
                  {item.eyebrow}
                </div>
              )}
              <div className="text-base font-semibold text-[var(--color-ink)] mb-2">
                {item.title}
              </div>
              <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      );
    case "code":
      return (
        <div key={key}>
          <CodeBlock language={section.language} code={section.code} />
        </div>
      );
    case "paragraphs":
      return (
        <div key={key} className="space-y-4">
          {section.paragraphs.map((para, i) => (
            <p
              key={i}
              className="text-base text-[var(--color-ink-soft)] leading-relaxed"
            >
              {para}
            </p>
          ))}
        </div>
      );
  }
}

function renderSectionBlock(block: DocSectionBlock, idx: number): ReactNode {
  return (
    <section key={idx} className="mb-10">
      {block.heading && (
        <h2
          className="text-2xl tracking-tight mb-4 text-[var(--color-ink)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {block.heading}
        </h2>
      )}
      <div className="space-y-6">
        {block.body.map((s, i) => renderSection(s, `${idx}-${i}`))}
      </div>
    </section>
  );
}

export function DocPageLayout({
  doc,
  jsonLd,
}: {
  doc: DevDocPage;
  jsonLd: Record<string, unknown>;
}) {
  const isExternalPrimary =
    doc.primaryCta.href.startsWith("http://") ||
    doc.primaryCta.href.startsWith("https://");
  const isExternalSecondary =
    doc.secondaryCta.href.startsWith("http://") ||
    doc.secondaryCta.href.startsWith("https://");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
          <Link
            href="/developers/docs"
            className="hover:text-[var(--color-ink)]"
          >
            Documentation
          </Link>
          <span className="mx-2" aria-hidden="true">›</span>
          <span className="text-[var(--color-ink)]">{doc.cardTitle}</span>
        </nav>

        <section className="pb-10">
          <div className="mb-3">
            <Eyebrow>{doc.cardEyebrow}</Eyebrow>
          </div>
          <h1
            className="text-4xl md:text-5xl tracking-tight leading-[1.05] mb-5 text-[var(--color-ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {doc.cardTitle}
          </h1>
          <p className="text-lg text-[var(--color-ink-soft)] leading-relaxed max-w-3xl">
            {doc.hero}
          </p>
        </section>

        {doc.sections.map((block, i) => renderSectionBlock(block, i))}

        <section className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-7 mt-12 text-center">
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              href={doc.primaryCta.href}
              variant="primary"
              {...(isExternalPrimary ? {} : {})}
            >
              {doc.primaryCta.label}
            </Button>
            <Button
              href={doc.secondaryCta.href}
              variant="secondary"
              {...(isExternalSecondary ? {} : {})}
            >
              {doc.secondaryCta.label}
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
