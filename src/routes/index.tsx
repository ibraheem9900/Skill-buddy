"use client";

import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState, type ReactElement } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Sparkles, ArrowRight, Star, Shield, Ban, ThumbsUp, Heart,
  ClipboardList, Gavel, UserCheck, CircleCheck as CheckCircle2, BookOpen,
  Mail, Facebook, Instagram, Twitter, Youtube,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CategoryCard } from "@/components/category-card";
import { Navbar } from "@/components/navbar";
import { SERVICES, TESTIMONIALS, OFFERS, CATEGORIES } from "@/lib/data";
import { CATEGORIES_FULL } from "@/lib/categories";
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

const SECTION_COUNT = 11;
const SPECIAL_OFFERS_IDX = 3;
const POPULAR_SERVICES_IDX = 4;
const WHAT_MAKES_IDX = 6;
const easeExpo = [0.22, 1, 0.36, 1] as const;

function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>(Array(SECTION_COUNT).fill(null));
  const [activeSection, setActiveSection] = useState(0);
  const activeSectionRef = useRef(0);
  const [specialOffersCard, setSpecialOffersCard] = useState(0);
  const [popularServicesCard, setPopularServicesCard] = useState(0);
  const [featureCard, setFeatureCard] = useState(0);
  const specialOffersCardRef = useRef(0);
  const popularServicesCardRef = useRef(0);
  const featureCardRef = useRef(0);

  useEffect(() => { specialOffersCardRef.current = specialOffersCard; }, [specialOffersCard]);
  useEffect(() => { popularServicesCardRef.current = popularServicesCard; }, [popularServicesCard]);
  useEffect(() => { featureCardRef.current = featureCard; }, [featureCard]);
  useEffect(() => { activeSectionRef.current = activeSection; }, [activeSection]);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.height = "";
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observers: IntersectionObserver[] = [];
    sectionRefs.current.forEach((el, idx) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) setActiveSection(idx);
          });
        },
        { threshold: 0.5, root: container }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleWheel = (e: WheelEvent) => {
      const sec = activeSectionRef.current;
      if (e.deltaY > 0) {
        if (sec === SPECIAL_OFFERS_IDX && specialOffersCardRef.current < 3) {
          e.preventDefault(); setSpecialOffersCard((p) => p + 1); return;
        }
        if (sec === POPULAR_SERVICES_IDX && popularServicesCardRef.current < 7) {
          e.preventDefault(); setPopularServicesCard((p) => p + 1); return;
        }
        if (sec === WHAT_MAKES_IDX && featureCardRef.current < 4) {
          e.preventDefault(); setFeatureCard((p) => p + 1); return;
        }
      } else if (e.deltaY < 0) {
        if (sec === SPECIAL_OFFERS_IDX && specialOffersCardRef.current > 0) {
          e.preventDefault(); setSpecialOffersCard((p) => p - 1); return;
        }
        if (sec === POPULAR_SERVICES_IDX && popularServicesCardRef.current > 0) {
          e.preventDefault(); setPopularServicesCard((p) => p - 1); return;
        }
        if (sec === WHAT_MAKES_IDX && featureCardRef.current > 0) {
          e.preventDefault(); setFeatureCard((p) => p - 1); return;
        }
      }
    };
    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  const setRef = useCallback((idx: number) => (el: HTMLDivElement | null) => {
    sectionRefs.current[idx] = el;
  }, []);

  return (
    <>
      <Navbar />

      <div
        ref={containerRef}
        style={{
          height: "100vh",
          overflowY: "scroll",
          scrollSnapType: "y mandatory",
          scrollbarWidth: "none",
          position: "relative",
          zIndex: 10,
        }}
      >
        <style>{`::-webkit-scrollbar{display:none}`}</style>

        {(
          [
            <HeroSection isActive={activeSection === 0} />,
            <PostJobSection isActive={activeSection === 1} />,
            <CategoriesSection isActive={activeSection === 2} />,
            <SpecialOffersSection isActive={activeSection === 3} cardsDismissed={specialOffersCard} onDismiss={() => setSpecialOffersCard((p) => Math.min(OFFERS.length - 1, p + 1))} />,
            <PopularServicesSection isActive={activeSection === 4} activeCardIdx={popularServicesCard} onNavigate={(d) => setPopularServicesCard((p) => Math.max(0, Math.min(7, p + d)))} />,
            <HowItWorksSection isActive={activeSection === 5} />,
            <WhatMakesUsSpecialSection isActive={activeSection === 6} cardsDismissed={featureCard} />,
            <StarRewardSection isActive={activeSection === 7} />,
            <OurVisionSection isActive={activeSection === 8} />,
            <TestimonialsSection isActive={activeSection === 9} />,
            <FooterSection isActive={activeSection === 10} />,
          ] as ReactElement[]
        ).map((child, idx) => (
          <div
            key={idx}
            ref={setRef(idx)}
            style={{
              scrollSnapAlign: "start",
              height: idx === 10 ? "auto" : "100vh",
              minHeight: idx === 10 ? 0 : "100vh",
              overflow: "hidden",
              position: "relative",
              flexShrink: 0,
            }}
          >
            {child}
          </div>
        ))}
      </div>
    </>
  );
}

/* ── Section 0: Hero ───────────────────────────────────────────────────────── */

function HeroSection({ isActive }: { isActive: boolean }) {
  const { t } = useI18n();
  const titleWords = `${t("hero.titleA")} ${t("hero.titleB")} ${t("hero.titleC")}`.split(" ");
  return (
    <section className="relative flex h-full flex-col items-center justify-center overflow-hidden" style={{ paddingTop: 64 }}>
      <div className="absolute inset-0 gradient-hero opacity-90" />
      <div className="relative mx-auto w-full max-w-3xl px-4 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -8 }}
          animate={isActive ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.9, y: -8 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs font-medium text-foreground/80 backdrop-blur"
        >
          <Sparkles className="h-3.5 w-3.5 text-primary" /> {t("hero.badge")}
        </motion.div>

        <h1 className="font-display text-5xl font-extrabold leading-[1.05] sm:text-6xl md:text-7xl">
          {titleWords.map((word, i) => (
            <motion.span
              key={i}
              className="inline-block mr-3"
              style={{ willChange: "transform" }}
              initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
              animate={isActive ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 30, filter: "blur(4px)" }}
              transition={{ duration: 0.6, delay: isActive ? i * 0.08 : 0, ease: easeExpo }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.form
          onSubmit={(e) => e.preventDefault()}
          style={{ willChange: "transform" }}
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={isActive ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.97 }}
          transition={{ duration: 0.5, delay: isActive ? titleWords.length * 0.08 + 0.04 : 0, ease: easeExpo }}
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

        <motion.div
          className="mt-5 flex flex-wrap justify-center gap-3"
          style={{ willChange: "transform" }}
          initial={{ opacity: 0, y: 15 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.4, delay: isActive ? titleWords.length * 0.08 + 0.28 : 0 }}
        >
          <Button asChild size="lg" className="shadow-elegant">
            <Link to="/services">{t("common.viewAll")}</Link>
          </Button>
          <motion.div
            animate={isActive ? {
              boxShadow: [
                "0 0 0px rgba(45,122,95,0)",
                "0 0 20px rgba(45,122,95,0.7), 0 0 40px rgba(45,122,95,0.4)",
                "0 0 0px rgba(45,122,95,0)",
              ],
            } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ borderRadius: 50 }}
          >
            <motion.div
              whileHover={{ scale: 1.06, boxShadow: "0 0 30px rgba(45,122,95,0.9), 0 0 60px rgba(45,122,95,0.5)" }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.2 }}
              style={{ borderRadius: 50 }}
            >
              <Link
                to="/register"
                search={{ role: "provider" }}
                style={{
                  display: "inline-flex", alignItems: "center",
                  background: "#2D7A5F", color: "white", fontWeight: "bold",
                  fontSize: 16, borderRadius: 50, padding: "14px 32px",
                  textDecoration: "none", whiteSpace: "nowrap",
                }}
              >
                {t("nav.becomeSkillBuddy")}
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Section 1: Post a Job ─────────────────────────────────────────────────── */

function PostJobSection({ isActive }: { isActive: boolean }) {
  const { t } = useI18n();

  return (
    <section className="relative flex h-full flex-col items-center justify-center overflow-hidden bg-background" style={{ paddingTop: 64 }}>
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <motion.h2
          className="font-display text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl"
          style={{ willChange: "transform" }}
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={isActive ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.7, ease: easeExpo }}
        >
          {t("hero.subtitle")}
        </motion.h2>

        <motion.form
          onSubmit={(e) => e.preventDefault()}
          style={{ willChange: "transform" }}
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={isActive ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.9 }}
          transition={{ duration: 0.5, delay: isActive ? 0.2 : 0, type: "spring", stiffness: 300, damping: 20 }}
          className="mx-auto mt-10 flex max-w-2xl items-stretch gap-2 rounded-2xl border border-border bg-card p-2 shadow-elegant"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder={t("hero.searchPlaceholder")} className="h-12 border-0 bg-transparent pl-10 focus-visible:ring-0" />
          </div>
          <Button asChild size="lg" className="h-12 px-6 shadow-elegant">
            <Link to="/jobs">{t("nav.jobs")}</Link>
          </Button>
        </motion.form>
      </div>
    </section>
  );
}

/* ── Section 2: Categories ─────────────────────────────────────────────────── */

function CategoriesSection({ isActive }: { isActive: boolean }) {
  const { t } = useI18n();
  const visible = CATEGORIES_FULL.slice(0, 12);
  return (
    <section className="relative flex h-full flex-col justify-center overflow-hidden bg-background pt-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.6, ease: easeExpo }}
          >
            <p className="text-sm font-semibold text-primary">{t("sec.browse")}</p>
            <h2 className="mt-1 font-display text-3xl font-extrabold sm:text-4xl">{t("sec.categories")}</h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.4, delay: isActive ? 0.5 : 0 }}
          >
            <Button asChild variant="ghost">
              <Link to="/categories">{t("common.viewAll")} <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {visible.map((cat, i) => (
            <motion.div
              key={cat.slug}
              style={{ willChange: "transform" }}
              initial={{ opacity: 0, y: 50, scale: 0.88 }}
              animate={isActive ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.88 }}
              transition={{ duration: 0.55, delay: isActive ? i * 0.07 : 0, ease: "backOut" }}
              whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
            >
              <CategoryCard category={cat} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Section 3: Special Offers (stacked deck) ──────────────────────────────── */

function SpecialOffersSection({ isActive, cardsDismissed, onDismiss }: { isActive: boolean; cardsDismissed: number; onDismiss: () => void }) {
  const { t } = useI18n();
  const stackCfg = [
    { scale: 1.00, y: 0, zIndex: 3, opacity: 1 },
    { scale: 0.95, y: 18, zIndex: 2, opacity: 0.85 },
    { scale: 0.90, y: 36, zIndex: 1, opacity: 0.70 },
  ];
  const visibleOffers = OFFERS.slice(cardsDismissed);
  const currentCard = cardsDismissed + 1;

  return (
    <section className="relative flex h-full flex-col items-center justify-center overflow-hidden border-y border-border bg-surface/30">
      <div className="w-full px-4 sm:px-6 flex flex-col items-center" style={{ paddingTop: 80 }}>
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.5, ease: easeExpo }}
        >
          <p className="text-sm font-semibold text-primary">{t("sec.limited")}</p>
          <h2 className="mt-1 font-display text-3xl font-extrabold sm:text-4xl">{t("sec.specialOffers")}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            <span className="text-primary font-semibold">{currentCard}</span>
            <span className="text-muted-foreground"> / {OFFERS.length}</span>
          </p>
        </motion.div>

        <motion.div
          className="relative mx-auto w-full"
          style={{ height: 300, maxWidth: 560 }}
          initial={{ opacity: 0, y: 100 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
          transition={{ duration: 0.7, ease: easeExpo }}
        >
          <AnimatePresence mode="sync">
            {visibleOffers.map((offer, deckIdx) => {
              const cfg = stackCfg[deckIdx] ?? { scale: 0.84, y: 54, zIndex: 0, opacity: 0 };
              const isTop = deckIdx === 0;
              return (
                <motion.div
                  key={offer.id}
                  drag={isTop ? "y" : false}
                  dragConstraints={{ top: -250, bottom: 20 }}
                  dragElastic={0.12}
                  onDragEnd={(_e, info) => { if (info.offset.y < -100) onDismiss(); }}
                  style={{ position: "absolute", zIndex: cfg.zIndex, width: "100%", willChange: "transform", cursor: isTop ? "grab" : "default" }}
                  initial={false}
                  animate={{ scale: cfg.scale, y: cfg.y, opacity: deckIdx > 2 ? 0 : cfg.opacity }}
                  exit={{ y: "-110%", rotate: -6, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                >
                  <div
                    className={`relative flex min-h-[220px] flex-col overflow-hidden bg-gradient-to-br ${offer.accent} p-8 text-white`}
                    style={{ borderRadius: 24, boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}
                  >
                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
                    <span className="self-start rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur">
                      {t("sec.limited")}
                    </span>
                    <h3 className="mt-3 font-display text-2xl font-extrabold leading-tight text-white">{t(offer.titleKey)}</h3>
                    <p className="mt-2 text-sm text-white/90">{t(offer.subKey)}</p>
                    <button className="mt-auto self-start rounded-md bg-white px-4 py-2 text-sm font-bold !text-slate-900 shadow-elegant transition hover:bg-white/90">
                      {t(offer.ctaKey)}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        <div className="mt-6 flex justify-center gap-2">
          {OFFERS.map((_, i) => (
            <motion.div
              key={i}
              animate={{ width: i === cardsDismissed ? 24 : 8, backgroundColor: i === cardsDismissed ? "#2D7A5F" : "rgba(45,122,95,0.3)" }}
              className="h-2 rounded-full"
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Section 4: Popular Services (3-card horizontal carousel) ───────────────── */

const CAROUSEL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const CUR_W = 340;
const SIDE_W = 280;
const CARD_GAP = 28;
const SLOT_OFFSET = Math.round(CUR_W / 2 + CARD_GAP + SIDE_W / 2);

function PopularServicesSection({ isActive, activeCardIdx, onNavigate }: { isActive: boolean; activeCardIdx: number; onNavigate: (delta: number) => void }) {
  const { t } = useI18n();
  const popular = [...SERVICES].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 8);

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    if (info.offset.x < -80 && activeCardIdx < popular.length - 1) onNavigate(1);
    else if (info.offset.x > 80 && activeCardIdx > 0) onNavigate(-1);
  };

  return (
    <section className="relative flex h-full overflow-hidden bg-background">
      <div className="w-full flex flex-col" style={{ paddingTop: 80, paddingBottom: 24 }}>
        <motion.div
          className="px-6 mb-6 flex items-end justify-between gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: easeExpo }}
        >
          <div>
            <p className="text-sm font-semibold text-primary">{t("sec.popular")}</p>
            <h2 className="mt-1 font-display text-3xl font-extrabold sm:text-4xl">{t("sec.popularServices")}</h2>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/services">{t("common.viewAll")} <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </motion.div>

        <div className="relative flex flex-1 items-center">
          {/* Left arrow */}
          <motion.button
            onClick={() => onNavigate(-1)}
            disabled={activeCardIdx === 0}
            animate={{ opacity: activeCardIdx === 0 ? 0.3 : 1 }}
            whileHover={activeCardIdx > 0 ? { backgroundColor: "#2D7A5F", color: "white" } : {}}
            transition={{ duration: 0.2 }}
            style={{
              position: "absolute", left: 16, zIndex: 20,
              width: 48, height: 48, borderRadius: "50%",
              background: "rgba(45,122,95,0.15)", border: "1px solid #2D7A5F",
              color: "#2D7A5F", display: "flex", alignItems: "center", justifyContent: "center",
              cursor: activeCardIdx === 0 ? "not-allowed" : "pointer", flexShrink: 0,
            }}
          >
            <ChevronLeft size={22} />
          </motion.button>

          {/* Cards viewport */}
          <div className="relative flex-1 overflow-hidden" style={{ height: CUR_W + 20 }}>
            <div className="relative h-full flex items-center justify-center">
              {[-2, -1, 0, 1, 2].map((offset) => {
                const cardIdx = activeCardIdx + offset;
                if (cardIdx < 0 || cardIdx >= popular.length) return null;
                const svc = popular[cardIdx];
                const isCurrent = offset === 0;
                const isSide = Math.abs(offset) === 1;
                const xPos = offset * SLOT_OFFSET;
                const scale = isCurrent ? 1 : isSide ? 0.88 : 0.76;
                const opacity = isCurrent ? 1 : isSide ? 0.5 : 0;
                const blur = isCurrent ? 0 : isSide ? 2 : 4;
                const size = isCurrent ? CUR_W : SIDE_W;

                return (
                  <motion.div
                    key={svc.id}
                    drag={isCurrent ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.1}
                    onDragEnd={handleDragEnd}
                    animate={{ x: xPos, scale, opacity, filter: `blur(${blur}px)` }}
                    transition={{ duration: 0.4, ease: CAROUSEL_EASE }}
                    onClick={() => { if (!isCurrent) onNavigate(offset > 0 ? 1 : -1); }}
                    style={{
                      position: "absolute", width: size, height: size,
                      borderRadius: 20, overflow: "hidden", flexShrink: 0,
                      cursor: isCurrent ? "grab" : "pointer",
                      boxShadow: isCurrent
                        ? "0 8px 32px rgba(0,0,0,0.10)"
                        : "0 4px 16px rgba(0,0,0,0.08)",
                    }}
                    className="dark:[box-shadow:0_8px_32px_rgba(0,0,0,0.35)]"
                  >
                    {isCurrent ? (
                      <Link to="/services/$id" params={{ id: svc.slug }} className="block h-full w-full" onClick={(e) => e.stopPropagation()}>
                        <CardInner svc={svc} t={t} />
                      </Link>
                    ) : (
                      <CardInner svc={svc} t={t} />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right arrow */}
          <motion.button
            onClick={() => onNavigate(1)}
            disabled={activeCardIdx === popular.length - 1}
            animate={{ opacity: activeCardIdx === popular.length - 1 ? 0.3 : 1 }}
            whileHover={activeCardIdx < popular.length - 1 ? { backgroundColor: "#2D7A5F", color: "white" } : {}}
            transition={{ duration: 0.2 }}
            style={{
              position: "absolute", right: 16, zIndex: 20,
              width: 48, height: 48, borderRadius: "50%",
              background: "rgba(45,122,95,0.15)", border: "1px solid #2D7A5F",
              color: "#2D7A5F", display: "flex", alignItems: "center", justifyContent: "center",
              cursor: activeCardIdx === popular.length - 1 ? "not-allowed" : "pointer", flexShrink: 0,
            }}
          >
            <ChevronRight size={22} />
          </motion.button>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-4">
          {popular.map((_, i) => (
            <motion.div
              key={i}
              animate={{ width: i === activeCardIdx ? 24 : 8, backgroundColor: i === activeCardIdx ? "#2D7A5F" : "rgba(45,122,95,0.3)" }}
              className="h-2 rounded-full"
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function CardInner({ svc, t }: { svc: typeof SERVICES[0]; t: (k: string) => string }) {
  return (
    <div
      className="h-full w-full relative bg-card dark:bg-[#1e1e1e]"
      style={{ background: `url(${svc.image}) center/cover no-repeat` }}
    >
      <div
        className="absolute inset-0 flex flex-col justify-end p-5"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.82) 45%, transparent 100%)" }}
      >
        <div className="flex items-center gap-1.5 mb-1.5">
          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
          <span className="text-xs text-white/90 font-medium">{svc.rating} · {svc.reviewCount}</span>
        </div>
        <h3 className="font-display text-lg font-extrabold text-white leading-tight line-clamp-2">{svc.title}</h3>
        <p className="mt-1 text-xs text-white/75 line-clamp-2">{svc.description}</p>
      </div>
    </div>
  );
}

/* ── Section 5: How It Works ────────────────────────────────────────────────── */

const HOW_STEPS = [
  { Icon: BookOpen, key: "1" },
  { Icon: ClipboardList, key: "2" },
  { Icon: Gavel, key: "3" },
  { Icon: UserCheck, key: "4" },
  { Icon: CheckCircle2, key: "5" },
];

function HowItWorksSection({ isActive }: { isActive: boolean }) {
  const { t } = useI18n();
  const lineRef = useRef<SVGLineElement>(null);

  useEffect(() => {
    const line = lineRef.current;
    if (!line) return;
    const LEN = 2000;
    if (isActive) {
      line.style.strokeDasharray = `${LEN}`;
      line.style.strokeDashoffset = `${LEN}`;
      const raf = requestAnimationFrame(() => {
        line.style.transition = "stroke-dashoffset 1.4s ease 0.3s";
        line.style.strokeDashoffset = "0";
      });
      return () => cancelAnimationFrame(raf);
    } else {
      line.style.transition = "none";
      line.style.strokeDashoffset = `${LEN}`;
    }
  }, [isActive]);

  return (
    <section className="relative flex h-full flex-col justify-center overflow-hidden border-y border-border bg-surface/30 pt-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <motion.div
          className="mx-auto mb-10 max-w-2xl text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: easeExpo }}
        >
          <p className="text-sm font-semibold text-primary">{t("sec.howItWorks")}</p>
          <h2 className="mt-1 font-display text-3xl font-extrabold sm:text-4xl">{t("sec.howTitle")}</h2>
        </motion.div>

        <div className="relative">
          <div className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px lg:block">
            <svg width="100%" height="4" className="overflow-visible">
              <line ref={lineRef} x1="5%" y1="2" x2="95%" y2="2" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" strokeLinecap="round" className="text-primary" />
            </svg>
          </div>
          <div className="grid gap-5 lg:grid-cols-5">
            {HOW_STEPS.map(({ Icon, key }, i) => (
              <motion.div
                key={key}
                style={{ willChange: "transform" }}
                initial={{ opacity: 0, y: 30 }}
                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ delay: isActive ? 0.15 + i * 0.18 : 0, duration: 0.5, ease: easeExpo }}
                whileHover={{ y: -4, scale: 1.02, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
                className="relative rounded-2xl border border-border bg-card p-5 text-center shadow-card"
              >
                <motion.div
                  animate={isActive ? { rotate: [0, 360] } : { rotate: 0 }}
                  transition={{ delay: isActive ? 0.15 + i * 0.18 : 0, duration: 0.6 }}
                  className="relative mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-elegant"
                >
                  <Icon className="h-6 w-6" />
                  <span className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-background font-mono text-xs font-bold text-primary ring-2 ring-primary">
                    {i + 1}
                  </span>
                </motion.div>
                <h3 className="font-display text-base font-bold">{t(`step.${key}.title`)}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{t(`step.${key}.desc`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Section 6: What Makes Us Special (stacked deck) ───────────────────────── */

const FEATURES = [
  { Icon: Shield, titleKey: "sec.special.verifiedTitle", descKey: "sec.special.verifiedDesc" },
  { Icon: Ban, titleKey: "sec.special.noHiddenTitle", descKey: "sec.special.noHiddenDesc" },
  { Icon: ThumbsUp, titleKey: "sec.special.satisfactionTitle", descKey: "sec.special.satisfactionDesc" },
  { Icon: Heart, titleKey: "sec.special.trustTitle", descKey: "sec.special.trustDesc" },
];

function WhatMakesUsSpecialSection({ isActive, cardsDismissed }: { isActive: boolean; cardsDismissed: number }) {
  const { t } = useI18n();
  const stackCfg = [
    { scale: 1.0, y: 0, zIndex: 4 },
    { scale: 0.95, y: 14, zIndex: 3 },
    { scale: 0.90, y: 28, zIndex: 2 },
    { scale: 0.85, y: 42, zIndex: 1 },
  ];
  return (
    <section className="relative flex h-full flex-col items-center justify-center overflow-hidden bg-background border-y border-border">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6" style={{ paddingTop: 80 }}>
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.5, ease: easeExpo }}
        >
          <p className="text-sm font-semibold text-primary">{t("sec.special.badge")}</p>
          <h2 className="mt-1 font-display text-3xl font-extrabold sm:text-4xl">{t("sec.special.title")}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {cardsDismissed < FEATURES.length
              ? `Scroll to explore — ${FEATURES.length - cardsDismissed} feature${FEATURES.length - cardsDismissed !== 1 ? "s" : ""} remaining`
              : "All features revealed!"}
          </p>
        </motion.div>

        <motion.div
          className="relative mx-auto"
          style={{ height: 240, maxWidth: 620 }}
          initial={{ opacity: 0, y: 80 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
          transition={{ duration: 0.7, ease: easeExpo }}
        >
          {FEATURES.map((feat, rawIdx) => {
            const deckIdx = rawIdx - cardsDismissed;
            if (deckIdx < 0) return null;
            const cfg = stackCfg[deckIdx] ?? { scale: 0.8, y: 56, zIndex: 0 };
            return (
              <motion.div
                key={feat.titleKey}
                style={{ position: "absolute", zIndex: cfg.zIndex, width: "100%", willChange: "transform" }}
                animate={{ scale: cfg.scale, y: cfg.y, opacity: deckIdx > 3 ? 0 : 1 }}
                transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
              >
                <div className="rounded-2xl border-2 border-border bg-card p-7 dark:bg-[#1e1e1e]">
                  <div className="flex items-start gap-4">
                    <motion.div
                      className="inline-flex rounded-xl bg-primary/10 p-3 text-primary"
                      animate={deckIdx === 0 ? { scale: [1, 1.12, 1], rotate: [0, -8, 8, 0] } : { scale: 1, rotate: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                    >
                      <feat.Icon className="h-7 w-7" />
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{t(feat.titleKey)}</h3>
                      <p className="mt-2 text-muted-foreground">{t(feat.descKey)}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="mt-4 flex justify-center gap-2">
          {FEATURES.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i >= cardsDismissed ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Section 7: Star Reward ─────────────────────────────────────────────────── */

const PARTICLES = [
  { id: 0, x: "15%", delay: 0, duration: 2.3 },
  { id: 1, x: "28%", delay: 0.6, duration: 2.8 },
  { id: 2, x: "42%", delay: 1.1, duration: 2.1 },
  { id: 3, x: "55%", delay: 0.3, duration: 3.0 },
  { id: 4, x: "68%", delay: 0.9, duration: 2.5 },
  { id: 5, x: "80%", delay: 0.4, duration: 2.7 },
  { id: 6, x: "22%", delay: 1.5, duration: 2.4 },
  { id: 7, x: "72%", delay: 1.8, duration: 2.2 },
];

function StarRewardSection({ isActive }: { isActive: boolean }) {
  const { t } = useI18n();
  return (
    <section className="relative flex h-full flex-col justify-center overflow-hidden border-y border-border bg-surface/30 pt-16">
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-15"
        animate={{
          background: [
            "radial-gradient(ellipse at 20% 50%, #2D7A5F 0%, transparent 60%)",
            "radial-gradient(ellipse at 80% 50%, #0d9488 0%, transparent 60%)",
            "radial-gradient(ellipse at 20% 50%, #2D7A5F 0%, transparent 60%)",
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      {isActive && PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="pointer-events-none absolute h-2 w-2 rounded-full bg-yellow-400"
          style={{ left: p.x, bottom: "10%" }}
          animate={{ y: [0, -130, 0], opacity: [0, 1, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeOut" }}
        />
      ))}
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6">
        <motion.div
          className="mb-2 flex justify-center"
          initial={{ scale: 0, rotate: -10 }}
          animate={isActive ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -10 }}
          transition={{ type: "spring", stiffness: 400, damping: 20, delay: isActive ? 0.1 : 0 }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
            <Star className="h-3 w-3 fill-current" /> {t("sec.star.badge")}
          </span>
        </motion.div>
        <motion.h2
          className="mb-2 text-center font-display text-3xl font-extrabold sm:text-4xl"
          initial={{ opacity: 0, y: 30 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: isActive ? 0.2 : 0, ease: easeExpo }}
        >
          {t("sec.star.title")}
        </motion.h2>
        <motion.p
          className="mx-auto mb-8 max-w-2xl text-center text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: isActive ? 0.35 : 0 }}
        >
          {t("sec.star.subtitle")}
        </motion.p>
        <div className="grid gap-6 lg:grid-cols-3">
          {[1, 2, 3].map((level, i) => (
            <motion.div
              key={level}
              style={{ willChange: "transform" }}
              initial={{ opacity: 0, y: 40 }}
              animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.7, delay: isActive ? 0.3 + i * 0.12 : 0, ease: easeExpo }}
              whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
              className={`relative overflow-hidden rounded-2xl border-2 p-7 ${i === 2 ? "border-yellow-400/60 bg-gradient-to-br from-yellow-400/10 to-transparent dark:border-yellow-500/60" : "border-border bg-card"}`}
            >
              <div className="mb-5 flex items-center gap-1">
                {Array.from({ length: level }).map((_, j) => (
                  <motion.div
                    key={j}
                    animate={isActive ? {
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, -5, 0],
                      filter: ["drop-shadow(0 0 4px #FFD700)", "drop-shadow(0 0 14px #FFD700)", "drop-shadow(0 0 4px #FFD700)"],
                    } : {}}
                    transition={{ duration: 1.6, repeat: isActive ? Infinity : 0, delay: j * 0.4 + i * 0.2, ease: "easeInOut" }}
                    className={i === 2 ? "text-yellow-400" : "text-primary"}
                  >
                    <Star className="h-8 w-8 fill-current" />
                  </motion.div>
                ))}
              </div>
              <h3 className="text-xl font-bold">{t(`sec.star.level${level}`)}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t(`sec.star.benefit${level}`)}</p>
              {i === 2 && (
                <motion.div
                  className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-yellow-400/20 blur-3xl"
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Section 8: Our Vision ──────────────────────────────────────────────────── */

const PILLARS = [
  { titleKey: "sec.vision.pillar1Title", descKey: "sec.vision.pillar1Desc", floatDur: 3.0, floatDelay: 0 },
  { titleKey: "sec.vision.pillar2Title", descKey: "sec.vision.pillar2Desc", floatDur: 3.5, floatDelay: 0.5 },
  { titleKey: "sec.vision.pillar3Title", descKey: "sec.vision.pillar3Desc", floatDur: 4.0, floatDelay: 1.0 },
];

function OurVisionSection({ isActive }: { isActive: boolean }) {
  const { t } = useI18n();
  return (
    <section className="relative flex h-full flex-col justify-center overflow-hidden bg-surface/30 pt-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <motion.p
          className="mb-1 text-center text-sm font-semibold text-primary"
          initial={{ opacity: 0, y: -20 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: easeExpo }}
        >
          {t("sec.vision.badge")}
        </motion.p>

        <div className="mb-4 text-center">
          {t("sec.vision.title").split(" ").map((word, i) => (
            <motion.span
              key={i}
              className="inline-block mr-2 font-display text-3xl font-extrabold sm:text-4xl"
              style={{ willChange: "transform" }}
              initial={{ opacity: 0, y: 40, filter: "blur(4px)" }}
              animate={isActive ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 40, filter: "blur(4px)" }}
              transition={{ duration: 0.5, delay: isActive ? i * 0.06 : 0, ease: easeExpo }}
            >
              {word}
            </motion.span>
          ))}
        </div>

        <div className="mx-auto mb-6 max-w-2xl overflow-hidden text-center text-base text-muted-foreground">
          <motion.span
            className="block"
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={isActive ? { clipPath: "inset(0 0% 0 0)" } : { clipPath: "inset(0 100% 0 0)" }}
            transition={{ duration: 0.9, delay: isActive ? 0.3 : 0, ease: easeExpo }}
          >
            {t("sec.vision.statement")}
          </motion.span>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.titleKey}
              initial={{ opacity: 0, x: -20 }}
              animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.4, delay: isActive ? 0.1 + i * 0.15 : 0 }}
            >
              <motion.div
                animate={isActive ? { y: [0, -8, 0] } : {}}
                transition={{ duration: p.floatDur, delay: p.floatDelay, repeat: Infinity, ease: "easeInOut" }}
                className="relative rounded-2xl border border-border bg-card p-5 pl-7"
              >
                <motion.div
                  className="absolute left-0 top-5 w-1 rounded-full bg-primary"
                  initial={{ scaleY: 0 }}
                  animate={isActive ? { scaleY: 1 } : { scaleY: 0 }}
                  style={{ height: 64, transformOrigin: "top" }}
                  transition={{ duration: 0.4, delay: isActive ? 0.15 + i * 0.15 : 0 }}
                />
                <h3 className="text-base font-bold">{t(p.titleKey)}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t(p.descKey)}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={isActive ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.5, delay: isActive ? 0.5 : 0, ease: easeExpo }}
        >
          <motion.a
            href="/careers"
            animate={isActive ? { scale: [1, 1.03, 1], boxShadow: ["0 0 0px #2D7A5F", "0 0 24px #2D7A5F80", "0 0 0px #2D7A5F"] } : {}}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-semibold text-primary-foreground shadow-elegant transition hover:bg-primary/90"
          >
            {t("sec.vision.cta")}
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Section 9: Testimonials ────────────────────────────────────────────────── */

function TestimonialsSection({ isActive }: { isActive: boolean }) {
  const { t } = useI18n();
  return (
    <section className="relative flex h-full flex-col justify-center overflow-hidden bg-background pt-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <motion.div
          className="mx-auto mb-10 max-w-2xl text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: easeExpo }}
        >
          <p className="text-sm font-semibold text-primary">{t("sec.loved")}</p>
          <h2 className="mt-1 font-display text-3xl font-extrabold sm:text-4xl">{t("sec.testimonials")}</h2>
        </motion.div>
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.map((tt, i) => (
            <motion.div
              key={tt.id}
              style={{ willChange: "transform" }}
              initial={{ opacity: 0, scale: 0.88, y: 40 }}
              animate={isActive ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.88, y: 40 }}
              transition={{ duration: 0.6, delay: isActive ? i * 0.14 : 0, ease: easeExpo }}
              whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                animate={isActive ? { y: [0, -5, 0] } : {}}
                transition={{ duration: 4, delay: i * 0.8, repeat: Infinity, ease: "easeInOut" }}
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Section 10: Footer ─────────────────────────────────────────────────────── */

function FooterSection({ isActive }: { isActive: boolean }) {
  const { t } = useI18n();
  const cols = [
    {
      title: t("footer.topServices"),
      links: CATEGORIES.slice(0, 6).map((c) => ({ label: c.name, to: "/services" as const })),
    },
    {
      title: t("footer.company"),
      links: [
        { label: t("footer.about"), to: "/about" as const },
        { label: t("nav.jobs"), to: "/jobs" as const },
        { label: t("footer.becomeSB"), to: "/become-a-provider" as const },
        { label: t("nav.contact"), to: "/contact" as const },
        { label: t("nav.faqs"), to: "/faqs" as const },
      ],
    },
    {
      title: t("footer.legal"),
      links: [
        { label: t("footer.terms"), to: "/terms" as const },
        { label: t("footer.privacy"), to: "/privacy" as const },
        { label: t("footer.support"), to: "/contact" as const },
      ],
    },
  ];
  return (
    <section className="relative flex h-full flex-col justify-end overflow-hidden pt-16">
      <motion.footer
        className="border-t border-border bg-surface/40"
        initial={{ opacity: 0, y: 40 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.6, ease: easeExpo }}
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-5">
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 30 }}
            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.4, delay: isActive ? 0.1 : 0 }}
          >
            <p className="font-display text-lg font-bold">SkillBuddy</p>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">{t("footer.tagline")}</p>
            <form className="mt-5 flex max-w-sm gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="email" placeholder={t("footer.email")} className="pl-9 h-11" />
              </div>
              <Button type="submit" className="h-11 px-5">{t("footer.subscribe")}</Button>
            </form>
            <div className="mt-5 flex gap-2">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-full bg-muted text-muted-foreground transition hover:bg-primary hover:text-primary-foreground">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </motion.div>
          {cols.map((col, ci) => (
            <motion.div
              key={col.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.4, delay: isActive ? 0.1 + (ci + 1) * 0.08 : 0 }}
            >
              <h4 className="mb-4 text-sm font-semibold">{col.title}</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="hover:text-foreground">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        <div className="border-t border-border">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6">
            <p>© {new Date().getFullYear()} SkillBuddy. {t("footer.rights")}</p>
          </div>
        </div>
      </motion.footer>
    </section>
  );
}