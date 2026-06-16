import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy — SkillBuddy" }] }),
  component: () => (
    <SiteShell>
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-4xl font-extrabold">Privacy Policy</h1>
        <p className="mt-4 text-sm text-muted-foreground">Last updated: June 16, 2026</p>
        <div className="mt-8 space-y-4 text-foreground/90 leading-relaxed">
          <p>Your privacy matters. This policy explains what we collect and how we use it.</p>
          <h2 className="mt-6 text-xl font-bold">What we collect</h2>
          <p>Account info (name, email), booking history, device info, and location when you grant permission.</p>
          <h2 className="mt-6 text-xl font-bold">How we use it</h2>
          <p>To match you with pros, process payments, prevent fraud, and improve the service.</p>
          <h2 className="mt-6 text-xl font-bold">Your choices</h2>
          <p>You can update, export, or delete your data at any time from your account settings.</p>
        </div>
      </article>
    </SiteShell>
  ),
});
