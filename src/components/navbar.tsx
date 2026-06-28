import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const navLinks = [
    { to: "/", label: t("nav.home") },
    { to: "/services", label: t("nav.services") },
    { to: "/jobs", label: t("nav.jobs") },
    { to: "/careers", label: t("nav.careers") },
    { to: "/faqs", label: t("nav.faqs") },
    { to: "/contact", label: t("nav.contact") },
  ] as const;

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Portal content — rendered into document.body to escape all stacking contexts
  const mobileMenu = mounted && createPortal(
    <AnimatePresence>
      {menuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeMenu}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 99998,
              backgroundColor: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              touchAction: "none",
            }}
          />
          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: "80vw",
              maxWidth: 300,
              zIndex: 99999,
              boxShadow: "-8px 0 40px rgba(0,0,0,0.25)",
              display: "flex",
              flexDirection: "column",
              paddingTop: 16,
              paddingLeft: 20,
              paddingRight: 20,
              paddingBottom: 24,
              overflowY: "auto",
              background: "var(--background, #fff)",
            }}
          >
            {/* Close button row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <Logo size={28} />
              <button
                onClick={closeMenu}
                style={{
                  background: "none",
                  border: "1px solid rgba(0,0,0,0.12)",
                  borderRadius: 8,
                  width: 32,
                  height: 32,
                  fontSize: 18,
                  cursor: "pointer",
                  color: "currentColor",
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
                  onClick={closeMenu}
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
            <div style={{ height: 1, background: "rgba(0,0,0,0.08)", marginBottom: 16 }} />

            {/* Auth buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Link to="/auth/login" onClick={closeMenu}>
                <button style={{
                  width: "100%", padding: "12px", borderRadius: 50,
                  border: "1.5px solid #2D7A5F", background: "transparent",
                  color: "#2D7A5F", fontWeight: 600, fontSize: 15, cursor: "pointer",
                }}>
                  {t("nav.login")}
                </button>
              </Link>
              <Link to="/auth/signup" onClick={closeMenu}>
                <button style={{
                  width: "100%", padding: "12px", borderRadius: 50,
                  background: "#2D7A5F", color: "white",
                  fontWeight: 600, fontSize: 15, border: "none", cursor: "pointer",
                }}>
                  {t("nav.signup")}
                </button>
              </Link>
              <Link to="/become-a-skillbuddy" onClick={closeMenu}>
                <button style={{
                  width: "100%", padding: "12px", borderRadius: 50,
                  background: "linear-gradient(135deg, #DA983C, #F99912)",
                  color: "white", fontWeight: 600, fontSize: 14,
                  border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}>
                  <img src={iconTransparent} alt="" style={{ width: 16, height: 16, objectFit: "contain", filter: "brightness(0) invert(1)" }} />
                  {t("nav.becomeSkillBuddy")}
                </button>
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );

  return (
    <>
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
                      "0 0 10px rgba(218,152,60,0.3)",
                      "0 0 25px rgba(218,152,60,0.7), 0 0 45px rgba(249,153,18,0.2)",
                      "0 0 10px rgba(218,152,60,0.3)",
                    ],
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  whileHover={{ scale: 1.06, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    background: "linear-gradient(135deg, #DA983C, #F99912)",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={iconTransparent}
                    alt="SkillBuddy"
                    style={{
                      width: 20, height: 20, objectFit: "contain",
                      filter: "brightness(0) invert(1)", flexShrink: 0,
                    }}
                  />
                  <span>{t("nav.becomeSkillBuddy")}</span>
                </motion.button>
              </Link>
            </div>

            {/* Hamburger — mobile & tablet */}
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((p) => !p)}
              className="lg:hidden"
              style={{
                width: 44, height: 44, padding: 8, marginLeft: 4,
                flexShrink: 0, display: "flex", alignItems: "center",
                justifyContent: "center", borderRadius: 8,
                background: "none", border: "none", cursor: "pointer",
                color: "inherit", touchAction: "manipulation",
                position: "relative", zIndex: 1,
              }}
            >
              <motion.div
                animate={menuOpen ? "open" : "closed"}
                style={{ display: "flex", flexDirection: "column", gap: "5px", width: 22 }}
              >
                <motion.span
                  variants={{ closed: { rotate: 0, y: 0 }, open: { rotate: 45, y: 7 } }}
                  transition={{ duration: 0.25 }}
                  style={{ display: "block", height: 2, width: 22, background: "currentColor", borderRadius: 2, transformOrigin: "center" }}
                />
                <motion.span
                  variants={{ closed: { opacity: 1 }, open: { opacity: 0 } }}
                  transition={{ duration: 0.15 }}
                  style={{ display: "block", height: 2, width: 22, background: "currentColor", borderRadius: 2 }}
                />
                <motion.span
                  variants={{ closed: { rotate: 0, y: 0 }, open: { rotate: -45, y: -7 } }}
                  transition={{ duration: 0.25 }}
                  style={{ display: "block", height: 2, width: 22, background: "currentColor", borderRadius: 2, transformOrigin: "center" }}
                />
              </motion.div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu rendered in a portal (document.body) — avoids all stacking context issues */}
      {mobileMenu}
    </>
  );
}
