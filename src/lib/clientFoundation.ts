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
  routeSteps: string[];
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
      "You end with a trial-backed monitored site, baseline checks, and a prioritized next-action list.",
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
      "You end with everything needed to scope, build, deploy, and verify the site. A finished custom website build is a separate delivery scope unless explicitly included.",
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
      "You end with a working authenticated path, plan entitlement, and a clear implementation contract.",
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
      "Website build foundation. You should leave with the accounts, project folder, deployment path, DNS action, content inputs, and monitoring handoff needed to build without guessing.",
    firstAction:
      "Prepare GitHub, Vercel, domain/DNS access, Search Console, GA4, and the Site Clinic Web Builder prompt before any production cutover.",
    routeSteps: [
      "Confirm who owns the domain, website files, hosting account, and final site.",
      "Create or choose the GitHub repo and local project folder.",
      "Choose Vercel or the required host before any build files are generated.",
      "Gather the pages, offer, CTA, contact details, brand assets, proof sources, and launch constraints.",
      "Use the AI build guide yourself, or scope a Site Clinic Web Builder engagement.",
      "Deploy, connect DNS, submit the sitemap, install GA4/Search Console, and attach the site to monitoring.",
    ],
    customerExperience: [
      "Start with the website foundation, not a vague quote.",
      "Use Codex, Claude Code, Cowork, or a developer as the execution surface.",
      "Know the difference between free setup guidance, trial monitoring, and paid website delivery.",
      "Keep GoDaddy DNS as a human browser step until Vercel provides exact records.",
      "Finish with a deployed website, monitoring baseline, and launch proof.",
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
    primaryCta: "Build with AI guide",
    secondaryHref: "/developers/docs/accounts-dns-secrets",
    secondaryCta: "Account and DNS checklist",
  },
  {
    id: "existing-site",
    label: "I have a site",
    prompt: "I already have a live website, but I need more traffic, trust, leads, or proof.",
    outcome:
      "Monitoring and improvement foundation. The client should leave with a baseline dashboard, priority findings, and the next growth loop identified.",
    firstAction:
      "Attach the live URL, verify health/SEO/accessibility/indexing, and decide whether the next service step is fixes, service pages, blog authority, or conversion testing.",
    routeSteps: [
      "Enter the live canonical URL and start the 30-day monitoring trial.",
      "Confirm the dashboard owner and the primary conversion action.",
      "Connect or plan access for Search Console and GA4.",
      "Review health, redirects, SEO, performance, accessibility, security, and indexing signals.",
      "Choose the smallest measurable next loop: technical fixes, service pages, blog authority, conversion testing, or ongoing monitoring.",
      "Use Site Monitor as the proof layer for any claimed improvement.",
    ],
    customerExperience: [
      "Start from the live site instead of rebuilding blindly.",
      "Use the 30-day trial for the recurring Site Clinic operating layer: dashboard, scans, alerts, connected data, and proof.",
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
    routeSteps: [
      "Separate every client site by owner, domain, entitlement, and proof scope.",
      "Confirm whether the work uses dashboard-only, API, MCP, scheduler, Blog Writer, or hybrid mode.",
      "Verify entitlement before issuing API keys or enabling paid execution surfaces.",
      "Define logs, quotas, request IDs, rotation, and proof artifacts.",
      "Connect implementation outputs back to Site Monitor so reports are not handcrafted.",
      "Keep scheduling and content execution centralized; avoid repo-local timers or forked pipelines.",
    ],
    customerExperience: [
      "Start with product-surface truth: API, MCP, scheduler, crawler, Blog Writer, dashboard.",
      "Confirm entitlement before using API keys, MCP tools, scheduler execution, or Blog Writer automation.",
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
    routeSteps: [
      "Name the buying concern: traffic, accessibility, indexing, AI visibility, leads, trust, or technical drift.",
      "Review the relevant proof surface: case study, dashboard, demo, or public result.",
      "Separate verified evidence from roadmap, inference, or future monitoring.",
      "Decide what a trial dashboard or paid proof artifact must answer.",
      "Choose the next route: monitor existing site, scope a website build, or prepare developer integration.",
    ],
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
  "Commercial boundary understood: public docs are free; monitoring trial is time-limited; API, MCP, scheduler, and Blog Writer require entitlement.",
  "Website inputs: brand, audience, offer, pages, CTAs, proof sources, and launch constraints.",
  "Monitoring target: site URL, dashboard scope, scan cadence, and verification expectations.",
  "Launch-day measurement plan: sitemap, Search Console, GA4, conversion events, and indexing proof.",
  "A written next step: monitor existing site, build website, integrate API/MCP, or review proof.",
] as const;

export const FOUNDATION_NEXT_STEPS = [
  {
    title: "Existing website",
    body:
      "Start the 30-day trial, attach the site URL, and use the first dashboard as the baseline for fixes and monitoring.",
    href: "/pricing",
    cta: "Start monitoring",
  },
  {
    title: "Website build",
    body:
      "Prepare the project foundation, then move into a scoped website build through Site Clinic Web Builder, Codex, Claude Code, Cowork, or a developer with deployment and monitoring already defined.",
    href: "/developers/docs/build-website-with-ai",
    cta: "Open AI build guide",
  },
  {
    title: "Developer integration",
    body:
      "Use Step 0, then choose quickstart, API reference, MCP, or examples after confirming the account entitlement and implementation mode.",
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
