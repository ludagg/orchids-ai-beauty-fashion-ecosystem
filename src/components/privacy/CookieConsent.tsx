"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Link from "next/link";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consented = localStorage.getItem("cookie-consent");
    const rejected = localStorage.getItem("cookie-rejected");
    if (!consented && !rejected) {
      setIsVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "true");
    localStorage.removeItem("cookie-rejected");
    setIsVisible(false);
  };

  const reject = () => {
    localStorage.setItem("cookie-rejected", "true");
    localStorage.removeItem("cookie-consent");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-2 left-2 right-2 md:bottom-4 md:left-auto md:right-4 md:max-w-md z-50 p-4 bg-background/95 backdrop-blur-xl border border-border/50 shadow-2xl rounded-xl md:rounded-2xl animate-in slide-in-from-bottom-10 duration-500">
      <div className="flex flex-col gap-3 md:gap-4">
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
            We use cookies to enhance your experience and provide personalized content. By using our site, you agree to our use of cookies.
            <Link href="/privacy" className="text-primary font-medium hover:underline ml-1 inline-block">
              Privacy Policy
            </Link>
          </p>
          <button
            onClick={() => setIsVisible(false)}
            className="text-muted-foreground/60 hover:text-foreground transition-colors p-1 -mr-1 -mt-1"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <Button
            onClick={reject}
            variant="outline"
            size="sm"
            className="flex-1 h-8 md:h-10 rounded-lg md:rounded-xl border-border/50 bg-background/50 hover:bg-secondary/80 font-medium text-xs md:text-sm"
          >
            Reject All
          </Button>
          <Button
            onClick={accept}
            size="sm"
            className="flex-1 h-8 md:h-10 rounded-lg md:rounded-xl font-medium shadow-lg shadow-primary/20 text-xs md:text-sm"
          >
            Accept All
          </Button>
        </div>
      </div>
    </div>
  );
}
