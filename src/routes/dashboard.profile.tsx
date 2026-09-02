import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect, useCallback } from "react";
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
import {
  ArrowLeft, User, MapPin, Phone, Shield, Save, Loader as Loader2,
  Lock, Upload, FileVideo, ImageIcon, FileText, Eye, EyeOff,
  Monitor, Smartphone, Tablet, Trash2, LogOut, AlertTriangle, Globe,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getFullName } from "@/lib/user-helpers";
import { apiClient, extractErrorMessage } from "@/lib/api-client";

export const Route = createFileRoute("/dashboard/profile")({
  head: () => ({ meta: [{ title: "My Profile — SkillBuddy" }] }),
  component: ProfilePage,
});

const ESTONIAN_COUNTIES = [
  "Harju County", "Ida-Viru County", "Järva County", "Jõgeva County",
  "Lääne County", "Lääne-Viru County", "Pärnu County", "Põlva County",
  "Rapla County", "Saare County", "Tartu County", "Valga County",
  "Viljandi County", "Võru County",
];

function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-border pb-3 mb-5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <h2 className="font-bold text-base">{title}</h2>
    </div>
  );
}

function ProfilePage() {
  const { user, refreshUser, updateUserLocal } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    first_name: user?.first_name ?? "",
    last_name: user?.last_name ?? "",
    phone_number: user?.phone_number ?? "",
    role: (user?.role ?? "") as "CLIENT" | "PROVIDER" | "",
    country: user?.country ?? "Estonia",
    county: user?.county ?? "",
    city: user?.city ?? "",
    postal_code: user?.postal_code ?? "",
    street_address: user?.street_address ?? "",
    house_number: user?.house_number ?? "",
  });

  const update = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const payload: Record<string, string | null> = {
        first_name: form.first_name || null,
        last_name: form.last_name || null,
        phone_number: form.phone_number || null,
        country: form.country || null,
        county: form.county || null,
        city: form.city || null,
        postal_code: form.postal_code || null,
        street_address: form.street_address || null,
        house_number: form.house_number || null,
      };
      if (form.role) payload.role = form.role;

      await apiClient.patch("/api/v1/users/update-user", payload);
      updateUserLocal({
        first_name: form.first_name,
        last_name: form.last_name,
        phone_number: form.phone_number,
        role: form.role as "CLIENT" | "PROVIDER" | null,
        country: form.country,
        county: form.county,
        city: form.city,
        postal_code: form.postal_code,
        street_address: form.street_address,
        house_number: form.house_number,
      });
      toast.success("Profile updated successfully.");
    } catch (err) {
      toast.error(extractErrorMessage(err, "Failed to save profile."));
    } finally {
      setSaving(false);
    }
  };

  // ─── Profile picture upload ────────────────────────────────────────────────
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const handleAvatarUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB.");
      return;
    }
    setAvatarUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await apiClient.upload<{ avatar_url?: string; user?: { avatar_url?: string } }>(
        "/api/v1/users/upload-profile-picture",
        form
      );
      const newUrl = res?.avatar_url ?? res?.user?.avatar_url;
      if (newUrl) updateUserLocal({ avatar_url: newUrl });
      toast.success("Profile picture updated.");
    } catch (err) {
      toast.error(extractErrorMessage(err, "Upload failed."));
    } finally {
      setAvatarUploading(false);
    }
  };

  // ─── Residence permits upload ──────────────────────────────────────────────
  const frontRef = useRef<HTMLInputElement>(null);
  const backRef = useRef<HTMLInputElement>(null);
  const [permitFront, setPermitFront] = useState<File | null>(null);
  const [permitBack, setPermitBack] = useState<File | null>(null);
  const [permitUploading, setPermitUploading] = useState(false);

  const handlePermitUpload = async () => {
    // ⚠️  FLAG FOR BACKEND TEAM: Confirm whether front_file and back_file are both required
    //     or if each can be uploaded independently. Swagger shows them as not strictly required.
    //     Currently requiring both before submitting.
    if (!permitFront || !permitBack) {
      toast.error("Please select both front and back permit images.");
      return;
    }
    setPermitUploading(true);
    try {
      const formData = new FormData();
      formData.append("front_file", permitFront);
      formData.append("back_file", permitBack);
      await apiClient.upload("/api/v1/users/upload-residence-permits", formData);
      toast.success("Residence permits uploaded.");
      setPermitFront(null);
      setPermitBack(null);
    } catch (err) {
      toast.error(extractErrorMessage(err, "Upload failed."));
    } finally {
      setPermitUploading(false);
    }
  };

  // ─── Face auth video upload ────────────────────────────────────────────────
  const faceVideoRef = useRef<HTMLInputElement>(null);
  const [faceVideo, setFaceVideo] = useState<File | null>(null);
  const [faceUploading, setFaceUploading] = useState(false);

  const handleFaceVideoUpload = async () => {
    if (!faceVideo) return;
    if (faceVideo.size > 50 * 1024 * 1024) {
      toast.error("Video must be under 50 MB.");
      return;
    }
    setFaceUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", faceVideo);
      await apiClient.upload("/api/v1/users/upload-face-auth-video", formData);
      toast.success("Face auth video uploaded.");
      setFaceVideo(null);
    } catch (err) {
      toast.error(extractErrorMessage(err, "Upload failed."));
    } finally {
      setFaceUploading(false);
    }
  };

  // ─── Change password ───────────────────────────────────────────────────────
  const { signOut } = useAuth();
  const [pwForm, setPwForm] = useState({ current_password: "", new_password: "", confirm_password: "" });
  const [showOldPw, setShowOldPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [pwErrors, setPwErrors] = useState<Record<string, string>>({});

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
  const pwStrength = getPasswordStrength(pwForm.new_password);

  const handleChangePassword = async () => {
    const errs: Record<string, string> = {};
    if (!pwForm.current_password) errs.current_password = "Current password is required.";
    if (!pwForm.new_password) errs.new_password = "New password is required.";
    else if (pwForm.new_password.length < 8) errs.new_password = "Password must be at least 8 characters.";
    if (pwForm.new_password !== pwForm.confirm_password) errs.confirm_password = "Passwords don't match.";
    setPwErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setPwSaving(true);
    try {
      const baseUrl = (import.meta.env.VITE_API_BASE_URL as string) ?? "";
      const { tokenStore } = await import("@/lib/auth-tokens");
      const accessToken = tokenStore.getAccess();
      const res = await fetch(`${baseUrl}/api/v1/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({
          current_password: pwForm.current_password,
          new_password: pwForm.new_password,
        }),
      });

      if (!res.ok) {
        let msg = "Failed to update password.";
        try {
          const data = await res.json();
          if (typeof data.detail === "string") msg = data.detail;
          else if (typeof data.message === "string") msg = data.message;
          else if (Array.isArray(data.detail) && data.detail.length > 0) {
            msg = data.detail[0]?.msg ?? msg;
          }
        } catch {}
        // Show specific error for wrong current password
        if (msg.toLowerCase().includes("current") || msg.toLowerCase().includes("incorrect")) {
          setPwErrors({ current_password: msg });
        } else {
          toast.error(msg);
        }
        setPwSaving(false);
        return;
      }

      // Success — API invalidates all sessions, so log out and redirect
      toast.success("Password updated. Please log in again with your new password.");
      await signOut();
      navigate({ to: "/auth/login" });
    } catch (err) {
      toast.error(extractErrorMessage(err, "Failed to update password."));
      setPwSaving(false);
    }
  };

  // ─── Active Sessions ───────────────────────────────────────────────────────
  type Session = {
    sid: string;
    device_type: string;
    device_name: string;
    browser: string;
    os_name: string;
    app_version: string;
    ip_address: string;
    last_active: string;
    created_at: string;
    is_current: boolean;
  };
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [sessionsError, setSessionsError] = useState("");
  const [loggingOutSid, setLoggingOutSid] = useState<string | null>(null);
  const [loggingOutAll, setLoggingOutAll] = useState(false);
  const [confirmLogoutAll, setConfirmLogoutAll] = useState(false);
  const [confirmLogoutEverywhere, setConfirmLogoutEverywhere] = useState(false);
  const [loggingOutEverywhere, setLoggingOutEverywhere] = useState(false);

  // ─── Deactivate Account ──────────────────────────────────────────────────
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [deactivateReason, setDeactivateReason] = useState("");
  const [deactivateConfirm, setDeactivateConfirm] = useState("");
  const [deactivating, setDeactivating] = useState(false);
  const deactivateEnabled = deactivateConfirm.toUpperCase() === "DEACTIVATE";

  const getAuthHeaders = useCallback(async () => {
    const { tokenStore } = await import("@/lib/auth-tokens");
    const accessToken = tokenStore.getAccess();
    return {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    };
  }, []);

  const fetchSessions = useCallback(async () => {
    setSessionsLoading(true);
    setSessionsError("");
    try {
      const baseUrl = (import.meta.env.VITE_API_BASE_URL as string) ?? "";
      const headers = await getAuthHeaders();
      const res = await fetch(`${baseUrl}/api/v1/auth/sessions`, { headers });
      if (!res.ok) {
        setSessionsError("Couldn't load your sessions. Please try again.");
        setSessionsLoading(false);
        return;
      }
      const data = await res.json();
      setSessions(data.sessions ?? []);
    } catch {
      setSessionsError("Couldn't load your sessions. Please try again.");
    } finally {
      setSessionsLoading(false);
    }
  }, [getAuthHeaders]);

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  const logoutSession = async (sid: string) => {
    if (!window.confirm("Log out this device?")) return;
    setLoggingOutSid(sid);
    try {
      const baseUrl = (import.meta.env.VITE_API_BASE_URL as string) ?? "";
      const headers = await getAuthHeaders();
      const res = await fetch(`${baseUrl}/api/v1/auth/sessions/${encodeURIComponent(sid)}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) {
        toast.error("Failed to log out device. Please try again.");
        return;
      }
      toast.success("Device logged out.");
      setSessions((prev) => prev.filter((s) => s.sid !== sid));
    } catch {
      toast.error("Failed to log out device. Please try again.");
    } finally {
      setLoggingOutSid(null);
    }
  };

  const logoutAllOther = async () => {
    setLoggingOutAll(true);
    try {
      const baseUrl = (import.meta.env.VITE_API_BASE_URL as string) ?? "";
      const headers = await getAuthHeaders();
      const res = await fetch(`${baseUrl}/api/v1/auth/sessions`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) {
        toast.error("Failed to log out devices. Please try again.");
        return;
      }
      toast.success("All other devices logged out.");
      setSessions((prev) => prev.filter((s) => s.is_current));
      setConfirmLogoutAll(false);
    } catch {
      toast.error("Failed to log out devices. Please try again.");
    } finally {
      setLoggingOutAll(false);
    }
  };

  const logoutEverywhere = async () => {
    setLoggingOutEverywhere(true);
    try {
      const baseUrl = (import.meta.env.VITE_API_BASE_URL as string) ?? "";
      const headers = await getAuthHeaders();
      const res = await fetch(`${baseUrl}/api/v1/auth/logout-all`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) {
        toast.error("Couldn't log out of all devices. Please try again.");
        setLoggingOutEverywhere(false);
        return;
      }
      // Clear all local session data
      const { tokenStore } = await import("@/lib/auth-tokens");
      tokenStore.clear();
      toast.success("Logged out of all devices.");
      navigate({ to: "/auth/login" });
    } catch {
      toast.error("Couldn't log out of all devices. Please try again.");
      setLoggingOutEverywhere(false);
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "mobile": case "phone": return Smartphone;
      case "tablet": return Tablet;
      default: return Monitor;
    }
  };

  const formatLastActive = (ts: string) => {
    if (!ts) return "";
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Active now";
    if (mins < 60) return `Active ${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `Active ${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `Active ${days}d ago`;
  };

  const displayName = getFullName(user);
  const isProvider = user?.roles?.includes("PROVIDER") || user?.role === "PROVIDER";

  const handleDeactivate = async () => {
    setDeactivating(true);
    try {
      const { tokenStore } = await import("@/lib/auth-tokens");
      const accessToken = tokenStore.getAccess();
      const baseUrl = (import.meta.env.VITE_API_BASE_URL as string) ?? "";
      const res = await fetch(`${baseUrl}/api/v1/users/me`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({ reason: deactivateReason || undefined }),
      });
      if (!res.ok) {
        let msg = "Failed to deactivate account. Please try again.";
        try {
          const data = await res.json();
          if (typeof data.message === "string") msg = data.message;
          else if (typeof data.detail === "string") msg = data.detail;
          else if (Array.isArray(data.detail) && data.detail.length > 0) msg = data.detail[0]?.msg ?? msg;
        } catch {}
        toast.error(msg);
        setDeactivating(false);
        return;
      }
      // Success — clear session and redirect
      tokenStore.clear();
      toast.success("Your account has been deactivated.");
      navigate({ to: "/" });
    } catch {
      toast.error("Couldn't deactivate your account. Please try again.");
      setDeactivating(false);
    }
  };

  return (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <button
          onClick={() => navigate({ to: "/dashboard" })}
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>

        {/* Hero card */}
        <div className="rounded-2xl border border-border bg-card p-6 mb-6 flex items-center gap-5">
          <div className="relative shrink-0">
            {(user?.avatar_url || user?.profile_picture_url) ? (
              <img
                src={user.avatar_url || user.profile_picture_url || ""}
                alt={displayName}
                className="h-20 w-20 rounded-full object-cover ring-2 ring-primary/20"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                {displayName ? displayName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) : "?"}
              </div>
            )}
            <button
              onClick={() => avatarInputRef.current?.click()}
              disabled={avatarUploading}
              className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50"
            >
              {avatarUploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
            </button>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleAvatarUpload(f);
              }}
            />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-extrabold truncate">{displayName || "—"}</h1>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <div className="mt-2 flex flex-wrap gap-2 items-center">
              {user?.is_verified ? (
                <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                  Unverified
                </span>
              )}
              {(user?.roles ?? (user?.role ? [user.role] : [])).map((r) => (
                <span key={r} className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-muted-foreground capitalize">
                  {r.toLowerCase()}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Personal Info */}
          <section className="rounded-2xl border border-border bg-card p-6">
            <SectionHeader icon={User} title="Personal Information" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  className="mt-1.5 h-11"
                  value={form.first_name}
                  onChange={(e) => update("first_name", e.target.value)}
                  placeholder="John"
                />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  className="mt-1.5 h-11"
                  value={form.last_name}
                  onChange={(e) => update("last_name", e.target.value)}
                  placeholder="Doe"
                />
              </div>
              <div className="sm:col-span-2">
                <Label>Email</Label>
                <Input className="mt-1.5 h-11 bg-muted cursor-not-allowed" value={user?.email ?? ""} readOnly disabled />
                <p className="mt-1 text-xs text-muted-foreground">Email cannot be changed here.</p>
              </div>
            </div>
          </section>

          {/* Role selection */}
          <section className="rounded-2xl border border-border bg-card p-6">
            <SectionHeader icon={Shield} title="Account Role" />
            <div>
              <Label htmlFor="role">I am a…</Label>
              <Select value={form.role} onValueChange={(v) => update("role", v)}>
                <SelectTrigger className="mt-1.5 h-11">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CLIENT">Client — I hire services</SelectItem>
                  <SelectItem value="PROVIDER">Provider — I offer services</SelectItem>
                </SelectContent>
              </Select>
              <p className="mt-1.5 text-xs text-muted-foreground">
                ⚠️ Confirm with the backend team whether a single account can hold both CLIENT and PROVIDER roles simultaneously (active_role switching).
              </p>
            </div>
          </section>

          {/* Contact Info */}
          <section className="rounded-2xl border border-border bg-card p-6">
            <SectionHeader icon={Phone} title="Contact" />
            <div>
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
                className="mt-1.5 h-11"
                value={form.phone_number}
                onChange={(e) => update("phone_number", e.target.value)}
                placeholder="+372 5XXX XXXX"
              />
            </div>
          </section>

          {/* Address */}
          <section className="rounded-2xl border border-border bg-card p-6">
            <SectionHeader icon={MapPin} title="Address" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Country</Label>
                <Input className="mt-1.5 h-11 bg-muted cursor-not-allowed" value={form.country} readOnly disabled />
              </div>
              <div>
                <Label htmlFor="county">County</Label>
                <Select value={form.county} onValueChange={(v) => update("county", v)}>
                  <SelectTrigger className="mt-1.5 h-11">
                    <SelectValue placeholder="Select county" />
                  </SelectTrigger>
                  <SelectContent>
                    {ESTONIAN_COUNTIES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" className="mt-1.5 h-11" value={form.city}
                  onChange={(e) => update("city", e.target.value)} placeholder="Tallinn" />
              </div>
              <div>
                <Label htmlFor="postal_code">Postal Code</Label>
                <Input id="postal_code" className="mt-1.5 h-11" value={form.postal_code}
                  onChange={(e) => update("postal_code", e.target.value)} placeholder="10001" />
              </div>
              <div>
                <Label htmlFor="street_address">Street Address</Label>
                <Input id="street_address" className="mt-1.5 h-11" value={form.street_address}
                  onChange={(e) => update("street_address", e.target.value)} placeholder="Main St" />
              </div>
              <div>
                <Label htmlFor="house_number">House / Apt Number</Label>
                <Input id="house_number" className="mt-1.5 h-11" value={form.house_number}
                  onChange={(e) => update("house_number", e.target.value)} placeholder="42B" />
              </div>
            </div>
          </section>

          {/* Save personal info */}
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving} className="min-w-[140px]">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="mr-2 h-4 w-4" />Save Changes</>}
            </Button>
          </div>

          {/* Documents */}
          <section className="rounded-2xl border border-border bg-card p-6">
            <SectionHeader icon={FileText} title="Documents" />
            <div className="space-y-6">
              {/* Residence permits */}
              <div>
                <p className="text-sm font-medium mb-3">Residence Permits</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">Front side</Label>
                    <div
                      onClick={() => frontRef.current?.click()}
                      className="mt-1.5 flex h-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border hover:border-primary transition-colors"
                    >
                      {permitFront ? (
                        <p className="text-xs text-center px-2 truncate">{permitFront.name}</p>
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-muted-foreground">
                          <Upload className="h-5 w-5" />
                          <span className="text-xs">Upload front</span>
                        </div>
                      )}
                    </div>
                    <input ref={frontRef} type="file" accept="image/*,application/pdf" className="hidden"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) setPermitFront(f); }} />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Back side</Label>
                    <div
                      onClick={() => backRef.current?.click()}
                      className="mt-1.5 flex h-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border hover:border-primary transition-colors"
                    >
                      {permitBack ? (
                        <p className="text-xs text-center px-2 truncate">{permitBack.name}</p>
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-muted-foreground">
                          <Upload className="h-5 w-5" />
                          <span className="text-xs">Upload back</span>
                        </div>
                      )}
                    </div>
                    <input ref={backRef} type="file" accept="image/*,application/pdf" className="hidden"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) setPermitBack(f); }} />
                  </div>
                </div>
                {(permitFront || permitBack) && (
                  <Button
                    size="sm"
                    className="mt-3"
                    disabled={permitUploading}
                    onClick={handlePermitUpload}
                  >
                    {permitUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Upload Permits"}
                  </Button>
                )}
              </div>

              {/* Face auth video */}
              <div>
                <p className="text-sm font-medium mb-3">Face Authentication Video</p>
                <div
                  onClick={() => faceVideoRef.current?.click()}
                  className="flex h-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border hover:border-primary transition-colors"
                >
                  {faceVideo ? (
                    <p className="text-xs text-center px-2 truncate">{faceVideo.name}</p>
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-muted-foreground">
                      <FileVideo className="h-5 w-5" />
                      <span className="text-xs">Select video file (max 50 MB)</span>
                    </div>
                  )}
                </div>
                <input ref={faceVideoRef} type="file" accept="video/*" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) setFaceVideo(f); }} />
                {faceVideo && (
                  <Button size="sm" className="mt-3" disabled={faceUploading} onClick={handleFaceVideoUpload}>
                    {faceUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Upload Video"}
                  </Button>
                )}
              </div>
            </div>
          </section>

          {/* Change Password */}
          <section className="rounded-2xl border border-border bg-card p-6">
            <SectionHeader icon={Lock} title="Change Password" />
            <p className="text-sm text-muted-foreground mb-4">Update your password to keep your account secure.</p>
            <div className="space-y-4">
              <div>
                <Label htmlFor="current_password">Current Password</Label>
                <div className="relative mt-1.5">
                  <Input
                    id="current_password"
                    type={showOldPw ? "text" : "password"}
                    value={pwForm.current_password}
                    onChange={(e) => { setPwForm((f) => ({ ...f, current_password: e.target.value })); setPwErrors((er) => ({ ...er, current_password: "" })); }}
                    className={`h-11 pr-10 ${pwErrors.current_password ? "border-red-500" : ""}`}
                    placeholder="Your current password"
                  />
                  <button type="button" onClick={() => setShowOldPw(!showOldPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showOldPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {pwErrors.current_password && <p className="mt-1 text-xs text-red-500">{pwErrors.current_password}</p>}
              </div>
              <div>
                <Label htmlFor="new_password">New Password</Label>
                <div className="relative mt-1.5">
                  <Input
                    id="new_password"
                    type={showNewPw ? "text" : "password"}
                    value={pwForm.new_password}
                    onChange={(e) => { setPwForm((f) => ({ ...f, new_password: e.target.value })); setPwErrors((er) => ({ ...er, new_password: "" })); }}
                    className={`h-11 pr-10 ${pwErrors.new_password ? "border-red-500" : ""}`}
                    placeholder="Min. 8 characters"
                  />
                  <button type="button" onClick={() => setShowNewPw(!showNewPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {pwForm.new_password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Password strength</span>
                      <span className={`font-medium ${pwStrength.color.replace("bg-", "text-")}`}>{pwStrength.label}</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div className={`h-full rounded-full transition-all ${pwStrength.color}`} style={{ width: pwStrength.width }} />
                    </div>
                  </div>
                )}
                {pwErrors.new_password && <p className="mt-1 text-xs text-red-500">{pwErrors.new_password}</p>}
              </div>
              <div>
                <Label htmlFor="confirm_password">Confirm New Password</Label>
                <div className="relative mt-1.5">
                  <Input
                    id="confirm_password"
                    type={showConfirmPw ? "text" : "password"}
                    value={pwForm.confirm_password}
                    onChange={(e) => { setPwForm((f) => ({ ...f, confirm_password: e.target.value })); setPwErrors((er) => ({ ...er, confirm_password: "" })); }}
                    className={`h-11 pr-10 ${pwErrors.confirm_password ? "border-red-500" : ""}`}
                    placeholder="Repeat new password"
                  />
                  <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showConfirmPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {pwErrors.confirm_password && <p className="mt-1 text-xs text-red-500">{pwErrors.confirm_password}</p>}
              </div>
              <Button onClick={handleChangePassword} disabled={pwSaving} variant="outline">
                {pwSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Lock className="mr-2 h-4 w-4" />Update Password</>}
              </Button>
              <p className="text-xs text-muted-foreground">
                ⚠️ After changing your password, you will be logged out for security. You'll need to log in again with your new password.
              </p>
            </div>
          </section>

          {/* Active Sessions */}
          <section className="rounded-2xl border border-border bg-card p-6">
            <SectionHeader icon={Globe} title="Active Sessions" />
            <p className="text-sm text-muted-foreground mb-4">
              These are the devices currently logged into your account. If you don't recognize one, log it out for your security.
            </p>

            {sessionsLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}

            {sessionsError && (
              <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 p-4 text-sm text-red-600 dark:text-red-400">
                {sessionsError}
                <Button variant="outline" size="sm" className="ml-3" onClick={fetchSessions}>
                  Retry
                </Button>
              </div>
            )}

            {!sessionsLoading && !sessionsError && sessions.length === 0 && (
              <p className="text-sm text-muted-foreground py-4 text-center">No active sessions found.</p>
            )}

            {!sessionsLoading && !sessionsError && sessions.length > 0 && (
              <div className="space-y-3">
                {sessions.map((session) => {
                  const DeviceIcon = getDeviceIcon(session.device_type);
                  return (
                    <div
                      key={session.sid}
                      className={`flex items-center justify-between gap-4 rounded-xl border p-4 ${
                        session.is_current ? "border-primary/30 bg-primary/5" : "border-border"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                          <DeviceIcon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium truncate">
                              {session.device_name || session.browser || "Unknown device"}
                            </p>
                            {session.is_current && (
                              <span className="shrink-0 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                                This device
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {[session.browser, session.os_name].filter(Boolean).join(" on ")}
                            {session.ip_address && <> · {session.ip_address}</>}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatLastActive(session.last_active)}
                          </p>
                        </div>
                      </div>

                      {!session.is_current && (
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={loggingOutSid === session.sid}
                          onClick={() => logoutSession(session.sid)}
                          className="shrink-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                        >
                          {loggingOutSid === session.sid ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <><LogOut className="h-4 w-4 mr-1" />Log out</>
                          )}
                        </Button>
                      )}
                    </div>
                  );
                })}

                {/* Log out all other devices */}
                {sessions.some((s) => !s.is_current) && (
                  <div className="pt-2">
                    {confirmLogoutAll ? (
                      <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20 p-4">
                        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                            Log out all other devices?
                          </p>
                          <p className="text-xs text-amber-600 dark:text-amber-400">
                            This will log you out of all devices except this one.
                          </p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Button variant="outline" size="sm" onClick={() => setConfirmLogoutAll(false)}>
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 text-white"
                            disabled={loggingOutAll}
                            onClick={logoutAllOther}
                          >
                            {loggingOutAll ? <Loader2 className="h-4 w-4 animate-spin" /> : "Yes, log out other devices"}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                        onClick={() => setConfirmLogoutAll(true)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Log out all other devices
                      </Button>
                    )}
                  </div>
                )}

                {/* Log out of ALL devices (including this one) */}
                <div className="pt-3 border-t border-border mt-3">
                  {confirmLogoutEverywhere ? (
                    <div className="flex items-center gap-3 rounded-xl border border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/30 p-4">
                      <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-800 dark:text-red-300">
                          Log out of ALL devices?
                        </p>
                        <p className="text-xs text-red-600 dark:text-red-400">
                          This will log you out of every device, including this one. You'll need to log in again.
                        </p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button variant="outline" size="sm" onClick={() => setConfirmLogoutEverywhere(false)}>
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          className="bg-red-700 hover:bg-red-800 text-white"
                          disabled={loggingOutEverywhere}
                          onClick={logoutEverywhere}
                        >
                          {loggingOutEverywhere ? <Loader2 className="h-4 w-4 animate-spin" /> : "Yes, log out everywhere"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setConfirmLogoutEverywhere(true)}
                    >
                      <LogOut className="h-4 w-4 mr-1" />
                      Log out of all devices
                    </Button>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* Deactivate Account — Danger Zone */}
          <section className="rounded-2xl border border-red-200 bg-red-50/50 dark:border-red-900/40 dark:bg-red-950/10 p-6">
            <SectionHeader icon={AlertTriangle} title="Danger Zone" />
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold">Deactivate Account</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Deactivating your account will sign you out and disable access.
                  You can contact support to reactivate later.
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setDeactivateOpen(true);
                  setDeactivateReason("");
                  setDeactivateConfirm("");
                }}
              >
                Deactivate
              </Button>
            </div>
          </section>
        </div>
      </div>

      {/* Deactivate Account Confirmation Dialog */}
      {deactivateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !deactivating && setDeactivateOpen(false)} />
          <div className="relative w-full max-w-md rounded-2xl border border-red-200 bg-card p-6 shadow-xl dark:border-red-900/50">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Deactivate Account</h3>
                <p className="text-sm text-muted-foreground">This action requires confirmation</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
                <p className="font-medium">What happens when you deactivate:</p>
                <ul className="mt-2 space-y-1 list-disc list-inside text-xs">
                  <li>You will be signed out immediately</li>
                  <li>You won't be able to log in until you contact support</li>
                  <li>Your data will be preserved for potential reactivation</li>
                </ul>
              </div>

              <div>
                <Label htmlFor="deactivate-reason">Reason for leaving (optional)</Label>
                <textarea
                  id="deactivate-reason"
                  value={deactivateReason}
                  onChange={(e) => setDeactivateReason(e.target.value)}
                  placeholder="Help us improve — tell us why you're leaving..."
                  rows={3}
                  className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <Label htmlFor="deactivate-confirm">Type <span className="font-bold">DEACTIVATE</span> to confirm</Label>
                <Input
                  id="deactivate-confirm"
                  value={deactivateConfirm}
                  onChange={(e) => setDeactivateConfirm(e.target.value)}
                  placeholder="DEACTIVATE"
                  className="mt-1.5 h-11"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setDeactivateOpen(false)}
                disabled={deactivating}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                disabled={!deactivateEnabled || deactivating}
                onClick={handleDeactivate}
              >
                {deactivating ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-2" />Deactivating...</>
                ) : (
                  "Deactivate My Account"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </SiteShell>
  );
}
