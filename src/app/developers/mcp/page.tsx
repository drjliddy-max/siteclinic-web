import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Eyebrow } from "@/components/Eyebrow";
import { Button } from "@/components/Button";

/*
 * MCP Tools — siteclinic.io/developers/mcp
 *
 * §5b iteration 9: cherry-picked from
 * site-monitor/src/app/developers/mcp/page.tsx (~634 lines), trimmed to the
 * public-doc shape:
 *   - Hero + installation snippet
 *   - The ONE shipping MCP server (siteclinic-crawl) with tools list
 *   - 2 roadmap MCP servers (monitor + audit) as future-state roadmap
 *   - Integration examples for Claude Code, VS Code+Continue, custom agents
 *   - Usage snippet showing tool invocation
 *
 * DESIGN NORMALIZATION:
 *   Source used blue/indigo gradient + green/yellow/gray status badges +
 *   purple "MCP Tools" pill. Converted to cream/sage with semantic warning
 *   colors only where they actually communicate status (green for shipping,
 *   amber for coming-soon — same severity-color convention as case-studies).
 *
 * Cross-origin to app.siteclinic.io for signup (auth-gated).
 *
 * Migration unit:
 *   1. This page          → src/app/developers/mcp/page.tsx  ✓
 *   2. Sitemap entry      → src/app/sitemap.ts adds /developers/mcp
 *   3. Legacy redirect    → next.config.ts adds /welcome/developers/mcp → /developers/mcp
 *   4. Gate coverage      → gate.config.json adds /developers/mcp
 */

const APP_SIGNUP = "https://app.siteclinic.io/developers/signup";

const MCP_INSTALL_SNIPPET = `{
  "mcpServers": {
    "siteclinic-crawl": {
      "command": "npx",
      "args": ["@siteclinic/mcp-crawl"],
      "env": {
        "SITECLINIC_API_KEY": "sc_live_your_key_here"
      }
    }
  }
}`;

const MCP_USAGE_SNIPPET = `// In Claude Code or any MCP-enabled assistant:

discover_business_candidates({
  industry: "restaurant",
  location: "San Francisco, CA",
  limit: 50
})

run_site_visibility_scan({
  website_url: "https://example.com",
  scan_type: "full",
  include_screenshots: true
})`;

const SHIPPING_MCP = {
  name: "siteclinic-crawl-mcp",
  description:
    "Business discovery + site auditing infrastructure. Find candidates by industry and location, validate domains, extract contact data, run ADA / SEO / performance audits, and generate reports — all through named MCP tools.",
  tools: [
    "discover_business_candidates — find 50+ candidates by industry + location",
    "qualify_candidate_domains — validate business domains for reachability",
    "crawl_candidate_site — extract contact info and business details",
    "run_site_visibility_scan — complete ADA / SEO / performance audits",
    "generate_audit_report — PDF / HTML / JSON report generation",
    "get_proof_run_status — monitor operation status and results",
    "list_supported_sources — show available discovery sources",
  ],
  installCommand: "npm install -g @siteclinic/mcp-crawl",
  proofResults: "50/50 candidate discovery proof passed",
  evidenceStandards:
    "Source attribution, scope boundaries, reproducibility per Site Clinic doctrine.",
};

const ROADMAP_MCP = [
  {
    name: "siteclinic-monitor-mcp",
    eta: "Q3 2026",
    description: "Continuous site health monitoring + alerting through MCP tools.",
  },
  {
    name: "siteclinic-audit-mcp",
    eta: "Q4 2026",
    description: "Comprehensive WCAG 2.1/2.2 audit + legal-grade reports.",
  },
];

const INTEGRATION_EXAMPLES = [
  {
    platform: "Claude Code",
    setup: "Add MCP server entry to Claude Code config.",
    benefits: "Native tool access, streaming responses, type-safe parameters.",
  },
  {
    platform: "VS Code + Continue",
    setup: "Configure MCP server in Continue extension.",
    benefits: "Code-context awareness, automated audits on save, PR integration.",
  },
  {
    platform: "Custom agents",
    setup: "Use @modelcontextprotocol/sdk in Node.js or Python.",
    benefits: "Full programmatic control, custom business logic, enterprise integration.",
  },
] as const;

const PAGE_URL = "https://siteclinic.io/developers/mcp";
const DESCRIPTION =
  "Site Clinic MCP servers — evidence-first website infrastructure delivered as Model Context Protocol tools for Claude Code and other AI assistants.";

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://siteclinic.io/developers/mcp#page",
  url: PAGE_URL,
  name: "Site Clinic MCP Tools",
  description: DESCRIPTION,
  isPartOf: { "@id": "https://siteclinic.io/#website" },
  about: { "@id": "https://siteclinic.io/#org" },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Developers", item: "https://siteclinic.io/developers" },
      { "@type": "ListItem", position: 2, name: "MCP", item: PAGE_URL },
    ],
  },
  mainEntity: {
    "@type": "SoftwareApplication",
    name: "Site Clinic MCP",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    description:
      "Model Context Protocol server layer exposing Site Clinic capabilities as curated agent tools.",
  },
};

export const metadata: Metadata = {
  title: "Site Clinic MCP Tools — Developer Infrastructure",
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Site Clinic MCP Tools — Developer Infrastructure",
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: "Site Clinic",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Site Clinic MCP Tools — Developer Infrastructure",
    description: DESCRIPTION,
  },
};

function CodeBlock({
  language,
  code,
}: {
  language: string;
  code: string;
}) {
  return (
    <div className="bg-[#0F1826] rounded-lg overflow-hidden">
      <div className="px-4 py-2 text-xs border-b border-[#1e2a44]">
        <span
          className="inline-block px-2 py-0.5 rounded bg-[var(--color-accent)] text-white font-medium"
          style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
        >
          {language}
        </span>
      </div>
      <pre
        className="p-4 overflow-x-auto text-white text-sm leading-relaxed whitespace-pre"
        style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
      >
        {code}
      </pre>
    </div>
  );
}

export default function MCPPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <SiteHeader />
      <main
        className="flex-1 max-w-4xl mx-auto px-6 pb-20 w-full"
        style={{ fontFamily: "var(--font-body)" }}
      >
        <nav
          aria-label="Breadcrumb"
          className="pt-8 pb-4 text-sm text-[var(--color-ink-soft)]"
        >
          <Link href="/developers" className="hover:text-[var(--color-ink)]">
            Developers
          </Link>
          <span className="mx-2" aria-hidden="true">›</span>
          <span className="text-[var(--color-ink)]">MCP</span>
        </nav>

        <section className="pb-10">
          <div className="mb-3">
            <Eyebrow>MCP</Eyebrow>
          </div>
          <h1
            className="text-4xl md:text-5xl tracking-tight leading-[1.05] mb-5 text-[var(--color-ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Site Clinic as{" "}
            <em
              className="text-[var(--color-accent)]"
              style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
            >
              MCP-native tools.
            </em>
          </h1>
          <p
            className="text-lg text-[var(--color-ink-soft)] leading-relaxed max-w-3xl"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Use Site Clinic capabilities inside Claude Code, VS Code +
            Continue, and custom AI agents through Model Context Protocol
            tools. Backed by the same public API system of record — agents
            get a curated tool surface instead of brittle prompt-only HTTP.
          </p>
        </section>

        <section className="mb-12">
          <div className="mb-3">
            <Eyebrow>Install</Eyebrow>
          </div>
          <h2
            className="text-2xl tracking-tight mb-4 text-[var(--color-ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Add to your MCP client config
          </h2>
          <CodeBlock language="json" code={MCP_INSTALL_SNIPPET} />
          <p className="text-sm text-[var(--color-ink-soft)] mt-4">
            Need an API key first?{" "}
            <a
              href={APP_SIGNUP}
              className="text-[var(--color-accent)] underline underline-offset-[3px]"
            >
              Create a developer account
            </a>{" "}
            at app.siteclinic.io.
          </p>
        </section>

        <section className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              ✓ Shipping
            </span>
            <span
              className="font-semibold text-[var(--color-ink)]"
              style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
            >
              {SHIPPING_MCP.name}
            </span>
          </div>
          <h2
            className="text-2xl tracking-tight mb-4 text-[var(--color-ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Business discovery + auditing infrastructure
          </h2>
          <p className="text-base text-[var(--color-ink-soft)] leading-relaxed mb-6">
            {SHIPPING_MCP.description}
          </p>

          <div className="mb-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-soft)] mb-3">
              Named tools
            </div>
            <ul className="space-y-2 text-sm text-[var(--color-ink-soft)]">
              {SHIPPING_MCP.tools.map((tool) => (
                <li key={tool} className="flex gap-2">
                  <span
                    className="text-[var(--color-accent)] flex-shrink-0"
                    aria-hidden="true"
                  >
                    →
                  </span>
                  <span>{tool}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-[var(--color-border)] pt-5 grid sm:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-soft)] mb-1">
                Install
              </div>
              <code
                className="text-[var(--color-ink)] text-[0.9em]"
                style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
              >
                {SHIPPING_MCP.installCommand}
              </code>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-soft)] mb-1">
                Proof
              </div>
              <span className="text-[var(--color-ink)]">
                {SHIPPING_MCP.proofResults}
              </span>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-soft)] mb-1">
                Evidence standard
              </div>
              <span className="text-[var(--color-ink-soft)]">
                {SHIPPING_MCP.evidenceStandards}
              </span>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <div className="mb-3">
            <Eyebrow>Usage</Eyebrow>
          </div>
          <h2
            className="text-2xl tracking-tight mb-4 text-[var(--color-ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Invoke tools from any MCP client
          </h2>
          <CodeBlock language="typescript" code={MCP_USAGE_SNIPPET} />
        </section>

        <section className="mb-12">
          <div className="mb-3">
            <Eyebrow>Integrations</Eyebrow>
          </div>
          <h2
            className="text-2xl tracking-tight mb-4 text-[var(--color-ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Where Site Clinic MCP runs today
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {INTEGRATION_EXAMPLES.map((ex) => (
              <div
                key={ex.platform}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5"
              >
                <div className="font-semibold text-[var(--color-ink)] mb-2">
                  {ex.platform}
                </div>
                <p className="text-xs text-[var(--color-ink-soft)] leading-relaxed mb-3">
                  <strong className="text-[var(--color-ink)]">Setup:</strong>{" "}
                  {ex.setup}
                </p>
                <p className="text-xs text-[var(--color-ink-soft)] leading-relaxed">
                  <strong className="text-[var(--color-ink)]">Benefits:</strong>{" "}
                  {ex.benefits}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <div className="mb-3">
            <Eyebrow>Roadmap</Eyebrow>
          </div>
          <h2
            className="text-2xl tracking-tight mb-4 text-[var(--color-ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            MCP servers in development
          </h2>
          <p className="text-sm text-[var(--color-ink-soft)] mb-6 max-w-2xl">
            New MCP servers ship only after their tool contracts, safety
            review, and evidence shape are ready for developer use. The two
            below are on the public roadmap.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {ROADMAP_MCP.map((m) => (
              <div
                key={m.name}
                className="rounded-xl border border-dashed border-[var(--color-border-inner)] bg-[var(--color-surface)] p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                    Coming {m.eta}
                  </span>
                </div>
                <div
                  className="font-semibold text-[var(--color-ink)] mb-2"
                  style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
                >
                  {m.name}
                </div>
                <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">
                  {m.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-7 text-center">
          <p className="text-sm text-[var(--color-ink-soft)] mb-4">
            Same API key, same billing, same evidence model as the Perfect
            Website API.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button href={APP_SIGNUP} variant="primary">
              Get an API key
            </Button>
            <Button href="/developers/docs" variant="secondary">
              ← Developer docs
            </Button>
            <Button href="/developers/api-reference" variant="text-link">
              API reference →
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
