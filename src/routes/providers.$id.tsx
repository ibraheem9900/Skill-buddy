import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { SERVICES } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Star, MapPin, BadgeCheck, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/providers/$id")({
  head: ({ params }) => ({
    meta: [{ title: `Provider — SkillBuddy` }, { name: "description", content: `Provider profile ${params.id}` }],
  }),
  component: ProviderPage,
});

function ProviderPage() {
  const { id } = Route.useParams();
  const services = SERVICES.filter((s) => s.provider.id === id);
  const provider = services[0]?.provider ?? SERVICES[0].provider;
  const rating = services.length ? services.reduce((s, x) => s + x.rating, 0) / services.length : 4.7;
  const reviewCount = services.reduce((s, x) => s + x.reviewCount, 0);

  return (
    <SiteShell>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-card sm:p-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <div className="relative">
              <img src={provider.avatar} alt={provider.name} className="h-28 w-28 rounded-2xl object-cover" />
              {provider.verified && <span className="absolute -bottom-2 -right-2 grid h-9 w-9 place-items-center rounded-full border-4 border-card bg-primary text-primary-foreground"><BadgeCheck className="h-5 w-5" /></span>}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-extrabold">{provider.name}</h1>
              <p className="mt-1 text-muted-foreground">{services[0]?.category} Specialist</p>
              <div className="mt-2 flex items-center justify-center gap-2 text-sm text-muted-foreground sm:justify-start"><MapPin className="h-4 w-4" />{provider.location}</div>
              <p className="mt-3 max-w-xl text-sm text-foreground/90">{provider.bio}</p>
            </div>
            <div className="flex gap-2 sm:flex-col">
              <Button asChild><Link to="/chat">Message</Link></Button>
              <Button variant="outline"><MessageCircle className="mr-1 h-4 w-4" />Quote</Button>
            </div>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-[220px_1fr]">
            <div className="rounded-2xl bg-surface p-5 text-center">
              <div className="font-display text-5xl font-extrabold">{rating.toFixed(1)}</div>
              <div className="mt-1 flex justify-center text-warning">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-4 w-4 ${i < Math.round(rating) ? "fill-current" : ""}`} />)}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{reviewCount} reviews</div>
            </div>
            <div className="space-y-2">
              {[{ l: "Excellent", v: 82 }, { l: "Good", v: 12 }, { l: "Average", v: 4 }, { l: "Poor", v: 2 }].map((b) => (
                <div key={b.l} className="flex items-center gap-3 text-xs">
                  <span className="w-20 text-muted-foreground">{b.l}</span>
                  <Progress value={b.v} className="h-2 flex-1" />
                  <span className="w-10 text-right font-medium">{b.v}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {services.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-5 text-2xl font-extrabold">Services offered</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {services.map((s) => (
                <Link key={s.id} to="/services/$id" params={{ id: s.slug }} className="flex gap-4 rounded-2xl border border-border bg-card p-4 transition hover:border-primary">
                  <img src={s.image} alt="" className="h-24 w-24 shrink-0 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-1 font-semibold">{s.title}</h3>
                    <div className="mt-1 flex items-center gap-1 text-xs"><Star className="h-3 w-3 fill-warning text-warning" />{s.rating} <span className="text-muted-foreground">({s.reviewCount})</span></div>
                    <div className="mt-2 font-mono font-bold">${s.price}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <Button className="mt-8 w-full sm:w-auto">Write a review</Button>
      </div>
    </SiteShell>
  );
}
