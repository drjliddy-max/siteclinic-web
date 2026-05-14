import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Eyebrow } from "@/components/Eyebrow";
import { Button } from "@/components/Button";
import { SITE_CLINIC_INTENT_PAGES } from "@/lib/intentPages";

/*
 * Compare — siteclinic.io/compare/site-clinic-vs-pingdom-vs-uptimerobot
 *
 * §5b iteration 11: cherry-picked from
 * site-monitor/src/app/welcome/compare/site-clinic-vs-pingdom-vs-uptimerobot/page.tsx
 * (~409 lines).
 *
 * URL change: /welcome/compare/... → /compare/... (apex per locked §6).
 *
 * DEFERRED:
 *   - SITE_CLINIC_INTENT_PAGES grid section near the end of the source —
 *     depends on config not yet ported. The next iteration (config port +
 *     8 intent pages as a batch) will unblock it; at that point we'll add
 *     the grid back here.
 *   - PRODUCT_SYSTEM_MODEL config dependency — hardcoded "Site Clinic" +
 *     "app layer" inline (same pattern as previous iterations).
 *   - GA4 + cookie-consent banner — deferred to a separate iteration that
 *     handles GA4 wiring across all pages consistently (currently shipped
 *     only at root level via the `G-CKCC40VRPH` shared ID configuration).
 *
 * STRUCTURE PRESERVED VERBATIM (claims are operator-vetted competitive copy):
 *   - 7 long-form article sections
 *   - 12-row comparison table with tri-state cells (true ✓ / false — / qualified text)
 *   - 2 JSON-LD blocks (Article + FAQPage)
 */

const PAGE_URL =
  "https://siteclinic.io/compare/site-clinic-vs-pingdom-vs-uptimerobot";

const DESCRIPTION =
  "Site Clinic vs. Pingdom vs. UptimeRobot — uptime, performance, accessibility, SEO, and AI-visibility coverage compared with current public pricing.";

const COMPARISON_ROWS: Array<
  [string, boolean | string, boolean | string, boolean | string]
> = [
  ["Site is offline", true, true, true],
  ["Slow response time", true, true, true],
  ["Page-speed regression (Lighthouse)", false, "limited", true],
  ["Broken internal links", false, false, true],
  ["Accessibility (WCAG 2.1 AA) drift", false, false, true],
  ["SEO title/meta drift", false, false, true],
  ["Security header regressions", false, false, true],
  ["AI bot crawl rate (GPTBot, ClaudeBot, etc.)", false, false, "connected"],
  ["AI search citation share (Perplexity)", false, false, "emerging"],
  ["Status page for customers", false, true, false],
  ["Synthetic checkout transaction tests", false, true, false],
  ["Real User Monitoring (RUM)", false, true, false],
];

const FAQS = [
  {
    q: "What is the difference between Site Clinic, Pingdom, and UptimeRobot?",
    a: "UptimeRobot and Pingdom focus on uptime and performance telemetry. Site Clinic's current public app layer brings recurring accessibility, broken-link, SEO drift, security-header, and related technical-health checks into one workflow. Some visibility signals depend on instrumentation or connected-data access. Pingdom and UptimeRobot tell you the site is up. Site Clinic is built to show when the site is quietly degrading.",
  },
  {
    q: "Is Site Clinic a replacement for UptimeRobot?",
    a: "Not exactly. UptimeRobot is excellent at the one job it does — sub-minute uptime pings — and offers a free tier. Site Clinic covers a different category (recurring health drift). Running both together for $7 + $49 a month is a defensible setup; running just Pingdom at $50–$200 for a bundle that excludes accessibility and SEO drift usually isn't.",
  },
  {
    q: "Does Site Clinic offer status pages or synthetic transaction tests?",
    a: "No. Status pages and synthetic checkout-flow testing are Pingdom's core. Site Clinic's current app layer doesn't compete on those. If you need a public status page for customers or step-by-step checkout transaction monitoring, Pingdom is the right pick.",
  },
  {
    q: "What does Site Clinic do for AI search visibility?",
    a: "AI search visibility monitoring tracks two signals: how often AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) visit your pages, and how often AI assistants cite your domain in their answers. Site Clinic exposes the connected-data signals when the site is instrumented; deeper citation proof is treated as emerging rather than settled.",
  },
] as const;

const ARTICLE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": `${PAGE_URL}#article`,
  url: PAGE_URL,
  headline: "Site Clinic vs. Pingdom vs. UptimeRobot",
  description: DESCRIPTION,
  datePublished: "2026-04-13",
  dateModified: "2026-05-12",
  inLanguage: "en-US",
  isPartOf: { "@id": "https://siteclinic.io/#website" },
  about: { "@id": "https://siteclinic.io/#org" },
  author: { "@id": "https://siteclinic.io/#org" },
  publisher: { "@id": "https://siteclinic.io/#org" },
};

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${PAGE_URL}#faqs`,
  isPartOf: { "@id": `${PAGE_URL}#article` },
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export const metadata: Metadata = {
  title: "Site Clinic vs. Pingdom vs. UptimeRobot — Site Clinic",
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Site Clinic vs. Pingdom vs. UptimeRobot",
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: "Site Clinic",
    type: "article",
    publishedTime: "2026-04-13",
    modifiedTime: "2026-05-12",
  },
  twitter: {
    card: "summary_large_image",
    title: "Site Clinic vs. Pingdom vs. UptimeRobot",
    description: DESCRIPTION,
  },
};

function Cell({ value }: { value: boolean | string }) {
  if (value === true)
    return (
      <span
        aria-label="Included"
        className="text-[var(--color-accent)] font-semibold"
      >
        ✓
      </span>
    );
  if (value === false)
    return (
      <span aria-label="Not included" className="text-[var(--color-ink-soft)]">
        —
      </span>
    );
  return (
    <span
      aria-label={value as string}
      className="text-[var(--color-ink-soft)] text-xs italic"
    >
      {value}
    </span>
  );
}

export default function ComparePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTICLE_JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />
      <SiteHeader />
      <main
        className="flex-1 max-w-3xl mx-auto px-6 pb-20 w-full"
        style={{ fontFamily: "var(--font-body)" }}
      >
        <article className="pt-12">
          <div className="mb-4">
            <Eyebrow>Comparison · April 13, 2026</Eyebrow>
          </div>
          <h1
            className="text-4xl md:text-5xl tracking-tight leading-[1.05] mb-6 text-[var(--color-ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Site Clinic vs. Pingdom vs.{" "}
            <em
              className="text-[var(--color-accent)]"
              style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
            >
              UptimeRobot
            </em>
          </h1>
          <p className="text-xl text-[var(--color-ink-soft)] leading-relaxed mb-8">
            Three categories of website monitoring get talked about as if they
            are the same product. They are not. This page compares Site Clinic
            against specialist monitoring tools, then explains where the
            broader Site Clinic system goes beyond this specific comparison.
          </p>

          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 mb-10">
            <div className="mb-3">
              <Eyebrow>Scope note</Eyebrow>
            </div>
            <p className="text-[var(--color-ink-soft)] leading-relaxed">
              Site Clinic is the parent platform. This page focuses on the
              current public app layer that small businesses buy first. The
              same parent system also includes Site Monitor (the protected
              operating layer) and public developer layers for promoted
              capabilities, but those are not the scope of this comparison.
            </p>
          </div>

          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 mb-10">
            <div className="mb-3">
              <Eyebrow>The short answer</Eyebrow>
            </div>
            <p className="font-semibold mb-2 text-[var(--color-ink)]">
              Q: What is the difference between Site Clinic, Pingdom, and
              UptimeRobot?
            </p>
            <p className="text-[var(--color-ink-soft)] leading-relaxed">
              <strong className="text-[var(--color-ink)]">A:</strong>{" "}
              UptimeRobot and Pingdom focus on uptime and performance
              telemetry. Site Clinic&apos;s current public app layer brings
              recurring accessibility, broken-link, SEO drift, security-header,
              and related technical-health checks into one workflow. Some
              visibility signals depend on instrumentation or connected-data
              access. Pingdom and UptimeRobot tell you the site is up. Site
              Clinic is built to show when the site is quietly degrading.
            </p>
          </div>

          <section className="space-y-6 mb-10">
            <h2
              className="text-2xl tracking-tight mt-10 mb-4 text-[var(--color-ink)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              The three tools are{" "}
              <em
                className="text-[var(--color-accent)]"
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                }}
              >
                not solving the same problem.
              </em>
            </h2>
            <p className="text-[var(--color-ink-soft)] leading-relaxed">
              UptimeRobot was built to answer one question. Is the site
              responding? It pings a URL every five minutes (or every minute on
              paid plans) and alerts when the response code or response time
              crosses a threshold. The free tier covers fifty monitors. That
              is the entire product.
            </p>
            <p className="text-[var(--color-ink-soft)] leading-relaxed">
              Pingdom expanded that model. Synthetic transaction tests. Real
              User Monitoring. Page-speed waterfall views. Status pages. The
              pricing reflects the breadth. It is a competent product if you
              need uptime and detailed performance telemetry, and you are
              willing to spend $50 to $200 a month for the plan that actually
              delivers it.
            </p>
            <p className="text-[var(--color-ink-soft)] leading-relaxed">
              Site Clinic&apos;s current app layer answers a different
              question entirely. Not &quot;is the site up&quot; but &quot;did
              the site quietly break in a way the customer will notice before
              I do.&quot; That includes accessibility regressions that trigger
              ADA demand letters, broken links from a CMS update, SEO metadata
              that quietly changed when the theme was updated, security-header
              regressions, and Lighthouse performance trend. When
              instrumentation or connected-data access is available, some
              broader visibility signals can join that same loop.
            </p>
          </section>

          <section className="mb-10">
            <h2
              className="text-2xl tracking-tight mt-10 mb-4 text-[var(--color-ink)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              What each tool{" "}
              <em
                className="text-[var(--color-accent)]"
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                }}
              >
                actually catches.
              </em>
            </h2>
            <div className="overflow-x-auto -mx-6 px-6 my-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[var(--color-border)]">
                    <th className="text-left py-3 pr-4 font-semibold text-[var(--color-ink)]">
                      What it catches
                    </th>
                    <th className="text-center py-3 px-3 font-semibold text-[var(--color-ink)]">
                      UptimeRobot
                    </th>
                    <th className="text-center py-3 px-3 font-semibold text-[var(--color-ink)]">
                      Pingdom
                    </th>
                    <th className="text-center py-3 px-3 font-semibold text-[var(--color-accent)]">
                      Site Clinic
                    </th>
                  </tr>
                </thead>
                <tbody className="text-[var(--color-ink-soft)]">
                  {COMPARISON_ROWS.map((row) => (
                    <tr
                      key={row[0] as string}
                      className="border-b border-[var(--color-border)]"
                    >
                      <td className="py-3 pr-4">{row[0] as string}</td>
                      <td className="text-center py-3 px-3">
                        <Cell value={row[1]} />
                      </td>
                      <td className="text-center py-3 px-3">
                        <Cell value={row[2]} />
                      </td>
                      <td className="text-center py-3 px-3">
                        <Cell value={row[3]} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm italic text-[var(--color-ink-soft)] leading-relaxed">
              &quot;Limited&quot; means the feature exists in some form on the
              highest paid tier or as an add-on, but is not the product&apos;s
              primary focus. &quot;Connected&quot; means the signal depends on
              instrumentation or granted connected-data access.
              &quot;Emerging&quot; means the broader capability is real, but
              public proof depth should still be treated conservatively. Verify
              against current vendor pricing before purchase.
            </p>
          </section>

          <section className="space-y-4 mb-10">
            <h2
              className="text-2xl tracking-tight mt-10 mb-4 text-[var(--color-ink)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Pricing in{" "}
              <em
                className="text-[var(--color-accent)]"
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                }}
              >
                plain numbers.
              </em>
            </h2>
            <p className="text-[var(--color-ink-soft)] leading-relaxed">
              <strong className="text-[var(--color-ink)]">UptimeRobot:</strong>{" "}
              Free for fifty monitors at five-minute intervals. Paid tier
              starts around $7 per month for one-minute checks and SMS alerts.
            </p>
            <p className="text-[var(--color-ink-soft)] leading-relaxed">
              <strong className="text-[var(--color-ink)]">Pingdom:</strong>{" "}
              Synthetic Monitoring starts around $15 per month for one site.
              Real User Monitoring adds a separate plan starting around $20
              per month. Bundles for full coverage of a small business site
              typically run $50 to $200 per month.
            </p>
            <p className="text-[var(--color-ink-soft)] leading-relaxed">
              <strong className="text-[var(--color-ink)]">Site Clinic:</strong>{" "}
              $49 per month for one site (Basic). $149 per month for up to
              five sites (Pro). $349 per month for up to twenty-five sites
              (Agency). Every plan starts with a 30-day free trial.
              Cancel anytime.
            </p>
          </section>

          <section className="space-y-4 mb-10">
            <h2
              className="text-2xl tracking-tight mt-10 mb-4 text-[var(--color-ink)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              What is{" "}
              <em
                className="text-[var(--color-accent)]"
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                }}
              >
                AI search visibility monitoring?
              </em>
            </h2>
            <p className="text-[var(--color-ink-soft)] leading-relaxed">
              <strong>AI search visibility monitoring</strong> tracks two
              related signals. First, how often AI crawlers (GPTBot,
              ClaudeBot, PerplexityBot, Google-Extended) visit your pages.
              Second, how often AI assistants like ChatGPT, Perplexity, and
              Claude cite your domain in their answers to buyer-intent search
              queries.
            </p>
            <p className="text-[var(--color-ink-soft)] leading-relaxed">
              This category did not exist in 2024. Pingdom and UptimeRobot do
              not offer it. Enterprise SEO tools (Ahrefs, Semrush) are starting
              to add it but charge $200 per month and up. In the broader Site
              Clinic system, some of these signals are already visible when
              the site is instrumented or when the customer grants the needed
              connected-data access, but deeper citation proof should still
              be treated as emerging rather than settled.
            </p>
          </section>

          <section className="space-y-4 mb-10">
            <h2
              className="text-2xl tracking-tight mt-10 mb-4 text-[var(--color-ink)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              When each tool is{" "}
              <em
                className="text-[var(--color-accent)]"
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                }}
              >
                the right pick.
              </em>
            </h2>
            <p className="text-[var(--color-ink-soft)] leading-relaxed">
              <strong className="text-[var(--color-ink)]">
                Pick UptimeRobot
              </strong>{" "}
              if your only question is whether the site is responding and you
              want a free or near-free answer. It does that one job well. It
              does not do anything else.
            </p>
            <p className="text-[var(--color-ink-soft)] leading-relaxed">
              <strong className="text-[var(--color-ink)]">Pick Pingdom</strong>{" "}
              if you run a transactional site (e-commerce checkout, login
              flows, multi-step forms) where you specifically need synthetic
              transaction testing and a public status page, and you have the
              budget for $50 to $200 per month.
            </p>
            <p className="text-[var(--color-ink-soft)] leading-relaxed">
              <strong className="text-[var(--color-ink)]">
                Pick Site Clinic
              </strong>{" "}
              if your real risk is not the site going down, but the site
              quietly degrading. The current public app layer is built for
              that job: ADA accessibility drift after a theme update, broken
              links nobody noticed, title tags that changed and dropped your
              CTR, and other silent failures that need recurring review.
              Broader visibility signals can join that workflow when the
              needed data is available.
            </p>
          </section>

          <section className="space-y-4 mb-10">
            <h2
              className="text-2xl tracking-tight mt-10 mb-4 text-[var(--color-ink)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              You can{" "}
              <em
                className="text-[var(--color-accent)]"
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                }}
              >
                use more than one.
              </em>
            </h2>
            <p className="text-[var(--color-ink-soft)] leading-relaxed">
              The three categories do not conflict. A site running UptimeRobot
              for instant uptime alerts and Site Clinic for recurring
              app-layer health monitoring is a defensible setup. The tools
              cost $7 and $49 per month respectively and answer different
              questions. What rarely makes sense is paying $200 a month for a
              Pingdom bundle when the accessibility and SEO drift checks are
              not in any tier of that bundle.
            </p>
          </section>

          <section className="space-y-4 mb-10">
            <h2
              className="text-2xl tracking-tight mt-10 mb-4 text-[var(--color-ink)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              The{" "}
              <em
                className="text-[var(--color-accent)]"
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                }}
              >
                honest verdict.
              </em>
            </h2>
            <p className="text-[var(--color-ink-soft)] leading-relaxed">
              Uptime is the easy problem. The hard problem for a small
              business is the silent stuff. The page that started loading slow
              last week. The accessibility regression three pages deep. The
              metadata change that quietly cost you Google rankings. The fact
              that ChatGPT now recommends a competitor when someone asks for a
              service like yours.
            </p>
            <p className="text-[var(--color-ink-soft)] leading-relaxed">
              Site Clinic&apos;s current public app layer is built for owners
              who need those silent failures kept visible and verified over
              time. Basic starts at $49 per month. The broader parent system
              carries that work forward into proof, operations, and developer
              layers only where the capability is actually ready.
            </p>
          </section>

          <section className="my-10">
            <div className="mb-3">
              <Eyebrow>Intent pages</Eyebrow>
            </div>
            <h2
              className="text-2xl tracking-tight mb-4 text-[var(--color-ink)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Exact-match pages for the question you came to compare
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {SITE_CLINIC_INTENT_PAGES.map((page) => (
                <div
                  key={page.slug}
                  className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4"
                >
                  <div className="font-semibold mb-2 text-[var(--color-ink)]">
                    {page.cardTitle}
                  </div>
                  <p className="text-[var(--color-ink-soft)] text-sm leading-relaxed mb-3">
                    {page.cardDescription}
                  </p>
                  <Link
                    href={`/${page.slug}`}
                    className="text-[var(--color-accent)] text-sm font-medium underline underline-offset-[3px] hover:text-[var(--color-accent-hover)]"
                  >
                    Read the exact-match page →
                  </Link>
                </div>
              ))}
            </div>
          </section>

          <div className="bg-[var(--color-surface)] border-2 border-[var(--color-accent)] rounded-xl p-6 my-10">
            <h3 className="text-xl font-semibold mb-2 text-[var(--color-ink)]">
              Try Site Clinic free for 30 days
            </h3>
            <p className="text-[var(--color-ink-soft)] mb-4">
              Add your URL. Secure checkout starts the 30-day trial and
              provisions your first site automatically.
            </p>
            <Button href="/pricing" variant="primary">
              See pricing &amp; start trial
            </Button>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
