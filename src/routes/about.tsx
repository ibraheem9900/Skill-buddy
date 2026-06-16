import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About — SkillBuddy" }, { name: "description", content: "Our mission is to make expert help available to everyone, everywhere." }] }),
  component: () => (
    <SiteShell>
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-4xl font-extrabold sm:text-5xl">We make expert help available to everyone</h1>
        <p className="mt-6 text-lg text-muted-foreground">SkillBuddy connects you with a vetted, insured pro for almost anything — in minutes. We started in 2021 because hiring help shouldn't be the hardest part of getting things done.</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {[
            { k: "3.4M+", v: "Bookings completed" },
            { k: "50K+", v: "Pros on the platform" },
            { k: "200+", v: "Cities served" },
          ].map((s) => (
            <div key={s.k} className="rounded-2xl border border-border bg-card p-5">
              <div className="font-display text-3xl font-extrabold text-primary">{s.k}</div>
              <div className="text-sm text-muted-foreground">{s.v}</div>
            </div>
          ))}
        </div>
        <h2 className="mt-12 text-2xl font-extrabold">Our mission</h2>
        <p className="mt-3 text-muted-foreground">Help people get more out of life by removing the friction of finding skilled help — and give pros a flexible, dignified way to grow their business.</p>
        <h2 className="mt-10 text-2xl font-extrabold">What we believe</h2>
        <ul className="mt-3 list-inside list-disc space-y-2 text-muted-foreground">
          <li>Time is the most precious resource — protect your customers'.</li>
          <li>Trust is built one booking at a time.</li>
          <li>The best pros deserve the best tools and customers.</li>
        </ul>
      </article>
    </SiteShell>
  ),
});
