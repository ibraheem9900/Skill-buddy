"use client";

import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import {
  CircleCheck as CheckCircle2,
  XCircle,
  Loader as Loader2,
  Mail,
  ArrowLeft,
  Shield,
  CheckCircle,
  Clock,
  RefreshCw,
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
  email: z.string().optional(),
});

export const Route = createFileRoute("/verify-email")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Verify Email — SkillBuddy" },
      { name: "description", content: "Verify your SkillBuddy email address." },
    ],
  }),
  component: VerifyEmailPage,
});

const RESEND_COOLDOWN_SECONDS = 60;

function VerifyEmailPage() {
  const { token, email: emailFromUrl } = Route.useSearch();
  const navigate = useNavigate();

  const [status, setStatus] = useState<
    "pending" | "success" | "error" | "no-token" | "resending"
  >(token ? "pending" : "no-token");
  const [errorMessage, setErrorMessage] = useState("");
  const [displayEmail, setDisplayEmail] = useState(emailFromUrl ?? "");
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start cooldown timer
  const startCooldown = useCallback(() => {
    setCooldown(RESEND_COOLDOWN_SECONDS);
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

  // Cleanup cooldown on unmount
  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  // Auto-verify if token is in URL
  useEffect(() => {
    if (!token) return;

    const verify = async () => {
      try {
        const baseUrl = (import.meta.env.VITE_API_BASE_URL as string) ?? "";
        const res = await fetch(`${baseUrl}/api/v1/auth/verify-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (!res.ok) {
          let msg = "Invalid or expired verification link.";
          try {
            const data = await res.json();
            if (typeof data.detail === "string") msg = data.detail;
            else if (typeof data.message === "string") msg = data.message;
            else if (Array.isArray(data.detail) && data.detail.length > 0) {
              msg = data.detail[0]?.msg ?? msg;
            }
          } catch {}
          setErrorMessage(msg);
          setStatus("error");
          return;
        }
        setStatus("success");
      } catch {
        setErrorMessage("Could not reach the server. Please try again.");
        setStatus("error");
      }
    };

    verify();
  }, [token]);

  // Resend verification email
  const handleResend = async () => {
    if (cooldown > 0 || !displayEmail) return;

    setStatus("resending");
    try {
      const baseUrl = (import.meta.env.VITE_API_BASE_URL as string) ?? "";
      const res = await fetch(`${baseUrl}/api/v1/auth/resend-verify_email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: displayEmail }),
      });

      if (!res.ok) {
        let msg = "Failed to resend verification email.";
        try {
          const data = await res.json();
          if (typeof data.detail === "string") msg = data.detail;
          else if (typeof data.message === "string") msg = data.message;
          else if (Array.isArray(data.detail) && data.detail.length > 0) {
            msg = data.detail[0]?.msg ?? msg;
          }
        } catch {}
        toast.error(msg);
        setStatus("no-token");
        return;
      }

      toast.success("Verification email sent! Check your inbox.");
      startCooldown();
      setStatus("no-token");
    } catch {
      toast.error("Could not reach the server. Please try again.");
      setStatus("no-token");
    }
  };

  return (
    <SiteShell>
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:items-center">
        {/* ─── LEFT: Branded content (matches login/signup layout) ─── */}
        <div className="hidden lg:block">
          <Logo />
          <h1 className="mt-8 font-display text-4xl font-extrabold leading-tight">
            Secure Your Account
          </h1>
          <p className="mt-4 text-muted-foreground">
            Verifying your email keeps your SkillBuddy account safe and unlocks
            full access to book services and connect with trusted professionals
            across the Baltics.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Keep your account secure with verified identity
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              Unlock full access to all SkillBuddy features
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              Receive important booking and service updates
            </li>
            <li className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Get started in just one click
            </li>
          </ul>
        </div>

        {/* ─── RIGHT: Verification card ─── */}
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
            className="text-center"
          >
            {/* ─── Pending: verifying token ─── */}
            {status === "pending" && (
              <>
                <Loader2 className="mx-auto h-14 w-14 animate-spin text-primary" />
                <h2 className="mt-4 text-2xl font-extrabold">Verifying your email…</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Please wait a moment while we confirm your address.
                </p>
              </>
            )}

            {/* ─── Success: email verified ─── */}
            {status === "success" && (
              <>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/20">
                  <CheckCircle2 className="h-9 w-9 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-2xl font-extrabold">Email verified!</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your account is now active. You can log in and start using SkillBuddy.
                </p>
                <Button
                  asChild
                  className="mt-6 h-11 w-full shadow-elegant"
                >
                  <Link to="/auth/login">Go to Login</Link>
                </Button>
              </>
            )}

            {/* ─── Error: verification failed ─── */}
            {status === "error" && (
              <>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                  <XCircle className="h-9 w-9 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-2xl font-extrabold">Verification failed</h2>
                <p className="mt-2 text-sm text-muted-foreground">{errorMessage}</p>

                <div className="mt-6 space-y-3">
                  {!displayEmail && (
                    <div>
                      <Label htmlFor="resend-email-error">Email address</Label>
                      <Input
                        id="resend-email-error"
                        type="email"
                        value={displayEmail}
                        onChange={(e) => setDisplayEmail(e.target.value)}
                        placeholder="you@email.com"
                        className="mt-1.5 h-11"
                      />
                    </div>
                  )}
                  <Button
                    onClick={handleResend}
                    disabled={cooldown > 0 || !displayEmail}
                    variant="outline"
                    className="h-11 w-full gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    {cooldown > 0
                      ? `Resend in ${cooldown}s`
                      : "Resend verification email"}
                  </Button>
                  <Button asChild variant="outline" className="h-11 w-full">
                    <Link to="/auth/login">Back to Login</Link>
                  </Button>
                </div>
              </>
            )}

            {/* ─── No token: waiting for user to click email link ─── */}
            {status === "no-token" && (
              <>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-extrabold">Verify your email</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {displayEmail ? (
                    <>
                      We've sent a verification link to{" "}
                      <strong className="text-foreground">{displayEmail}</strong>.
                      Click the link in your email, then come back here.
                    </>
                  ) : (
                    <>
                      We've sent a verification link to your email. Click the
                      link in your email to activate your account.
                    </>
                  )}
                </p>

                <div className="mt-6 space-y-3">
                  {!displayEmail && (
                    <div>
                      <Label htmlFor="resend-email">Email address</Label>
                      <Input
                        id="resend-email"
                        type="email"
                        value={displayEmail}
                        onChange={(e) => setDisplayEmail(e.target.value)}
                        placeholder="you@email.com"
                        className="mt-1.5 h-11"
                      />
                    </div>
                  )}
                  <Button
                    onClick={handleResend}
                    disabled={cooldown > 0 || !displayEmail}
                    variant="outline"
                    className="h-11 w-full gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    {cooldown > 0
                      ? `Resend in ${cooldown}s`
                      : "Resend verification email"}
                  </Button>
                  {cooldown > 0 && (
                    <p className="text-xs text-muted-foreground">
                      You can request another email in {cooldown} seconds.
                    </p>
                  )}
                  <Button asChild variant="outline" className="h-11 w-full">
                    <Link to="/auth/login">Back to Login</Link>
                  </Button>
                </div>
              </>
            )}

            {/* ─── Resending in progress ─── */}
            {status === "resending" && (
              <>
                <Loader2 className="mx-auto h-14 w-14 animate-spin text-primary" />
                <h2 className="mt-4 text-2xl font-extrabold">Sending email…</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Please wait while we resend your verification email.
                </p>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </SiteShell>
  );
}
