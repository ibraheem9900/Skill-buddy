import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact — SkillBuddy" }, { name: "description", content: "Get in touch with the SkillBuddy team." }] }),
  component: () => (
    <SiteShell>
      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2">
        <div>
          <h1 className="text-4xl font-extrabold sm:text-5xl">Talk to us</h1>
          <p className="mt-3 text-muted-foreground">Questions, feedback, partnerships — we read everything.</p>
          <div className="mt-8 space-y-3 text-sm">
            <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-primary" />hello@skillbuddy.com</div>
            <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-primary" />+1 (888) 555-0142</div>
            <div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-primary" />228 Park Ave S, New York, NY</div>
          </div>
          <div className="mt-8 aspect-video overflow-hidden rounded-2xl border border-border bg-muted">
            <iframe title="Map" className="h-full w-full grayscale" src="https://www.openstreetmap.org/export/embed.html?bbox=-74.01,40.7,-73.97,40.74&layer=mapnik" />
          </div>
        </div>
        <form className="rounded-3xl border border-border bg-card p-7 shadow-card" onSubmit={(e) => e.preventDefault()}>
          <h2 className="text-xl font-bold">Send a message</h2>
          <div className="mt-5 space-y-4">
            <div><Label>Name</Label><Input className="mt-1.5 h-11" /></div>
            <div><Label>Email</Label><Input type="email" className="mt-1.5 h-11" /></div>
            <div><Label>Message</Label><Textarea rows={5} className="mt-1.5" /></div>
            <Button className="h-11 w-full">Send</Button>
          </div>
        </form>
      </div>
    </SiteShell>
  ),
});
