"use client";

import { Link } from "@tanstack/react-router";
import { Menu, Moon, Star, Sun, User } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { useTheme } from "@/components/theme-provider";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LanguageSelector } from "@/components/language-selector";
import { useI18n } from "@/lib/i18n";

export function Navbar() {
  const { theme, toggle } = useTheme();
  const { t } = useI18n();

  const navLinks = [
    { to: "/", label: t("nav.home") },
    { to: "/services", label: t("nav.services") },
    { to: "/jobs", label: t("nav.jobs") },
    { to: "/careers", label: t("nav.careers") },
    { to: "/faqs", label: t("nav.faqs") },
    { to: "/contact", label: t("nav.contact") },
  ] as const;

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 9999,
        height: 64,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        transition: "background 0.3s ease, border-color 0.3s ease",
      }}
      className={
        theme === "dark"
          ? "bg-[rgba(18,18,18,0.85)] border-b border-[rgba(255,255,255,0.08)]"
          : "bg-[rgba(255,255,255,0.85)] border-b border-[rgba(0,0,0,0.08)]"
      }
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link to="/" className="flex items-center"><Logo /></Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              style={{ color: theme === "dark" ? "#ffffff" : "#111111" }}
              className="rounded-md px-3 py-2 text-sm font-semibold transition hover:bg-accent hover:text-foreground"
              activeProps={{ className: "text-primary" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <div className="hidden sm:block"><LanguageSelector /></div>
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme" className="relative overflow-hidden">
            <motion.div
              key={theme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </motion.div>
          </Button>
          <div className="hidden md:flex items-center gap-2 pl-2">
            <Button asChild variant="ghost" size="sm"><Link to="/auth/login">{t("nav.login")}</Link></Button>
            <Button asChild size="sm" className="shadow-elegant"><Link to="/auth/signup">{t("nav.signup")}</Link></Button>
            <Button asChild size="sm" className="gap-1.5 rounded-full bg-[#2D7A5F] text-white shadow-md hover:bg-[#236B4F] hover:shadow-lg">
              <Link to="/register" search={{ role: "provider" }}>
                <Star className="h-4 w-4 fill-white" />
                <User className="h-3.5 w-3.5" />
                <span>Become a SkillBuddy</span>
              </Link>
            </Button>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="mt-8 flex flex-col gap-1">
                {navLinks.map((n) => (
                  <Link key={n.to} to={n.to} className="rounded-lg px-3 py-3 text-base font-semibold hover:bg-accent">
                    {n.label}
                  </Link>
                ))}
                <div className="mt-2 px-1"><LanguageSelector /></div>
                <div className="mt-4 grid gap-2">
                  <Button asChild variant="outline"><Link to="/auth/login">{t("nav.login")}</Link></Button>
                  <Button asChild><Link to="/auth/signup">{t("nav.signup")}</Link></Button>
                  <Button asChild className="gap-1.5 rounded-full bg-[#2D7A5F] text-white shadow-md hover:bg-[#236B4F]">
                    <Link to="/register" search={{ role: "provider" }}>
                      <Star className="h-4 w-4 fill-white" />
                      <User className="h-3.5 w-3.5" />
                      <span>Become a SkillBuddy</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
