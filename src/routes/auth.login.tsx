"use client";

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Loader as Loader2, Mail, Lock } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/logo";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase-browser";
import { useI18n } from "@/lib/i18n";
import { useLoader } from "@/context/LoaderContext";

export const Route = createFileRoute("/auth/login")({
  head: () => ({
    meta: [
      { title: "Log in — SkillBuddy" },
      { name: "description", content: "Sign in to your SkillBuddy account." },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { showLoader, hideLoader } = useLoader();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oAuthLoading, setOAuthLoading] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = (): boolean => {
    const errs: typeof errors = {};
    if (!email.trim()) errs.email = t("auth.validation.emailRequired");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = t("auth.validation.emailInvalid");
    if (!password) errs.password = t("auth.validation.passwordRequired");
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    showLoader();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      hideLoader();
      toast.error(error.message);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (profile?.role === "provider") {
        navigate({ to: "/provider/dashboard" });
      } else {
        navigate({ to: "/client/dashboard" });
      }
    } else {
      hideLoader();
      navigate({ to: "/" });
    }
  };

  const handleOAuth = async (provider: "google" | "apple") => {
    setOAuthLoading(provider);
    showLoader();

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      hideLoader();
      toast.error(error.message);
      setOAuthLoading(null);
    }
  };

  return (
    <SiteShell>
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:items-center">
        <div className="hidden lg:block">
          <Logo />
          <h1 className="mt-8 font-display text-4xl font-extrabold leading-tight">
            {t("auth.login.title")}
          </h1>
          <p className="mt-4 text-muted-foreground">
            {t("auth.login.subtitle")}
          </p>
          <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              {t("auth.login.feature1")}
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              {t("auth.login.feature2")}
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              {t("auth.login.feature3")}
            </li>
          </ul>
        </div>

        <div className="mx-auto w-full max-w-md rounded-3xl border border-border bg-card p-7 shadow-elegant">
          <div className="lg:hidden mb-6">
            <Logo />
          </div>

          <h2 className="text-2xl font-extrabold">{t("auth.signin")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("auth.login.newHere")}{" "}
            <Link to="/register" className="text-primary hover:underline">
              {t("auth.login.createAccount")}
            </Link>
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
                    setErrors((err) => ({ ...err, email: undefined }));
                  }}
                  placeholder="you@email.com"
                  className={`h-11 pl-10 ${errors.email ? "border-red-500" : ""}`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t("auth.password")}</Label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  {t("auth.login.forgotPassword")}
                </Link>
              </div>
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
                  placeholder={`${t("auth.password")}`}
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
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <span className="text-muted-foreground">{t("auth.login.rememberMe")}</span>
            </label>

            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full shadow-elegant"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                t("auth.signin")
              )}
            </Button>
          </form>

          <div className="my-5 flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" />
            {t("common.orContinueWith")}
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              type="button"
              disabled={oAuthLoading !== null}
              onClick={() => handleOAuth("google")}
              className="h-11"
            >
              {oAuthLoading === "google" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Google"
              )}
            </Button>
            <Button
              variant="outline"
              type="button"
              disabled={oAuthLoading !== null}
              onClick={() => handleOAuth("apple")}
              className="h-11"
            >
              {oAuthLoading === "apple" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Apple"
              )}
            </Button>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
