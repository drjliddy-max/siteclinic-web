/*
 * CodeBlock — shared code-snippet component for docs/dev surfaces.
 *
 * Extracted in §5b iteration 13 after the rule-of-three threshold was hit:
 * inline copies previously lived in /developers/docs/quickstart (iter 8),
 * /developers/mcp (iter 9), and /developers/api-reference (iter 10). All
 * three rendered the same shape with the same fix for the iter-8 contrast
 * defect (solid sage badge + white text). Now single source of truth.
 *
 * Dark code surface (#0F1826) is intentional — universal "code on dark"
 * convention, not a design-thesis violation per docs/design/DESIGN_THESIS.md.
 *
 * The language badge MUST stay solid sage + white text. Earlier attempts
 * with sage-tint background failed WCAG AA contrast (gate:ada caught it
 * in iter 8 — see MIGRATION_PLAN §5e.8). Don't revert.
 */
export function CodeBlock({
  language,
  code,
}: {
  language: string;
  code: string;
}) {
  return (
    <div className="bg-[#0F1826] rounded-lg overflow-hidden">
      <div className="px-4 py-2 text-xs border-b border-[#1e2a44]">
        <span
          className="inline-block px-2 py-0.5 rounded bg-[var(--color-accent)] text-white font-medium"
          style={{
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          }}
        >
          {language}
        </span>
      </div>
      <pre
        className="p-4 overflow-x-auto text-white text-sm leading-relaxed whitespace-pre"
        style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
      >
        {code}
      </pre>
    </div>
  );
}
