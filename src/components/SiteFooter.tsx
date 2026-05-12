import Link from "next/link";

/*
 * SiteFooter — global footer rendered on every marketing page.
 *
 * Iteration 1: minimal copyright + legal-links-deferred. Doctrine §31
 * (build-websites-template/03-build-standard.md) requires footer links
 * to legal pages — those add to FOOTER_LINKS as /privacy, /terms,
 * /accessibility cherry-pick in. Same pattern as SiteHeader nav.
 */

type FooterLink = { label: string; href: string };

// Legal trio added in §5b iteration 5 — doctrine §06 trust-element
// requirement now satisfied. Each link points at a route that exists +
// is in gate.config.json + is in sitemap.ts (same discipline rule as
// SiteHeader nav).
const FOOTER_LINKS: FooterLink[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Accessibility", href: "/accessibility" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer
      className="mt-auto border-t border-[var(--color-border)] py-8 px-6"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-[var(--color-ink-soft)]">
          © {year} Site Clinic. All rights reserved.
        </p>
        {FOOTER_LINKS.length > 0 && (
          <nav className="flex items-center gap-6 text-sm">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] no-underline"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </footer>
  );
}
