import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { motion } from "framer-motion";
import { Search, Star, ArrowRight, Wrench } from "lucide-react";
import { z } from "zod";

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
            How do you want to use SkillBuddy?
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Choose your path to get started
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <RoleCard
            title="I'm looking for services"
            subtitle="Find and book skilled professionals"
            icon={<Search className="h-8 w-8" />}
            description="Browse services, compare providers, and book appointments with verified SkillBuddies."
            href="/register/seeker"
            features={[
              "Browse 55+ service categories",
              "Read verified reviews",
              "Book instantly",
              "Secure payments",
            ]}
            delay={0.1}
            featured={preselectedRole === "client"}
          />
          <RoleCard
            title="I want to offer services"
            subtitle="Join as a SkillBuddy Provider"
            icon={<Star className="h-8 w-8 fill-current" />}
            description="Showcase your skills, connect with clients, and build your business on SkillBuddy."
            href="/register/skillbuddy"
            features={[
              "Set your own rates",
              "Flexible schedule",
              "Reach thousands of clients",
              "Get paid securely",
            ]}
            delay={0.2}
            featured={preselectedRole === "provider"}
            variant="provider"
          />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center text-sm text-muted-foreground"
        >
          Already have an account?{" "}
          <Link to="/auth/login" className="text-primary hover:underline">
            Sign in
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
            Selected
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
          Get started
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </Link>
    </motion.div>
  );
}
