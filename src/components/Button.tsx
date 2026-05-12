import Link from "next/link";
import type { ReactNode } from "react";

/*
 * Button — the canonical CTA component for siteclinic-web.
 *
 * Three variants, no fourth. Design-thesis rule (docs/design/DESIGN_THESIS.md):
 *   primary    — filled sage, used for the page's primary action
 *   secondary  — outlined hairline, used for the page's secondary action
 *   text-link  — sage underlined, used for inline links that aren't buttons
 *
 * Anti-pattern: adding a fourth variant ("ghost," "outline-with-icon,"
 * "amber alert," etc.). Refuse. If a design needs a fourth, the design
 * is wrong, not the component.
 *
 * Routes via Next Link when href is internal (starts with /), or anchor
 * tag when href is external (http://, https://) or in-page (#).
 */
/*
 * VARIANT_CLASS is exported so non-link CTAs (like CheckoutButton, which is
 * a stateful form trigger, not a navigation) can render with identical
 * styling. Single source of truth — when a fourth call site emerges, lift
 * to a shared style helper.
 */
export type ButtonVariant = "primary" | "secondary" | "text-link";

export const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary:
    "inline-flex items-center justify-center bg-[var(--color-accent)] text-white px-6 py-3 rounded-lg font-medium hover:bg-[var(--color-accent-hover)] transition-colors no-underline",
  secondary:
    "inline-flex items-center justify-center text-[var(--color-ink)] border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3 rounded-lg font-medium hover:bg-[var(--color-surface-hover)] transition-colors no-underline",
  "text-link":
    "text-[var(--color-accent)] underline underline-offset-[3px] hover:text-[var(--color-accent-hover)] transition-colors",
};

type ButtonProps = {
  href: string;
  variant?: ButtonVariant;
  children: ReactNode;
  className?: string;
};

export function Button({
  href,
  variant = "primary",
  children,
  className = "",
}: ButtonProps) {
  const isExternal = href.startsWith("http://") || href.startsWith("https://") || href.startsWith("#");
  const baseClass = `${VARIANT_CLASS[variant]} ${className}`.trim();
  const style = { fontFamily: "var(--font-body)" };

  if (isExternal) {
    return (
      <a href={href} className={baseClass} style={style}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={baseClass} style={style}>
      {children}
    </Link>
  );
}
