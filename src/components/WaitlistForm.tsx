"use client";

import { useState } from "react";

/*
 * WaitlistForm — guided-setup intake form for /contact.
 *
 * Locked architecture (MIGRATION_PLAN.md §6 row 4): cross-origin POST from
 * siteclinic.io → app.siteclinic.io/api/siteclinic/waitlist (which lives
 * in site-monitor, unchanged in role).
 *
 * Same wiring pattern as CheckoutButton (iteration 3). Lower stakes — no
 * payment side effects — but the same CORS-pre-cutover limitation applies:
 *
 *   - Locally: form renders, validation works, submit POSTs.
 *   - Cross-origin POST will CORS-fail from localhost until site-monitor's
 *     CORS allowlist on /api/siteclinic/waitlist includes the consuming
 *     origin (http://localhost:3000 for dev, https://siteclinic-web.vercel.app
 *     for staging, https://siteclinic.io for post-cutover).
 *   - Phase 4a verification: deploy to staging, confirm POST returns 200,
 *     confirm row appears in site-monitor's waitlist intake destination,
 *     confirm operator receives the entry.
 *
 * Status as shipped: WIRED, NOT VERIFIED end-to-end. Page UX works; backend
 * round-trip is a Phase 4a gate alongside the Stripe coupling.
 */

const WAITLIST_API =
  process.env.NEXT_PUBLIC_SITECLINIC_WAITLIST_API ||
  "https://app.siteclinic.io/api/siteclinic/waitlist";

type State = "idle" | "submitting" | "success" | "error";

export function WaitlistForm() {
  const [state, setState] = useState<State>("idle");
  const [email, setEmail] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const emailId = "waitlist-email";
  const siteUrlId = "waitlist-site-url";
  const helperId = "waitlist-helper";
  const errorId = "waitlist-error";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("submitting");
    setError(null);
    try {
      const res = await fetch(WAITLIST_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, siteUrl: siteUrl || undefined }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || `Server returned ${res.status}`);
      }
      setState("success");
    } catch (err) {
      setError((err as Error).message);
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div
        className="max-w-md mx-auto p-6 rounded-xl border border-[var(--color-accent)] bg-[var(--color-accent)]/5 text-center"
        style={{ fontFamily: "var(--font-body)" }}
      >
        <div
          className="text-4xl mb-3 text-[var(--color-accent)]"
          aria-hidden="true"
        >
          ✓
        </div>
        <div className="font-semibold mb-2 text-[var(--color-ink)]">
          We&apos;ll reach out shortly.
        </div>
        <p className="text-sm text-[var(--color-ink-soft)]">
          We&apos;ll use the site URL you sent to help with onboarding and
          any optional data connections you want to enable.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 max-w-md mx-auto"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <div className="flex flex-col gap-2">
        <label
          htmlFor={emailId}
          className="text-sm font-medium text-[var(--color-ink)]"
        >
          Email address
        </label>
        <input
          id={emailId}
          type="email"
          name="email"
          placeholder="your@email.com"
          required
          autoComplete="email"
          disabled={state === "submitting"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-describedby={error ? errorId : helperId}
          className="px-4 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-accent)] disabled:opacity-60"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label
          htmlFor={siteUrlId}
          className="text-sm font-medium text-[var(--color-ink)]"
        >
          Site URL
        </label>
        <input
          id={siteUrlId}
          type="url"
          name="siteUrl"
          placeholder="https://yoursite.com  (optional)"
          autoComplete="url"
          disabled={state === "submitting"}
          value={siteUrl}
          onChange={(e) => setSiteUrl(e.target.value)}
          aria-describedby={helperId}
          className="px-4 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-accent)] disabled:opacity-60"
        />
      </div>
      <p id={helperId} className="text-xs text-[var(--color-ink-soft)]">
        Add the homepage URL if you want guided onboarding for a specific site.
      </p>
      <button
        type="submit"
        disabled={state === "submitting"}
        className="bg-[var(--color-accent)] text-white px-6 py-3 rounded-lg font-medium hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-60"
      >
        {state === "submitting" ? "Sending…" : "Request guided setup"}
      </button>
      {error && (
        <p
          id={errorId}
          className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2 text-left"
          aria-live="polite"
        >
          {error.toLowerCase().includes("email required") ||
          error.toLowerCase().includes("valid")
            ? "Please enter a valid email address."
            : "Something went wrong. Try again in a moment, or email hello@siteclinic.io directly."}
        </p>
      )}
    </form>
  );
}
