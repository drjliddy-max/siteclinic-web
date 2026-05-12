import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocPageLayout } from "@/components/DocPageLayout";
import {
  DEVELOPERS_DOCS_MAP,
  DEVELOPERS_DOCS_SLUGS,
} from "@/lib/developersDocsConfig";

/*
 * /developers/docs/[slug] — 5 dev sub-doc routes via dynamic [slug] +
 * config + DocPageLayout extraction. §5b iteration 13.
 *
 * Concrete route /developers/docs/quickstart (iter 8) takes precedence
 * over this dynamic match per Next.js routing. This handler renders only
 * the 5 slugs declared in DEVELOPERS_DOCS_SLUGS:
 *   authentication, rate-limits, error-handling, webhooks, examples
 *
 * Unknown slug → notFound() (HTTP 404). Same pattern as /[slug] for intent
 * pages (iter 12).
 */

export function generateStaticParams() {
  return DEVELOPERS_DOCS_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = DEVELOPERS_DOCS_MAP[slug];
  if (!doc) return {};

  const canonical = `https://siteclinic.io/developers/docs/${slug}`;
  return {
    title: doc.title,
    description: doc.description,
    alternates: { canonical },
    openGraph: {
      title: doc.title,
      description: doc.description,
      url: canonical,
      siteName: "Site Clinic",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: doc.title,
      description: doc.description,
    },
  };
}

export default async function DeveloperDocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = DEVELOPERS_DOCS_MAP[slug];
  if (!doc) notFound();

  const canonical = `https://siteclinic.io/developers/docs/${slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "@id": `${canonical}#article`,
    url: canonical,
    headline: doc.title,
    description: doc.description,
    inLanguage: "en-US",
    isPartOf: { "@id": "https://siteclinic.io/#website" },
    about: { "@id": "https://siteclinic.io/#org" },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Developers",
          item: "https://siteclinic.io/developers",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Documentation",
          item: "https://siteclinic.io/developers/docs",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: doc.cardTitle,
          item: canonical,
        },
      ],
    },
  };

  return <DocPageLayout doc={doc} jsonLd={jsonLd} />;
}
