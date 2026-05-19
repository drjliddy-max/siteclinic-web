import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

/*
 * Pin Turbopack's workspace root to this directory.
 *
 * Next.js 16's Turbopack tries to infer the workspace root by walking up from
 * source files, which sometimes picks `src/app/` and then panics when it can't
 * resolve `next/package.json` from there. Setting `turbopack.root` explicitly
 * removes the ambiguity. The directory of this file IS the project root.
 */
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

/*
 * Legacy URL redirects — preserve GSC continuity per
 * `MIGRATION_PLAN.md` §3a.1 and memory `feedback_gsc_continuity_on_migration.md`.
 *
 * Every old `/welcome/<path>` that has a new apex equivalent gets a 301
 * here AS its cherry-pick lands. Iteration 1 lands `/`, so `/welcome` →
 * `/` is the first redirect. Subsequent iterations add `/welcome/about
 * → /about`, `/welcome/pricing → /pricing`, etc.
 *
 * Next.js compiles these into Vercel-native redirect rules at build
 * time, so they apply both in `next dev` and in production.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: projectRoot,
  },
  async redirects() {
    return [
      // Keep legacy dashboard-style URLs on the public website instead of
      // sending the Site Clinic marketing domain to the monitor app.
      {
        source: "/sc/:slug",
        destination: "/",
        permanent: false,
      },
      // Legacy /welcome homepage → new apex homepage (§5b iteration 1)
      {
        source: "/welcome",
        destination: "/",
        permanent: true,
      },
      {
        source: "/welcome/",
        destination: "/",
        permanent: true,
      },
      // Legacy /welcome/about → new apex /about (§5b iteration 2)
      {
        source: "/welcome/about",
        destination: "/about",
        permanent: true,
      },
      // Legacy /welcome/pricing → new apex /pricing (§5b iteration 3)
      {
        source: "/welcome/pricing",
        destination: "/pricing",
        permanent: true,
      },
      // Defensive: /case-studies was already at apex in site-monitor, but the
      // legacy /welcome nav internally linked to it via /welcome/case-studies
      // patterns in some flows. Redirect catches any stale internal-link references.
      // (§5b iteration 4)
      {
        source: "/welcome/case-studies",
        destination: "/case-studies",
        permanent: true,
      },
      // Legacy /welcome/contact → new apex /contact (§5b iteration 6)
      {
        source: "/welcome/contact",
        destination: "/contact",
        permanent: true,
      },
      // Defensive: /developers was at apex in source already; redirect catches
      // any internal /welcome/developers references in stale code paths.
      // (§5b iteration 7)
      {
        source: "/welcome/developers",
        destination: "/developers",
        permanent: true,
      },
      // Defensive: /developers/docs + /developers/docs/quickstart (§5b iteration 8)
      {
        source: "/welcome/developers/docs",
        destination: "/developers/docs",
        permanent: true,
      },
      {
        source: "/welcome/developers/docs/quickstart",
        destination: "/developers/docs/quickstart",
        permanent: true,
      },
      // /developers/mcp (§5b iteration 9)
      {
        source: "/welcome/developers/mcp",
        destination: "/developers/mcp",
        permanent: true,
      },
      // /developers/api-reference (§5b iteration 10) — was a [slug] route case
      // in source (/developers/[slug] with slug="api-reference"); materialized
      // as a concrete static route here. Defensive redirect for any /welcome/
      // pattern + the bare /developers/api-reference path already serves.
      {
        source: "/welcome/developers/api-reference",
        destination: "/developers/api-reference",
        permanent: true,
      },
      // /compare/site-clinic-vs-pingdom-vs-uptimerobot (§5b iteration 11)
      // URL pattern in source was /welcome/compare/... — apex per locked §6.
      {
        source: "/welcome/compare/site-clinic-vs-pingdom-vs-uptimerobot",
        destination: "/compare/site-clinic-vs-pingdom-vs-uptimerobot",
        permanent: true,
      },
      // Legal trio (§5b iteration 5) — legacy /welcome/<legal> → new apex /<legal>
      {
        source: "/welcome/privacy",
        destination: "/privacy",
        permanent: true,
      },
      {
        source: "/welcome/terms",
        destination: "/terms",
        permanent: true,
      },
      {
        source: "/welcome/accessibility",
        destination: "/accessibility",
        permanent: true,
      },
      // 4 intent pages (§5b iteration 12) — /welcome/<slug> → /<slug>
      // Hardcoded here (Next.js redirects are static config and can't iterate
      // SITE_CLINIC_INTENT_PAGES). Adding a 5th intent page requires:
      //   1. Append entry to src/lib/intentPages.ts
      //   2. Add /welcome/<new-slug> → /<new-slug> redirect HERE
      //   3. Add /<new-slug> route to gate.config.json
      // Sitemap auto-iterates the config; the dynamic [slug] route auto-renders.
      {
        source: "/welcome/ai-visibility-monitoring-tool",
        destination: "/ai-visibility-monitoring-tool",
        permanent: true,
      },
      {
        source: "/welcome/ai-citation-tracking-for-websites",
        destination: "/ai-citation-tracking-for-websites",
        permanent: true,
      },
      {
        source: "/welcome/track-ai-crawler-hits-to-my-website",
        destination: "/track-ai-crawler-hits-to-my-website",
        permanent: true,
      },
      {
        source: "/welcome/website-monitoring-with-seo-and-accessibility",
        destination: "/website-monitoring-with-seo-and-accessibility",
        permanent: true,
      },
      // 5 dev sub-docs (§5b iteration 13) — /welcome/developers/docs/<slug>
      // → /developers/docs/<slug>. Hardcoded per slug (Next redirects can't
      // iterate DEVELOPERS_DOCS_SLUGS). New sub-doc requires (1) append to
      // src/lib/developersDocsConfig.ts, (2) add redirect HERE, (3) add to
      // gate.config.json. Sitemap iterates the config; route auto-renders.
      {
        source: "/welcome/developers/docs/authentication",
        destination: "/developers/docs/authentication",
        permanent: true,
      },
      {
        source: "/welcome/developers/docs/rate-limits",
        destination: "/developers/docs/rate-limits",
        permanent: true,
      },
      {
        source: "/welcome/developers/docs/error-handling",
        destination: "/developers/docs/error-handling",
        permanent: true,
      },
      {
        source: "/welcome/developers/docs/webhooks",
        destination: "/developers/docs/webhooks",
        permanent: true,
      },
      {
        source: "/welcome/developers/docs/examples",
        destination: "/developers/docs/examples",
        permanent: true,
      },
      // ───────────────────────────────────────────────────────────────────
      // §5b iteration 14 — redirect normalization for legacy
      // /developers/[slug] surface (community, examples, pricing, sdks,
      // support, status). Source had a dynamic [slug] route handling all 7
      // (incl. api-reference which we materialized concretely in iter 10).
      //
      // Per operator decision matrix 2026-05-12:
      //   - 5 redirected to working canonical destinations (below)
      //   - /developers/status → DROPPED, no route, no redirect
      //     → naturally 404s in Next.js (no dynamic [slug] under /developers/)
      //     Doctrine: don't redirect to Vercel status (that's platform, not
      //     Site Clinic API status). Don't invent a status page either.
      //
      // These 5 redirects are NOT in sitemap.xml — they're aliases, not
      // canonical pages. gate.config.json also unchanged (gates test
      // canonical routes only).
      // ───────────────────────────────────────────────────────────────────
      {
        source: "/developers/examples",
        destination: "/developers/docs/examples",
        permanent: true,
      },
      {
        source: "/developers/support",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/developers/sdks",
        destination: "/developers/docs/examples",
        permanent: true,
      },
      {
        source: "/developers/pricing",
        destination: "/pricing",
        permanent: true,
      },
      {
        source: "/developers/community",
        destination: "/contact",
        permanent: true,
      },
      // /welcome/ prefix variants for defensive coverage (in case any old
      // links used the /welcome/developers/<slug> pattern)
      {
        source: "/welcome/developers/examples",
        destination: "/developers/docs/examples",
        permanent: true,
      },
      {
        source: "/welcome/developers/support",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/welcome/developers/sdks",
        destination: "/developers/docs/examples",
        permanent: true,
      },
      {
        source: "/welcome/developers/pricing",
        destination: "/pricing",
        permanent: true,
      },
      {
        source: "/welcome/developers/community",
        destination: "/contact",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
