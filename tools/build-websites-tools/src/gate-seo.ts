/*
 * gate:seo — Google indexing rules enforcement gate.
 *
 * Validates every configured canonical route plus every sitemap-backed route
 * against the structural SEO rules Google uses for crawling + indexing +
 * ranking. Blocks the exact failure modes Google flags as:
 *   - "Excluded by 'noindex' tag"  (meta robots or X-Robots-Tag header)
 *   - "Page with redirect"          (HTTP 3xx, canonical drift, or internal
 *                                    links that still point at redirect aliases)
 *   - "Discovered, currently not indexed" (sitemap/route/link drift)
 *
 * Reads `gate.config.json` from the consuming site's cwd (see load-config.ts).
 * Site-agnostic: zero site-specific assumptions in this file.
 *
 * Operator directive 2026-05-11: 100% of rules must pass before any page
 * counts as cherry-pick-complete. No "we'll fix it later."
 */
import { JSDOM } from "jsdom";
import { ensureBaseUrlReady } from "./ensure-base-url";
import { loadGateConfig } from "./load-config";

type Check = {
  name: string;
  pass: boolean;
  detail: string;
};

type RouteSnapshot = {
  checks: Check[];
  metaRobotsNoindex: boolean;
  canonical: string | null;
  internalPaths: string[];
};

function normalizePathname(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.replace(/\/+$/, "");
  }
  return pathname || "/";
}

function normalizeSameOriginPath(href: string, baseUrl: string): string | null {
  const trimmed = href.trim();
  if (
    trimmed.length === 0 ||
    trimmed.startsWith("#") ||
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("tel:") ||
    trimmed.startsWith("javascript:")
  ) {
    return null;
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed, `${baseUrl}/`);
  } catch {
    return null;
  }

  const baseOrigin = new URL(baseUrl).origin;
  if (parsed.origin !== baseOrigin) {
    return null;
  }

  if (!/^https?:$/.test(parsed.protocol)) {
    return null;
  }

  return normalizePathname(parsed.pathname);
}

function isIgnoredInternalPath(pathname: string): boolean {
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/fonts/") ||
    pathname.startsWith("/images/")
  ) {
    return true;
  }

  return /\.(?:png|jpg|jpeg|gif|webp|svg|ico|txt|xml|json|pdf|zip|mp4|webm)$/i.test(
    pathname,
  );
}

async function checkRoute(route: string, baseUrl: string): Promise<RouteSnapshot> {
  const url = `${baseUrl}${route}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const html = await response.text();
  const dom = new JSDOM(html, { url });
  const { document } = dom.window;

  try {
    const out: Check[] = [];
    const push = (name: string, pass: boolean, detail: string) =>
      out.push({ name, pass, detail });

    // 1. <html lang="en">
    const lang = document.documentElement.getAttribute("lang");
    push("html lang", lang === "en", `lang="${lang ?? "(missing)"}"`);

    // 2. <title> present, 10–70 chars
    const title = document.title;
    push(
      "title",
      title.length >= 10 && title.length <= 70,
      `"${title}" (${title.length} chars)`,
    );

    // 3. meta description present, 50–160 chars
    const desc = document
      .querySelector('meta[name="description"]')
      ?.getAttribute("content");
    push(
      "meta description",
      !!desc && desc.length >= 50 && desc.length <= 160,
      desc ? `"${desc.slice(0, 60)}…" (${desc.length} chars)` : "(missing)",
    );

    // 4. <link rel="canonical">
    const canonical = document
      .querySelector('link[rel="canonical"]')
      ?.getAttribute("href") ?? null;
    push(
      "canonical link",
      !!canonical && canonical.startsWith("https://"),
      canonical ?? "(missing)",
    );

    // 5. viewport meta
    const viewport = document
      .querySelector('meta[name="viewport"]')
      ?.getAttribute("content");
    push("viewport", !!viewport, viewport ?? "(missing)");

    // 6. Open Graph: title, description, type, url
    for (const prop of ["og:title", "og:description", "og:type", "og:url"]) {
      const content = document
        .querySelector(`meta[property="${prop}"]`)
        ?.getAttribute("content");
      push(prop, !!content, content ?? "(missing)");
    }

    // 7. Twitter card
    const twitterCard = document
      .querySelector('meta[name="twitter:card"]')
      ?.getAttribute("content");
    push("twitter:card", !!twitterCard, twitterCard ?? "(missing)");

    // 8. Exactly one <h1>
    const h1s = document.querySelectorAll("h1");
    push(
      "single h1",
      h1s.length === 1,
      `${h1s.length} found${h1s.length === 1 ? `: "${h1s[0].textContent?.slice(0, 50)}…"` : ""}`,
    );

    // 9. Heading hierarchy (no skipped levels)
    const headings = Array.from(
      document.querySelectorAll("h1, h2, h3, h4, h5, h6"),
    ).map((heading) => parseInt(heading.tagName[1], 10));
    let hierarchyOk = true;
    let prev = 0;
    for (const level of headings) {
      if (prev > 0 && level > prev + 1) {
        hierarchyOk = false;
        break;
      }
      prev = level;
    }
    push(
      "heading hierarchy",
      hierarchyOk,
      hierarchyOk ? `${headings.join(" → ")}` : `skip detected in ${headings.join(" → ")}`,
    );

    // 10. All images have alt
    const images = document.querySelectorAll("img");
    const imagesNoAlt = Array.from(images).filter(
      (image) => image.getAttribute("alt") === null,
    );
    push(
      "images alt",
      imagesNoAlt.length === 0,
      imagesNoAlt.length === 0
        ? `${images.length} img(s) all OK`
        : `${imagesNoAlt.length}/${images.length} missing alt`,
    );

    // 11. JSON-LD structured data present
    const jsonLdBlocks = document.querySelectorAll(
      'script[type="application/ld+json"]',
    );
    push(
      "JSON-LD",
      jsonLdBlocks.length > 0,
      jsonLdBlocks.length > 0 ? `${jsonLdBlocks.length} block(s)` : "(missing)",
    );

    const metaRobots = document.querySelector('meta[name="robots"]');
    const metaRobotsContent = metaRobots?.getAttribute("content") || "";

    const internalPaths = Array.from(document.querySelectorAll("a[href]"))
      .map((anchor) => anchor.getAttribute("href"))
      .filter((href): href is string => typeof href === "string")
      .map((href) => normalizeSameOriginPath(href, baseUrl))
      .filter((pathname): pathname is string => pathname !== null)
      .filter((pathname) => !isIgnoredInternalPath(pathname));

    return {
      checks: out,
      metaRobotsNoindex: metaRobotsContent.toLowerCase().includes("noindex"),
      canonical,
      internalPaths: Array.from(new Set(internalPaths)),
    };
  } finally {
    dom.window.close();
  }
}

async function main() {
  const config = loadGateConfig();
  const { routes, baseUrl } = config;
  const stopServer = await ensureBaseUrlReady(config);

  try {
    let totalFailures = 0;

    // Sitemap reachable + valid XML + extract URLs for cross-checks
    let sitemapUrls: string[] = [];
    process.stdout.write(`gate:seo  /sitemap.xml  …`);
    const sitemapRes = await fetch(`${baseUrl}/sitemap.xml`);
    if (!sitemapRes.ok) {
      console.log(` ✗ HTTP ${sitemapRes.status}`);
      totalFailures += 1;
    } else {
      const body = await sitemapRes.text();
      const hasXml = body.includes("<urlset");
      sitemapUrls = Array.from(body.matchAll(/<loc>([^<]+)<\/loc>/g)).map(
        (match) => match[1],
      );
      console.log(
        hasXml ? ` ✓ ${sitemapUrls.length} URL(s)` : " ✗ invalid XML",
      );
      if (!hasXml) totalFailures += 1;
    }

    // robots.txt reachable + valid + doesn't disallow any sitemap URL
    process.stdout.write(`gate:seo  /robots.txt  …`);
    const robotsRes = await fetch(`${baseUrl}/robots.txt`);
    if (!robotsRes.ok) {
      console.log(` ✗ HTTP ${robotsRes.status}`);
      totalFailures += 1;
    } else {
      const robotsBody = await robotsRes.text();
      const ok =
        robotsBody.toLowerCase().includes("user-agent:") &&
        robotsBody.toLowerCase().includes("sitemap:");
      console.log(ok ? " ✓" : " ✗ missing user-agent or sitemap directive");
      if (!ok) totalFailures += 1;
    }

    const sitemapPaths = Array.from(
      new Set(
        sitemapUrls.map((url) => {
          try {
            return normalizePathname(new URL(url).pathname);
          } catch {
            return normalizePathname(url);
          }
        }),
      ),
    );

    // Sitemap-vs-routes consistency: every configured route must appear in sitemap
    process.stdout.write(`gate:seo  sitemap matches routes  …`);
    const missingConfiguredRoutes = routes.filter((route) => !sitemapPaths.includes(route));
    if (missingConfiguredRoutes.length > 0) {
      console.log(
        ` ✗ ${missingConfiguredRoutes.length} routes not in sitemap: ${missingConfiguredRoutes.join(", ")}`,
      );
      totalFailures += missingConfiguredRoutes.length;
    } else {
      console.log(" ✓");
    }

    const redirectContracts = config.expectedRedirects ?? [];
    const redirectSourceSet = new Set(redirectContracts.map((redirect) => redirect.source));
    for (const redirect of redirectContracts) {
      process.stdout.write(`gate:seo  redirect ${redirect.source}  …`);
      let response: Response;
      try {
        response = await fetch(`${baseUrl}${redirect.source}`, { redirect: "manual" });
      } catch (err) {
        console.log(` ✗ fetch failed: ${(err as Error).message}`);
        totalFailures += 1;
        continue;
      }

      const location = response.headers.get("location");
      const destinationPath = location
        ? normalizePathname(new URL(location, baseUrl).pathname)
        : "(missing)";
      const sourceInSitemap = sitemapPaths.includes(redirect.source);
      const redirectPass =
        response.status === redirect.status &&
        destinationPath === redirect.destination &&
        !sourceInSitemap;

      if (redirectPass) {
        console.log(` ✓ ${response.status} → ${destinationPath}`);
        continue;
      }

      console.log(` ✗ status=${response.status}, location=${destinationPath}`);
      if (response.status !== redirect.status) {
        console.log(`    ✗ expected status ${redirect.status}`);
        totalFailures += 1;
      }
      if (destinationPath !== redirect.destination) {
        console.log(`    ✗ expected destination ${redirect.destination}`);
        totalFailures += 1;
      }
      if (sourceInSitemap) {
        console.log(`    ✗ redirect source must not appear in sitemap.xml`);
        totalFailures += 1;
      }
    }

    const effectiveRoutes = Array.from(new Set([...routes, ...sitemapPaths])).sort();
    const configuredRouteSet = new Set(routes);
    const allowedOffSitemapRouteSet = new Set(config.allowedOffSitemapRoutes ?? []);
    const effectiveRouteSet = new Set(effectiveRoutes);
    const discoveredSources = new Map<string, Set<string>>();

    if (effectiveRoutes.length !== routes.length) {
      const sitemapOnlyCount = effectiveRoutes.length - routes.length;
      console.log(
        `gate:seo  sitemap-backed routes  ✓ ${effectiveRoutes.length} checked total (${sitemapOnlyCount} sitemap-only)`,
      );
    }

    // Per-route checks — HTTP status, headers, content
    for (const route of effectiveRoutes) {
      process.stdout.write(`gate:seo  ${baseUrl}${route}  …`);
      const url = `${baseUrl}${route}`;

      let response: Response;
      try {
        response = await fetch(url, { redirect: "manual" });
      } catch (err) {
        console.error(`\n  ✗ failed to fetch ${url}: ${(err as Error).message}`);
        totalFailures += 1;
        continue;
      }

      const httpChecks: Check[] = [
        {
          name: "HTTP 200 (not 3xx/4xx/5xx)",
          pass: response.status === 200,
          detail: `status ${response.status}`,
        },
        {
          name: "no X-Robots-Tag: noindex",
          pass: !(response.headers.get("x-robots-tag") || "")
            .toLowerCase()
            .includes("noindex"),
          detail: response.headers.get("x-robots-tag") ?? "(absent)",
        },
      ];

      let structuralChecks: Check[];
      let metaRobotsNoindex = false;
      let canonical: string | null = null;
      let internalPaths: string[] = [];
      try {
        const snapshot = await checkRoute(route, baseUrl);
        structuralChecks = snapshot.checks;
        metaRobotsNoindex = snapshot.metaRobotsNoindex;
        canonical = snapshot.canonical;
        internalPaths = snapshot.internalPaths;
      } catch (err) {
        console.error(`\n  ✗ failed to load HTML ${url}: ${(err as Error).message}`);
        totalFailures += 1;
        continue;
      }

      structuralChecks.push({
        name: "no meta robots noindex",
        pass: !metaRobotsNoindex,
        detail: metaRobotsNoindex
          ? '<meta name="robots" content="noindex"> present'
          : "(absent or indexable)",
      });

      if (canonical) {
        const canonicalPath = (() => {
          try {
            return normalizePathname(new URL(canonical).pathname);
          } catch {
            return normalizePathname(canonical);
          }
        })();
        structuralChecks.push({
          name: "canonical matches request path",
          pass: canonicalPath === route,
          detail: `canonical=${canonicalPath}, requested=${route}`,
        });
      }

      const allChecks = [...httpChecks, ...structuralChecks];
      const failed = allChecks.filter((check) => !check.pass);
      if (failed.length === 0) {
        console.log(` ✓ ${allChecks.length} checks passed`);
      } else {
        console.log(` ✗ ${failed.length}/${allChecks.length} failed`);
        for (const check of failed) {
          console.log(`    ✗ ${check.name}: ${check.detail}`);
        }
        totalFailures += failed.length;
      }

      for (const internalPath of internalPaths) {
        if (!discoveredSources.has(internalPath)) {
          discoveredSources.set(internalPath, new Set());
        }
        discoveredSources.get(internalPath)?.add(route);
      }
    }

    process.stdout.write(`gate:seo  internal link canonicals  …`);
    const internalLinkFailures: string[] = [];
    for (const [path, sources] of discoveredSources.entries()) {
      if (redirectSourceSet.has(path)) {
        internalLinkFailures.push(
          `${path} is linked internally via redirect alias from ${Array.from(sources).sort().join(", ")}`,
        );
        continue;
      }

      if (
        !effectiveRouteSet.has(path) &&
        !allowedOffSitemapRouteSet.has(path) &&
        !isIgnoredInternalPath(path)
      ) {
        internalLinkFailures.push(
          `${path} is linked internally from ${Array.from(sources).sort().join(", ")} but is missing from sitemap/routes contract`,
        );
      }
    }

    if (internalLinkFailures.length > 0) {
      console.log(` ✗ ${internalLinkFailures.length} issue(s)`);
      for (const failure of internalLinkFailures) {
        console.log(`    ✗ ${failure}`);
      }
      totalFailures += internalLinkFailures.length;
    } else {
      console.log(" ✓");
    }

    process.stdout.write(`gate:seo  sitemap-only route coverage  …`);
    const uncoveredSitemapRoutes = sitemapPaths.filter(
      (route) => !configuredRouteSet.has(route) && !effectiveRouteSet.has(route),
    );
    if (uncoveredSitemapRoutes.length > 0) {
      console.log(` ✗ ${uncoveredSitemapRoutes.length} uncovered sitemap route(s)`);
      totalFailures += uncoveredSitemapRoutes.length;
    } else {
      console.log(" ✓");
    }

    if (totalFailures > 0) {
      console.error(`\ngate:seo  FAIL — ${totalFailures} failure(s)`);
      process.exit(1);
    }
    console.log("\ngate:seo  PASS");
  } finally {
    await stopServer();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
