import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Search, MapPin, Sparkles, ArrowRight, Star, ClipboardList, Gavel, UserCheck, CheckCircle2, BookOpen } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ServiceCard } from "@/components/service-card";
import { CategoriesSlider } from "@/components/categories-slider";
import { BecomeSkillBuddyBanner } from "@/components/become-skillbuddy-banner";
import { SERVICES, TESTIMONIALS, OFFERS } from "@/lib/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SkillBuddy — Post a Job, Get Bids, Hire Trusted Pros" },
      { name: "description", content: "Post a job, get bids, choose the best — your trusted help is one click away across the Baltics." },
      { property: "og:title", content: "SkillBuddy — Expert Help, Anytime, Anywhere" },
      { property: "og:description", content: "Post a job, get bids, choose the best." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <SiteShell>
      <Hero />
      <BecomeSkillBuddyBanner />
      <CategoriesSection />
      <SpecialOffers />
      <PopularServices />
      <HowItWorks />
      <MostBooked />
      <Testimonials />
    </SiteShell>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 gradient-hero opacity-90" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs font-medium text-foreground/80 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Verified pros across the Baltics
          </div>
          <h1 className="font-display text-5xl font-extrabold leading-[1.05] sm:text-6xl md:text-7xl">
            Expert Help, <span className="text-gradient">Anytime,</span> Anywhere
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Post a job, get bids, choose the best — your trusted help is one click away.
          </p>

          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            onSubmit={(e) => e.preventDefault()}
            className="mx-auto mt-8 flex max-w-2xl flex-col items-stretch gap-2 rounded-2xl border border-border bg-card p-2 shadow-elegant sm:flex-row"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder="What do you need help with?" className="h-12 border-0 bg-transparent pl-10 focus-visible:ring-0" />
            </div>
            <div className="hidden h-8 w-px self-center bg-border sm:block" />
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder="City or ZIP" className="h-12 border-0 bg-transparent pl-10 focus-visible:ring-0" />
            </div>
            <Button asChild size="lg" className="h-12 px-6 shadow-elegant">
              <Link to="/services">Search</Link>
            </Button>
          </motion.form>
        </motion.div>
      </div>
    </section>
  );
}

function CategoriesSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-primary">Browse</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">Service categories</h2>
        </div>
        <Button asChild variant="ghost" className="hidden sm:inline-flex">
          <Link to="/categories">View all <ArrowRight className="ml-1 h-4 w-4" /></Link>
        </Button>
      </div>
      <CategoriesSlider />
    </section>
  );
}

function SpecialOffers() {
  return (
    <section className="border-y border-border bg-surface/30 py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-6">
          <p className="text-sm font-semibold text-primary">Limited time</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">Special offers, just for you</h2>
        </div>
        <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-hide sm:gap-6">
          {OFFERS.map((o) => (
            <div
              key={o.id}
              className={`relative flex min-h-[260px] min-w-[300px] flex-1 flex-col overflow-hidden rounded-3xl bg-gradient-to-br ${o.accent} p-6 text-white shadow-elegant sm:min-w-[340px]`}
            >
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
              <span className="self-start rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur">
                Limited Time
              </span>
              <h3 className="mt-3 font-display text-2xl font-extrabold leading-tight">{o.title}</h3>
              <p className="mt-2 text-sm opacity-90">{o.subtitle}</p>
              <Button size="sm" className="mt-auto self-start bg-white text-foreground hover:bg-white/90">
                {o.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PopularServices() {
  const popular = [...SERVICES].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 8);
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-primary">Popular this week</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">Most-booked services</h2>
        </div>
        <Button asChild variant="ghost" className="hidden sm:inline-flex">
          <Link to="/services">View all <ArrowRight className="ml-1 h-4 w-4" /></Link>
        </Button>
      </div>
      <div className="grid auto-rows-fr grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {popular.map((s, i) => <ServiceCard key={s.id} service={s} index={i} />)}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { icon: BookOpen, title: "Book a Service", desc: "Browse 30+ trusted categories." },
    { icon: ClipboardList, title: "Post a Job", desc: "Describe the work in seconds." },
    { icon: Gavel, title: "Get Bids", desc: "Verified pros send you offers." },
    { icon: UserCheck, title: "Choose the SkillBuddy", desc: "Pick your favourite and confirm." },
    { icon: CheckCircle2, title: "Job Done ✓", desc: "Pay securely after the job is finished." },
  ];
  return (
    <section className="border-y border-border bg-surface/30 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-sm font-semibold text-primary">How it works</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">From idea to done in 5 steps</h2>
        </div>
        <div className="relative">
          <div className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent lg:block" />
          <div className="grid gap-6 lg:grid-cols-5">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="relative rounded-2xl border border-border bg-card p-5 text-center shadow-card"
              >
                <div className="relative mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-elegant">
                  <s.icon className="h-6 w-6" />
                  <span className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-background font-mono text-xs font-bold text-primary ring-2 ring-primary">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-display text-base font-bold">{s.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MostBooked() {
  const list = [...SERVICES].sort((a, b) => b.reviewCount - a.reviewCount).slice(8, 12);
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="mb-8">
        <p className="text-sm font-semibold text-primary">Trending now</p>
        <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Most booked services</h2>
      </div>
      <div className="grid auto-rows-fr grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {list.map((s, i) => <ServiceCard key={s.id} service={s} index={i} />)}
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <p className="text-sm font-semibold text-primary">Loved by customers</p>
        <h2 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">What people are saying</h2>
      </div>
      <div className="grid auto-rows-fr grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-card"
          >
            <div className="flex gap-0.5 text-warning">
              {Array.from({ length: t.rating }).map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}
            </div>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/90">"{t.text}"</p>
            <div className="mt-4 flex items-center gap-3">
              <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full" />
              <div>
                <div className="text-sm font-semibold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
