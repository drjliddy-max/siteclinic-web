/*
 * Site Clinic intent pages — config-driven SEO landing pages.
 *
 * Ported from site-monitor/src/app/welcome/intentPages.ts (§5b iteration 12)
 * with these normalizations applied during the port:
 *
 *   - CTA hrefs normalized from `/welcome/...` to apex paths
 *     (e.g., /welcome/pricing → /pricing, /welcome/compare/... → /compare/...)
 *   - `/developers` hrefs preserved as-is (already at apex in source)
 *   - External URLs (adaauditreport.com) preserved as-is
 *
 * Each entry drives a concrete route at `/<slug>` rendered by the dynamic
 * `src/app/[slug]/page.tsx` handler. `generateStaticParams` in that handler
 * iterates this array. Sitemap also iterates this array.
 *
 * To add a new intent page: append one entry here. The route, sitemap entry,
 * and gate coverage all flow automatically (after the new slug is added to
 * gate.config.json explicitly per the migration-unit discipline).
 */

export interface SiteClinicIntentPage {
  slug: string;
  cardTitle: string;
  cardDescription: string;
  title: string;
  description: string;
  h1: string;
  opening: string;
  whoItIsFor: string[];
  evidenceCaptures: string[];
  sampleOutput: Array<{ label: string; detail: string }>;
  comparisonTitle: string;
  comparisonBody: string;
  comparisonPoints: string[];
  faqs: Array<{ question: string; answer: string }>;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
}

export const SITE_CLINIC_INTENT_PAGES: SiteClinicIntentPage[] = [
  {
    slug: "ai-visibility-monitoring-tool",
    cardTitle: "AI visibility monitoring tool",
    cardDescription:
      "What Site Clinic tracks when AI crawlers, citations, and technical drift all matter at once.",
    title: "AI Visibility Monitoring Tool for Websites | Site Clinic",
    description:
      "AI visibility monitoring tool for websites. Track AI crawlers, owned-domain citations, and technical health in one recurring monitoring workflow.",
    h1: "AI visibility monitoring tool",
    opening:
      "An AI visibility monitoring tool tracks whether AI crawlers visit your website, which pages they fetch, and whether your own domain shows up in answers for commercial queries. Site Clinic combines that evidence with recurring accessibility, SEO, and technical-health monitoring so visibility changes are tied to pages and fixes you can actually act on.",
    whoItIsFor: [
      "Small-business owners who want proof of whether AI assistants are discovering or ignoring their site",
      "Agencies that need one recurring workflow for crawl evidence, answer ownership, and site health",
      "Teams that want AI visibility measured alongside accessibility, performance, and SEO drift instead of in a separate silo",
    ],
    evidenceCaptures: [
      "Crawler hits by bot, page, and time window when logs or instrumentation are available",
      "Owned-domain citation tracking by query so you can see whether your site is cited at all",
      "Correct-page vs homepage citation patterns for answer-ready landing pages",
      "Technical context such as broken links, missing metadata, accessibility regressions, and header drift",
    ],
    sampleOutput: [
      {
        label: "Crawler evidence",
        detail:
          "GPTBot and ClaudeBot hits grouped by path, recency, and trend so you can see what AI systems are actually touching.",
      },
      {
        label: "Citation ownership",
        detail:
          "Query-level results showing whether Site Clinic pages, competitor pages, or reference bodies are winning the answer.",
      },
      {
        label: "Action queue",
        detail:
          "Recommended next moves tied to page coverage, correct-page misses, and silent technical regressions.",
      },
    ],
    comparisonTitle:
      "How this differs from Pingdom, UptimeRobot, and generic monitoring tools",
    comparisonBody:
      "Pingdom and UptimeRobot are useful when the main question is whether the site is up. They do not explain whether AI systems are crawling your pages, whether your own domain is being cited, or whether answer ownership is slipping because the site quietly drifted. Site Clinic treats uptime as one signal inside a broader visibility loop.",
    comparisonPoints: [
      "Traditional monitoring tells you the site responded. Site Clinic tells you whether your pages are being retrieved, cited, and quietly degrading.",
      "Generic uptime tools do not connect crawl evidence to accessibility, metadata, and page-level fix work.",
      "AI-only visibility tools often stop at reporting. Site Clinic keeps the evidence attached to recurring technical monitoring and verification.",
    ],
    faqs: [
      {
        question: "Does Site Clinic replace uptime monitoring?",
        answer:
          "It covers the broader monitoring problem. Uptime is one signal. Site Clinic is built for recurring visibility health: accessibility, broken links, SEO drift, technical regressions, and AI-discovery evidence in the same operating loop.",
      },
      {
        question: "What counts as AI visibility?",
        answer:
          "For Site Clinic, AI visibility means two things: AI systems are able to reach your pages, and your owned domain is the one getting cited for relevant queries. Crawl evidence without owned-domain citations is still a weak outcome.",
      },
      {
        question: "Do I need GA4 or Search Console first?",
        answer:
          "No. Site Clinic can start from public evidence. Connected sources deepen the context later, but the recurring monitoring loop does not depend on them to begin.",
      },
    ],
    primaryCtaLabel: "Start Site Clinic",
    primaryCtaHref: "/pricing",
    secondaryCtaLabel: "Compare monitoring tools",
    secondaryCtaHref: "/compare/site-clinic-vs-pingdom-vs-uptimerobot",
  },
  {
    slug: "ai-citation-tracking-for-websites",
    cardTitle: "AI citation tracking for websites",
    cardDescription:
      "Track whether your own domain, and the right page on your domain, gets cited in AI answers.",
    title: "AI Citation Tracking for Websites | Site Clinic",
    description:
      "Track AI citations for your website. Measure owned-domain answer ownership, correct-page citation rate, and competitor displacement for important queries.",
    h1: "AI citation tracking for websites",
    opening:
      "AI citation tracking for websites is the practice of measuring whether your own domain is cited in assistant answers, which page gets cited, and how often competitors displace you. Site Clinic tracks answer ownership at the domain and page level so you can tell the difference between being vaguely discovered and actually winning the answer.",
    whoItIsFor: [
      "Website owners who care whether ChatGPT, Perplexity, and similar systems cite their domain instead of a competitor",
      "Teams publishing commercial landing pages that need to win exact queries, not just homepage mentions",
      "Operators who want citation data tied to technical health and page-level recommendations instead of an isolated leaderboard",
    ],
    evidenceCaptures: [
      "Official-domain citation rate across the tracked query pack",
      "Correct-page citation rate so you can see whether the intended landing page is actually the cited asset",
      "Competitor displacement rate when both your domain and competitors appear",
      "Query-by-query recent results to audit wins, misses, and wrong-page outcomes",
    ],
    sampleOutput: [
      {
        label: "Official-domain rate",
        detail:
          "A clean percentage showing how often your own domain appears in answers for the tracked queries.",
      },
      {
        label: "Correct-page rate",
        detail:
          "A second layer showing whether the citation lands on the page that should own the query, not just the homepage.",
      },
      {
        label: "Competitor review",
        detail:
          "The competing domains that keep showing up first, so you know which pages and answer patterns to study.",
      },
    ],
    comparisonTitle: "How this differs from generic rank tracking",
    comparisonBody:
      "Traditional rank tracking is built for classic search positions. AI citation tracking asks a different question: does the assistant choose your page as part of its answer at all, and if so, does it choose the right page? Site Clinic focuses on owned-domain answer ownership, not just a generic notion of visibility.",
    comparisonPoints: [
      "The key win condition is owned-domain answer ownership, not broad mention volume.",
      "Correct-page citation rate matters because a homepage mention often means the query still lacks a purpose-built answer page.",
      "Citation tracking is more useful when paired with fix-oriented monitoring instead of treated as a vanity metric alone.",
    ],
    faqs: [
      {
        question:
          "What is the difference between citation rate and correct-page citation rate?",
        answer:
          "Citation rate tells you whether your domain appeared at all. Correct-page citation rate tells you whether the cited URL is the page that should actually win the query. That second metric is what exposes wrong-page resolution.",
      },
      {
        question: "Can citation tracking tell me which competitors keep winning?",
        answer:
          "Yes. Site Clinic records the domains that keep appearing in recent results so you can see whether you are losing to a direct commercial competitor, a reference body, or a generic marketplace surface.",
      },
      {
        question: "Why pair citation tracking with technical monitoring?",
        answer:
          "Because losing citations is often tied to page quality and clarity problems: weak definitions, missing comparison content, wrong canonical signals, or quiet technical drift. The monitoring layer helps explain the misses.",
      },
    ],
    primaryCtaLabel: "See pricing",
    primaryCtaHref: "/pricing",
    secondaryCtaLabel: "Developer docs",
    secondaryCtaHref: "/developers",
  },
  {
    slug: "track-ai-crawler-hits-to-my-website",
    cardTitle: "Track AI crawler hits to my website",
    cardDescription:
      "See when GPTBot, ClaudeBot, PerplexityBot, and related crawlers are touching your pages.",
    title: "Track AI Crawler Hits to My Website | Site Clinic",
    description:
      "Track AI crawler hits to your website. Monitor bot visits by path and trend, then connect crawler activity to citations and technical changes.",
    h1: "Track AI crawler hits to my website",
    opening:
      "To track AI crawler hits to your website, you need evidence of which bots visited, which paths they touched, and whether that activity led to anything useful. Site Clinic surfaces crawler-hit evidence by site and trend, then keeps it connected to answer ownership and technical monitoring so bot traffic is not treated like a mystery metric.",
    whoItIsFor: [
      "Owners who want to know whether AI crawlers are visiting their site at all",
      "Teams trying to separate curiosity from value by comparing crawler activity with citations and traffic signals",
      "Developers and agencies that need a repeatable way to explain bot activity to clients without overclaiming what it means",
    ],
    evidenceCaptures: [
      "Recent crawler hits grouped by bot and path when the underlying source is available",
      "Trend direction so you can see whether crawl activity is increasing, falling, or flat",
      "A side-by-side view of crawl evidence with citation performance and site health",
      "Page-level context that helps explain why a fetched page still may not earn citations",
    ],
    sampleOutput: [
      {
        label: "Bot breakdown",
        detail:
          "A list of recognized crawlers, the pages they touched, and when those visits were last seen.",
      },
      {
        label: "Trend signal",
        detail:
          "Simple up, down, or stable direction for recent bot activity so teams can spot material changes quickly.",
      },
      {
        label: "Interpretation layer",
        detail:
          "Recommended actions that distinguish between crawl discovery, answer ownership, and quiet technical regressions.",
      },
    ],
    comparisonTitle: "How this differs from server logs alone",
    comparisonBody:
      "Raw logs can tell you that a bot requested a page. They do not tell you whether the page belongs in a recurring monitoring system, whether the site is technically healthy, or whether those visits ever turn into owned-domain citations. Site Clinic keeps the crawler evidence inside a broader operating loop.",
    comparisonPoints: [
      "A crawl does not automatically mean a citation, referral, or commercial win.",
      "Generic monitoring tools do not usually separate AI-crawler behavior into a buyer-readable workflow.",
      "The useful question is not only who crawled the site, but whether the pages are strong enough to win the answer afterward.",
    ],
    faqs: [
      {
        question: "Can I see specific bots like GPTBot or ClaudeBot?",
        answer:
          "Yes, when the underlying source is available. Site Clinic is designed to surface recognizable crawler evidence by site and trend instead of collapsing everything into an undifferentiated bot bucket.",
      },
      {
        question: "Does a crawler hit mean my site will be cited?",
        answer:
          "No. Crawl activity is discovery evidence, not proof of answer ownership. A crawler can fetch a page without the assistant ever citing that domain for the query that matters.",
      },
      {
        question: "Why is this useful for small businesses?",
        answer:
          "Because it helps explain a previously invisible part of discovery. Owners can see whether AI systems are reaching the site, and whether the next step is page improvement rather than more guessing.",
      },
    ],
    primaryCtaLabel: "Start free trial",
    primaryCtaHref: "/pricing",
    secondaryCtaLabel: "Explore the API",
    secondaryCtaHref: "/developers",
  },
  {
    slug: "website-monitoring-with-seo-and-accessibility",
    cardTitle: "Website monitoring with SEO and accessibility",
    cardDescription:
      "One recurring workflow for accessibility drift, metadata issues, broken links, headers, and broader technical health.",
    title: "Website Monitoring with SEO and Accessibility | Site Clinic",
    description:
      "Website monitoring with SEO and accessibility checks, broken links, headers, performance, and recurring verification for small-business sites.",
    h1: "Website monitoring with SEO and accessibility",
    opening:
      "Website monitoring with SEO and accessibility means more than uptime alerts. It means checking whether pages still load cleanly, whether metadata drifted, whether broken links appeared, whether accessibility issues returned, and whether the site is quietly becoming harder to discover or trust. Site Clinic packages those checks into one recurring monitoring loop for small-business websites.",
    whoItIsFor: [
      "Owners who want one recurring system instead of separate tools for uptime, accessibility, and SEO drift",
      "Agencies managing sites where quiet regressions create support work, ranking losses, or legal risk",
      "Teams that need monitoring tied to verification and next-step guidance instead of disconnected alerts",
    ],
    evidenceCaptures: [
      "Recurring accessibility checks against the same evidence discipline used across the portfolio",
      "SEO and metadata drift such as titles, descriptions, sitemap access, and structured-data issues",
      "Broken links, redirects, security headers, and other technical-health changes",
      "A place to verify whether fixes improved the site instead of just shipping and hoping",
    ],
    sampleOutput: [
      {
        label: "Issue categories",
        detail:
          "Accessibility, links, metadata, performance, and header issues grouped into one dashboard instead of five separate tools.",
      },
      {
        label: "Recurring verification",
        detail:
          "The same site can be re-scanned after fixes so the owner has proof that changes actually moved the needle.",
      },
      {
        label: "Priority guidance",
        detail:
          "The dashboard highlights what changed, what stayed broken, and which pages deserve the next round of attention.",
      },
    ],
    comparisonTitle: "How this differs from uptime-first monitoring",
    comparisonBody:
      "Uptime-first tools answer whether a page responded. They do not answer whether the site is slowly becoming less discoverable, less accessible, or harder to trust. Site Clinic is built for the silent problems that owners usually notice too late.",
    comparisonPoints: [
      "Accessibility regressions and SEO drift matter even when the site is technically online.",
      "Broken links, header changes, and page-level quality issues belong in the same recurring workflow as uptime.",
      "The value is continuity: monitor, diagnose, verify, and prove changes over time.",
    ],
    faqs: [
      {
        question: "Does Site Clinic include accessibility monitoring?",
        answer:
          "Yes. Accessibility is part of the recurring monitoring story, alongside broken links, metadata drift, headers, performance signals, and broader technical health.",
      },
      {
        question: "How is this different from a one-time audit?",
        answer:
          "A one-time audit gives you a snapshot and a repair artifact. Site Clinic is the standing layer that keeps checking the site afterward so regressions and quiet drift do not go unnoticed.",
      },
      {
        question:
          "What if I only need a one-time accessibility artifact first?",
        answer:
          "Start with ADA Audit Report for the screenshot-backed audit artifact, then move into Site Clinic when the work becomes recurring monitoring and verification.",
      },
    ],
    primaryCtaLabel: "View Site Clinic pricing",
    primaryCtaHref: "/pricing",
    secondaryCtaLabel: "Start with ADA Audit Report",
    secondaryCtaHref: "https://adaauditreport.com",
  },
];

export const SITE_CLINIC_INTENT_PAGE_MAP: Record<string, SiteClinicIntentPage> =
  Object.fromEntries(
    SITE_CLINIC_INTENT_PAGES.map((page) => [page.slug, page]),
  );

export const SITE_CLINIC_INTENT_SLUGS = SITE_CLINIC_INTENT_PAGES.map(
  (page) => page.slug,
);
