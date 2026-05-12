import type { ReactNode } from "react";

/*
 * Eyebrow — small uppercase sage caption above a heading.
 *
 * Variants:
 *   - default: flat caption (no dot)
 *   - withDot: leading pulsing sage dot (hero-only — operator design thesis
 *     allows exactly one motion element per page, this is it)
 *
 * Design-thesis rule (docs/design/DESIGN_THESIS.md): only one italic
 * emphasis line per hero/h2; ONE animation per page (this pulse). Refuse
 * adding more.
 */
type EyebrowProps = {
  children: ReactNode;
  withDot?: boolean;
};

export function Eyebrow({ children, withDot = false }: EyebrowProps) {
  return (
    <div
      className="inline-flex items-center gap-2 text-[var(--color-accent)] text-xs font-semibold uppercase tracking-wider"
      style={{ fontFamily: "var(--font-body)" }}
    >
      {withDot && (
        <span
          className="w-1.5 h-1.5 rounded-full bg-current"
          style={{ animation: "pulse-dot 2s ease-in-out infinite" }}
          aria-hidden="true"
        />
      )}
      {children}
    </div>
  );
}
