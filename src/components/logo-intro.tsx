"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logoLight from "@/assets/skillbuddy-logo-dark.png";
import logoWhite from "@/assets/skillbuddy-logo-white.png";

interface LogoIntroProps {
  onComplete: () => void;
}

export function LogoIntro({ onComplete }: LogoIntroProps) {
  const [phase, setPhase] = useState<"show" | "exit">("show");
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
    if (hasPlayedRef.current) return;
    hasPlayedRef.current = true;

    const t1 = setTimeout(() => setPhase("exit"), 1200);
    const t2 = setTimeout(onComplete, 1900);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "exit" || true ? (
        <motion.div
          key="loading-screen"
          className="fixed inset-0 z-[100000] flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          animate={phase === "exit" ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          onAnimationComplete={() => {
            if (phase === "exit") onComplete();
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={
              phase === "exit"
                ? { opacity: 0, y: -60 }
                : { opacity: 1, y: 0 }
            }
            transition={
              phase === "exit"
                ? { duration: 0.45, ease: [0.76, 0, 0.24, 1] }
                : { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
            }
          >
            <picture>
              <source srcSet={logoWhite} media="(prefers-color-scheme: dark)" />
              <img
                src={logoLight}
                alt="SkillBuddy"
                className="h-14 w-auto object-contain dark:[content:var(--logo-white)] dark:brightness-0 dark:invert"
                style={{ height: 56, width: "auto" }}
              />
            </picture>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
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
