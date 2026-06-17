import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, Star, X } from "lucide-react";
import * as Icons from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { z } from "zod";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { SiteShell } from "@/components/site-shell";
import { ServiceCard } from "@/components/service-card";
import { CATEGORIES_FULL } from "@/lib/categories";
import { SERVICES } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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

function ServicesPage() {
  const search = Route.useSearch();
  const [cat, setCat] = useState<string | undefined>(search.category);
  const [q, setQ] = useState(search.q ?? "");
  const [sort, setSort] = useState<"popular" | "price-asc" | "price-desc" | "rating">(search.sort);
  const [price, setPrice] = useState<[number, number]>([0, 1500]);
  const [minRating, setMinRating] = useState(0);

  const filtered = useMemo(() => {
    // map our category slug → service.categorySlug guesses via name match
    let r = SERVICES.filter((s) => {
      if (cat) {
        const catDef = CATEGORIES_FULL.find((c) => c.slug === cat);
        if (catDef && !s.title.toLowerCase().includes(catDef.name.toLowerCase().split(" ")[0]) && !s.category.toLowerCase().includes(catDef.name.toLowerCase().split(" ")[0])) {
          return false;
        }
      }
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

  const activeCat = CATEGORIES_FULL.find((c) => c.slug === cat);

  return (
    <SiteShell>
      <div className="border-b border-border bg-surface/30">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <h1 className="font-display text-3xl font-extrabold sm:text-4xl">
            {activeCat ? activeCat.name : "Browse all services"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {activeCat ? activeCat.description : `Find the right pro from ${SERVICES.length}+ trusted services.`}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search services..." className="h-12 pl-10" />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="h-12 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="popular">Most popular</option>
              <option value="rating">Highest rated</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
            {/* Mobile filter sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="h-12 lg:hidden">
                  <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
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
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-4">
            <h3 className="mb-3 px-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">Categories</h3>
            <button
              onClick={() => setCat(undefined)}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                !cat ? "bg-primary text-primary-foreground" : "hover:bg-accent"
              }`}
            >
              All categories
            </button>
            <div className="mt-1 max-h-[60vh] space-y-0.5 overflow-y-auto pr-1">
              {CATEGORIES_FULL.map((c) => {
                const Icon = ((Icons as unknown as Record<string, IconCmp>)[c.icon] ?? Icons.Sparkles) as IconCmp;
                const active = cat === c.slug;
                return (
                  <button
                    key={c.slug}
                    onClick={() => setCat(c.slug)}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                      active ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="line-clamp-1">{c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <p className="text-sm text-muted-foreground">
              <span className="font-mono font-bold text-foreground">{filtered.length}</span> results
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
              <p className="text-muted-foreground">No services match your filters.</p>
              <Button asChild variant="link"><Link to="/services">Reset</Link></Button>
            </div>
          ) : (
            <div className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
              {filtered.map((s, i) => <ServiceCard key={s.id} service={s} index={i} />)}
            </div>
          )}
        </div>
      </div>
    </SiteShell>
  );
}

function FilterPanel({
  price, setPrice, minRating, setMinRating, onReset,
}: {
  price: [number, number];
  setPrice: (v: [number, number]) => void;
  minRating: number;
  setMinRating: (n: number) => void;
  onReset: () => void;
}) {
  return (
    <div className="flex max-h-[80vh] flex-col">
      <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-muted-foreground/30" />
      <div className="flex-1 space-y-6 overflow-y-auto p-6">
        <h3 className="font-display text-lg font-bold">Filters</h3>
        <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm font-semibold">Price range</label>
            <span className="font-mono text-sm font-bold text-primary">${price[0]} — ${price[1]}</span>
          </div>
          <Slider
            min={0} max={1500} step={10}
            value={price}
            onValueChange={(v) => setPrice([v[0], v[1]] as [number, number])}
            className="[&_[role=slider]]:h-6 [&_[role=slider]]:w-6"
          />
        </div>
        <div>
          <label className="mb-3 block text-sm font-semibold">Minimum rating</label>
          <div className="grid grid-cols-4 gap-2">
            {[0, 4, 4.5, 4.8].map((r) => (
              <button
                key={r}
                onClick={() => setMinRating(r)}
                className={`flex items-center justify-center gap-1 rounded-xl border px-3 py-3 text-sm font-medium transition ${
                  minRating === r
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:bg-accent"
                }`}
              >
                <Star className="h-3.5 w-3.5 fill-current" />{r === 0 ? "Any" : `${r}+`}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="sticky bottom-0 grid grid-cols-2 gap-3 border-t border-border bg-card p-4">
        <Button variant="outline" onClick={onReset}>Reset</Button>
        <Button>Apply</Button>
      </div>
    </div>
  );
}
