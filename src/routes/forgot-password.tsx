"use client";

import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Loader as Loader2, CircleCheck as CheckCircle2 } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase-browser";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot Password — SkillBuddy" },
      { name: "description", content: "Reset your SkillBuddy password." },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError(t("auth.validation.emailRequired"));
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t("auth.validation.emailInvalid"));
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    setSent(true);
  };

  return (
    <SiteShell>
      <div className="mx-auto flex min-h-[80vh] max-w-md flex-col items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full rounded-2xl border border-border bg-card p-8 shadow-lg"
        >
          {sent ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold">{t("auth.forgot.checkEmail")}</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("auth.forgot.emailSentTo")}
              </p>
              <p className="font-medium text-foreground">{email}</p>
              <Button asChild className="mt-6 w-full">
                <Link to="/auth/login">{t("auth.signin")}</Link>
              </Button>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold">{t("auth.forgot.title")}</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("auth.forgot.subtitle")}
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <Label htmlFor="email">{t("auth.email")}</Label>
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
                  {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-11 w-full"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    t("auth.forgot.sendReset")
                  )}
                </Button>
              </form>

              <div className="mt-6">
                <Link
                  to="/auth/login"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {t("auth.forgot.backToLogin")}
                </Link>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </SiteShell>
  );
}
