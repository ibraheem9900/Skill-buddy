import { useMemo } from "react";
import { sanitizeRichHtml } from "@/lib/sanitize";

interface RichTextProps {
  /** Raw HTML string from the backend — always sanitized before rendering. */
  html: string | null | undefined;
  className?: string;
}

/**
 * Renders a backend rich-HTML string (paragraphs, bold, lists) as
 * formatted content. The HTML is sanitized with DOMPurify first, so
 * scripts/event handlers/custom data-attributes are stripped — safe
 * even for untrusted input.
 *
 * On the server (SSR), renders nothing: DOMPurify needs a DOM, and all
 * rich text is fetched client-side after hydration anyway.
 */
export function RichText({ html, className }: RichTextProps) {
  const clean = useMemo(
    () => sanitizeRichHtml(html),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `html` is the only meaningful input; the config is static
    [html],
  );
  if (!clean) return null;
  return <div className={className} dangerouslySetInnerHTML={{ __html: clean }} />;
}
