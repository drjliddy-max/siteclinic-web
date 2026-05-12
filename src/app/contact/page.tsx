import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Eyebrow } from "@/components/Eyebrow";
import { WaitlistForm } from "@/components/WaitlistForm";

/*
 * Contact — siteclinic.io/contact
 *
 * §5b iteration 6: cherry-picked from
 * site-monitor/src/app/welcome/contact/page.tsx.
 *
 * BACKEND COUPLING (operator label "wired, not verified"):
 *
 *   The guided-setup form (WaitlistForm) cross-origin POSTs to
 *   https://app.siteclinic.io/api/siteclinic/waitlist (env-overridable
 *   via NEXT_PUBLIC_SITECLINIC_WAITLIST_API). Same wiring shape as
 *   CheckoutButton (iteration 3) — works locally as UI, but the POST
 *   itself will CORS-fail from localhost until site-monitor's allowlist
 *   on the endpoint includes the consuming origin.
 *
 *   Phase 4a verification adds /api/siteclinic/waitlist to the same
 *   CORS allowlist update that /api/siteclinic/checkout needs, then
 *   tests a real round-trip from staging.
 *
 * DEFERRED:
 *   - PRODUCT_SYSTEM_MODEL.name config dependency — hardcoded "Site Clinic"
 *     inline (same deferral as /about, /pricing, /case-studies).
 *
 * Migration unit pattern:
 *   1. This page          → src/app/contact/page.tsx  ✓
 *   2. Sitemap entry      → src/app/sitemap.ts adds /contact
 *   3. Legacy redirect    → next.config.ts adds /welcome/contact → /contact
 *   4. Gate coverage      → gate.config.json adds /contact
 */

const ROUTES = [
  {
    title: "Site Clinic app layer",
    body:
      "Questions about monitoring, onboarding, billing, verification, proof, or which recurring tier fits your sites.",
    href: "mailto:hello@siteclinic.io",
    label: "hello@siteclinic.io",
  },
  {
    title: "ADA Audit Report",
    body:
      "Questions about the $49 audit, sample reports, review demos, or implementation handoff.",
    href: "mailto:audit@adaauditreport.com",
    label: "audit@adaauditreport.com",
  },
  {
    title: "Developer layers",
    body:
      "Perfect Website API and Site Clinic MCP questions, docs, account setup, pricing, or developer workflow fit.",
    href: "/developers",
    label: "Open developer layers",
  },
] as const;

const PAGE_URL = "https://siteclinic.io/contact";
const DESCRIPTION =
  "Reach Site Clinic for app-layer onboarding, developer-layer questions, ADA Audit Report handoff, or guided intake.";

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": "https://siteclinic.io/contact#page",
  url: PAGE_URL,
  name: "Contact — Site Clinic",
  description: DESCRIPTION,
  isPartOf: { "@id": "https://siteclinic.io/#website" },
  about: { "@id": "https://siteclinic.io/#org" },
  mainEntity: {
    "@id": "https://siteclinic.io/#org",
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "hello@siteclinic.io",
        availableLanguage: ["en"],
      },
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: "audit@adaauditreport.com",
        areaServed: "US",
        availableLanguage: ["en"],
      },
    ],
  },
};

export const metadata: Metadata = {
  title: "Contact — Site Clinic",
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Contact — Site Clinic",
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: "Site Clinic",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact — Site Clinic",
    description: DESCRIPTION,
  },
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <SiteHeader />
      <main className="flex-1 max-w-6xl mx-auto px-6 pb-20 w-full">
        <section className="pt-12 pb-14 max-w-3xl">
          <div className="mb-3">
            <Eyebrow>Contact</Eyebrow>
          </div>
          <h1
            className="text-4xl md:text-5xl tracking-tight leading-[1.05] mb-5 text-[var(--color-ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Reach the right surface{" "}
            <em
              className="text-[var(--color-accent)]"
              style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
            >
              without guesswork.
            </em>
          </h1>
          <p
            className="text-lg text-[var(--color-ink-soft)] leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Site Clinic is one product system with app, API, and MCP delivery
            layers. This page routes you into the right current public surface
            without pretending every question belongs to the same workflow.
          </p>
        </section>

        <section
          className="grid lg:grid-cols-[1fr_1.05fr] gap-8 items-start"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <div className="space-y-6">
            {ROUTES.map((route) => {
              const isMailto = route.href.startsWith("mailto:");
              return (
                <div
                  key={route.title}
                  className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-7"
                >
                  <div className="font-semibold mb-2 text-[var(--color-ink)]">
                    {route.title}
                  </div>
                  <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed mb-4">
                    {route.body}
                  </p>
                  {isMailto ? (
                    <a
                      href={route.href}
                      className="text-[var(--color-accent)] font-medium underline underline-offset-[3px]"
                    >
                      {route.label}
                    </a>
                  ) : (
                    <Link
                      href={route.href}
                      className="text-[var(--color-accent)] font-medium underline underline-offset-[3px]"
                    >
                      {route.label}
                    </Link>
                  )}
                </div>
              );
            })}

            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-7">
              <div className="font-semibold mb-2 text-[var(--color-ink)]">
                Response expectation
              </div>
              <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">
                Guided setup and sales questions usually get a human response
                within one business day. Billing or urgent customer account
                issues should go to{" "}
                <a
                  href="mailto:hello@siteclinic.io"
                  className="text-[var(--color-accent)] underline underline-offset-[3px]"
                >
                  hello@siteclinic.io
                </a>
                .
              </p>
            </div>
          </div>

          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8">
            <div className="mb-3">
              <Eyebrow>Guided setup</Eyebrow>
            </div>
            <h2
              className="text-3xl tracking-tight leading-[1.1] mb-4 text-[var(--color-ink)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Prefer a human to help place the{" "}
              <em
                className="text-[var(--color-accent)]"
                style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
              >
                first site?
              </em>
            </h2>
            <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed mb-6">
              This form posts into the current Site Clinic intake flow. Send
              your email and site URL and we will use that context to help with
              guided onboarding, data connections, or the right layer for the
              job.
            </p>
            <WaitlistForm />
            <div className="mt-6 pt-6 border-t border-[var(--color-border)] text-sm text-[var(--color-ink-soft)]">
              Quick links:
              <div className="flex flex-wrap gap-3 mt-3">
                <Link
                  href="/pricing"
                  className="text-[var(--color-accent)] underline underline-offset-[3px]"
                >
                  Site Clinic pricing
                </Link>
                <Link
                  href="/developers"
                  className="text-[var(--color-accent)] underline underline-offset-[3px]"
                >
                  Developers
                </Link>
                <a
                  href="https://adaauditreport.com"
                  className="text-[var(--color-accent)] underline underline-offset-[3px]"
                >
                  ADA Audit Report
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
