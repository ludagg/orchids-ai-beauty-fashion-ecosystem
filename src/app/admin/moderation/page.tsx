"use client";

import { ShieldAlert, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ModerationPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-playfair">Content Moderation</h1>
        <Button>Review Queue (0)</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder Stats */}
        <div className="p-6 bg-card rounded-xl border border-border shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <ShieldAlert className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Reviews</p>
              <h3 className="text-2xl font-bold">0</h3>
            </div>
          </div>
        </div>

        <div className="p-6 bg-card rounded-xl border border-border shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Reported Content</p>
              <h3 className="text-2xl font-bold">0</h3>
            </div>
          </div>
        </div>

        <div className="p-6 bg-card rounded-xl border border-border shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Actions Taken</p>
              <h3 className="text-2xl font-bold">0</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder List */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-6 text-center text-muted-foreground py-20">
        <p>No content requires moderation at this time.</p>
      </div>
    </div>
  );
}
