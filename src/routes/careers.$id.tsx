import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, MapPin, Clock, Briefcase, Linkedin,
  Copy, Check, CheckCircle2, ChevronRight, Upload, X, Loader2,
} from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
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

type FormState = {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  coverLetter: string;
  cv: File | null;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

function ApplicationModal({
  open,
  onOpenChange,
  jobTitle,
  department,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  jobTitle: string;
  department: string;
}) {
  const [form, setForm] = useState<FormState>({
    name: "", email: "", phone: "", linkedin: "", coverLetter: "", cv: null,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.name.trim()) errs.name = "Full name is required.";
    if (!form.email.trim()) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Please enter a valid email address.";
    if (!form.coverLetter.trim()) errs.coverLetter = "Cover letter is required.";
    if (!form.cv) errs.cv = "Please attach your CV/Resume.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, cv: "File size must be under 5 MB." }));
      return;
    }
    setErrors((prev) => ({ ...prev, cv: undefined }));
    setForm((f) => ({ ...f, cv: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    await new Promise((r) => setTimeout(r, 1800));

    try {
      const body = [
        `New application received for: ${jobTitle}`,
        `Department: ${department}`,
        ``,
        `Applicant Details:`,
        `──────────────────`,
        `Name: ${form.name}`,
        `Email: ${form.email}`,
        `Phone: ${form.phone || "Not provided"}`,
        `LinkedIn: ${form.linkedin || "Not provided"}`,
        ``,
        `Cover Letter:`,
        `──────────────────`,
        form.coverLetter,
        ``,
        `CV/Resume: ${form.cv?.name ?? "Not attached"}`,
        ``,
        `Submitted at: ${new Date().toLocaleString()}`,
      ].join("\n");

      const mailto = `mailto:skillbuddyteam@gmail.com`
        + `?subject=${encodeURIComponent(`New Job Application — ${jobTitle}`)}`
        + `&body=${encodeURIComponent(body)}`;

      window.location.href = mailto;
      setSuccess(true);
    } catch {
      toast.error("Failed to send application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => { setSuccess(false); setForm({ name: "", email: "", phone: "", linkedin: "", coverLetter: "", cv: null }); setErrors({}); }, 300);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-border bg-card shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-3xl border-b border-border bg-card px-6 py-4">
              <div>
                <h2 className="font-display text-xl font-extrabold">Apply for this role</h2>
                <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{jobTitle}</p>
              </div>
              <button onClick={handleClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              {success ? (
                <div className="flex flex-col items-center gap-4 py-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                    className="grid h-20 w-20 place-items-center rounded-full bg-primary/10"
                  >
                    <svg viewBox="0 0 52 52" className="h-12 w-12" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <motion.circle
                        cx="26" cy="26" r="25"
                        stroke="#2D7A5F" strokeWidth="2.5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                      <motion.path
                        d="M14 26l8 8 16-16"
                        stroke="#2D7A5F" strokeWidth="2.5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.4, ease: "easeOut", delay: 0.4 }}
                      />
                    </svg>
                  </motion.div>
                  <div>
                    <h3 className="font-display text-2xl font-extrabold text-primary">Application Received!</h3>
                    <p className="mt-2 text-muted-foreground">We'll be in touch within 5 business days.</p>
                  </div>
                  <Button onClick={handleClose} className="mt-2 w-full">Close</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="app-name">Full Name <span className="text-destructive">*</span></Label>
                    <Input
                      id="app-name" value={form.name} onChange={set("name")}
                      placeholder="Jane Cooper" className={`mt-1.5 h-11 ${errors.name ? "border-destructive" : ""}`}
                    />
                    {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
                  </div>

                  <div>
                    <Label htmlFor="app-email">Email Address <span className="text-destructive">*</span></Label>
                    <Input
                      id="app-email" type="email" value={form.email} onChange={set("email")}
                      placeholder="you@email.com" className={`mt-1.5 h-11 ${errors.email ? "border-destructive" : ""}`}
                    />
                    {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
                  </div>

                  <div>
                    <Label htmlFor="app-phone">Phone Number <span className="text-xs text-muted-foreground">(optional)</span></Label>
                    <Input
                      id="app-phone" type="tel" value={form.phone} onChange={set("phone")}
                      placeholder="+372 5555 5555" className="mt-1.5 h-11"
                    />
                  </div>

                  <div>
                    <Label htmlFor="app-linkedin">LinkedIn Profile URL <span className="text-xs text-muted-foreground">(optional)</span></Label>
                    <Input
                      id="app-linkedin" type="url" value={form.linkedin} onChange={set("linkedin")}
                      placeholder="https://linkedin.com/in/yourname" className="mt-1.5 h-11"
                    />
                  </div>

                  <div>
                    <Label htmlFor="app-cover">Cover Letter <span className="text-destructive">*</span></Label>
                    <textarea
                      id="app-cover" value={form.coverLetter}
                      onChange={(e) => setForm((f) => ({ ...f, coverLetter: e.target.value }))}
                      rows={5} placeholder="Tell us why you're a great fit for this role..."
                      className={`mt-1.5 w-full rounded-md border bg-background px-3 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none ${errors.coverLetter ? "border-destructive" : "border-input"}`}
                    />
                    {errors.coverLetter && <p className="mt-1 text-xs text-destructive">{errors.coverLetter}</p>}
                  </div>

                  <div>
                    <Label>CV / Resume <span className="text-destructive">*</span></Label>
                    <p className="mb-1.5 mt-0.5 text-xs text-muted-foreground">PDF or DOC, max 5 MB</p>
                    <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" onChange={handleFile} className="hidden" />
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className={`flex w-full items-center justify-center gap-2 rounded-md border-2 border-dashed px-4 py-3 text-sm transition hover:bg-accent ${errors.cv ? "border-destructive" : "border-border"}`}
                    >
                      <Upload className="h-4 w-4" />
                      {form.cv ? form.cv.name : "Choose File"}
                    </button>
                    {errors.cv && <p className="mt-1 text-xs text-destructive">{errors.cv}</p>}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={handleClose} className="flex-1 h-11">Cancel</Button>
                    <Button type="submit" disabled={submitting} className="flex-1 h-11 gap-2 shadow-elegant">
                      {submitting ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</>
                      ) : (
                        <>Submit Application <ChevronRight className="h-4 w-4" /></>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

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

      <ApplicationModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        jobTitle={job.title}
        department={job.department}
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
