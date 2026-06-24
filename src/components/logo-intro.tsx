"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

interface LogoIntroProps {
  onComplete: () => void;
}

export function LogoIntro({ onComplete }: LogoIntroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isComplete, setIsComplete] = useState(false);
  const hasPlayedRef = useRef(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Transform scroll progress to animation phases
  const curveProgress = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const ballsProgress = useTransform(scrollYProgress, [0.5, 0.8], [0, 1]);
  const fadeOutProgress = useTransform(scrollYProgress, [0.85, 1], [0, 1]);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (latest >= 1 && !hasPlayedRef.current) {
        hasPlayedRef.current = true;
        setIsComplete(true);
        setTimeout(onComplete, 400);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, onComplete]);

  return (
    <div
      ref={containerRef}
      className="relative h-[200vh] w-full"
      style={{ scrollSnapAlign: "start" }}
    >
      <motion.div
        className="sticky top-0 flex h-screen w-full items-center justify-center bg-background"
        style={{ opacity: useTransform(fadeOutProgress, (v) => 1 - v) }}
      >
        <div className="relative flex flex-col items-center">
          <svg
            width="240"
            height="140"
            viewBox="0 0 240 140"
            className="mb-6"
          >
            <defs>
              <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--color-primary)" />
                <stop offset="100%" stopColor="var(--color-primary-glow, var(--color-primary))" />
              </linearGradient>
            </defs>

            {/* The curve path - drawn by scroll */}
            <motion.path
              d="M 30 100 Q 120 20 210 100"
              fill="none"
              stroke="url(#curveGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              style={{
                pathLength: curveProgress,
                opacity: 1,
              }}
            />

            {/* Left ball - appears from left side when curve is ~50% done */}
            <motion.circle
              cx="38"
              cy="88"
              r="16"
              fill="var(--color-primary)"
              style={{
                x: useTransform(ballsProgress, (v) => (1 - v) * -100),
                opacity: ballsProgress,
                scale: useTransform(ballsProgress, (v) => 0.5 + v * 0.5),
              }}
              transition={{ type: "spring", stiffness: 100 }}
            />

            {/* Right ball - appears from right side when curve is ~50% done */}
            <motion.circle
              cx="202"
              cy="88"
              r="16"
              fill="var(--color-primary-glow, var(--color-primary))"
              style={{
                x: useTransform(ballsProgress, (v) => (1 - v) * 100),
                opacity: ballsProgress,
                scale: useTransform(ballsProgress, (v) => 0.5 + v * 0.5),
              }}
              transition={{ type: "spring", stiffness: 100 }}
            />
          </svg>

          {/* Text appears when balls are in place */}
          <motion.div
            className="flex overflow-hidden"
            style={{
              opacity: useTransform(ballsProgress, [0.3, 1], [0, 1]),
              y: useTransform(ballsProgress, [0.3, 1], [20, 0]),
            }}
          >
            {"SkillBuddy".split("").map((letter, i) => (
              <motion.span
                key={i}
                className="font-display text-5xl font-extrabold tracking-tight text-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.04, duration: 0.25 }}
              >
                {letter}
              </motion.span>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-[-80px] flex flex-col items-center gap-2"
            style={{
              opacity: useTransform(scrollYProgress, [0, 0.15], [1, 0]),
            }}
          >
            <span className="text-sm font-medium text-muted-foreground">Scroll to explore</span>
            <motion.div
              className="h-10 w-6 rounded-full border-2 border-muted-foreground/40 p-1"
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <motion.div
                className="h-2 w-2 rounded-full bg-primary"
                animate={{ y: [0, 16, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export function useLogoIntro() {
  const [showIntro, setShowIntro] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);

  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem("skillbuddy_intro_seen");
    if (!hasSeenIntro) {
      setShowIntro(true);
    } else {
      setIntroComplete(true);
    }
  }, []);

  const handleIntroComplete = () => {
    sessionStorage.setItem("skillbuddy_intro_seen", "true");
    setShowIntro(false);
    setIntroComplete(true);
  };

  return { showIntro, introComplete, handleIntroComplete };
}
