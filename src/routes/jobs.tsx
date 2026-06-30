import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Users, ArrowRight } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JOBS, type Job } from "@/lib/jobs";
import { QRDownloadModal } from "@/components/qr-download-modal";
import { useI18n } from "@/lib/i18n";

// Maps English category label → i18n key
const CAT_KEY: Record<string, string> = {
  "Cleaning": "jobs.cat.cleaning",
  "Plumbing": "jobs.cat.plumbing",
  "Shifting & Moving": "jobs.cat.shifting",
  "Painting": "jobs.cat.painting",
  "AC Repair": "jobs.cat.ac-repair",
  "Makeup Artist": "jobs.cat.makeup",
  "Home Tutor": "jobs.cat.tutor",
  "Pet Care": "jobs.cat.pet-care",
  "Phone Repair": "jobs.cat.phone-repair",
  "Photography": "jobs.cat.photography",
  "Electrician": "jobs.cat.electrician",
  "Locksmith": "jobs.cat.locksmith",
};

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
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  return (
    <SiteShell>
      <div className="border-b border-border bg-surface/30">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <h1 className="font-display text-3xl font-extrabold sm:text-4xl">{t("jobs.title")}</h1>
          <p className="mt-2 text-muted-foreground">
            <span className="font-mono font-bold text-foreground">{JOBS.length}</span> {t("jobs.openJobs")}
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
        title={`📱 ${t("jobs.qr.title")}`}
        message={t("jobs.qr.message")}
      />
    </SiteShell>
  );
}

function JobCard({ job, index, onApply }: { job: Job; index: number; onApply: () => void }) {
  const { t } = useI18n();
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.3) }}
      className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-card transition hover:-translate-y-1 hover:shadow-elegant"
    >
      <div className="flex items-start justify-between gap-3">
        <Badge variant="secondary">{t(CAT_KEY[job.category] ?? job.category)}</Badge>
        <Badge
          className={
            job.urgency === "URGENT"
              ? "bg-destructive text-destructive-foreground"
              : "bg-primary/15 text-primary"
          }
        >
          {t(`jobs.urgency.${job.urgency.toLowerCase()}`)}
        </Badge>
      </div>
      <h3 className="mt-3 font-display text-lg font-bold leading-snug">{t(job.titleKey)}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{t(job.descKey)}</p>
      <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-primary" />{job.location}</div>
        <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-primary" />{t("jobs.posted")} {formatAgo(job.postedHoursAgo, t)}</div>
        <div className="flex items-center gap-2"><Users className="h-3.5 w-3.5 text-primary" />{job.bids} {job.bids === 1 ? t("jobs.bidSingular") : t("jobs.bids")} {t("jobs.bidsSoFar")}</div>
      </div>
      <div className="mt-4 flex items-end justify-between border-t border-border pt-4">
        <div>
          <div className="text-xs text-muted-foreground">{t("jobs.budget")}</div>
          <div className="font-mono text-lg font-bold text-primary">€{job.budgetMin}–€{job.budgetMax}</div>
        </div>
        <Button size="sm" onClick={onApply} className="gap-1">
          {t("jobs.apply")} <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </motion.div>
  );
}

function formatAgo(h: number, t: (k: string) => string) {
  if (h < 1) return t("jobs.justNow");
  if (h < 24) return `${h}${t("jobs.hoursAgo")}`;
  const d = Math.floor(h / 24);
  return `${d}${t("jobs.daysAgo")}`;
}
