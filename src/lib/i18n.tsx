import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Locale = "en" | "et" | "ru" | "lv" | "lt";

export const LOCALES: { code: Locale; name: string; flag: string }[] = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "et", name: "Estonian", flag: "🇪🇪" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "lv", name: "Latvian", flag: "🇱🇻" },
  { code: "lt", name: "Lithuanian", flag: "🇱🇹" },
];

type Dict = Record<string, string>;

const dicts: Record<Locale, Dict> = {
  en: {
    "nav.home": "Home", "nav.services": "Services", "nav.jobs": "Jobs",
    "nav.faqs": "FAQs", "nav.contact": "Contact Us",
    "nav.login": "Log in", "nav.signup": "Sign Up",
  },
  et: {
    "nav.home": "Avaleht", "nav.services": "Teenused", "nav.jobs": "Tööd",
    "nav.faqs": "KKK", "nav.contact": "Võta ühendust",
    "nav.login": "Logi sisse", "nav.signup": "Registreeru",
  },
  ru: {
    "nav.home": "Главная", "nav.services": "Услуги", "nav.jobs": "Работы",
    "nav.faqs": "ЧаВо", "nav.contact": "Связаться",
    "nav.login": "Войти", "nav.signup": "Регистрация",
  },
  lv: {
    "nav.home": "Sākums", "nav.services": "Pakalpojumi", "nav.jobs": "Darbi",
    "nav.faqs": "BUJ", "nav.contact": "Sazinies",
    "nav.login": "Pieslēgties", "nav.signup": "Reģistrēties",
  },
  lt: {
    "nav.home": "Pradžia", "nav.services": "Paslaugos", "nav.jobs": "Darbai",
    "nav.faqs": "DUK", "nav.contact": "Kontaktai",
    "nav.login": "Prisijungti", "nav.signup": "Registruotis",
  },
};

type Ctx = { locale: Locale; setLocale: (l: Locale) => void; t: (k: string) => string };
const I18nContext = createContext<Ctx>({ locale: "en", setLocale: () => {}, t: (k) => k });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  useEffect(() => {
    const saved = (typeof window !== "undefined" && (localStorage.getItem("sb-locale") as Locale)) || "en";
    if (LOCALES.some((l) => l.code === saved)) setLocaleState(saved);
  }, []);
  const setLocale = (l: Locale) => {
    setLocaleState(l);
    if (typeof window !== "undefined") localStorage.setItem("sb-locale", l);
  };
  const t = (k: string) => dicts[locale]?.[k] ?? dicts.en[k] ?? k;
  return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
