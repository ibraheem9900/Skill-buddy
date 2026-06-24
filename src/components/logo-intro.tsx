"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LogoIntroProps {
  onComplete: () => void;
}

export function LogoIntro({ onComplete }: LogoIntroProps) {
  const [phase, setPhase] = useState<"wave" | "balls" | "text" | "shrink">("wave");
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    if (hasPlayedRef.current) return;
    hasPlayedRef.current = true;

    const timeline: { phase: "wave" | "balls" | "text" | "shrink"; delay: number }[] = [
      { phase: "wave", delay: 0 },
      { phase: "balls", delay: 700 },
      { phase: "text", delay: 600 },
      { phase: "shrink", delay: 900 },
    ];

    let elapsed = 0;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    timeline.forEach(({ phase: p, delay }) => {
      elapsed += delay;
      timeouts.push(setTimeout(() => setPhase(p), elapsed));
    });

    timeouts.push(setTimeout(onComplete, elapsed + 900));

    return () => timeouts.forEach(clearTimeout);
  }, [onComplete]);

  const letters = "SkillBuddy".split("");
  const isShrink = phase === "shrink";

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100000] flex items-center justify-center bg-background"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.45, ease: "easeInOut" }}
      >
        <motion.div
          className="relative flex flex-col items-center gap-4"
          animate={
            isShrink
              ? { scale: 0.28, y: typeof window !== "undefined" ? -window.innerHeight / 2 + 48 : -300 }
              : { scale: 1, y: 0 }
          }
          transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="relative flex h-28 w-44 items-center justify-center">
            <motion.img
              src="/intro-wave.png"
              alt=""
              className="absolute inset-0 h-full w-full object-contain"
              initial={{ opacity: 0, scale: 0.4 }}
              animate={
                phase === "wave" || phase === "balls" || phase === "text" || phase === "shrink"
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.4 }
              }
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />

            <motion.img
              src="/intro-balls.png"
              alt=""
              className="absolute inset-0 h-full w-full object-contain"
              initial={{ opacity: 0, scale: 0 }}
              animate={
                phase === "balls" || phase === "text" || phase === "shrink"
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0 }
              }
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], type: "spring", stiffness: 400, damping: 22 }}
            />
          </div>

          <AnimatePresence>
            {(phase === "text" || phase === "shrink") && (
              <motion.div
                className="flex"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {letters.map((letter, i) => (
                  <motion.span
                    key={i}
                    className="font-display text-4xl font-extrabold tracking-tight text-foreground"
                    initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ delay: i * 0.045, duration: 0.3, ease: "easeOut" }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
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
