"use client";

import { motion } from "framer-motion";
import {
  Bell,
  Moon,
  Shield,
  Trash2,
  Globe,
  Palette,
  Lock,
  Smartphone,
  Mail,
  Volume2,
  Eye,
  EyeOff,
  LogOut,
  ChevronRight,
  Languages,
  Accessibility,
  SlidersHorizontal,
  UserX,
  KeyRound,
  BadgeCheck,
  AlertTriangle,
  MonitorSmartphone,
  BellRing,
  BellOff,
  Zap,
} from "lucide-react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const ThemeSwitcher = dynamic(
  () => import("@/components/ThemeSwitcher").then((mod) => mod.ThemeSwitcher),
  { ssr: false, loading: () => <div className="w-9 h-9" /> }
);

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

function SettingRow({
  label,
  description,
  children,
  icon,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex items-start gap-3 min-w-0">
        {icon && (
          <div className="mt-0.5 shrink-0 text-muted-foreground">{icon}</div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">{label}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{description}</p>
          )}
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function SectionCard({
  title,
  description,
  icon,
  iconColor,
  children,
  delay = 0,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconColor: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div {...fadeUp} transition={{ delay }}>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${iconColor}`}>{icon}</div>
            <div>
              <CardTitle className="text-base">{title}</CardTitle>
              <CardDescription className="text-xs mt-0.5">{description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="divide-y divide-border">{children}</CardContent>
      </Card>
    </motion.div>
  );
}

export default function SettingsPage() {
  const { data: session } = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut();
    toast.success("Signed out successfully");
    window.location.href = "/";
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6 pb-10">
      <motion.div {...fadeUp}>
        <h1 className="text-2xl sm:text-3xl font-bold font-display">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your account preferences, privacy, and notifications.
        </p>
      </motion.div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6 h-auto">
          <TabsTrigger value="general" className="flex items-center gap-1.5 text-xs sm:text-sm py-2">
            <SlidersHorizontal className="w-3.5 h-3.5 hidden sm:block" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-1.5 text-xs sm:text-sm py-2">
            <Bell className="w-3.5 h-3.5 hidden sm:block" />
            Alerts
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-1.5 text-xs sm:text-sm py-2">
            <Shield className="w-3.5 h-3.5 hidden sm:block" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-1.5 text-xs sm:text-sm py-2">
            <UserX className="w-3.5 h-3.5 hidden sm:block" />
            Account
          </TabsTrigger>
        </TabsList>

        {/* ─── GENERAL ─── */}
        <TabsContent value="general" className="space-y-5 mt-0">
          <SectionCard
            title="Appearance"
            description="Control how the app looks on your device."
            icon={<Palette className="w-4 h-4 text-violet-600" />}
            iconColor="bg-violet-500/10"
            delay={0}
          >
            <SettingRow
              label="Theme Mode"
              description="Switch between light and dark interface."
              icon={<Moon className="w-4 h-4" />}
            >
              <ThemeSwitcher />
            </SettingRow>
            <SettingRow
              label="Accent Color"
              description="Choose your interface accent color."
              icon={<Palette className="w-4 h-4" />}
            >
              <div className="flex items-center gap-2">
                {["bg-rose-500", "bg-violet-500", "bg-blue-500", "bg-emerald-500", "bg-amber-500"].map((color) => (
                  <button
                    key={color}
                    className={`w-5 h-5 rounded-full ${color} ring-2 ring-offset-2 ring-offset-background ${
                      color === "bg-rose-500" ? "ring-rose-500" : "ring-transparent"
                    } hover:scale-110 transition-transform`}
                  />
                ))}
              </div>
            </SettingRow>
          </SectionCard>

          <SectionCard
            title="Language & Region"
            description="Set your preferred language and regional format."
            icon={<Globe className="w-4 h-4 text-blue-600" />}
            iconColor="bg-blue-500/10"
            delay={0.05}
          >
            <SettingRow
              label="Language"
              description="Select the language used across the app."
              icon={<Languages className="w-4 h-4" />}
            >
              <Select defaultValue="en">
                <SelectTrigger className="w-36 h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="hi">हिंदी</SelectItem>
                  <SelectItem value="ar">العربية</SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>
            <SettingRow
              label="Date Format"
              description="Choose how dates are displayed."
              icon={<Globe className="w-4 h-4" />}
            >
              <Select defaultValue="dmy">
                <SelectTrigger className="w-36 h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                  <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                  <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>
          </SectionCard>

          <SectionCard
            title="Accessibility"
            description="Adjust settings to improve your experience."
            icon={<Accessibility className="w-4 h-4 text-emerald-600" />}
            iconColor="bg-emerald-500/10"
            delay={0.1}
          >
            <SettingRow
              label="Reduce Motion"
              description="Minimize animations throughout the app."
              icon={<Zap className="w-4 h-4" />}
            >
              <Switch />
            </SettingRow>
            <SettingRow
              label="Sound Effects"
              description="Play subtle sounds on interactions."
              icon={<Volume2 className="w-4 h-4" />}
            >
              <Switch defaultChecked />
            </SettingRow>
          </SectionCard>
        </TabsContent>

        {/* ─── NOTIFICATIONS ─── */}
        <TabsContent value="notifications" className="space-y-5 mt-0">
          <SectionCard
            title="Delivery Channels"
            description="Choose how you want to receive notifications."
            icon={<MonitorSmartphone className="w-4 h-4 text-amber-600" />}
            iconColor="bg-amber-500/10"
            delay={0}
          >
            <SettingRow
              label="Email Notifications"
              description="Receive updates and summaries via email."
              icon={<Mail className="w-4 h-4" />}
            >
              <Switch defaultChecked />
            </SettingRow>
            <SettingRow
              label="Push Notifications"
              description="Real-time alerts sent to your device."
              icon={<Smartphone className="w-4 h-4" />}
            >
              <Switch defaultChecked />
            </SettingRow>
            <SettingRow
              label="In-App Notifications"
              description="Show notification banners inside the app."
              icon={<BellRing className="w-4 h-4" />}
            >
              <Switch defaultChecked />
            </SettingRow>
          </SectionCard>

          <SectionCard
            title="Activity & Social"
            description="Notifications related to your content and interactions."
            icon={<Bell className="w-4 h-4 text-rose-500" />}
            iconColor="bg-rose-500/10"
            delay={0.05}
          >
            <SettingRow
              label="New Comments"
              description="When someone comments on your creations."
            >
              <Switch defaultChecked />
            </SettingRow>
            <SettingRow
              label="New Followers"
              description="When someone starts following your profile."
            >
              <Switch defaultChecked />
            </SettingRow>
            <SettingRow
              label="Mentions"
              description="When someone tags you in a post or comment."
            >
              <Switch defaultChecked />
            </SettingRow>
            <SettingRow
              label="Direct Messages"
              description="New messages from your conversations."
            >
              <Switch defaultChecked />
            </SettingRow>
          </SectionCard>

          <SectionCard
            title="Bookings & Commerce"
            description="Notifications for reservations and orders."
            icon={<BellRing className="w-4 h-4 text-indigo-500" />}
            iconColor="bg-indigo-500/10"
            delay={0.1}
          >
            <SettingRow
              label="New Bookings"
              description="When someone books a session or appointment with you."
            >
              <Switch defaultChecked />
            </SettingRow>
            <SettingRow
              label="Booking Reminders"
              description="Reminders before your upcoming appointments."
            >
              <Switch defaultChecked />
            </SettingRow>
            <SettingRow
              label="Order Updates"
              description="Shipping and delivery status for your orders."
            >
              <Switch defaultChecked />
            </SettingRow>
            <SettingRow
              label="Promotions & Offers"
              description="Exclusive deals, discounts, and platform updates."
            >
              <Switch />
            </SettingRow>
          </SectionCard>

          <SectionCard
            title="Do Not Disturb"
            description="Pause all notifications during specified hours."
            icon={<BellOff className="w-4 h-4 text-slate-500" />}
            iconColor="bg-slate-500/10"
            delay={0.15}
          >
            <SettingRow
              label="Enable Do Not Disturb"
              description="Silence notifications between 10 PM and 8 AM."
            >
              <Switch />
            </SettingRow>
          </SectionCard>
        </TabsContent>

        {/* ─── PRIVACY ─── */}
        <TabsContent value="privacy" className="space-y-5 mt-0">
          <SectionCard
            title="Profile Visibility"
            description="Control who can see your profile and content."
            icon={<Eye className="w-4 h-4 text-blue-600" />}
            iconColor="bg-blue-500/10"
            delay={0}
          >
            <SettingRow
              label="Public Profile"
              description="Allow anyone to view your profile and creations."
              icon={<Eye className="w-4 h-4" />}
            >
              <Switch defaultChecked />
            </SettingRow>
            <SettingRow
              label="Show in Search Results"
              description="Let other users discover your profile via search."
              icon={<EyeOff className="w-4 h-4" />}
            >
              <Switch defaultChecked />
            </SettingRow>
            <SettingRow
              label="Show Online Status"
              description="Display when you were last active."
            >
              <Switch />
            </SettingRow>
          </SectionCard>

          <SectionCard
            title="Data & Personalization"
            description="Manage how your data is used to improve your experience."
            icon={<SlidersHorizontal className="w-4 h-4 text-purple-600" />}
            iconColor="bg-purple-500/10"
            delay={0.05}
          >
            <SettingRow
              label="Personalized Recommendations"
              description="Use your activity to suggest relevant content."
            >
              <Switch defaultChecked />
            </SettingRow>
            <SettingRow
              label="Analytics & Usage Data"
              description="Share anonymous usage data to help improve the platform."
            >
              <Switch defaultChecked />
            </SettingRow>
            <SettingRow
              label="Third-Party Integrations"
              description="Allow approved partners to access limited profile info."
            >
              <Switch />
            </SettingRow>
          </SectionCard>

          <SectionCard
            title="Security"
            description="Keep your account safe with extra security layers."
            icon={<Lock className="w-4 h-4 text-rose-500" />}
            iconColor="bg-rose-500/10"
            delay={0.1}
          >
            <SettingRow
              label="Two-Factor Authentication"
              description="Require a second verification step when signing in."
              icon={<BadgeCheck className="w-4 h-4" />}
            >
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs border-amber-500/40 text-amber-600 bg-amber-500/5">
                  Off
                </Badge>
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  Enable 2FA
                </Button>
              </div>
            </SettingRow>
            <SettingRow
              label="Change Password"
              description="Update your password to keep your account secure."
              icon={<KeyRound className="w-4 h-4" />}
            >
              <Button variant="outline" size="sm" className="h-8 text-xs">
                Update
              </Button>
            </SettingRow>
            <SettingRow
              label="Active Sessions"
              description="View and manage all devices currently signed in."
              icon={<MonitorSmartphone className="w-4 h-4" />}
            >
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs flex items-center gap-1"
              >
                Manage
                <ChevronRight className="w-3 h-3" />
              </Button>
            </SettingRow>
          </SectionCard>
        </TabsContent>

        {/* ─── ACCOUNT ─── */}
        <TabsContent value="account" className="space-y-5 mt-0">
          <motion.div {...fadeUp} transition={{ delay: 0 }}>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-muted">
                    <Shield className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{session?.user?.name || "Your Account"}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{session?.user?.email || "—"}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge variant="secondary" className="text-xs">
                        {(session?.user as Record<string, unknown>)?.role === "salon_owner" ? "Salon Owner" : "Member"}
                      </Badge>
                      <Badge variant="outline" className="text-xs border-emerald-500/40 text-emerald-600 bg-emerald-500/5">
                        Verified
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div {...fadeUp} transition={{ delay: 0.05 }}>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-500/10">
                    <LogOut className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Session</CardTitle>
                    <CardDescription className="text-xs mt-0.5">Manage your active login session.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="divide-y divide-border">
                <SettingRow
                  label="Sign Out"
                  description="End your current session on this device."
                  icon={<LogOut className="w-4 h-4" />}
                >
                  <Button variant="outline" size="sm" className="h-8 text-xs" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                </SettingRow>
                <SettingRow
                  label="Sign Out Everywhere"
                  description="Terminate all active sessions across every device."
                  icon={<MonitorSmartphone className="w-4 h-4" />}
                >
                  <Button variant="outline" size="sm" className="h-8 text-xs text-destructive border-destructive/30 hover:bg-destructive/5">
                    Sign Out All
                  </Button>
                </SettingRow>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div {...fadeUp} transition={{ delay: 0.1 }}>
            <Card className="border-destructive/30">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-destructive/10">
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                  </div>
                  <div>
                    <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
                    <CardDescription className="text-xs mt-0.5">
                      These actions are permanent and cannot be undone.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="divide-y divide-border">
                <SettingRow
                  label="Export My Data"
                  description="Download a copy of all your personal data and content."
                  icon={<Shield className="w-4 h-4" />}
                >
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    Request Export
                  </Button>
                </SettingRow>
                <div className="py-4">
                  <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <Trash2 className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-destructive">Delete Account</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Permanently delete your account, profile, content, and all associated data. This action is irreversible.
                        </p>
                      </div>
                    </div>
                    <Separator className="bg-destructive/10" />
                    <Button variant="destructive" size="sm" className="w-full sm:w-auto text-xs h-8">
                      Delete My Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
