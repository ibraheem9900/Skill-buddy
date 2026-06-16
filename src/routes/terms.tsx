import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms — SkillBuddy" }] }),
  component: () => (
    <SiteShell>
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 prose-invert">
        <h1 className="text-4xl font-extrabold">Terms & Conditions</h1>
        <p className="mt-4 text-sm text-muted-foreground">Last updated: June 16, 2026</p>
        <div className="mt-8 space-y-4 text-foreground/90 leading-relaxed">
          <p>Welcome to SkillBuddy. By using our services you agree to these Terms.</p>
          <h2 className="mt-6 text-xl font-bold">1. Using SkillBuddy</h2>
          <p>You must be at least 18 to create an account. You are responsible for the activity on your account.</p>
          <h2 className="mt-6 text-xl font-bold">2. Bookings & payments</h2>
          <p>All prices are estimates; the final price is set after the job is completed. Payments are processed securely via our payment partners.</p>
          <h2 className="mt-6 text-xl font-bold">3. Cancellations</h2>
          <p>Free cancellation up to 24 hours before a booking. Late cancellations may incur a fee.</p>
          <h2 className="mt-6 text-xl font-bold">4. Limitation of liability</h2>
          <p>SkillBuddy is a marketplace; pros are independent contractors. Our liability is limited to the amount paid for the booking.</p>
        </div>
      </article>
    </SiteShell>
  ),
});
