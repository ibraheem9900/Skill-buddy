import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { getService, SERVICES } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Star, MapPin, Play, BadgeCheck, Share2, ArrowLeft, ClipboardList } from "lucide-react";
import { useState } from "react";
import { QRDownloadModal } from "@/components/qr-download-modal";
import { ServiceCard } from "@/components/service-card";

export const Route = createFileRoute("/services/$id")({
  head: ({ params }) => {
    const s = getService(params.id);
    return {
      meta: [
        { title: `${s?.title ?? "Service"} — SkillBuddy` },
        { name: "description", content: s?.description ?? "Service detail on SkillBuddy" },
        { property: "og:title", content: s?.title ?? "SkillBuddy" },
        { property: "og:description", content: s?.description ?? "" },
        ...(s ? [{ property: "og:image", content: s.image }, { name: "twitter:image", content: s.image }] : []),
      ],
    };
  },
  component: ServiceDetail,
});

const reviews = [
  { name: "Jordan Lee", avatar: "https://i.pravatar.cc/100?img=7", date: "2 weeks ago", rating: 5, text: "Absolutely outstanding service. Professional, punctual, and friendly. Will book again." },
  { name: "Riley Chen", avatar: "https://i.pravatar.cc/100?img=21", date: "1 month ago", rating: 5, text: "Exceeded my expectations. The booking flow was easy and the pro was clearly experienced." },
  { name: "Casey Park", avatar: "https://i.pravatar.cc/100?img=18", date: "1 month ago", rating: 4, text: "Great work overall. Slightly late but communicated well and made up for it with quality." },
  { name: "Morgan Diaz", avatar: "https://i.pravatar.cc/100?img=30", date: "2 months ago", rating: 5, text: "Highly recommend. Detailed, polite, and the results were exactly what I asked for." },
];

function ServiceDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const service = getService(id);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  if (!service) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-2xl px-4 py-24 text-center">
          <h1 className="text-2xl font-bold">Service not found</h1>
          <Button asChild className="mt-6"><Link to="/services">Back to services</Link></Button>
        </div>
      </SiteShell>
    );
  }

  const related = SERVICES.filter((s) => s.categorySlug === service.categorySlug && s.id !== service.id).slice(0, 4);

  return (
    <SiteShell>
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <button onClick={() => navigate({ to: "/services" })} className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-muted">
              <img src={service.gallery[active]} alt={service.title} className="h-full w-full object-cover" />
              <button className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 grid h-16 w-16 place-items-center rounded-full bg-white/90 text-foreground shadow-elegant transition hover:scale-105">
                <Play className="h-7 w-7 translate-x-0.5 fill-current" />
              </button>
              <div className="absolute right-4 top-4 flex gap-2">
                <button className="grid h-10 w-10 place-items-center rounded-full bg-background/80 backdrop-blur"><Share2 className="h-4 w-4" /></button>
              </div>
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide">
              {service.gallery.map((img, i) => (
                <button key={i} onClick={() => setActive(i)} className={`relative aspect-square w-20 shrink-0 overflow-hidden rounded-xl border-2 transition ${active === i ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"}`}>
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>

            <div className="mt-8">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{service.category}</Badge>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-warning text-warning" />
                  <span className="font-semibold">{service.rating}</span>
                  <span className="text-muted-foreground">({service.reviewCount} reviews)</span>
                </div>
              </div>
              <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">{service.title}</h1>
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />{service.provider.location}
              </div>

              <Tabs defaultValue="about" className="mt-8">
                <TabsList>
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="gallery">Gallery</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                <TabsContent value="about" className="mt-6 space-y-5">
                  <p className="leading-relaxed text-foreground/90">{service.longDescription}</p>
                  <div>
                    <h3 className="font-bold">What's included</h3>
                    <ul className="mt-2 grid gap-1.5 text-sm text-muted-foreground sm:grid-cols-2">
                      {["Free consultation", "All tools and supplies", "Satisfaction guarantee", "Background-checked pro", "Insurance coverage", "On-time arrival"].map((x) => (
                        <li key={x} className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-primary" />{x}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-center gap-3">
                      <img src={service.provider.avatar} alt="" className="h-14 w-14 rounded-full" />
                      <div>
                        <div className="flex items-center gap-1.5 font-semibold">{service.provider.name}{service.provider.verified && <BadgeCheck className="h-4 w-4 text-primary" />}</div>
                        <div className="text-xs text-muted-foreground">{service.provider.location}</div>
                      </div>
                      <Button asChild variant="outline" size="sm" className="ml-auto"><Link to="/providers/$id" params={{ id: service.provider.id }}>View profile</Link></Button>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">{service.provider.bio}</p>
                  </div>
                </TabsContent>
                <TabsContent value="gallery" className="mt-6">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {service.gallery.map((img, i) => (
                      <div key={i} className="aspect-square overflow-hidden rounded-xl bg-muted">
                        <img src={img} alt="" className="h-full w-full object-cover transition hover:scale-105" />
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="reviews" className="mt-6 space-y-6">
                  <div className="grid gap-6 rounded-2xl border border-border bg-card p-5 sm:grid-cols-[200px_1fr]">
                    <div className="text-center sm:border-r sm:border-border sm:pr-5">
                      <div className="font-display text-5xl font-extrabold">{service.rating}</div>
                      <div className="mt-1 flex justify-center text-warning">
                        {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-4 w-4 ${i < Math.round(service.rating) ? "fill-current" : ""}`} />)}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">{service.reviewCount} reviews</div>
                    </div>
                    <div className="space-y-2">
                      {[{ l: "Excellent", v: 78 }, { l: "Good", v: 16 }, { l: "Average", v: 4 }, { l: "Poor", v: 2 }].map((b) => (
                        <div key={b.l} className="flex items-center gap-3 text-xs">
                          <span className="w-20 text-muted-foreground">{b.l}</span>
                          <Progress value={b.v} className="h-2 flex-1" />
                          <span className="w-10 text-right font-medium">{b.v}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    {reviews.map((r) => (
                      <div key={r.name} className="rounded-2xl border border-border bg-card p-5">
                        <div className="flex items-center gap-3">
                          <img src={r.avatar} alt="" className="h-10 w-10 rounded-full" />
                          <div className="flex-1">
                            <div className="font-semibold">{r.name}</div>
                            <div className="text-xs text-muted-foreground">{r.date}</div>
                          </div>
                          <div className="flex text-warning">
                            {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}
                          </div>
                        </div>
                        <p className="mt-3 text-sm text-foreground/90">{r.text}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-elegant">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Starting at</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-mono text-4xl font-extrabold text-primary">€{service.price}</span>
                <span className="font-mono text-sm text-muted-foreground">· {service.price * 10} pts</span>
              </div>
              <Button onClick={() => setOpen(true)} size="lg" className="mt-6 h-12 w-full gap-2 shadow-elegant">
                <ClipboardList className="h-5 w-5" /> Post a Job
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Get bids from verified pros within minutes.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3 text-center text-xs">
                <div className="rounded-xl bg-surface p-3"><div className="font-bold">100%</div><div className="text-muted-foreground">Money-back</div></div>
                <div className="rounded-xl bg-surface p-3"><div className="font-bold">24/7</div><div className="text-muted-foreground">Support</div></div>
              </div>
            </div>

            {related.length > 0 && (
              <div className="rounded-3xl border border-border bg-card p-4">
                <h3 className="px-2 pb-3 font-display text-sm font-bold uppercase tracking-wide text-muted-foreground">
                  More in {service.category}
                </h3>
                <div className="space-y-2">
                  {related.map((r) => (
                    <Link
                      key={r.id}
                      to="/services/$id"
                      params={{ id: r.slug }}
                      className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-accent"
                    >
                      <img src={r.image} alt="" className="h-14 w-14 shrink-0 rounded-lg object-cover" />
                      <div className="min-w-0 flex-1">
                        <div className="line-clamp-1 text-sm font-semibold">{r.title}</div>
                        <div className="font-mono text-xs text-primary">€{r.price} · {r.price * 10} pts</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      <div className="sticky bottom-0 z-30 border-t border-border bg-background/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs text-muted-foreground">Total Price</div>
            <div className="font-mono text-xl font-bold text-primary">€{service.price}</div>
            <div className="font-mono text-[10px] text-muted-foreground">{service.price * 10} pts</div>
          </div>
          <Button onClick={() => setOpen(true)} size="lg" className="flex-1 gap-2">
            <ClipboardList className="h-5 w-5" /> Post a Job
          </Button>
        </div>
      </div>

      <QRDownloadModal open={open} onOpenChange={setOpen} />
    </SiteShell>
  );
}
