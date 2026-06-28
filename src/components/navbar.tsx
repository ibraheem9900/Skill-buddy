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
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <nav className="navbar">
      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link to="/" className="flex items-center">
          <Logo />
        </Link>

        {/* Desktop nav links */}
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

          {/* Desktop CTA buttons */}
          <div className="hidden md:flex items-center gap-2 pl-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/auth/login">{t("nav.login")}</Link>
            </Button>
            <Button asChild size="sm" className="shadow-elegant">
              <Link to="/auth/signup">{t("nav.signup")}</Link>
            </Button>
            <Link to="/become-a-skillbuddy">
              <motion.button
                className="become-skillbuddy-btn gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold flex items-center"
                animate={{
                  boxShadow: [
                    "0 0 12px rgba(62,207,142,0.3)",
                    "0 0 28px rgba(62,207,142,0.7), 0 0 50px rgba(62,207,142,0.2)",
                    "0 0 12px rgba(62,207,142,0.3)",
                  ],
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.06, y: -1 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: "linear-gradient(135deg, #3ECF8E, #2DB87A)",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
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
              </motion.button>
            </Link>
          </div>

          {/* Hamburger button — mobile only */}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMenuOpen((p) => !p); }}
            className="lg:hidden ml-1 flex items-center justify-center rounded-md hover:bg-accent transition text-foreground"
            style={{ width: 36, height: 36, padding: 6, flexShrink: 0 }}
          >
            <motion.div
              animate={menuOpen ? "open" : "closed"}
              style={{ display: "flex", flexDirection: "column", gap: "4px", width: 20 }}
            >
              <motion.span
                variants={{
                  closed: { rotate: 0, y: 0 },
                  open: { rotate: 45, y: 6 },
                }}
                transition={{ duration: 0.25 }}
                style={{
                  display: "block",
                  height: 2,
                  width: 20,
                  background: "currentColor",
                  borderRadius: 2,
                }}
              />
              <motion.span
                variants={{
                  closed: { opacity: 1, scaleX: 1 },
                  open: { opacity: 0, scaleX: 0 },
                }}
                transition={{ duration: 0.2 }}
                style={{
                  display: "block",
                  height: 2,
                  width: 20,
                  background: "currentColor",
                  borderRadius: 2,
                }}
              />
              <motion.span
                variants={{
                  closed: { rotate: 0, y: 0 },
                  open: { rotate: -45, y: -6 },
                }}
                transition={{ duration: 0.25 }}
                style={{
                  display: "block",
                  height: 2,
                  width: 20,
                  background: "currentColor",
                  borderRadius: 2,
                }}
              />
            </motion.div>
          </button>
        </div>
      </div>

      {/* Backdrop */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMenuOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              top: 0,
              zIndex: 99999,
              backgroundColor: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Right-side drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="bg-background"
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: "80vw",
              maxWidth: 300,
              zIndex: 100000,
              boxShadow: "-8px 0 40px rgba(0,0,0,0.22)",
              display: "flex",
              flexDirection: "column",
              paddingTop: 16,
              paddingLeft: 20,
              paddingRight: 20,
              paddingBottom: 24,
              overflowY: "auto",
            }}
          >
            {/* Close button row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <Logo size={28} />
              <button
                onClick={() => setMenuOpen(false)}
                style={{
                  background: "none",
                  border: "1px solid var(--border, rgba(0,0,0,0.12))",
                  borderRadius: 8,
                  width: 32,
                  height: 32,
                  fontSize: 18,
                  cursor: "pointer",
                  color: "currentColor",
                  lineHeight: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            {/* Nav links */}
            <nav style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  activeOptions={{ exact: link.to === "/" }}
                  className="text-foreground hover:bg-accent"
                  style={{
                    display: "block",
                    padding: "10px 12px",
                    borderRadius: 10,
                    fontSize: 16,
                    fontWeight: 500,
                    textDecoration: "none",
                  }}
                >
                  {link.label}
                </Link>
              ))}

              <div style={{ marginTop: 8, marginBottom: 8, paddingLeft: 8 }}>
                <LanguageSelector />
              </div>
            </nav>

            {/* Divider */}
            <div style={{ height: 1, background: "var(--border, rgba(0,0,0,0.08))", marginBottom: 16 }} />

            {/* Auth buttons at bottom */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 0 }}>
              <Link to="/auth/login" onClick={() => setMenuOpen(false)}>
                <button
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: 50,
                    border: "1.5px solid #2D7A5F",
                    background: "transparent",
                    color: "#2D7A5F",
                    fontWeight: 600,
                    fontSize: 15,
                    cursor: "pointer",
                  }}
                >
                  {t("nav.login")}
                </button>
              </Link>
              <Link to="/auth/signup" onClick={() => setMenuOpen(false)}>
                <button
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: 50,
                    background: "#2D7A5F",
                    color: "white",
                    fontWeight: 600,
                    fontSize: 15,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {t("nav.signup")}
                </button>
              </Link>
              <Link to="/become-a-skillbuddy" onClick={() => setMenuOpen(false)}>
                <button
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: 50,
                    background: "#1a5c3a",
                    color: "white",
                    fontWeight: 600,
                    fontSize: 14,
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  <img
                    src={iconTransparent}
                    alt=""
                    style={{ width: 16, height: 16, objectFit: "contain", filter: "brightness(0) invert(1)" }}
                  />
                  {t("nav.becomeSkillBuddy")}
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
