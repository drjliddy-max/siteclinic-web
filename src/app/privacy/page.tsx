import type { Metadata } from "next";
import { LegalPageLayout, LegalSection } from "@/components/LegalPageLayout";

/*
 * Privacy Policy — siteclinic.io/privacy
 *
 * §5b iteration 5 (legal trio): cherry-picked verbatim from
 * site-monitor/src/app/welcome/privacy/page.tsx.
 *
 * Content is legally-vetted boilerplate. Do NOT rewrite or invent new
 * clauses during the cherry-pick — preserve word-for-word. Only the
 * chrome (header/footer/typography) is restructured to use tokens.
 *
 * Last-updated date preserved verbatim from source (April 13, 2026).
 * If the date needs to advance, that's a separate explicit operator
 * decision — not a cherry-pick judgment.
 */

const PAGE_URL = "https://siteclinic.io/privacy";
const DESCRIPTION =
  "How Site Clinic collects, uses, and protects data from customers and waitlist signups. Scan data, account email, and payment info.";

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://siteclinic.io/privacy#page",
  url: PAGE_URL,
  name: "Privacy Policy — Site Clinic",
  description: DESCRIPTION,
  isPartOf: { "@id": "https://siteclinic.io/#website" },
  about: { "@id": "https://siteclinic.io/#org" },
};

export const metadata: Metadata = {
  title: "Privacy Policy — Site Clinic",
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Privacy Policy — Site Clinic",
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: "Site Clinic",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy — Site Clinic",
    description: DESCRIPTION,
  },
};

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      title="Privacy"
      italicAccent="Policy"
      lastUpdated="April 13, 2026"
      jsonLd={JSON_LD}
    >
      <LegalSection heading="What we collect">
        <p>
          When you sign up for Site Clinic, we collect your email address, the
          website URLs you ask us to monitor, and payment details processed by
          Stripe. When our scanners check your site, we store the results
          (accessibility violations, broken links, performance metrics, SEO
          signals) so you can see history over time.
        </p>
      </LegalSection>

      <LegalSection heading="How we use it">
        <p>
          We use your email to send scan alerts and billing receipts. We use
          your scan data to show you your dashboard and to improve the
          scanners themselves. We do not sell data to third parties.
        </p>
      </LegalSection>

      <LegalSection heading="Sub-processors">
        <p>
          We use Vercel (hosting), Railway PostgreSQL (database), Stripe
          (payments), and Google Analytics (aggregate traffic) to operate the
          service. Each handles data under their own privacy terms.
        </p>
      </LegalSection>

      <LegalSection heading="Your rights">
        <p>
          You can request a copy of your data or delete your account at any
          time by emailing{" "}
          <a
            href="mailto:hello@siteclinic.io"
            className="text-[var(--color-accent)] underline underline-offset-[3px]"
          >
            hello@siteclinic.io
          </a>
          . We will respond within 30 days.
        </p>
      </LegalSection>

      <LegalSection heading="Contact">
        <p>
          Questions about this policy? Email{" "}
          <a
            href="mailto:hello@siteclinic.io"
            className="text-[var(--color-accent)] underline underline-offset-[3px]"
          >
            hello@siteclinic.io
          </a>
          .
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
