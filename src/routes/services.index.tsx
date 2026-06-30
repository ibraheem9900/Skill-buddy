import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, Check, ChevronsUpDown } from "lucide-react";
import { z } from "zod";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { SiteShell } from "@/components/site-shell";
import { ServiceCard } from "@/components/service-card";
import { CATEGORIES, SERVICES } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { CategoriesSlider } from "@/components/categories-slider";

const searchSchema = z.object({
  category: fallback(z.string().optional(), undefined).default(undefined),
  q: fallback(z.string().optional(), undefined).default(undefined),
  sort: fallback(z.enum(["popular", "new", "offers", "upcoming", "rating", "price-asc", "price-desc"]), "popular").default("popular"),
});

export const Route = createFileRoute("/services/")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "All Services — SkillBuddy" },
      { name: "description", content: "Browse all SkillBuddy services. Pick a category and post your job." },
      { property: "og:title", content: "All Services — SkillBuddy" },
      { property: "og:description", content: "Browse all SkillBuddy services. Pick a category and post your job." },
    ],
  }),
  component: ServicesPage,
});

type SortOption = "popular" | "new" | "offers" | "upcoming" | "rating" | "price-asc" | "price-desc";

function ServicesPage() {
  const { t } = useI18n();
  const search = Route.useSearch();
  const [cat, setCat] = useState<string | undefined>(search.category);
  const [q, setQ] = useState(search.q ?? "");
  const [sort, setSort] = useState<SortOption>(search.sort);
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "popular", label: t("sort.mostPopular") },
    { value: "new", label: t("sort.whatsNew") },
    { value: "offers", label: t("sort.specialOffers") },
    { value: "upcoming", label: t("sort.upcoming") },
    { value: "rating", label: t("sort.highestRated") },
    { value: "price-asc", label: t("sort.lowestPrice") },
    { value: "price-desc", label: t("sort.highestPrice") },
  ];

  const filtered = useMemo(() => {
    let r = SERVICES.filter((s) => {
      if (cat && s.categorySlug !== cat) return false;
      if (q && !s.title.toLowerCase().includes(q.toLowerCase()) && !s.description.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
    if (sort === "price-asc") r = [...r].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc" || sort === "offers") r = [...r].sort((a, b) => b.price - a.price);
    else if (sort === "rating" || sort === "highest-rated") r = [...r].sort((a, b) => b.rating - a.rating);
    else if (sort === "new") r = [...r].sort((a, b) => b.id.localeCompare(a.id));
    else if (sort === "upcoming") r = [...r].sort((a, b) => a.reviewCount - b.reviewCount);
    else r = [...r].sort((a, b) => b.reviewCount - a.reviewCount);
    return r;
  }, [cat, q, sort]);

  const activeCat = CATEGORIES.find((c) => c.slug === cat);
  const currentSortLabel = sortOptions.find((o) => o.value === sort)?.label ?? sortOptions[0].label;

  return (
    <SiteShell>
      {/* Page heading */}
      <div className="border-b border-border bg-surface/30">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <h1 className="font-display text-3xl font-extrabold sm:text-4xl">
            {t("services.browseAll")}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {t("services.findRight")}
          </p>
        </div>
      </div>

      {/* Category slider — identical to homepage */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          {/* "All" pill */}
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              onClick={() => setCat(undefined)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
                !cat
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {t("services.allLabel")}
            </button>
          </div>
          <CategoriesSlider
            activeSlug={cat}
            onSelect={(slug) => setCat(slug === cat ? undefined : slug)}
          />
        </div>
      </div>

      {/* Search + sort bar */}
      <div className="border-b border-border bg-surface/10">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
          {activeCat && (
            <div className="mb-3">
              <h2 className="font-display text-xl font-bold">{activeCat.name}</h2>
              <p className="text-sm text-muted-foreground">{activeCat.description}</p>
            </div>
          )}
          <div className="flex flex-col gap-3 sm:flex-row items-start justify-center">
            <div className="relative w-full max-w-[600px] mx-auto sm:mx-0 sm:flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t("services.search")}
                className="h-12 pl-10"
              />
            </div>

            {/* Animated sort dropdown */}
            <div ref={sortRef} className="relative">
              <button
                onClick={() => setSortOpen((o) => !o)}
                className="flex h-12 min-w-[180px] items-center justify-between gap-2 rounded-md border border-input bg-background px-3 text-sm transition hover:bg-accent"
              >
                <span>{currentSortLabel}</span>
                <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
              </button>

              <AnimatePresence>
                {sortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{
                      enter: { duration: 0.2, ease: "easeOut" },
                      exit: { duration: 0.15, ease: "easeIn" },
                    }}
                    className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-[12px] border border-border bg-card shadow-[0_8px_24px_rgba(0,0,0,0.12)] dark:bg-card"
                  >
                    {sortOptions.map((o) => (
                      <button
                        key={o.value}
                        onClick={() => { setSort(o.value); setSortOpen(false); }}
                        className="flex w-full items-center justify-between px-4 py-3 text-sm transition hover:bg-primary/8 dark:hover:bg-primary/10 text-left"
                      >
                        <span className={sort === o.value ? "font-semibold text-primary" : ""}>{o.label}</span>
                        {sort === o.value && <Check className="h-4 w-4 text-primary" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <p className="text-sm text-muted-foreground">
            <span className="font-mono font-bold text-foreground">{filtered.length}</span> {t("services.results")}
          </p>
          {activeCat && (
            <button
              onClick={() => setCat(undefined)}
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
            >
              {activeCat.name} <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-12 text-center">
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Search className="h-7 w-7" />
            </div>
            <h3 className="font-display text-xl font-bold">{t("services.noResults")}</h3>
            <p className="mt-2 text-muted-foreground">{t("services.cantFind")}</p>
            <div className="mt-5 flex justify-center gap-2">
              <Button asChild variant="outline"><Link to="/contact">{t("services.contactUs")}</Link></Button>
              <Button onClick={() => { setQ(""); setCat(undefined); }}>
                {t("common.reset")}
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
            {filtered.map((s, i) => <ServiceCard key={s.id} service={s} index={i} />)}
          </div>
        )}

        <div className="mt-12 rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-8 text-center">
          <h3 className="font-display text-2xl font-extrabold">{t("sec.requestCustom")}</h3>
          <p className="mt-2 text-muted-foreground">{t("sec.requestCustomSub")}</p>
          <Button asChild variant="outline" className="mt-5 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <Link to="/contact">{t("common.requestQuote")} <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </SiteShell>
  );
}
