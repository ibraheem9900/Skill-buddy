import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Users, ArrowRight } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JOBS, type Job } from "@/lib/jobs";
import { QRDownloadModal } from "@/components/qr-download-modal";

export const Route = createFileRoute("/jobs")({
  head: () => ({
    meta: [
      { title: "Available Jobs — SkillBuddy" },
      { name: "description", content: "Browse open job postings across cleaning, plumbing, repairs, beauty, and more. Apply through the SkillBuddy app." },
      { property: "og:title", content: "Available Jobs — SkillBuddy" },
      { property: "og:description", content: "Find open work in your area. Verified clients, fair budgets." },
    ],
  }),
  component: JobsPage,
});

function JobsPage() {
  const [open, setOpen] = useState(false);
  return (
    <SiteShell>
      <div className="border-b border-border bg-surface/30">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Available Jobs</h1>
          <p className="mt-2 text-muted-foreground">
            <span className="font-mono font-bold text-foreground">{JOBS.length}</span> open jobs across the Baltics.
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid auto-rows-fr grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {JOBS.map((j, i) => (
            <JobCard key={j.id} job={j} index={i} onApply={() => setOpen(true)} />
          ))}
        </div>
      </div>
      <QRDownloadModal
        open={open}
        onOpenChange={setOpen}
        title="📱 Apply via the SkillBuddy App"
        message="To apply for jobs and submit your bid, please download the SkillBuddy app."
      />
    </SiteShell>
  );
}

function JobCard({ job, index, onApply }: { job: Job; index: number; onApply: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.3) }}
      className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-card transition hover:-translate-y-1 hover:shadow-elegant"
    >
      <div className="flex items-start justify-between gap-3">
        <Badge variant="secondary">{job.category}</Badge>
        <Badge
          className={
            job.urgency === "URGENT"
              ? "bg-destructive text-destructive-foreground"
              : "bg-primary/15 text-primary"
          }
        >
          {job.urgency}
        </Badge>
      </div>
      <h3 className="mt-3 font-display text-lg font-bold leading-snug">{job.title}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{job.description}</p>
      <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-primary" />{job.location}</div>
        <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-primary" />Posted {formatAgo(job.postedHoursAgo)}</div>
        <div className="flex items-center gap-2"><Users className="h-3.5 w-3.5 text-primary" />{job.bids} bid{job.bids === 1 ? "" : "s"} so far</div>
      </div>
      <div className="mt-4 flex items-end justify-between border-t border-border pt-4">
        <div>
          <div className="text-xs text-muted-foreground">Budget</div>
          <div className="font-mono text-lg font-bold text-primary">€{job.budgetMin}–€{job.budgetMax}</div>
        </div>
        <Button size="sm" onClick={onApply} className="gap-1">
          Apply <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </motion.div>
  );
}

function formatAgo(h: number) {
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}
