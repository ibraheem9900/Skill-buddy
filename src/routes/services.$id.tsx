import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { getService, SERVICES } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star, MapPin, Play, BadgeCheck, Share2, ArrowLeft, ClipboardList, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

type TabKey = "about" | "gallery" | "reviews";

function ServiceDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const service = getService(id);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState<TabKey>("about");
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

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

  const related = SERVICES.filter((s) => s.categorySlug === service.categorySlug && s.id !== service.id).slice(0, 5);

  return (
    <SiteShell>
      {/* Main content + sidebar */}
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_320px]">
        {/* LEFT: main content */}
        <div className="min-w-0">
          {/* Back button */}
          <button
            onClick={() => navigate({ to: "/services" })}
            className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>

          {/* SECTION 1 — Hero image */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-muted"
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImg}
                src={service.gallery[activeImg]}
                alt={service.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="h-full w-full object-cover"
              />
            </AnimatePresence>
            {/* Gradient overlay */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />
            {/* Play button */}
            <button className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 rounded-full bg-white/80 px-5 py-2.5 text-sm font-semibold text-foreground shadow-elegant backdrop-blur transition hover:bg-white/95 hover:scale-105">
              <Play className="h-5 w-5 fill-current" /> Demo Video
            </button>
            {/* Top buttons */}
            <div className="absolute left-4 top-4">
              <button
                onClick={() => navigate({ to: "/services" })}
                className="grid h-10 w-10 place-items-center rounded-full bg-background/80 backdrop-blur transition hover:bg-background"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            </div>
            <div className="absolute right-4 top-4">
              <button className="grid h-10 w-10 place-items-center rounded-full bg-background/80 backdrop-blur transition hover:bg-background">
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </motion.div>

          {/* Thumbnail strip */}
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {service.gallery.map((img, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 + 0.2, duration: 0.3 }}
                onClick={() => setActiveImg(i)}
                className={`relative aspect-square w-20 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                  activeImg === i ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
                {i === service.gallery.length - 1 && service.gallery.length > 5 && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/50 text-xs font-bold text-white">
                    +{service.gallery.length - 5}
                  </div>
                )}
              </motion.button>
            ))}
          </div>

          {/* SECTION 2 — Service info */}
          <div className="mt-8">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20">{service.category}</Badge>
              <div className="flex items-center gap-1 text-sm">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.round(service.rating) ? "fill-warning text-warning" : "text-muted-foreground/30"}`} />
                ))}
                <span className="ml-1 font-semibold">{service.rating}</span>
                <span className="text-muted-foreground">({service.reviewCount} reviews)</span>
              </div>
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="mt-3 font-display text-[22px] font-extrabold leading-tight sm:text-[28px]"
            >
              {service.title}
            </motion.h1>
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />{service.provider.location}
            </div>
          </div>

          {/* SECTION 3 — Tabs */}
          <div className="mt-8">
            {/* Tab bar */}
            <div className="flex border-b border-border">
              {(["about", "gallery", "reviews"] as TabKey[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-5 py-3 text-sm font-semibold capitalize transition ${
                    activeTab === tab ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Tab content with fade transition */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-6"
              >
                {activeTab === "about" && (
                  <div className="space-y-6">
                    <p className="leading-relaxed text-foreground/90">{service.longDescription}</p>
                    <div>
                      <h3 className="font-bold">What's included</h3>
                      <ul className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                        {["Free consultation", "All tools and supplies", "Satisfaction guarantee", "Background-checked pro", "Insurance coverage", "On-time arrival"].map((x) => (
                          <li key={x} className="flex items-center gap-2">
                            <BadgeCheck className="h-4 w-4 shrink-0 text-primary" />{x}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-bold">What to Expect</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        Our professionals arrive on time, introduce themselves, and walk you through the process before starting. They use professional-grade equipment and clean up after the job is done. Estimated duration: 2–4 hours depending on scope.
                      </p>
                    </div>
                    {/* Provider card */}
                    <div className="rounded-2xl border border-border bg-card p-5">
                      <div className="flex items-center gap-3">
                        <img src={service.provider.avatar} alt="" className="h-14 w-14 rounded-full" />
                        <div>
                          <div className="flex items-center gap-1.5 font-semibold">
                            {service.provider.name}
                            {service.provider.verified && <BadgeCheck className="h-4 w-4 text-primary" />}
                          </div>
                          <div className="text-xs text-muted-foreground">{service.provider.location}</div>
                        </div>
                        <Button asChild variant="outline" size="sm" className="ml-auto">
                          <Link to="/providers/$id" params={{ id: service.provider.id }}>View profile</Link>
                        </Button>
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground">{service.provider.bio}</p>
                    </div>
                  </div>
                )}

                {activeTab === "gallery" && (
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-semibold">Gallery ({service.gallery.length})</h3>
                      <button className="text-sm font-semibold text-primary hover:underline">View All</button>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {service.gallery.map((img, i) => (
                        <motion.button
                          key={i}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.05 }}
                          onClick={() => setLightboxImg(img)}
                          className="aspect-square overflow-hidden rounded-xl bg-muted"
                        >
                          <img src={img} alt="" className="h-full w-full object-cover transition hover:scale-105" />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-6">
                    {/* Rating summary */}
                    <div className="grid gap-6 rounded-2xl border border-border bg-card p-5 sm:grid-cols-[200px_1fr]">
                      <div className="text-center sm:border-r sm:border-border sm:pr-5">
                        <div className="font-display text-5xl font-extrabold">{service.rating}</div>
                        <div className="mt-1 flex justify-center text-warning">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < Math.round(service.rating) ? "fill-current" : ""}`} />
                          ))}
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
                    {/* Individual reviews */}
                    <div className="space-y-4">
                      {reviews.map((r, i) => (
                        <motion.div
                          key={r.name}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.07 }}
                          className="rounded-2xl border border-border bg-card p-5"
                        >
                          <div className="flex items-center gap-3">
                            <img src={r.avatar} alt="" className="h-10 w-10 rounded-full" />
                            <div className="flex-1">
                              <div className="font-semibold">{r.name}</div>
                              <div className="text-xs text-muted-foreground">{r.date}</div>
                            </div>
                            <div className="flex text-warning">
                              {Array.from({ length: r.rating }).map((_, j) => (
                                <Star key={j} className="h-3.5 w-3.5 fill-current" />
                              ))}
                            </div>
                          </div>
                          <p className="mt-3 text-sm text-foreground/90">{r.text}</p>
                        </motion.div>
                      ))}
                    </div>
                    <Button onClick={() => setModalOpen(true)} className="w-full" variant="outline">
                      Write a Review
                    </Button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mobile: related services (horizontal scroll) */}
          {related.length > 0 && (
            <div className="mt-12 lg:hidden">
              <h3 className="mb-4 font-display text-lg font-bold">More in {service.category}</h3>
              <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    to="/services/$id"
                    params={{ id: r.slug }}
                    className="w-56 shrink-0 overflow-hidden rounded-2xl border border-border bg-card shadow-card transition hover:shadow-elegant"
                  >
                    <div className="h-28 overflow-hidden bg-muted">
                      <img src={r.image} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div className="p-3">
                      <div className="line-clamp-1 text-sm font-semibold">{r.title}</div>
                      <div className="mt-1 flex items-center justify-between">
                        <div className="font-mono text-sm font-bold text-primary">€{r.price}</div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Star className="h-3 w-3 fill-warning text-warning" /> {r.rating}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: sidebar — related services only */}
        <aside className="hidden lg:block">
          {related.length > 0 && (
            <div className="sticky top-24 rounded-3xl border border-border bg-card p-4">
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
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="h-3 w-3 fill-warning text-warning" /> {r.rating} ({r.reviewCount})
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* SECTION 4 — Sticky bottom bar (always visible) */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5, duration: 0.4, type: "spring", stiffness: 200 }}
        className="sticky bottom-0 z-30 border-t border-border bg-background/95 px-4 py-3 backdrop-blur"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div>
            <div className="text-xs text-muted-foreground">Total Price</div>
            <div className="font-mono text-xl font-bold text-primary">€{service.price}.00</div>
            <div className="font-mono text-[10px] text-muted-foreground">= {service.price * 10} pts</div>
          </div>
          <Button
            onClick={() => setModalOpen(true)}
            size="lg"
            className="gap-2 shadow-elegant"
          >
            <ClipboardList className="h-5 w-5" /> Post a Job
          </Button>
        </div>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImg(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          >
            <button
              onClick={() => setLightboxImg(null)}
              className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>
            <motion.img
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.25 }}
              src={lightboxImg}
              alt=""
              className="max-h-[90vh] max-w-full rounded-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <QRDownloadModal open={modalOpen} onOpenChange={setModalOpen} />
    </SiteShell>
  );
}
