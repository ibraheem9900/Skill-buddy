import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { SERVICES, CATEGORIES } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Search, Star, Navigation } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/explore")({
  head: () => ({ meta: [{ title: "Explore Nearby Pros — SkillBuddy" }, { name: "description", content: "Discover trusted service providers near you on an interactive map." }] }),
  component: Explore,
});

// Pseudo coordinates for visual map effect
const pins = SERVICES.slice(0, 24).map((s, i) => ({
  service: s,
  x: 10 + (i * 73) % 80,
  y: 12 + (i * 41) % 70,
}));

function Explore() {
  const [active, setActive] = useState<string | null>(pins[0]?.service.id ?? null);
  const [cat, setCat] = useState<string | undefined>();

  const filtered = cat ? pins.filter((p) => p.service.categorySlug === cat) : pins;

  return (
    <SiteShell>
      <div className="relative h-[calc(100vh-4rem)] overflow-hidden">
        {/* Faux map background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,oklch(0.42_0.08_165)_0%,transparent_60%),radial-gradient(circle_at_70%_60%,oklch(0.38_0.06_180)_0%,transparent_60%)] opacity-40" />
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)", backgroundSize: "40px 40px" }}
          />
          {/* pulsing user location */}
          <div className="absolute" style={{ left: "50%", top: "50%" }}>
            <div className="relative -translate-x-1/2 -translate-y-1/2">
              <span className="absolute inset-0 m-auto h-12 w-12 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-primary/40" />
              <span className="relative grid h-5 w-5 place-items-center rounded-full border-2 border-background bg-primary shadow-elegant" />
            </div>
          </div>

          {filtered.map((p) => (
            <button
              key={p.service.id}
              onClick={() => setActive(p.service.id)}
              className={`absolute -translate-x-1/2 -translate-y-full transition ${active === p.service.id ? "scale-110 z-10" : "hover:scale-110"}`}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            >
              <div className={`relative grid h-10 w-10 place-items-center rounded-full border-2 border-background shadow-elegant ${active === p.service.id ? "bg-foreground text-background" : "bg-primary text-primary-foreground"}`}>
                <MapPin className="h-5 w-5" />
                <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-inherit" />
              </div>
            </button>
          ))}
        </div>

        {/* Top search bar */}
        <div className="absolute inset-x-0 top-0 z-20 p-4">
          <div className="mx-auto max-w-2xl">
            <div className="flex items-center gap-2 rounded-2xl border border-border bg-card/95 p-2 shadow-elegant backdrop-blur">
              <Search className="ml-2 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Search nearby services or address" className="h-10 border-0 bg-transparent focus-visible:ring-0" />
              <Button size="sm" variant="outline" className="gap-1"><Navigation className="h-3.5 w-3.5" />Locate</Button>
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <button onClick={() => setCat(undefined)} className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur transition ${!cat ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card/80 hover:bg-card"}`}>All</button>
              {CATEGORIES.map((c) => (
                <button key={c.slug} onClick={() => setCat(c.slug)} className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur transition ${cat === c.slug ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card/80 hover:bg-card"}`}>{c.name}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom sheet */}
        <div className="absolute inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 backdrop-blur">
          <div className="mx-auto h-1.5 w-12 rounded-full bg-muted my-2" />
          <div className="px-4 pb-4">
            <p className="mb-3 text-xs text-muted-foreground"><span className="font-semibold text-foreground">{filtered.length}</span> pros near you</p>
            <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 scrollbar-hide">
              {filtered.map((p) => (
                <Link
                  key={p.service.id}
                  to="/services/$id"
                  params={{ id: p.service.slug }}
                  onMouseEnter={() => setActive(p.service.id)}
                  className={`group flex w-72 shrink-0 gap-3 rounded-2xl border bg-card p-3 transition ${active === p.service.id ? "border-primary shadow-elegant" : "border-border hover:border-primary"}`}
                >
                  <img src={p.service.image} alt="" className="h-20 w-20 shrink-0 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="line-clamp-1 text-sm font-semibold">{p.service.title}</div>
                    <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="h-3 w-3 fill-warning text-warning" />{p.service.rating} · {p.service.provider.location}
                    </div>
                    <div className="mt-2 font-mono text-sm font-bold text-foreground">${p.service.price}<span className="text-xs font-normal text-muted-foreground"> from</span></div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
