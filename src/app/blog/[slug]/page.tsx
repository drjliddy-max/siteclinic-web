import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isPublished, readDraft, readSchedule } from "../schedule";
import { markdownToHtml, parseFrontMatter } from "../markdown";
import { PUBLIC_LIVE_DASHBOARD_URL } from "@/lib/publicLinks";

const SITE_BASE = "https://siteclinic.io";
const AUTHOR_NAME = "John Liddy";
const BRAND_NAME = "Site Clinic";
const MAX_TITLE_LENGTH = 70;
const MAX_DESCRIPTION_LENGTH = 160;

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

function trimMetadataText(value: string, maxLength: number): string {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
}

function buildMetadataTitle(title: string): string {
  const brandedTitle = `${title} — ${BRAND_NAME}`;
  if (brandedTitle.length <= MAX_TITLE_LENGTH) {
    return brandedTitle;
  }

  return trimMetadataText(title, MAX_TITLE_LENGTH);
}

async function loadPost(slug: string) {
  const [schedule, draftSource] = await Promise.all([readSchedule(), readDraft(slug)]);
  const publishedEntry = isPublished(schedule, slug);
  if (!publishedEntry || !draftSource) {
    return null;
  }
  const draft = parseFrontMatter(draftSource);
  return { entry: publishedEntry, draft };
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await loadPost(slug);
  if (!post) {
    return { title: "Article not found — Site Clinic" };
  }
  const description = trimMetadataText(
    post.draft.attributes.excerpt ||
      post.draft.body.split(/\n\s*\n/)[0]?.trim() ||
      `${post.entry.title} — Site Clinic`,
    MAX_DESCRIPTION_LENGTH,
  );
  const metadataTitle = buildMetadataTitle(post.entry.title);

  return {
    title: metadataTitle,
    description,
    alternates: { canonical: `${SITE_BASE}/blog/${slug}` },
    openGraph: {
      title: post.entry.title,
      description,
      url: `${SITE_BASE}/blog/${slug}`,
      type: "article",
      siteName: BRAND_NAME,
      ...(post.draft.attributes.image_url
        ? {
          images: [
            {
              url: post.draft.attributes.image_url,
              alt: post.draft.attributes.image_alt || post.entry.title,
            },
          ],
        }
        : {}),
    },
  };
}

export default async function BlogPostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await loadPost(slug);
  if (!post) {
    notFound();
  }

  const { entry, draft } = post;
  const description =
    draft.attributes.excerpt ||
    draft.body.split(/\n\s*\n/)[0]?.trim() ||
    entry.title;
  const publishedDate = entry.published ?? entry.target_date;
  const bodyHtml = markdownToHtml(draft.body);
  const imageUrl = draft.attributes.image_url || null;
  const imageAlt = draft.attributes.image_alt || entry.title;
  const imageSource = draft.attributes.image_source || null;
  const imageLicense = draft.attributes.image_license || null;

  const ldJson = {
    "@context": "https://schema.org",
    "@type": draft.attributes.schema === "TechArticle" ? "TechArticle" : "Article",
    headline: entry.title,
    description,
    ...(imageUrl ? { image: [imageUrl] } : {}),
    author: {
      "@type": "Person",
      name: draft.attributes.author || AUTHOR_NAME,
      url: `${SITE_BASE}/about`,
    },
    publisher: {
      "@type": "Organization",
      name: BRAND_NAME,
      url: SITE_BASE,
    },
    datePublished: publishedDate,
    dateModified: publishedDate,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_BASE}/blog/${slug}`,
    },
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(ldJson).replace(/</g, "\\u003c"),
        }}
      />
      <p className="text-sm">
        <Link href="/blog" className="text-[var(--color-accent)] hover:underline">
          ← All articles
        </Link>
      </p>
      <header className="mt-6 mb-10">
        <h1 className="font-[var(--font-display)] text-4xl tracking-tight text-[var(--color-ink)]">
          {entry.title}
        </h1>
        <p className="mt-3 text-sm text-[var(--color-ink-soft)]">
          {draft.attributes.author || AUTHOR_NAME}
          {" · "}
          <time dateTime={publishedDate}>{publishedDate}</time>
        </p>
      </header>
      {imageUrl ? (
        <figure className="mb-10 overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={imageAlt}
            className="h-auto w-full object-cover"
          />
          {(imageSource || imageLicense) ? (
            <figcaption className="px-4 py-3 text-xs text-[var(--color-ink-soft)]">
              {[imageSource, imageLicense].filter(Boolean).join(" · ")}
            </figcaption>
          ) : null}
        </figure>
      ) : null}
      <article
        className="prose prose-neutral max-w-none [&_h2]:mt-12 [&_h2]:font-[var(--font-display)] [&_h2]:text-2xl [&_h2]:text-[var(--color-ink)] [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-[var(--color-ink)] [&_p]:mt-4 [&_p]:leading-7 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mt-1 [&_a]:text-[var(--color-accent)] [&_a]:underline [&_blockquote]:mt-6 [&_blockquote]:border-l-4 [&_blockquote]:border-[var(--color-border-inner)] [&_blockquote]:pl-4 [&_blockquote]:italic [&_strong]:font-semibold"
        dangerouslySetInnerHTML={{ __html: bodyHtml }}
      />
      <aside className="mt-16 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-[var(--color-ink)]">
        <h3 className="text-lg font-semibold text-[var(--color-ink)]">See it on a real site</h3>
        <p className="mt-2 text-[var(--color-ink-soft)]">
          The operations layer is easier to understand when you can see one running. Browse the
          developers page for the API and MCP server, or look at a live customer dashboard preview.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/developers"
            className="inline-flex items-center rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)]"
          >
            Developers
          </Link>
          <Link
            href={PUBLIC_LIVE_DASHBOARD_URL}
            className="inline-flex items-center rounded-full border border-[var(--color-border-inner)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-ink)] hover:bg-[var(--color-surface-hover)]"
          >
            View a live preview
          </Link>
        </div>
      </aside>
    </main>
  );
}
