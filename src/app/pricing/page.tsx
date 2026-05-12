import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Eyebrow } from "@/components/Eyebrow";
import { Button } from "@/components/Button";
import { CheckoutButton } from "@/components/CheckoutButton";
import { SITE_CLINIC_INTENT_PAGES } from "@/lib/intentPages";

/*
 * Pricing — siteclinic.io/pricing
 *
 * §5b iteration 3: cherry-picked from
 * site-monitor/src/app/welcome/pricing/page.tsx.
 *
 * STRIPE COUPLING (operator note 2026-05-11 "needs to correctly link to
 * Stripe and produce deliverables"):
 *
 *   Checkout flow per locked §6 row 4:
 *     /pricing tier button (this page)
 *       → CheckoutButton form (email + site URL)
 *       → POST cross-origin to https://app.siteclinic.io/api/siteclinic/checkout
 *       → Stripe Checkout session
 *       → Stripe webhook (site-monitor /api/stripe/webhook)
 *       → Account provisioned + siteUrl attached + welcome email
 *       → Customer lands at dashboard (app.siteclinic.io/c/<slug>)
 *
 *   The "deliverables" the customer pays for live in site-monitor unchanged:
 *   nightly monitoring, ADA scans, security/SEO/performance checks, alerts,
 *   monthly brief (Pro), portfolio dashboard (Agency). siteclinic-web only
 *   owns the entry door (checkout button).
 *
 *   Local verification: page renders, form opens/validates. Cross-origin
 *   POST will CORS-fail from localhost — that's expected pre-Phase 4a.
 *   Real Stripe round-trip test happens against the staging deploy after
 *   site-monitor's CORS allowlist is updated to include siteclinic-web's
 *   origin (test-mode Stripe keys only until Phase 4b cutover).
 *
 * DEFERRED to a later iteration (named not silently dropped):
 *   - "Intent pages" section (depends on SITE_CLINIC_INTENT_PAGES config in
 *     site-monitor's @/welcome/intentPages.ts — not yet ported).
 *
 * Migration unit pattern (operator rule 2026-05-11):
 *   1. This page          → src/app/pricing/page.tsx  ✓
 *   2. Sitemap entry      → src/app/sitemap.ts adds /pricing
 *   3. Legacy redirect    → next.config.ts adds /welcome/pricing → /pricing
 *   4. Gate coverage      → gate.config.json adds /pricing
 */

const PLANS = [
  {
    name: "Basic",
    price: "$49",
    tier: "basic" as const,
    badge: null,
    summary:
      "One site. The strongest public-data visibility dashboard we can deliver without extra setup.",
    features: [
      "Public-data monitoring for one site",
      "Accessibility, broken links, performance, SEO, and security checks",
      "Canonical dashboard and re-scan workflow",
      "Honest issue alerts when something changes",
      "Upgrade path into deeper connected visibility context",
      "14-day free trial and cancel-anytime billing",
    ],
  },
  {
    name: "Pro",
    price: "$149",
    tier: "pro" as const,
    badge: "Most popular",
    summary:
      "Up to five sites. Adds connected-data onboarding and guided visibility context.",
    features: [
      "Up to 5 sites, 25 pages each",
      "Everything in Basic",
      "GA4, Search Console, and connected-data onboarding help",
      "Visibility context for discovery, traffic, and AI-search signals when sources are connected",
      "Monthly written brief and priority guidance",
      "14-day free trial and cancel-anytime billing",
    ],
  },
  {
    name: "Agency",
    price: "$349",
    tier: "agency" as const,
    badge: null,
    summary:
      "Up to 25 sites. The same operating loop, coordinated across a portfolio.",
    features: [
      "Up to 25 sites, 25 pages each",
      "Portfolio dashboard with up to 25 monitored sites",
      "Shared onboarding for connected integrations where permission is granted",
      "Agency-scale prioritization, follow-through, and proof workflow",
      "The same canonical truth rules across every included site",
      "14-day free trial and cancel-anytime billing",
    ],
  },
] as const;

const FAQS = [
  {
    q: "Do I need Google Analytics or Search Console before I sign up?",
    a: "No. Basic works from public evidence alone. Pro and Agency add onboarding for private-data sections when those integrations are useful and permission is granted.",
  },
  {
    q: "Is the developer API included in Site Clinic pricing?",
    a: "No. Site Clinic is the recurring visibility platform for owners and agencies. The developer API is a separate product with its own portal and billing.",
  },
  {
    q: "What happens after checkout?",
    a: "We attach your first site automatically, open the dashboard, and start the same operating loop the pricing page promises. For Agency, you add the rest of the portfolio inside the account.",
  },
  {
    q: "Do you offer annual contracts or forced setup fees?",
    a: "No. Plans bill monthly, every tier starts with a 14-day free trial, and you can cancel before the trial ends if the fit is not there.",
  },
] as const;

const PRICING_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://siteclinic.io/pricing#pricing-page",
  url: "https://siteclinic.io/pricing",
  name: "Pricing — Site Clinic",
  isPartOf: { "@id": "https://siteclinic.io/#website" },
  about: { "@id": "https://siteclinic.io/#org" },
  mainEntity: {
    "@type": "Product",
    name: "Site Clinic",
    description:
      "Recurring visibility platform for small-business websites — monitoring, prioritization, verification, and proof.",
    brand: { "@id": "https://siteclinic.io/#org" },
    offers: PLANS.map((p) => ({
      "@type": "Offer",
      name: p.name,
      price: p.price.replace("$", ""),
      priceCurrency: "USD",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: p.price.replace("$", ""),
        priceCurrency: "USD",
        billingIncrement: 1,
        unitCode: "MON",
      },
      availability: "https://schema.org/InStock",
      eligibleCustomerType: "https://schema.org/BusinessEntity",
    })),
  },
};

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://siteclinic.io/pricing#faqs",
  isPartOf: { "@id": "https://siteclinic.io/pricing#pricing-page" },
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export const metadata: Metadata = {
  title: "Pricing — Site Clinic",
  description:
    "Site Clinic pricing for the recurring visibility platform: Basic $49, Pro $149, Agency $349. 14-day free trial. Honest product boundaries.",
  alternates: { canonical: "https://siteclinic.io/pricing" },
  openGraph: {
    title: "Pricing — Site Clinic",
    description:
      "Basic $49, Pro $149, Agency $349. 14-day free trial. Cancel anytime.",
    url: "https://siteclinic.io/pricing",
    siteName: "Site Clinic",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing — Site Clinic",
    description:
      "Basic $49, Pro $149, Agency $349. Site Clinic pricing matches the real product and trial flow.",
  },
};

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PRICING_JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />
      <SiteHeader />
      <main className="flex-1 max-w-6xl mx-auto px-6 pb-20 w-full">
        <section className="pt-12 pb-14 max-w-3xl">
          <div className="mb-3">
            <Eyebrow>Pricing</Eyebrow>
          </div>
          <h1
            className="text-4xl md:text-5xl tracking-tight leading-[1.05] mb-5 text-[var(--color-ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Pricing that{" "}
            <em
              className="text-[var(--color-accent)]"
              style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
            >
              matches the real product.
            </em>
          </h1>
          <p
            className="text-lg text-[var(--color-ink-soft)] leading-relaxed max-w-2xl"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Site Clinic is the recurring visibility platform: monitoring,
            prioritization, verification, and proof. The pricing below matches
            the live checkout flow, actual dashboard model, and the features
            we can support honestly today.
          </p>
          <p
            className="mt-4 text-sm text-[var(--color-ink-soft)]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Every tier starts with a 14-day free trial. Cancel during the
            trial and you pay nothing.
          </p>
        </section>

        <section className="grid lg:grid-cols-3 gap-5">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`bg-[var(--color-surface)] rounded-2xl ${
                plan.badge
                  ? "border-2 border-[var(--color-accent)] shadow-sm"
                  : "border border-[var(--color-border)]"
              } p-7 flex flex-col relative`}
              style={{ fontFamily: "var(--font-body)" }}
            >
              {plan.badge ? (
                <div className="absolute -top-3 left-7 bg-[var(--color-accent)] text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {plan.badge}
                </div>
              ) : null}

              <div className="mb-6">
                <div className="text-sm font-semibold mb-2 text-[var(--color-ink)]">
                  {plan.name}
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span
                    className="text-4xl font-semibold text-[var(--color-ink)]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {plan.price}
                  </span>
                  <span className="text-[var(--color-ink-soft)]">/month</span>
                </div>
                <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">
                  {plan.summary}
                </p>
              </div>

              <ul className="space-y-3 text-sm text-[var(--color-ink-soft)] flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span
                      className="text-[var(--color-accent)] flex-shrink-0"
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                <CheckoutButton
                  tier={plan.tier}
                  variant={plan.badge ? "primary" : "secondary"}
                />
              </div>
            </div>
          ))}
        </section>

        <section className="grid lg:grid-cols-2 gap-6 mt-14">
          <div
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-7"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <div className="mb-3">
              <Eyebrow>What checkout does</Eyebrow>
            </div>
            <h2
              className="text-2xl tracking-tight mb-4 text-[var(--color-ink)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              The public promise flows directly into the live account.
            </h2>
            <ol className="space-y-4 text-sm text-[var(--color-ink-soft)]">
              <li>1. Enter your email and first site URL.</li>
              <li>
                2. Secure checkout starts the 14-day trial for the selected
                tier.
              </li>
              <li>
                3. Site Clinic provisions the account and opens the dashboard.
              </li>
              <li>
                4. Pro and Agency can add more sites and enable deeper
                connected data later.
              </li>
            </ol>
          </div>

          <div
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-7"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <div className="mb-3">
              <Eyebrow>Companion products</Eyebrow>
            </div>
            <h2
              className="text-2xl tracking-tight mb-4 text-[var(--color-ink)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Site Clinic is one part of a broader product system.
            </h2>
            <div className="space-y-4">
              <div>
                <div className="font-semibold mb-1 text-[var(--color-ink)]">
                  ADA Audit Report
                </div>
                <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">
                  One-time evidence-first accessibility audit with screenshots,
                  code context, and a prioritized fix plan.
                </p>
              </div>
              <div>
                <div className="font-semibold mb-1 text-[var(--color-ink)]">
                  Perfect Website API
                </div>
                <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">
                  Public developer layer for teams that want contract-ready
                  website analysis inside their own software.
                </p>
              </div>
              <div>
                <div className="font-semibold mb-1 text-[var(--color-ink)]">
                  Site Clinic MCP
                </div>
                <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">
                  Public agent layer for capabilities that are already safe
                  and structured enough to expose as named tools.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-6 text-sm">
              <Button href="https://adaauditreport.com" variant="text-link">
                ADA Audit Report
              </Button>
              <Button href="/developers" variant="text-link">
                Developer layers
              </Button>
            </div>
          </div>
        </section>

        <section className="mt-14" style={{ fontFamily: "var(--font-body)" }}>
          <div className="mb-3">
            <Eyebrow>Intent pages</Eyebrow>
          </div>
          <h2
            className="text-2xl tracking-tight mb-4 text-[var(--color-ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Pricing works better when the exact workflow is clear.
          </h2>
          <div className="grid md:grid-cols-2 gap-3 text-sm">
            {SITE_CLINIC_INTENT_PAGES.map((page) => (
              <Link
                key={page.slug}
                href={`/${page.slug}`}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 hover:bg-[var(--color-surface-hover)] transition-colors block no-underline"
              >
                <span className="font-medium block mb-1 text-[var(--color-ink)]">
                  {page.cardTitle}
                </span>
                <span className="text-[var(--color-ink-soft)]">
                  {page.cardDescription}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="max-w-4xl mt-16">
          <div className="mb-3">
            <Eyebrow>FAQ</Eyebrow>
          </div>
          <h2
            className="text-3xl tracking-tight mb-8 text-[var(--color-ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Straight answers.
          </h2>
          <div className="space-y-5">
            {FAQS.map((item) => (
              <details
                key={item.q}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 group"
                style={{ fontFamily: "var(--font-body)" }}
              >
                <summary className="font-semibold cursor-pointer list-none flex items-center justify-between text-[var(--color-ink)]">
                  {item.q}
                  <span
                    className="text-[var(--color-ink-soft)] text-xl group-open:rotate-45 transition-transform"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-4 text-sm text-[var(--color-ink-soft)] leading-relaxed">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
