import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Search, Sparkles, ArrowRight, Star, ClipboardList, Gavel, UserCheck, CheckCircle2, BookOpen } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ServiceCard } from "@/components/service-card";
import { CategoriesSlider } from "@/components/categories-slider";
import { BecomeSkillBuddyBanner } from "@/components/become-skillbuddy-banner";
import { SERVICES, TESTIMONIALS, OFFERS } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

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
  const { t } = useI18n();
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
            <Sparkles className="h-3.5 w-3.5 text-primary" /> {t("hero.badge")}
          </div>
          <h1 className="font-display text-5xl font-extrabold leading-[1.05] sm:text-6xl md:text-7xl">
            {t("hero.titleA")} <span className="text-gradient">{t("hero.titleB")}</span> {t("hero.titleC")}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">{t("hero.subtitle")}</p>

          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            onSubmit={(e) => e.preventDefault()}
            className="mx-auto mt-8 flex max-w-2xl items-stretch gap-2 rounded-2xl border border-border bg-card p-2 shadow-elegant"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder={t("hero.searchPlaceholder")} className="h-12 border-0 bg-transparent pl-10 focus-visible:ring-0" />
            </div>
            <Button asChild size="lg" className="h-12 px-6 shadow-elegant">
              <Link to="/services">{t("common.search")}</Link>
            </Button>
          </motion.form>
        </motion.div>
      </div>
    </section>
  );
}

function CategoriesSection() {
  const { t } = useI18n();
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-primary">{t("sec.browse")}</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">{t("sec.categories")}</h2>
        </div>
        <Button asChild variant="ghost" className="hidden sm:inline-flex">
          <Link to="/categories">{t("common.viewAll")} <ArrowRight className="ml-1 h-4 w-4" /></Link>
        </Button>
      </div>
      <CategoriesSlider />
    </section>
  );
}

function SpecialOffers() {
  const { t } = useI18n();
  return (
    <section className="border-y border-border bg-surface/30 py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-6">
          <p className="text-sm font-semibold text-primary">{t("sec.limited")}</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">{t("sec.specialOffers")}</h2>
        </div>
        <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:gap-6">
          {OFFERS.map((o) => (
            <div
              key={o.id}
              className={`relative flex min-h-[260px] min-w-[300px] flex-1 flex-col overflow-hidden rounded-3xl bg-gradient-to-br ${o.accent} p-6 text-white shadow-elegant sm:min-w-[340px]`}
            >
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
              <span className="self-start rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur">
                {t("sec.limited")}
              </span>
              <h3 className="mt-3 font-display text-2xl font-extrabold leading-tight text-white">{o.title}</h3>
              <p className="mt-2 text-sm text-white/90">{o.subtitle}</p>
              <button className="mt-auto self-start rounded-md bg-white px-4 py-2 text-sm font-bold !text-slate-900 shadow-elegant transition hover:bg-white/90">
                {o.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PopularServices() {
  const { t } = useI18n();
  const popular = [...SERVICES].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 8);
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-primary">{t("sec.popular")}</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">{t("sec.mostBooked")}</h2>
        </div>
        <Button asChild variant="ghost" className="hidden sm:inline-flex">
          <Link to="/services">{t("common.viewAll")} <ArrowRight className="ml-1 h-4 w-4" /></Link>
        </Button>
      </div>
      <div className="grid auto-rows-fr grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {popular.map((s, i) => <ServiceCard key={s.id} service={s} index={i} />)}
      </div>
    </section>
  );
}

function HowItWorks() {
  const { t } = useI18n();
  const steps = [
    { icon: BookOpen, key: "1" },
    { icon: ClipboardList, key: "2" },
    { icon: Gavel, key: "3" },
    { icon: UserCheck, key: "4" },
    { icon: CheckCircle2, key: "5" },
  ];
  return (
    <section className="border-y border-border bg-surface/30 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-sm font-semibold text-primary">{t("sec.howItWorks")}</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">{t("sec.howTitle")}</h2>
        </div>
        <div className="relative">
          <div className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent lg:block" />
          <div className="grid gap-6 lg:grid-cols-5">
            {steps.map((s, i) => (
              <motion.div
                key={s.key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="relative rounded-2xl border border-border bg-card p-5 text-center shadow-card"
              >
                <motion.div
                  whileHover={{ rotate: [0, -8, 8, 0], scale: 1.08 }}
                  transition={{ duration: 0.5 }}
                  className="relative mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-elegant"
                >
                  <s.icon className="h-6 w-6" />
                  <span className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-background font-mono text-xs font-bold text-primary ring-2 ring-primary">
                    {i + 1}
                  </span>
                </motion.div>
                <h3 className="font-display text-base font-bold">{t(`step.${s.key}.title`)}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{t(`step.${s.key}.desc`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MostBooked() {
  const { t } = useI18n();
  const list = [...SERVICES].sort((a, b) => b.reviewCount - a.reviewCount).slice(8, 12);
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="mb-8">
        <p className="text-sm font-semibold text-primary">{t("sec.trending")}</p>
        <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{t("sec.mostBooked")}</h2>
      </div>
      <div className="grid auto-rows-fr grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {list.map((s, i) => <ServiceCard key={s.id} service={s} index={i} />)}
      </div>
    </section>
  );
}

function Testimonials() {
  const { t } = useI18n();
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <p className="text-sm font-semibold text-primary">{t("sec.loved")}</p>
        <h2 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">{t("sec.testimonials")}</h2>
      </div>
      <div className="grid auto-rows-fr grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
        {TESTIMONIALS.map((tt, i) => (
          <motion.div
            key={tt.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-card"
          >
            <div className="flex gap-0.5 text-warning">
              {Array.from({ length: tt.rating }).map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}
            </div>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/90">"{tt.text}"</p>
            <div className="mt-4 flex items-center gap-3">
              <img src={tt.avatar} alt={tt.name} className="h-10 w-10 rounded-full" />
              <div>
                <div className="text-sm font-semibold">{tt.name}</div>
                <div className="text-xs text-muted-foreground">{tt.role}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
