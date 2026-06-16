import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, DollarSign, Shield, HeartHandshake, Briefcase, Sparkles } from "lucide-react";

export const Route = createFileRoute("/become-a-provider")({
  head: () => ({
    meta: [
      { title: "Become a Pro — SkillBuddy" },
      { name: "description", content: "Earn on your own schedule. Join 50,000+ pros growing their business on SkillBuddy." },
    ],
  }),
  component: BecomePro,
});

function BecomePro() {
  return (
    <SiteShell>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-90" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs font-medium backdrop-blur"><Sparkles className="h-3 w-3 text-primary" /> Now hiring in 200+ cities</span>
            <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.05] sm:text-6xl">Earn on your <span className="text-gradient">own schedule</span></h1>
            <p className="mt-5 max-w-md text-lg text-muted-foreground">Set your hours, set your rates, and let SkillBuddy bring you clients. Pros average $42/hr.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" className="shadow-elegant">Apply now</Button>
              <Button size="lg" variant="outline">See how it works</Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Calendar, l: "Flexible hours" },
              { icon: DollarSign, l: "Instant payouts" },
              { icon: Shield, l: "Free liability insurance" },
              { icon: HeartHandshake, l: "24/7 support" },
            ].map((f) => (
              <div key={f.l} className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <div className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary"><f.icon className="h-5 w-5" /></div>
                <div className="font-semibold">{f.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-3xl font-extrabold sm:text-4xl">Up and running in 3 steps</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { n: "01", title: "Create your profile", desc: "Tell us about your skills, experience, and availability." },
            { n: "02", title: "Set your services", desc: "Pick categories, set prices, and define your service area." },
            { n: "03", title: "Start earning", desc: "Get matched with clients and grow your reviews and ratings." },
          ].map((s) => (
            <div key={s.n} className="relative rounded-2xl border border-border bg-card p-6 shadow-card">
              <div className="text-4xl font-extrabold text-primary/50">{s.n}</div>
              <h3 className="mt-2 text-lg font-bold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 pb-20 sm:px-6">
        <div className="rounded-3xl border border-border bg-card p-7 shadow-elegant">
          <div className="mb-2 flex items-center gap-2 text-sm text-primary"><Briefcase className="h-4 w-4" /> Apply to join</div>
          <h3 className="text-2xl font-extrabold">Tell us about you</h3>
          <form className="mt-5 space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><Label>Full name</Label><Input className="mt-1.5 h-11" /></div>
              <div><Label>Phone</Label><Input className="mt-1.5 h-11" type="tel" /></div>
            </div>
            <div><Label>Email</Label><Input type="email" className="mt-1.5 h-11" /></div>
            <div><Label>Primary service</Label><Input className="mt-1.5 h-11" placeholder="e.g. Plumbing, Cleaning, Photography" /></div>
            <div><Label>Years of experience</Label><Input type="number" className="mt-1.5 h-11" /></div>
            <Button className="h-11 w-full shadow-elegant">Submit application</Button>
          </form>
        </div>
      </section>
    </SiteShell>
  );
}
