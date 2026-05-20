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

const HANDOFF_FIELDS: Array<{
  key: keyof HandoffDraft;
  label: string;
  collect: string;
}> = [
  {
    key: "ownerName",
    label: "Owner/contact",
    collect: "Name and email for the person or team who owns the next step.",
  },
  {
    key: "businessName",
    label: "Business/project",
    collect: "Business or project name the website should represent.",
  },
  {
    key: "websiteOrDomain",
    label: "Website, domain, or idea",
    collect: "Domain name, registrar status, or the working website idea.",
  },
  {
    key: "primaryGoal",
    label: "Primary goal",
    collect: "Whether the next step is build, monitor, improve traffic, prove trust, or something else.",
  },
  {
    key: "notes",
    label: "Notes or constraints",
    collect: "Known constraints such as GoDaddy DNS, launch deadline, existing repo, proof need, or accounts already created.",
  },
];

function buildHandoffPacket(
  route: (typeof ONBOARDING_ROUTES)[number] | undefined,
  draft: HandoffDraft,
) {
  if (!route) return "";

  const valueOrBlank = (value: string) => value.trim() || "[add]";
  const missingFields = HANDOFF_FIELDS.filter(({ key }) => !draft[key].trim());

  return [
    "SITE CLINIC HANDOFF PACKET",
    "",
    `Route: ${route.label}`,
    `Owner/contact: ${valueOrBlank(draft.ownerName)}`,
    `Business/project: ${valueOrBlank(draft.businessName)}`,
    `Website, domain, or idea: ${valueOrBlank(draft.websiteOrDomain)}`,
    `Primary goal: ${valueOrBlank(draft.primaryGoal)}`,
    ...(missingFields.length
      ? [
          "",
          "Missing inputs to collect next:",
          ...missingFields.map(({ label, collect }) => `- ${label}: ${collect}`),
        ]
      : []),
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
  const missingHandoffFields = useMemo(
    () => HANDOFF_FIELDS.filter(({ key }) => !handoffDraft[key].trim()),
    [handoffDraft],
  );
  const canCopyHandoffPacket = missingHandoffFields.length === 0;

  function updateHandoffField(field: keyof HandoffDraft, value: string) {
    setCopyStatus("idle");
    setHandoffDraft((current) => ({ ...current, [field]: value }));
  }

  async function copyHandoffPacket() {
    if (!canCopyHandoffPacket) {
      setCopyStatus("failed");
      return;
    }

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
                    Owner or contact <span className="text-[var(--color-accent)]">*</span>
                  </span>
                  <input
                    type="text"
                    required
                    aria-required="true"
                    value={handoffDraft.ownerName}
                    onChange={(event) => updateHandoffField("ownerName", event.target.value)}
                    placeholder="Name or team"
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)]"
                  />
                </label>

                <label className="block">
                  <span className="block text-sm font-semibold text-[var(--color-ink)] mb-1">
                    Business or project <span className="text-[var(--color-accent)]">*</span>
                  </span>
                  <input
                    type="text"
                    required
                    aria-required="true"
                    value={handoffDraft.businessName}
                    onChange={(event) => updateHandoffField("businessName", event.target.value)}
                    placeholder="Business name"
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)]"
                  />
                </label>

                <label className="block">
                  <span className="block text-sm font-semibold text-[var(--color-ink)] mb-1">
                    Website, domain, or idea <span className="text-[var(--color-accent)]">*</span>
                  </span>
                  <input
                    type="text"
                    required
                    aria-required="true"
                    value={handoffDraft.websiteOrDomain}
                    onChange={(event) => updateHandoffField("websiteOrDomain", event.target.value)}
                    placeholder="example.com, GoDaddy domain, or still choosing"
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)]"
                  />
                </label>

                <label className="block">
                  <span className="block text-sm font-semibold text-[var(--color-ink)] mb-1">
                    Primary goal <span className="text-[var(--color-accent)]">*</span>
                  </span>
                  <input
                    type="text"
                    required
                    aria-required="true"
                    value={handoffDraft.primaryGoal}
                    onChange={(event) => updateHandoffField("primaryGoal", event.target.value)}
                    placeholder="Build, monitor, improve traffic, prove trust..."
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)]"
                  />
                </label>

                <label className="block">
                  <span className="block text-sm font-semibold text-[var(--color-ink)] mb-1">
                    Notes or constraints <span className="text-[var(--color-accent)]">*</span>
                  </span>
                  <textarea
                    required
                    aria-required="true"
                    value={handoffDraft.notes}
                    onChange={(event) => updateHandoffField("notes", event.target.value)}
                    placeholder="DNS provider, existing repo, launch deadline, proof needed, accounts already created, or none..."
                    rows={4}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)]"
                  />
                </label>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <h4 className="font-semibold text-[var(--color-ink)]">
                  Handoff summary
                </h4>
                <button
                  type="button"
                  onClick={copyHandoffPacket}
                  disabled={!canCopyHandoffPacket}
                  className="rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:bg-[var(--color-ink-soft)] disabled:opacity-60"
                >
                  {canCopyHandoffPacket ? "Copy full packet" : "Complete required fields"}
                </button>
              </div>
              {!canCopyHandoffPacket ? (
                <p className="mb-3 text-xs text-[var(--color-ink-soft)]">
                  Required before copying:{" "}
                  {missingHandoffFields.map((field) => field.label).join(", ")}.
                </p>
              ) : null}
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-5">
                <dl className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)]">
                      Route
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-[var(--color-ink)]">
                      {selectedRoute.label}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)]">
                      Goal
                    </dt>
                    <dd className="mt-1 text-sm text-[var(--color-ink-soft)]">
                      {handoffDraft.primaryGoal.trim() || "Add the primary goal"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)]">
                      Owner
                    </dt>
                    <dd className="mt-1 text-sm text-[var(--color-ink-soft)]">
                      {handoffDraft.ownerName.trim() || "Add owner/contact"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)]">
                      Domain or idea
                    </dt>
                    <dd className="mt-1 text-sm text-[var(--color-ink-soft)]">
                      {handoffDraft.websiteOrDomain.trim() || "Add domain or idea"}
                    </dd>
                  </div>
                </dl>

                <div className="mt-5 border-t border-[var(--color-border)] pt-5">
                  <h5 className="text-sm font-semibold text-[var(--color-ink)] mb-2">
                    Do first
                  </h5>
                  <p className="text-sm leading-relaxed text-[var(--color-ink-soft)]">
                    {selectedRoute.firstAction}
                  </p>
                </div>

                <div className="mt-5 border-t border-[var(--color-border)] pt-5">
                  <h5 className="text-sm font-semibold text-[var(--color-ink)] mb-3">
                    Next three actions
                  </h5>
                  <ol className="space-y-2">
                    {selectedRoute.routeSteps.slice(0, 3).map((item, index) => (
                      <li
                        key={item}
                        className="grid grid-cols-[1.5rem_1fr] gap-2 text-sm text-[var(--color-ink-soft)] leading-relaxed"
                      >
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-semibold text-[var(--color-accent)]">
                          {index + 1}
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <details className="mt-4 rounded-xl border border-[var(--color-border)] bg-white p-4">
                <summary className="cursor-pointer text-sm font-semibold text-[var(--color-ink)]">
                  {canCopyHandoffPacket ? "Show full copyable packet" : "Preview packet after required fields"}
                </summary>
                <pre className="mt-4 max-h-[22rem] overflow-auto whitespace-pre-wrap rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-4 text-xs leading-relaxed text-[var(--color-ink-soft)]">
                  {handoffPacket}
                </pre>
              </details>
              <p className="mt-3 text-xs text-[var(--color-ink-soft)]" aria-live="polite">
                {copyStatus === "copied"
                  ? "Copied. This can now be pasted into Site Clinic, Codex, Claude Code, Cowork, or a developer brief."
                  : null}
                {copyStatus === "failed"
                  ? canCopyHandoffPacket
                    ? "Copy failed. Select the packet text and copy it manually."
                    : "Complete the required fields before copying the packet."
                  : null}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
