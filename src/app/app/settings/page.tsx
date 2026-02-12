"use client";

import { motion } from "framer-motion";
import { Bell, Moon, Shield, Trash2 } from "lucide-react";
import dynamic from "next/dynamic";
// import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const ThemeSwitcher = dynamic(() => import("@/components/ThemeSwitcher").then((mod) => mod.ThemeSwitcher), {
  ssr: false,
  loading: () => <div className="w-9 h-9" />,
});

export default function SettingsPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-display">Settings</h1>
        <p className="text-muted-foreground mt-1">Customize your app experience and preferences.</p>
      </div>

      <div className="space-y-6">
        {/* Appearance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Moon className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Appearance</CardTitle>
              </div>
              <CardDescription>Customize how the app looks on your device.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Theme Mode</Label>
                  <p className="text-sm text-muted-foreground">Select your preferred display theme.</p>
                </div>
                <ThemeSwitcher />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-500" />
                <CardTitle className="text-lg">Notifications</CardTitle>
              </div>
              <CardDescription>Manage how you receive alerts and updates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates about your account via email.</p>
                    </div>
                    <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                    <Label className="text-base">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive real-time alerts on your device.</p>
                    </div>
                    <Switch defaultChecked />
                </div>
              </div>

              <div className="pt-4 border-t">
                 <h4 className="text-sm font-medium mb-4 text-muted-foreground">Creator Updates</h4>
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                        <Label className="text-base">New Bookings</Label>
                        <p className="text-sm text-muted-foreground">Get notified when someone books a session.</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                        <Label className="text-base">New Comments</Label>
                        <p className="text-sm text-muted-foreground">Get notified when someone comments on your creations.</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                 </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Privacy & Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-rose-500" />
                <CardTitle className="text-lg">Privacy & Security</CardTitle>
              </div>
              <CardDescription>Manage your account security and privacy settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
                </div>
                <Button variant="outline">Enable 2FA</Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Change Password</Label>
                  <p className="text-sm text-muted-foreground">Update your password regularly to stay safe.</p>
                </div>
                <Button variant="outline">Update</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

         {/* Account Actions */}
         <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-destructive/50">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-destructive" />
                <CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
              </div>
              <CardDescription>Irreversible actions for your account.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base text-destructive">Delete Account</Label>
                  <p className="text-sm text-muted-foreground">Permanently delete your account and all data.</p>
                </div>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
