import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "How do I book a service?", a: "Search or browse services, choose a pro, pick a time, and book. You'll get confirmation in seconds." },
  { q: "Are pros background-checked?", a: "Yes — every pro completes an identity check and background screening before joining the platform." },
  { q: "What if I'm not satisfied?", a: "Our Happiness Guarantee covers eligible bookings. Contact support and we'll make it right." },
  { q: "Can I reschedule?", a: "You can reschedule for free up to 24 hours before your appointment." },
  { q: "How do payments work?", a: "Pay securely in-app. Funds are released to your pro after the job is completed." },
  { q: "How do I become a pro?", a: "Visit the Become a Pro page and submit an application. Most pros are approved within a week." },
];

export const Route = createFileRoute("/faq")({
  head: () => ({ meta: [{ title: "FAQ — SkillBuddy" }, { name: "description", content: "Common questions about booking, payments, and providers." }] }),
  component: () => (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-4xl font-extrabold sm:text-5xl">Frequently asked questions</h1>
        <p className="mt-3 text-muted-foreground">Answers to the most common things people ask us.</p>
        <Accordion type="single" collapsible className="mt-8 rounded-2xl border border-border bg-card px-4">
          {faqs.map((f) => (
            <AccordionItem key={f.q} value={f.q}>
              <AccordionTrigger className="text-left font-semibold">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </SiteShell>
  ),
});
