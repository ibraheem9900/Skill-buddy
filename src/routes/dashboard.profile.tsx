import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
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
  const [pwForm, setPwForm] = useState({ old_password: "", new_password: "", confirm_password: "" });
  const [showOldPw, setShowOldPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [pwErrors, setPwErrors] = useState<Record<string, string>>({});

  const handleChangePassword = async () => {
    const errs: Record<string, string> = {};
    if (!pwForm.old_password) errs.old_password = "Current password is required.";
    if (!pwForm.new_password) errs.new_password = "New password is required.";
    else if (pwForm.new_password.length < 8) errs.new_password = "Password must be at least 8 characters.";
    if (pwForm.new_password !== pwForm.confirm_password) errs.confirm_password = "Passwords don't match.";
    setPwErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setPwSaving(true);
    try {
      await apiClient.patch("/api/v1/users/update-password", {
        old_password: pwForm.old_password,
        new_password: pwForm.new_password,
        confirm_password: pwForm.confirm_password,
      });
      toast.success("Password updated successfully.");
      setPwForm({ old_password: "", new_password: "", confirm_password: "" });
    } catch (err) {
      toast.error(extractErrorMessage(err, "Failed to update password."));
    } finally {
      setPwSaving(false);
    }
  };

  const displayName = getFullName(user);
  const isProvider = user?.role === "PROVIDER";

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
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
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
              {user?.role && (
                <span className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-muted-foreground capitalize">
                  {user.role.toLowerCase()}
                </span>
              )}
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
            <div className="space-y-4">
              <div>
                <Label htmlFor="old_password">Current Password</Label>
                <div className="relative mt-1.5">
                  <Input
                    id="old_password"
                    type={showOldPw ? "text" : "password"}
                    value={pwForm.old_password}
                    onChange={(e) => { setPwForm((f) => ({ ...f, old_password: e.target.value })); setPwErrors((e) => ({ ...e, old_password: "" })); }}
                    className={`h-11 pr-10 ${pwErrors.old_password ? "border-red-500" : ""}`}
                    placeholder="Your current password"
                  />
                  <button type="button" onClick={() => setShowOldPw(!showOldPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showOldPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {pwErrors.old_password && <p className="mt-1 text-xs text-red-500">{pwErrors.old_password}</p>}
              </div>
              <div>
                <Label htmlFor="new_password">New Password</Label>
                <div className="relative mt-1.5">
                  <Input
                    id="new_password"
                    type={showNewPw ? "text" : "password"}
                    value={pwForm.new_password}
                    onChange={(e) => { setPwForm((f) => ({ ...f, new_password: e.target.value })); setPwErrors((e) => ({ ...e, new_password: "" })); }}
                    className={`h-11 pr-10 ${pwErrors.new_password ? "border-red-500" : ""}`}
                    placeholder="Min. 8 characters"
                  />
                  <button type="button" onClick={() => setShowNewPw(!showNewPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {pwErrors.new_password && <p className="mt-1 text-xs text-red-500">{pwErrors.new_password}</p>}
              </div>
              <div>
                <Label htmlFor="confirm_password">Confirm New Password</Label>
                <Input
                  id="confirm_password"
                  type="password"
                  value={pwForm.confirm_password}
                  onChange={(e) => { setPwForm((f) => ({ ...f, confirm_password: e.target.value })); setPwErrors((e) => ({ ...e, confirm_password: "" })); }}
                  className={`mt-1.5 h-11 ${pwErrors.confirm_password ? "border-red-500" : ""}`}
                  placeholder="Repeat new password"
                />
                {pwErrors.confirm_password && <p className="mt-1 text-xs text-red-500">{pwErrors.confirm_password}</p>}
              </div>
              <Button onClick={handleChangePassword} disabled={pwSaving} variant="outline">
                {pwSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Lock className="mr-2 h-4 w-4" />Update Password</>}
              </Button>
            </div>
          </section>
        </div>
      </div>
    </SiteShell>
  );
}
