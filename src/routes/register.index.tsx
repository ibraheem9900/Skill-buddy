import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { motion } from "framer-motion";
import { Search, Star, ArrowRight, Wrench } from "lucide-react";
import { z } from "zod";
import { useI18n } from "@/lib/i18n";

const roleSelectSearchSchema = z.object({
  role: z.enum(["client", "provider"]).optional(),
});

export const Route = createFileRoute("/register/")({
  head: () => ({
    meta: [
      { title: "Choose Your Role — SkillBuddy" },
      { name: "description", content: "Join SkillBuddy as a client or service provider." },
    ],
  }),
  validateSearch: roleSelectSearchSchema,
  component: RegisterRoleSelect,
});

function RegisterRoleSelect() {
  const search = useSearch({ from: "/register/" });
  const preselectedRole = search.role;
  const { t } = useI18n();

  return (
    <SiteShell>
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            {t("register.role.title")}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("register.role.subtitle")}
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <RoleCard
            title={t("register.role.clientTitle")}
            subtitle={t("register.role.clientSubtitle")}
            icon={<Search className="h-8 w-8" />}
            description={t("register.role.clientDesc")}
            href="/register/seeker"
            features={[
              t("register.role.clientFeature1"),
              t("register.role.clientFeature2"),
              t("register.role.clientFeature3"),
              t("register.role.clientFeature4"),
            ]}
            delay={0.1}
            featured={preselectedRole === "client"}
            t={t}
          />
          <RoleCard
            title={t("register.role.providerTitle")}
            subtitle={t("register.role.providerSubtitle")}
            icon={<Star className="h-8 w-8 fill-current" />}
            description={t("register.role.providerDesc")}
            href="/register/skillbuddy"
            features={[
              t("register.role.providerFeature1"),
              t("register.role.providerFeature2"),
              t("register.role.providerFeature3"),
              t("register.role.providerFeature4"),
            ]}
            delay={0.2}
            featured={preselectedRole === "provider"}
            variant="provider"
            t={t}
          />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center text-sm text-muted-foreground"
        >
          {t("register.role.haveAccount")}{" "}
          <Link to="/auth/login" className="text-primary hover:underline">
            {t("auth.signin")}
          </Link>
        </motion.p>
      </div>
    </SiteShell>
  );
}

interface RoleCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  description: string;
  href: string;
  features: string[];
  delay: number;
  featured?: boolean;
  variant?: "client" | "provider";
  t: (k: string) => string;
}

function RoleCard({
  title,
  subtitle,
  icon,
  description,
  href,
  features,
  delay,
  featured,
  variant = "client",
  t,
}: RoleCardProps) {
  const isProvider = variant === "provider";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Link
        to={href}
        className={`group relative block rounded-2xl border-2 p-8 transition-all duration-300 ${
          isProvider
            ? "border-[#2D7A5F] bg-gradient-to-br from-[#2D7A5F]/5 to-transparent hover:border-[#236B4F] hover:shadow-lg hover:shadow-[#2D7A5F]/10"
            : "border-border bg-card hover:border-primary hover:shadow-lg"
        } ${featured ? "ring-2 ring-primary ring-offset-2" : ""}`}
      >
        {featured && (
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
            {t("register.role.selected")}
          </span>
        )}

        <div
          className={`mb-4 inline-flex rounded-xl p-3 ${
            isProvider ? "bg-[#2D7A5F]/10 text-[#2D7A5F]" : "bg-primary/10 text-primary"
          }`}
        >
          {icon}
        </div>

        <h2 className="text-2xl font-bold">{title}</h2>
        <p
          className={`mt-1 text-sm font-medium ${
            isProvider ? "text-[#2D7A5F]" : "text-primary"
          }`}
        >
          {subtitle}
        </p>
        <p className="mt-3 text-muted-foreground">{description}</p>

        <ul className="mt-6 space-y-2">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm">
              <Wrench
                className={`h-4 w-4 ${
                  isProvider ? "text-[#2D7A5F]" : "text-primary"
                }`}
              />
              {feature}
            </li>
          ))}
        </ul>

        <div
          className={`mt-8 flex items-center gap-2 font-semibold ${
            isProvider ? "text-[#2D7A5F]" : "text-primary"
          }`}
        >
          {t("register.role.getStarted")}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </Link>
    </motion.div>
  );
}
