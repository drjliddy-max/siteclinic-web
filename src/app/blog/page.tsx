import type { Metadata } from "next";
import Link from "next/link";
import { listPublished, readSchedule } from "./schedule";

const SITE_BASE = "https://siteclinic.io";

export const metadata: Metadata = {
  title: "Articles — Site Clinic",
  description:
    "Platform notes on website monitoring, SEO drift, accessibility drift, and the operations layer that closes the loop after a monitor fires.",
  alternates: { canonical: `${SITE_BASE}/blog` },
  openGraph: {
    title: "Articles — Site Clinic",
    description:
      "Platform notes on website monitoring, SEO drift, accessibility drift, and the operations layer that closes the loop after a monitor fires.",
    url: `${SITE_BASE}/blog`,
    type: "website",
    siteName: "Site Clinic",
  },
};

export default async function BlogIndexPage() {
  const schedule = await readSchedule();
  const published = listPublished(schedule);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-12">
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-accent)]">Site Clinic</p>
        <h1 className="mt-2 font-[var(--font-display)] text-4xl tracking-tight text-[var(--color-ink)]">
          Articles
        </h1>
        <p className="mt-4 text-lg text-[var(--color-ink-soft)]">
          Notes on website operations: what monitoring tools miss, how SEO and accessibility drift,
          and what it takes to close the loop after an alert fires.
        </p>
      </header>

      {published.length === 0 ? (
        <p className="text-[var(--color-ink-soft)]">
          The first post is in queue. Check back shortly, or visit the{" "}
          <Link href="/developers" className="text-[var(--color-accent)] underline">
            developers page
          </Link>{" "}
          in the meantime.
        </p>
      ) : (
        <ul className="space-y-8">
          {published.map((entry) => (
            <li key={entry.slug} className="border-b border-[var(--color-border)] pb-8 last:border-b-0">
              <article>
                <h2 className="font-[var(--font-display)] text-2xl tracking-tight text-[var(--color-ink)]">
                  <Link href={`/blog/${entry.slug}`} className="hover:text-[var(--color-accent)]">
                    {entry.title}
                  </Link>
                </h2>
                {entry.published ? (
                  <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
                    <time dateTime={entry.published}>{entry.published}</time>
                  </p>
                ) : null}
                {entry.cluster ? (
                  <p className="mt-2 text-xs uppercase tracking-[0.16em] text-[var(--color-ink-soft)]">
                    {entry.cluster}
                  </p>
                ) : null}
              </article>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
