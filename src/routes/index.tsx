"use client";

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState, type ReactElement } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Sparkles, ArrowRight, Star, Shield, Ban, ThumbsUp, Heart,
  ClipboardList, Gavel, UserCheck, CircleCheck as CheckCircle2, BookOpen,
  Mail, Facebook, Instagram, Twitter, Youtube,
  ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CategoryCard } from "@/components/category-card";
import { Navbar } from "@/components/navbar";
import { useTheme } from "@/components/theme-provider";
import { SERVICES, TESTIMONIALS, OFFERS, CATEGORIES } from "@/lib/data";
import { CATEGORIES_FULL } from "@/lib/categories";
import { useI18n } from "@/lib/i18n";
import iconTransparent from "@/assets/skillbuddy-icon-transparent.png";

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

const SECTION_COUNT = 13;
const POPULAR_SERVICES_IDX = 5;
const easeExpo = [0.22, 1, 0.36, 1] as const;

/* ── Badge SVG (Bronze / Silver / Gold shield) ───────────────────────────────── */
function BadgeSVG({ tier, size = 64 }: { tier: "bronze" | "silver" | "gold"; size?: number }) {
  const configs = {
    bronze: { fill1: "#CD7F32", fill2: "#8B4513", stroke: "#6B3410", glow: "rgba(205,127,50,0.5)" },
    silver: { fill1: "#E0E0E0", fill2: "#A8A8A8", stroke: "#888888", glow: "rgba(192,192,192,0.5)" },
    gold:   { fill1: "#FFD700", fill2: "#FFA500", stroke: "#CC8800", glow: "rgba(255,215,0,0.6)" },
  };
  const c = configs[tier];
  const id = `bg-${tier}`;
  return (
    <svg viewBox="0 0 60 70" width={size} height={size} style={{ filter: `drop-shadow(0 0 8px ${c.glow})`, flexShrink: 0 }}>
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c.fill1} />
          <stop offset="100%" stopColor={c.fill2} />
        </linearGradient>
      </defs>
      <path d="M30 2 L55 15 L55 45 Q55 60 30 68 Q5 60 5 45 L5 15 Z"
        fill={`url(#${id})`} stroke={c.stroke} strokeWidth="1.5" />
      <text x="30" y="38" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" fontFamily="sans-serif">SB</text>
      {tier === "gold" && (
        <text x="30" y="56" textAnchor="middle" fill="white" fontSize="14">★</text>
      )}
    </svg>
  );
}

/* ── Home ─────────────────────────────────────────────────────────────────────── */
function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>(Array(SECTION_COUNT).fill(null));
  const [activeSection, setActiveSection] = useState(0);
  const activeSectionRef = useRef(0);
  const [popularServicesCard, setPopularServicesCard] = useState(0);
  const popularServicesCardRef = useRef(0);
  const isAnimatingRef = useRef(false);

  useEffect(() => { popularServicesCardRef.current = popularServicesCard; }, [popularServicesCard]);
  useEffect(() => { activeSectionRef.current = activeSection; }, [activeSection]);

  const navigatePopular = useCallback((d: number) => {
    if (isAnimatingRef.current) return;
    const next = popularServicesCardRef.current + d;
    if (next < 0 || next > 7) return;
    isAnimatingRef.current = true;
    setPopularServicesCard(next);
    setTimeout(() => { isAnimatingRef.current = false; }, 400);
  }, []);

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
            <EliteRewardsSection isActive={activeSection === 3} />,
            <SpecialOffersSection isActive={activeSection === 4} />,
            <PopularServicesSection isActive={activeSection === 5} activeCardIdx={popularServicesCard} onNavigate={navigatePopular} />,
            <HowItWorksSection isActive={activeSection === 6} />,
            <WhatMakesUsSpecialSection isActive={activeSection === 7} />,
            <StarRewardSection isActive={activeSection === 8} />,
            <AppShowcaseSection isActive={activeSection === 9} />,
            <OurVisionSection isActive={activeSection === 10} />,
            <TestimonialsSection isActive={activeSection === 11} />,
            <FooterSection isActive={activeSection === 12} />,
          ] as ReactElement[]
        ).map((child, idx) => (
          <div
            key={idx}
            ref={setRef(idx)}
            style={{
              scrollSnapAlign: "start",
              height: idx === 12 ? "auto" : "100vh",
              minHeight: idx === 12 ? 0 : "100vh",
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

/* ── Section 0: Hero ─────────────────────────────────────────────────────────── */
function HeroSection({ isActive }: { isActive: boolean }) {
  const { t } = useI18n();
  const [heroIdx, setHeroIdx] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    const timer = setInterval(() => {
      setHeroIdx((p) => (p + 1) % 2);
    }, 3000);
    return () => clearInterval(timer);
  }, [isActive]);

  const heroTexts = [
    { main: "Expert Care,\nAnytime Anywhere", sub: null },
    { main: "Post a job, get bids,\nchoose the best", sub: "Your trusted help is one click away." },
  ];
  const current = heroTexts[heroIdx];

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

        <div className="relative flex flex-col items-center justify-center" style={{ minHeight: 160 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={heroIdx}
              initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="text-center w-full"
            >
              <h1
                className="font-display text-4xl font-extrabold leading-[1.05] sm:text-6xl md:text-7xl"
                style={{ whiteSpace: "pre-line", wordBreak: "break-word", overflowWrap: "break-word" }}
              >
                {current.main}
              </h1>
              {current.sub && (
                <p className="mt-3 text-base sm:text-lg text-muted-foreground">{current.sub}</p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.form
          onSubmit={(e) => e.preventDefault()}
          style={{ willChange: "transform" }}
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={isActive ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.97 }}
          transition={{ duration: 0.5, delay: isActive ? 0.3 : 0, ease: easeExpo }}
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
      </div>
    </section>
  );
}

/* ── Section 1: Post a Job ────────────────────────────────────────────────────── */
function PostJobSection({ isActive }: { isActive: boolean }) {
  const { t } = useI18n();
  const navigate = useNavigate();

  return (
    <section className="relative flex h-full flex-col items-center justify-center overflow-hidden bg-background" style={{ paddingTop: 64 }}>
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <motion.h2
          className="font-display text-3xl font-extrabold leading-tight sm:text-5xl md:text-6xl"
          style={{ willChange: "transform", wordBreak: "break-word", overflowWrap: "break-word" }}
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={isActive ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.7, ease: easeExpo }}
        >
          {t("hero.subtitle")}
        </motion.h2>

        <motion.div
          className="mt-10 flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={isActive ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.9 }}
          transition={{ duration: 0.5, delay: isActive ? 0.2 : 0, type: "spring", stiffness: 300, damping: 20 }}
        >
          <motion.div
            animate={isActive ? {
              boxShadow: ["0 0 20px rgba(45,122,95,0.4)", "0 0 40px rgba(45,122,95,0.8)", "0 0 20px rgba(45,122,95,0.4)"],
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ borderRadius: 50 }}
          >
            <motion.button
              onClick={() => navigate({ to: "/jobs" })}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: "linear-gradient(135deg, #2D7A5F, #4CAF84)",
                color: "white", padding: "16px 40px", borderRadius: "50px",
                fontSize: "clamp(16px, 4vw, 18px)", fontWeight: "700",
                border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px",
              }}
            >
              Post a Job →
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Section 2: Categories — 6 at a time, arrows, animated ──────────────────── */
function CategoriesSection({ isActive }: { isActive: boolean }) {
  const { t } = useI18n();
  const allCats = CATEGORIES_FULL.slice(0, 12);
  const VISIBLE_COUNT = 6;
  const [startIndex, setStartIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [sliderScrollIdx, setSliderScrollIdx] = useState(0);

  const totalPages = Math.ceil(allCats.length / VISIBLE_COUNT);
  const currentPage = Math.floor(startIndex / VISIBLE_COUNT);
  const visibleCats = allCats.slice(startIndex, startIndex + VISIBLE_COUNT);

  const goNext = () => {
    if (startIndex + VISIBLE_COUNT >= allCats.length) return;
    setDirection(1);
    setStartIndex((p) => Math.min(p + VISIBLE_COUNT, allCats.length - VISIBLE_COUNT));
  };
  const goPrev = () => {
    if (startIndex === 0) return;
    setDirection(-1);
    setStartIndex((p) => Math.max(p - VISIBLE_COUNT, 0));
  };

  const slideLeft = () => {
    if (sliderRef.current) {
      const newIdx = Math.max(0, sliderScrollIdx - 3);
      setSliderScrollIdx(newIdx);
      sliderRef.current.scrollTo({ left: newIdx * 116, behavior: "smooth" });
    }
  };
  const slideRight = () => {
    if (sliderRef.current) {
      const newIdx = Math.min(allCats.length - 3, sliderScrollIdx + 3);
      setSliderScrollIdx(newIdx);
      sliderRef.current.scrollTo({ left: newIdx * 116, behavior: "smooth" });
    }
  };

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
            <h2 className="mt-1 font-display text-2xl font-extrabold sm:text-4xl">{t("sec.categories")}</h2>
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

        {/* Desktop: 6 at a time with arrows */}
        <div className="hidden md:block">
          <div className="flex items-center gap-3">
            <motion.button
              onClick={goPrev}
              disabled={startIndex === 0}
              whileHover={startIndex > 0 ? { scale: 1.08 } : {}}
              whileTap={startIndex > 0 ? { scale: 0.92 } : {}}
              style={{
                width: 44, height: 44, borderRadius: "50%",
                background: startIndex === 0 ? "rgba(45,122,95,0.1)" : "#2D7A5F",
                color: startIndex === 0 ? "#2D7A5F" : "white",
                border: "none", cursor: startIndex === 0 ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, opacity: startIndex === 0 ? 0.4 : 1, transition: "all 0.2s",
              }}
            >
              <ChevronLeft size={20} />
            </motion.button>

            <div className="flex-1 overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={startIndex}
                  custom={direction}
                  initial={{ x: direction > 0 ? 60 : -60, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: direction > 0 ? -60 : 60, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="grid gap-3"
                  style={{ gridTemplateColumns: "repeat(6, 1fr)" }}
                >
                  {visibleCats.map((cat) => (
                    <motion.div
                      key={cat.slug}
                      whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <CategoryCard category={cat} />
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            <motion.button
              onClick={goNext}
              disabled={startIndex + VISIBLE_COUNT >= allCats.length}
              whileHover={startIndex + VISIBLE_COUNT < allCats.length ? { scale: 1.08 } : {}}
              whileTap={startIndex + VISIBLE_COUNT < allCats.length ? { scale: 0.92 } : {}}
              style={{
                width: 44, height: 44, borderRadius: "50%",
                background: startIndex + VISIBLE_COUNT >= allCats.length ? "rgba(45,122,95,0.1)" : "#2D7A5F",
                color: startIndex + VISIBLE_COUNT >= allCats.length ? "#2D7A5F" : "white",
                border: "none", cursor: startIndex + VISIBLE_COUNT >= allCats.length ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, opacity: startIndex + VISIBLE_COUNT >= allCats.length ? 0.4 : 1, transition: "all 0.2s",
              }}
            >
              <ChevronRight size={20} />
            </motion.button>
          </div>

          <div className="mt-4 flex justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <motion.div
                key={i}
                animate={{ width: i === currentPage ? 24 : 8, backgroundColor: i === currentPage ? "#2D7A5F" : "rgba(45,122,95,0.3)" }}
                className="h-2 rounded-full"
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
        </div>

        {/* Mobile slider */}
        <div className="md:hidden relative flex items-center">
          <motion.button onClick={slideLeft} whileTap={{ scale: 0.9 }}
            style={{ minWidth: 36, height: 36, borderRadius: "50%", background: "#2D7A5F", color: "white", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 10 }}>
            <ChevronLeft size={18} />
          </motion.button>
          <div ref={sliderRef} style={{ display: "flex", gap: 10, overflowX: "auto", scrollbarWidth: "none", flex: 1, padding: "4px 8px", WebkitOverflowScrolling: "touch", scrollSnapType: "x mandatory" }}>
            {allCats.map((cat, i) => (
              <motion.div key={cat.slug} style={{ minWidth: 100, scrollSnapAlign: "start" }}
                initial={{ opacity: 0, y: 30 }}
                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.45, delay: isActive ? i * 0.04 : 0, ease: "backOut" }}
                whileTap={{ scale: 0.95 }}>
                <CategoryCard category={cat} />
              </motion.div>
            ))}
          </div>
          <motion.button onClick={slideRight} whileTap={{ scale: 0.9 }}
            style={{ minWidth: 36, height: 36, borderRadius: "50%", background: "#2D7A5F", color: "white", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 10 }}>
            <ChevronRight size={18} />
          </motion.button>
        </div>
        <style>{`.md\\:hidden::-webkit-scrollbar{display:none}`}</style>
      </div>
    </section>
  );
}

/* ── Section 3: Elite Rewards ────────────────────────────────────────────────── */
const ELITE_BADGES = [
  {
    tier: "bronze" as const,
    title: "Bronze SkillBuddy",
    requirement: "Complete 5 jobs with 4.0+ rating",
    perks: ["Priority listing in search results", "Exclusive Bronze member badge on profile", "10% discount on platform fee"],
    glowColor: "rgba(205,127,50,0.3)",
    checkColor: "#A0522D",
    delay: 0.1,
    enterFrom: { x: -60, y: 0, opacity: 0 },
  },
  {
    tier: "silver" as const,
    title: "Silver SkillBuddy",
    requirement: "Complete 15 jobs with 4.5+ rating",
    perks: ["Everything in Bronze", "25% discount on platform fee", "Featured provider status", "Free Uber ride (1/week) for job commute"],
    glowColor: "rgba(192,192,192,0.3)",
    checkColor: "#808080",
    delay: 0.2,
    enterFrom: { x: 0, y: 40, opacity: 0 },
  },
  {
    tier: "gold" as const,
    title: "Gold SkillBuddy",
    requirement: "Complete 30 jobs with 4.8+ rating",
    perks: ["Everything in Silver", "FREE Uber rides for ALL job pickups & drop-offs", "Zero platform fee", "Dedicated account manager", "Gold verified badge", "Priority customer support"],
    glowColor: "rgba(255,215,0,0.4)",
    checkColor: "#CC8800",
    delay: 0.3,
    enterFrom: { x: 60, y: 0, opacity: 0 },
  },
];

function EliteRewardsSection({ isActive }: { isActive: boolean }) {
  const navigate = useNavigate();
  return (
    <section className="relative flex h-full flex-col justify-center overflow-hidden dark:bg-[#0D1117] bg-[#F0FDF4] pt-16">
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6">
        <motion.div
          className="mb-3 flex justify-center"
          initial={{ scale: 0 }}
          animate={isActive ? { scale: 1 } : { scale: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 20, delay: isActive ? 0.05 : 0 }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
            ⭐ EXCLUSIVE BADGE PERKS
          </span>
        </motion.div>

        <div className="mb-1 text-center">
          {["Earn Badges.", "Unlock Real Rewards."].map((chunk, i) => (
            <motion.span
              key={i}
              className={`inline-block mr-3 font-display font-extrabold ${i === 0 ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl text-primary"}`}
              initial={{ opacity: 0, y: 30 }}
              animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: isActive ? 0.1 + i * 0.1 : 0, ease: easeExpo }}
            >
              {chunk}
            </motion.span>
          ))}
        </div>

        <motion.p
          className="mx-auto mb-5 max-w-xl text-center text-xs sm:text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: isActive ? 0.3 : 0 }}
        >
          Every milestone you hit on SkillBuddy comes with exclusive perks designed to make your journey easier and more rewarding.
        </motion.p>

        <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
          {ELITE_BADGES.map((badge) => (
            <motion.div
              key={badge.tier}
              initial={badge.enterFrom}
              animate={isActive ? { x: 0, y: 0, opacity: 1 } : badge.enterFrom}
              transition={{ duration: 0.6, delay: isActive ? badge.delay : 0, ease: easeExpo }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="relative rounded-2xl border-2 p-5 sm:p-6 dark:bg-transparent"
              style={{
                borderColor: badge.glowColor,
                boxShadow: badge.tier === "gold" ? undefined : undefined,
              }}
            >
              {badge.tier === "gold" && (
                <motion.div
                  className="pointer-events-none absolute inset-0 rounded-2xl"
                  animate={isActive ? {
                    boxShadow: ["0 0 20px rgba(255,215,0,0.15)", "0 0 40px rgba(255,215,0,0.35)", "0 0 20px rgba(255,215,0,0.15)"],
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              )}

              <div className="flex items-center gap-3 mb-4">
                <motion.div whileHover={{ rotate: [-5, 5, 0], transition: { duration: 0.4 } }}>
                  <BadgeSVG tier={badge.tier} size={52} />
                </motion.div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg">{badge.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{badge.requirement}</p>
                </div>
              </div>

              <ul className="space-y-2">
                {badge.perks.map((perk, j) => (
                  <li key={j} className="flex items-start gap-2 text-xs sm:text-sm">
                    <span
                      className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white"
                      style={{ background: badge.checkColor }}
                    >✓</span>
                    <span className="text-muted-foreground">{perk}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-5 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.4, delay: isActive ? 0.5 : 0 }}
        >
          <motion.button
            onClick={() => navigate({ to: "/become-a-skillbuddy" })}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            animate={isActive ? {
              boxShadow: ["0 0 20px rgba(45,122,95,0.3)", "0 0 40px rgba(45,122,95,0.6)", "0 0 20px rgba(45,122,95,0.3)"],
            } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              background: "linear-gradient(135deg, #2D7A5F, #4CAF84)", color: "white",
              padding: "14px 36px", borderRadius: "50px",
              fontSize: "clamp(14px, 3vw, 16px)", fontWeight: "700", border: "none", cursor: "pointer",
            }}
          >
            Start Earning Your Badge →
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Section 4: Special Offers — 3D rotateX elevator + unique card colors ───── */
const OFFER_COLORS = [
  {
    dark: { bg: "#0f2d1a", accent: "#4CAF84", text: "white", tagBg: "rgba(76,175,132,0.2)", btnBg: "#4CAF84" },
    light: { bg: "#E8F5F0", accent: "#2D7A5F", text: "#0D1117", tagBg: "rgba(45,122,95,0.15)", btnBg: "#2D7A5F" },
  },
  {
    dark: { bg: "#1a1a2e", accent: "#818cf8", text: "white", tagBg: "rgba(129,140,248,0.2)", btnBg: "#6366f1" },
    light: { bg: "#EEF2FF", accent: "#4f46e5", text: "#0D1117", tagBg: "rgba(79,70,229,0.12)", btnBg: "#4f46e5" },
  },
  {
    dark: { bg: "#2e1a0f", accent: "#fbbf24", text: "white", tagBg: "rgba(251,191,36,0.2)", btnBg: "#f59e0b" },
    light: { bg: "#FFFBEB", accent: "#d97706", text: "#0D1117", tagBg: "rgba(217,119,6,0.12)", btnBg: "#d97706" },
  },
];

const rotateCardVariants = {
  enter: (d: string) => ({
    rotateX: d === "down" ? 60 : -60,
    y: d === "down" ? "100%" : "-100%",
    opacity: 0,
  }),
  center: { rotateX: 0, y: "0%", opacity: 1 },
  exit: (d: string) => ({
    rotateX: d === "down" ? -60 : 60,
    y: d === "down" ? "-100%" : "100%",
    opacity: 0,
  }),
};

function SpecialOffersSection({ isActive }: { isActive: boolean }) {
  const { t } = useI18n();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [currentIdx, setCurrentIdx] = useState(0);
  const [direction, setDirection] = useState<"up" | "down">("down");

  const goNext = () => { setDirection("down"); setCurrentIdx((p) => (p + 1) % OFFERS.length); };
  const goPrev = () => { setDirection("up"); setCurrentIdx((p) => (p - 1 + OFFERS.length) % OFFERS.length); };
  const prevIdx = (currentIdx - 1 + OFFERS.length) % OFFERS.length;
  const nextIdx = (currentIdx + 1) % OFFERS.length;

  return (
    <section className="relative flex h-full flex-col items-center justify-center overflow-hidden border-y border-border bg-surface/30">
      <div className="w-full px-4 sm:px-6 flex flex-col items-center" style={{ paddingTop: 80 }}>
        <motion.div
          className="mb-6 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.5, ease: easeExpo }}
        >
          <p className="text-sm font-semibold text-primary">{t("sec.limited")}</p>
          <h2 className="mt-1 font-display text-2xl font-extrabold sm:text-4xl">{t("sec.specialOffers")}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            <span className="text-primary font-semibold">{currentIdx + 1}</span>
            <span className="text-muted-foreground"> / {OFFERS.length}</span>
          </p>
        </motion.div>

        <motion.div
          className="relative w-full flex items-center justify-center gap-3 sm:gap-6"
          style={{ maxWidth: 640 }}
          initial={{ opacity: 0, y: 60 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 0.6, ease: easeExpo }}
        >
          {/* Card column */}
          <div className="relative flex-1 flex flex-col items-center" style={{ height: 340, perspective: "1000px" }}>
            {/* Peek previous */}
            <div className="absolute top-0 w-full pointer-events-none" style={{ transform: "scale(0.88) translateY(-20px)", opacity: 0.5, zIndex: 1, transformOrigin: "center bottom" }}>
              <OfferCard offer={OFFERS[prevIdx]} offerIdx={prevIdx} t={t} isDark={isDark} />
            </div>

            {/* Main card */}
            <div className="absolute inset-0 z-10 flex items-center" style={{ perspective: "1000px" }}>
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentIdx}
                  custom={direction}
                  variants={rotateCardVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <OfferCard offer={OFFERS[currentIdx]} offerIdx={currentIdx} t={t} isDark={isDark} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Peek next */}
            <div className="absolute bottom-0 w-full pointer-events-none" style={{ transform: "scale(0.88) translateY(20px)", opacity: 0.5, zIndex: 1, transformOrigin: "center top" }}>
              <OfferCard offer={OFFERS[nextIdx]} offerIdx={nextIdx} t={t} isDark={isDark} />
            </div>
          </div>

          {/* Up/Down buttons */}
          <div className="flex flex-col gap-3 z-20">
            <motion.button
              onClick={goPrev}
              whileHover={{ scale: 1.1, backgroundColor: "#1a5c3a" }}
              whileTap={{ scale: 0.9, rotate: -10 }}
              style={{ width: 48, height: 48, borderRadius: "50%", background: "#2D7A5F", color: "white", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(45,122,95,0.4)" }}
            >
              <ChevronUp size={22} />
            </motion.button>
            <motion.button
              onClick={goNext}
              whileHover={{ scale: 1.1, backgroundColor: "#1a5c3a" }}
              whileTap={{ scale: 0.9, rotate: 10 }}
              style={{ width: 48, height: 48, borderRadius: "50%", background: "#2D7A5F", color: "white", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(45,122,95,0.4)" }}
            >
              <ChevronDown size={22} />
            </motion.button>
          </div>
        </motion.div>

        {/* Dots */}
        <div className="mt-6 flex justify-center gap-2">
          {OFFERS.map((_, i) => (
            <motion.div key={i} animate={{ width: i === currentIdx ? 24 : 8, backgroundColor: i === currentIdx ? "#2D7A5F" : "rgba(45,122,95,0.3)" }} className="h-2 rounded-full" transition={{ duration: 0.3 }} />
          ))}
        </div>
      </div>
    </section>
  );
}

function OfferCard({ offer, offerIdx, t, isDark }: { offer: typeof OFFERS[0]; offerIdx: number; t: (k: string) => string; isDark: boolean }) {
  const cfg = (OFFER_COLORS[offerIdx] ?? OFFER_COLORS[0])[isDark ? "dark" : "light"];
  return (
    <div
      className="relative flex min-h-[180px] sm:min-h-[210px] flex-col overflow-hidden"
      style={{ borderRadius: 24, boxShadow: "0 8px 40px rgba(0,0,0,0.18)", background: cfg.bg, padding: "1.5rem 2rem" }}
    >
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-10" style={{ background: cfg.accent, filter: "blur(40px)" }} />
      <span className="self-start rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
        style={{ background: cfg.tagBg, color: cfg.accent }}>
        {t("sec.limited")}
      </span>
      <h3 className="mt-3 font-display text-xl sm:text-2xl font-extrabold leading-tight" style={{ color: cfg.text }}>{t(offer.titleKey)}</h3>
      <p className="mt-2 text-sm" style={{ color: isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.65)" }}>{t(offer.subKey)}</p>
      <button
        className="mt-auto self-start rounded-md px-4 py-2 text-sm font-bold text-white transition hover:opacity-90"
        style={{ background: cfg.btnBg, boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
        {t(offer.ctaKey)}
      </button>
    </div>
  );
}

/* ── Section 5: Popular Services ─────────────────────────────────────────────── */
const CAROUSEL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const CUR_W = 300;
const SIDE_W = 240;
const CARD_GAP = 24;
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
          className="px-4 sm:px-6 mb-6 flex items-end justify-between gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: easeExpo }}
        >
          <div>
            <p className="text-sm font-semibold text-primary">{t("sec.popular")}</p>
            <h2 className="mt-1 font-display text-2xl font-extrabold sm:text-4xl">{t("sec.popularServices")}</h2>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/services">{t("common.viewAll")} <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </motion.div>

        <div className="relative flex flex-1 items-center">
          <motion.button
            onClick={() => onNavigate(-1)}
            disabled={activeCardIdx === 0}
            animate={{ opacity: activeCardIdx === 0 ? 0.3 : 1 }}
            whileHover={activeCardIdx > 0 ? { backgroundColor: "#2D7A5F", color: "#ffffff" } : {}}
            transition={{ duration: 0.2 }}
            style={{ position: "absolute", left: 8, zIndex: 20, width: 44, height: 44, borderRadius: "50%", background: "rgba(45,122,95,0.15)", border: "1px solid #2D7A5F", color: "#2D7A5F", display: "flex", alignItems: "center", justifyContent: "center", cursor: activeCardIdx === 0 ? "not-allowed" : "pointer", flexShrink: 0 }}
          >
            <ChevronLeft size={20} />
          </motion.button>

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
                    style={{ position: "absolute", width: size, height: size, borderRadius: 20, overflow: "hidden", flexShrink: 0, cursor: isCurrent ? "grab" : "pointer", boxShadow: isCurrent ? "0 8px 32px rgba(0,0,0,0.10)" : "0 4px 16px rgba(0,0,0,0.08)" }}
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

          <motion.button
            onClick={() => onNavigate(1)}
            disabled={activeCardIdx === popular.length - 1}
            animate={{ opacity: activeCardIdx === popular.length - 1 ? 0.3 : 1 }}
            whileHover={activeCardIdx < popular.length - 1 ? { backgroundColor: "#2D7A5F", color: "#ffffff" } : {}}
            transition={{ duration: 0.2 }}
            style={{ position: "absolute", right: 8, zIndex: 20, width: 44, height: 44, borderRadius: "50%", background: "rgba(45,122,95,0.15)", border: "1px solid #2D7A5F", color: "#2D7A5F", display: "flex", alignItems: "center", justifyContent: "center", cursor: activeCardIdx === popular.length - 1 ? "not-allowed" : "pointer", flexShrink: 0 }}
          >
            <ChevronRight size={20} />
          </motion.button>
        </div>

        <div className="flex justify-center gap-2 mt-4">
          {popular.map((_, i) => (
            <motion.div key={i} animate={{ width: i === activeCardIdx ? 24 : 8, backgroundColor: i === activeCardIdx ? "#2D7A5F" : "rgba(45,122,95,0.3)" }} className="h-2 rounded-full" transition={{ duration: 0.3 }} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CardInner({ svc, t }: { svc: typeof SERVICES[0]; t: (k: string) => string }) {
  return (
    <div className="h-full w-full relative bg-card dark:bg-[#1e1e1e]" style={{ background: `url(${svc.image}) center/cover no-repeat` }}>
      <div className="absolute inset-0 flex flex-col justify-end p-5" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.82) 45%, transparent 100%)" }}>
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

/* ── Section 6: How It Works — icon hover animations per step ────────────────── */
const HOW_STEPS = [
  { Icon: BookOpen, key: "1" },
  { Icon: ClipboardList, key: "2" },
  { Icon: Gavel, key: "3" },
  { Icon: UserCheck, key: "4" },
  { Icon: CheckCircle2, key: "5" },
];

const STEP_HOVER: Array<{ iconMotion: object; duration: number; iconColor: string; bgColor: string }> = [
  { iconMotion: { rotate: [0, -10, 10, 0] }, duration: 0.4, iconColor: "#2D7A5F", bgColor: "rgba(45,122,95,0.15)" },
  { iconMotion: { y: [0, -4, 0] }, duration: 0.3, iconColor: "#4CAF84", bgColor: "rgba(76,175,132,0.15)" },
  { iconMotion: { scale: [1, 1.2, 1] }, duration: 0.3, iconColor: "#2D7A5F", bgColor: "rgba(45,122,95,0.15)" },
  { iconMotion: { rotate: [0, 360] }, duration: 0.5, iconColor: "#4CAF84", bgColor: "rgba(76,175,132,0.15)" },
  { iconMotion: { scale: [1, 1.15, 1] }, duration: 0.4, iconColor: "#FCD34D", bgColor: "rgba(252,211,77,0.15)" },
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
          className="mx-auto mb-8 max-w-2xl text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: easeExpo }}
        >
          <p className="text-sm font-semibold text-primary">{t("sec.howItWorks")}</p>
          <h2 className="mt-1 font-display text-2xl font-extrabold sm:text-4xl">{t("sec.howTitle")}</h2>
        </motion.div>

        {/* Desktop */}
        <div className="hidden lg:block relative">
          <div className="pointer-events-none absolute left-0 right-0 top-7 h-px">
            <svg width="100%" height="4" className="overflow-visible">
              <line ref={lineRef} x1="5%" y1="2" x2="95%" y2="2" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" strokeLinecap="round" className="text-primary" />
            </svg>
          </div>
          <div className="grid gap-5 lg:grid-cols-5">
            {HOW_STEPS.map(({ Icon, key }, i) => (
              <StepCard key={key} Icon={Icon} stepKey={key} stepNum={i + 1} isActive={isActive} t={t} delay={0.15 + i * 0.18} hoverConfig={STEP_HOVER[i]} />
            ))}
          </div>
        </div>

        {/* Mobile: vertical timeline */}
        <div className="lg:hidden flex flex-col gap-0 overflow-y-auto" style={{ maxHeight: "calc(100vh - 220px)" }}>
          {HOW_STEPS.map(({ Icon, key }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -20 }}
              animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ delay: isActive ? 0.1 + i * 0.12 : 0, duration: 0.4, ease: easeExpo }}
              className="flex items-start gap-4 mb-4"
            >
              <div className="flex flex-col items-center">
                <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-elegant">
                  <Icon className="h-5 w-5" />
                  <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-background font-mono text-[10px] font-bold text-primary ring-2 ring-primary">{i + 1}</span>
                </div>
                {i < HOW_STEPS.length - 1 && <div className="mt-1 h-6 w-0.5 bg-primary/40" />}
              </div>
              <div className="flex-1 pt-1">
                <h3 className="font-display text-sm font-bold">{t(`step.${key}.title`)}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">{t(`step.${key}.desc`)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StepCard({
  Icon, stepKey, stepNum, isActive, t, delay, hoverConfig,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  stepKey: string; stepNum: number; isActive: boolean;
  t: (k: string) => string; delay: number;
  hoverConfig: typeof STEP_HOVER[0];
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      style={{ willChange: "transform" }}
      initial={{ opacity: 0, y: 30 }}
      animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ delay: isActive ? delay : 0, duration: 0.5, ease: easeExpo }}
      whileHover={{ y: -4, scale: 1.02, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative rounded-2xl border border-border bg-card p-5 text-center shadow-card transition-colors"
    >
      <div className="relative mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full transition-colors"
        style={{ background: hovered ? hoverConfig.bgColor : "linear-gradient(135deg, var(--color-primary), var(--color-primary-glow))" }}>
        <motion.div
          animate={hovered ? { ...hoverConfig.iconMotion, transition: { duration: hoverConfig.duration } } : {}}
        >
          <Icon className="h-6 w-6" style={{ color: hovered ? hoverConfig.iconColor : "white" }} />
        </motion.div>
        <span
          className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-background font-mono text-xs font-bold ring-2 transition-colors"
          style={{ color: hovered ? hoverConfig.iconColor : "#2D7A5F", ringColor: hovered ? hoverConfig.iconColor : "#2D7A5F", borderColor: hovered ? hoverConfig.iconColor : "#2D7A5F", border: `2px solid ${hovered ? hoverConfig.iconColor : "#2D7A5F"}` }}
        >
          {stepNum}
        </span>
      </div>
      <h3 className="font-display text-base font-bold transition-colors" style={{ color: hovered ? hoverConfig.iconColor : undefined }}>
        {t(`step.${stepKey}.title`)}
      </h3>
      <p className="mt-1 text-xs text-muted-foreground">{t(`step.${stepKey}.desc`)}</p>
    </motion.div>
  );
}

/* ── Section 7: What Makes Us Special — 3D rotateX ──────────────────────────── */
const FEATURES = [
  { Icon: Shield, titleKey: "sec.special.verifiedTitle", descKey: "sec.special.verifiedDesc" },
  { Icon: Ban, titleKey: "sec.special.noHiddenTitle", descKey: "sec.special.noHiddenDesc" },
  { Icon: ThumbsUp, titleKey: "sec.special.satisfactionTitle", descKey: "sec.special.satisfactionDesc" },
  { Icon: Heart, titleKey: "sec.special.trustTitle", descKey: "sec.special.trustDesc" },
];

function WhatMakesUsSpecialSection({ isActive }: { isActive: boolean }) {
  const { t } = useI18n();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [direction, setDirection] = useState<"up" | "down">("down");

  const goNext = () => { setDirection("down"); setCurrentIdx((p) => (p + 1) % FEATURES.length); };
  const goPrev = () => { setDirection("up"); setCurrentIdx((p) => (p - 1 + FEATURES.length) % FEATURES.length); };
  const prevIdx = (currentIdx - 1 + FEATURES.length) % FEATURES.length;
  const nextIdx = (currentIdx + 1) % FEATURES.length;

  return (
    <section className="relative flex h-full flex-col items-center justify-center overflow-hidden bg-background border-y border-border">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6" style={{ paddingTop: 80 }}>
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.5, ease: easeExpo }}
        >
          <p className="text-sm font-semibold text-primary">{t("sec.special.badge")}</p>
          <h2 className="mt-1 font-display text-2xl font-extrabold sm:text-4xl">{t("sec.special.title")}</h2>
        </motion.div>

        <motion.div
          className="relative flex items-center justify-center gap-3 sm:gap-6"
          initial={{ opacity: 0, y: 80 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
          transition={{ duration: 0.7, ease: easeExpo }}
        >
          <div className="relative flex-1 flex flex-col items-center" style={{ height: 280, perspective: "1000px" }}>
            {/* Peek prev */}
            <div className="absolute top-0 w-full pointer-events-none" style={{ transform: "scale(0.9) translateY(-16px)", opacity: 0.45, zIndex: 1, transformOrigin: "center bottom" }}>
              <FeatureCard feat={FEATURES[prevIdx]} t={t} />
            </div>

            {/* Main */}
            <div className="absolute inset-0 z-10 flex items-center" style={{ perspective: "1000px" }}>
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentIdx}
                  custom={direction}
                  variants={rotateCardVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <FeatureCard feat={FEATURES[currentIdx]} t={t} active />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Peek next */}
            <div className="absolute bottom-0 w-full pointer-events-none" style={{ transform: "scale(0.9) translateY(16px)", opacity: 0.45, zIndex: 1, transformOrigin: "center top" }}>
              <FeatureCard feat={FEATURES[nextIdx]} t={t} />
            </div>
          </div>

          {/* Up/Down buttons */}
          <div className="flex flex-col gap-3 z-20">
            <motion.button
              onClick={goPrev}
              whileHover={{ scale: 1.1, backgroundColor: "#1a5c3a" }}
              whileTap={{ scale: 0.9, rotate: -10 }}
              initial={{ scale: 0 }}
              animate={isActive ? { scale: 1 } : { scale: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 15, delay: isActive ? 0.3 : 0 }}
              style={{ width: 48, height: 48, borderRadius: "50%", background: "#2D7A5F", color: "white", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(45,122,95,0.4)" }}
            >
              <ChevronUp size={22} />
            </motion.button>
            <motion.button
              onClick={goNext}
              whileHover={{ scale: 1.1, backgroundColor: "#1a5c3a" }}
              whileTap={{ scale: 0.9, rotate: 10 }}
              initial={{ scale: 0 }}
              animate={isActive ? { scale: 1 } : { scale: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 15, delay: isActive ? 0.4 : 0 }}
              style={{ width: 48, height: 48, borderRadius: "50%", background: "#2D7A5F", color: "white", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(45,122,95,0.4)" }}
            >
              <ChevronDown size={22} />
            </motion.button>
          </div>
        </motion.div>

        <div className="mt-6 flex justify-center gap-2">
          {FEATURES.map((_, i) => (
            <motion.div key={i} animate={{ width: i === currentIdx ? 24 : 8, backgroundColor: i === currentIdx ? "#2D7A5F" : "rgba(45,122,95,0.3)" }} className="h-2 rounded-full" transition={{ duration: 0.3 }} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feat, t, active }: { feat: typeof FEATURES[0]; t: (k: string) => string; active?: boolean }) {
  return (
    <div className="rounded-2xl border-2 border-border bg-card p-5 sm:p-7 dark:bg-[#1e1e1e]">
      <div className="flex items-start gap-4">
        <div className={`inline-flex rounded-xl bg-primary/10 p-3 text-primary ${active ? "scale-110" : ""} transition-transform`}>
          <feat.Icon className="h-6 w-6 sm:h-7 sm:w-7" />
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-foreground">{t(feat.titleKey)}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{t(feat.descKey)}</p>
        </div>
      </div>
    </div>
  );
}

/* ── Section 8: Badge Reward System ──────────────────────────────────────────── */
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

const BADGE_LEVELS = [
  { tier: "bronze" as const, label: "Bronze", levelKey: "sec.star.level1", benefitKey: "sec.star.benefit1", anim: { rotate: [-3, 3, 0], duration: 3 } },
  { tier: "silver" as const, label: "Silver", levelKey: "sec.star.level2", benefitKey: "sec.star.benefit2", anim: { y: [0, -6, 0], duration: 4 } },
  { tier: "gold" as const,   label: "Gold",   levelKey: "sec.star.level3", benefitKey: "sec.star.benefit3", anim: { scale: [1, 1.05, 1], duration: 2.5 } },
];

function StarRewardSection({ isActive }: { isActive: boolean }) {
  const { t } = useI18n();
  return (
    <section className="relative flex h-full flex-col justify-center overflow-hidden border-y border-border bg-surface/30 pt-16">
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-15"
        animate={{ background: ["radial-gradient(ellipse at 20% 50%, #2D7A5F 0%, transparent 60%)", "radial-gradient(ellipse at 80% 50%, #0d9488 0%, transparent 60%)", "radial-gradient(ellipse at 20% 50%, #2D7A5F 0%, transparent 60%)"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      {isActive && PARTICLES.map((p) => (
        <motion.div key={p.id} className="pointer-events-none absolute h-2 w-2 rounded-full bg-yellow-400" style={{ left: p.x, bottom: "10%" }}
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
            <BadgeSVG tier="gold" size={16} /> The SkillBuddy Badge System
          </span>
        </motion.div>
        <motion.h2
          className="mb-2 text-center font-display text-2xl font-extrabold sm:text-4xl"
          initial={{ opacity: 0, y: 30 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: isActive ? 0.2 : 0, ease: easeExpo }}
        >
          {t("sec.star.title")}
        </motion.h2>
        <motion.p
          className="mx-auto mb-6 max-w-2xl text-center text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: isActive ? 0.35 : 0 }}
        >
          {t("sec.star.subtitle")}
        </motion.p>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3">
          {BADGE_LEVELS.map(({ tier, levelKey, benefitKey, anim }, i) => (
            <motion.div
              key={tier}
              style={{ willChange: "transform" }}
              initial={{ opacity: 0, scale: 0 }}
              animate={isActive ? { opacity: 1, scale: i === 2 ? 1 : 1 } : { opacity: 0, scale: 0 }}
              transition={{ duration: 0.7, delay: isActive ? 0.3 + i * 0.3 : 0, type: "spring", stiffness: 200, damping: 15 }}
              whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
              className={`relative overflow-hidden rounded-2xl border-2 p-5 sm:p-7 ${
                tier === "gold" ? "border-yellow-400/60 bg-gradient-to-br from-yellow-400/10 to-transparent dark:border-yellow-500/60" : "border-border bg-card"
              }`}
            >
              <div className="mb-5 flex items-center gap-3">
                <motion.div
                  animate={isActive ? { ...anim, transition: { duration: anim.duration, repeat: Infinity, ease: "easeInOut" } } : {}}
                >
                  <BadgeSVG tier={tier} size={56} />
                </motion.div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold">{t(levelKey)}</h3>
                  <p className="text-xs text-muted-foreground capitalize">{tier} tier</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{t(benefitKey)}</p>
              {tier === "gold" && (
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

/* ── Section 9: App Showcase ──────────────────────────────────────────────────── */
const APP_SCREENSHOTS = [
  { src: "/app-screenshots/screen-1.png", label: "Home Screen" },
  { src: "/app-screenshots/screen-2.png", label: "Services" },
  { src: "/app-screenshots/screen-3.png", label: "Notifications" },
  { src: "/app-screenshots/screen-4.png", label: "Booking" },
  { src: "/app-screenshots/screen-5.png", label: "Provider" },
  { src: "/app-screenshots/screen-6.png", label: "Explore" },
  { src: "/app-screenshots/screen-7.png", label: "Sign Up" },
];

function AppShowcaseSection({ isActive }: { isActive: boolean }) {
  const [screenIdx, setScreenIdx] = useState(0);
  useEffect(() => {
    if (!isActive) return;
    const timer = setInterval(() => { setScreenIdx((p) => (p + 1) % APP_SCREENSHOTS.length); }, 3000);
    return () => clearInterval(timer);
  }, [isActive]);

  return (
    <section className="relative flex h-full flex-col justify-center overflow-hidden border-y border-border dark:bg-[#080C10] bg-[#F0FDF4]">
      <div className="relative mx-auto w-full max-w-5xl px-4 sm:px-6 flex flex-col lg:flex-row items-center gap-6 lg:gap-14" style={{ paddingTop: 80, paddingBottom: 24 }}>
        <motion.div className="flex-1 text-center lg:text-left" initial={{ opacity: 0, x: -40 }} animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }} transition={{ duration: 0.6, ease: easeExpo }}>
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary mb-3">
            <Smartphone className="h-3 w-3" /> Available on iOS &amp; Android
          </span>
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl lg:text-5xl mt-2 mb-3 leading-tight">Your Services,<br className="hidden lg:block" /> In Your Pocket</h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-sm mx-auto lg:mx-0">Browse services, post jobs, chat with providers, and track your bookings — all in one beautiful app.</p>
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
            <motion.div initial={{ x: -20, opacity: 0 }} animate={isActive ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }} transition={{ duration: 0.4, delay: isActive ? 0.4 : 0 }}>
              <div className="flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-white cursor-pointer select-none hover:opacity-90 transition" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.2)", minWidth: 130 }}>
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 flex-shrink-0"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" /></svg>
                <div className="leading-tight"><div className="text-[9px] opacity-80">Download on the</div><div className="text-sm font-semibold">App Store</div></div>
              </div>
            </motion.div>
            <motion.div initial={{ x: 20, opacity: 0 }} animate={isActive ? { x: 0, opacity: 1 } : { x: 20, opacity: 0 }} transition={{ duration: 0.4, delay: isActive ? 0.5 : 0 }}>
              <div className="flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-white cursor-pointer select-none hover:opacity-90 transition" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.2)", minWidth: 140 }}>
                <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 flex-shrink-0"><path d="M3.18 23.76c.29.17.63.19.94.07l12.43-7.17-2.63-2.63L3.18 23.76z" fill="#EA4335" /><path d="M22.54 10.22 19.6 8.52l-2.95 2.95 2.95 2.95 2.97-1.72a1.58 1.58 0 0 0 0-2.48z" fill="#FBBC04" /><path d="M3.18.24a1.57 1.57 0 0 0-.93 1.41v20.7c0 .59.33 1.1.93 1.41l.09.05L15.7 12l-.01-.09L3.18.24z" fill="#4285F4" /><path d="M13.92 12l2.66-2.66-12.4-7.1-.09-.06L13.92 12z" fill="#34A853" /></svg>
                <div className="leading-tight"><div className="text-[9px] opacity-80">Get it on</div><div className="text-sm font-semibold">Google Play</div></div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div className="relative flex flex-col items-center flex-shrink-0" initial={{ scale: 0.3, opacity: 0, y: 60, rotateX: 20 }} animate={isActive ? { scale: 1, opacity: 1, y: 0, rotateX: 0 } : { scale: 0.3, opacity: 0, y: 60, rotateX: 20 }} transition={{ duration: 0.8, delay: isActive ? 0.2 : 0, ease: [0.34, 1.56, 0.64, 1] }} style={{ perspective: 1000 }}>
          <motion.div animate={isActive ? { y: [0, -10, 0], rotateY: [0, 3, -3, 0], filter: ["drop-shadow(0 20px 40px rgba(45,122,95,0.3))", "drop-shadow(0 30px 60px rgba(45,122,95,0.5))", "drop-shadow(0 20px 40px rgba(45,122,95,0.3))"] } : {}} transition={{ y: { duration: 3, repeat: Infinity, ease: "easeInOut" }, rotateY: { duration: 6, repeat: Infinity, ease: "easeInOut" }, filter: { duration: 2.5, repeat: Infinity, ease: "easeInOut" } }}>
            <div className="relative dark:bg-[#1C1C1E] bg-[#E5E5EA]" style={{ width: "clamp(180px, 28vw, 230px)", height: "clamp(370px, 58vw, 475px)", borderRadius: 52, boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.15), 0 0 0 1px rgba(0,0,0,0.15), 0 24px 64px rgba(0,0,0,0.25)", padding: 8, position: "relative" }}>
              <div className="absolute left-[-3px] top-[100px] w-[3px] h-8 rounded-l-full dark:bg-[#3a3a3c] bg-[#c7c7cc]" />
              <div className="absolute left-[-3px] top-[148px] w-[3px] h-8 rounded-l-full dark:bg-[#3a3a3c] bg-[#c7c7cc]" />
              <div className="absolute right-[-3px] top-[120px] w-[3px] h-12 rounded-r-full dark:bg-[#3a3a3c] bg-[#c7c7cc]" />
              <div className="relative overflow-hidden bg-black" style={{ borderRadius: 44, height: "100%", width: "100%" }}>
                <div className="absolute top-[10px] left-1/2 -translate-x-1/2 z-20 bg-black" style={{ width: 60, height: 20, borderRadius: 12 }} />
                <div className="absolute inset-0">
                  {APP_SCREENSHOTS.map((ss, i) => (
                    <motion.img key={i} src={ss.src} alt={ss.label} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} animate={{ opacity: i === screenIdx ? 1 : 0 }} transition={{ duration: 0.4, ease: "easeInOut" }} />
                  ))}
                </div>
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
                  {APP_SCREENSHOTS.map((_, i) => (
                    <motion.div key={i} animate={{ width: i === screenIdx ? 16 : 6, backgroundColor: i === screenIdx ? "#ffffff" : "rgba(255,255,255,0.4)" }} className="h-1.5 rounded-full" transition={{ duration: 0.3 }} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scaleX: 0.3 }} animate={isActive ? { opacity: 0.3, scaleX: 1 } : { opacity: 0, scaleX: 0.3 }} transition={{ duration: 0.4, delay: isActive ? 0.6 : 0 }} style={{ width: "clamp(140px, 22vw, 180px)", height: 20, borderRadius: "50%", background: "rgba(45,122,95,0.6)", filter: "blur(12px)", marginTop: 8 }} />
        </motion.div>
      </div>
    </section>
  );
}

/* ── Section 10: Our Vision ───────────────────────────────────────────────────── */
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
        <motion.p className="mb-1 text-center text-sm font-semibold text-primary" initial={{ opacity: 0, y: -20 }} animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }} transition={{ duration: 0.4, ease: easeExpo }}>{t("sec.vision.badge")}</motion.p>
        <div className="mb-4 text-center">
          {t("sec.vision.title").split(" ").map((word, i) => (
            <motion.span key={i} className="inline-block mr-2 font-display text-2xl font-extrabold sm:text-4xl" style={{ willChange: "transform", wordBreak: "break-word" }}
              initial={{ opacity: 0, y: 40, filter: "blur(4px)" }}
              animate={isActive ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 40, filter: "blur(4px)" }}
              transition={{ duration: 0.5, delay: isActive ? i * 0.06 : 0, ease: easeExpo }}>
              {word}
            </motion.span>
          ))}
        </div>
        <div className="mx-auto mb-5 max-w-2xl overflow-hidden text-center text-sm sm:text-base text-muted-foreground">
          <motion.span className="block" initial={{ clipPath: "inset(0 100% 0 0)" }} animate={isActive ? { clipPath: "inset(0 0% 0 0)" } : { clipPath: "inset(0 100% 0 0)" }} transition={{ duration: 0.9, delay: isActive ? 0.3 : 0, ease: easeExpo }}>
            {t("sec.vision.statement")}
          </motion.span>
        </div>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <motion.div key={p.titleKey} initial={{ opacity: 0, x: -20 }} animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }} transition={{ duration: 0.4, delay: isActive ? 0.1 + i * 0.15 : 0 }}>
              <motion.div animate={isActive ? { y: [0, -8, 0] } : {}} transition={{ duration: p.floatDur, delay: p.floatDelay, repeat: Infinity, ease: "easeInOut" }} className="relative rounded-2xl border border-border bg-card p-5 pl-7">
                <motion.div className="absolute left-0 top-5 w-1 rounded-full bg-primary" initial={{ scaleY: 0 }} animate={isActive ? { scaleY: 1 } : { scaleY: 0 }} style={{ height: 64, transformOrigin: "top" }} transition={{ duration: 0.4, delay: isActive ? 0.15 + i * 0.15 : 0 }} />
                <h3 className="text-sm sm:text-base font-bold">{t(p.titleKey)}</h3>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">{t(p.descKey)}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
        <motion.div className="mt-6 text-center" initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={isActive ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.9 }} transition={{ duration: 0.5, delay: isActive ? 0.5 : 0, ease: easeExpo }}>
          <motion.a href="/careers" animate={isActive ? { scale: [1, 1.03, 1], boxShadow: ["0 0 0px #2D7A5F", "0 0 24px #2D7A5F80", "0 0 0px #2D7A5F"] } : {}} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm sm:px-7 sm:py-3.5 font-semibold text-primary-foreground shadow-elegant transition hover:bg-primary/90">
            {t("sec.vision.cta")}
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Section 11: Testimonials ────────────────────────────────────────────────── */
function TestimonialsSection({ isActive }: { isActive: boolean }) {
  const { t } = useI18n();
  return (
    <section className="relative flex h-full flex-col justify-center overflow-hidden bg-background pt-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <motion.div className="mx-auto mb-8 max-w-2xl text-center" initial={{ opacity: 0, y: 30 }} animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }} transition={{ duration: 0.6, ease: easeExpo }}>
          <p className="text-sm font-semibold text-primary">{t("sec.loved")}</p>
          <h2 className="mt-1 font-display text-2xl font-extrabold sm:text-4xl">{t("sec.testimonials")}</h2>
        </motion.div>
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.map((tt, i) => <TestimonialCard key={tt.id} tt={tt} isActive={isActive} delay={i * 0.14} />)}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ tt, isActive, delay }: { tt: typeof TESTIMONIALS[0]; isActive: boolean; delay: number }) {
  return (
    <motion.div style={{ willChange: "transform" }} initial={{ opacity: 0, scale: 0.88, y: 40 }} animate={isActive ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.88, y: 40 }} transition={{ duration: 0.6, delay: isActive ? delay : 0, ease: easeExpo }} whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }} whileTap={{ scale: 0.98 }}>
      <motion.div animate={isActive ? { y: [0, -5, 0] } : {}} transition={{ duration: 4, delay: delay * 2, repeat: Infinity, ease: "easeInOut" }} className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="flex gap-0.5 text-warning">
          {Array.from({ length: tt.rating }).map((_, j) => <Star key={j} className="h-4 w-4 fill-current text-yellow-400" />)}
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
  );
}

/* ── Section 12: Footer ───────────────────────────────────────────────────────── */
function FooterSection({ isActive }: { isActive: boolean }) {
  const { t } = useI18n();
  const cols = [
    { title: t("footer.topServices"), links: CATEGORIES.slice(0, 6).map((c) => ({ label: c.name, to: "/services" as const })) },
    { title: t("footer.company"), links: [{ label: t("footer.about"), to: "/about" as const }, { label: t("nav.jobs"), to: "/jobs" as const }, { label: t("footer.becomeSB"), to: "/become-a-skillbuddy" as const }, { label: t("nav.contact"), to: "/contact" as const }, { label: t("nav.faqs"), to: "/faqs" as const }] },
    { title: t("footer.legal"), links: [{ label: t("footer.terms"), to: "/terms" as const }, { label: t("footer.privacy"), to: "/privacy" as const }, { label: t("footer.support"), to: "/contact" as const }] },
  ];
  return (
    <section className="relative flex h-full flex-col justify-end overflow-hidden pt-16">
      <motion.footer className="border-t border-border bg-surface/40" initial={{ opacity: 0, y: 40 }} animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }} transition={{ duration: 0.6, ease: easeExpo }}>
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:py-14 sm:px-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
          <motion.div className="sm:col-span-2 lg:col-span-2" initial={{ opacity: 0, y: 30 }} animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }} transition={{ duration: 0.4, delay: isActive ? 0.1 : 0 }}>
            <p className="font-display text-lg font-bold">SkillBuddy</p>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">{t("footer.tagline")}</p>
            <form className="mt-5 flex max-w-sm gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="email" placeholder={t("footer.email")} className="pl-9 h-11" />
              </div>
              <Button type="submit" className="h-11 px-4 sm:px-5">{t("footer.subscribe")}</Button>
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
            <motion.div key={col.title} initial={{ opacity: 0, y: 30 }} animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }} transition={{ duration: 0.4, delay: isActive ? 0.1 + (ci + 1) * 0.08 : 0 }}>
              <h4 className="mb-4 text-sm font-semibold">{col.title}</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                {col.links.map((l) => (
                  <li key={l.label}><Link to={l.to} className="transition hover:text-foreground">{l.label}</Link></li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        <div className="border-t border-border px-4 py-5 sm:px-6">
          <p className="text-center text-xs text-muted-foreground">© {new Date().getFullYear()} SkillBuddy. All rights reserved.</p>
        </div>
      </motion.footer>
    </section>
  );
}
