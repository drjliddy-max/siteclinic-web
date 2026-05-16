import Link from "next/link";

/*
 * SiteHeader — global header rendered on every marketing page.
 *
 * Iteration 1: logo only. Nav items + header CTA add as secondary pages
 * cherry-pick in (one nav entry per cherry-pick iteration). This avoids
 * shipping nav links to routes that 404, which would degrade UX and
 * fail gate:seo HTTP-200 checks once those routes enter gate.config.json.
 *
 * Pattern locked: every nav item must point at a route that exists +
 * is in gate.config.json + is in sitemap.ts. Until then, the nav is
 * empty and the logo carries the brand alone.
 */

type NavItem = { id: string; label: string; href: string };

// Grows by one entry per cherry-pick iteration. Each entry must point at
// a route that exists + is in gate.config.json + is in sitemap.ts.
const NAV_ITEMS: NavItem[] = [
  { id: "siteclinic-nav-start-here", label: "Start here", href: "/start-here" }, // Phase 0 customer foundation
  { id: "siteclinic-nav-about", label: "About", href: "/about" }, // §5b iteration 2
  { id: "siteclinic-nav-pricing", label: "Pricing", href: "/pricing" }, // §5b iteration 3
  { id: "siteclinic-nav-proof", label: "Proof", href: "/case-studies" }, // §5b iteration 4 — brand name "Proof", URL /case-studies (per Google-indexed canonical)
  { id: "siteclinic-nav-contact", label: "Contact", href: "/contact" }, // §5b iteration 6
  { id: "siteclinic-nav-developers", label: "Developers", href: "/developers" }, // §5b iteration 7
];

export function SiteHeader() {
  return (
    <header className="border-b border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/"
          id="siteclinic-nav-home"
          className="flex items-center gap-2.5 text-[var(--color-ink)] no-underline"
          aria-label="Site Clinic homepage"
        >
          <span
            className="w-8 h-8 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-white text-sm font-semibold"
            style={{ fontFamily: "var(--font-body)" }}
            aria-hidden="true"
          >
            SC
          </span>
          <span
            className="text-lg font-semibold tracking-tight"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Site Clinic
          </span>
        </Link>

        {NAV_ITEMS.length > 0 && (
          <nav
            aria-label="Main navigation"
            className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                id={item.id}
                key={item.href}
                href={item.href}
                className="text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] no-underline"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
