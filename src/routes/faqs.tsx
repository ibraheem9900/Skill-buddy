import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/faqs")({
  head: () => ({
    meta: [
      { title: "FAQs — SkillBuddy" },
      { name: "description", content: "Answers about booking, bidding, payments, providers, and support on SkillBuddy." },
      { property: "og:title", content: "Frequently Asked Questions — SkillBuddy" },
      { property: "og:description", content: "Find answers about booking, bidding, payments, and support." },
    ],
  }),
  component: FaqsPage,
});

function FaqsPage() {
  const { t } = useI18n();
  const [query, setQuery] = useState("");

  const GROUPS = useMemo(() => [
    {
      title: t("faqs.general"),
      faqs: [
        { q: t("faq.g1.q"), a: t("faq.g1.a") },
        { q: t("faq.g2.q"), a: t("faq.g2.a") },
        { q: t("faq.g3.q"), a: t("faq.g3.a") },
        { q: t("faq.g4.q"), a: t("faq.g4.a") },
      ],
    },
    {
      title: t("faqs.client"),
      faqs: [
        { q: t("faq.c1.q"), a: t("faq.c1.a") },
        { q: t("faq.c2.q"), a: t("faq.c2.a") },
        { q: t("faq.c3.q"), a: t("faq.c3.a") },
        { q: t("faq.c4.q"), a: t("faq.c4.a") },
        { q: t("faq.c5.q"), a: t("faq.c5.a") },
        { q: t("faq.c6.q"), a: t("faq.c6.a") },
        { q: t("faq.c7.q"), a: t("faq.c7.a") },
        { q: t("faq.c8.q"), a: t("faq.c8.a") },
        { q: t("faq.c9.q"), a: t("faq.c9.a") },
        { q: t("faq.c10.q"), a: t("faq.c10.a") },
        { q: t("faq.c11.q"), a: t("faq.c11.a") },
      ],
    },
    {
      title: t("faqs.provider"),
      faqs: [
        { q: t("faq.p1.q"), a: t("faq.p1.a") },
        { q: t("faq.p2.q"), a: t("faq.p2.a") },
        { q: t("faq.p3.q"), a: t("faq.p3.a") },
        { q: t("faq.p4.q"), a: t("faq.p4.a") },
        { q: t("faq.p5.q"), a: t("faq.p5.a") },
        { q: t("faq.p6.q"), a: t("faq.p6.a") },
        { q: t("faq.p7.q"), a: t("faq.p7.a") },
        { q: t("faq.p8.q"), a: t("faq.p8.a") },
        { q: t("faq.p9.q"), a: t("faq.p9.a") },
      ],
    },
    {
      title: t("faqs.payments"),
      faqs: [
        { q: t("faq.pay1.q"), a: t("faq.pay1.a") },
        { q: t("faq.pay2.q"), a: t("faq.pay2.a") },
        { q: t("faq.pay3.q"), a: t("faq.pay3.a") },
        { q: t("faq.pay4.q"), a: t("faq.pay4.a") },
        { q: t("faq.pay5.q"), a: t("faq.pay5.a") },
        { q: t("faq.pay6.q"), a: t("faq.pay6.a") },
      ],
    },
  ], [t]);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return GROUPS;
    return GROUPS
      .map((g) => ({ ...g, faqs: g.faqs.filter((f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)) }))
      .filter((g) => g.faqs.length > 0);
  }, [query, GROUPS]);

  return (
    <SiteShell>
      <div className="border-b border-border bg-surface/30">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6">
          <h1 className="font-display text-4xl font-extrabold sm:text-5xl">{t("faqs.title")}</h1>
          <p className="mt-3 text-muted-foreground">{t("faqs.subtitle")}</p>
          <div className="relative mx-auto mt-6 max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("faqs.search")}
              className="h-12 pl-10"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl space-y-10 px-4 py-12 sm:px-6">
        {groups.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
            {t("faqs.noMatch")} "{query}".
          </div>
        ) : (
          groups.map((g) => (
            <section key={g.title}>
              <h2 className="mb-4 font-display text-2xl font-bold">{g.title}</h2>
              <Accordion type="single" collapsible className="rounded-2xl border border-border bg-card px-4">
                {g.faqs.map((f) => (
                  <AccordionItem key={f.q} value={f.q}>
                    <AccordionTrigger className="text-left font-semibold">{f.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          ))
        )}
      </div>
    </SiteShell>
  );
}
