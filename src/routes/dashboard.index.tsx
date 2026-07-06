import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/site-shell";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Bell, CreditCard, Heart, Settings, MapPin, Calendar, User, ShoppingBag, Wrench, CheckCircle2, Hand } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getFullName, isProfileComplete } from "@/lib/user-helpers";
import { QRDownloadModal } from "@/components/qr-download-modal";
import { useI18n } from "@/lib/i18n";

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

  const displayName = getFullName(user);
  const firstName = user?.first_name || displayName.split(" ")[0] || "there";
  const location = [user?.city, user?.county].filter(Boolean).join(", ");
  const isProvider = user?.role === "PROVIDER";
  const profileComplete = isProfileComplete(user);

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
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
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

                <Tabs defaultValue="upcoming">
                  <TabsList>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                  </TabsList>
                  <TabsContent value="upcoming" className="mt-5">
                    <EmptyState label="upcoming" />
                  </TabsContent>
                  <TabsContent value="ongoing" className="mt-5">
                    <EmptyState label="ongoing" />
                  </TabsContent>
                  <TabsContent value="completed" className="mt-5">
                    <EmptyState label="completed" />
                  </TabsContent>
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
