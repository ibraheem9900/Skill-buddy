"use client";

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Upload, Loader2, ArrowLeft, ChevronDown, Check } from "lucide-react";
import iconTransparent from "@/assets/skillbuddy-icon-transparent.png";
import { useI18n } from "@/lib/i18n";

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

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  personalCode: string;
  category: string;
  preference1: string;
  preference2: string;
  bio: string;
  terms: boolean;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

function CustomSelect({
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  error,
}: {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder: string;
  disabled?: boolean;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleOutsideClick = useCallback((e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setOpen(false);
    }
  }, []);

  const handleToggle = () => {
    if (disabled) return;
    if (!open) document.addEventListener("mousedown", handleOutsideClick);
    else document.removeEventListener("mousedown", handleOutsideClick);
    setOpen((o) => !o);
  };

  const select = (opt: string) => {
    onChange(opt);
    setOpen(false);
    document.removeEventListener("mousedown", handleOutsideClick);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`w-full flex items-center justify-between rounded-xl border px-4 py-3 text-sm transition-all outline-none text-left
          ${disabled ? "opacity-50 cursor-not-allowed bg-muted" : "cursor-pointer hover:border-[#2D7A5F]"}
          ${error ? "border-red-500" : "border-gray-200 dark:border-gray-700"}
          ${open ? "border-[#2D7A5F] ring-2 ring-[#2D7A5F]/30" : ""}
          bg-[#F8FAFB] dark:bg-[#161B22] text-[#0D1117] dark:text-white`}
      >
        <span className={value ? "" : "text-gray-400 dark:text-gray-500"}>
          {value || placeholder}
        </span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0, y: -4 }}
            animate={{ opacity: 1, scaleY: 1, y: 0 }}
            exit={{ opacity: 0, scaleY: 0, y: -4 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{ transformOrigin: "top", zIndex: 50 }}
            className="absolute left-0 right-0 top-full mt-1 overflow-hidden rounded-xl border border-[#2D7A5F] bg-white dark:bg-[#161B22] shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
          >
            <div className="max-h-56 overflow-y-auto">
              {options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => select(opt)}
                  className="flex w-full items-center justify-between px-4 py-2.5 text-sm text-left transition-colors hover:bg-[rgba(45,122,95,0.08)] hover:text-[#2D7A5F]"
                >
                  <span className={value === opt ? "font-semibold text-[#2D7A5F]" : ""}>{opt}</span>
                  {value === opt && <Check className="h-4 w-4 text-[#2D7A5F] flex-shrink-0" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BecomeASkillBuddy() {
  const navigate = useNavigate();
  const { t } = useI18n();

  const validate = (data: FormData): FormErrors => {
    const errors: FormErrors = {};
    if (!data.firstName.trim()) errors.firstName = t("becomeSkillbuddy.firstNameRequired");
    if (!data.lastName.trim()) errors.lastName = t("becomeSkillbuddy.lastNameRequired");
    if (!data.email.trim() || !/^[^\@\s]+@[^\@\s]+\.[^\@\s]+$/.test(data.email)) errors.email = t("becomeSkillbuddy.emailRequired");
    if (!data.phone.trim()) errors.phone = t("becomeSkillbuddy.phoneRequired");
    if (!data.address.trim()) errors.address = t("becomeSkillbuddy.addressRequired");
    if (!/^\d{11}$/.test(data.personalCode)) errors.personalCode = t("becomeSkillbuddy.personalCodeError");
    if (!data.category) errors.category = t("becomeSkillbuddy.categoryRequired");
    if (data.category && !data.preference1) errors.preference1 = "Please select your Preference 1";
    if (!data.bio.trim() || data.bio.trim().length < 50) errors.bio = t("becomeSkillbuddy.bioMinLength");
    if (!data.terms) errors.terms = t("becomeSkillbuddy.termsRequired");
    return errors;
  };

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvError, setCvError] = useState<string>("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormData>({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", personalCode: "", category: "", preference1: "",
    preference2: "", bio: "", terms: false,
  });

  const set = (key: keyof FormData, value: string | boolean) => {
    setForm((p) => ({ ...p, [key]: value }));
    if (errors[key]) setErrors((p) => { const n = { ...p }; delete n[key]; return n; });
    if (key === "category") setForm((p) => ({ ...p, category: value as string, preference1: "", preference2: "" }));
    if (key === "preference1" && form.preference2 === value) {
      setForm((p) => ({ ...p, preference2: "" }));
    }
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
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          className="text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
            className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30"
          >
            <CheckCircle className="h-12 w-12 text-[#2D7A5F]" />
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-3xl font-extrabold mb-3">
            {t("becomeSkillbuddy.successTitle")}
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-muted-foreground mb-8 leading-relaxed">
            {t("becomeSkillbuddy.successMessage")}
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <Link to="/" className="inline-flex items-center gap-2 rounded-full bg-[#2D7A5F] px-8 py-3.5 font-semibold text-white shadow-lg hover:bg-[#236B4F] transition">
              {t("becomeSkillbuddy.backHome")}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" style={{ overflowX: "hidden" }}>
      <div className="flex min-h-[calc(100vh-72px)] flex-col lg:flex-row">
        {/* LEFT — Info Panel */}
        <div
          className="flex flex-col justify-start p-8 sm:p-12 lg:p-16 lg:w-[40%] text-white"
          style={{ background: "linear-gradient(160deg, #2D7A5F 0%, #1a5c3a 100%)", alignItems: "flex-start", paddingTop: 48 }}
        >
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            <div className="mb-6 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <img src={iconTransparent} alt="SkillBuddy" style={{ width: 22, height: 22, objectFit: "contain", filter: "brightness(0) invert(1)" }} />
              </div>
              <span className="text-xl font-extrabold tracking-tight">SkillBuddy</span>
            </div>
            <h1 className="mb-4 font-extrabold text-2xl sm:text-3xl lg:text-4xl leading-tight">
              {t("becomeSkillbuddy.panelHeading")}
            </h1>
            <p className="mb-8 text-white/80 text-sm sm:text-base leading-relaxed">
              {t("becomeSkillbuddy.panelText")}
            </p>
            <div className="space-y-4 mb-10">
              {[
                t("becomeSkillbuddy.benefit1"),
                t("becomeSkillbuddy.benefit2"),
                t("becomeSkillbuddy.benefit3"),
              ].map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/20">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <span className="text-sm text-white/90 font-medium">{benefit}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-white/50 italic">"Expert care, anytime, anywhere — your trusted help is one click away."</p>
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
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition">
              <ArrowLeft className="h-4 w-4" /> {t("becomeSkillbuddy.backToHome")}
            </Link>

            <h2 className="mb-1 text-2xl sm:text-3xl font-extrabold">{t("becomeSkillbuddy.title")}</h2>
            <p className="mb-8 text-sm text-muted-foreground">{t("becomeSkillbuddy.subtitle")}</p>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Name row */}
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>{t("becomeSkillbuddy.firstName")} *</label>
                  <input
                    className={inputClass(errors.firstName)}
                    placeholder={t("becomeSkillbuddy.firstNamePlaceholder")}
                    value={form.firstName}
                    onChange={(e) => set("firstName", e.target.value)}
                  />
                  {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
                </div>
                <div>
                  <label className={labelClass}>{t("becomeSkillbuddy.lastName")} *</label>
                  <input
                    className={inputClass(errors.lastName)}
                    placeholder={t("becomeSkillbuddy.lastNamePlaceholder")}
                    value={form.lastName}
                    onChange={(e) => set("lastName", e.target.value)}
                  />
                  {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className={labelClass}>{t("becomeSkillbuddy.email")} *</label>
                <input
                  type="email"
                  className={inputClass(errors.email)}
                  placeholder={t("becomeSkillbuddy.emailPlaceholder")}
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className={labelClass}>{t("becomeSkillbuddy.phone")} *</label>
                <input
                  type="tel"
                  className={inputClass(errors.phone)}
                  placeholder={t("becomeSkillbuddy.phonePlaceholder")}
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                />
                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
              </div>

              {/* Address */}
              <div>
                <label className={labelClass}>{t("becomeSkillbuddy.address")} *</label>
                <input
                  className={inputClass(errors.address)}
                  placeholder={t("becomeSkillbuddy.addressPlaceholder")}
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                />
                {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
              </div>

              {/* Personal Code */}
              <div>
                <label className={labelClass}>{t("becomeSkillbuddy.personalCode")} *</label>
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
                <p className="mt-1 text-xs text-muted-foreground">{form.personalCode.length}/11 — {t("becomeSkillbuddy.personalCodeHint")}</p>
                {errors.personalCode && <p className="mt-1 text-xs text-red-500">{errors.personalCode}</p>}
              </div>

              {/* CV Upload */}
              <div>
                <label className={labelClass}>{t("becomeSkillbuddy.cvUpload")}</label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-colors ${dragOver ? "border-[#2D7A5F] bg-green-50 dark:bg-green-900/10" : "border-gray-200 dark:border-gray-700 hover:border-[#2D7A5F]"}`}
                >
                  <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  {cvFile ? (
                    <p className="text-sm font-medium text-[#2D7A5F]">{cvFile.name}</p>
                  ) : (
                    <>
                      <p className="text-sm font-medium">{t("becomeSkillbuddy.cvDragDrop")}</p>
                      <p className="text-xs text-muted-foreground mt-1">{t("becomeSkillbuddy.cvFormats")}</p>
                    </>
                  )}
                </div>
                {cvError && <p className="mt-1 text-xs text-red-500">{cvError}</p>}
              </div>

              {/* Category */}
              <div>
                <label className={labelClass}>{t("becomeSkillbuddy.category")} *</label>
                <CustomSelect
                  value={form.category}
                  onChange={(val) => {
                    setForm((p) => ({ ...p, category: val, preference1: "", preference2: "" }));
                    if (errors.category) setErrors((p) => { const n = { ...p }; delete n.category; return n; });
                  }}
                  options={CATEGORIES_LIST}
                  placeholder={t("becomeSkillbuddy.categoryPlaceholder")}
                  error={errors.category}
                />
                {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
              </div>

              {/* Preference 1 + Preference 2 — fade in after category selected. Both share the
                  identical options list (the selected category's specific services); Preference 2
                  excludes whatever is chosen in Preference 1 to prevent picking the same value twice. */}
              <AnimatePresence>
                {form.category && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="space-y-5"
                  >
                    {/* Preference 1 — MANDATORY */}
                    <div>
                      <label className={labelClass}>Preference 1 *</label>
                      <CustomSelect
                        value={form.preference1}
                        onChange={(val) => {
                          set("preference1", val);
                          if (errors.preference1) setErrors((p) => { const n = { ...p }; delete n.preference1; return n; });
                        }}
                        options={CATEGORY_SUBCATEGORIES[form.category] ?? []}
                        placeholder="Choose your preferred service"
                        error={errors.preference1}
                      />
                      {errors.preference1 && <p className="mt-1 text-xs text-red-500">{errors.preference1}</p>}
                    </div>

                    {/* Preference 2 — OPTIONAL, same options as Preference 1 minus its current value */}
                    <div>
                      <label className={labelClass}>Preference 2 <span className="text-muted-foreground font-normal">(optional)</span></label>
                      <CustomSelect
                        value={form.preference2}
                        onChange={(val) => set("preference2", val)}
                        options={(CATEGORY_SUBCATEGORIES[form.category] ?? []).filter((opt) => opt !== form.preference1)}
                        placeholder="Choose another preference (optional)"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bio */}
              <div>
                <label className={labelClass}>{t("becomeSkillbuddy.aboutYourself")} *</label>
                <textarea
                  className={`${inputClass(errors.bio)} resize-y`}
                  placeholder={t("becomeSkillbuddy.aboutPlaceholder")}
                  rows={5}
                  minLength={50}
                  maxLength={1000}
                  style={{ minHeight: 120 }}
                  value={form.bio}
                  onChange={(e) => set("bio", e.target.value)}
                />
                <div className="mt-1 flex justify-between">
                  {errors.bio ? <p className="text-xs text-red-500">{errors.bio}</p> : <span />}
                  <p className={`text-xs ${form.bio.length < 50 ? "text-muted-foreground" : "text-[#2D7A5F]"}`}>{form.bio.length} / 1000</p>
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
                    {t("becomeSkillbuddy.termsText")}{" "}
                    <Link to="/terms" className="text-[#2D7A5F] underline hover:no-underline">{t("becomeSkillbuddy.termsLink")}</Link>
                    {" "}{t("becomeSkillbuddy.termsAnd")}{" "}
                    <Link to="/privacy" className="text-[#2D7A5F] underline hover:no-underline">{t("becomeSkillbuddy.privacyLink")}</Link>
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
                  <><Loader2 className="h-5 w-5 animate-spin" />{t("becomeSkillbuddy.submitting")}</>
                ) : t("becomeSkillbuddy.submitButton")}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
