import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { CATEGORIES, getServicesByCategory } from "@/lib/data";
import * as Icons from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { motion } from "framer-motion";

type IconCmp = ComponentType<SVGProps<SVGSVGElement> & { className?: string }>;

export const Route = createFileRoute("/categories")({
  head: () => ({ meta: [{ title: "Categories — SkillBuddy" }, { name: "description", content: "Browse all 11 service categories on SkillBuddy." }] }),
  component: CategoriesPage,
});

function CategoriesPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold sm:text-5xl">All categories</h1>
          <p className="mt-3 text-muted-foreground">11 categories, 55+ services. Whatever you need help with — we've got a pro.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((c, i) => {
            const Icon = ((Icons as unknown as Record<string, IconCmp>)[c.icon] ?? Icons.Sparkles) as IconCmp;
            const count = getServicesByCategory(c.slug).length;
            return (
              <motion.div key={c.slug} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
                <Link
                  to="/services"
                  search={{ category: c.slug }}
                  className="group flex h-full flex-col items-center rounded-3xl border border-border bg-card p-6 text-center shadow-card transition hover:-translate-y-1 hover:border-primary hover:shadow-elegant"
                >
                  <div className="mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary transition group-hover:from-primary group-hover:to-primary-glow group-hover:text-primary-foreground">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-bold">{c.name}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{c.description}</p>
                  <div className="mt-3 text-xs font-semibold text-primary">{count} services →</div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SiteShell>
  );
}
