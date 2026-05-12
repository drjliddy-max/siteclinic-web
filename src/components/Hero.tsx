import { Eyebrow } from "./Eyebrow";
import { Button } from "./Button";

/*
 * Hero — homepage hero section.
 *
 * Cherry-picked from site-monitor/src/app/welcome/page.tsx:200-247
 * (the "Visibility management for…" block) with these structural changes:
 *
 *   1. Inline `bg-[#FAF7F2]` / `text-[#3D7468]` arbitrary classes replaced
 *      by tokenized utilities reading from globals.css @theme block.
 *   2. Inline `style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}`
 *      replaced by var(--font-display), which next/font/google guarantees
 *      is actually loaded (no silent Georgia fallback).
 *   3. Italic accent line on "small-business websites." per docs/design/
 *      DESIGN_THESIS.md "one italic emphasis line per hero/h2" rule.
 *   4. CTAs route to /pricing (next cherry-pick) and /case-studies
 *      (subsequent cherry-pick). They 404 at staging until those pages
 *      land — expected interim state; not deployed to production until
 *      all routes pass gate:all.
 *
 * Content preserved verbatim from PROJECT_BRIEF.md §8 approved claims.
 */

const FEATURES = [
  "Nightly checks across accessibility, links, performance, SEO, headers, and mechanical drift.",
  "Connected visibility context when GA4, Search Console, and other sources are available.",
  "One system for proof: what changed, what improved, and what to do next.",
] as const;

export function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-16 pb-20">
      <div className="max-w-4xl">
        <div className="mb-5">
          <Eyebrow withDot>Monitor. Decide. Improve. Verify.</Eyebrow>
        </div>

        <h1
          className="text-5xl md:text-6xl tracking-tight leading-[1.05] mb-6 text-[var(--color-ink)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Visibility management for
          <br />
          <em
            className="text-[var(--color-accent)]"
            style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
          >
            small-business websites.
          </em>
        </h1>

        <p
          className="text-xl text-[var(--color-ink-soft)] leading-relaxed mb-8 max-w-3xl"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Site Clinic is not just a nightly monitor. It is the operating
          layer for technical health, accessibility, search visibility, AI
          retrieval readiness, and the next actions that actually move a
          website forward.
        </p>

        <div className="grid sm:grid-cols-3 gap-3 mb-8 max-w-4xl">
          {FEATURES.map((item) => (
            <div
              key={item}
              className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 text-sm text-[var(--color-ink-soft)] leading-relaxed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {item}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <Button href="/pricing" variant="primary">
            Start free trial
          </Button>
          <Button href="/case-studies" variant="secondary">
            See the proof
          </Button>
        </div>

        <p
          className="mt-6 text-sm text-[var(--color-ink-soft)] max-w-3xl"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Every plan starts with a 14-day free trial. Cancel during the trial
          and you pay nothing. Claims stay inside the evidence we can actually
          show.
        </p>
      </div>
    </section>
  );
}
