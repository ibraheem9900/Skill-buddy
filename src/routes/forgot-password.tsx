"use client";

import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Mail,
  Loader as Loader2,
  CircleCheck as CheckCircle2,
  Shield,
  KeyRound,
  Lock,
} from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot Password — SkillBuddy" },
      { name: "description", content: "Reset your SkillBuddy password." },
    ],
  }),
  component: ForgotPasswordPage,
});

const COOLDOWN_SECONDS = 60;

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCooldown = useCallback(() => {
    setCooldown(COOLDOWN_SECONDS);
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (cooldownRef.current) clearInterval(cooldownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const baseUrl = (import.meta.env.VITE_API_BASE_URL as string) ?? "";
      const res = await fetch(`${baseUrl}/api/v1/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        let msg = "Failed to send reset email.";
        try {
          const data = await res.json();
          if (typeof data.detail === "string") msg = data.detail;
          else if (typeof data.message === "string") msg = data.message;
          else if (Array.isArray(data.detail) && data.detail.length > 0) {
            msg = data.detail[0]?.msg ?? msg;
          }
        } catch {}
        toast.error(msg);
        setLoading(false);
        return;
      }

      setSent(true);
      startCooldown();
    } catch {
      toast.error("Could not reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteShell>
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:items-center">
        {/* ─── LEFT: Branded content (matches login/signup/verify-email layout) ─── */}
        <div className="hidden lg:block">
          <Logo />
          <h1 className="mt-8 font-display text-4xl font-extrabold leading-tight">
            Forgot your password?
          </h1>
          <p className="mt-4 text-muted-foreground">
            No worries, it happens to everyone. Enter your email and we'll send
            you a link to reset your password so you can get back to using
            SkillBuddy.
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
              <Lock className="h-4 w-4 text-primary" />
              Keep your password private — never share it with anyone
            </li>
          </ul>
        </div>

        {/* ─── RIGHT: Form card ─── */}
        <div className="mx-auto w-full max-w-md rounded-3xl border border-border bg-card p-7 shadow-elegant">
          <div className="lg:hidden mb-6">
            <Logo />
          </div>

          <Link
            to="/auth/login"
            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {sent ? (
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/20">
                  <CheckCircle2 className="h-9 w-9 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-2xl font-extrabold">Check your email</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  If an account exists with this email, a password reset link has
                  been sent.
                </p>
                <p className="mt-1 font-medium text-foreground">{email}</p>
                <p className="mt-3 text-xs text-muted-foreground">
                  Didn't receive it? Check your spam folder or try again{" "}
                  {cooldown > 0 ? `in ${cooldown}s` : "below"}.
                </p>
                <div className="mt-6 space-y-3">
                  <Button
                    onClick={() => {
                      setSent(false);
                      if (cooldown > 0) return;
                      setEmail("");
                    }}
                    disabled={cooldown > 0}
                    variant="outline"
                    className="h-11 w-full"
                  >
                    {cooldown > 0 ? `Resend in ${cooldown}s` : "Send another link"}
                  </Button>
                  <Button asChild className="h-11 w-full shadow-elegant">
                    <Link to="/auth/login">Go to Login</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-extrabold">Reset your password</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Enter the email address associated with your account and we'll
                  send you a link to reset your password.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <Label htmlFor="email">Email address</Label>
                    <div className="relative mt-1.5">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError("");
                        }}
                        placeholder="you@email.com"
                        className={`h-11 pl-10 ${error ? "border-red-500" : ""}`}
                      />
                    </div>
                    {error && (
                      <p className="mt-1 text-xs text-red-500">{error}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-11 w-full shadow-elegant"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Send Reset Link"
                    )}
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
              </>
            )}
          </motion.div>
        </div>
      </div>
    </SiteShell>
  );
}
