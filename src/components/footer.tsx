import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/logo";
import { Facebook, Instagram, Twitter, Youtube, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="mt-20 border-t border-border bg-surface/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">{t("footer.tagline")}</p>
          <form className="mt-6 flex max-w-sm gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="email" placeholder={t("footer.email")} className="pl-9 h-11" />
            </div>
            <Button type="submit" className="h-11 px-5">{t("footer.subscribe")}</Button>
          </form>
          <div className="mt-6 flex gap-2">
            {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-full bg-muted text-muted-foreground transition hover:bg-primary hover:text-primary-foreground">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <FooterCol title={t("footer.topServices")} links={CATEGORIES.slice(0, 6).map((c) => ({ to: "/services", label: t("cat." + c.slug.replace(/-/g, "_")), search: { category: c.slug } }))} />
        <FooterCol title={t("footer.company")} links={[
          { to: "/about", label: t("footer.about") },
          { to: "/jobs", label: t("nav.jobs") },
          { to: "/become-a-provider", label: t("footer.becomeSB") },
          { to: "/contact", label: t("nav.contact") },
          { to: "/faqs", label: t("nav.faqs") },
        ]} />
        <FooterCol title={t("footer.legal")} links={[
          { to: "/terms", label: t("footer.terms") },
          { to: "/privacy", label: t("footer.privacy") },
          { to: "/contact", label: t("footer.support") },
        ]} />
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} SkillBuddy. {t("footer.rights")}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string; search?: Record<string, string> }[] }) {
  return (
    <div>
      <h4 className="mb-4 text-sm font-semibold">{title}</h4>
      <ul className="space-y-2.5 text-sm text-muted-foreground">
        {links.map((l) => (
          <li key={l.label}>
            <Link to={l.to} search={l.search as never} className="hover:text-foreground">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
