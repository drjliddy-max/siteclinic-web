import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Eyebrow } from "@/components/Eyebrow";
import { Button } from "@/components/Button";
import { StartHereWizard } from "@/components/StartHereWizard";
import {
  FOUNDATION_ENDPOINTS,
  FOUNDATION_NEXT_STEPS,
} from "@/lib/clientFoundation";

const PAGE_URL = "https://siteclinic.io/start-here";
const DESCRIPTION =
  "Start here with Site Clinic: choose your path and prepare the account, project, deployment, monitoring, and proof basics for the next step.";

const WEBSITE_BUILD_STEPS = [
  {
    title: "Create or confirm a GitHub account",
    body:
      "A finished website needs a repo owner. If you already have GitHub, use the account that should own the site long term. If not, create one before the build begins.",
  },
  {
    title: "Create a project folder or connect an existing repo",
    body:
      "Beginners can start with a named folder on their computer. Developers can start with an existing repository. Either way, the project needs a clear home before files are generated.",
  },
  {
    title: "Choose the deployment path",
    body:
      "Vercel is the preferred default for Site Clinic website work. If another host is required, name it early so build, routing, environment, and verification steps are accurate.",
  },
  {
    title: "Gather website inputs",
    body:
      "Prepare business name, audience, offer, pages, calls to action, contact details, brand assets, proof sources, legal links, analytics goals, and launch constraints.",
  },
  {
    title: "Define launch and proof requirements",
    body:
      "Before the build begins, decide what must be true at launch: sitemap, robots, canonical URLs, Search Console, GA4, conversion events, dashboard scope, and verification notes.",
  },
];

const COMMERCIAL_BOUNDARIES = [
  {
    title: "Free foundation",
    body:
      "Public docs, setup checklists, AI prompts, account-prep guidance, DNS instructions, and owner education stay available before checkout.",
  },
  {
    title: "Trial doorway",
    body:
      "The 30-day trial starts the recurring Site Clinic operating layer: dashboard access, first-site monitoring, baseline scans, alerts, and proof workflow.",
  },
  {
    title: "Paid or entitled surfaces",
    body:
      "API keys, MCP tools, scheduler execution, Blog Writer automation, connected-data operations, managed proofs, and future optimization loops require an active entitlement.",
  },
  {
    title: "Customer-owned assets",
    body:
      "Domains, customer-owned repos, exported files, public pages already delivered, and downloaded reports are not clawed back if a subscription ends.",
  },
] as const;

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": "https://siteclinic.io/start-here#article",
  url: PAGE_URL,
  headline: "Start Here — Site Clinic Foundation",
  description: DESCRIPTION,
  isPartOf: { "@id": "https://siteclinic.io/#website" },
  about: { "@id": "https://siteclinic.io/#org" },
  inLanguage: "en-US",
};

export const metadata: Metadata = {
  title: "Start Here — Site Clinic Foundation",
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Start Here — Site Clinic Foundation",
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: "Site Clinic",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Start Here — Site Clinic Foundation",
    description: DESCRIPTION,
  },
};

export default function StartHerePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <SiteHeader />
      <main
        className="flex-1 max-w-6xl mx-auto px-6 pb-20 w-full"
        style={{ fontFamily: "var(--font-body)" }}
      >
        <section className="pt-12 pb-12 max-w-4xl">
          <div className="mb-3">
            <Eyebrow>Start here</Eyebrow>
          </div>
          <h1
            className="text-4xl md:text-5xl tracking-tight leading-[1.05] mb-5 text-[var(--color-ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Get every customer to the{" "}
            <em
              className="text-[var(--color-accent)]"
              style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
            >
              same starting line.
            </em>
          </h1>
          <p className="text-lg text-[var(--color-ink-soft)] leading-relaxed max-w-3xl">
            Site Clinic works best when the foundation is not fuzzy. Whether
            you have no website, an existing site, a developer team, or just a
            proof question, this page gets you to the same prepared endpoint:
            account, project, deployment path, monitoring target, launch
            measurement, and next step.
          </p>
        </section>

        <StartHereWizard />

        <section className="bg-[var(--color-surface)] border-2 border-[var(--color-accent)] rounded-2xl p-7 mb-14">
          <div className="mb-3">
            <Eyebrow withDot>Commercial boundary</Eyebrow>
          </div>
          <h2
            className="text-3xl tracking-tight leading-[1.1] mb-4 text-[var(--color-ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Start with the right step, and know what is{" "}
            <em
              className="text-[var(--color-accent)]"
              style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
            >
              free, trial, or gated.
            </em>
          </h2>
          <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed max-w-3xl mb-6">
            Onboarding should not hide the offer. Site Clinic sells the
            recurring operating layer around a website. Public setup guidance
            helps you get ready; checkout starts the monitored trial; advanced
            execution surfaces require entitlement.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {COMMERCIAL_BOUNDARIES.map((item) => (
              <article
                key={item.title}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-5"
              >
                <h3 className="font-semibold text-[var(--color-ink)] mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
          <div className="mt-5">
            <Button href="/pricing" variant="text-link">
              See pricing and subscription boundaries →
            </Button>
          </div>
        </section>

        <section
          id="website-build"
          className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 mb-14 scroll-mt-8"
        >
          <div>
            <div className="mb-3">
              <Eyebrow>Website build foundation</Eyebrow>
            </div>
            <h2
              className="text-3xl tracking-tight leading-[1.1] mb-4 text-[var(--color-ink)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              If you have no website, start{" "}
              <em
                className="text-[var(--color-accent)]"
                style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
              >
                before the build.
              </em>
            </h2>
            <p className="text-base text-[var(--color-ink-soft)] leading-relaxed">
              A website build is not just copy and design. It needs ownership,
              local files, deployment, domain decisions, launch measurement,
              monitoring, and proof expectations. This phase makes the build
              possible before Site Clinic Web Builder runs through Codex,
              Claude Code, Cowork, or another implementation agent.
            </p>
            <p className="text-base text-[var(--color-ink-soft)] leading-relaxed mt-4">
              A complete custom website build is not automatically included in
              the monitoring trial. The build must be scoped as a paid
              engagement, explicit demo, or customer-executed AI build before
              production delivery begins.
            </p>
            <div className="mt-5">
              <Button href="/developers/docs/build-website-with-ai" variant="secondary">
                Open the AI build guide →
              </Button>
            </div>
          </div>
          <div className="space-y-4">
            {WEBSITE_BUILD_STEPS.map((step, index) => (
              <article
                key={step.title}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5"
              >
                <div className="flex gap-4">
                  <div
                    className="w-8 h-8 rounded-full bg-[var(--color-accent)] text-white flex items-center justify-center text-sm font-semibold flex-shrink-0"
                    aria-hidden="true"
                  >
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--color-ink)] mb-1">
                      {step.title}
                    </h3>
                    <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">
                      {step.body}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-[var(--color-surface)] border-2 border-[var(--color-accent)] rounded-2xl p-8 mb-14">
          <div className="mb-3">
            <Eyebrow withDot>Common endpoint</Eyebrow>
          </div>
          <h2
            className="text-3xl tracking-tight leading-[1.1] mb-5 text-[var(--color-ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Everyone ends with the same{" "}
            <em
              className="text-[var(--color-accent)]"
              style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
            >
              prepared foundation.
            </em>
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            {FOUNDATION_ENDPOINTS.map((item) => (
              <div
                key={item}
                className="flex gap-2 text-sm text-[var(--color-ink-soft)] leading-relaxed"
              >
                <span
                  className="text-[var(--color-accent)] flex-shrink-0"
                  aria-hidden="true"
                >
                  ✓
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <div className="mb-3">
            <Eyebrow>After foundation</Eyebrow>
          </div>
          <h2
            className="text-3xl tracking-tight leading-[1.1] mb-6 text-[var(--color-ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Then choose the next{" "}
            <em
              className="text-[var(--color-accent)]"
              style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
            >
              service step.
            </em>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {FOUNDATION_NEXT_STEPS.map((step) => (
              <article
                key={step.title}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 flex flex-col"
              >
                <h3 className="font-semibold text-[var(--color-ink)] mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed mb-5">
                  {step.body}
                </p>
                <div className="mt-auto">
                  <Button href={step.href} variant="text-link">
                    {step.cta} →
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 text-center">
          <div className="mb-3 flex justify-center">
            <Eyebrow>Ready</Eyebrow>
          </div>
          <h2
            className="text-3xl tracking-tight leading-[1.1] mb-4 text-[var(--color-ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Ready to move from foundation to action?
          </h2>
          <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed max-w-2xl mx-auto mb-6">
            If you have a live site, start the monitored trial. If you need a
            site built, open the build guide or bring the handoff packet into a
            scoped Web Builder engagement. Either route should end in the same
            place: deployed site, launch measurement, and Site Clinic monitoring.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button href="/pricing" variant="primary">
              Start free trial
            </Button>
            <Button href="/developers/docs/build-website-with-ai" variant="secondary">
              Open build guide
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
