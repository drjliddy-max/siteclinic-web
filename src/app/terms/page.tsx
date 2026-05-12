import type { Metadata } from "next";
import { LegalPageLayout, LegalSection } from "@/components/LegalPageLayout";

/*
 * Terms of Service — siteclinic.io/terms
 *
 * §5b iteration 5 (legal trio): cherry-picked verbatim from
 * site-monitor/src/app/welcome/terms/page.tsx.
 *
 * Legal language preserved word-for-word. Last-updated date verbatim.
 */

const PAGE_URL = "https://siteclinic.io/terms";
const DESCRIPTION =
  "Terms governing use of Site Clinic: billing, cancellation, scope of automated scans, limits of liability, and customer responsibilities.";

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://siteclinic.io/terms#page",
  url: PAGE_URL,
  name: "Terms of Service — Site Clinic",
  description: DESCRIPTION,
  isPartOf: { "@id": "https://siteclinic.io/#website" },
  about: { "@id": "https://siteclinic.io/#org" },
};

export const metadata: Metadata = {
  title: "Terms of Service — Site Clinic",
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Terms of Service — Site Clinic",
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: "Site Clinic",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service — Site Clinic",
    description: DESCRIPTION,
  },
};

export default function TermsPage() {
  return (
    <LegalPageLayout
      title="Terms of"
      italicAccent="Service"
      lastUpdated="April 13, 2026"
      jsonLd={JSON_LD}
    >
      <LegalSection heading="The service">
        <p>
          Site Clinic runs automated nightly checks against websites you
          authorize us to monitor. We report accessibility issues, broken
          links, performance regressions, and SEO drift. Our scanners are
          best-effort signal, not a legal compliance guarantee.
        </p>
      </LegalSection>

      <LegalSection heading="Billing and cancellation">
        <p>
          Plans are billed monthly through Stripe. You can cancel at any time
          from your dashboard or by emailing hello@siteclinic.io. Cancellation
          takes effect at the end of the current billing period. We do not
          offer partial-month refunds except where required by law.
        </p>
      </LegalSection>

      <LegalSection heading="What we do not promise">
        <p>
          We do not promise that every accessibility violation, broken link,
          or performance regression will be detected. Automated scans catch
          roughly 30 to 40 percent of WCAG 2.1 AA issues. Human review is
          required for full compliance. We also do not promise uninterrupted
          service, though we aim for high availability.
        </p>
      </LegalSection>

      <LegalSection heading="Your responsibilities">
        <p>
          You may only ask us to monitor sites you own or have explicit
          permission to scan. You are responsible for acting on the findings
          we report, including making fixes in your CMS, theme, or platform
          vendor when applicable.
        </p>
      </LegalSection>

      <LegalSection heading="Liability">
        <p>
          Site Clinic is provided as is. Our total liability for any claim is
          limited to the amount you paid us in the 90 days before the claim.
          We are not liable for indirect or consequential damages.
        </p>
      </LegalSection>

      <LegalSection heading="Contact">
        <p>
          Questions?{" "}
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
