import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, MapPin, Clock, Briefcase, Linkedin,
  Copy, Check, CheckCircle2, ChevronRight,
} from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { QRDownloadModal } from "@/components/qr-download-modal";
import {
  JOBS, WHAT_WE_OFFER, DEPT_COLORS, JOB_TYPE_COLORS,
  getJob,
} from "@/lib/careers-data";

export const Route = createFileRoute("/careers/$id")({
  head: ({ params }) => {
    const job = getJob(params.id);
    return {
      meta: [
        { title: `${job?.title ?? "Job"} — Careers at SkillBuddy` },
        { name: "description", content: job?.shortDescription ?? "" },
      ],
    };
  },
  component: JobDetailPage,
});

function JobDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const job = getJob(id);
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!job) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-2xl px-4 py-24 text-center">
          <h1 className="text-2xl font-bold">Position not found</h1>
          <Button asChild className="mt-6"><Link to="/careers">Back to Careers</Link></Button>
        </div>
      </SiteShell>
    );
  }

  const similar = JOBS.filter((j) => j.department === job.department && j.id !== job.id).slice(0, 3);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate({ to: "/careers" })}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Careers
        </button>

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* LEFT — Main content */}
          <div>
            {/* Header */}
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${DEPT_COLORS[job.department]}`}>
                  {job.department}
                </span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${JOB_TYPE_COLORS[job.jobType]}`}>
                  {job.jobType}
                </span>
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-4 font-display text-2xl font-extrabold sm:text-3xl"
              >
                {job.title}
              </motion.h1>

              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4 shrink-0" />{job.department}</span>
                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 shrink-0" />{job.locations.join(" / ")}</span>
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 shrink-0" />{job.jobType} · {job.level}</span>
              </div>

              <p className="mt-2 text-xs text-muted-foreground">
                Posted {job.postedDaysAgo === 0 ? "today" : job.postedDaysAgo === 1 ? "yesterday" : `${job.postedDaysAgo} days ago`}
              </p>

              {/* Mobile Apply + Share */}
              <div className="mt-5 flex flex-wrap gap-2 lg:hidden">
                <Button onClick={() => setModalOpen(true)} className="flex-1 gap-2 shadow-elegant">
                  Apply Now <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={copyLink}>
                  {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Salary highlight */}
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-5 py-3">
              <span className="text-2xl">💰</span>
              <div>
                <div className="text-xs text-muted-foreground">Monthly Salary</div>
                <div className="font-mono text-lg font-bold text-primary">
                  €{job.salaryMin.toLocaleString()} – €{job.salaryMax.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Body sections */}
            <div className="mt-8 space-y-8">
              <Section title="About This Role">
                <p className="leading-relaxed text-foreground/90">{job.longDescription}</p>
              </Section>

              <Section title="What You'll Do">
                <ul className="space-y-2">
                  {job.whatYoullDo.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/90">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Section>

              <Section title="Requirements">
                <ul className="space-y-2">
                  {job.requirements.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/90">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Section>

              {job.niceToHave.length > 0 && (
                <Section title="Nice to Have">
                  <ul className="space-y-2">
                    {job.niceToHave.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              <Section title="What We Offer">
                <ul className="grid gap-2 sm:grid-cols-2">
                  {WHAT_WE_OFFER.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/90">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Section>

              <Section title="Skills Required">
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((s) => (
                    <span key={s} className="rounded-full bg-[#DCFCE7] px-3 py-1 text-sm font-medium text-[#166534] dark:bg-emerald-900/40 dark:text-emerald-300">
                      {s}
                    </span>
                  ))}
                </div>
              </Section>

              {/* Mobile similar roles */}
              {similar.length > 0 && (
                <div className="lg:hidden">
                  <h3 className="mb-4 font-display text-lg font-bold">Similar Roles</h3>
                  <div className="space-y-3">
                    {similar.map((j) => (
                      <Link
                        key={j.id}
                        to="/careers/$id"
                        params={{ id: j.id }}
                        className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition hover:border-primary/40 hover:bg-accent"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm line-clamp-1">{j.title}</div>
                          <div className="text-xs text-muted-foreground">{j.locations.join(" / ")} · {j.jobType}</div>
                          <div className="font-mono text-xs text-primary mt-0.5">€{j.salaryMin.toLocaleString()} – €{j.salaryMax.toLocaleString()}</div>
                        </div>
                        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT — Sticky sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              {/* Quick apply box */}
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💰</span>
                    <div>
                      <div className="text-xs text-muted-foreground">Monthly Salary</div>
                      <div className="font-mono font-bold text-primary">€{job.salaryMin.toLocaleString()} – €{job.salaryMax.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{job.locations.join(" / ")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{job.jobType} · {job.level}</span>
                  </div>
                </div>

                <Button
                  onClick={() => setModalOpen(true)}
                  className="mt-4 w-full gap-2 shadow-elegant"
                  size="lg"
                >
                  Apply Now <ChevronRight className="h-4 w-4" />
                </Button>

                {/* Share */}
                <div className="mt-4 border-t border-border pt-4">
                  <div className="mb-2 text-xs font-semibold text-muted-foreground">Share this role</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, "_blank")}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-accent"
                    >
                      <Linkedin className="h-3.5 w-3.5" /> LinkedIn
                    </button>
                    <button
                      onClick={copyLink}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-accent"
                    >
                      {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied ? "Copied!" : "Copy Link"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Similar roles */}
              {similar.length > 0 && (
                <div className="rounded-2xl border border-border bg-card p-4">
                  <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-muted-foreground">Similar Roles</h3>
                  <div className="space-y-2">
                    {similar.map((j) => (
                      <Link
                        key={j.id}
                        to="/careers/$id"
                        params={{ id: j.id }}
                        className="flex items-start gap-2 rounded-xl p-2 transition hover:bg-accent"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="line-clamp-1 text-sm font-semibold">{j.title}</div>
                          <div className="text-xs text-muted-foreground">{j.locations[0]}</div>
                          <div className="font-mono text-xs text-primary">€{j.salaryMin.toLocaleString()} – €{j.salaryMax.toLocaleString()}</div>
                        </div>
                        <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Mobile sticky apply bar */}
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.6, duration: 0.4, type: "spring", stiffness: 200 }}
          className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 px-4 py-3 backdrop-blur lg:hidden"
        >
          <Button onClick={() => setModalOpen(true)} className="w-full gap-2 shadow-elegant">
            Apply Now — {job.title} <ChevronRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>

      <QRDownloadModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title="Apply via the SkillBuddy App"
        message="To apply for this position, please download the SkillBuddy app."
      />
    </SiteShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-4 font-display text-lg font-bold">{title}</h2>
      {children}
    </div>
  );
}
