import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, Star, X, ArrowRight } from "lucide-react";
import * as Icons from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { z } from "zod";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { SiteShell } from "@/components/site-shell";
import { ServiceCard } from "@/components/service-card";
import { CATEGORIES_FULL } from "@/lib/categories";
import { CATEGORIES, SERVICES } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useI18n } from "@/lib/i18n";

type IconCmp = ComponentType<SVGProps<SVGSVGElement> & { className?: string }>;

const searchSchema = z.object({
  category: fallback(z.string().optional(), undefined).default(undefined),
  q: fallback(z.string().optional(), undefined).default(undefined),
  sort: fallback(z.enum(["popular", "price-asc", "price-desc", "rating"]), "popular").default("popular"),
});

export const Route = createFileRoute("/services")({
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

// Main category icons mapped to lucide
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

function ServicesPage() {
  const { t } = useI18n();
  const search = Route.useSearch();
  const [cat, setCat] = useState<string | undefined>(search.category);
  const [q, setQ] = useState(search.q ?? "");
  const [sort, setSort] = useState<"popular" | "price-asc" | "price-desc" | "rating">(search.sort);
  const [price, setPrice] = useState<[number, number]>([0, 1500]);
  const [minRating, setMinRating] = useState(0);

  const filtered = useMemo(() => {
    let r = SERVICES.filter((s) => {
      if (cat && s.categorySlug !== cat) return false;
      if (s.price < price[0] || s.price > price[1]) return false;
      if (s.rating < minRating) return false;
      if (q && !s.title.toLowerCase().includes(q.toLowerCase()) && !s.description.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
    if (sort === "price-asc") r = [...r].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") r = [...r].sort((a, b) => b.price - a.price);
    else if (sort === "rating") r = [...r].sort((a, b) => b.rating - a.rating);
    else r = [...r].sort((a, b) => b.reviewCount - a.reviewCount);
    return r;
  }, [cat, q, sort, price, minRating]);

  const activeCat = CATEGORIES.find((c) => c.slug === cat);

  return (
    <SiteShell>
      {/* Top category bar */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-2 sm:px-4">
          <div className="flex gap-3 overflow-x-auto py-4 sm:gap-4">
            <CategoryPill
              icon="LayoutGrid"
              name={t("services.allCategories")}
              active={!cat}
              onClick={() => setCat(undefined)}
            />
            {CATEGORIES.map((c) => (
              <CategoryPill
                key={c.slug}
                icon={MAIN_CATEGORY_ICONS[c.slug] ?? "Sparkles"}
                name={c.name}
                active={cat === c.slug}
                onClick={() => setCat(c.slug)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="border-b border-border bg-surface/30">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <h1 className="font-display text-3xl font-extrabold sm:text-4xl">
            {activeCat ? activeCat.name : t("services.browseAll")}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {activeCat ? activeCat.description : `${SERVICES.length}+ ${t("services.results")}`}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("services.search")} className="h-12 pl-10" />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="h-12 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="popular">{t("services.sortPopular")}</option>
              <option value="rating">{t("services.sortRating")}</option>
              <option value="price-asc">{t("services.sortPriceAsc")}</option>
              <option value="price-desc">{t("services.sortPriceDesc")}</option>
            </select>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="h-12 lg:hidden">
                  <SlidersHorizontal className="mr-2 h-4 w-4" /> {t("services.filters")}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-3xl p-0">
                <FilterPanel
                  price={price} setPrice={setPrice}
                  minRating={minRating} setMinRating={setMinRating}
                  onReset={() => { setPrice([0, 1500]); setMinRating(0); }}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[260px_1fr]">
        {/* Desktop filter sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-4">
            <FilterPanel
              embedded
              price={price} setPrice={setPrice}
              minRating={minRating} setMinRating={setMinRating}
              onReset={() => { setPrice([0, 1500]); setMinRating(0); }}
            />
          </div>
        </aside>

        <div>
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
                <Button onClick={() => { setQ(""); setCat(undefined); setMinRating(0); setPrice([0, 1500]); }}>
                  {t("common.reset")}
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
              {filtered.map((s, i) => <ServiceCard key={s.id} service={s} index={i} />)}
            </div>
          )}

          {/* Request a Quote CTA */}
          <div className="mt-12 rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-8 text-center">
            <h3 className="font-display text-2xl font-extrabold">{t("sec.requestCustom")}</h3>
            <p className="mt-2 text-muted-foreground">{t("sec.requestCustomSub")}</p>
            <Button asChild variant="outline" className="mt-5 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              <Link to="/contact">{t("common.requestQuote")} <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}

function CategoryPill({ icon, name, active, onClick }: { icon: string; name: string; active: boolean; onClick: () => void }) {
  const Icon = ((Icons as unknown as Record<string, IconCmp>)[icon] ?? Icons.Sparkles) as IconCmp;
  return (
    <button
      onClick={onClick}
      className="group flex shrink-0 flex-col items-center gap-2 px-2 transition"
    >
      <div className={`grid h-14 w-14 place-items-center rounded-full transition ${
        active ? "bg-primary text-primary-foreground shadow-elegant" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
      }`}>
        <Icon className="h-6 w-6" />
      </div>
      <span className={`whitespace-nowrap text-xs font-medium ${active ? "text-primary" : "text-foreground/80 group-hover:text-primary"}`}>
        {name}
      </span>
    </button>
  );
}

function FilterPanel({
  price, setPrice, minRating, setMinRating, onReset, embedded,
}: {
  price: [number, number];
  setPrice: (v: [number, number]) => void;
  minRating: number;
  setMinRating: (n: number) => void;
  onReset: () => void;
  embedded?: boolean;
}) {
  const { t } = useI18n();
  return (
    <div className={`flex flex-col ${embedded ? "" : "max-h-[80vh]"}`}>
      {!embedded && <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-muted-foreground/30" />}
      <div className={`flex-1 space-y-6 ${embedded ? "" : "overflow-y-auto p-6"}`}>
        <h3 className="font-display text-lg font-bold">{t("services.filters")}</h3>
        <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm font-semibold">{t("services.priceRange")}</label>
            <span className="font-mono text-sm font-bold text-primary">€{price[0]} — €{price[1]}</span>
          </div>
          <Slider
            min={0} max={1500} step={10}
            value={price}
            onValueChange={(v) => setPrice([v[0], v[1]] as [number, number])}
            className="[&_[role=slider]]:h-6 [&_[role=slider]]:w-6"
          />
        </div>
        <div>
          <label className="mb-3 block text-sm font-semibold">{t("services.minRating")}</label>
          <div className="grid grid-cols-4 gap-2">
            {[0, 4, 4.5, 4.8].map((r) => (
              <button
                key={r}
                onClick={() => setMinRating(r)}
                className={`flex items-center justify-center gap-1 rounded-xl border px-2 py-2.5 text-xs font-medium transition ${
                  minRating === r
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:bg-accent"
                }`}
              >
                <Star className="h-3 w-3 fill-current" />{r === 0 ? t("services.any") : `${r}+`}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className={`grid grid-cols-2 gap-3 ${embedded ? "pt-4" : "sticky bottom-0 border-t border-border bg-card p-4"}`}>
        <Button variant="outline" onClick={onReset}>{t("common.reset")}</Button>
        <Button>{t("common.apply")}</Button>
      </div>
    </div>
  );
}
