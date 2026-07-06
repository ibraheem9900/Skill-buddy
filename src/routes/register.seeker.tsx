"use client";

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, User, Mail, Lock, Loader as Loader2, CircleCheck as CheckCircle2, CreditCard } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { extractFieldErrors, extractErrorMessage } from "@/lib/api-client";

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

export const Route = createFileRoute("/register/seeker")({
  head: () => ({
    meta: [
      { title: "Register as Client — SkillBuddy" },
      { name: "description", content: "Create your client account on SkillBuddy." },
    ],
  }),
  component: ClientRegisterPage,
});

type FormData = {
  first_name: string;
  last_name: string;
  email: string;
  personal_code: string;
  password: string;
  confirmPassword: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

function ClientRegisterPage() {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [form, setForm] = useState<FormData>({
    first_name: "",
    last_name: "",
    email: "",
    personal_code: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const update = (key: keyof FormData, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.first_name.trim()) errs.first_name = "First name is required.";
    if (!form.last_name.trim()) errs.last_name = "Last name is required.";
    if (!form.email.trim()) errs.email = t("auth.validation.emailRequired");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = t("auth.validation.emailInvalid");
    if (!form.personal_code.trim()) errs.personal_code = "Personal ID code is required.";
    if (!form.password) errs.password = t("auth.validation.passwordRequired");
    else if (form.password.length < 8) errs.password = t("auth.validation.passwordMinLength");
    if (form.password !== form.confirmPassword)
      errs.confirmPassword = t("auth.validation.passwordMismatch");
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      const baseUrl = (import.meta.env.VITE_API_BASE_URL as string) ?? "";
      const res = await fetch(`${baseUrl}/api/v1/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          personal_code: form.personal_code,
          password: form.password,
          confirm_password: form.confirmPassword,
          first_name: form.first_name,
          last_name: form.last_name,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        // Map 422 field-level errors back to form fields
        const fieldErrs = extractFieldErrors(data);
        if (Object.keys(fieldErrs).length > 0) {
          setErrors(fieldErrs as FormErrors);
        } else {
          const msg = extractErrorMessage(data, "Account creation failed.");
          if (msg.toLowerCase().includes("already")) {
            setErrors({ email: "This email is already registered. Please log in." });
          } else {
            toast.error(msg);
          }
        }
        setLoading(false);
        return;
      }

      // Only set the pending role once signup succeeds — prevents stale role from
      // leaking into an unrelated future login if the user abandons this flow.
      sessionStorage.setItem("pending_role", "CLIENT");
      setSubmittedEmail(form.email);
      setSuccess(true);
    } catch (err) {
      toast.error(extractErrorMessage(err, "Account creation failed."));
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = (provider: "google" | "apple") => {
    sessionStorage.setItem("pending_role", "CLIENT");
    const baseUrl = (import.meta.env.VITE_API_BASE_URL as string) ?? "";
    window.location.href = `${baseUrl}/api/v1/users/login/${provider}`;
  };

  if (success) {
    return (
      <SiteShell>
        <div className="mx-auto flex min-h-[80vh] max-w-md flex-col items-center justify-center px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full rounded-2xl border border-border bg-card p-8 shadow-lg text-center"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/20">
              <CheckCircle2 className="h-9 w-9 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold">Account created!</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              We sent a verification link to <strong className="text-foreground">{submittedEmail}</strong>.
              Click it to activate your account.
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              Once verified, log in to complete your profile.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Button asChild className="w-full">
                <Link to="/auth/login">Go to Login</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/verify-email">Verify email</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <div className="mx-auto max-w-lg px-4 py-8 sm:px-6 lg:py-12">
        <Link
          to="/register"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("register.backToRole")}
        </Link>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-lg sm:p-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-2xl font-bold">{t("register.step1.title")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("register.haveAccount")}{" "}
              <Link to="/auth/login" className="text-primary hover:underline">
                {t("auth.signin")}
              </Link>
            </p>

            <div className="mt-6 space-y-4">
              {/* Name row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name</Label>
                  <div className="relative mt-1.5">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="first_name"
                      value={form.first_name}
                      onChange={(e) => { update("first_name", e.target.value); setErrors((err) => ({ ...err, first_name: undefined })); }}
                      placeholder="John"
                      className={`h-11 pl-10 ${errors.first_name ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.first_name && <p className="mt-1 text-xs text-red-500">{errors.first_name}</p>}
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name</Label>
                  <div className="relative mt-1.5">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="last_name"
                      value={form.last_name}
                      onChange={(e) => { update("last_name", e.target.value); setErrors((err) => ({ ...err, last_name: undefined })); }}
                      placeholder="Doe"
                      className={`h-11 pl-10 ${errors.last_name ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.last_name && <p className="mt-1 text-xs text-red-500">{errors.last_name}</p>}
                </div>
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">{t("register.step1.email")}</Label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => { update("email", e.target.value); setErrors((err) => ({ ...err, email: undefined })); }}
                    placeholder="you@email.com"
                    className={`h-11 pl-10 ${errors.email ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>

              {/* Personal ID code */}
              <div>
                <Label htmlFor="personal_code">Personal ID Code</Label>
                <div className="relative mt-1.5">
                  <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="personal_code"
                    value={form.personal_code}
                    onChange={(e) => { update("personal_code", e.target.value); setErrors((err) => ({ ...err, personal_code: undefined })); }}
                    placeholder="e.g. 39001011234"
                    className={`h-11 pl-10 ${errors.personal_code ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.personal_code && <p className="mt-1 text-xs text-red-500">{errors.personal_code}</p>}
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password">{t("register.step1.password")}</Label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => { update("password", e.target.value); setErrors((err) => ({ ...err, password: undefined })); }}
                    placeholder="Min. 8 characters"
                    className={`h-11 pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
              </div>

              {/* Confirm password */}
              <div>
                <Label htmlFor="confirmPassword">{t("register.step1.confirmPassword")}</Label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={(e) => { update("confirmPassword", e.target.value); setErrors((err) => ({ ...err, confirmPassword: undefined })); }}
                    placeholder="Confirm your password"
                    className={`h-11 pl-10 pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
              </div>

              <Button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="mt-2 h-11 w-full"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>Create Account <ArrowRight className="ml-2 h-4 w-4" /></>
                )}
              </Button>

              <div className="relative my-4 flex items-center gap-2 text-xs text-muted-foreground">
                <div className="h-px flex-1 bg-border" />
                {t("common.orContinueWith")}
                <div className="h-px flex-1 bg-border" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" type="button" className="h-11 gap-2" onClick={() => handleOAuth("google")}>
                  <GoogleIcon /> {t("register.step1.oauthGoogle")}
                </Button>
                <Button variant="outline" type="button" className="h-11 gap-2" onClick={() => handleOAuth("apple")}>
                  <AppleIcon /> {t("register.step1.oauthApple")}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center mt-2">
                By creating an account you agree to our{" "}
                <Link to="/terms" className="text-primary hover:underline">Terms</Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </SiteShell>
  );
}
