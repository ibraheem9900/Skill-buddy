import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import iconTransparent from "@/assets/skillbuddy-icon-transparent.png";
import { useTheme } from "@/components/theme-provider";
import { LanguageSelector } from "@/components/language-selector";
import { useI18n } from "@/lib/i18n";

export function Navbar() {
  const { theme, toggle } = useTheme();
  const { t } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", label: t("nav.home") },
    { to: "/services", label: t("nav.services") },
    { to: "/jobs", label: t("nav.jobs") },
    { to: "/careers", label: t("nav.careers") },
    { to: "/faqs", label: t("nav.faqs") },
    { to: "/contact", label: t("nav.contact") },
  ] as const;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuOpen && !(e.target as Element).closest(".navbar")) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [menuOpen]);

  return (
    <nav
      className="navbar"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        height: "72px",
        display: "flex",
        alignItems: "center",
        boxShadow:
          theme === "dark"
            ? "0 2px 20px rgba(0,0,0,0.5)"
            : "0 2px 20px rgba(0,0,0,0.07)",
      }}
    >
      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link to="/" className="flex items-center">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-md px-3 py-2 text-sm font-semibold text-[#111111] dark:text-[#ffffff] transition hover:bg-accent"
              activeProps={{ className: "text-primary" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <div className="hidden sm:block">
            <LanguageSelector />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            aria-label="Toggle theme"
            className="relative overflow-hidden"
          >
            <motion.div
              key={theme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </motion.div>
          </Button>

          <div className="hidden md:flex items-center gap-2 pl-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/auth/login">{t("nav.login")}</Link>
            </Button>
            <Button asChild size="sm" className="shadow-elegant">
              <Link to="/auth/signup">{t("nav.signup")}</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="gap-1.5 rounded-full bg-[#2D7A5F] text-white shadow-md hover:bg-[#236B4F] hover:shadow-lg"
            >
              <Link to="/become-a-skillbuddy">
                <img
                  src={iconTransparent}
                  alt="SkillBuddy"
                  style={{
                    width: 20,
                    height: 20,
                    objectFit: "contain",
                    filter: "brightness(0) invert(1)",
                    flexShrink: 0,
                  }}
                />
                <span>{t("nav.becomeSkillBuddy")}</span>
              </Link>
            </Button>
          </div>

          <button
            className="lg:hidden ml-1 flex flex-col items-center justify-center w-9 h-9 rounded-md hover:bg-accent transition text-foreground"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <motion.div
              animate={menuOpen ? "open" : "closed"}
              className="flex flex-col gap-[5px]"
            >
              <motion.span
                variants={{
                  closed: { rotate: 0, y: 0 },
                  open: { rotate: 45, y: 7 },
                }}
                transition={{ duration: 0.25 }}
                style={{
                  display: "block",
                  height: "2px",
                  width: "22px",
                  background: "currentColor",
                  borderRadius: 2,
                }}
              />
              <motion.span
                variants={{ closed: { opacity: 1 }, open: { opacity: 0 } }}
                transition={{ duration: 0.2 }}
                style={{
                  display: "block",
                  height: "2px",
                  width: "22px",
                  background: "currentColor",
                  borderRadius: 2,
                }}
              />
              <motion.span
                variants={{
                  closed: { rotate: 0, y: 0 },
                  open: { rotate: -45, y: -7 },
                }}
                transition={{ duration: 0.25 }}
                style={{
                  display: "block",
                  height: "2px",
                  width: "22px",
                  background: "currentColor",
                  borderRadius: 2,
                }}
              />
            </motion.div>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="bg-white/[0.98] dark:bg-[#090d12]/[0.98]"
            style={{
              position: "absolute",
              top: "72px",
              left: 0,
              right: 0,
              zIndex: 9998,
              borderBottom: "1px solid rgba(0,0,0,0.09)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-[10px] px-4 py-3 text-base font-semibold text-[#111111] dark:text-white hover:bg-accent transition"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 px-1">
                <LanguageSelector />
              </div>
              <div className="mt-3 grid gap-2 px-1">
                <Button
                  asChild
                  variant="outline"
                  onClick={() => setMenuOpen(false)}
                >
                  <Link to="/auth/login">{t("nav.login")}</Link>
                </Button>
                <Button asChild onClick={() => setMenuOpen(false)}>
                  <Link to="/auth/signup">{t("nav.signup")}</Link>
                </Button>
                <Button
                  asChild
                  className="gap-1.5 rounded-full bg-[#2D7A5F] text-white hover:bg-[#236B4F]"
                  onClick={() => setMenuOpen(false)}
                >
                  <Link to="/become-a-skillbuddy">
                    <img
                      src={iconTransparent}
                      alt="SkillBuddy"
                      style={{
                        width: 18,
                        height: 18,
                        objectFit: "contain",
                        filter: "brightness(0) invert(1)",
                        flexShrink: 0,
                      }}
                    />
                    <span>{t("nav.becomeSkillBuddy")}</span>
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
