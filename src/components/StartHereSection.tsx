import { Button } from "@/components/Button";
import { Eyebrow } from "@/components/Eyebrow";
import { FOUNDATION_PATHS } from "@/lib/clientFoundation";

export function StartHereSection() {
  return (
    <section
      id="start-here"
      className="max-w-6xl mx-auto px-6 pb-20"
      aria-labelledby="start-here-heading"
    >
      <div className="border-t border-[var(--color-border)] pt-16">
        <div className="max-w-3xl mb-8">
          <div className="mb-3">
            <Eyebrow>Start here</Eyebrow>
          </div>
          <h2
            id="start-here-heading"
            className="text-3xl md:text-4xl tracking-tight leading-[1.08] mb-4 text-[var(--color-ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Different starting points.{" "}
            <em
              className="text-[var(--color-accent)]"
              style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
            >
              One prepared endpoint.
            </em>
          </h2>
          <p
            className="text-base text-[var(--color-ink-soft)] leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Site Clinic first gets you to the same foundation: the site,
            account, project, deployment path, measurement hooks, and proof
            expectations are clear. Then monitoring, Web Builder, API/MCP, or
            proof review can begin without guessing.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-4">
          {FOUNDATION_PATHS.map((path) => (
            <article
              key={path.id}
              className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 flex flex-col"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)] mb-2">
                {path.question}
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-ink)] mb-3">
                {path.answer}
              </h3>
              <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed mb-4">
                {path.bestFor}
              </p>
              <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed mb-5">
                <span className="font-semibold text-[var(--color-ink)]">
                  End point:
                </span>{" "}
                {path.endpoint}
              </p>
              <div className="mt-auto">
                <Button href={path.href} variant="text-link">
                  Follow this path →
                </Button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3 items-center">
          <Button href="/start-here" variant="primary">
            Open the full foundation guide
          </Button>
          <Button href="/pricing" variant="secondary">
            I already have a site
          </Button>
        </div>
      </div>
    </section>
  );
}
