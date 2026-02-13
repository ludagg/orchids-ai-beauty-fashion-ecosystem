"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { Wifi, WifiOff } from "lucide-react";

export default function OfflineDetector() {
  useEffect(() => {
    function handleOnline() {
      toast.dismiss("offline-toast");
      toast.success("Back online", {
        icon: <Wifi className="w-4 h-4" />,
        duration: 3000,
      });
    }

    function handleOffline() {
      toast.error("No internet connection", {
        description: "Please check your network settings.",
        id: "offline-toast",
        duration: Infinity,
        icon: <WifiOff className="w-4 h-4" />,
        // Prevent duplicate toasts if called multiple times rapidly
        action: {
          label: "Retry",
          onClick: () => window.location.reload(),
        },
      });
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initial check
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      handleOffline();
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return null;
}
