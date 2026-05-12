// Minimal markdown -> HTML renderer for the Site Clinic blog lane.
// Intentionally vendored (no dependency) and intentionally narrow.

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char] ?? char);
}

function inlineMarkdown(value: string): string {
  return escapeHtml(value)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_match, text: string, href: string) => {
      const safeHref = href.startsWith("/") || /^https?:\/\//.test(href) ? href : "#";
      return `<a href="${escapeHtml(safeHref)}">${text}</a>`;
    });
}

export interface ParsedDraft {
  attributes: Record<string, string>;
  body: string;
}

export function parseFrontMatter(source: string): ParsedDraft {
  const normalized = source.replace(/\r\n/g, "\n");
  if (!normalized.startsWith("---\n")) {
    return { attributes: {}, body: normalized.trim() };
  }

  const endIndex = normalized.indexOf("\n---\n", 4);
  if (endIndex === -1) {
    throw new Error("Draft front matter is missing a closing --- delimiter");
  }

  const attributes: Record<string, string> = {};
  for (const line of normalized.slice(4, endIndex).split("\n")) {
    const separator = line.indexOf(":");
    if (separator === -1) continue;
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();
    if (key) attributes[key] = value;
  }

  return {
    attributes,
    body: normalized.slice(endIndex + 5).trim(),
  };
}

export function markdownToHtml(markdown: string): string {
  const normalized = markdown.replace(/\r\n/g, "\n").trim();
  if (!normalized) return "";

  const blocks = normalized.split(/\n\s*\n/);
  const rendered: string[] = [];

  for (const block of blocks) {
    const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
    if (lines.length === 0) continue;

    if (lines.every((line) => line.startsWith("- "))) {
      const items = lines.map((line) => `<li>${inlineMarkdown(line.slice(2))}</li>`).join("\n");
      rendered.push(`<ul>\n${items}\n</ul>`);
      continue;
    }

    if (lines.every((line) => /^\d+\.\s/.test(line))) {
      const items = lines
        .map((line) => line.replace(/^\d+\.\s/, ""))
        .map((line) => `<li>${inlineMarkdown(line)}</li>`)
        .join("\n");
      rendered.push(`<ol>\n${items}\n</ol>`);
      continue;
    }

    if (lines.every((line) => line.startsWith("> "))) {
      const quote = lines.map((line) => inlineMarkdown(line.slice(2))).join(" ");
      rendered.push(`<blockquote><p>${quote}</p></blockquote>`);
      continue;
    }

    const firstLine = lines[0];
    if (firstLine.startsWith("### ")) {
      rendered.push(`<h3>${inlineMarkdown(firstLine.slice(4))}</h3>`);
      if (lines.length > 1) {
        rendered.push(`<p>${lines.slice(1).map((line) => inlineMarkdown(line)).join(" ")}</p>`);
      }
      continue;
    }

    if (firstLine.startsWith("## ")) {
      rendered.push(`<h2>${inlineMarkdown(firstLine.slice(3))}</h2>`);
      if (lines.length > 1) {
        rendered.push(`<p>${lines.slice(1).map((line) => inlineMarkdown(line)).join(" ")}</p>`);
      }
      continue;
    }

    if (firstLine.startsWith("# ")) {
      rendered.push(`<h1>${inlineMarkdown(firstLine.slice(2))}</h1>`);
      if (lines.length > 1) {
        rendered.push(`<p>${lines.slice(1).map((line) => inlineMarkdown(line)).join(" ")}</p>`);
      }
      continue;
    }

    rendered.push(`<p>${lines.map((line) => inlineMarkdown(line)).join(" ")}</p>`);
  }

  return rendered.join("\n\n");
}
