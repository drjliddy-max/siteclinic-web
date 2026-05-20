"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { Eyebrow } from "@/components/Eyebrow";
import { ONBOARDING_ROUTES } from "@/lib/clientFoundation";

type HandoffDraft = {
  ownerName: string;
  businessName: string;
  websiteOrDomain: string;
  primaryGoal: string;
  notes: string;
};

const EMPTY_HANDOFF: HandoffDraft = {
  ownerName: "",
  businessName: "",
  websiteOrDomain: "",
  primaryGoal: "",
  notes: "",
};

function buildHandoffPacket(
  route: (typeof ONBOARDING_ROUTES)[number] | undefined,
  draft: HandoffDraft,
) {
  if (!route) return "";

  const valueOrBlank = (value: string) => value.trim() || "[add]";

  return [
    "SITE CLINIC HANDOFF PACKET",
    "",
    `Route: ${route.label}`,
    `Owner/contact: ${valueOrBlank(draft.ownerName)}`,
    `Business/project: ${valueOrBlank(draft.businessName)}`,
    `Website, domain, or idea: ${valueOrBlank(draft.websiteOrDomain)}`,
    `Primary goal: ${valueOrBlank(draft.primaryGoal)}`,
    "",
    "Recommended endpoint:",
    route.outcome,
    "",
    "First action:",
    route.firstAction,
    "",
    "Guided sequence:",
    ...route.routeSteps.map((step, index) => `${index + 1}. ${step}`),
    "",
    "Ready means:",
    ...route.readiness.map((item) => `- ${item}`),
    "",
    "Commercial boundary:",
    "- Public setup docs, prompts, and education are free.",
    "- The 30-day trial starts recurring Site Clinic monitoring.",
    "- API, MCP, scheduler, Blog Writer, connected-data operations, managed proofs, and optimization loops require entitlement.",
    "- Customer-owned domains, repos, delivered public pages, exported files, and downloaded reports are not clawed back.",
    "",
    "Notes:",
    valueOrBlank(draft.notes),
  ].join("\n");
}

export function StartHereWizard() {
  const [selectedRouteId, setSelectedRouteId] = useState(ONBOARDING_ROUTES[0]?.id ?? "");
  const [handoffDraft, setHandoffDraft] = useState<HandoffDraft>(EMPTY_HANDOFF);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");

  const selectedRoute = useMemo(
    () => ONBOARDING_ROUTES.find((route) => route.id === selectedRouteId) ?? ONBOARDING_ROUTES[0],
    [selectedRouteId],
  );

  const handoffPacket = useMemo(
    () => buildHandoffPacket(selectedRoute, handoffDraft),
    [selectedRoute, handoffDraft],
  );

  function updateHandoffField(field: keyof HandoffDraft, value: string) {
    setCopyStatus("idle");
    setHandoffDraft((current) => ({ ...current, [field]: value }));
  }

  async function copyHandoffPacket() {
    try {
      await navigator.clipboard.writeText(handoffPacket);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("failed");
    }
  }

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
            Pick the sentence that sounds most like you. The page will turn it
            into a practical handoff: what to prepare, what Site Clinic can do,
            what stays yours, and the next step after this page.
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
                Where this path ends:
              </span>{" "}
              {selectedRoute.outcome}
            </p>
            <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed mb-6">
              <span className="font-semibold text-[var(--color-ink)]">
                Do first:
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
                  What happens next
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
                  You are ready when
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

      {selectedRoute ? (
        <div className="mt-8 rounded-2xl border border-[var(--color-border-inner)] bg-white p-5 md:p-6">
          <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-6">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)] mb-2">
                Handoff packet
              </div>
              <h3 className="text-2xl font-semibold text-[var(--color-ink)] mb-3">
                Leave with the next step written down.
              </h3>
              <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed mb-5">
                Add the minimum details needed for Site Clinic, Codex, Claude
                Code, Cowork, or a developer to continue from the same truth.
                This does not create an account or start billing.
              </p>

              <div className="space-y-4">
                <label className="block">
                  <span className="block text-sm font-semibold text-[var(--color-ink)] mb-1">
                    Owner or contact
                  </span>
                  <input
                    type="text"
                    value={handoffDraft.ownerName}
                    onChange={(event) => updateHandoffField("ownerName", event.target.value)}
                    placeholder="Name or team"
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)]"
                  />
                </label>

                <label className="block">
                  <span className="block text-sm font-semibold text-[var(--color-ink)] mb-1">
                    Business or project
                  </span>
                  <input
                    type="text"
                    value={handoffDraft.businessName}
                    onChange={(event) => updateHandoffField("businessName", event.target.value)}
                    placeholder="Business name"
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)]"
                  />
                </label>

                <label className="block">
                  <span className="block text-sm font-semibold text-[var(--color-ink)] mb-1">
                    Website, domain, or idea
                  </span>
                  <input
                    type="text"
                    value={handoffDraft.websiteOrDomain}
                    onChange={(event) => updateHandoffField("websiteOrDomain", event.target.value)}
                    placeholder="example.com, GoDaddy domain, or still choosing"
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)]"
                  />
                </label>

                <label className="block">
                  <span className="block text-sm font-semibold text-[var(--color-ink)] mb-1">
                    Primary goal
                  </span>
                  <input
                    type="text"
                    value={handoffDraft.primaryGoal}
                    onChange={(event) => updateHandoffField("primaryGoal", event.target.value)}
                    placeholder="Build, monitor, improve traffic, prove trust..."
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)]"
                  />
                </label>

                <label className="block">
                  <span className="block text-sm font-semibold text-[var(--color-ink)] mb-1">
                    Notes or constraints
                  </span>
                  <textarea
                    value={handoffDraft.notes}
                    onChange={(event) => updateHandoffField("notes", event.target.value)}
                    placeholder="DNS provider, existing repo, launch deadline, proof needed, accounts already created..."
                    rows={4}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)]"
                  />
                </label>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <h4 className="font-semibold text-[var(--color-ink)]">
                  Generated packet
                </h4>
                <button
                  type="button"
                  onClick={copyHandoffPacket}
                  className="rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                >
                  Copy packet
                </button>
              </div>
              <pre className="min-h-[26rem] flex-1 whitespace-pre-wrap rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4 text-xs leading-relaxed text-[var(--color-ink-soft)]">
                {handoffPacket}
              </pre>
              <p className="mt-3 text-xs text-[var(--color-ink-soft)]" aria-live="polite">
                {copyStatus === "copied"
                  ? "Copied. This can now be pasted into Site Clinic, Codex, Claude Code, Cowork, or a developer brief."
                  : null}
                {copyStatus === "failed"
                  ? "Copy failed. Select the packet text and copy it manually."
                  : null}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
