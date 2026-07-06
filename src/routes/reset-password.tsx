"use client";

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, Loader as Loader2, Lock, CircleCheck as CheckCircle2 } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { extractErrorMessage } from "@/lib/api-client";
import { z } from "zod";

/**
 * Password reset page — reads `token` from URL query param (link from backend email).
 *
 * ⚠️  FLAG FOR BACKEND TEAM: Swagger shows both GET and POST at /reset-password?token=.
 *     Confirm whether the GET is needed to pre-validate the token before showing the form,
 *     or if the POST alone is sufficient. Current implementation calls POST directly.
 */

const searchSchema = z.object({
  token: z.string().optional(),
});

export const Route = createFileRoute("/reset-password")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Reset Password — SkillBuddy" },
      { name: "description", content: "Set a new password for your SkillBuddy account." },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { token } = Route.useSearch();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string; general?: string }>({});

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { label: "", color: "bg-muted", width: "0%" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^a-zA-Z\d]/.test(pwd)) score++;
    if (score <= 2) return { label: t("auth.reset.weak"), color: "bg-red-500", width: "25%" };
    if (score === 3) return { label: t("auth.reset.fair"), color: "bg-yellow-500", width: "50%" };
    if (score === 4) return { label: t("auth.reset.good"), color: "bg-blue-500", width: "75%" };
    return { label: t("auth.reset.strong"), color: "bg-green-500", width: "100%" };
  };

  const strength = getPasswordStrength(password);

  const validate = () => {
    const errs: typeof errors = {};
    if (!password) errs.password = t("auth.validation.passwordRequired");
    else if (password.length < 8) errs.password = t("auth.validation.passwordMinLength");
    if (password !== confirmPassword) errs.confirmPassword = t("auth.validation.passwordMismatch");
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (!token) {
      setErrors({ general: "No reset token found in URL. Please use the link from your email." });
      return;
    }

    setLoading(true);

    try {
      const baseUrl = (import.meta.env.VITE_API_BASE_URL as string) ?? "";
      const res = await fetch(
        `${baseUrl}/api/v1/users/reset-password?token=${encodeURIComponent(token)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            new_password: password,
            confirm_password: confirmPassword,
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const msg = extractErrorMessage(data, "Failed to reset password. The link may have expired.");
        setErrors({ general: msg });
        setLoading(false);
        return;
      }

      setSuccess(true);
      toast.success(t("auth.reset.success"));
      setTimeout(() => navigate({ to: "/auth/login" }), 2500);
    } catch (err) {
      toast.error(extractErrorMessage(err, "Failed to reset password."));
    } finally {
      setLoading(false);
    }
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
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">{t("auth.reset.success")}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{t("auth.reset.successSubtitle")}</p>
          </motion.div>
        </div>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <div className="mx-auto flex min-h-[80vh] max-w-md flex-col items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full rounded-2xl border border-border bg-card p-8 shadow-lg"
        >
          <h1 className="text-2xl font-bold">{t("auth.reset.title")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("auth.reset.subtitle")}</p>

          {errors.general && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 p-3 text-sm text-red-600 dark:text-red-400">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="password">{t("auth.reset.newPassword")}</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors((err) => ({ ...err, password: undefined })); }}
                  placeholder="Min. 8 characters"
                  className={`h-11 pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{t("auth.reset.passwordStrength")}</span>
                    <span className={`font-medium ${strength.color.replace("bg-", "text-")}`}>{strength.label}</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div className={`h-full rounded-full transition-all ${strength.color}`} style={{ width: strength.width }} />
                  </div>
                </div>
              )}
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            <div>
              <Label htmlFor="confirmPassword">{t("auth.reset.confirmPassword")}</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setErrors((err) => ({ ...err, confirmPassword: undefined })); }}
                  placeholder={t("auth.reset.confirmPassword")}
                  className={`h-11 pl-10 pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
            </div>

            <Button type="submit" disabled={loading} className="h-11 w-full">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("auth.reset.submit")}
            </Button>
          </form>

          <div className="mt-6">
            <Link to="/auth/login" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              {t("auth.forgot.backToLogin")}
            </Link>
          </div>
        </motion.div>
      </div>
    </SiteShell>
  );
}
