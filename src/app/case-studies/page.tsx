import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Eyebrow } from "@/components/Eyebrow";
import { Button } from "@/components/Button";

/*
 * Case studies / "Proof" — siteclinic.io/case-studies
 *
 * §5b iteration 4: cherry-picked from
 * site-monitor/src/app/case-studies/page.tsx.
 *
 * The page title brand is "Proof | Site Clinic" but the URL stays
 * /case-studies — matches what Google already has indexed (per the
 * 4/24/26 GSC report the operator shared, /case-studies was listed at
 * the apex, not under /welcome). No URL change in this iteration.
 *
 * DEFERRED from source (named, not silently dropped):
 *   - Dependency on `PRODUCT_SYSTEM_MODEL.name` config — hardcoded "Site Clinic"
 *     inline here. Port the config if it's needed by multiple pages
 *     (rule-of-three: hold until 3rd consumer).
 *
 * CONVERTED from source (design-thesis §43 anti-pattern fix):
 *   - The bottom `bg-slate-900 text-white` "Proof is the product advantage"
 *     section in the source used a dark theme that violates "no decorative
 *     dark-mode-by-default." Converted to a cream surface treatment that
 *     preserves the content (3-up + CTAs) but matches the rest of the
 *     system's light palette.
 *
 * SEMANTIC COLORS PRESERVED:
 *   - Stat numbers use red (bad state) + green (good state) per universal
 *     warning semantics inside product-side UI. This is allowed alongside
 *     the sage brand accent per design thesis "warning hues only on
 *     product warnings" rule.
 *
 * Migration unit pattern (operator rule 2026-05-11):
 *   1. This page          → src/app/case-studies/page.tsx  ✓
 *   2. Sitemap entry      → src/app/sitemap.ts adds /case-studies
 *   3. Legacy redirect    → next.config.ts adds /welcome/case-studies → /case-studies
 *      (defensive — URL stayed at apex, but old /welcome nav linked there)
 *   4. Gate coverage      → gate.config.json adds /case-studies
 */

const PROOF_STANDARD = [
  { label: "Timestamped", body: "Baselines and improvements need a date and a source." },
  { label: "Scoped", body: "Claims should match the exact check, page set, or monitoring window." },
  { label: "Reproducible", body: "Another qualified reviewer should be able to reach the same conclusion." },
  { label: "Explainable", body: "The customer should understand what changed and why it matters." },
] as const;

const OPERATING_LOOP = [
  "Capture the baseline.",
  "Log the intervention.",
  "Re-scan and verify.",
  "Separate technical wins from business wins.",
  "Use the result to guide the next move.",
] as const;

const LIDDY_STATS = [
  { value: "6+ years", label: "Undetected", tone: "bad" as const },
  { value: "$200/mo", label: "Security failed", tone: "bad" as const },
  { value: "24 hours", label: "Alert window", tone: "good" as const },
  { value: "Live now", label: "Monitoring after foundation work", tone: "good" as const },
];

const COMPLETED_PROOF = [
  "Legacy compromise uncovered and neutralized",
  "Accessibility baseline repaired to a technically sound state",
  "Modernized infrastructure and live monitoring deployed",
  "Honest baseline established for discovery, demand, and trust",
];

const NOT_YET_PROVEN = [
  "Search discovery is still near zero",
  "Traffic growth still needs distribution and content work",
  "Trust signals need more authority content and proof pages",
  "Technical success and business success are different phases",
];

const SITE_CLINIC_CHAIN = [
  {
    n: "1",
    title: "Baseline honestly",
    body: "Find what is actually broken and document the evidence.",
  },
  {
    n: "2",
    title: "Fix and verify",
    body: "Use re-scan and monitoring to confirm the technical shift.",
  },
  {
    n: "3",
    title: "Grow from the truth",
    body: "Use the live dashboard to guide discovery, trust, and visibility work next.",
  },
];

const ADVANTAGE_POINTS = [
  {
    title: "Continuous tracking",
    body: "Monitor the site as it changes instead of relying on a one-time snapshot.",
  },
  {
    title: "Instant verification",
    body: "Re-scan after fixes to prove what cleared and what still needs work.",
  },
  {
    title: "Actionable proof",
    body: "Use the evidence to guide the next technical or visibility move.",
  },
];

const CASE_STUDY_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": "https://siteclinic.io/case-studies#collection",
  url: "https://siteclinic.io/case-studies",
  name: "Proof | Site Clinic",
  description:
    "Real proof from Site Clinic: technical baselines, monitored changes, and the evidence chain from issue to verification.",
  isPartOf: { "@id": "https://siteclinic.io/#website" },
  about: { "@id": "https://siteclinic.io/#org" },
  hasPart: [
    {
      "@type": "Article",
      "@id": "https://siteclinic.io/case-studies#liddy-podiatry",
      headline:
        "From six-year blindness to a monitored, verifiable foundation.",
      about: {
        "@type": "MedicalBusiness",
        name: "Liddy Podiatry & Prevention",
        areaServed: "Beverly Hills",
      },
      publisher: { "@id": "https://siteclinic.io/#org" },
    },
  ],
};

const PAGE_URL = "https://siteclinic.io/case-studies";
const DESCRIPTION =
  "Real proof from Site Clinic: technical baselines, monitored changes, and the evidence chain from issue to verification.";

export const metadata: Metadata = {
  title: "Proof — Site Clinic",
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Proof — Site Clinic",
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: "Site Clinic",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Proof — Site Clinic",
    description: DESCRIPTION,
  },
};

export default function CaseStudiesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(CASE_STUDY_JSON_LD) }}
      />
      <SiteHeader />
      <main className="flex-1 max-w-6xl mx-auto px-6 pb-20 w-full">
        <section className="pt-12 pb-14 max-w-4xl mx-auto text-center">
          <div className="mb-3 flex justify-center">
            <Eyebrow>Proof</Eyebrow>
          </div>
          <h1
            className="text-4xl md:text-5xl tracking-tight leading-[1.05] mb-5 text-[var(--color-ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            From issue to{" "}
            <em
              className="text-[var(--color-accent)]"
              style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
            >
              evidence to verification.
            </em>
          </h1>
          <p
            className="text-lg text-[var(--color-ink-soft)] leading-relaxed max-w-3xl mx-auto"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Site Clinic only gets stronger if the proof is real. This page is
            where technical baselines, monitored changes, and business-facing
            outcomes get tied together honestly.
          </p>
          <p
            className="mt-4 text-sm text-[var(--color-ink-soft)] max-w-3xl mx-auto"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Proof for one delivery layer does not automatically make a
            capability public everywhere else. App, API, and MCP maturity
            still need to be earned separately across the Site Clinic system.
          </p>
        </section>

        <section className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6 mb-10">
          <div
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <div className="mb-3">
              <Eyebrow>Proof standard</Eyebrow>
            </div>
            <h2
              className="text-2xl tracking-tight mb-4 text-[var(--color-ink)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              What counts as{" "}
              <em
                className="text-[var(--color-accent)]"
                style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
              >
                usable proof here.
              </em>
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 text-sm text-[var(--color-ink-soft)]">
              {PROOF_STANDARD.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-[var(--color-border)] p-4"
                >
                  <h3 className="font-semibold text-[var(--color-ink)] mb-2">
                    {item.label}
                  </h3>
                  <p>{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div
            className="bg-[var(--color-bg)] border border-[var(--color-border-inner)] rounded-2xl p-8"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <div className="mb-3">
              <Eyebrow>The loop</Eyebrow>
            </div>
            <h2
              className="text-2xl tracking-tight mb-4 text-[var(--color-ink)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              The Site Clinic{" "}
              <em
                className="text-[var(--color-accent)]"
                style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
              >
                operating loop.
              </em>
            </h2>
            <ol className="space-y-3 text-sm text-[var(--color-ink-soft)]">
              {OPERATING_LOOP.map((step, i) => (
                <li key={step}>
                  <span className="font-semibold text-[var(--color-ink)]">
                    {i + 1}.
                  </span>{" "}
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden"
          aria-labelledby="case-liddy-heading"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <div className="p-8">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="inline-block bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-full text-xs font-medium">
                Security + monitoring
              </span>
              <span className="text-[var(--color-ink-soft)] text-sm">
                Liddy Podiatry &amp; Prevention · Beverly Hills medical practice
              </span>
            </div>

            <h2
              id="case-liddy-heading"
              className="text-2xl md:text-3xl tracking-tight mb-4 text-[var(--color-ink)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              From six-year blindness to a{" "}
              <em
                className="text-[var(--color-accent)]"
                style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
              >
                monitored, verifiable foundation.
              </em>
            </h2>

            <p className="text-[var(--color-ink-soft)] text-lg leading-relaxed mb-8">
              This is the clearest current Site Clinic proof case. A medical
              practice had a compromised legacy site, fragmented governance,
              and no real visibility into what was broken. The intervention
              fixed the technical foundation, then monitoring turned that work
              into an ongoing proof system instead of a one-time cleanup story.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {LIDDY_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="text-center p-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg"
                >
                  <div
                    className={
                      stat.tone === "bad"
                        ? "text-2xl font-semibold mb-1 text-red-700"
                        : "text-2xl font-semibold mb-1 text-emerald-700"
                    }
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs text-[var(--color-ink-soft)] uppercase tracking-wide">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <h3 className="text-lg font-semibold text-[var(--color-ink)] mb-4">
              What the case actually proves
            </h3>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h4 className="font-medium text-[var(--color-ink)] mb-3">
                  Completed technical proof
                </h4>
                <ul className="space-y-2 text-sm text-[var(--color-ink-soft)]">
                  {COMPLETED_PROOF.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-emerald-700 flex-shrink-0" aria-hidden="true">
                        ✓
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-[var(--color-ink)] mb-3">
                  What it does not prove yet
                </h4>
                <ul className="space-y-2 text-sm text-[var(--color-ink-soft)]">
                  {NOT_YET_PROVEN.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-amber-700 flex-shrink-0" aria-hidden="true">
                        •
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-[var(--color-bg)] border border-[var(--color-border-inner)] rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-[var(--color-ink)] mb-3">
                Why this matters for Site Clinic
              </h3>
              <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed mb-4">
                The case is stronger because it is honest. We can show the
                transition from compromised to technically ready, then use
                monitoring to show what remains. That is more credible than
                pretending every technical fix is already a growth win.
              </p>
              <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed mb-4">
                It is also more credible because proof and product maturity
                stay separate. A strong app-layer proof case does not
                automatically mean the same capability is already a public
                API contract or public MCP tool.
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-[var(--color-ink-soft)]">
                <div>
                  <strong className="text-[var(--color-ink)]">Measure:</strong>{" "}
                  capture the real baseline instead of a false green state
                </div>
                <div>
                  <strong className="text-[var(--color-ink)]">Verify:</strong>{" "}
                  re-scan after changes and show what actually cleared
                </div>
                <div>
                  <strong className="text-[var(--color-ink)]">Prove:</strong>{" "}
                  separate completed technical proof from future business work
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-[var(--color-ink)] mb-4">
              The full Site Clinic chain
            </h3>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {SITE_CLINIC_CHAIN.map((step) => (
                <div key={step.n} className="text-center">
                  <div className="w-12 h-12 bg-[var(--color-accent)] rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span
                      className="text-white font-bold"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {step.n}
                    </span>
                  </div>
                  <h4 className="font-medium text-[var(--color-ink)] mb-2">
                    {step.title}
                  </h4>
                  <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">
                    {step.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              <Button href="/pricing" variant="primary">
                Start your Site Clinic trial
              </Button>
              <Button
                href="https://adaauditreport.com/blog/website-security-protects-wrong-thing"
                variant="secondary"
              >
                Read full story →
              </Button>
            </div>
          </div>
        </section>

        <section
          className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 md:p-12 mt-16 text-center"
          aria-labelledby="advantage-heading"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <div className="mb-3 flex justify-center">
            <Eyebrow>Why proof matters</Eyebrow>
          </div>
          <h2
            id="advantage-heading"
            className="text-3xl tracking-tight mb-6 text-[var(--color-ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Proof is the{" "}
            <em
              className="text-[var(--color-accent)]"
              style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
            >
              product advantage.
            </em>
          </h2>
          <p className="text-lg text-[var(--color-ink-soft)] mb-10 max-w-2xl mx-auto leading-relaxed">
            Site Clinic gets stronger when the proof is timestamped,
            attributable, reproducible, and honest about limits. That is what
            makes the dashboards worth acting on.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-10 text-left">
            {ADVANTAGE_POINTS.map((p) => (
              <div key={p.title}>
                <h3 className="text-base font-semibold mb-2 text-[var(--color-accent)]">
                  {p.title}
                </h3>
                <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">
                  {p.body}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <Button href="/" variant="primary">
              See how Site Clinic works
            </Button>
            <Button href="https://adaauditreport.com" variant="secondary">
              Start with ADA Audit Report
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
