import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Star, X, ArrowRight, ChevronLeft, ChevronRight, Check, ChevronsUpDown } from "lucide-react";
import * as Icons from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { z } from "zod";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import useEmblaCarousel from "embla-carousel-react";
import { SiteShell } from "@/components/site-shell";
import { ServiceCard } from "@/components/service-card";
import { CATEGORIES, SERVICES } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

type IconCmp = ComponentType<SVGProps<SVGSVGElement> & { className?: string }>;

const searchSchema = z.object({
  category: fallback(z.string().optional(), undefined).default(undefined),
  q: fallback(z.string().optional(), undefined).default(undefined),
  sort: fallback(z.enum(["popular", "price-asc", "price-desc", "rating"]), "popular").default("popular"),
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

const MAIN_CATEGORY_ICONS: Record<string, string> = {
  "creative-design": "Palette",
  "pet-care": "PawPrint",
  "beauty-personal": "Sparkles",
  "health-wellness": "HeartPulse",
  "home-property": "Home",
  "household-assistance": "Users",
  "education-training": "GraduationCap",
  "event-party": "PartyPopper",
  "business-pro": "Briefcase",
  "travel-transport": "Plane",
  "repair-custom": "Wrench",
};

type SortOption = "popular" | "price-asc" | "price-desc" | "rating";

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
    { value: "popular", label: t("services.sortPopular") },
    { value: "rating", label: t("services.sortRating") },
    { value: "price-asc", label: t("services.sortPriceAsc") },
    { value: "price-desc", label: t("services.sortPriceDesc") },
  ];

  const filtered = useMemo(() => {
    let r = SERVICES.filter((s) => {
      if (cat && s.categorySlug !== cat) return false;
      if (q && !s.title.toLowerCase().includes(q.toLowerCase()) && !s.description.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
    if (sort === "price-asc") r = [...r].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") r = [...r].sort((a, b) => b.price - a.price);
    else if (sort === "rating") r = [...r].sort((a, b) => b.rating - a.rating);
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

      {/* Category slider with arrows */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <CategorySlider
            categories={CATEGORIES}
            active={cat}
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
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1 max-w-[600px]">
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

function CategorySlider({
  categories,
  active,
  onSelect,
}: {
  categories: typeof CATEGORIES;
  active: string | undefined;
  onSelect: (slug: string) => void;
}) {
  const { t } = useI18n();
  const allCategories = [
    { slug: "", name: t("services.allLabel"), icon: "LayoutGrid" },
    ...categories.map((c) => ({ ...c, name: t("cat." + c.slug.replace(/-/g, "_")), icon: MAIN_CATEGORY_ICONS[c.slug] ?? "Sparkles" })),
  ];
  const [emblaRef, embla] = useEmblaCarousel({ align: "start", loop: false, dragFree: true });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [selectedSnap, setSelectedSnap] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);

  useEffect(() => {
    if (!embla) return;
    const update = () => {
      setCanPrev(embla.canScrollPrev());
      setCanNext(embla.canScrollNext());
      setSelectedSnap(embla.selectedScrollSnap());
    };
    setSnaps(embla.scrollSnapList());
    update();
    embla.on("select", update);
    embla.on("scroll", update);
    embla.on("reInit", () => { setSnaps(embla.scrollSnapList()); update(); });
  }, [embla]);

  const scrollPrev = useCallback(() => embla?.scrollPrev(), [embla]);
  const scrollNext = useCallback(() => embla?.scrollNext(), [embla]);

  return (
    <div>
      <div className="relative" style={{ paddingLeft: 44, paddingRight: 44 }}>
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex gap-2 sm:gap-3">
            {allCategories.map((c) => (
              <div key={c.slug} className="shrink-0">
                <CategoryPill
                  icon={c.icon}
                  name={c.name}
                  active={c.slug === "" ? !active : active === c.slug}
                  onClick={() => c.slug === "" ? onSelect("") : onSelect(c.slug)}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={scrollPrev}
          disabled={!canPrev}
          aria-label="Previous categories"
          className="absolute top-1/2 z-10 flex items-center justify-center rounded-full border border-border bg-card shadow-md transition hover:bg-primary/10 disabled:opacity-30"
          style={{
            left: 0,
            width: 36,
            height: 36,
            minWidth: 36,
            minHeight: 36,
            transform: "translateY(-50%)",
          }}
        >
          <ChevronLeft className="h-4 w-4 text-primary" />
        </button>
        <button
          type="button"
          onClick={scrollNext}
          disabled={!canNext}
          aria-label="Next categories"
          className="absolute top-1/2 z-10 flex items-center justify-center rounded-full border border-border bg-card shadow-md transition hover:bg-primary/10 disabled:opacity-30"
          style={{
            right: 0,
            width: 36,
            height: 36,
            minWidth: 36,
            minHeight: 36,
            transform: "translateY(-50%)",
          }}
        >
          <ChevronRight className="h-4 w-4 text-primary" />
        </button>
      </div>

      {snaps.length > 1 && (
        <div className="mt-5 flex items-center justify-center gap-1.5">
          {snaps.map((_, i) => (
            <button
              key={i}
              onClick={() => embla?.scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === selectedSnap ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CategoryPill({ icon, name, active, onClick }: { icon: string; name: string; active: boolean; onClick: () => void }) {
  const Icon = ((Icons as unknown as Record<string, IconCmp>)[icon] ?? Icons.Sparkles) as IconCmp;
  return (
    <button
      onClick={onClick}
      className="group flex shrink-0 flex-col items-center gap-2 px-1 transition-all duration-200"
      style={{
        padding: "12px 8px",
        borderRadius: 16,
        minWidth: 80,
        border: active ? "1.5px solid #2D7A5F" : "1.5px solid transparent",
        background: active ? "#2D7A5F" : "transparent",
        transform: "translateZ(0)",
      }}
    >
      <div
        className="grid place-items-center transition-all duration-200"
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: active ? "rgba(255,255,255,0.2)" : "rgba(45,122,95,0.1)",
          color: active ? "white" : "#2D7A5F",
        }}
      >
        <Icon className="h-6 w-6" />
      </div>
      <span
        className="whitespace-nowrap text-center leading-tight transition-colors duration-200"
        style={{
          fontSize: 12,
          fontWeight: active ? 700 : 500,
          color: active ? "white" : undefined,
          maxWidth: 76,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {name}
      </span>
    </button>
  );
}
