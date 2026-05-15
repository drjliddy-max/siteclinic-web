"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { Eyebrow } from "@/components/Eyebrow";
import { ONBOARDING_ROUTES } from "@/lib/clientFoundation";

export function StartHereWizard() {
  const [selectedRouteId, setSelectedRouteId] = useState(ONBOARDING_ROUTES[0]?.id ?? "");

  const selectedRoute = useMemo(
    () => ONBOARDING_ROUTES.find((route) => route.id === selectedRouteId) ?? ONBOARDING_ROUTES[0],
    [selectedRouteId],
  );

  return (
    <section
      id="guided-intake"
      className="bg-[var(--color-surface)] border-2 border-[var(--color-accent)] rounded-2xl p-6 md:p-8 mb-14 scroll-mt-8"
      aria-labelledby="guided-intake-heading"
    >
      <div className="mb-3">
        <Eyebrow withDot>Guided intake</Eyebrow>
      </div>
      <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8">
        <div>
          <h2
            id="guided-intake-heading"
            className="text-3xl tracking-tight leading-[1.1] mb-4 text-[var(--color-ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Answer the first question, then follow the right path.
          </h2>
          <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed mb-6">
            Every client should finish this step with the same practical
            readiness: account ownership, project/deploy path, DNS action,
            measurement plan, Site Clinic access boundary, and the next service
            step. The path changes; the endpoint does not.
          </p>
          <div className="space-y-3" aria-label="Choose a starting point">
            {ONBOARDING_ROUTES.map((route) => {
              const isSelected = selectedRoute?.id === route.id;
              return (
                <button
                  key={route.id}
                  type="button"
                  onClick={() => setSelectedRouteId(route.id)}
                  className={`w-full text-left rounded-xl border p-4 transition-colors ${
                    isSelected
                      ? "border-[var(--color-accent)] bg-[var(--color-bg)]"
                      : "border-[var(--color-border)] bg-white hover:bg-[var(--color-surface-hover)]"
                  }`}
                  aria-pressed={isSelected}
                >
                  <span className="block text-sm font-semibold text-[var(--color-ink)] mb-1">
                    {route.label}
                  </span>
                  <span className="block text-sm text-[var(--color-ink-soft)] leading-relaxed">
                    {route.prompt}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {selectedRoute ? (
          <article className="rounded-2xl border border-[var(--color-border-inner)] bg-white p-5 md:p-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)] mb-2">
              Recommended route
            </div>
            <h3 className="text-2xl font-semibold text-[var(--color-ink)] mb-3">
              {selectedRoute.label}
            </h3>
            <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed mb-4">
              <span className="font-semibold text-[var(--color-ink)]">
                Endpoint:
              </span>{" "}
              {selectedRoute.outcome}
            </p>
            <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed mb-6">
              <span className="font-semibold text-[var(--color-ink)]">
                First action:
              </span>{" "}
              {selectedRoute.firstAction}
            </p>

            <div className="mb-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
              <h4 className="font-semibold text-[var(--color-ink)] mb-3">
                Guided sequence
              </h4>
              <ol className="space-y-2">
                {selectedRoute.routeSteps.map((item, index) => (
                  <li
                    key={item}
                    className="grid grid-cols-[1.5rem_1fr] gap-2 text-sm text-[var(--color-ink-soft)] leading-relaxed"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-accent)] text-xs font-semibold text-white">
                      {index + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="grid md:grid-cols-2 gap-5 mb-6">
              <div>
                <h4 className="font-semibold text-[var(--color-ink)] mb-3">
                  What the client experiences
                </h4>
                <ul className="space-y-2">
                  {selectedRoute.customerExperience.map((item) => (
                    <li
                      key={item}
                      className="flex gap-2 text-sm text-[var(--color-ink-soft)] leading-relaxed"
                    >
                      <span className="text-[var(--color-accent)]" aria-hidden="true">
                        ✓
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-[var(--color-ink)] mb-3">
                  Ready means
                </h4>
                <ul className="space-y-2">
                  {selectedRoute.readiness.map((item) => (
                    <li
                      key={item}
                      className="flex gap-2 text-sm text-[var(--color-ink-soft)] leading-relaxed"
                    >
                      <span className="text-[var(--color-accent)]" aria-hidden="true">
                        ✓
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button href={selectedRoute.primaryHref} variant="primary">
                {selectedRoute.primaryCta}
              </Button>
              <Button href={selectedRoute.secondaryHref} variant="secondary">
                {selectedRoute.secondaryCta}
              </Button>
            </div>
          </article>
        ) : null}
      </div>
    </section>
  );
}
