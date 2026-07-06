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
import { useI18n } from "@/lib/i18n";
import { useLoader } from "@/context/LoaderContext";
import { useAuth } from "@/context/AuthContext";
import { extractErrorMessage } from "@/lib/api-client";

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
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oAuthLoading, setOAuthLoading] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

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

    try {
      const baseUrl = (import.meta.env.VITE_API_BASE_URL as string) ?? "";
      const res = await fetch(`${baseUrl}/api/v1/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "password",
          username: email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        hideLoader();
        setLoading(false);
        // Surface "not verified" specifically
        const msg = extractErrorMessage(data, "Invalid email or password.");
        if (
          msg.toLowerCase().includes("verif") ||
          msg.toLowerCase().includes("not verified") ||
          msg.toLowerCase().includes("confirm")
        ) {
          setErrors({
            general:
              "Your email is not verified yet. Please check your inbox for the verification link.",
          });
        } else {
          setErrors({ general: msg });
        }
        return;
      }

      signIn(
        data.user,
        data.access_token,
        data.refresh_token,
        data.roles ?? [],
        data.active_role ?? ""
      );

      hideLoader();
      setLoading(false);

      // If a pending role was stored during a completed registration flow, apply it now.
      // We only consume it on *successful* login to avoid accidental role patching.
      const pendingRole = sessionStorage.getItem("pending_role") as "CLIENT" | "PROVIDER" | null;
      if (pendingRole) {
        sessionStorage.removeItem("pending_role");
        try {
          await fetch(`${baseUrl}/api/v1/users/update-user`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${data.access_token}`,
            },
            body: JSON.stringify({ role: pendingRole }),
          });
        } catch {
          // Non-critical; user can set role from profile page
        }
      }

      navigate({ to: "/dashboard" });
    } catch (err) {
      hideLoader();
      setLoading(false);
      toast.error(extractErrorMessage(err));
    }
  };

  const handleOAuth = (provider: "google" | "apple") => {
    setOAuthLoading(provider);
    const baseUrl = (import.meta.env.VITE_API_BASE_URL as string) ?? "";
    // Redirect browser to backend OAuth initiation URL.
    // ⚠️  FLAG FOR BACKEND TEAM: Confirm the exact callback redirect target and
    //     whether tokens are returned as query params or in a redirect body.
    //     Current assumption: backend redirects to {origin}/auth/callback?access_token=...&refresh_token=...
    window.location.href = `${baseUrl}/api/v1/users/login/${provider}`;
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
            {errors.general && (
              <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 p-3 text-sm text-red-600 dark:text-red-400">
                {errors.general}
              </div>
            )}

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
                    setErrors((err) => ({ ...err, email: undefined, general: undefined }));
                  }}
                  placeholder="you@email.com"
                  className={`h-11 pl-10 ${errors.email ? "border-red-500" : ""}`}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t("auth.password")}</Label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">
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
                    setErrors((err) => ({ ...err, password: undefined, general: undefined }));
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
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <span className="text-muted-foreground">{t("auth.login.rememberMe")}</span>
            </label>

            <Button type="submit" disabled={loading} className="h-11 w-full shadow-elegant">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("auth.signin")}
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
              className="h-11 gap-2"
            >
              {oAuthLoading === "google" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <><GoogleIcon /> Google</>
              )}
            </Button>
            <Button
              variant="outline"
              type="button"
              disabled={oAuthLoading !== null}
              onClick={() => handleOAuth("apple")}
              className="h-11 gap-2"
            >
              {oAuthLoading === "apple" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <><AppleIcon /> Apple</>
              )}
            </Button>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
