"use client";

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader as Loader2,
  Lock,
  CircleCheck as CheckCircle2,
  XCircle,
  Shield,
  KeyRound,
  AlertTriangle,
} from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";
import { toast } from "sonner";
import { z } from "zod";

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
  const { token } = Route.useSearch();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { label: "", color: "bg-muted", width: "0%" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^a-zA-Z\d]/.test(pwd)) score++;
    if (score <= 2) return { label: "Weak", color: "bg-red-500", width: "25%" };
    if (score === 3) return { label: "Fair", color: "bg-yellow-500", width: "50%" };
    if (score === 4) return { label: "Good", color: "bg-blue-500", width: "75%" };
    return { label: "Strong", color: "bg-green-500", width: "100%" };
  };

  const strength = getPasswordStrength(password);

  const validate = () => {
    const errs: typeof errors = {};
    if (!password) errs.password = "Password is required.";
    else if (password.length < 8) errs.password = "Password must be at least 8 characters.";
    if (password !== confirmPassword) errs.confirmPassword = "Passwords do not match.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (!token) {
      setErrors({ general: "No reset token found. Please use the link from your email." });
      return;
    }

    setLoading(true);

    try {
      const baseUrl = (import.meta.env.VITE_API_BASE_URL as string) ?? "";
      const res = await fetch(`${baseUrl}/api/v1/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password,
          confirm_password: confirmPassword,
        }),
      });

      if (!res.ok) {
        let msg = "Failed to reset password. The link may have expired.";
        try {
          const data = await res.json();
          if (typeof data.detail === "string") msg = data.detail;
          else if (typeof data.message === "string") msg = data.message;
          else if (Array.isArray(data.detail) && data.detail.length > 0) {
            msg = data.detail[0]?.msg ?? msg;
          }
        } catch {}
        setErrors({ general: msg });
        setLoading(false);
        return;
      }

      setSuccess(true);
      toast.success("Password reset successfully!");
    } catch {
      toast.error("Could not reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // No token in URL — show error state
  if (!token && !success) {
    return (
      <SiteShell>
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:items-center">
          <div className="hidden lg:block">
            <Logo />
            <h1 className="mt-8 font-display text-4xl font-extrabold leading-tight">
              Invalid Reset Link
            </h1>
            <p className="mt-4 text-muted-foreground">
              This password reset link is invalid or missing. Please request a new
              one from the Forgot Password page.
            </p>
          </div>

          <div className="mx-auto w-full max-w-md rounded-3xl border border-border bg-card p-7 shadow-elegant">
            <div className="lg:hidden mb-6">
              <Logo />
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                <XCircle className="h-9 w-9 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-2xl font-extrabold">Invalid Reset Link</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                This password reset link is invalid or missing. Please request a
                new one.
              </p>
              <Button asChild className="mt-6 h-11 w-full shadow-elegant">
                <Link to="/forgot-password">Request New Reset Link</Link>
              </Button>
              <Button asChild variant="outline" className="mt-3 h-11 w-full">
                <Link to="/auth/login">Back to Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </SiteShell>
    );
  }

  // Success state
  if (success) {
    return (
      <SiteShell>
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:items-center">
          <div className="hidden lg:block">
            <Logo />
            <h1 className="mt-8 font-display text-4xl font-extrabold leading-tight">
              Password Reset Complete
            </h1>
            <p className="mt-4 text-muted-foreground">
              Your password has been updated successfully. You can now log in to
              your SkillBuddy account with your new password.
            </p>
          </div>

          <div className="mx-auto w-full max-w-md rounded-3xl border border-border bg-card p-7 shadow-elegant">
            <div className="lg:hidden mb-6">
              <Logo />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/20">
                <CheckCircle2 className="h-9 w-9 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-2xl font-extrabold">Password reset successfully!</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Your password has been updated. You'll be redirected to login in a
                moment.
              </p>
              <Button
                asChild
                className="mt-6 h-11 w-full shadow-elegant"
                onClick={() => navigate({ to: "/auth/login" })}
              >
                <Link to="/auth/login">Go to Login</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </SiteShell>
    );
  }

  // Main form state
  return (
    <SiteShell>
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:items-center">
        {/* ─── LEFT: Branded content ─── */}
        <div className="hidden lg:block">
          <Logo />
          <h1 className="mt-8 font-display text-4xl font-extrabold leading-tight">
            Create a new password
          </h1>
          <p className="mt-4 text-muted-foreground">
            Choose a strong password to keep your account secure. Make sure it's
            something only you would know.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Use at least 8 characters with letters, numbers, and symbols
            </li>
            <li className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-primary" />
              Avoid reusing passwords from other sites
            </li>
            <li className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-primary" />
              Never share your password with anyone
            </li>
          </ul>
        </div>

        {/* ─── RIGHT: Form card ─── */}
        <div className="mx-auto w-full max-w-md rounded-3xl border border-border bg-card p-7 shadow-elegant">
          <div className="lg:hidden mb-6">
            <Logo />
          </div>

          <Link
            to="/forgot-password"
            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Forgot Password
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-extrabold">Reset your password</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter your new password below. Make sure it's at least 8
              characters.
            </p>

            {errors.general && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 p-3 text-sm text-red-600 dark:text-red-400">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="password">New Password</Label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors((err) => ({ ...err, password: undefined }));
                    }}
                    placeholder="Min. 8 characters"
                    className={`h-11 pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Password strength</span>
                      <span className={`font-medium ${strength.color.replace("bg-", "text-")}`}>
                        {strength.label}
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full transition-all ${strength.color}`}
                        style={{ width: strength.width }}
                      />
                    </div>
                  </div>
                )}
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setErrors((err) => ({ ...err, confirmPassword: undefined }));
                    }}
                    placeholder="Confirm your password"
                    className={`h-11 pl-10 pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="mt-2 h-11 w-full shadow-elegant"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reset Password"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/auth/login"
                className="text-sm text-primary hover:underline"
              >
                Remember your password? Log In
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </SiteShell>
  );
}
