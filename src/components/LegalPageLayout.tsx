import type { ReactNode } from "react";
import Link from "next/link";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

/*
 * LegalPageLayout — shared chrome for /privacy, /terms, /accessibility.
 *
 * Extracted from §5b iteration 5. Rule of three honored — exactly three
 * consumers ship together, structure is genuinely identical (legal
 * boilerplate: title + lastUpdated + sections of h2/p), abstraction
 * pays off without overreach.
 *
 * If a 4th legal-shaped page appears (cookie policy, DPA, etc.),
 * this is the right place to extend. If non-legal pages start needing
 * the same shape, consider lifting to build-websites-tools.
 *
 * Per design thesis: max-w-3xl reading width (narrower than the 6xl
 * marketing surface), serif h1 with italic accent option, body in Geist
 * with prose-style spacing. No "prose" plugin — explicit utility classes
 * keep the gate-checkable HTML structure deterministic.
 */

type LegalPageLayoutProps = {
  title: string;
  italicAccent?: string;
  lastUpdated: string;
  jsonLd: Record<string, unknown>;
  children: ReactNode;
};

export function LegalPageLayout({
  title,
  italicAccent,
  lastUpdated,
  jsonLd,
  children,
}: LegalPageLayoutProps) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main
        className="flex-1 max-w-3xl mx-auto px-6 py-12 w-full"
        style={{ fontFamily: "var(--font-body)" }}
      >
        <h1
          className="text-4xl md:text-5xl tracking-tight leading-[1.1] mb-2 text-[var(--color-ink)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {italicAccent ? (
            <>
              {title}{" "}
              <em
                className="text-[var(--color-accent)]"
                style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
              >
                {italicAccent}
              </em>
            </>
          ) : (
            title
          )}
        </h1>
        <p className="text-sm text-[var(--color-ink-soft)] mb-10">
          Last updated: {lastUpdated}
        </p>

        <div className="space-y-8 text-[var(--color-ink-soft)] leading-relaxed">
          {children}
        </div>

        <p className="mt-12 text-sm">
          <Link
            href="/"
            className="text-[var(--color-accent)] underline underline-offset-[3px] hover:text-[var(--color-accent-hover)]"
          >
            ← Back to Site Clinic
          </Link>
        </p>
      </main>
      <SiteFooter />
    </>
  );
}

/*
 * Section helper — keeps every legal page using the same h2 + body
 * spacing. Children can be ReactNode so inline <a> + <code> work
 * naturally without escaping the structure.
 */
type LegalSectionProps = {
  heading: string;
  children: ReactNode;
};

export function LegalSection({ heading, children }: LegalSectionProps) {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-3 text-[var(--color-ink)]">
        {heading}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
