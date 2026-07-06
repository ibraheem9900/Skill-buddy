"use client";

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CircleCheck as CheckCircle2, XCircle, Loader as Loader2, Mail } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { z } from "zod";

const searchSchema = z.object({
  token: z.string().optional(),
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

function VerifyEmailPage() {
  const { token } = Route.useSearch();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"pending" | "success" | "error" | "no-token">(
    token ? "pending" : "no-token"
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token) return;

    const verify = async () => {
      try {
        const baseUrl = (import.meta.env.VITE_API_BASE_URL as string) ?? "";
        const res = await fetch(`${baseUrl}/api/v1/users/verify-email?token=${encodeURIComponent(token)}`);
        if (!res.ok) {
          let msg = "Invalid or expired verification link.";
          try {
            const data = await res.json();
            if (typeof data.detail === "string") msg = data.detail;
            else if (typeof data.message === "string") msg = data.message;
          } catch {}
          setErrorMessage(msg);
          setStatus("error");
          return;
        }
        setStatus("success");
        // Auto-redirect to login after 3 s
        setTimeout(() => navigate({ to: "/auth/login" }), 3000);
      } catch {
        setErrorMessage("Could not reach the server. Please try again.");
        setStatus("error");
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <SiteShell>
      <div className="mx-auto flex min-h-[80vh] max-w-md flex-col items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full rounded-2xl border border-border bg-card p-8 shadow-lg text-center"
        >
          {/* Pending */}
          {status === "pending" && (
            <>
              <Loader2 className="mx-auto h-14 w-14 animate-spin text-primary" />
              <h1 className="mt-4 text-2xl font-bold">Verifying your email…</h1>
              <p className="mt-2 text-sm text-muted-foreground">Please wait a moment.</p>
            </>
          )}

          {/* Success */}
          {status === "success" && (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/20">
                <CheckCircle2 className="h-9 w-9 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h1 className="text-2xl font-bold">Email verified!</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Your account has been verified. You'll be redirected to login in a moment.
              </p>
              <Button asChild className="mt-6 w-full">
                <Link to="/auth/login">Go to Login</Link>
              </Button>
            </>
          )}

          {/* Error */}
          {status === "error" && (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                <XCircle className="h-9 w-9 text-red-600 dark:text-red-400" />
              </div>
              <h1 className="text-2xl font-bold">Verification failed</h1>
              <p className="mt-2 text-sm text-muted-foreground">{errorMessage}</p>
              <div className="mt-6 space-y-3">
                {/* NOTE FOR BACKEND TEAM: If a resend-verification endpoint is added,
                    wire it up here so users can request a new link without contacting support. */}
                <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 rounded-lg p-3">
                  If your link expired, please contact{" "}
                  <a href="mailto:support@skillbuddy.com" className="underline">
                    support@skillbuddy.com
                  </a>{" "}
                  to get a new verification link.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/auth/login">Back to Login</Link>
                </Button>
              </div>
            </>
          )}

          {/* No token in URL */}
          {status === "no-token" && (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold">Check your email</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                A verification link was sent to your email. Click it to activate your account.
              </p>
              <Button asChild className="mt-6 w-full">
                <Link to="/auth/login">Back to Login</Link>
              </Button>
            </>
          )}
        </motion.div>
      </div>
    </SiteShell>
  );
}
