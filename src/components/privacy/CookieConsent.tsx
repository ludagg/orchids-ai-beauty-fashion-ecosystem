"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Link from "next/link";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consented = localStorage.getItem("cookie-consent");
    if (!consented) {
      setIsVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
  };

  const reject = () => {
    localStorage.setItem("cookie-consent", "rejected");
    setIsVisible(false);
  };

  const close = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur border-t border-border shadow-lg animate-in slide-in-from-bottom-10">
      <div className="container mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground pr-8">
          <p>
            We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
            <Link href="/privacy" className="text-primary underline ml-1">
              Learn more
            </Link>
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <Button 
            onClick={reject} 
            variant="outline" 
            size="sm"
            className="text-xs sm:text-sm h-9 sm:h-10"
          >
            Reject All
          </Button>
          <Button onClick={accept} size="sm" className="text-xs sm:text-sm h-9 sm:h-10">
            Accept All
          </Button>
          <button
            onClick={close}
            className="text-muted-foreground hover:text-foreground p-1.5 rounded-md hover:bg-secondary transition-colors"
            aria-label="Close cookies banner"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
