"use client";

import { useState } from "react";
import { VARIANT_CLASS, type ButtonVariant } from "./Button";

/*
 * CheckoutButton — Stripe checkout entry point for siteclinic.io's pricing tiers.
 *
 * Locked architecture (MIGRATION_PLAN.md §6 row 4): cross-origin call from
 * siteclinic.io marketing surface → app.siteclinic.io/api/siteclinic/checkout
 * (which lives in site-monitor, unchanged in role).
 *
 * The endpoint behavior (unchanged from current production):
 *   1. Receive { tier, email, siteUrl } from this button's form
 *   2. Create a Stripe Checkout session for the selected tier's price
 *   3. Return { url: stripe_checkout_session_url }
 *   4. This component redirects the browser to Stripe Checkout
 *   5. After successful payment, Stripe webhook (in site-monitor) fires:
 *        - Provisions the customer account
 *        - Attaches the submitted siteUrl as the customer's first site
 *        - Sends welcome email (Stripe + Site Clinic)
 *        - Customer lands at the dashboard (app.siteclinic.io/c/<slug>)
 *
 * The "deliverables" the customer pays $49/$149/$349 for are all produced
 * by the EXISTING site-monitor backend. This component is just the entry
 * door from the new marketing repo.
 *
 * Environment configuration:
 *   NEXT_PUBLIC_SITECLINIC_CHECKOUT_API overrides the default. Set this in
 *   .env.local for local dev to point at whichever endpoint you want to
 *   test against (today's production https://siteclinic.io/api/siteclinic/checkout,
 *   or a locally-running site-monitor with CORS allowing localhost).
 *
 * Verification scope:
 *   - Local dev: page renders, form opens/closes, validation works locally.
 *     The actual POST will CORS-fail from localhost without site-monitor
 *     adding `http://localhost:3000` to its allowed origins.
 *   - Phase 4a staging: deploy siteclinic-web to its Vercel preview,
 *     verify real Stripe round-trip against app.siteclinic.io's endpoint
 *     (which requires site-monitor's CORS allowlist to include the staging
 *     and production origins for siteclinic-web). Test mode Stripe keys
 *     only — no real charges until Phase 4b cutover.
 */

type Tier = "basic" | "pro" | "agency";

const CHECKOUT_API =
  process.env.NEXT_PUBLIC_SITECLINIC_CHECKOUT_API ||
  "https://app.siteclinic.io/api/siteclinic/checkout";

type CheckoutButtonProps = {
  tier: Tier;
  label?: string;
  variant?: Exclude<ButtonVariant, "text-link">; // text-link can't host stateful form
  className?: string;
};

export function CheckoutButton({
  tier,
  label = "Start 30-day trial",
  variant = "primary",
  className = "",
}: CheckoutButtonProps) {
  const [email, setEmail] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailId = `checkout-email-${tier}`;
  const siteUrlId = `checkout-site-${tier}`;
  const helperId = `checkout-helper-${tier}`;
  const errorId = `checkout-error-${tier}`;

  function normalizeSiteUrl(input: string): string {
    const trimmed = input.trim();
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const parsed = new URL(withProtocol);
    return `${parsed.protocol}//${parsed.host}`;
  }

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const normalizedSiteUrl = normalizeSiteUrl(siteUrl);
      const res = await fetch(CHECKOUT_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, email, siteUrl: normalizedSiteUrl }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || `Server returned ${res.status}`);
      }
      const data = (await res.json()) as { url: string };
      window.location.href = data.url;
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  }

  if (isOpen) {
    return (
      <form
        onSubmit={handleCheckout}
        className="flex flex-col gap-2 mt-2"
        style={{ fontFamily: "var(--font-body)" }}
      >
        <label
          htmlFor={emailId}
          className="text-sm font-medium text-[var(--color-ink)]"
        >
          Email address
        </label>
        <input
          id={emailId}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          autoComplete="email"
          autoFocus
          disabled={loading}
          aria-describedby={error ? `${helperId} ${errorId}` : helperId}
          className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-ink)] text-sm focus:outline-none focus:border-[var(--color-accent)] disabled:opacity-60"
        />
        <label
          htmlFor={siteUrlId}
          className="text-sm font-medium text-[var(--color-ink)]"
        >
          {tier === "agency" ? "Primary site URL" : "Website URL"}
        </label>
        <input
          id={siteUrlId}
          type="text"
          name="siteUrl"
          value={siteUrl}
          onChange={(e) => setSiteUrl(e.target.value)}
          placeholder={
            tier === "agency"
              ? "Primary site URL (for example, clientsite.com)"
              : "Website URL (for example, yoursite.com)"
          }
          required
          autoComplete="url"
          inputMode="url"
          disabled={loading}
          aria-describedby={helperId}
          className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-ink)] text-sm focus:outline-none focus:border-[var(--color-accent)] disabled:opacity-60"
        />
        <p
          id={helperId}
          className="text-xs text-[var(--color-ink-soft)]"
        >
          {tier === "agency"
            ? "We will provision your dashboard around this first site, then you can add the rest inside the account."
            : "We will attach this site to your dashboard automatically after checkout."}
        </p>
        <button
          type="submit"
          disabled={loading}
          className="bg-[var(--color-accent)] text-white py-2.5 rounded-lg font-medium text-sm hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-60"
        >
          {loading ? "Opening secure checkout…" : "Continue to secure checkout →"}
        </button>
        {error && (
          <p
            id={errorId}
            className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-md px-2 py-1.5"
            aria-live="polite"
          >
            {error}
          </p>
        )}
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
            setError(null);
          }}
          disabled={loading}
          className="text-xs text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] mt-1 text-left"
        >
          Cancel
        </button>
      </form>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsOpen(true)}
      className={`${VARIANT_CLASS[variant]} w-full ${className}`.trim()}
      style={{ fontFamily: "var(--font-body)" }}
    >
      {label}
    </button>
  );
}
