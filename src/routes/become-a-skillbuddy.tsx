"use client";

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Upload, ChevronDown, Loader2, ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/navbar";

export const Route = createFileRoute("/become-a-skillbuddy")({
  head: () => ({
    meta: [
      { title: "Become a SkillBuddy Professional" },
      { name: "description", content: "Apply to become a verified SkillBuddy professional and start earning on your own terms." },
    ],
  }),
  component: BecomeASkillBuddy,
});

const CATEGORY_SUBCATEGORIES: Record<string, string[]> = {
  "Creative & Design": ["Photographer", "Graphic Designer", "Interior Designer", "Architect", "Videographer", "Illustrator"],
  "Pet Care": ["Pet Sitter", "Dog Walker", "Pet Trainer", "Vet Assistant", "Groomer"],
  "Beauty & Personal Care": ["Makeup Artist", "Hair Stylist", "Nail Artist", "Barber", "Esthetician", "Eyebrow Specialist"],
  "Health & Wellness": ["Yoga Instructor", "Personal Trainer", "Massage Therapist", "Nutritionist", "Life Coach", "Physiotherapist"],
  "Home & Property": ["Home Cleaner", "Plumber", "Electrician", "Painter", "AC Repair", "Laundry", "Pool Cleaner", "Locksmith", "Window Cleaner", "Carpet Cleaner"],
  "Personal & Household Assistance": ["Caretaker", "Driver", "Cook", "Babysitter", "House Keeper", "Personal Assistant"],
  "Education & Training": ["Home Tutor", "Music Teacher", "Dance Teacher", "Language Coach", "Sports Coach", "Driving Instructor"],
  "Event & Party": ["Event Planner", "DJ", "Decorator", "Catering", "Photographer", "Entertainer"],
  "Business & Professional": ["Accountant", "Legal Advisor", "IT Support", "Marketing Consultant", "Bookkeeper", "Tax Advisor"],
  "Travel & Transportation": ["Tour Guide", "Driver", "Moving & Shifting", "Travel Planner", "Airport Transfer"],
  "Repair & Customization": ["Shoe Repair", "Tailor", "Phone Repair", "General Repair", "Furniture Repair", "Appliance Repair"],
};

const CATEGORIES_LIST = Object.keys(CATEGORY_SUBCATEGORIES);

const AVAILABILITY_OPTIONS = [
  { id: "weekday-morning", label: "Weekday mornings (Mon–Fri, 8am–12pm)" },
  { id: "weekday-afternoon", label: "Weekday afternoons (Mon–Fri, 12pm–6pm)" },
  { id: "weekday-evening", label: "Weekday evenings (Mon–Fri, 6pm–10pm)" },
  { id: "weekends", label: "Weekends" },
  { id: "flexible", label: "Flexible / Available anytime" },
];

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  personalCode: string;
  category: string;
  subcategory: string;
  availability: string[];
  bio: string;
  terms: boolean;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.firstName.trim()) errors.firstName = "First name is required";
  if (!data.lastName.trim()) errors.lastName = "Last name is required";
  if (!data.email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) errors.email = "Valid email is required";
  if (!data.phone.trim()) errors.phone = "Phone number is required";
  if (!data.address.trim()) errors.address = "Address is required";
  if (!/^\d{11}$/.test(data.personalCode)) errors.personalCode = "Personal code must be exactly 11 digits";
  if (!data.category) errors.category = "Please select a category";
  if (!data.subcategory) errors.subcategory = "Please select a subcategory";
  if (data.availability.length === 0) errors.availability = "Please select at least one availability option";
  if (!data.bio.trim() || data.bio.trim().length < 50) errors.bio = "Please write at least 50 characters";
  if (!data.terms) errors.terms = "You must agree to the Terms & Conditions";
  return errors;
}

function BecomeASkillBuddy() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvError, setCvError] = useState<string>("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormData>({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", personalCode: "", category: "", subcategory: "",
    availability: [], bio: "", terms: false,
  });

  const set = (key: keyof FormData, value: string | boolean | string[]) => {
    setForm((p) => ({ ...p, [key]: value }));
    if (errors[key]) setErrors((p) => { const n = { ...p }; delete n[key]; return n; });
    if (key === "category") setForm((p) => ({ ...p, category: value as string, subcategory: "" }));
  };

  const toggleAvailability = (id: string) => {
    setForm((p) => ({
      ...p,
      availability: p.availability.includes(id)
        ? p.availability.filter((x) => x !== id)
        : [...p.availability, id],
    }));
    if (errors.availability) setErrors((p) => { const n = { ...p }; delete n.availability; return n; });
  };

  const handleFile = (file: File) => {
    setCvError("");
    const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(file.type)) { setCvError("Please upload PDF, DOC, or DOCX files only"); return; }
    if (file.size > 5 * 1024 * 1024) { setCvError("File must be under 5MB"); return; }
    setCvFile(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    setLoading(false);
    setSubmitted(true);
  };

  const inputClass = (err?: string) =>
    `w-full rounded-xl border px-4 py-3 text-sm transition-colors outline-none focus:ring-2 focus:ring-[#2D7A5F] bg-[#F8FAFB] dark:bg-[#161B22] text-[#0D1117] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 ${err ? "border-red-500 focus:ring-red-400" : "border-gray-200 dark:border-gray-700 focus:border-[#2D7A5F]"}`;

  const labelClass = "block text-sm font-medium text-[#374151] dark:text-[#8B949E] mb-1.5";

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Navbar />
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          className="text-center max-w-md"
          style={{ paddingTop: 80 }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
            className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30"
          >
            <CheckCircle className="h-12 w-12 text-[#2D7A5F]" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-extrabold mb-3"
          >
            Application Received! 🎉
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-muted-foreground mb-8 leading-relaxed"
          >
            Thank you for applying! Our team will review your application and get back to you within 48 hours.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full bg-[#2D7A5F] px-8 py-3.5 font-semibold text-white shadow-lg hover:bg-[#236B4F] transition"
            >
              Back to Home →
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" style={{ overflowX: "hidden" }}>
      <Navbar />

      <div className="flex min-h-screen flex-col lg:flex-row" style={{ paddingTop: 64 }}>
        {/* LEFT — Info Panel */}
        <div
          className="flex flex-col justify-center p-8 sm:p-12 lg:p-16 lg:w-[40%] text-white"
          style={{ background: "linear-gradient(160deg, #2D7A5F 0%, #1a5c3a 100%)" }}
        >
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-6 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <span className="text-lg">⭐</span>
              </div>
              <span className="text-xl font-extrabold tracking-tight">SkillBuddy</span>
            </div>

            <h1 className="mb-4 font-extrabold text-2xl sm:text-3xl lg:text-4xl leading-tight">
              Join the SkillBuddy Family
            </h1>
            <p className="mb-8 text-white/80 text-sm sm:text-base leading-relaxed">
              Become a verified SkillBuddy professional and start earning on your own terms. We connect you with thousands of clients across Estonia, Latvia, Lithuania and beyond. Join today and take control of your career.
            </p>

            <div className="space-y-4 mb-10">
              {[
                "Flexible working hours",
                "Competitive earnings in EUR",
                "Free Uber rides after 3-Star status",
              ].map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/20">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <span className="text-sm text-white/90 font-medium">{benefit}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-white/50 italic">
              "Expert care, anytime, anywhere — your trusted help is one click away."
            </p>
          </motion.div>
        </div>

        {/* RIGHT — Application Form */}
        <div className="flex-1 px-4 py-8 sm:px-8 sm:py-12 lg:px-12 lg:py-16 dark:bg-[#0D1117] bg-white overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-2xl"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition"
            >
              <ArrowLeft className="h-4 w-4" /> Back to home
            </Link>

            <h2 className="mb-1 text-2xl sm:text-3xl font-extrabold">Apply to Become a SkillBuddy Professional</h2>
            <p className="mb-8 text-sm text-muted-foreground">Fill in your details below and we'll be in touch within 48 hours.</p>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Name row */}
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>First Name *</label>
                  <input
                    className={inputClass(errors.firstName)}
                    placeholder="Enter your first name"
                    value={form.firstName}
                    onChange={(e) => set("firstName", e.target.value)}
                  />
                  {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
                </div>
                <div>
                  <label className={labelClass}>Last Name *</label>
                  <input
                    className={inputClass(errors.lastName)}
                    placeholder="Enter your last name"
                    value={form.lastName}
                    onChange={(e) => set("lastName", e.target.value)}
                  />
                  {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className={labelClass}>Email Address *</label>
                <input
                  type="email"
                  className={inputClass(errors.email)}
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className={labelClass}>Phone Number *</label>
                <input
                  type="tel"
                  className={inputClass(errors.phone)}
                  placeholder="+372 000 0000"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                />
                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
              </div>

              {/* Address */}
              <div>
                <label className={labelClass}>Address *</label>
                <input
                  className={inputClass(errors.address)}
                  placeholder="Street, City, Country"
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                />
                {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
              </div>

              {/* Personal Code */}
              <div>
                <label className={labelClass}>Personal Code *</label>
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]{11}"
                  maxLength={11}
                  className={inputClass(errors.personalCode)}
                  placeholder="00000000000"
                  value={form.personalCode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 11);
                    set("personalCode", val);
                  }}
                />
                <p className="mt-1 text-xs text-muted-foreground">{form.personalCode.length}/11 digits</p>
                {errors.personalCode && <p className="mt-1 text-xs text-red-500">{errors.personalCode}</p>}
              </div>

              {/* CV Upload */}
              <div>
                <label className={labelClass}>CV / Resume (optional)</label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-colors ${dragOver ? "border-[#2D7A5F] bg-green-50 dark:bg-green-900/10" : "border-gray-200 dark:border-gray-700 hover:border-[#2D7A5F]"}`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                  />
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  {cvFile ? (
                    <p className="text-sm font-medium text-[#2D7A5F]">{cvFile.name}</p>
                  ) : (
                    <>
                      <p className="text-sm font-medium">Drag &amp; drop or click to browse</p>
                      <p className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX — max 5MB</p>
                    </>
                  )}
                </div>
                {cvError && <p className="mt-1 text-xs text-red-500">{cvError}</p>}
              </div>

              {/* Category */}
              <div>
                <label className={labelClass}>Which category do you work in? *</label>
                <div className="relative">
                  <select
                    className={`${inputClass(errors.category)} appearance-none pr-10 cursor-pointer`}
                    value={form.category}
                    onChange={(e) => {
                      setForm((p) => ({ ...p, category: e.target.value, subcategory: "" }));
                      if (errors.category) setErrors((p) => { const n = { ...p }; delete n.category; return n; });
                    }}
                  >
                    <option value="">Select a category</option>
                    {CATEGORIES_LIST.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
              </div>

              {/* Subcategory */}
              <div>
                <label className={labelClass}>Select your specific service *</label>
                <div className="relative">
                  <select
                    className={`${inputClass(errors.subcategory)} appearance-none pr-10 cursor-pointer`}
                    value={form.subcategory}
                    onChange={(e) => set("subcategory", e.target.value)}
                    disabled={!form.category}
                  >
                    <option value="">{form.category ? "Select a service" : "Select a category first"}</option>
                    {(CATEGORY_SUBCATEGORIES[form.category] ?? []).map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                {errors.subcategory && <p className="mt-1 text-xs text-red-500">{errors.subcategory}</p>}
              </div>

              {/* Availability */}
              <div>
                <label className={labelClass}>When are you available? *</label>
                <div className="space-y-2">
                  {AVAILABILITY_OPTIONS.map((opt) => (
                    <label key={opt.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-3 transition hover:border-[#2D7A5F] hover:bg-green-50/50 dark:hover:bg-green-900/10">
                      <input
                        type="checkbox"
                        checked={form.availability.includes(opt.id)}
                        onChange={() => toggleAvailability(opt.id)}
                        className="h-4 w-4 rounded accent-[#2D7A5F] cursor-pointer"
                      />
                      <span className="text-sm text-[#374151] dark:text-[#8B949E]">{opt.label}</span>
                    </label>
                  ))}
                </div>
                {errors.availability && <p className="mt-1 text-xs text-red-500">{errors.availability}</p>}
              </div>

              {/* Bio */}
              <div>
                <label className={labelClass}>Tell us more about yourself *</label>
                <textarea
                  className={`${inputClass(errors.bio)} resize-y`}
                  placeholder="Describe your experience, skills, and why you want to join SkillBuddy..."
                  rows={5}
                  minLength={50}
                  maxLength={1000}
                  style={{ minHeight: 120 }}
                  value={form.bio}
                  onChange={(e) => set("bio", e.target.value)}
                />
                <div className="mt-1 flex justify-between">
                  {errors.bio ? <p className="text-xs text-red-500">{errors.bio}</p> : <span />}
                  <p className={`text-xs ${form.bio.length < 50 ? "text-muted-foreground" : "text-[#2D7A5F]"}`}>
                    {form.bio.length} / 1000
                  </p>
                </div>
              </div>

              {/* Terms */}
              <div>
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={form.terms}
                    onChange={(e) => set("terms", e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded accent-[#2D7A5F] cursor-pointer flex-shrink-0"
                  />
                  <span className="text-sm text-[#374151] dark:text-[#8B949E]">
                    I agree to the{" "}
                    <Link to="/terms" className="text-[#2D7A5F] underline hover:no-underline">Terms &amp; Conditions</Link>
                    {" "}and{" "}
                    <Link to="/privacy" className="text-[#2D7A5F] underline hover:no-underline">Privacy Policy</Link>
                  </span>
                </label>
                {errors.terms && <p className="mt-1 text-xs text-red-500">{errors.terms}</p>}
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={!loading ? { scale: 1.02 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                className="w-full flex items-center justify-center gap-2 rounded-full py-4 text-base font-bold text-white transition disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg, #2D7A5F, #4CAF84)", boxShadow: "0 4px 20px rgba(45,122,95,0.35)" }}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application →"
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
