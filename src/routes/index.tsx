import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Search, MapPin, Sparkles, Calendar, CreditCard, CalendarCheck, ShieldCheck, Clock, BadgeCheck, Percent, ArrowRight, Star } from "lucide-react";
import * as Icons from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ServiceCard } from "@/components/service-card";
import { CATEGORIES, SERVICES, TESTIMONIALS, OFFERS } from "@/lib/data";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SkillBuddy — Book Trusted Pros for 55+ Services" },
      { name: "description", content: "From cleaning to repairs, beauty to wellness — book background-checked pros in minutes. Trusted by 3.4M+ customers." },
      { property: "og:title", content: "SkillBuddy — Expert Help, Anytime, Anywhere" },
      { property: "og:description", content: "From cleaning to repairs, beauty to wellness — book background-checked pros in minutes." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <SiteShell>
      <Hero />
      <CategoryStrip />
      <PopularServices />
      <HowItWorks />
      <WhyChooseUs />
      <Offers />
      <Testimonials />
      <FinalCTA />
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
            <Sparkles className="h-3.5 w-3.5 text-primary" /> 50,000+ background-checked pros nationwide
          </div>
          <h1 className="font-display text-5xl font-extrabold leading-[1.05] sm:text-6xl md:text-7xl">
            Expert Help, <span className="text-gradient">Anytime,</span> Anywhere
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            Book trusted pros for 55+ home, personal, and professional services. Booked in minutes — guaranteed.
          </p>

          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
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

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            {["Cleaning", "Plumbing", "Beauty", "Tutoring", "Pet Care", "Moving"].map((t) => (
              <Link key={t} to="/services" className="hover:text-foreground">{t}</Link>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CategoryStrip() {
  return (
    <section className="border-y border-border bg-surface/30">
      <div className="mx-auto max-w-7xl overflow-x-auto px-4 py-6 scrollbar-hide sm:px-6">
        <div className="flex min-w-max gap-3">
          {CATEGORIES.map((c, i) => {
            const Icon = (Icons as never)[c.icon] ?? Icons.Sparkles;
            return (
              <motion.div key={c.slug} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }}>
                <Link
                  to="/services"
                  search={{ category: c.slug }}
                  className="flex w-32 flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 text-center transition hover:-translate-y-1 hover:border-primary hover:shadow-card"
                >
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="line-clamp-2 text-xs font-medium">{c.name}</div>
                </Link>
              </motion.div>
            );
          })}
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
          <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">Most-booked services</h2>
        </div>
        <Button asChild variant="ghost" className="hidden sm:inline-flex">
          <Link to="/services">View all <ArrowRight className="ml-1 h-4 w-4" /></Link>
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {popular.map((s, i) => <ServiceCard key={s.id} service={s} index={i} />)}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { icon: Search, title: "Choose a service", desc: "Browse 55+ trusted categories." },
    { icon: CreditCard, title: "Get a quote", desc: "Upfront, transparent pricing." },
    { icon: Calendar, title: "Pick your time", desc: "Book any day, any hour." },
    { icon: CalendarCheck, title: "Sit back & relax", desc: "Your pro shows up on time." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <p className="text-sm font-semibold text-primary">How it works</p>
        <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">Booked in four simple steps</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-4">
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="relative rounded-2xl border border-border bg-card p-6 shadow-card"
          >
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-elegant">
              <s.icon className="h-6 w-6" />
            </div>
            <div className="absolute right-5 top-5 text-3xl font-extrabold text-muted/40">0{i + 1}</div>
            <h3 className="text-lg font-bold">{s.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function useCounter(target: number, duration = 1400) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / duration);
        setN(Math.floor(p * target));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      obs.disconnect();
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);
  return { n, ref };
}

function WhyChooseUs() {
  const features = [
    { icon: ShieldCheck, title: "Trustworthy pros", desc: "Background-checked, insured, and rated." },
    { icon: Clock, title: "24/7 support", desc: "Real humans whenever you need us." },
    { icon: BadgeCheck, title: "Guaranteed quality", desc: "Happiness guarantee on every booking." },
    { icon: Percent, title: "Member discounts", desc: "Save up to 15% with a subscription." },
  ];
  const a = useCounter(3400000);
  const b = useCounter(50000);
  const c = useCounter(48);
  return (
    <section className="border-y border-border bg-surface/30 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold text-primary">Why SkillBuddy</p>
            <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">Trusted by millions, loved for the details</h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              We obsess over every booking so you don't have to. Vetted pros, fair prices, and a guarantee that has your back.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              <Stat ref_={a.ref} value={a.n.toLocaleString() + "+"} label="Jobs completed" />
              <Stat ref_={b.ref} value={b.n.toLocaleString() + "+"} label="Trusted pros" />
              <Stat ref_={c.ref} value={(c.n / 10).toFixed(1) + "★"} label="Avg. rating" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border border-border bg-card p-5 shadow-card"
              >
                <div className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label, ref_ }: { value: string; label: string; ref_: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div ref={ref_}>
      <div className="font-mono text-2xl font-extrabold text-foreground sm:text-3xl">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function Offers() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="mb-8">
        <p className="text-sm font-semibold text-primary">Limited time</p>
        <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">Special offers, just for you</h2>
      </div>
      <div className="-mx-4 flex gap-4 overflow-x-auto px-4 scrollbar-hide sm:gap-6">
        {OFFERS.map((o) => (
          <div key={o.id} className={`relative min-w-[300px] flex-1 overflow-hidden rounded-3xl bg-gradient-to-br ${o.accent} p-6 text-white shadow-elegant sm:min-w-[360px]`}>
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
            <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Offer</p>
            <h3 className="mt-2 text-2xl font-extrabold leading-tight">{o.title}</h3>
            <p className="mt-2 text-sm opacity-90">{o.subtitle}</p>
            <Button size="sm" className="mt-5 bg-white text-foreground hover:bg-white/90">{o.cta}</Button>
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <p className="text-sm font-semibold text-primary">Loved by customers</p>
        <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">What people are saying</h2>
      </div>
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border border-border bg-card p-6 shadow-card"
          >
            <div className="flex gap-0.5 text-warning">
              {Array.from({ length: t.rating }).map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-foreground/90">"{t.text}"</p>
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

function FinalCTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary to-primary-glow p-10 text-primary-foreground shadow-elegant sm:p-14">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/15 blur-3xl" />
        <div className="relative grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-center">
          <div>
            <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">Ready to get expert help?</h2>
            <p className="mt-3 max-w-lg opacity-90">Join 3.4M+ people who book trusted pros on SkillBuddy. First booking? Take 40% off.</p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Button asChild size="lg" className="bg-white text-foreground hover:bg-white/90">
              <Link to="/services">Browse services</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20">
              <Link to="/become-a-provider">Become a Pro</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
