"use client";

import { motion } from "framer-motion";
import logoIcon from "@/assets/skillbuddy-icon-transparent.png";

export function SkillBuddyLoader() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: [1, 1.08, 1],
          opacity: 1,
        }}
        transition={{
          scale: {
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut",
          },
          opacity: { duration: 0.4 },
        }}
        className="flex flex-col items-center"
      >
        <img
          src={logoIcon}
          alt="SkillBuddy"
          className="h-16 w-16 object-contain sm:h-20 sm:w-20"
        />
        <h1 className="mt-4 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          SkillBuddy
        </h1>
      </motion.div>

      <div className="mt-6 flex items-center gap-1.5">
        {[0, 200, 400].map((delay, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0.3 }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: delay / 1000,
              ease: "easeInOut",
            }}
            className="h-2 w-2 rounded-full bg-primary"
          />
        ))}
      </div>
    </div>
  );
}
