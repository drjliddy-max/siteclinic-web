import type { MetadataRoute } from "next";

/*
 * robots.txt for siteclinic.io.
 *
 * Marketing surface: indexable. API routes (none here) and OpenGraph
 * image generators would be disallowed if they existed.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://siteclinic.io/sitemap.xml",
    host: "https://siteclinic.io",
  };
}
