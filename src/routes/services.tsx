import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { ServiceCard } from "@/components/service-card";
import { CATEGORIES, SERVICES } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { z } from "zod";
import { fallback, zodValidator } from "@tanstack/zod-adapter";

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
      { name: "description", content: "Browse 55+ trusted services. Filter by category, price, rating, and availability." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const search = Route.useSearch();
  const [price, setPrice] = useState<[number, number]>([0, 500]);
  const [minRating, setMinRating] = useState(0);
  const [q, setQ] = useState(search.q ?? "");
  const [cat, setCat] = useState<string | undefined>(search.category);
  const [sort, setSort] = useState(search.sort);

  const results = useMemo(() => {
    let r = SERVICES.filter(
      (s) =>
        (!cat || s.categorySlug === cat) &&
        s.price >= price[0] && s.price <= price[1] &&
        s.rating >= minRating &&
        (!q || s.title.toLowerCase().includes(q.toLowerCase()) || s.description.toLowerCase().includes(q.toLowerCase()))
    );
    if (sort === "price-asc") r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") r = [...r].sort((a, b) => b.price - a.price);
    if (sort === "rating") r = [...r].sort((a, b) => b.rating - a.rating);
    if (sort === "popular") r = [...r].sort((a, b) => b.reviewCount - a.reviewCount);
    return r;
  }, [cat, price, minRating, q, sort]);

  return (
    <SiteShell>
      <div className="border-b border-border bg-surface/30">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <h1 className="text-3xl font-extrabold sm:text-4xl">Browse all services</h1>
          <p className="mt-2 text-muted-foreground">Find the right pro from {SERVICES.length}+ trusted services.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search services..." className="h-12 pl-10" />
            </div>
            <select value={sort} onChange={(e) => setSort(e.target.value as never)} className="h-12 rounded-md border border-input bg-background px-3 text-sm">
              <option value="popular">Most popular</option>
              <option value="rating">Highest rated</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-bold"><SlidersHorizontal className="h-4 w-4" />Filters</h3>
              <button onClick={() => { setCat(undefined); setPrice([0, 500]); setMinRating(0); setQ(""); }} className="text-xs text-primary hover:underline">Reset</button>
            </div>
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-xs font-semibold text-muted-foreground">Category</label>
                <div className="flex flex-wrap gap-1.5">
                  <button onClick={() => setCat(undefined)} className={`rounded-full px-3 py-1 text-xs ${!cat ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-accent"}`}>All</button>
                  {CATEGORIES.map((c) => (
                    <button key={c.slug} onClick={() => setCat(c.slug)} className={`rounded-full px-3 py-1 text-xs ${cat === c.slug ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-accent"}`}>{c.name}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold text-muted-foreground">Price range: ${price[0]} – ${price[1]}</label>
                <Slider min={0} max={500} step={5} value={price} onValueChange={(v) => setPrice([v[0], v[1]] as [number, number])} />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold text-muted-foreground">Minimum rating</label>
                <div className="flex gap-1.5">
                  {[0, 4, 4.5, 4.8].map((r) => (
                    <button key={r} onClick={() => setMinRating(r)} className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs ${minRating === r ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-accent"}`}>
                      <Star className="h-3 w-3 fill-current" />{r === 0 ? "Any" : `${r}+`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">{results.length}</span> results found</p>
            {cat && <Badge variant="secondary">{CATEGORIES.find((c) => c.slug === cat)?.name}</Badge>}
          </div>
          {results.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-12 text-center">
              <p className="text-muted-foreground">No services match your filters.</p>
              <Button asChild variant="link"><Link to="/services">Reset</Link></Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {results.map((s, i) => <ServiceCard key={s.id} service={s} index={i} />)}
            </div>
          )}
        </div>
      </div>
    </SiteShell>
  );
}
