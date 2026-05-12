import type { Metadata } from "next";
import { LegalPageLayout, LegalSection } from "@/components/LegalPageLayout";

/*
 * Accessibility Statement — siteclinic.io/accessibility
 *
 * §5b iteration 5 (legal trio): cherry-picked verbatim from
 * site-monitor/src/app/welcome/accessibility/page.tsx.
 *
 * Note: the "We run axe-core against every public page on every deploy
 * and block promotion to production on serious violations" claim is now
 * LITERALLY TRUE for siteclinic-web via build-websites-tools' gate:ada
 * which runs as `prebuild` and exits non-zero on critical/serious/moderate
 * violations. This is the cross-portfolio doctrine made structurally true,
 * not aspirational copy.
 */

const PAGE_URL = "https://siteclinic.io/accessibility";
const DESCRIPTION =
  "Site Clinic's commitment to WCAG 2.1 AA. How we build and test the product, known gaps, and how to report accessibility issues to us.";

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://siteclinic.io/accessibility#page",
  url: PAGE_URL,
  name: "Accessibility Statement — Site Clinic",
  description: DESCRIPTION,
  isPartOf: { "@id": "https://siteclinic.io/#website" },
  about: { "@id": "https://siteclinic.io/#org" },
};

export const metadata: Metadata = {
  title: "Accessibility Statement — Site Clinic",
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Accessibility Statement — Site Clinic",
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: "Site Clinic",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Accessibility Statement — Site Clinic",
    description: DESCRIPTION,
  },
};

export default function AccessibilityPage() {
  return (
    <LegalPageLayout
      title="Accessibility"
      italicAccent="Statement"
      lastUpdated="April 13, 2026"
      jsonLd={JSON_LD}
    >
      <LegalSection heading="Our commitment">
        <p>
          Site Clinic builds products that help other teams meet WCAG 2.1 AA.
          We hold our own site and dashboard to the same standard. This
          statement describes where we stand and how to tell us when we miss
          something.
        </p>
      </LegalSection>

      <LegalSection heading="How we build and test">
        <p>
          We use semantic HTML, visible focus indicators, keyboard-navigable
          controls, labeled form fields, and color contrast that meets or
          exceeds WCAG 2.1 AA. We run axe-core against every public page on
          every deploy and block promotion to production on serious
          violations.
        </p>
      </LegalSection>

      <LegalSection heading="Known gaps">
        <p>
          Automated testing catches roughly 30 to 40 percent of WCAG 2.1 AA
          issues. Manual testing fills the rest. If you encounter a screen
          reader, keyboard, or color contrast issue, please tell us.
        </p>
      </LegalSection>

      <LegalSection heading="Report an issue">
        <p>
          Email{" "}
          <a
            href="mailto:hello@siteclinic.io"
            className="text-[var(--color-accent)] underline underline-offset-[3px]"
          >
            hello@siteclinic.io
          </a>{" "}
          with the page URL, what assistive technology you are using, and
          what happened. We commit to acknowledging within two business days
          and fixing or explaining within ten.
        </p>
      </LegalSection>

      <LegalSection heading="Standards">
        <p>
          This site targets WCAG 2.1 Level AA. Where we claim conformance we
          will note the scope and date of the most recent audit. We do not
          use the phrase &ldquo;fully ADA compliant.&rdquo; We aim for
          continuous remediation, not a finish line.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
