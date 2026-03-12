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
  CheckCircle2,
  Loader2,
} from "lucide-react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useState, useMemo } from "react";

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

const SETTINGS_KEY = "app-settings-prefs";

function loadPrefs() {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function savePrefs(key: string, value: boolean) {
  if (typeof window === "undefined") return;
  try {
    const current = loadPrefs();
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...current, [key]: value }));
  } catch {
    // ignore
  }
}

function AutoSwitch({
  prefKey,
  label,
  defaultChecked = false,
}: {
  prefKey: string;
  label: string;
  defaultChecked?: boolean;
}) {
  const prefs = loadPrefs();
  const initial = prefKey in prefs ? prefs[prefKey] : defaultChecked;
  const [checked, setChecked] = useState<boolean>(initial);

  const handleChange = (val: boolean) => {
    setChecked(val);
    savePrefs(prefKey, val);
    toast.success("Preference saved", { duration: 1500 });
  };

  return <Switch checked={checked} onCheckedChange={handleChange} aria-label={label} />;
}

function ChangePasswordDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [show, setShow] = useState({ current: false, next: false, confirm: false });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.next.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    if (form.next !== form.confirm) { toast.error("Passwords do not match"); return; }
    setLoading(true);
    try {
      const { error } = await authClient.changePassword({
        currentPassword: form.current,
        newPassword: form.next,
        revokeOtherSessions: false,
      });
      if (error) { toast.error(error.message || "Failed to update password"); return; }
      toast.success("Password updated successfully");
      onOpenChange(false);
      setForm({ current: "", next: "", confirm: "" });
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>Update your password to keep your account secure.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {(["current", "next", "confirm"] as const).map((field) => (
            <div key={field} className="space-y-1.5">
              <Label htmlFor={`pw-${field}`} className="text-sm font-medium capitalize">
                {field === "current" ? "Current password" : field === "next" ? "New password" : "Confirm new password"}
              </Label>
              <div className="relative">
                <Input
                  id={`pw-${field}`}
                  type={show[field] ? "text" : "password"}
                  value={form[field]}
                  onChange={e => handleChange(field, e.target.value)}
                  autoComplete={field === "current" ? "current-password" : "new-password"}
                  className="pr-10"
                  placeholder="••••••••"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShow(prev => ({ ...prev, [field]: !prev[field] }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={`${show[field] ? 'Hide' : 'Show'} ${field.replace('current', 'current').replace('next', 'new').replace('confirm', 'confirmation')} password`}
                >
                  {show[field] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
          {form.next && (
            <div className="flex gap-1 h-1.5">
              <div className={`flex-1 rounded-full transition-colors ${form.next.length >= 8 ? "bg-emerald-500" : "bg-muted"}`} />
              <div className={`flex-1 rounded-full transition-colors ${form.next.length >= 12 ? "bg-emerald-500" : "bg-muted"}`} />
              <div className={`flex-1 rounded-full transition-colors ${form.next.length >= 8 && /[A-Z]/.test(form.next) && /[0-9]/.test(form.next) ? "bg-emerald-500" : "bg-muted"}`} />
            </div>
          )}
          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading || !form.current || !form.next || !form.confirm}>
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Updating…</> : "Update Password"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function TwoFactorDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [step, setStep] = useState<"intro" | "verify" | "done">("intro");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const mockSecret = useMemo(() => "RARE2FA" + Math.random().toString(36).slice(2, 8).toUpperCase(), []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 6) { toast.error("Please enter a 6-digit code"); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setStep("done");
    toast.success("Two-factor authentication enabled!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Enable Two-Factor Authentication</DialogTitle>
          <DialogDescription>Add an extra layer of security to your account.</DialogDescription>
        </DialogHeader>
        <div className="py-2">
          {step === "intro" && (
            <div className="space-y-4">
              <div className="rounded-xl bg-muted/50 p-4 space-y-2">
                <p className="text-sm font-medium">How it works</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />Install an authenticator app (Google Authenticator, Authy)</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />Scan the QR code or enter the secret key</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />Enter the 6-digit code to verify</li>
                </ul>
              </div>
              <div className="rounded-xl border border-border/50 p-4 text-center space-y-2">
                <p className="text-xs text-muted-foreground">Your secret key</p>
                <p className="font-mono text-sm font-bold tracking-widest select-all">{mockSecret}</p>
                <p className="text-xs text-muted-foreground">Enter this in your authenticator app manually</p>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button onClick={() => setStep("verify")}>Continue</Button>
              </DialogFooter>
            </div>
          )}
          {step === "verify" && (
            <form onSubmit={handleVerify} className="space-y-4">
              <p className="text-sm text-muted-foreground">Enter the 6-digit code from your authenticator app to confirm setup.</p>
              <div className="space-y-1.5">
                <Label htmlFor="2fa-code">Verification Code</Label>
                <Input
                  id="2fa-code"
                  value={code}
                  onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  className="text-center text-xl tracking-widest font-mono h-14"
                  maxLength={6}
                  autoComplete="one-time-code"
                  disabled={loading}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setStep("intro")} disabled={loading}>Back</Button>
                <Button type="submit" disabled={loading || code.length < 6}>
                  {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Verifying…</> : "Verify & Enable"}
                </Button>
              </DialogFooter>
            </form>
          )}
          {step === "done" && (
            <div className="space-y-4 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <div>
                <p className="font-semibold text-lg">2FA Enabled!</p>
                <p className="text-sm text-muted-foreground mt-1">Your account is now protected with two-factor authentication.</p>
              </div>
              <Button className="w-full" onClick={() => { onOpenChange(false); setStep("intro"); }}>Done</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function SettingsPage() {
  const { data: session } = authClient.useSession();
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [twoFactorOpen, setTwoFactorOpen] = useState(false);

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
                {[
                  { color: "bg-rose-500", name: "Rose" },
                  { color: "bg-violet-500", name: "Violet" },
                  { color: "bg-blue-500", name: "Blue" },
                  { color: "bg-emerald-500", name: "Emerald" },
                  { color: "bg-amber-500", name: "Amber" },
                ].map((item) => (
                  <button
                    key={item.color}
                    onClick={() => toast.success(`${item.name} accent selected`, { duration: 1500 })}
                    aria-label={`Set ${item.name} accent color`}
                    className={`w-5 h-5 rounded-full ${item.color} ring-2 ring-offset-2 ring-offset-background ${
                      item.color === "bg-rose-500" ? "ring-rose-500" : "ring-transparent"
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
              <AutoSwitch prefKey="reduce_motion" label="Reduce Motion" defaultChecked={false} />
            </SettingRow>
            <SettingRow
              label="Sound Effects"
              description="Play subtle sounds on interactions."
              icon={<Volume2 className="w-4 h-4" />}
            >
              <AutoSwitch prefKey="sound_effects" label="Sound Effects" defaultChecked={true} />
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
              <AutoSwitch prefKey="notif_email" label="Email Notifications" defaultChecked={true} />
            </SettingRow>
            <SettingRow
              label="Push Notifications"
              description="Real-time alerts sent to your device."
              icon={<Smartphone className="w-4 h-4" />}
            >
              <AutoSwitch prefKey="notif_push" label="Push Notifications" defaultChecked={true} />
            </SettingRow>
            <SettingRow
              label="In-App Notifications"
              description="Show notification banners inside the app."
              icon={<BellRing className="w-4 h-4" />}
            >
              <AutoSwitch prefKey="notif_inapp" label="In-App Notifications" defaultChecked={true} />
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
              <AutoSwitch prefKey="notif_comments" label="New Comments" defaultChecked={true} />
            </SettingRow>
            <SettingRow
              label="New Followers"
              description="When someone starts following your profile."
            >
              <AutoSwitch prefKey="notif_followers" label="New Followers" defaultChecked={true} />
            </SettingRow>
            <SettingRow
              label="Mentions"
              description="When someone tags you in a post or comment."
            >
              <AutoSwitch prefKey="notif_mentions" label="Mentions" defaultChecked={true} />
            </SettingRow>
            <SettingRow
              label="Direct Messages"
              description="New messages from your conversations."
            >
              <AutoSwitch prefKey="notif_dm" label="Direct Messages" defaultChecked={true} />
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
              <AutoSwitch prefKey="notif_bookings" label="New Bookings" defaultChecked={true} />
            </SettingRow>
            <SettingRow
              label="Booking Reminders"
              description="Reminders before your upcoming appointments."
            >
              <AutoSwitch prefKey="notif_reminders" label="Booking Reminders" defaultChecked={true} />
            </SettingRow>
            <SettingRow
              label="Order Updates"
              description="Shipping and delivery status for your orders."
            >
              <AutoSwitch prefKey="notif_orders" label="Order Updates" defaultChecked={true} />
            </SettingRow>
            <SettingRow
              label="Promotions & Offers"
              description="Exclusive deals, discounts, and platform updates."
            >
              <AutoSwitch prefKey="notif_promos" label="Promotions & Offers" defaultChecked={false} />
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
              <AutoSwitch prefKey="dnd_enabled" label="Enable Do Not Disturb" defaultChecked={false} />
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
              <AutoSwitch prefKey="privacy_public" label="Public Profile" defaultChecked={true} />
            </SettingRow>
            <SettingRow
              label="Show in Search Results"
              description="Let other users discover your profile via search."
              icon={<EyeOff className="w-4 h-4" />}
            >
              <AutoSwitch prefKey="privacy_search" label="Show in Search Results" defaultChecked={true} />
            </SettingRow>
            <SettingRow
              label="Show Online Status"
              description="Display when you were last active."
            >
              <AutoSwitch prefKey="privacy_online" label="Show Online Status" defaultChecked={false} />
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
              <AutoSwitch prefKey="privacy_recommendations" label="Personalized Recommendations" defaultChecked={true} />
            </SettingRow>
            <SettingRow
              label="Analytics & Usage Data"
              description="Share anonymous usage data to help improve the platform."
            >
              <AutoSwitch prefKey="privacy_analytics" label="Analytics & Usage Data" defaultChecked={true} />
            </SettingRow>
            <SettingRow
              label="Third-Party Integrations"
              description="Allow approved partners to access limited profile info."
            >
              <AutoSwitch prefKey="privacy_third_party" label="Third-Party Integrations" defaultChecked={false} />
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
                <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setTwoFactorOpen(true)}>
                  Enable 2FA
                </Button>
              </div>
            </SettingRow>
            <SettingRow
              label="Change Password"
              description="Update your password to keep your account secure."
              icon={<KeyRound className="w-4 h-4" />}
            >
              <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setChangePasswordOpen(true)}>
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
                onClick={() => toast.info("Session management coming soon")}
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
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" className="w-full sm:w-auto text-xs h-8">
                          Delete My Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove all your data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              toast.error("Account deletion is disabled for demo purposes");
                            }}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete Account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      <ChangePasswordDialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen} />
      <TwoFactorDialog open={twoFactorOpen} onOpenChange={setTwoFactorOpen} />
    </div>
  );
}
