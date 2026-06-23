"use client";

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, CircleCheck as CheckCircle2, Upload, X, Loader as Loader2, Eye, EyeOff, User, Mail, Lock, MapPin, Phone, Building, QrCode, Wrench, Search } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import { supabase } from "@/lib/supabase-browser";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/register/skillbuddy")({
  head: () => ({
    meta: [
      { title: "Register as Provider — SkillBuddy" },
      { name: "description", content: "Create your provider account on SkillBuddy." },
    ],
  }),
  component: ProviderRegisterPage,
});

const TOTAL_STEPS = 4;

const ESTONIAN_COUNTIES = [
  "Harju County",
  "Ida-Viru County",
  "Järva County",
  "Jõgeva County",
  "Lääne County",
  "Lääne-Viru County",
  "Pärnu County",
  "Põlva County",
  "Rapla County",
  "Saare County",
  "Tartu County",
  "Valga County",
  "Viljandi County",
  "Võru County",
];

const SKILLS = [
  { id: "photographer", name: "Photographer", category: "Creative & Design" },
  { id: "graphic_designer", name: "Graphic Designer", category: "Creative & Design" },
  { id: "interior_designer", name: "Interior Designer", category: "Creative & Design" },
  { id: "makeup_artist", name: "Makeup Artist", category: "Beauty & Personal Care" },
  { id: "hair_stylist", name: "Hair Stylist", category: "Beauty & Personal Care" },
  { id: "nail_artist", name: "Nail Artist", category: "Beauty & Personal Care" },
  { id: "barber", name: "Barber", category: "Beauty & Personal Care" },
  { id: "yoga_coach", name: "Yoga & Fitness Coach", category: "Health & Wellness" },
  { id: "massage_therapist", name: "Massage Therapist", category: "Health & Wellness" },
  { id: "physiotherapist", name: "Physiotherapist", category: "Health & Wellness" },
  { id: "plumber", name: "Plumber", category: "Home & Property" },
  { id: "electrician", name: "Electrician", category: "Home & Property" },
  { id: "cleaner", name: "Home Cleaner", category: "Home & Property" },
  { id: "carpenter", name: "Carpenter", category: "Home & Property" },
  { id: "pet_sitter", name: "Pet Sitter", category: "Pet Care" },
  { id: "dog_trainer", name: "Dog Trainer", category: "Pet Care" },
  { id: "tutor", name: "Tutor", category: "Education & Training" },
  { id: "music_teacher", name: "Music Teacher", category: "Education & Training" },
  { id: "driver", name: "Driver", category: "Travel & Transportation" },
  { id: "event_planner", name: "Event Planner", category: "Event & Party" },
  { id: "catering", name: "Catering Service", category: "Event & Party" },
  { id: "accountant", name: "Accountant", category: "Business & Professional" },
  { id: "it_support", name: "IT Support", category: "Business & Professional" },
  { id: "mechanic", name: "Auto Mechanic", category: "Home & Property" },
  { id: "locksmith", name: "Locksmith", category: "Home & Property" },
  { id: "tailor", name: "Tailor", category: "Repair & Customization" },
];

type FormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  avatar: File | null;
  country: string;
  county: string;
  city: string;
  postalCode: string;
  streetAddress: string;
  houseNumber: string;
  primarySkill: string;
  secondarySkill: string;
  certification: File | null;
  residencePermitFront: File | null;
  residencePermitBack: File | null;
  phone: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

function ProviderRegisterPage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const [skillSearch, setSkillSearch] = useState("");

  const [form, setForm] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    avatar: null,
    country: "Estonia",
    county: "",
    city: "",
    postalCode: "",
    streetAddress: "",
    houseNumber: "",
    primarySkill: "",
    secondarySkill: "",
    certification: null,
    residencePermitFront: null,
    residencePermitBack: null,
    phone: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const avatarRef = useRef<HTMLInputElement>(null);
  const certRef = useRef<HTMLInputElement>(null);
  const frontDocRef = useRef<HTMLInputElement>(null);
  const backDocRef = useRef<HTMLInputElement>(null);

  const update = (key: keyof FormData, value: string | File | null) =>
    setForm((f) => ({ ...f, [key]: value }));

  const validateStep1 = (): boolean => {
    const errs: FormErrors = {};
    if (!form.username.trim()) errs.username = t("auth.validation.required");
    else if (form.username.length < 3) errs.username = t("auth.validation.usernameMinLength");
    if (!form.email.trim()) errs.email = t("auth.validation.required");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = t("auth.validation.invalidEmail");
    if (!form.password) errs.password = t("auth.validation.required");
    else if (form.password.length < 8) errs.password = t("auth.validation.passwordMinLength");
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password))
      errs.password = t("auth.validation.passwordRequirements");
    if (form.password !== form.confirmPassword)
      errs.confirmPassword = t("auth.validation.passwordMismatch");
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errs: FormErrors = {};
    if (!form.fullName.trim()) errs.fullName = t("auth.validation.required");
    if (!form.county) errs.county = t("auth.validation.required");
    if (!form.city.trim()) errs.city = t("auth.validation.required");
    if (!form.postalCode.trim()) errs.postalCode = t("auth.validation.required");
    if (!form.streetAddress.trim()) errs.streetAddress = t("auth.validation.required");
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = (): boolean => {
    const errs: FormErrors = {};
    if (!form.primarySkill) errs.primarySkill = t("auth.validation.required");
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep4 = (): boolean => {
    const errs: FormErrors = {};
    if (!form.residencePermitFront) errs.residencePermitFront = t("auth.validation.required");
    if (!form.residencePermitBack) errs.residencePermitBack = t("auth.validation.required");
    if (!form.phone.trim()) errs.phone = t("auth.validation.required");
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSendOtp = async () => {
    if (!validateStep1()) return;
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          username: form.username,
          role: "provider",
        },
      },
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    setOtpSent(true);
    toast.success(t("register.step1.otpSent"));
    setResendCountdown(60);
    const interval = setInterval(() => {
      setResendCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error(t("auth.validation.otpRequired"));
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email: form.email,
      token: otp,
      type: "signup",
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    setStep(2);
  };

  const handleNextStep = () => {
    if (step === 1 && !otpSent) {
      handleSendOtp();
    } else if (step === 1 && otpSent) {
      handleVerifyOtp();
    } else if (step === 2) {
      if (validateStep2()) setStep(3);
    } else if (step === 3) {
      if (validateStep3()) setStep(4);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep4()) return;
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error(t("register.step4.sessionExpired"));
        navigate({ to: "/register" });
        return;
      }

      let avatarUrl: string | null = null;
      if (form.avatar) {
        const ext = form.avatar.name.split(".").pop();
        const path = `avatars/${user.id}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("profiles")
          .upload(path, form.avatar, { upsert: true });
        if (!uploadError) {
          const { data } = supabase.storage.from("profiles").getPublicUrl(path);
          avatarUrl = data.publicUrl;
        }
      }

      let certificationUrl: string | null = null;
      if (form.certification) {
        const ext = form.certification.name.split(".").pop();
        const path = `certifications/${user.id}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("profiles")
          .upload(path, form.certification);
        if (!uploadError) {
          const { data } = supabase.storage.from("profiles").getPublicUrl(path);
          certificationUrl = data.publicUrl;
        }
      }

      let frontDocUrl: string | null = null;
      let backDocUrl: string | null = null;

      if (form.residencePermitFront) {
        const ext = form.residencePermitFront.name.split(".").pop();
        const path = `documents/${user.id}/residence_front.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("profiles")
          .upload(path, form.residencePermitFront);
        if (!uploadError) {
          const { data } = supabase.storage.from("profiles").getPublicUrl(path);
          frontDocUrl = data.publicUrl;
        }
      }

      if (form.residencePermitBack) {
        const ext = form.residencePermitBack.name.split(".").pop();
        const path = `documents/${user.id}/residence_back.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("profiles")
          .upload(path, form.residencePermitBack);
        if (!uploadError) {
          const { data } = supabase.storage.from("profiles").getPublicUrl(path);
          backDocUrl = data.publicUrl;
        }
      }

      const { error: profileError } = await supabase.from("profiles").insert({
        user_id: user.id,
        username: form.username,
        role: "provider",
        full_name: form.fullName,
        avatar_url: avatarUrl,
        country: form.country,
        county: form.county,
        city: form.city,
        postal_code: form.postalCode,
        street_address: form.streetAddress,
        house_number: form.houseNumber,
        phone: form.phone,
        verification_status: "pending",
      });

      if (profileError) {
        toast.error(profileError.message);
        setLoading(false);
        return;
      }

      const { error: providerError } = await supabase.from("provider_profiles").insert({
        user_id: user.id,
        primary_skill: form.primarySkill,
        secondary_skill: form.secondarySkill || null,
        certification_url: certificationUrl,
        residence_permit_front_url: frontDocUrl,
        residence_permit_back_url: backDocUrl,
        face_verified: false,
      });

      if (providerError) {
        toast.error(providerError.message);
        setLoading(false);
        return;
      }

      toast.success(t("register.step4.successProvider"));
      navigate({ to: "/auth/login" });
    } catch (err) {
      toast.error(t("register.step4.errorGeneric"));
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (
    key: keyof FormData,
    file: File,
    ref: React.RefObject<HTMLInputElement>
  ) => {
    if (file.size > 5 * 1024 * 1024) {
      setErrors((e) => ({ ...e, [key]: t("auth.validation.fileSize") }));
      return;
    }
    setErrors((e) => ({ ...e, [key]: undefined }));
    update(key, file);
  };

  const filteredSkills = SKILLS.filter(
    (s) =>
      s.name.toLowerCase().includes(skillSearch.toLowerCase()) ||
      s.category.toLowerCase().includes(skillSearch.toLowerCase())
  );

  return (
    <SiteShell>
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:py-12">
        <Link
          to="/register"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("register.backToRole")}
        </Link>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-lg sm:p-8">
          <StepIndicator currentStep={step} totalSteps={TOTAL_STEPS} />

          <AnimatePresence mode="wait">
            {step === 1 && (
              <Step1Form
                key="step1"
                form={form}
                errors={errors}
                showPassword={showPassword}
                showConfirmPassword={showConfirmPassword}
                otpSent={otpSent}
                otp={otp}
                resendCountdown={resendCountdown}
                loading={loading}
                onTogglePassword={() => setShowPassword(!showPassword)}
                onToggleConfirmPassword={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                onUpdate={update}
                onOtpChange={setOtp}
                onNext={handleNextStep}
              />
            )}
            {step === 2 && (
              <Step2Form
                key="step2"
                form={form}
                errors={errors}
                onUpdate={update}
                onFileUpload={handleFileUpload}
                avatarRef={avatarRef}
                onNext={handleNextStep}
                onBack={() => setStep(1)}
              />
            )}
            {step === 3 && (
              <Step3Form
                key="step3"
                form={form}
                errors={errors}
                skillSearch={skillSearch}
                filteredSkills={filteredSkills}
                onUpdate={update}
                onSkillSearchChange={setSkillSearch}
                onFileUpload={handleFileUpload}
                certRef={certRef}
                onNext={handleNextStep}
                onBack={() => setStep(2)}
              />
            )}
            {step === 4 && (
              <Step4Form
                key="step4"
                form={form}
                errors={errors}
                loading={loading}
                onUpdate={update}
                onFileUpload={handleFileUpload}
                frontDocRef={frontDocRef}
                backDocRef={backDocRef}
                onSubmit={handleSubmit}
                onBack={() => setStep(3)}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </SiteShell>
  );
}

function StepIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  const { t } = useI18n();
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className="flex items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold transition-colors ${
                i + 1 < currentStep
                  ? "border-[#2D7A5F] bg-[#2D7A5F] text-white"
                  : i + 1 === currentStep
                    ? "border-[#2D7A5F] bg-[#2D7A5F]/10 text-[#2D7A5F]"
                    : "border-border text-muted-foreground"
              }`}
            >
              {i + 1 < currentStep ? (
                <Check className="h-5 w-5" />
              ) : (
                i + 1
              )}
            </div>
            {i < totalSteps - 1 && (
              <div
                className={`mx-2 h-0.5 w-full flex-1 rounded ${
                  i + 1 < currentStep ? "bg-[#2D7A5F]" : "bg-border"
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>{t("register.step.account")}</span>
        <span>{t("register.step.profile")}</span>
        <span>{t("register.step.skills")}</span>
        <span>{t("register.step.verification")}</span>
      </div>
    </div>
  );
}

function Step1Form({
  form,
  errors,
  showPassword,
  showConfirmPassword,
  otpSent,
  otp,
  resendCountdown,
  loading,
  onTogglePassword,
  onToggleConfirmPassword,
  onUpdate,
  onOtpChange,
  onNext,
}: {
  form: FormData;
  errors: FormErrors;
  showPassword: boolean;
  showConfirmPassword: boolean;
  otpSent: boolean;
  otp: string;
  resendCountdown: number;
  loading: boolean;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
  onUpdate: (key: keyof FormData, value: string) => void;
  onOtpChange: (v: string) => void;
  onNext: () => void;
}) {
  const { t } = useI18n();
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h2 className="text-2xl font-bold">{t("register.step1.titleProvider")}</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {t("register.haveAccount")}{" "}
        <Link to="/auth/login" className="text-primary hover:underline">
          {t("auth.signIn")}
        </Link>
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <Label htmlFor="username">{t("register.step1.username")}</Label>
          <div className="relative mt-1.5">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="username"
              value={form.username}
              onChange={(e) => onUpdate("username", e.target.value)}
              placeholder="johndoe"
              className={`h-11 pl-10 ${errors.username ? "border-red-500" : ""}`}
            />
          </div>
          {errors.username && (
            <p className="mt-1 text-xs text-red-500">{errors.username}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">{t("register.step1.email")}</Label>
          <div className="relative mt-1.5">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => onUpdate("email", e.target.value)}
              placeholder="you@email.com"
              className={`h-11 pl-10 ${errors.email ? "border-red-500" : ""}`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
          )}
        </div>

        <div>
          <Label htmlFor="password">{t("register.step1.password")}</Label>
          <div className="relative mt-1.5">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => onUpdate("password", e.target.value)}
              placeholder="Min. 8 characters"
              className={`h-11 pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
            />
            <button
              type="button"
              onClick={onTogglePassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password}</p>
          )}
        </div>

        <div>
          <Label htmlFor="confirmPassword">{t("register.step1.confirmPassword")}</Label>
          <div className="relative mt-1.5">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={(e) => onUpdate("confirmPassword", e.target.value)}
              placeholder="Confirm your password"
              className={`h-11 pl-10 pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
            />
            <button
              type="button"
              onClick={onToggleConfirmPassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
          )}
        </div>

        {otpSent && (
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <Label htmlFor="otp">{t("register.step1.otpLabel")}</Label>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("register.step1.resendCode")} {form.email}
            </p>
            <Input
              id="otp"
              value={otp}
              onChange={(e) => onOtpChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              className="mt-2 h-12 text-center text-2xl tracking-widest"
            />
            <button
              type="button"
              disabled={resendCountdown > 0}
              onClick={() => {}}
              className="mt-2 text-xs text-primary disabled:opacity-50"
            >
              {resendCountdown > 0 ? `${t("register.step1.resendIn")} ${resendCountdown}s` : t("register.step1.resendCode")}
            </button>
          </div>
        )}

        <Button
          type="button"
          onClick={onNext}
          disabled={loading}
          className="mt-6 h-11 w-full bg-[#2D7A5F] hover:bg-[#236B4F]"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : otpSent ? (
            <>
              {t("register.step1.verifyContinue")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              {t("common.continue")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>

        <div className="relative my-6 flex items-center gap-2 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          {t("common.orContinueWith")}
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" type="button" className="h-11">
            Google
          </Button>
          <Button variant="outline" type="button" className="h-11">
            Apple
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function Step2Form({
  form,
  errors,
  onUpdate,
  onFileUpload,
  avatarRef,
  onNext,
  onBack,
}: {
  form: FormData;
  errors: FormErrors;
  onUpdate: (key: keyof FormData, value: string) => void;
  onFileUpload: (key: keyof FormData, file: File, ref: React.RefObject<HTMLInputElement>) => void;
  avatarRef: React.RefObject<HTMLInputElement>;
  onNext: () => void;
  onBack: () => void;
}) {
  const { t } = useI18n();
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h2 className="text-2xl font-bold">{t("register.step2.title")}</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {t("register.step2.subtitle")}
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <Label>{t("register.step2.avatarLabel")}</Label>
          <div className="mt-2 flex items-center gap-4">
            <div
              onClick={() => avatarRef.current?.click()}
              className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-border bg-muted/50 hover:border-[#2D7A5F]"
            >
              {form.avatar ? (
                <img
                  src={URL.createObjectURL(form.avatar)}
                  alt="Avatar preview"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <Upload className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              {t("register.step2.avatarClick")}
              <br />
              <span className="text-xs">{t("register.step2.avatarHint")}</span>
            </div>
            <input
              ref={avatarRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onFileUpload("avatar", file, avatarRef);
              }}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="fullName">{t("register.step2.fullName")}</Label>
          <div className="relative mt-1.5">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="fullName"
              value={form.fullName}
              onChange={(e) => onUpdate("fullName", e.target.value)}
              placeholder="John Doe"
              className={`h-11 pl-10 ${errors.fullName ? "border-red-500" : ""}`}
            />
          </div>
          {errors.fullName && (
            <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="country">{t("register.step2.country")}</Label>
            <Select value={form.country} onValueChange={(v) => onUpdate("country", v)}>
              <SelectTrigger className="mt-1.5 h-11">
                <SelectValue placeholder={t("register.step2.selectCountry")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Estonia">{t("country.estonia")}</SelectItem>
                <SelectItem value="Latvia">{t("country.latvia")}</SelectItem>
                <SelectItem value="Lithuania">{t("country.lithuania")}</SelectItem>
                <SelectItem value="Finland">{t("country.finland")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="county">{t("register.step2.county")}</Label>
            <Select value={form.county} onValueChange={(v) => onUpdate("county", v)}>
              <SelectTrigger className={`mt-1.5 h-11 ${errors.county ? "border-red-500" : ""}`}>
                <SelectValue placeholder={t("register.step2.selectCounty")} />
              </SelectTrigger>
              <SelectContent>
                {ESTONIAN_COUNTIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.county && (
              <p className="mt-1 text-xs text-red-500">{errors.county}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">{t("register.step2.city")}</Label>
            <div className="relative mt-1.5">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="city"
                value={form.city}
                onChange={(e) => onUpdate("city", e.target.value)}
                placeholder="Tallinn"
                className={`h-11 pl-10 ${errors.city ? "border-red-500" : ""}`}
              />
            </div>
            {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
          </div>
          <div>
            <Label htmlFor="postalCode">{t("register.step2.postalCode")}</Label>
            <Input
              id="postalCode"
              value={form.postalCode}
              onChange={(e) => onUpdate("postalCode", e.target.value)}
              placeholder="10111"
              className={`mt-1.5 h-11 ${errors.postalCode ? "border-red-500" : ""}`}
            />
            {errors.postalCode && (
              <p className="mt-1 text-xs text-red-500">{errors.postalCode}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <Label htmlFor="streetAddress">{t("register.step2.streetAddress")}</Label>
            <div className="relative mt-1.5">
              <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="streetAddress"
                value={form.streetAddress}
                onChange={(e) => onUpdate("streetAddress", e.target.value)}
                placeholder="Narva mnt"
                className={`h-11 pl-10 ${errors.streetAddress ? "border-red-500" : ""}`}
              />
            </div>
            {errors.streetAddress && (
              <p className="mt-1 text-xs text-red-500">{errors.streetAddress}</p>
            )}
          </div>
          <div>
            <Label htmlFor="houseNumber">{t("register.step2.houseNumber")}</Label>
            <Input
              id="houseNumber"
              value={form.houseNumber}
              onChange={(e) => onUpdate("houseNumber", e.target.value)}
              placeholder="1A"
              className="mt-1.5 h-11"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button type="button" variant="outline" onClick={onBack} className="flex-1">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("common.back")}
          </Button>
          <Button type="button" onClick={onNext} className="flex-1 bg-[#2D7A5F] hover:bg-[#236B4F]">
            {t("common.continue")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function Step3Form({
  form,
  errors,
  skillSearch,
  filteredSkills,
  onUpdate,
  onSkillSearchChange,
  onFileUpload,
  certRef,
  onNext,
  onBack,
}: {
  form: FormData;
  errors: FormErrors;
  skillSearch: string;
  filteredSkills: typeof SKILLS;
  onUpdate: (key: keyof FormData, value: string) => void;
  onSkillSearchChange: (v: string) => void;
  onFileUpload: (key: keyof FormData, file: File, ref: React.RefObject<HTMLInputElement>) => void;
  certRef: React.RefObject<HTMLInputElement>;
  onNext: () => void;
  onBack: () => void;
}) {
  const { t } = useI18n();
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h2 className="text-2xl font-bold">{t("register.step3.title")}</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {t("register.step3.subtitle")}
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <Label>{t("register.step3.primarySkill")}</Label>
          <div className="relative mt-1.5">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={skillSearch}
              onChange={(e) => onSkillSearchChange(e.target.value)}
              placeholder={t("register.step3.searchSkills")}
              className="h-11 pl-10"
            />
          </div>
          <div className="mt-2 max-h-48 overflow-y-auto rounded-lg border border-border p-2">
            {filteredSkills.length === 0 ? (
              <p className="p-2 text-sm text-muted-foreground">{t("register.step3.noSkills")}</p>
            ) : (
              filteredSkills.map((skill) => (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() => onUpdate("primarySkill", skill.id)}
                  className={`w-full rounded-lg p-2 text-left text-sm transition-colors ${
                    form.primarySkill === skill.id
                      ? "bg-[#2D7A5F]/10 text-[#2D7A5F]"
                      : "hover:bg-muted"
                  }`}
                >
                  <div className="font-medium">{skill.name}</div>
                  <div className="text-xs text-muted-foreground">{skill.category}</div>
                </button>
              ))
            )}
          </div>
          {errors.primarySkill && (
            <p className="mt-1 text-xs text-red-500">{errors.primarySkill}</p>
          )}
        </div>

        <div>
          <Label>{t("register.step3.secondarySkill")}</Label>
          <Select
            value={form.secondarySkill}
            onValueChange={(v) => onUpdate("secondarySkill", v)}
          >
            <SelectTrigger className="mt-1.5 h-11">
              <SelectValue placeholder={t("register.step3.selectSecondary")} />
            </SelectTrigger>
            <SelectContent>
              {SKILLS.filter((s) => s.id !== form.primarySkill).map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>{t("register.step3.certification")}</Label>
          <div
            onClick={() => certRef.current?.click()}
            className="mt-1.5 flex h-24 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 hover:border-[#2D7A5F]"
          >
            {form.certification ? (
              <div className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-[#2D7A5F]" />
                <span className="text-sm">{form.certification.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdate("certification", null);
                  }}
                  className="rounded-full bg-red-500 p-1 text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <>
                <Upload className="h-5 w-5 text-muted-foreground" />
                <p className="mt-1 text-xs text-muted-foreground">
                  {t("register.step3.certUpload")}
                </p>
              </>
            )}
          </div>
          <input
            ref={certRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onFileUpload("certification", file, certRef);
            }}
          />
        </div>

        <div className="mt-6 flex gap-3">
          <Button type="button" variant="outline" onClick={onBack} className="flex-1">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("common.back")}
          </Button>
          <Button type="button" onClick={onNext} className="flex-1 bg-[#2D7A5F] hover:bg-[#236B4F]">
            {t("common.continue")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function Step4Form({
  form,
  errors,
  loading,
  onUpdate,
  onFileUpload,
  frontDocRef,
  backDocRef,
  onSubmit,
  onBack,
}: {
  form: FormData;
  errors: FormErrors;
  loading: boolean;
  onUpdate: (key: keyof FormData, value: string) => void;
  onFileUpload: (key: keyof FormData, file: File, ref: React.RefObject<HTMLInputElement>) => void;
  frontDocRef: React.RefObject<HTMLInputElement>;
  backDocRef: React.RefObject<HTMLInputElement>;
  onSubmit: () => void;
  onBack: () => void;
}) {
  const { t } = useI18n();
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h2 className="text-2xl font-bold">{t("register.step4.title")}</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {t("register.step4.subtitle")}
      </p>

      <div className="mt-6 space-y-6">
        <div>
          <Label>{t("register.step4.residencePermit")}</Label>
          <div className="mt-3 grid grid-cols-2 gap-4">
            <div>
              <p className="mb-2 text-xs text-muted-foreground">{t("register.step4.frontSide")}</p>
              <div
                onClick={() => frontDocRef.current?.click()}
                className={`flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed ${
                  errors.residencePermitFront ? "border-red-500" : "border-border"
                } bg-muted/50 hover:border-[#2D7A5F]`}
              >
                {form.residencePermitFront ? (
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(form.residencePermitFront)}
                      alt="Front"
                      className="h-24 rounded object-cover"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdate("residencePermitFront", null);
                      }}
                      className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <p className="mt-2 text-xs text-muted-foreground">{t("register.step4.front")}</p>
                  </>
                )}
              </div>
              <input
                ref={frontDocRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onFileUpload("residencePermitFront", file, frontDocRef);
                }}
              />
            </div>
            <div>
              <p className="mb-2 text-xs text-muted-foreground">{t("register.step4.backSide")}</p>
              <div
                onClick={() => backDocRef.current?.click()}
                className={`flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed ${
                  errors.residencePermitBack ? "border-red-500" : "border-border"
                } bg-muted/50 hover:border-[#2D7A5F]`}
              >
                {form.residencePermitBack ? (
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(form.residencePermitBack)}
                      alt="Back"
                      className="h-24 rounded object-cover"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdate("residencePermitBack", null);
                      }}
                      className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <p className="mt-2 text-xs text-muted-foreground">{t("register.step4.back")}</p>
                  </>
                )}
              </div>
              <input
                ref={backDocRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onFileUpload("residencePermitBack", file, backDocRef);
                }}
              />
            </div>
          </div>
          {(errors.residencePermitFront || errors.residencePermitBack) && (
            <p className="mt-2 text-xs text-red-500">
              {errors.residencePermitFront || errors.residencePermitBack}
            </p>
          )}
        </div>

        <div className="rounded-lg border border-[#2D7A5F]/20 bg-[#2D7A5F]/5 p-4">
          <div className="flex items-start gap-3">
            <QrCode className="h-5 w-5 text-[#2D7A5F]" />
            <div>
              <p className="font-medium">{t("register.step4.faceVerify")}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t("register.step4.faceVerifyDesc")}
              </p>
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            <QRCodeSVG
              value="skillbuddy://face-verify"
              size={140}
              className="rounded-lg bg-white p-2"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="phone">{t("register.step4.phone")}</Label>
          <div className="relative mt-1.5">
            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(e) => onUpdate("phone", e.target.value)}
              placeholder="+372 5555 5555"
              className={`h-11 pl-10 ${errors.phone ? "border-red-500" : ""}`}
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
          )}
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onBack} className="flex-1">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("common.back")}
          </Button>
          <Button
            type="button"
            onClick={onSubmit}
            disabled={loading}
            className="flex-1 bg-[#2D7A5F] hover:bg-[#236B4F]"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {t("register.step4.submit")}
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
