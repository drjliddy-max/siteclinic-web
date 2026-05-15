export type FoundationPath = {
  id: string;
  question: string;
  answer: string;
  bestFor: string;
  firstStep: string;
  endpoint: string;
  href: string;
};

export type OnboardingRoute = {
  id: string;
  label: string;
  prompt: string;
  outcome: string;
  firstAction: string;
  customerExperience: string[];
  readiness: string[];
  primaryHref: string;
  primaryCta: string;
  secondaryHref: string;
  secondaryCta: string;
};

export const FOUNDATION_PATHS: FoundationPath[] = [
  {
    id: "existing-site",
    question: "Do you already have a website?",
    answer: "Yes. Start by connecting the live site to monitoring.",
    bestFor:
      "Owners who have a live site and need to know what is broken, drifting, invisible, or worth fixing first.",
    firstStep: "Add the site URL and open the first Site Clinic dashboard.",
    endpoint:
      "You end with a monitored site, baseline checks, and a prioritized next-action list.",
    href: "/pricing",
  },
  {
    id: "needs-website",
    question: "Do you need a website built or rebuilt?",
    answer: "Yes. Start with the website build foundation.",
    bestFor:
      "Beginners, operators, or clients who need a real project, route plan, deploy target, domain path, content model, and monitoring setup before launch.",
    firstStep:
      "Prepare GitHub, a local project folder, hosting, domain access, content inputs, and proof expectations, then run Web Builder through Codex or another coding agent.",
    endpoint:
      "You end with everything needed for Web Builder, Codex, Claude Code, Cowork, or an implementation agent to build, deploy, and verify the site.",
    href: "/developers/docs/build-website-with-ai",
  },
  {
    id: "developer",
    question: "Are you a developer or agency integrating tools?",
    answer: "Yes. Start with the developer foundation.",
    bestFor:
      "Teams using API keys, SDKs, MCP-capable agents, webhooks, or internal tooling around Site Clinic evidence.",
    firstStep:
      "Choose API, MCP, or hybrid mode, then confirm credentials, environment, quotas, logs, and request proof.",
    endpoint:
      "You end with a working authenticated path and a clear implementation contract.",
    href: "/developers/docs/foundation",
  },
  {
    id: "proof-first",
    question: "Do you want proof before deciding?",
    answer: "Yes. Start with the proof and demo path.",
    bestFor:
      "Buyers who need to see what the dashboard shows, what claims are proven, and what remains unproven.",
    firstStep: "Review the proof case, then compare it to the demo-site checklist.",
    endpoint:
      "You end with a scoped view of what Site Clinic can prove before buying or building.",
    href: "/case-studies",
  },
];

export const ONBOARDING_ROUTES: OnboardingRoute[] = [
  {
    id: "no-website",
    label: "I need a website",
    prompt: "I bought a domain or have an idea, but I do not have a real website yet.",
    outcome:
      "Website build foundation. The client should leave with accounts, project folder, deployment path, DNS action, content inputs, and monitoring handoff ready.",
    firstAction:
      "Prepare GitHub, Vercel, GoDaddy DNS instructions, Search Console, GA4, and the Site Clinic Web Builder prompt before any production cutover.",
    customerExperience: [
      "Start with the AI website build guide instead of pricing confusion.",
      "Use Codex, Claude Code, Cowork, or a developer as the execution surface.",
      "Keep GoDaddy DNS as a human browser step until Vercel provides exact records.",
      "Finish with a deployable website plus monitoring and launch proof.",
    ],
    readiness: [
      "GitHub owner or repository chosen.",
      "Local project folder or repo exists.",
      "Vercel or other host selected.",
      "Domain registrar access confirmed.",
      "Business offer, pages, CTA, contact path, and proof sources gathered.",
      "Search Console, GA4, sitemap, robots, and monitoring handoff planned.",
    ],
    primaryHref: "/developers/docs/build-website-with-ai",
    primaryCta: "Open AI build guide",
    secondaryHref: "/developers/docs/accounts-dns-secrets",
    secondaryCta: "Prepare accounts and DNS",
  },
  {
    id: "existing-site",
    label: "I have a site",
    prompt: "I already have a live website, but I need more traffic, trust, leads, or proof.",
    outcome:
      "Monitoring and improvement foundation. The client should leave with a baseline dashboard, priority findings, and the next growth loop identified.",
    firstAction:
      "Attach the live URL, verify health/SEO/accessibility/indexing, and decide whether the next service step is fixes, service pages, blog authority, or conversion testing.",
    customerExperience: [
      "Start from the live site instead of rebuilding blindly.",
      "Use Site Monitor as the baseline truth before claiming improvement.",
      "Separate technical blockers from content, trust, and conversion opportunities.",
      "Move into the smallest next service that can be measured.",
    ],
    readiness: [
      "Live URL and canonical domain known.",
      "Dashboard owner identified.",
      "Search Console and GA4 access path known.",
      "Primary conversion action named.",
      "Known pages, service areas, and important URLs listed.",
      "Next improvement loop selected from evidence.",
    ],
    primaryHref: "/pricing",
    primaryCta: "Start monitoring",
    secondaryHref: "/case-studies",
    secondaryCta: "Review proof first",
  },
  {
    id: "developer-agency",
    label: "I manage sites",
    prompt: "I am a developer or agency managing client sites, API work, MCP tools, or recurring operations.",
    outcome:
      "Developer foundation. The team should leave with API/MCP boundaries, credentials, plan limits, logging, proof artifacts, and client dashboard scope clear.",
    firstAction:
      "Choose API, confirmed MCP tools, scheduler-owned workflows, or hybrid implementation before writing integration code.",
    customerExperience: [
      "Start with product-surface truth: API, MCP, scheduler, crawler, Blog Writer, dashboard.",
      "Keep client sites isolated by account, entitlement, monitored site, and proof scope.",
      "Use Site Monitor for the evidence layer rather than handcrafted reports.",
      "Treat Blog Writer as scheduler-owned automation, not a blind publish tool.",
    ],
    readiness: [
      "Client/site list separated by owner and domain.",
      "API keys and MCP access scoped by entitlement.",
      "Scheduler-owned workflows identified.",
      "Dashboard visibility and proof outputs defined.",
      "Logging, quotas, request IDs, and rotation process understood.",
      "No repo-local timers or one-off content pipelines planned.",
    ],
    primaryHref: "/developers/docs/foundation",
    primaryCta: "Open developer foundation",
    secondaryHref: "/developers/docs/accounts-dns-secrets",
    secondaryCta: "Prepare API and MCP access",
  },
  {
    id: "proof-first",
    label: "I want proof",
    prompt: "I am not ready to buy or build until I understand what Site Clinic proves.",
    outcome:
      "Proof review foundation. The buyer should leave knowing what is verified, what is not verified yet, and what the next paid or trial step would prove.",
    firstAction:
      "Review case-study evidence, dashboard scope, current limitations, and which proof artifact would answer the buying question.",
    customerExperience: [
      "Start with evidence instead of vague AI or SEO claims.",
      "Understand which signals are live, measured, inferred, or future work.",
      "See how monitored sites move from baseline to improvement loops.",
      "Decide between trial, website build, monitoring, or developer integration.",
    ],
    readiness: [
      "Primary concern named: traffic, accessibility, indexing, AI visibility, leads, or trust.",
      "Proof artifact needed before purchase identified.",
      "Current site status known.",
      "Trial or paid boundary understood.",
      "Next step selected from evidence, not guesswork.",
    ],
    primaryHref: "/case-studies",
    primaryCta: "Review proof",
    secondaryHref: "/start-here#guided-intake",
    secondaryCta: "Restart guided path",
  },
];

export const FOUNDATION_ENDPOINTS = [
  "A GitHub account or a named repo owner.",
  "A project folder on the computer or an existing repository.",
  "A deployment target such as Vercel, or a chosen host with access confirmed.",
  "Domain/DNS access when a custom domain is needed.",
  "A chosen execution surface: Codex preferred for repo work, or Claude Code/Cowork if that is the working agent.",
  "Site Clinic account path, plan boundary, and API key path when relevant.",
  "Website inputs: brand, audience, offer, pages, CTAs, proof sources, and launch constraints.",
  "Monitoring target: site URL, dashboard scope, scan cadence, and verification expectations.",
  "Launch-day measurement plan: sitemap, Search Console, GA4, conversion events, and indexing proof.",
  "A written next step: monitor existing site, build website, integrate API/MCP, or review proof.",
] as const;

export const FOUNDATION_NEXT_STEPS = [
  {
    title: "Existing website",
    body:
      "Start the trial, attach the site URL, and use the first dashboard as the baseline for fixes and monitoring.",
    href: "/pricing",
    cta: "Start monitoring",
  },
  {
    title: "Website build",
    body:
      "Prepare the project foundation, then move into Site Clinic Web Builder executed through Codex, Claude Code, Cowork, or a developer with deployment and monitoring already defined.",
    href: "/developers/docs/build-website-with-ai",
    cta: "Open AI build guide",
  },
  {
    title: "Developer integration",
    body:
      "Use Step 0, then choose quickstart, API reference, MCP, or examples depending on the implementation mode.",
    href: "/developers/docs/foundation",
    cta: "Open developer foundation",
  },
  {
    title: "Proof review",
    body:
      "Review proof, dashboard scope, and demo requirements before making a buying or build decision.",
    href: "/case-studies",
    cta: "Review proof",
  },
] as const;
