"use client";

import { motion } from "framer-motion";
import { Activity, Clock, Shield } from "lucide-react";

interface ActivityLog {
  id: string;
  adminId: string | null;
  action: string;
  targetId: string;
  targetType: string;
  createdAt: string;
}

export default function ActivityLogs({ logs }: { logs: ActivityLog[] }) {
  if (!logs || logs.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground bg-card rounded-2xl border border-border">
        <Activity className="w-8 h-8 mx-auto mb-3 opacity-50" />
        <p>No activity logs found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold flex items-center gap-2">
        <Shield className="w-5 h-5 text-indigo-600" />
        Recent Admin Activity
      </h3>
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="divide-y divide-border">
          {logs.map((log) => (
            <div key={log.id} className="p-4 flex items-start gap-4 hover:bg-secondary/50 transition-colors">
              <div className="p-2 bg-secondary rounded-full shrink-0">
                <Clock className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">
                  <span className="font-bold text-indigo-600 uppercase text-[10px] tracking-wider mr-2 px-1.5 py-0.5 bg-indigo-50 rounded">
                    {log.action.replace(/_/g, " ")}
                  </span>
                  on {log.targetType} <span className="font-mono text-xs text-muted-foreground">{log.targetId.substring(0, 8)}...</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  By Admin ID: {log.adminId?.substring(0, 8)}... • {new Date(log.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
