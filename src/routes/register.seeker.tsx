"use client";

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, CircleCheck as CheckCircle2, Upload, X, Loader as Loader2, Eye, EyeOff, User, Mail, Lock, MapPin, Phone, Building, QrCode } from "lucide-react";
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

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  );
}

async function handleOAuth(provider: "google" | "apple") {
  sessionStorage.setItem("oauth_register_flow", "seeker");
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  });
  if (error) {
    sessionStorage.removeItem("oauth_register_flow");
    const { toast } = await import("sonner");
    toast.error(error.message);
  }
}

export const Route = createFileRoute("/register/seeker")({
  head: () => ({
    meta: [
      { title: "Register as Client — SkillBuddy" },
      { name: "description", content: "Create your client account on SkillBuddy." },
    ],
  }),
  component: ClientRegisterPage,
});

const TOTAL_STEPS = 3;

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
  residencePermitFront: File | null;
  residencePermitBack: File | null;
  phone: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

function ClientRegisterPage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);

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
    residencePermitFront: null,
    residencePermitBack: null,
    phone: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const avatarRef = useRef<HTMLInputElement>(null);
  const frontDocRef = useRef<HTMLInputElement>(null);
  const backDocRef = useRef<HTMLInputElement>(null);

  // Detect return from OAuth and jump to step 2 with pre-filled data
  useEffect(() => {
    const flow = sessionStorage.getItem("oauth_register_flow");
    if (flow === "seeker" && user) {
      sessionStorage.removeItem("oauth_register_flow");
      const name = (user.user_metadata?.full_name as string) || (user.user_metadata?.name as string) || "";
      setForm((f) => ({
        ...f,
        email: user.email ?? f.email,
        fullName: name,
      }));
      setStep(2);
    }
  }, [user]);

  const update = (key: keyof FormData, value: string | File | null) =>
    setForm((f) => ({ ...f, [key]: value }));

  const validateStep1 = (): boolean => {
    const errs: FormErrors = {};
    if (!form.username.trim()) errs.username = t("auth.validation.usernameRequired");
    else if (form.username.length < 3) errs.username = t("auth.validation.usernameMinLength");
    if (!form.email.trim()) errs.email = t("auth.validation.emailRequired");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = t("auth.validation.emailInvalid");
    if (!form.password) errs.password = t("auth.validation.passwordRequired");
    else if (form.password.length < 8) errs.password = t("auth.validation.passwordMinLength");
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password))
      errs.password = t("auth.validation.passwordComplexity");
    if (form.password !== form.confirmPassword)
      errs.confirmPassword = t("auth.validation.passwordMismatch");
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errs: FormErrors = {};
    if (!form.fullName.trim()) errs.fullName = t("auth.validation.fullNameRequired");
    if (!form.county) errs.county = t("auth.validation.countyRequired");
    if (!form.city.trim()) errs.city = t("auth.validation.cityRequired");
    if (!form.postalCode.trim()) errs.postalCode = t("auth.validation.postalRequired");
    if (!form.streetAddress.trim()) errs.streetAddress = t("auth.validation.streetRequired");
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = (): boolean => {
    const errs: FormErrors = {};
    if (!form.residencePermitFront) errs.residencePermitFront = t("auth.validation.docFrontRequired");
    if (!form.residencePermitBack) errs.residencePermitBack = t("auth.validation.docBackRequired");
    if (!form.phone.trim()) errs.phone = t("auth.validation.phoneRequired");
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSendOtp = async () => {
    if (!validateStep1()) return;
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          username: form.username,
          role: "client",
        },
      },
    });

    setLoading(false);

    if (error) {
      if (error.message.toLowerCase().includes("already registered") || error.message.toLowerCase().includes("user already registered")) {
        toast.error("This email is already registered. Please log in instead.");
      } else {
        toast.error(error.message);
      }
      return;
    }

    // If session is immediately returned, the project has "Confirm email" disabled
    // Skip OTP and proceed directly
    if (data.session) {
      toast.success("Account created! Continuing…");
      setStep(2);
      return;
    }

    setOtpSent(true);
    toast.success("Verification email sent! Check your inbox (and spam folder).");
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

  const handleResendOtp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: form.email,
    });
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

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
    }
  };

  const handleSubmit = async () => {
    if (!validateStep3()) return;
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
        role: "client",
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

      toast.success(t("register.step4.success"));
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
      setErrors((e) => ({ ...e, [key]: t("auth.validation.fileSizeLimit") }));
      return;
    }
    setErrors((e) => ({ ...e, [key]: undefined }));
    update(key, file);
  };

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
                onResendOtp={handleResendOtp}
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
                loading={loading}
                onUpdate={update}
                onFileUpload={handleFileUpload}
                frontDocRef={frontDocRef}
                backDocRef={backDocRef}
                onSubmit={handleSubmit}
                onBack={() => setStep(2)}
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
                  ? "border-primary bg-primary text-primary-foreground"
                  : i + 1 === currentStep
                    ? "border-primary bg-primary/10 text-primary"
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
                  i + 1 < currentStep ? "bg-primary" : "bg-border"
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>{t("register.step.account")}</span>
        <span>{t("register.step.profile")}</span>
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
  onResendOtp,
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
  onResendOtp: () => void;
}) {
  const { t } = useI18n();
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h2 className="text-2xl font-bold">{t("register.step1.title")}</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {t("register.haveAccount")}{" "}
        <Link to="/auth/login" className="text-primary hover:underline">
          {t("auth.signin")}
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
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-2">
            <Label htmlFor="otp">Enter the 6-digit code</Label>
            <p className="text-xs text-muted-foreground">
              We sent a verification code to <strong>{form.email}</strong>.<br />
              Open the email and enter the 6-digit code below.
            </p>
            <Input
              id="otp"
              value={otp}
              onChange={(e) => onOtpChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              className="h-12 text-center text-2xl tracking-widest"
            />
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                disabled={resendCountdown > 0}
                onClick={onResendOtp}
                className="text-xs text-primary disabled:opacity-50 hover:underline"
              >
                {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : "Resend code"}
              </button>
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 rounded p-2">
              ⚠ No email? Check your <strong>spam / junk folder</strong>. The email comes from Supabase and may take 1–2 minutes.
            </p>
          </div>
        )}

        <Button
          type="button"
          onClick={onNext}
          disabled={loading}
          className="mt-6 h-11 w-full"
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
          <Button variant="outline" type="button" className="h-11 gap-2" onClick={() => handleOAuth("google")}>
            <GoogleIcon />
            {t("register.step1.oauthGoogle")}
          </Button>
          <Button variant="outline" type="button" className="h-11 gap-2" onClick={() => handleOAuth("apple")}>
            <AppleIcon />
            {t("register.step1.oauthApple")}
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
              className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-border bg-muted/50 hover:border-primary"
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
          <Button type="button" onClick={onNext} className="flex-1">
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
                } bg-muted/50 hover:border-primary`}
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
                } bg-muted/50 hover:border-primary`}
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

        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-start gap-3">
            <QrCode className="h-5 w-5 text-primary" />
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
            className="flex-1"
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
