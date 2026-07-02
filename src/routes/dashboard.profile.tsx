import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
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
import { ArrowLeft, User, MapPin, Phone, Shield, Wrench, Save, Loader as Loader2, CheckCircle2, XCircle, Clock3 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase-browser";

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

function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

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
  const { profile, user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    full_name: profile?.full_name ?? "",
    phone: profile?.phone ?? "",
    country: profile?.country ?? "Estonia",
    county: profile?.county ?? "",
    city: profile?.city ?? "",
    postal_code: profile?.postal_code ?? "",
    street_address: profile?.street_address ?? "",
    house_number: profile?.house_number ?? "",
  });

  const update = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    if (!profile || !user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: form.full_name || null,
        phone: form.phone || null,
        country: form.country || null,
        county: form.county || null,
        city: form.city || null,
        postal_code: form.postal_code || null,
        street_address: form.street_address || null,
        house_number: form.house_number || null,
      })
      .eq("user_id", user.id);

    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    await refreshProfile();
    toast.success("Profile updated successfully.");
  };

  const isProvider = profile?.role === "provider";

  const verificationColor =
    profile?.verification_status === "verified"
      ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400"
      : profile?.verification_status === "rejected"
        ? "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400"
        : "text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400";

  const VerificationIcon =
    profile?.verification_status === "verified"
      ? CheckCircle2
      : profile?.verification_status === "rejected"
        ? XCircle
        : Clock3;

  const verificationLabel =
    profile?.verification_status === "verified"
      ? "Verified"
      : profile?.verification_status === "rejected"
        ? "Rejected"
        : "Pending Review";

  return (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        {/* Back */}
        <button
          onClick={() => navigate({ to: "/dashboard" })}
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>

        {/* Hero card */}
        <div className="rounded-2xl border border-border bg-card p-6 mb-6 flex items-center gap-5">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.full_name ?? ""}
              className="h-20 w-20 rounded-full object-cover ring-2 ring-primary/20 shrink-0"
            />
          ) : (
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
              {getInitials(profile?.full_name)}
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-xl font-extrabold truncate">{profile?.full_name || "—"}</h1>
            <p className="text-sm text-muted-foreground">@{profile?.username}</p>
            <div className="mt-2 flex flex-wrap gap-2 items-center">
              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${verificationColor}`}>
                <VerificationIcon className="h-3 w-3" />
                {verificationLabel}
              </span>
              <span className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-muted-foreground capitalize">
                {profile?.role ?? "—"}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Personal Info */}
          <section className="rounded-2xl border border-border bg-card p-6">
            <SectionHeader icon={User} title="Personal Information" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  className="mt-1.5 h-11"
                  value={form.full_name}
                  onChange={(e) => update("full_name", e.target.value)}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  className="mt-1.5 h-11 bg-muted cursor-not-allowed"
                  value={user?.email ?? ""}
                  readOnly
                  disabled
                />
                <p className="mt-1 text-xs text-muted-foreground">Email cannot be changed here.</p>
              </div>
              <div>
                <Label>Username</Label>
                <Input
                  className="mt-1.5 h-11 bg-muted cursor-not-allowed"
                  value={`@${profile?.username ?? ""}`}
                  readOnly
                  disabled
                />
              </div>
            </div>
          </section>

          {/* Contact Info */}
          <section className="rounded-2xl border border-border bg-card p-6">
            <SectionHeader icon={Phone} title="Contact" />
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                className="mt-1.5 h-11"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
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
                <Input
                  className="mt-1.5 h-11 bg-muted cursor-not-allowed"
                  value={form.country}
                  readOnly
                  disabled
                />
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
                <Input
                  id="city"
                  className="mt-1.5 h-11"
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  placeholder="Tallinn"
                />
              </div>
              <div>
                <Label htmlFor="postal_code">Postal Code</Label>
                <Input
                  id="postal_code"
                  className="mt-1.5 h-11"
                  value={form.postal_code}
                  onChange={(e) => update("postal_code", e.target.value)}
                  placeholder="10001"
                />
              </div>
              <div>
                <Label htmlFor="street_address">Street Address</Label>
                <Input
                  id="street_address"
                  className="mt-1.5 h-11"
                  value={form.street_address}
                  onChange={(e) => update("street_address", e.target.value)}
                  placeholder="Main St"
                />
              </div>
              <div>
                <Label htmlFor="house_number">House / Apt Number</Label>
                <Input
                  id="house_number"
                  className="mt-1.5 h-11"
                  value={form.house_number}
                  onChange={(e) => update("house_number", e.target.value)}
                  placeholder="42B"
                />
              </div>
            </div>
          </section>

          {/* Provider-only section */}
          {isProvider && (
            <section className="rounded-2xl border border-border bg-card p-6">
              <SectionHeader icon={Wrench} title="Provider Details" />
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Primary Skill</span>
                  <span className="font-medium capitalize">{profile?.username ?? "—"}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground">Verification Status</span>
                  <span className={`inline-flex items-center gap-1 font-medium rounded-full px-2.5 py-0.5 text-xs ${verificationColor}`}>
                    <VerificationIcon className="h-3 w-3" />
                    {verificationLabel}
                  </span>
                </div>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                To update your skills or upload new documents, please contact support.
              </p>
            </section>
          )}

          {/* Account status */}
          <section className="rounded-2xl border border-border bg-card p-6">
            <SectionHeader icon={Shield} title="Account Status" />
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Account Type</span>
                <span className="font-medium capitalize">{profile?.role ?? "—"}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">ID Verification</span>
                <span className={`inline-flex items-center gap-1 font-semibold text-xs rounded-full px-2.5 py-0.5 ${verificationColor}`}>
                  <VerificationIcon className="h-3 w-3" />
                  {verificationLabel}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-muted-foreground">Member since</span>
                <span className="font-medium">
                  {profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString("en-GB", {
                        day: "numeric", month: "long", year: "numeric",
                      })
                    : "—"}
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Save button */}
        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave} disabled={saving} className="min-w-[140px]">
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </SiteShell>
  );
}
