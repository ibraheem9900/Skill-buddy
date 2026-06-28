import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import type { CategoryDef, AnimKind } from "@/lib/categories";

type IconCmp = ComponentType<SVGProps<SVGSVGElement> & { className?: string }>;

import type { TargetAndTransition, Transition } from "framer-motion";

const animVariants: Record<AnimKind, { hover: TargetAndTransition; transition?: Transition }> = {
  sweep:  { hover: { rotate: [0, -18, 18, -10, 10, 0] }, transition: { duration: 0.8 } },
  walk:   { hover: { x: [0, 6, 0, 6, 0] }, transition: { duration: 0.7 } },
  drive:  { hover: { x: [0, 10, -2, 0] }, transition: { duration: 0.6 } },
  drop:   { hover: { y: [0, 6, 0] }, transition: { duration: 0.6, repeat: 1 } },
  stroke: { hover: { rotate: [0, 12, -12, 0] }, transition: { duration: 0.5 } },
  bounce: { hover: { y: [0, -8, 0, -4, 0] }, transition: { duration: 0.6 } },
  flash:  { hover: { scale: [1, 1.3, 0.9, 1.2, 1], opacity: [1, 0.6, 1, 0.6, 1] }, transition: { duration: 0.5 } },
  spin:   { hover: { rotate: 360 }, transition: { duration: 0.8 } },
  scale:  { hover: { scale: 1.2 }, transition: { duration: 0.25 } },
};

export function CategoryCard({ category }: { category: CategoryDef }) {
  const Icon = ((Icons as unknown as Record<string, IconCmp>)[category.icon] ?? Icons.Sparkles) as IconCmp;
  const v = animVariants[category.anim];
  return (
    <Link
      to="/services"
      search={{ category: category.slug, sort: "popular" }}
      className="group flex h-full w-full flex-col items-center justify-start gap-3 rounded-2xl border border-border bg-card p-5 text-center transition-all duration-200 hover:border-[rgba(46,184,122,0.3)] hover:-translate-y-1 hover:shadow-card"
    >
      <motion.div
        whileHover={v.hover}
        transition={v.transition}
        className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary transition-all duration-200 group-hover:bg-[#F99912] group-hover:text-white"
      >
        <Icon className="h-7 w-7" />
      </motion.div>
      <div className="min-h-[2.5rem] text-sm font-semibold leading-tight transition-colors duration-200">{category.name}</div>
    </Link>
  );
}
