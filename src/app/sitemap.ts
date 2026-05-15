import type { MetadataRoute } from "next";
import { SITE_CLINIC_INTENT_PAGES } from "@/lib/intentPages";
import { DEVELOPERS_DOCS } from "@/lib/developersDocsConfig";
import { listPublished, readSchedule } from "@/app/blog/schedule";

/*
 * Sitemap for siteclinic.io (marketing surface only).
 *
 * Operations / dashboard / API routes live on app.siteclinic.io
 * (site-monitor repo) and are auth-gated + noindex'd — they do NOT
 * belong here.
 *
 * Concrete routes listed explicitly. Intent pages iterated from the
 * shared config (src/lib/intentPages.ts) so adding a new intent page
 * adds it to the sitemap automatically.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://siteclinic.io";
  const now = new Date();
  const schedule = await readSchedule();
  const publishedPosts = listPublished(schedule);

  const intentPageEntries: MetadataRoute.Sitemap = SITE_CLINIC_INTENT_PAGES.map(
    (page) => ({
      url: `${base}/${page.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.82,
    }),
  );

  const developerDocEntries: MetadataRoute.Sitemap = DEVELOPERS_DOCS.map(
    (doc) => ({
      url: `${base}/developers/docs/${doc.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.78,
    }),
  );

  const blogEntries: MetadataRoute.Sitemap = [
    {
      url: `${base}/blog`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.76,
    },
    ...publishedPosts.map((entry) => ({
      url: `${base}/blog/${entry.slug}`,
      lastModified: new Date(entry.published ?? entry.target_date),
      changeFrequency: "monthly" as const,
      priority: 0.72,
    })),
  ];

  return [
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/start-here`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.92,
    },
    {
      url: `${base}/pricing`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${base}/case-studies`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${base}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/developers`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/developers/docs`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${base}/developers/docs/quickstart`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/developers/mcp`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${base}/developers/api-reference`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${base}/compare/site-clinic-vs-pingdom-vs-uptimerobot`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${base}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/accessibility`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...blogEntries,
    ...intentPageEntries,
    ...developerDocEntries,
  ];
}
