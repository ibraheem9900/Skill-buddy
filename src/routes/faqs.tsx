import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type Group = { title: string; faqs: { q: string; a: string }[] };

const GROUPS: Group[] = [
  {
    title: "General",
    faqs: [
      { q: "What is SkillBuddy?", a: "SkillBuddy is a digital platform that connects clients with verified service providers (SkillBuddy Pilots) for a wide range of services such as home care, personal services, and professional tasks. It allows users to post jobs, receive bids, and hire trusted professionals easily." },
      { q: "How does SkillBuddy work?", a: "Clients create a job request, providers bid on it, and the client selects the best offer. Payment is made securely in advance, and the provider completes the task. After completion, both parties can rate each other." },
      { q: "Is SkillBuddy available in my area?", a: "SkillBuddy is currently expanding city by city. You can check availability in your area directly in the app or during signup." },
      { q: "Is SkillBuddy safe to use?", a: "Yes. All users go through verification, including identity and document checks. Payments are secure, and disputes are handled by the support team." },
    ],
  },
  {
    title: "Client Side",
    faqs: [
      { q: "How do I book a service?", a: "Select a service → create a request → choose urgent or regular → receive bids → select a provider → make payment → service starts." },
      { q: "What is urgent vs regular request?", a: "Urgent = service within 12 hours (fast bidding). Regular = service within 72 hours (more options, relaxed bidding)." },
      { q: "Can I cancel a job?", a: "Yes, you can cancel any time before or after assigning a provider." },
      { q: "Is there a cancellation fee?", a: "Yes. A minimum €5 fee may apply depending on when you cancel." },
      { q: "How do I pay for services?", a: "You can pay via card, Apple Pay, Google Pay, bank transfer, or credit points." },
      { q: "Can I pay later or in installments?", a: "Yes, if you meet eligibility criteria (e.g., 20+ completed jobs)." },
      { q: "What are credit points?", a: "Reward points earned from spending. 1 Euro = 0.1 credit points." },
      { q: "How do I use credit points?", a: "You can use them as partial or full payment during checkout." },
      { q: "What if the provider does not show up?", a: "You can report it, and the system may reassign or compensate you." },
      { q: "What if I am not satisfied with the service?", a: "You can request revision, deny completion, or raise a dispute." },
      { q: "Can I request changes after completion?", a: "Yes, through the revision request system before final approval." },
    ],
  },
  {
    title: "Provider Side",
    faqs: [
      { q: "How do I become a SkillBuddy provider?", a: "Sign up → submit documents → get verified → start bidding on jobs." },
      { q: "Why is my account not approved?", a: "Possible reasons: incomplete documents, failed verification, or low-quality submission." },
      { q: "How do I get more jobs?", a: "Maintain high ratings, respond fast, bid competitively, and complete jobs successfully." },
      { q: "How does bidding work?", a: "Providers submit offers (price + time), and clients choose the best one." },
      { q: "Can I modify my bid?", a: "Yes, before the client accepts it." },
      { q: "When do I receive payments?", a: "After job completion and approval, payouts are processed weekly." },
      { q: "What happens if I cancel a job?", a: "Your rating and credibility score decrease, and penalties may apply." },
      { q: "How is my rating calculated?", a: "Based on client reviews, job completion, and performance." },
      { q: "What is credibility score?", a: "A performance score based on reliability, cancellations, and job success." },
    ],
  },
  {
    title: "Payments & Support",
    faqs: [
      { q: "What happens if payment fails?", a: "The job is not assigned. You must retry payment." },
      { q: "How do refunds work?", a: "Refunds are processed based on cancellation or dispute outcomes." },
      { q: "How do I contact support?", a: "Through in-app chat or ticket system." },
      { q: "How long does it take to resolve an issue?", a: "Typically 24–72 hours depending on complexity." },
      { q: "Can I track my complaint?", a: "Yes, via ticket ID in the ticketing system." },
      { q: "What happens during a dispute?", a: "The support team reviews evidence, chat history, and job details before resolving." },
    ],
  },
];

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
  const [query, setQuery] = useState("");
  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return GROUPS;
    return GROUPS
      .map((g) => ({ ...g, faqs: g.faqs.filter((f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)) }))
      .filter((g) => g.faqs.length > 0);
  }, [query]);

  return (
    <SiteShell>
      <div className="border-b border-border bg-surface/30">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6">
          <h1 className="font-display text-4xl font-extrabold sm:text-5xl">Frequently Asked Questions</h1>
          <p className="mt-3 text-muted-foreground">Everything about booking, bidding, payments, and support.</p>
          <div className="relative mx-auto mt-6 max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions..."
              className="h-12 pl-10"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl space-y-10 px-4 py-12 sm:px-6">
        {groups.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
            No questions match "{query}".
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
