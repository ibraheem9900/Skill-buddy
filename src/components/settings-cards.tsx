import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

/**
 * Trello-style horizontal card row for the dashboard Settings/Security tabs.
 * Desktop/tablet: cards sit in a horizontal scroll row. Mobile (<sm): cards
 * stack vertically. Clicking a card opens its content in an animated modal —
 * full-screen sheet on mobile, centered dialog on desktop — with fade + scale
 * transitions (Framer Motion, already used across the app). Dismissible via
 * close button, backdrop click, and Escape. Pure presentation: whatever is
 * passed as `children` renders unchanged inside the modal.
 */

export interface SettingsCardMeta {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  /** Accent for the icon chip — defaults to the brand primary. */
  tone?: "primary" | "danger";
  /** Optional right-side hint on the card, e.g. current value. */
  meta?: string;
  children: ReactNode;
}

export function SettingsCardRow({ cards, columns }: { cards: SettingsCardMeta[]; columns?: 2 | 3 }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const openCard = cards.find((c) => c.id === openId) ?? null;

  useEffect(() => {
    if (!openCard) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenId(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openCard]);

  // Lock body scroll while the modal is open
  useEffect(() => {
    if (!openCard) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [openCard]);

  return (
    <>
      <div
        className={`-mx-4 flex flex-col gap-4 px-4 pb-2 sm:mx-0 sm:flex-row sm:overflow-x-auto sm:px-0 sm:pb-3 ${
          columns === 3 ? "sm:snap-x" : ""
        }`}
      >
        {cards.map((c) => (
          <SettingsTile key={c.id} card={c} onOpen={() => setOpenId(c.id)} />
        ))}
      </div>
      <SettingsModal card={openCard} onClose={() => setOpenId(null)} />
    </>
  );
}

function SettingsTile({ card, onOpen }: { card: SettingsCardMeta; onOpen: () => void }) {
  const Icon = card.icon;
  const danger = card.tone === "danger";
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`group flex w-full shrink-0 flex-col items-start gap-3 rounded-2xl border bg-card p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card sm:w-[264px] ${
        danger
          ? "border-red-200 hover:border-red-300 dark:border-red-900/40 dark:hover:border-red-800"
          : "border-border hover:border-primary/50"
      }`}
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
          danger
            ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
            : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
        }`}
      >
        <Icon className="h-5 w-5" />
        {/* h-5 (20px) = 50% of the 40px chip — matches the category-icon size ratio */}
      </div>
      <div className="w-full">
        <p className={`font-semibold ${danger ? "text-red-700 dark:text-red-300" : ""}`}>{card.title}</p>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{card.description}</p>
      </div>
      {card.meta && (
        <span className="mt-auto rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
          {card.meta}
        </span>
      )}
    </button>
  );
}

function SettingsModal({ card, onClose }: { card: SettingsCardMeta | null; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {card && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={card.title}
            key="panel"
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 24 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-x-0 bottom-0 z-[90] flex max-h-[92dvh] w-full flex-col rounded-t-2xl border border-border bg-card shadow-xl sm:absolute sm:inset-0 sm:m-auto sm:h-fit sm:max-h-[85vh] sm:w-full sm:max-w-2xl sm:rounded-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    card.tone === "danger"
                      ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  <card.icon className="h-4.5 w-4.5" />
                </div>
                <h3 className="font-bold">{card.title}</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-accent hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable body — existing forms render here untouched */}
            <div className="overflow-y-auto px-5 py-5">{card.children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
