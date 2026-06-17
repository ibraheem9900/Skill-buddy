import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Mail, Clock, MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { SiteShell } from "@/components/site-shell";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — SkillBuddy" },
      { name: "description", content: "Get in touch with the SkillBuddy team. We respond within 24–72 hours." },
      { property: "og:title", content: "Contact SkillBuddy" },
      { property: "og:description", content: "Questions, partnerships, support — talk to us." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  subject: z.string().trim().min(2, "Subject is required").max(120),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
});

function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => { errs[i.path[0] as string] = i.message; });
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    toast.success("✅ Thank you! We'll get back to you within 24–72 hours.");
    e.currentTarget.reset();
  }

  return (
    <SiteShell>
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1.1fr_1fr]">
        <form onSubmit={onSubmit} className="rounded-3xl border border-border bg-card p-7 shadow-card">
          <h1 className="font-display text-3xl font-extrabold">Talk to us</h1>
          <p className="mt-1 text-sm text-muted-foreground">We read every message and respond within 24–72 hours.</p>

          <div className="mt-6 space-y-4">
            <Field name="email" label="Email Address" required>
              <Input name="email" type="email" placeholder="you@email.com" className="mt-1.5 h-11" />
            </Field>
            <Field name="subject" label="Subject" required>
              <Input name="subject" placeholder="What's this about?" className="mt-1.5 h-11" />
            </Field>
            <Field name="message" label="Message" required>
              <Textarea name="message" rows={5} placeholder="Tell us more..." className="mt-1.5" />
            </Field>
            <Field
              name="phone"
              label="Phone Number"
              helper="Optional — we'll use this to notify you of our response."
            >
              <Input name="phone" type="tel" placeholder="+372 ..." className="mt-1.5 h-11" />
            </Field>

            {Object.values(errors).map((m, i) => (
              <p key={i} className="text-xs text-destructive">{m}</p>
            ))}

            <Button type="submit" disabled={loading} className="h-11 w-full shadow-elegant">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Message
            </Button>
          </div>
        </form>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-xl font-bold">Company info</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span>Tornimäe 5, 10145 Tallinn, Estonia</span></div>
              <div className="flex items-start gap-3"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><a href="mailto:support@skillbuddy.app" className="hover:underline">support@skillbuddy.app</a></div>
              <div className="flex items-start gap-3"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span>Support hours: Mon–Sun · 9:00–21:00 EET</span></div>
            </div>
          </div>
          <div className="aspect-video overflow-hidden rounded-3xl border border-border bg-muted">
            <iframe
              title="SkillBuddy office map"
              className="h-full w-full"
              src="https://www.openstreetmap.org/export/embed.html?bbox=24.74,59.43,24.78,59.45&layer=mapnik"
            />
          </div>
        </aside>
      </div>
    </SiteShell>
  );
}

function Field({ name, label, required, helper, children }: { name: string; label: string; required?: boolean; helper?: string; children: React.ReactNode }) {
  return (
    <div>
      <Label htmlFor={name}>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {helper && <p className="mt-1 text-xs text-muted-foreground">{helper}</p>}
    </div>
  );
}
