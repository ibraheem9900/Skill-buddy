import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { SiteShell } from "@/components/site-shell";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Bell, CreditCard, Heart, Settings, MapPin, Calendar, User, ShoppingBag, Wrench, CheckCircle2, Hand, Loader as Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getFullName, isProfileComplete } from "@/lib/user-helpers";
import { QRDownloadModal } from "@/components/qr-download-modal";
import { useI18n } from "@/lib/i18n";
import { useProviderProfile } from "@/hooks/use-provider-profile";
import { useProviderDashboard } from "@/hooks/use-provider-dashboard";
import { useProviderCurrentStatus } from "@/hooks/use-provider-current-status";
import { useProviderStatusHistory } from "@/hooks/use-provider-status-history";
import { useClientDashboard } from "@/hooks/use-client-dashboard";
import { useProfilePicture } from "@/hooks/use-profile-picture";
import { useClientBookings, getBookingTitle, getBookingStatus, getBookingDate, getBookingPrice, getBookingProvider } from "@/hooks/use-client-bookings";
import { Star, TrendingUp, Clock, Award, MapPin as MapPinIcon, ChevronDown, Check } from "lucide-react";
import { toast } from "sonner";
import { apiClient, extractErrorMessage } from "@/lib/api-client";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({
    meta: [
      { title: "Dashboard — SkillBuddy" },
      { name: "description", content: "Manage your bookings, favorites, and account." },
    ],
  }),
  component: DashboardIndex,
});

function getInitials(name: string): string {
  if (!name) return "?";
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-lg font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 py-16 text-center">
      <ShoppingBag className="h-10 w-10 text-muted-foreground/40 mb-3" />
      <p className="text-sm font-medium text-muted-foreground">No {label} bookings yet</p>
      <p className="mt-1 text-xs text-muted-foreground/60">When you book a service, it will appear here.</p>
      <Button asChild className="mt-5" size="sm">
        <Link to="/services">Browse services</Link>
      </Button>
    </div>
  );
}

function BookingsTabContent({ bookings, filter, emptyLabel }: { bookings: ReturnType<typeof useClientBookings>["bookings"]; filter: (b: ReturnType<typeof useClientBookings>["bookings"][number]) => boolean; emptyLabel: string }) {
  const filtered = bookings.filter((b) => filter(b));

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 py-12 text-center">
        <ShoppingBag className="h-10 w-10 text-muted-foreground/40 mb-3" />
        <p className="text-sm font-medium text-muted-foreground">No {emptyLabel} bookings yet</p>
        <p className="mt-1 text-xs text-muted-foreground/60">When you book a service, it will appear here.</p>
        <Button asChild className="mt-4" size="sm">
          <Link to="/services">Browse services</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filtered.map((booking, i) => {
        const title = getBookingTitle(booking) || "Service Booking";
        const status = getBookingStatus(booking);
        const date = getBookingDate(booking);
        const price = getBookingPrice(booking);
        const provider = getBookingProvider(booking);
        return (
          <div key={booking.id ?? i} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition hover:shadow-card">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate">{title}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {provider && <span>{provider}</span>}
                {date && <span>· {date}</span>}
              </div>
            </div>
            <div className="text-right shrink-0">
              {price && <p className="text-sm font-semibold">€{price}</p>}
              {status && (
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary capitalize">
                  {status}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DashboardIndex() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useI18n();
  const [activeNav, setActiveNav] = useState("bookings");
  const [qrOpen, setQrOpen] = useState(false);
  const [qrConfig, setQrConfig] = useState<{ title: string; message: string } | null>(null);

  const openQr = (title: string, message: string) => {
    setQrConfig({ title, message });
    setQrOpen(true);
  };

  const { url: fetchedAvatar } = useProfilePicture(!!user && !user?.avatar_url);
  const displayName = getFullName(user);
  const avatarSrc = fetchedAvatar ?? user?.avatar_url ?? null;
  const firstName = user?.first_name || displayName.split(" ")[0] || "there";
  const isProvider = user?.roles?.includes("PROVIDER") || user?.role === "PROVIDER";
  const { profile: providerProfile, loading: providerLoading } = useProviderProfile(isProvider);
  const { dashboard: providerDashboard, loading: dashLoading } = useProviderDashboard(isProvider);
  const { currentStatus, loading: statusLoading } = useProviderCurrentStatus(isProvider);
  const { history: statusHistory, loading: historyLoading, load: loadHistory } = useProviderStatusHistory();
  const [historyOpen, setHistoryOpen] = useState(false);
  const { dashboard: clientDashboard, loading: clientDashLoading } = useClientDashboard(!isProvider);
  const { bookings: clientBookings, total: bookingsTotal, loading: bookingsLoading } = useClientBookings(!isProvider);
  const location = [user?.city, user?.county].filter(Boolean).join(", ");
  const profileComplete = isProfileComplete(user);

  // ─── Provider Status Update ──────────────────────────────────────────────
  const [statusForm, setStatusForm] = useState({ status: "", reason: "" });
  const [statusSaving, setStatusSaving] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "on_leave", label: "On Leave" },
    { value: "unavailable", label: "Unavailable" },
  ];

  const handleStatusUpdate = useCallback(async () => {
    if (!statusForm.status) return;
    setStatusSaving(true);
    try {
      await apiClient.post("/api/v1/providers/status", {
        status: statusForm.status,
        reason: statusForm.reason || undefined,
      });
      toast.success("Status updated.");
      setStatusForm({ status: "", reason: "" });
    } catch (err) {
      toast.error(extractErrorMessage(err, "Failed to update status. Please try again."));
    } finally {
      setStatusSaving(false);
    }
  }, [statusForm]);

  const sidebarItems: {
    id: string;
    icon: React.ElementType;
    label: string;
    badge?: string;
    appOnly?: boolean;
    appTitle?: string;
    appMessage?: string;
  }[] = [
    { id: "bookings", icon: Calendar, label: isProvider ? "My Jobs" : "My Bookings" },
    {
      id: "favorites",
      icon: Heart,
      label: "Saved Services",
      appOnly: true,
      appTitle: "Save services in the app",
      appMessage: "Tap the heart on any service to save it for later. Available in the SkillBuddy app.",
    },
    {
      id: "notifications",
      icon: Bell,
      label: "Notifications",
      appOnly: true,
      appTitle: "Notifications in the app",
      appMessage: "Get real-time alerts for bookings, messages, and promotions on your phone.",
    },
    {
      id: "payments",
      icon: CreditCard,
      label: "Payment Methods",
      appOnly: true,
      appTitle: "Payments in the app",
      appMessage: "Add and manage payment methods securely. Pay for services directly from your phone.",
    },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">

        {/* Profile completion banner */}
        {!profileComplete && (
          <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20 p-4">
            <p className="text-sm text-amber-800 dark:text-amber-300">
              <strong>Complete your profile</strong> — add your address and role to unlock all features.
            </p>
            <Button size="sm" variant="outline" className="shrink-0 border-amber-400 text-amber-700 dark:text-amber-300" onClick={() => navigate({ to: "/dashboard/profile" })}>
              Complete Profile
            </Button>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border bg-card p-5 text-center">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={displayName}
                  className="mx-auto h-20 w-20 rounded-full object-cover ring-2 ring-primary/20"
                />
              ) : (
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  {getInitials(displayName)}
                </div>
              )}
              <h2 className="mt-3 font-bold truncate">{displayName || user?.email || "My Account"}</h2>
              {location && (
                <div className="mt-1 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="truncate">{location}</span>
                </div>
              )}
              {user?.is_verified && (
                <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2.5 py-0.5 text-[10px] font-semibold">
                  <CheckCircle2 className="h-3 w-3" /> Verified
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                className="mt-4 w-full"
                onClick={() => navigate({ to: "/dashboard/profile" })}
              >
                <User className="mr-2 h-3.5 w-3.5" />
                Edit profile
              </Button>
            </div>

            <nav className="rounded-2xl border border-border bg-card p-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.appOnly && item.appTitle && item.appMessage) {
                      openQr(item.appTitle, item.appMessage);
                    } else {
                      setActiveNav(item.id);
                    }
                  }}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    !item.appOnly && activeNav === item.id
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/80 hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                  {item.badge && (
                    <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                      {item.badge}
                    </span>
                  )}
                  {item.appOnly && (
                    <span className="ml-auto rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                      App
                    </span>
                  )}
                </button>
              ))}
            </nav>

            {isProvider && (
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary mb-1">
                  <Wrench className="h-4 w-4" />
                  Provider Account
                </div>
                <p className="text-xs text-muted-foreground">
                  You can offer services to clients once your account is fully set up.
                </p>
              </div>
            )}
          </aside>

          {/* Main content */}
          <div>
            {activeNav === "bookings" && (
              <>
                <div className="mb-6 flex items-end justify-between">
                  <div>
                    <h1 className="flex items-center gap-2 text-3xl font-extrabold">
                      Welcome back, {firstName}
                      <Hand className="h-6 w-6 text-primary" />
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {isProvider ? "Manage your incoming service requests." : "Here's what's coming up."}
                    </p>
                  </div>
                  {!isProvider && (
                    <Button asChild>
                      <Link to="/services">Book new service</Link>
                    </Button>
                  )}
                </div>

                {/* Client Dashboard Stats */}
                {!isProvider && (
                  <div className="mb-6">
                    {clientDashLoading ? (
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="rounded-xl border border-border bg-card p-4 animate-pulse">
                            <div className="h-4 w-20 bg-muted rounded mb-2" />
                            <div className="h-7 w-12 bg-muted rounded" />
                          </div>
                        ))}
                      </div>
                    ) : clientDashboard ? (
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div className="rounded-xl border border-border bg-card p-4">
                          <p className="text-xs text-muted-foreground">Total Bookings</p>
                          <p className="text-2xl font-bold mt-1">{clientDashboard.total_bookings}</p>
                        </div>
                        <div className="rounded-xl border border-border bg-card p-4">
                          <p className="text-xs text-muted-foreground">Completed</p>
                          <p className="text-2xl font-bold mt-1">{clientDashboard.total_completed_jobs}</p>
                        </div>
                        <div className="rounded-xl border border-border bg-card p-4">
                          <p className="text-xs text-muted-foreground">In Progress</p>
                          <p className="text-2xl font-bold mt-1">{clientDashboard.total_active_jobs}</p>
                        </div>
                        <div className="rounded-xl border border-border bg-card p-4">
                          <p className="text-xs text-muted-foreground">Amount Spent</p>
                          <p className="text-2xl font-bold mt-1">€{Number(clientDashboard.total_amount_spent || 0).toLocaleString("en-EU", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}

                {/* Provider Dashboard Summary */}
                {isProvider && (
                  <div className="mb-6">
                    {(providerLoading || dashLoading) ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    ) : providerDashboard ? (
                      <div className="space-y-4">
                        {/* Inactive Account Notice */}
                        {!providerDashboard.is_active && (
                          <div className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-950/20 p-4">
                            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                              Your provider account is currently inactive. Please contact support for assistance.
                            </p>
                          </div>
                        )}

                        {/* Quick Stats from Dashboard API */}
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                          <StatCard
                            icon={CheckCircle2}
                            label="Jobs Completed"
                            value={providerDashboard.total_jobs_completed}
                          />
                          <StatCard
                            icon={Calendar}
                            label="In Progress"
                            value={providerDashboard.total_jobs_inprogress}
                          />
                          <div className="rounded-xl border border-border bg-card p-4">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                <Wrench className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Availability</p>
                                <p className={`text-sm font-bold ${providerDashboard.is_available ? "text-emerald-600" : "text-gray-500"}`}>
                                  {providerDashboard.is_available ? "Available" : "Unavailable"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Status Update */}
                        {(currentStatus ?? providerProfile?.current_status) && (
                          <div className="rounded-xl border border-border bg-card p-4">
                            <p className="text-xs text-muted-foreground mb-2">Application Status</p>
                            <div className="flex items-center gap-2 mb-3">
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                (currentStatus?.status ?? providerProfile?.current_status?.status ?? "").toLowerCase() === "approved"
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                  : (currentStatus?.status ?? providerProfile?.current_status?.status ?? "").toLowerCase() === "pending"
                                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                    : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                              }`}>
                                {currentStatus?.status ?? providerProfile?.current_status?.status}
                              </span>
                              {(currentStatus?.reason || providerProfile?.current_status?.reason) && (
                                <span className="text-xs text-muted-foreground">— {currentStatus?.reason ?? providerProfile?.current_status?.reason}</span>
                              )}
                            </div>

                            {/* Status Selector */}
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                              <div className="flex-1">
                                <label className="text-xs font-medium text-muted-foreground">Update Status</label>
                                <div className="relative mt-1">
                                  <button
                                    type="button"
                                    onClick={() => setStatusOpen((o) => !o)}
                                    className="flex w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-sm transition hover:bg-accent"
                                  >
                                    <span className={statusForm.status ? "" : "text-muted-foreground"}>
                                      {statusForm.status ? STATUS_OPTIONS.find((o) => o.value === statusForm.status)?.label : "Select status..."}
                                    </span>
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                  </button>
                                  {statusOpen && (
                                    <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-lg border border-border bg-card shadow-lg">
                                      {STATUS_OPTIONS.map((opt) => (
                                        <button
                                          key={opt.value}
                                          type="button"
                                          onClick={() => { setStatusForm((f) => ({ ...f, status: opt.value })); setStatusOpen(false); }}
                                          className="flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-accent"
                                        >
                                          <span>{opt.label}</span>
                                          {statusForm.status === opt.value && <Check className="h-4 w-4 text-primary" />}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                              {statusForm.status && statusForm.status !== "active" && (
                                <div className="flex-1">
                                  <label className="text-xs font-medium text-muted-foreground">Reason (optional)</label>
                                  <input
                                    type="text"
                                    value={statusForm.reason}
                                    onChange={(e) => setStatusForm((f) => ({ ...f, reason: e.target.value }))}
                                    placeholder="e.g. Traveling until next week"
                                    className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                                  />
                                </div>
                              )}
                              {statusForm.status && (
                                <Button
                                  size="sm"
                                  disabled={statusSaving}
                                  onClick={handleStatusUpdate}
                                  className="shrink-0"
                                >
                                  {statusSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update"}
                                </Button>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Status History — expandable */}
                        {currentStatus && (
                          <div className="rounded-xl border border-border bg-card">
                            <button
                              type="button"
                              onClick={() => {
                                setHistoryOpen((o) => !o);
                                if (!historyOpen) loadHistory(); // lazy-load on first expand
                              }}
                              className="flex w-full items-center justify-between p-4 text-sm font-medium text-muted-foreground hover:text-foreground transition"
                            >
                              <span>View Status History</span>
                              <ChevronDown className={`h-4 w-4 transition-transform ${historyOpen ? "rotate-180" : ""}`} />
                            </button>
                            {historyOpen && (
                              <div className="border-t border-border px-4 pb-4">
                                {historyLoading ? (
                                  <div className="flex items-center justify-center py-6">
                                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                  </div>
                                ) : statusHistory.length === 0 ? (
                                  <p className="py-4 text-center text-sm text-muted-foreground">No status history yet.</p>
                                ) : (
                                  <div className="space-y-3 pt-4">
                                    {statusHistory.map((entry, i) => (
                                      <div key={i} className="flex items-start gap-3">
                                        <div className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                                          entry.is_current ? "bg-primary" : "bg-muted-foreground/30"
                                        }`} />
                                        <div className="min-w-0 flex-1">
                                          <div className="flex items-center gap-2">
                                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                                              entry.status.toLowerCase() === "approved"
                                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                                : entry.status.toLowerCase() === "pending"
                                                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                                  : entry.status.toLowerCase() === "declined" || entry.status.toLowerCase() === "suspended"
                                                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                                    : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                                            }`}>
                                              {entry.status}
                                            </span>
                                            {entry.is_current && (
                                              <span className="text-[10px] font-semibold text-primary">Current</span>
                                            )}
                                          </div>
                                          {entry.reason && (
                                            <p className="mt-1 text-xs text-muted-foreground">{entry.reason}</p>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : providerProfile ? (
                      <div className="space-y-4">
                        {/* Status Banner */}
                        {providerProfile.current_status && (
                          <div className={`rounded-xl border p-4 ${
                            providerProfile.current_status.status.toLowerCase() === "approved"
                              ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900/40 dark:bg-emerald-950/20"
                              : providerProfile.current_status.status.toLowerCase() === "pending"
                                ? "border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-950/20"
                                : "border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-950/20"
                          }`}>
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                providerProfile.current_status.status.toLowerCase() === "approved"
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                  : providerProfile.current_status.status.toLowerCase() === "pending"
                                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                              }`}>
                                {providerProfile.current_status.status}
                              </span>
                            </div>
                            {providerProfile.current_status.reason && (
                              <p className="mt-2 text-sm text-muted-foreground">
                                {providerProfile.current_status.reason}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                          <StatCard
                            icon={CheckCircle2}
                            label="Jobs Completed"
                            value={providerProfile.total_jobs_completed}
                          />
                          <StatCard
                            icon={Calendar}
                            label="In Progress"
                            value={providerProfile.total_jobs_inprogress}
                          />
                          <StatCard
                            icon={Star}
                            label="Star Rating"
                            value={providerProfile.star_rating.toFixed(1)}
                          />
                          <StatCard
                            icon={Award}
                            label="Badges"
                            value={providerProfile.badge_count}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                          <StatCard
                            icon={TrendingUp}
                            label="Credibility"
                            value={providerProfile.credibility_score}
                          />
                          <StatCard
                            icon={Clock}
                            label="Avg Response"
                            value={`${providerProfile.response_time_avg}m`}
                          />
                          <StatCard
                            icon={MapPinIcon}
                            label="Radius"
                            value={`${providerProfile.service_radius}km`}
                          />
                          <StatCard
                            icon={Heart}
                            label="Reviews"
                            value={providerProfile.total_reviews}
                          />
                        </div>

                        {/* Bio + Details */}
                        <div className="rounded-xl border border-border bg-card p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-semibold">{providerProfile.provider_type || "Service Provider"}</p>
                              <p className="text-xs text-muted-foreground">{providerProfile.hourly_rate ? `€${providerProfile.hourly_rate}/hr` : "Rate not set"}</p>
                            </div>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              providerProfile.is_available
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                            }`}>
                              {providerProfile.is_available ? "Available" : "Unavailable"}
                            </span>
                          </div>
                          {providerProfile.bio && (
                            <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{providerProfile.bio}</p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-xl border border-border bg-card p-6 text-center">
                        <p className="text-sm text-muted-foreground">Provider profile not available.</p>
                        <Button asChild variant="outline" size="sm" className="mt-3">
                          <Link to="/become-a-skillbuddy">Apply to become a provider</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                <Tabs defaultValue="upcoming">
                  <TabsList>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                  </TabsList>

                  {bookingsLoading ? (
                    <div className="mt-5 space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="rounded-xl border border-border bg-card p-4 animate-pulse">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-muted" />
                            <div className="flex-1 space-y-2">
                              <div className="h-4 w-32 bg-muted rounded" />
                              <div className="h-3 w-48 bg-muted rounded" />
                            </div>
                            <div className="h-6 w-16 bg-muted rounded-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <TabsContent value="upcoming" className="mt-5">
                        <BookingsTabContent
                          bookings={clientBookings}
                          filter={(b) => {
                            const s = getBookingStatus(b).toLowerCase();
                            return s === "upcoming" || s === "pending" || s === "scheduled" || s === "booked";
                          }}
                          emptyLabel="upcoming"
                        />
                      </TabsContent>
                      <TabsContent value="ongoing" className="mt-5">
                        <BookingsTabContent
                          bookings={clientBookings}
                          filter={(b) => {
                            const s = getBookingStatus(b).toLowerCase();
                            return s === "ongoing" || s === "in_progress" || s === "in-progress" || s === "active";
                          }}
                          emptyLabel="ongoing"
                        />
                      </TabsContent>
                      <TabsContent value="completed" className="mt-5">
                        <BookingsTabContent
                          bookings={clientBookings}
                          filter={(b) => {
                            const s = getBookingStatus(b).toLowerCase();
                            return s === "completed" || s === "done" || s === "finished";
                          }}
                          emptyLabel="completed"
                        />
                      </TabsContent>
                    </>
                  )}
                </Tabs>
              </>
            )}

            {activeNav === "settings" && (
              <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                <h2 className="text-lg font-bold">Account Settings</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-medium">{user?.email}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Name</span>
                    <span className="font-medium">{displayName || "—"}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Account type</span>
                    <span className="font-medium capitalize">{user?.role?.toLowerCase() ?? "—"}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Email verified</span>
                    <span className={`font-medium ${user?.is_verified ? "text-emerald-600" : "text-amber-600"}`}>
                      {user?.is_verified ? "Yes" : "No"}
                    </span>
                  </div>
                  {user?.created_at && (
                    <div className="flex items-center justify-between py-3">
                      <span className="text-muted-foreground">Member since</span>
                      <span className="font-medium">
                        {new Date(user.created_at).toLocaleDateString("en-GB", {
                          day: "numeric", month: "long", year: "numeric",
                        })}
                      </span>
                    </div>
                  )}
                </div>
                <Button variant="outline" onClick={() => navigate({ to: "/dashboard/profile" })}>
                  <User className="mr-2 h-4 w-4" />
                  Edit Full Profile
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <QRDownloadModal
        open={qrOpen}
        onOpenChange={setQrOpen}
        title={qrConfig?.title}
        message={qrConfig?.message}
      />
    </SiteShell>
  );
}
