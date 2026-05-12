import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Hero } from "@/components/Hero";

/*
 * Homepage — siteclinic.io/
 *
 * §5b iteration 1: cherry-picked from site-monitor/src/app/welcome/page.tsx
 * (hero block only, lines 200-247 of source). Subsequent iterations add
 * pricing intro, developer offerings, loop diagnostic, who-it-for, etc.
 *
 * Migration unit pattern (operator rule 2026-05-11):
 *   1. This page  → src/app/page.tsx  ✓
 *   2. Sitemap    → src/app/sitemap.ts already lists /  ✓
 *   3. Redirect   → /welcome → / in next.config.ts  ✓
 *   4. Gate cover → / already in gate.config.json  ✓
 */

const HOMEPAGE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": "https://siteclinic.io/#app",
  name: "Site Clinic",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://siteclinic.io",
  description:
    "Visibility management for small-business websites — accessibility, performance, SEO, AI retrieval, and security monitoring with proof of improvements.",
  offers: {
    "@type": "Offer",
    price: "49",
    priceCurrency: "USD",
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: "49",
      priceCurrency: "USD",
      billingIncrement: 1,
      unitCode: "MON",
    },
  },
  publisher: { "@id": "https://siteclinic.io/#org" },
};

export const metadata: Metadata = {
  alternates: { canonical: "https://siteclinic.io/" },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(HOMEPAGE_JSON_LD) }}
      />
      <SiteHeader />
      <main className="flex-1">
        <Hero />
      </main>
      <SiteFooter />
    </>
  );
}
