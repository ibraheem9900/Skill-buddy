import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { motion, useInView, useMotionValue } from "framer-motion";
import { Search, Sparkles, Star, ClipboardList, Gavel, UserCheck, CircleCheck as CheckCircle2, BookOpen, Shield, Ban, ThumbsUp, Heart, Quote, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SERVICES, TESTIMONIALS, OFFERS } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { LogoIntro, useLogoIntro } from "@/components/logo-intro";

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
  const { showIntro, introComplete, handleIntroComplete } = useLogoIntro();

  return (
    <>
      {showIntro && <LogoIntro onComplete={handleIntroComplete} />}
      {introComplete && <AnimatedHomepage />}
    </>
  );
}

function AnimatedHomepage() {
  return (
    <div
      className="h-screen w-full overflow-y-auto"
      style={{ scrollSnapType: "y mandatory" }}
    >
      <HeroSection />
      <PostJobSection />
      <CategoriesSection />
      <SpecialOffersSection />
      <PopularServicesSection />
      <HowItWorksSection />
      <FeaturesSection />
      <StarRewardSection />
      <VisionSection />
      <TestimonialsSection />
      <FooterSection />
    </div>
  );
}

function useScrollReveal(threshold = 0.3) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: threshold, once: false });
  return { ref, isInView };
}

function HeroSection() {
  const { t } = useI18n();
  const { ref, isInView } = useScrollReveal();

  return (
    <section
      ref={ref}
      className="h-screen w-full scroll-snap-align-start gradient-hero relative overflow-hidden"
      style={{ scrollSnapAlign: "start" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary-glow/5" />
      <div className="relative mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-4 sm:px-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
            transition={{ delay: 0.2 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-2 text-sm font-medium text-foreground/80 backdrop-blur"
          >
            <Sparkles className="h-4 w-4 text-primary" /> {t("hero.badge")}
          </motion.div>
          <WordByWordText
            text={`${t("hero.titleA")} ${t("hero.titleB")} ${t("hero.titleC")}`}
            highlightWord={t("hero.titleB")}
            active={isInView}
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
          >
            {t("hero.subtitle")}
          </motion.p>
        </motion.div>
      </div>
      <ScrollHint active={isInView} />
    </section>
  );
}

function WordByWordText({ text, highlightWord, active }: { text: string; highlightWord: string; active: boolean }) {
  const words = text.split(" ");

  return (
    <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
      {words.map((word, i) => {
        const isHighlight = word === highlightWord;
        return (
          <motion.span
            key={i}
            className={`inline-block ${isHighlight ? "text-gradient" : ""} mr-3`}
            initial={{ opacity: 0, y: 30 }}
            animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: i * 0.12 + 0.3, duration: 0.5, ease: "easeOut" }}
          >
            {word}
          </motion.span>
        );
      })}
    </h1>
  );
}

function ScrollHint({ active }: { active: boolean }) {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2"
      initial={{ opacity: 0, y: -10 }}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
      transition={{ delay: 1.5 }}
    >
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="flex flex-col items-center gap-2 text-muted-foreground"
      >
        <span className="text-xs font-medium">Scroll</span>
        <div className="h-8 w-5 rounded-full border-2 border-muted-foreground/40 p-1">
          <motion.div
            className="h-1.5 w-1.5 rounded-full bg-primary"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

function PostJobSection() {
  const { t } = useI18n();
  const { ref, isInView } = useScrollReveal();

  return (
    <section
      ref={ref}
      className="h-screen w-full scroll-snap-align-start bg-background"
      style={{ scrollSnapAlign: "start" }}
    >
      <div className="relative mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-4 sm:px-6">
        <motion.h2
          initial={{ y: 40, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 text-center font-display text-3xl font-extrabold sm:text-4xl"
        >
          {t("sec.postJob")}
        </motion.h2>
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mb-8 text-center text-lg text-muted-foreground"
        >
          {t("sec.postJobDesc")}
        </motion.p>
        <motion.form
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={isInView ? { scale: 1, opacity: 1, y: 0 } : { scale: 0.8, opacity: 0, y: 30 }}
          transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 100 }}
          onSubmit={(e) => e.preventDefault()}
          className="mx-auto flex w-full max-w-2xl items-stretch gap-2 rounded-2xl border border-border bg-card p-2 shadow-elegant"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder={t("hero.searchPlaceholder")} className="h-12 border-0 bg-transparent pl-10 focus-visible:ring-0" />
          </div>
          <Button asChild size="lg" className="h-12 px-6 shadow-elegant">
            <Link to="/services">{t("common.search")}</Link>
          </Button>
        </motion.form>
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 flex flex-wrap justify-center gap-2"
        >
          {["Cleaning", "Repair", "Tutoring", "Moving"].map((tag, i) => (
            <motion.span
              key={tag}
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : { scale: 0 }}
              transition={{ delay: 0.7 + i * 0.1, type: "spring", stiffness: 200 }}
              className="rounded-full border border-border bg-surface/50 px-3 py-1 text-sm text-muted-foreground"
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CategoriesSection() {
  const { t } = useI18n();
  const { ref, isInView } = useScrollReveal();

  const categories = [
    { emoji: "🏠", name: t("cat.cleaning") },
    { emoji: "🔧", name: t("cat.repair") },
    { emoji: "📚", name: t("cat.tutoring") },
    { emoji: "🚚", name: t("cat.moving") },
    { emoji: "💻", name: t("cat.tech") },
    { emoji: "🎨", name: t("cat.design") },
  ];

  return (
    <section
      ref={ref}
      className="h-screen w-full scroll-snap-align-start bg-surface/30"
      style={{ scrollSnapAlign: "start" }}
    >
      <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-4 py-12 sm:px-6">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <p className="text-sm font-semibold text-primary">{t("sec.browse")}</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">{t("sec.categories")}</h2>
        </motion.div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4, type: "spring", stiffness: 120 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="cursor-pointer rounded-2xl border border-border bg-card p-5 text-center shadow-card transition-shadow hover:shadow-lg"
            >
              <span className="text-4xl">{cat.emoji}</span>
              <h3 className="mt-3 text-sm font-semibold">{cat.name}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SpecialOffersSection() {
  const { t } = useI18n();
  const { ref, isInView } = useScrollReveal();
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    if (isInView && revealed < OFFERS.length) {
      const timer = setTimeout(() => setRevealed((r) => Math.min(r + 1, OFFERS.length)), 400);
      return () => clearTimeout(timer);
    }
    if (!isInView) setRevealed(0);
  }, [isInView, revealed]);

  return (
    <section
      ref={ref}
      className="h-screen w-full scroll-snap-align-start bg-background"
      style={{ scrollSnapAlign: "start" }}
    >
      <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-4 py-12 sm:px-6">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <p className="text-sm font-semibold text-primary">{t("sec.limited")}</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">{t("sec.specialOffers")}</h2>
        </motion.div>
        <div className="relative h-64 sm:h-80">
          {OFFERS.map((o, i) => {
            const isRevealed = i < revealed;
            const stackOffset = i * 12;
            return (
              <motion.div
                key={o.id}
                initial={{ x: 300, opacity: 0, rotate: 5 }}
                animate={
                  isRevealed
                    ? { x: stackOffset, y: stackOffset * 0.5, opacity: 1, rotate: 0, scale: 1 - i * 0.02 }
                    : { x: 300, opacity: 0, rotate: 10 }
                }
                transition={{ duration: 0.5, type: "spring", stiffness: 80 }}
                whileHover={{ y: -10, scale: 1.03 }}
                className={`absolute left-0 top-0 min-h-[180px] w-full max-w-md rounded-3xl bg-gradient-to-br ${o.accent} p-6 text-white shadow-elegant sm:max-w-lg`}
                style={{ zIndex: OFFERS.length - i }}
              >
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
                <span className="self-start rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur">
                  {t("sec.limited")}
                </span>
                <h3 className="mt-3 font-display text-2xl font-extrabold leading-tight">{t(o.titleKey)}</h3>
                <p className="mt-2 text-sm text-white/90">{t(o.subKey)}</p>
                <button className="mt-4 self-start rounded-md bg-white px-4 py-2 text-sm font-bold !text-slate-900 shadow-elegant transition hover:bg-white/90">
                  {t(o.ctaKey)}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PopularServicesSection() {
  const { t } = useI18n();
  const { ref, isInView } = useScrollReveal();
  const popular = [...SERVICES].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 6);
  const y = useMotionValue(0);

  return (
    <section
      ref={ref}
      className="h-screen w-full scroll-snap-align-start bg-surface/30"
      style={{ scrollSnapAlign: "start" }}
    >
      <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-4 py-12 sm:px-6">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <p className="text-sm font-semibold text-primary">{t("sec.popular")}</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">{t("sec.popularServices")}</h2>
        </motion.div>
        <motion.div
          drag="y"
          style={{ y }}
          dragConstraints={{ top: -200, bottom: 0 }}
          className="relative flex max-h-[60vh] flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card/50 p-4"
        >
          {popular.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ x: -50, opacity: 0 }}
              animate={isInView ? { x: 0, opacity: 1 } : { x: -50, opacity: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              whileHover={{ x: 8, scale: 1.01 }}
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-3 shadow-card"
            >
              <div className="h-14 w-14 overflow-hidden rounded-full bg-gradient-to-br from-primary/20 to-primary-glow/20">
                <img src={s.image} alt={s.title} className="h-full w-full object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.provider}</p>
              </div>
              <div className="flex items-center gap-1 text-warning">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-sm font-medium">{s.rating}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-4 text-center text-sm text-muted-foreground"
        >
          {t("sec.dragToScroll")}
        </motion.p>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const { t } = useI18n();
  const { ref, isInView } = useScrollReveal();

  const steps = [
    { icon: BookOpen, key: "1" },
    { icon: ClipboardList, key: "2" },
    { icon: Gavel, key: "3" },
    { icon: UserCheck, key: "4" },
    { icon: CheckCircle2, key: "5" },
  ];

  return (
    <section
      ref={ref}
      className="h-screen w-full scroll-snap-align-start bg-background"
      style={{ scrollSnapAlign: "start" }}
    >
      <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-4 py-12 sm:px-6">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-10 max-w-2xl text-center"
        >
          <p className="text-sm font-semibold text-primary">{t("sec.howItWorks")}</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">{t("sec.howTitle")}</h2>
        </motion.div>
        <div className="relative">
          <svg className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px w-full lg:block" viewBox="0 0 1200 0" preserveAspectRatio="none">
            <motion.path
              d="M 0 0 L 1200 0"
              fill="none"
              stroke="url(#steps-gradient)"
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="steps-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="20%" stopColor="var(--color-primary)" />
                <stop offset="80%" stopColor="var(--color-primary)" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
          <div className="grid gap-4 lg:grid-cols-5">
            {steps.map((s, i) => (
              <motion.div
                key={s.key}
                initial={{ scale: 0, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                transition={{ delay: 0.4 + i * 0.12, duration: 0.4, type: "spring", stiffness: 150 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="relative rounded-2xl border border-border bg-card p-4 text-center shadow-card"
              >
                <motion.div
                  whileHover={{ rotate: [0, -8, 8, 0], scale: 1.08 }}
                  transition={{ duration: 0.5 }}
                  className="relative mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-elegant"
                >
                  <s.icon className="h-6 w-6" />
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : { scale: 0 }}
                    transition={{ delay: 0.5 + i * 0.12, type: "spring", stiffness: 200 }}
                    className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-background font-mono text-xs font-bold text-primary ring-2 ring-primary"
                  >
                    {i + 1}
                  </motion.span>
                </motion.div>
                <h3 className="font-display text-sm font-bold">{t(`step.${s.key}.title`)}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{t(`step.${s.key}.desc`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const { t } = useI18n();
  const { ref, isInView } = useScrollReveal();
  const [revealed, setRevealed] = useState(0);

  const features = [
    { icon: Shield, title: t("sec.special.verifiedTitle"), desc: t("sec.special.verifiedDesc") },
    { icon: Ban, title: t("sec.special.noHiddenTitle"), desc: t("sec.special.noHiddenDesc") },
    { icon: ThumbsUp, title: t("sec.special.satisfactionTitle"), desc: t("sec.special.satisfactionDesc") },
    { icon: Heart, title: t("sec.special.trustTitle"), desc: t("sec.special.trustDesc") },
  ];

  useEffect(() => {
    if (isInView && revealed < features.length) {
      const timer = setTimeout(() => setRevealed((r) => Math.min(r + 1, features.length)), 350);
      return () => clearTimeout(timer);
    }
    if (!isInView) setRevealed(0);
  }, [isInView, revealed, features.length]);

  return (
    <section
      ref={ref}
      className="h-screen w-full scroll-snap-align-start bg-[#0D1117]"
      style={{ scrollSnapAlign: "start" }}
    >
      <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-4 py-12 sm:px-6">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <p className="text-sm font-semibold text-primary">{t("sec.special.badge")}</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-white sm:text-4xl">{t("sec.special.title")}</h2>
        </motion.div>
        <div className="relative h-[50vh]">
          {features.map((f, i) => {
            const isRevealed = i < revealed;
            const offset = i * 15;
            return (
              <motion.div
                key={i}
                initial={{ y: 80, x: i * 40, opacity: 0, rotate: -3 }}
                animate={
                  isRevealed
                    ? { y: offset, x: i * 30, opacity: 1, rotate: 0, scale: 1 - i * 0.02 }
                    : { y: 120, x: i * 60, opacity: 0, rotate: -5 }
                }
                transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                whileHover={{ y: -12 + offset, scale: 1.03 }}
                className="absolute left-0 top-0 w-full max-w-sm rounded-2xl border-2 border-[#2D7A5F]/30 bg-[#161B22] p-6 sm:max-w-md"
                style={{ zIndex: features.length - i }}
              >
                <div className="mb-3 inline-flex rounded-xl bg-[#2D7A5F]/10 p-3 text-[#4CAF84]">
                  <f.icon className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-bold text-white">{f.title}</h3>
                <p className="mt-2 text-sm text-[#8B949E]">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function StarRewardSection() {
  const { t } = useI18n();
  const { ref, isInView } = useScrollReveal();

  const stars = [
    { level: 1, benefits: [t("sec.star.benefit1")] },
    { level: 2, benefits: [t("sec.star.benefit2")] },
    { level: 3, benefits: [t("sec.star.benefit3")] },
  ];

  return (
    <section
      ref={ref}
      className="h-screen w-full scroll-snap-align-start border-y border-border bg-surface/30"
      style={{ scrollSnapAlign: "start" }}
    >
      <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-4 py-12 sm:px-6">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-8 max-w-2xl text-center"
        >
          <p className="text-sm font-semibold text-primary">{t("sec.star.badge")}</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">{t("sec.star.title")}</h2>
        </motion.div>
        <div className="grid gap-6 lg:grid-cols-3">
          {stars.map((s, i) => (
            <motion.div
              key={i}
              initial={{ y: 50, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className={`relative overflow-hidden rounded-2xl border-2 p-6 ${
                i === 2
                  ? "border-[#FCD34D] bg-gradient-to-br from-[#FCD34D]/10 to-transparent dark:border-[#F59E0B]"
                  : "border-border bg-card"
              }`}
            >
              <div className="mb-4 flex items-center gap-1">
                {Array.from({ length: s.level }).map((_, j) => (
                  <motion.div
                    key={j}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
                    transition={{ delay: i * 0.15 + j * 0.1, type: "spring", stiffness: 200 }}
                    className={i === 2 ? "text-[#FCD34D] dark:text-[#F59E0B]" : "text-primary"}
                  >
                    <Star className="h-8 w-8 fill-current" />
                  </motion.div>
                ))}
              </div>
              <h3 className="text-xl font-bold">{t(`sec.star.level${s.level}`)}</h3>
              <ul className="mt-4 space-y-2">
                {s.benefits.map((b, j) => (
                  <li key={j} className="flex items-center gap-2 text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {b}
                  </li>
                ))}
              </ul>
              {i === 2 && (
                <motion.div
                  className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#FCD34D]/20 blur-3xl dark:bg-[#F59E0B]/20"
                  animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function VisionSection() {
  const { t } = useI18n();
  const { ref, isInView } = useScrollReveal();

  const pillars = [
    { title: t("sec.vision.pillar1Title"), desc: t("sec.vision.pillar1Desc") },
    { title: t("sec.vision.pillar2Title"), desc: t("sec.vision.pillar2Desc") },
    { title: t("sec.vision.pillar3Title"), desc: t("sec.vision.pillar3Desc") },
  ];

  return (
    <section
      ref={ref}
      className="h-screen w-full scroll-snap-align-start bg-background"
      style={{ scrollSnapAlign: "start" }}
    >
      <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-4 py-12 sm:px-6">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-8 max-w-2xl text-center"
        >
          <p className="text-sm font-semibold text-primary">{t("sec.vision.badge")}</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">{t("sec.vision.title")}</h2>
        </motion.div>
        <div className="grid gap-8 lg:grid-cols-3">
          {pillars.map((p, i) => (
            <motion.div
              key={i}
              initial={{ y: 60, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : { y: 60, opacity: 0 }}
              transition={{ delay: i * 0.2, duration: 0.6, type: "spring", stiffness: 80 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="relative rounded-2xl border border-border bg-card p-8 shadow-card"
            >
              <motion.div
                className="absolute left-0 top-8 h-20 w-1 rounded-full bg-primary"
                animate={{ scaleY: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
              />
              <motion.div
                className="mb-4 h-1 w-12 rounded-full bg-gradient-to-r from-primary to-primary-glow"
                animate={{ width: ["48px", "72px", "48px"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <h3 className="text-xl font-bold">{p.title}</h3>
              <p className="mt-3 text-muted-foreground">{p.desc}</p>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.8 }}
          className="mt-10 text-center"
        >
          <Button asChild size="lg" className="shadow-elegant">
            <Link to="/careers">{t("sec.vision.cta")}</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const { t } = useI18n();
  const { ref, isInView } = useScrollReveal();

  return (
    <section
      ref={ref}
      className="h-screen w-full scroll-snap-align-start bg-surface/30"
      style={{ scrollSnapAlign: "start" }}
    >
      <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-4 py-12 sm:px-6">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-8 max-w-2xl text-center"
        >
          <p className="text-sm font-semibold text-primary">{t("sec.loved")}</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">{t("sec.testimonials")}</h2>
        </motion.div>
        <div className="grid auto-rows-fr grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.map((tt, i) => (
            <motion.div
              key={tt.id}
              initial={{ y: 30, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-card"
            >
              <motion.div
                animate={{ y: [-2, 2, -2] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
              >
                <Quote className="mb-2 h-6 w-6 text-primary/30" />
                <div className="flex gap-0.5 text-warning">
                  {Array.from({ length: tt.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-current" />
                  ))}
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FooterSection() {
  const { t } = useI18n();
  const { ref, isInView } = useScrollReveal();

  return (
    <section
      ref={ref}
      className="h-screen w-full scroll-snap-align-start border-t border-border bg-card"
      style={{ scrollSnapAlign: "start" }}
    >
      <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-4 py-12 sm:px-6">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: -50, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="grid gap-8 lg:grid-cols-4"
        >
          <div className="lg:col-span-2">
            <h3 className="font-display text-2xl font-bold">SkillBuddy</h3>
            <p className="mt-3 max-w-sm text-muted-foreground">{t("footer.description")}</p>
            <div className="mt-4 flex gap-3">
              {["twitter", "linkedin", "facebook"].map((social) => (
                <motion.a
                  key={social}
                  href={`https://${social}.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface transition hover:bg-primary hover:text-primary-foreground"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold">{t("footer.company")}</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground">{t("footer.about")}</Link></li>
              <li><Link to="/careers" className="hover:text-foreground">{t("footer.careers")}</Link></li>
              <li><Link to="/contact" className="hover:text-foreground">{t("footer.contact")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">{t("footer.support")}</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/help" className="hover:text-foreground">{t("footer.help")}</Link></li>
              <li><Link to="/privacy" className="hover:text-foreground">{t("footer.privacy")}</Link></li>
              <li><Link to="/terms" className="hover:text-foreground">{t("footer.terms")}</Link></li>
            </ul>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground"
        >
          {t("footer.copyright")}
        </motion.div>
      </div>
    </section>
  );
}
