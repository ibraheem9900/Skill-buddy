import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, Tag, Star, CreditCard } from "lucide-react";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications — SkillBuddy" }] }),
  component: Notifications,
});

const groups = [
  {
    label: "Today", badge: "3 NEW", items: [
      { icon: Calendar, color: "text-primary", title: "Service booked successfully", desc: "Deep Home Cleaning on Jun 22 at 10:00 AM", time: "2h ago" },
      { icon: Tag, color: "text-emerald-500", title: "40% off your next booking", desc: "Limited-time offer — applies to any service", time: "5h ago" },
      { icon: Star, color: "text-warning", title: "How was your last service?", desc: "Leave a review for Marcus Lee", time: "9h ago" },
    ],
  },
  {
    label: "Yesterday", badge: "1 NEW", items: [
      { icon: CreditCard, color: "text-sky-500", title: "Payment method added", desc: "Visa ending in 4242", time: "1d ago" },
    ],
  },
  {
    label: "Earlier", badge: "", items: [
      { icon: Calendar, color: "text-primary", title: "Service confirmed", desc: "Tailor appointment on Jun 15", time: "5d ago" },
      { icon: Bell, color: "text-muted-foreground", title: "Welcome to SkillBuddy!", desc: "Browse 55+ services to get started", time: "2 weeks ago" },
    ],
  },
];

function Notifications() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-extrabold">Notifications</h1>
        <div className="mt-6 space-y-8">
          {groups.map((g) => (
            <section key={g.label}>
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{g.label}</h2>
                  {g.badge && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">{g.badge}</span>}
                </div>
                <Button variant="ghost" size="sm" className="text-xs">Mark all as read</Button>
              </div>
              <div className="space-y-2">
                {g.items.map((i, idx) => (
                  <div key={idx} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
                    <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-muted ${i.color}`}>
                      <i.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{i.title}</div>
                      <div className="text-sm text-muted-foreground">{i.desc}</div>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">{i.time}</span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
