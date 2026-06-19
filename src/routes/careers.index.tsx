import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, X, SlidersHorizontal, MapPin, Briefcase, Clock,
  ChevronLeft, ChevronRight, ArrowRight, Globe, Users, Star,
} from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  JOBS, DEPARTMENTS, OFFICE_LOCATIONS, DEPT_COLORS, JOB_TYPE_COLORS,
  type Department, type OfficeLocation, type JobType, type ExperienceLevel,
} from "@/lib/careers-data";

export const Route = createFileRoute("/careers/")({
  head: () => ({
    meta: [
      { title: "Careers at SkillBuddy — Join Our Team" },
      { name: "description", content: "Join the SkillBuddy team. Browse 24 open positions across Technology, Design, Marketing, and more." },
    ],
  }),
  component: CareersPage,
});

const PER_PAGE = 12;

function useAnimatedCounter(target: number, duration = 1800, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setValue(Math.round(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return value;
}

function CareersPage() {
  const [query, setQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState<Department[]>([]);
  const [locFilter, setLocFilter] = useState<OfficeLocation[]>([]);
  const [typeFilter, setTypeFilter] = useState<JobType | "">("");
  const [levelFilter, setLevelFilter] = useState<ExperienceLevel[]>([]);
  const [sort, setSort] = useState<"newest" | "oldest" | "salary-high" | "salary-low">("newest");
  const [page, setPage] = useState(1);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true); }, { threshold: 0.3 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const c5 = useAnimatedCounter(5, 1400, statsVisible);
  const c50 = useAnimatedCounter(50, 1600, statsVisible);
  const c24 = useAnimatedCounter(24, 1200, statsVisible);
  const c48 = useAnimatedCounter(48, 1800, statsVisible);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const handleSearch = useCallback((v: string) => {
    setQuery(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedQuery(v), 300);
  }, []);

  const filtered = useMemo(() => {
    let r = JOBS.filter((j) => {
      if (deptFilter.length && !deptFilter.includes(j.department)) return false;
      if (locFilter.length && !j.locations.some((l) => locFilter.includes(l))) return false;
      if (typeFilter && j.jobType !== typeFilter) return false;
      if (levelFilter.length && !levelFilter.includes(j.level)) return false;
      if (debouncedQuery) {
        const q = debouncedQuery.toLowerCase();
        return j.title.toLowerCase().includes(q) || j.department.toLowerCase().includes(q) || j.shortDescription.toLowerCase().includes(q) || j.skills.some((s) => s.toLowerCase().includes(q));
      }
      return true;
    });
    if (sort === "newest") r = [...r].sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
    else if (sort === "oldest") r = [...r].sort((a, b) => b.postedDaysAgo - a.postedDaysAgo);
    else if (sort === "salary-high") r = [...r].sort((a, b) => b.salaryMax - a.salaryMax);
    else if (sort === "salary-low") r = [...r].sort((a, b) => a.salaryMin - b.salaryMin);
    return r;
  }, [deptFilter, locFilter, typeFilter, levelFilter, debouncedQuery, sort]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  useEffect(() => { setPage(1); }, [filtered.length]);

  const resetFilters = () => {
    setDeptFilter([]); setLocFilter([]); setTypeFilter(""); setLevelFilter([]);
    setQuery(""); setDebouncedQuery("");
  };

  const deptCounts = useMemo(() => {
    const counts: Partial<Record<Department, number>> = {};
    JOBS.forEach((j) => { counts[j.department] = (counts[j.department] ?? 0) + 1; });
    return counts;
  }, []);
  const locCounts = useMemo(() => {
    const counts: Partial<Record<OfficeLocation, number>> = {};
    JOBS.forEach((j) => j.locations.forEach((l) => { counts[l] = (counts[l] ?? 0) + 1; }));
    return counts;
  }, []);

  return (
    <SiteShell>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/80 to-[#1a4a38] py-20 text-primary-foreground sm:py-28">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -30, 0], x: [0, 15, 0], rotate: [0, 180, 360] }}
              transition={{ duration: 8 + i * 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.8 }}
              className="absolute rounded-full border border-white/10 bg-white/5"
              style={{
                width: 40 + i * 30, height: 40 + i * 30,
                left: `${10 + i * 12}%`, top: `${5 + (i % 4) * 22}%`,
              }}
            />
          ))}
        </div>
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur">
              <Briefcase className="h-3.5 w-3.5" /> We're hiring
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
              Join the SkillBuddy Team
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-primary-foreground/80 sm:text-lg">
              Help us connect the world with skilled professionals. Build something meaningful.
            </p>
          </motion.div>

          {/* Stats */}
          <div ref={statsRef} className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { icon: Globe, value: c5, label: "Countries", suffix: "" },
              { icon: Users, value: c50, label: "Team Members", suffix: "+" },
              { icon: Briefcase, value: c24, label: "Open Positions", suffix: "" },
              { icon: Star, value: `4.${c48 % 10}`, label: "Glassdoor Rating", suffix: "" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={statsVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur"
              >
                <s.icon className="mx-auto mb-2 h-5 w-5 text-primary-foreground/70" />
                <div className="font-mono text-3xl font-extrabold">
                  {s.value}{s.suffix}
                </div>
                <div className="mt-1 text-xs text-primary-foreground/70">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SEARCH BAR */}
      <div className="sticky top-16 z-20 border-b border-border bg-background/95 px-4 py-4 backdrop-blur sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="relative flex items-center">
            <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by job title, skill, or keyword..."
              className="h-12 rounded-xl pl-11 pr-10 text-sm"
            />
            {query && (
              <button onClick={() => handleSearch("")} className="absolute right-4 text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[280px_1fr]">
        {/* FILTER SIDEBAR — Desktop */}
        <aside className="hidden lg:block">
          <div className="sticky top-36 rounded-2xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-base font-bold">Filters</h2>
              <button onClick={resetFilters} className="text-xs text-muted-foreground hover:text-primary">Reset All</button>
            </div>
            <FilterContent
              deptFilter={deptFilter} setDeptFilter={setDeptFilter}
              locFilter={locFilter} setLocFilter={setLocFilter}
              typeFilter={typeFilter} setTypeFilter={setTypeFilter}
              levelFilter={levelFilter} setLevelFilter={setLevelFilter}
              deptCounts={deptCounts} locCounts={locCounts}
              onReset={resetFilters}
            />
          </div>
        </aside>

        {/* JOB LISTINGS */}
        <div>
          {/* Results header */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <p className="text-sm text-muted-foreground">
                <span className="font-mono text-lg font-bold text-foreground">{filtered.length}</span> open positions
              </p>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden gap-1.5">
                    <SlidersHorizontal className="h-4 w-4" /> Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="rounded-t-3xl p-0">
                  <div className="mx-auto mt-3 h-1.5 w-10 rounded-full bg-muted-foreground/30" />
                  <div className="max-h-[75vh] overflow-y-auto p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="font-display text-base font-bold">Filters</h2>
                      <button onClick={resetFilters} className="text-xs text-muted-foreground hover:text-primary">Reset All</button>
                    </div>
                    <FilterContent
                      deptFilter={deptFilter} setDeptFilter={setDeptFilter}
                      locFilter={locFilter} setLocFilter={setLocFilter}
                      typeFilter={typeFilter} setTypeFilter={setTypeFilter}
                      levelFilter={levelFilter} setLevelFilter={setLevelFilter}
                      deptCounts={deptCounts} locCounts={locCounts}
                      onReset={resetFilters}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground">Sort by:</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="h-9 rounded-md border border-input bg-background px-2 text-xs"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="salary-high">Salary: high to low</option>
                <option value="salary-low">Salary: low to high</option>
              </select>
            </div>
          </div>

          {/* Active filter tags */}
          {(deptFilter.length > 0 || locFilter.length > 0 || typeFilter || levelFilter.length > 0) && (
            <div className="mb-4 flex flex-wrap gap-2">
              {deptFilter.map((d) => (
                <button key={d} onClick={() => setDeptFilter((p) => p.filter((x) => x !== d))} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {d} <X className="h-3 w-3" />
                </button>
              ))}
              {locFilter.map((l) => (
                <button key={l} onClick={() => setLocFilter((p) => p.filter((x) => x !== l))} className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400">
                  {l} <X className="h-3 w-3" />
                </button>
              ))}
              {typeFilter && (
                <button onClick={() => setTypeFilter("")} className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                  {typeFilter} <X className="h-3 w-3" />
                </button>
              )}
              {levelFilter.map((l) => (
                <button key={l} onClick={() => setLevelFilter((p) => p.filter((x) => x !== l))} className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-600 dark:text-purple-400">
                  {l} <X className="h-3 w-3" />
                </button>
              ))}
            </div>
          )}

          {/* Cards */}
          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl border border-border bg-card p-16 text-center"
              >
                <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
                <h3 className="font-display text-xl font-bold">No matching positions</h3>
                <p className="mt-2 text-sm text-muted-foreground">Try different keywords or remove some filters</p>
                <Button onClick={resetFilters} variant="outline" className="mt-5">Reset filters</Button>
              </motion.div>
            ) : (
              <motion.div key="list" className="space-y-4">
                {paged.map((job, i) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.35 }}
                  >
                    <JobCard job={job} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-9 w-9 rounded-md text-sm font-semibold transition ${p === page ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}
                >
                  {p}
                </button>
              ))}
              <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </SiteShell>
  );
}

function JobCard({ job }: { job: (typeof JOBS)[0] }) {
  return (
    <Link
      to="/careers/$id"
      params={{ id: job.id }}
      className="group block rounded-2xl border border-border bg-card p-5 shadow-card transition-all duration-200 hover:-translate-y-[3px] hover:border-l-4 hover:border-l-primary hover:shadow-elegant sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${DEPT_COLORS[job.department]}`}>
            {job.department}
          </span>
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${JOB_TYPE_COLORS[job.jobType]}`}>
            {job.jobType}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          {job.locations.join(" / ")}
        </div>
      </div>

      <h3 className="mt-3 font-display text-xl font-extrabold transition group-hover:text-primary">
        {job.title}
      </h3>

      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="text-base">💰</span>
          €{job.salaryMin.toLocaleString()} – €{job.salaryMax.toLocaleString()} / month
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          {job.jobType} · {job.level}
        </span>
        <span className="flex items-center gap-1.5">
          <Briefcase className="h-4 w-4" />
          {job.department}
        </span>
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-foreground/80">{job.shortDescription}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {job.skills.slice(0, 5).map((s) => (
          <span key={s} className="rounded-full bg-[#DCFCE7] px-2.5 py-0.5 text-xs font-medium text-[#166534] dark:bg-emerald-900/40 dark:text-emerald-300">
            {s}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <span className="text-xs text-muted-foreground">
          Posted {job.postedDaysAgo === 1 ? "yesterday" : job.postedDaysAgo === 0 ? "today" : `${job.postedDaysAgo} days ago`}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground transition group-hover:bg-primary/90">
          Apply Now <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}

type FilterProps = {
  deptFilter: Department[];
  setDeptFilter: React.Dispatch<React.SetStateAction<Department[]>>;
  locFilter: OfficeLocation[];
  setLocFilter: React.Dispatch<React.SetStateAction<OfficeLocation[]>>;
  typeFilter: JobType | "";
  setTypeFilter: React.Dispatch<React.SetStateAction<JobType | "">>;
  levelFilter: ExperienceLevel[];
  setLevelFilter: React.Dispatch<React.SetStateAction<ExperienceLevel[]>>;
  deptCounts: Partial<Record<Department, number>>;
  locCounts: Partial<Record<OfficeLocation, number>>;
  onReset: () => void;
};

function FilterContent({ deptFilter, setDeptFilter, locFilter, setLocFilter, typeFilter, setTypeFilter, levelFilter, setLevelFilter, deptCounts, locCounts }: FilterProps) {
  const toggleDept = (d: Department) => setDeptFilter((p) => p.includes(d) ? p.filter((x) => x !== d) : [...p, d]);
  const toggleLoc = (l: OfficeLocation) => setLocFilter((p) => p.includes(l) ? p.filter((x) => x !== l) : [...p, l]);
  const toggleLevel = (l: ExperienceLevel) => setLevelFilter((p) => p.includes(l) ? p.filter((x) => x !== l) : [...p, l]);

  return (
    <div className="space-y-6 text-sm">
      <div>
        <h3 className="mb-3 font-semibold text-foreground/80">Department</h3>
        <div className="space-y-2">
          {DEPARTMENTS.map((d) => (
            <label key={d} className="flex cursor-pointer items-center gap-2.5 rounded-lg p-1 hover:bg-accent">
              <input type="checkbox" checked={deptFilter.includes(d)} onChange={() => toggleDept(d)} className="accent-primary" />
              <span className="flex-1">{d}</span>
              <span className="text-xs text-muted-foreground">({deptCounts[d] ?? 0})</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-semibold text-foreground/80">Location</h3>
        <div className="space-y-2">
          {OFFICE_LOCATIONS.map((l) => (
            <label key={l} className="flex cursor-pointer items-center gap-2.5 rounded-lg p-1 hover:bg-accent">
              <input type="checkbox" checked={locFilter.includes(l)} onChange={() => toggleLoc(l)} className="accent-primary" />
              <span className="flex-1">{l}</span>
              <span className="text-xs text-muted-foreground">({locCounts[l] ?? 0})</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-semibold text-foreground/80">Job Type</h3>
        <div className="space-y-2">
          {(["", "Full-time", "Part-time", "Contract", "Internship"] as const).map((t) => (
            <label key={t || "all"} className="flex cursor-pointer items-center gap-2.5 rounded-lg p-1 hover:bg-accent">
              <input type="radio" name="jobType" checked={typeFilter === t} onChange={() => setTypeFilter(t)} className="accent-primary" />
              <span>{t || "All Types"}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-semibold text-foreground/80">Experience Level</h3>
        <div className="space-y-2">
          {(["Junior", "Mid-level", "Senior", "Lead / Manager"] as ExperienceLevel[]).map((l) => (
            <label key={l} className="flex cursor-pointer items-center gap-2.5 rounded-lg p-1 hover:bg-accent">
              <input type="checkbox" checked={levelFilter.includes(l)} onChange={() => toggleLevel(l)} className="accent-primary" />
              <span>{l}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
