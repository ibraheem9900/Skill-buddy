"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LogoIntroProps {
  onComplete: () => void;
}

export function LogoIntro({ onComplete }: LogoIntroProps) {
  const [phase, setPhase] = useState<"line" | "balls" | "text" | "shrink">("line");
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    if (hasPlayedRef.current) return;
    hasPlayedRef.current = true;

    const timeline = [
      { phase: "line" as const, delay: 400 },
      { phase: "balls" as const, delay: 800 },
      { phase: "text" as const, delay: 600 },
      { phase: "shrink" as const, delay: 1200 },
    ];

    let elapsed = 0;
    const timeouts: NodeJS.Timeout[] = [];

    timeline.forEach(({ phase: p, delay }) => {
      elapsed += delay;
      timeouts.push(
        setTimeout(() => setPhase(p), elapsed)
      );
    });

    const totalDuration = elapsed + 800;
    timeouts.push(setTimeout(onComplete, totalDuration));

    return () => timeouts.forEach(clearTimeout);
  }, [onComplete]);

  const letters = "SkillBuddy".split("");

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100000] flex items-center justify-center bg-background"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          className="relative flex flex-col items-center"
          initial={{ scale: 1 }}
          animate={phase === "shrink" ? {
            scale: 0.3,
            y: -window.innerHeight / 2 + 50
          } : {}}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <svg
            width="180"
            height="120"
            viewBox="0 0 180 120"
            className="mb-4"
          >
            <motion.path
              d="M 20 80 Q 90 20 160 80"
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 1 }}
              animate={
                phase === "line" || phase === "balls" || phase === "text" || phase === "shrink"
                  ? { pathLength: 1 }
                  : {}
              }
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            {(phase === "balls" || phase === "text" || phase === "shrink") && (
              <>
                <motion.circle
                  cx="30"
                  cy="68"
                  r="14"
                  fill="var(--color-primary)"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.4, type: "spring" }}
                />
                <motion.circle
                  cx="150"
                  cy="68"
                  r="14"
                  fill="var(--color-primary-glow)"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4, type: "spring" }}
                />
              </>
            )}
          </svg>

          {(phase === "text" || phase === "shrink") && (
            <div className="flex">
              {letters.map((letter, i) => (
                <motion.span
                  key={i}
                  className="font-display text-4xl font-extrabold tracking-tight text-foreground"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: i * 0.05,
                    duration: 0.3,
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
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
