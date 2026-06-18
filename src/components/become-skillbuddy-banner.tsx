import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function BecomeSkillBuddyBanner() {
  const { t } = useI18n();
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-emerald-600 to-teal-500 p-8 text-primary-foreground shadow-elegant sm:p-12">
        {/* floating dots backdrop */}
        <div className="pointer-events-none absolute inset-0 opacity-30">
          {Array.from({ length: 18 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute h-2 w-2 rounded-full bg-white"
              style={{ left: `${(i * 53) % 100}%`, top: `${(i * 37) % 100}%` }}
              animate={{ y: [0, -14, 0], opacity: [0.3, 0.9, 0.3] }}
              transition={{ duration: 3 + (i % 4), repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

        <div className="relative grid gap-6 md:grid-cols-[1.4fr_auto] md:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> {t("banner.title")}
            </div>
            <h2 className="font-display text-2xl font-extrabold leading-tight sm:text-3xl md:text-4xl">
              {t("banner.title")}
            </h2>
            <p className="mt-3 max-w-2xl text-sm opacity-90 sm:text-base">{t("banner.sub")}</p>
          </div>
          <motion.div
            animate={{ boxShadow: ["0 0 0 0 rgba(255,255,255,0.5)", "0 0 0 14px rgba(255,255,255,0)"] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="rounded-full"
          >
            <Link
              to="/become-a-provider"
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-base font-bold text-primary transition hover:scale-105"
            >
              {t("banner.cta")} <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
