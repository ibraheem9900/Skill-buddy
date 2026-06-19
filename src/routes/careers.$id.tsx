import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, MapPin, Clock, Briefcase, Share2, Linkedin,
  Copy, Check, CheckCircle2, X, Upload, ChevronRight,
} from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

      {/* Apply Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-background shadow-2xl"
            >
              <ApplyForm job={job} onClose={() => setModalOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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

function ApplyForm({ job, onClose }: { job: ReturnType<typeof getJob>; onClose: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", linkedin: "", cover: "" });
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.cover.trim()) e.cover = "Cover letter is required";
    if (!file) e.file = "CV/Resume is required";
    else if (file.size > 5 * 1024 * 1024) e.file = "File must be under 5MB";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setSubmitted(true); }, 1400);
  };

  const set = (k: string, v: string) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => { const n = { ...e }; delete n[k]; return n; }); };

  if (submitted) {
    return (
      <div className="flex flex-col items-center py-16 px-8 text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="mb-6 grid h-20 w-20 place-items-center rounded-full bg-primary/10"
        >
          <motion.div
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </motion.div>
        </motion.div>
        <h2 className="font-display text-2xl font-extrabold">Application Received!</h2>
        <p className="mx-auto mt-3 max-w-sm text-muted-foreground">
          Thank you for applying for <span className="font-semibold text-foreground">{job?.title}</span>. We'll be in touch within 5 business days.
        </p>
        <Button onClick={onClose} className="mt-8">Done</Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <div className="text-xs text-muted-foreground">Apply for</div>
          <h2 className="font-display text-lg font-extrabold">{job?.title}</h2>
        </div>
        <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full hover:bg-accent">
          <X className="h-4 w-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto px-6 py-5">
        <div className="space-y-4">
          <Field label="Full Name" required error={errors.name}>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Jane Smith" className={errors.name ? "border-destructive" : ""} />
          </Field>
          <Field label="Email Address" required error={errors.email}>
            <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="jane@example.com" className={errors.email ? "border-destructive" : ""} />
          </Field>
          <Field label="Phone Number" error={errors.phone}>
            <Input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+372 5123 4567" />
          </Field>
          <Field label="LinkedIn Profile URL" error={errors.linkedin}>
            <Input value={form.linkedin} onChange={(e) => set("linkedin", e.target.value)} placeholder="https://linkedin.com/in/yourname" />
          </Field>
          <Field label="Cover Letter" required error={errors.cover}>
            <Textarea
              value={form.cover}
              onChange={(e) => set("cover", e.target.value)}
              placeholder="Tell us why you'd be a great fit for this role..."
              rows={5}
              className={errors.cover ? "border-destructive" : ""}
            />
          </Field>
          <Field label="Upload CV/Resume (PDF/DOC, max 5MB)" required error={errors.file}>
            <label className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed p-4 transition hover:border-primary hover:bg-primary/5 ${errors.file ? "border-destructive" : "border-border"}`}>
              <Upload className="h-5 w-5 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                {file ? (
                  <span className="text-sm font-medium text-foreground truncate block">{file.name}</span>
                ) : (
                  <span className="text-sm text-muted-foreground">Choose file or drag and drop</span>
                )}
              </div>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) { setFile(f); setErrors((er) => { const n = { ...er }; delete n.file; return n; }); }
                }}
              />
            </label>
          </Field>
        </div>

        <div className="mt-6 flex gap-3 border-t border-border pt-5">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" disabled={submitting} className="flex-1 gap-2">
            {submitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent"
                />
                Submitting...
              </>
            ) : (
              <>Submit Application <ChevronRight className="h-4 w-4" /></>
            )}
          </Button>
        </div>
      </form>
    </>
  );
}

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
