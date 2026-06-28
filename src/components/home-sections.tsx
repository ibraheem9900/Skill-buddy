"use client";

import { motion } from "framer-motion";
import { Shield, Ban, ThumbsUp, Heart, Star } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

const cardFromLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const cardFromRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const cardFromBottom = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export function WhatMakesUsSpecial() {
  const { t } = useI18n();

  const features = [
    {
      icon: Shield,
      title: t("sec.special.verifiedTitle"),
      desc: t("sec.special.verifiedDesc"),
      variant: "left" as const,
    },
    {
      icon: Ban,
      title: t("sec.special.noHiddenTitle"),
      desc: t("sec.special.noHiddenDesc"),
      variant: "right" as const,
    },
    {
      icon: ThumbsUp,
      title: t("sec.special.satisfactionTitle"),
      desc: t("sec.special.satisfactionDesc"),
      variant: "bottomLeft" as const,
    },
    {
      icon: Heart,
      title: t("sec.special.trustTitle"),
      desc: t("sec.special.trustDesc"),
      variant: "bottomRight" as const,
    },
  ];

  const getVariant = (variant: string) => {
    switch (variant) {
      case "left":
      case "bottomLeft":
        return cardFromLeft;
      case "right":
      case "bottomRight":
        return cardFromRight;
      default:
        return cardFromBottom;
    }
  };

  const getDelay = (variant: string) => {
    switch (variant) {
      case "left":
        return 0;
      case "right":
        return 0.1;
      case "bottomLeft":
        return 0.2;
      case "bottomRight":
        return 0.3;
      default:
        return 0;
    }
  };

  return (
    <section className="bg-[#0D1117] py-20 dark:bg-[#0D1117]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          className="mb-12 text-center"
        >
          <p className="text-sm font-semibold text-primary">{t("sec.special.badge")}</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-white sm:text-4xl">
            {t("sec.special.title")}
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          className="grid gap-6 md:grid-cols-2"
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={getVariant(feature.variant)}
              transition={{ delay: getDelay(feature.variant) }}
              className="group rounded-2xl border-2 border-[#2D7A5F]/30 bg-[#161B22] p-8 transition-all duration-300 hover:border-[#2D7A5F] hover:shadow-lg hover:shadow-[#2D7A5F]/10"
            >
              <div className="mb-4 inline-flex rounded-xl bg-[#2D7A5F]/10 p-3 text-[#4CAF84]">
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-white">{feature.title}</h3>
              <p className="mt-2 text-[#8B949E]">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export function StarReward() {
  const { t } = useI18n();

  const stars = [
    { level: 1, benefits: [t("sec.star.benefit1")], icon: Star },
    { level: 2, benefits: [t("sec.star.benefit2")], icon: Star },
    { level: 3, benefits: [t("sec.star.benefit3")], icon: Star },
  ];

  return (
    <section className="border-y border-border bg-surface/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          className="mb-12 text-center"
        >
          <p className="text-sm font-semibold text-primary">{t("sec.star.badge")}</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">
            {t("sec.star.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            {t("sec.star.subtitle")}
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {stars.map((star, i) => (
            <motion.div
              key={i}
              variants={cardFromBottom}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.05 }}
              transition={{ delay: i * 0.15 }}
              className={`relative overflow-hidden rounded-2xl border-2 p-8 ${
                i === 2
                  ? "border-[#FCD34D] bg-gradient-to-br from-[#FCD34D]/10 to-transparent dark:border-[#F59E0B] dark:from-[#F59E0B]/10"
                  : "border-border bg-card"
              }`}
            >
              <div className="mb-6 flex items-center gap-1">
                {Array.from({ length: star.level }).map((_, j) => (
                  <motion.div
                    key={j}
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 + j * 0.1, type: "spring", stiffness: 200 }}
                    className={i === 2 ? "text-[#FCD34D] dark:text-[#F59E0B]" : "text-primary"}
                  >
                    <Star className="h-8 w-8 fill-current" />
                  </motion.div>
                ))}
              </div>

              <h3 className="text-xl font-bold">
                {t(`sec.star.level${star.level}`)}
              </h3>

              <ul className="mt-4 space-y-2">
                {star.benefits.map((benefit, j) => (
                  <li key={j} className="flex items-center gap-2 text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {benefit}
                  </li>
                ))}
              </ul>

              {i === 2 && (
                <motion.div
                  className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#FCD34D]/20 blur-3xl dark:bg-[#F59E0B]/20"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
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

export function OurVision() {
  const { t } = useI18n();

  const pillars = [
    {
      title: t("sec.vision.pillar1Title"),
      desc: t("sec.vision.pillar1Desc"),
    },
    {
      title: t("sec.vision.pillar2Title"),
      desc: t("sec.vision.pillar2Desc"),
    },
    {
      title: t("sec.vision.pillar3Title"),
      desc: t("sec.vision.pillar3Desc"),
    },
  ];

  return (
    <section className="bg-surface/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          className="mb-12 text-center"
        >
          <p className="text-sm font-semibold text-primary">{t("sec.vision.badge")}</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">
            {t("sec.vision.title")}
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mx-auto mt-6 max-w-3xl text-xl leading-relaxed text-muted-foreground"
          >
            {t("sec.vision.statement")}
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          className="grid gap-6 md:grid-cols-3"
        >
          {pillars.map((pillar, i) => (
            <motion.div
              key={i}
              variants={cardFromBottom}
              className="relative rounded-2xl border border-border bg-card p-6 pl-8"
            >
              <div className="absolute left-0 top-6 h-16 w-1 rounded-full bg-primary" />
              <h3 className="text-lg font-bold">{pillar.title}</h3>
              <p className="mt-2 text-muted-foreground">{pillar.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-10 text-center"
        >
          <a
            href="/careers"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-elegant transition hover:bg-primary/90"
          >
            {t("sec.vision.cta")}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
