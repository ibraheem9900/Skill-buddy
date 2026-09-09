import DOMPurify from "dompurify";

/**
 * Backend category descriptions arrive as rich HTML strings (e.g.
 * `<p>...</p><ul><li><strong>...</strong></li></ul>`) produced by a
 * rich-text editor. They must be sanitized before being injected into
 * the DOM — never trust them raw.
 *
 * Allowlist = formatting tags only (paragraphs, headings, bold/italic,
 * lists, links). Everything else (scripts, event handlers, styles,
 * iframes, custom `data-*` editor attributes like `data-path-to-node`)
 * is stripped. Unknown tags fall back to their text content, so no
 * content is silently lost.
 */
const SANITIZE_CONFIG = {
  ALLOWED_TAGS: [
    "p", "br", "hr",
    "strong", "b", "em", "i", "u", "s",
    "ul", "ol", "li",
    "h1", "h2", "h3", "h4", "h5", "h6",
    "blockquote", "span", "a",
  ],
  ALLOWED_ATTR: ["href", "target", "rel"],
  // Strips editor bookkeeping attributes (data-path-to-node, data-index-in-node, …)
  ALLOW_DATA_ATTR: false,
};

/**
 * Sanitize an HTML string from the backend for safe rendering via
 * `dangerouslySetInnerHTML`.
 *
 * SSR note: DOMPurify needs a DOM, and all backend-driven rich text in
 * this app is fetched client-side after hydration, so the server branch
 * only ever sees empty/unrendered content. The client always sanitizes
 * before anything reaches the DOM.
 */
export function sanitizeRichHtml(html: string | null | undefined): string {
  if (!html) return "";
  if (typeof window === "undefined") return "";
  return DOMPurify.sanitize(html, SANITIZE_CONFIG);
}

/**
 * Convert a rich-HTML string to plain text (tags stripped, whitespace
 * collapsed). Used for compact single/two-line previews where formatted
 * HTML would be unreadable. Input is sanitized before parsing, so this
 * is safe even for untrusted content.
 */
export function htmlToPlainText(html: string | null | undefined): string {
  const clean = sanitizeRichHtml(html);
  if (!clean) return "";
  if (typeof document === "undefined") {
    return clean.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  }
  const div = document.createElement("div");
  div.innerHTML = clean;
  return (div.textContent ?? "").replace(/\s+/g, " ").trim();
}
