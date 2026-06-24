"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import waveImage from "@/assets/Untitled_design.png";
import ballsImage from "@/assets/Untitled_design_(1).png";

interface LogoIntroProps {
  onComplete: () => void;
}

export function LogoIntro({ onComplete }: LogoIntroProps) {
  const [phase, setPhase] = useState<"wave" | "balls" | "text" | "shrink">("wave");
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    if (hasPlayedRef.current) return;
    hasPlayedRef.current = true;

    const timeline = [
      { phase: "wave" as const, delay: 500 },
      { phase: "balls" as const, delay: 700 },
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
          <div className="relative mb-4 h-32 w-48 sm:h-40 sm:w-60">
            <motion.img
              src={waveImage}
              alt=""
              className="absolute inset-0 h-full w-full object-contain"
              initial={{ opacity: 0, x: -60, scale: 0.8 }}
              animate={
                phase === "wave" || phase === "balls" || phase === "text" || phase === "shrink"
                  ? { opacity: 1, x: 0, scale: 1 }
                  : { opacity: 0, x: -60, scale: 0.8 }
              }
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
            {(phase === "balls" || phase === "text" || phase === "shrink") && (
              <motion.img
                src={ballsImage}
                alt=""
                className="absolute inset-0 h-full w-full object-contain"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15, duration: 0.5, type: "spring", stiffness: 200 }}
              />
            )}
          </div>

          {(phase === "text" || phase === "shrink") && (
            <div className="flex">
              {letters.map((letter, i) => (
                <motion.span
                  key={i}
                  className="font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl"
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
