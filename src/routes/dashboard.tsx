import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SERVICES } from "@/lib/data";
import { Bell, CreditCard, Heart, Settings, MapPin, Calendar } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — SkillBuddy" }, { name: "description", content: "Manage your bookings, favorites, and account." }] }),
  component: Dashboard,
});

const bookings = SERVICES.slice(0, 3).map((s, i) => ({
  id: i,
  service: s,
  date: ["Jun 22, 10:00 AM", "Jun 28, 2:30 PM", "Jul 04, 9:00 AM"][i],
  status: ["UPCOMING", "CONFIRMED", "COMPLETED"][i] as "UPCOMING" | "CONFIRMED" | "COMPLETED",
}));

function Dashboard() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border bg-card p-5 text-center">
              <img src="https://i.pravatar.cc/200?img=5" alt="" className="mx-auto h-20 w-20 rounded-full" />
              <h2 className="mt-3 font-bold">Jane Cooper</h2>
              <div className="mt-1 flex items-center justify-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />Brooklyn, NY</div>
              <Button variant="outline" size="sm" className="mt-4 w-full">Edit profile</Button>
            </div>
            <nav className="rounded-2xl border border-border bg-card p-2">
              {[
                { icon: Calendar, label: "My Bookings" },
                { icon: Heart, label: "Saved Services" },
                { icon: Bell, label: "Notifications", badge: "3" },
                { icon: CreditCard, label: "Payment Methods" },
                { icon: Settings, label: "Settings" },
              ].map((i) => (
                <button key={i.label} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 transition hover:bg-accent hover:text-foreground">
                  <i.icon className="h-4 w-4" />{i.label}
                  {i.badge && <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">{i.badge}</span>}
                </button>
              ))}
            </nav>
          </aside>

          <div>
            <div className="mb-6 flex items-end justify-between">
              <div>
                <h1 className="text-3xl font-extrabold">Welcome back, Jane 👋</h1>
                <p className="mt-1 text-sm text-muted-foreground">Here's what's coming up.</p>
              </div>
              <Button asChild><Link to="/services">Book new service</Link></Button>
            </div>

            <Tabs defaultValue="upcoming">
              <TabsList>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              {(["upcoming", "ongoing", "completed"] as const).map((tab) => (
                <TabsContent key={tab} value={tab} className="mt-5 space-y-3">
                  {bookings.map((b) => (
                    <div key={b.id} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center">
                      <img src={b.service.image} alt="" className="h-24 w-full rounded-xl object-cover sm:w-32" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={b.status === "COMPLETED" ? "secondary" : "default"}>{b.status}</Badge>
                          <span className="text-xs text-muted-foreground">{b.service.category}</span>
                        </div>
                        <h3 className="mt-1 font-semibold">{b.service.title}</h3>
                        <div className="mt-1 text-xs text-muted-foreground">{b.date} · {b.service.provider.name}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Details</Button>
                        <Button size="sm" asChild><Link to="/chat">Message</Link></Button>
                      </div>
                    </div>
                  ))}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
