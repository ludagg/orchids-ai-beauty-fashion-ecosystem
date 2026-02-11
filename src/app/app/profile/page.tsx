"use client";

import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Camera } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display">My Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your personal information and preferences.</p>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:opacity-90 transition-opacity">
          Save Changes
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Avatar Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-1"
        >
          <div className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center text-center">
            <div className="relative mb-4 group cursor-pointer">
              <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-violet-500 to-rose-500 flex items-center justify-center text-white text-4xl font-medium shadow-lg">
                JD
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-xl font-semibold">Jane Doe</h2>
            <p className="text-sm text-muted-foreground">Fashion Enthusiast</p>
            <div className="mt-4 px-3 py-1 rounded-full bg-secondary text-xs font-medium text-foreground">
              Member since 2024
            </div>
          </div>
        </motion.div>

        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-2 space-y-6"
        >
          <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="w-5 h-5 text-primary" /> Personal Details
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">First Name</label>
                <input
                  type="text"
                  defaultValue="Jane"
                  className="w-full px-4 py-2 rounded-lg bg-secondary border-transparent focus:bg-background focus:border-primary border transition-colors outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                <input
                  type="text"
                  defaultValue="Doe"
                  className="w-full px-4 py-2 rounded-lg bg-secondary border-transparent focus:bg-background focus:border-primary border transition-colors outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email Address
              </label>
              <input
                type="email"
                defaultValue="jane.doe@example.com"
                className="w-full px-4 py-2 rounded-lg bg-secondary border-transparent focus:bg-background focus:border-primary border transition-colors outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Phone className="w-4 h-4" /> Phone Number
              </label>
              <input
                type="tel"
                defaultValue="+91 98765 43210"
                className="w-full px-4 py-2 rounded-lg bg-secondary border-transparent focus:bg-background focus:border-primary border transition-colors outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Location
              </label>
              <input
                type="text"
                defaultValue="Bangalore, India"
                className="w-full px-4 py-2 rounded-lg bg-secondary border-transparent focus:bg-background focus:border-primary border transition-colors outline-none"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
