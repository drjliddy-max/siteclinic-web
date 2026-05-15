export type FoundationPath = {
  id: string;
  question: string;
  answer: string;
  bestFor: string;
  firstStep: string;
  endpoint: string;
  href: string;
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
      "Prepare GitHub, a local project folder, hosting, domain access, content inputs, and proof expectations.",
    endpoint:
      "You end with everything needed for Web Builder or an implementation agent to build, deploy, and verify the site.",
    href: "/start-here#website-build",
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

export const FOUNDATION_ENDPOINTS = [
  "A GitHub account or a named repo owner.",
  "A project folder on the computer or an existing repository.",
  "A deployment target such as Vercel, or a chosen host with access confirmed.",
  "Domain/DNS access when a custom domain is needed.",
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
      "Prepare the project foundation, then move into Web Builder or implementation work with deployment and monitoring already defined.",
    href: "/start-here#website-build",
    cta: "Prepare build foundation",
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
