"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4 bg-background/95 backdrop-blur border-t border-border shadow-lg animate-in slide-in-from-bottom-10 duration-200">
      <div className="container mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
          We use cookies to enhance your experience.{" "}
          <Link href="/privacy" className="text-primary underline hover:no-underline">
            Learn more
          </Link>
        </p>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Button 
            variant="ghost" 
            onClick={reject} 
            size="sm"
            className="h-9 px-3 text-xs sm:text-sm"
          >
            Reject All
          </Button>
          <Button 
            onClick={accept} 
            size="sm"
            className="h-9 px-4 text-xs sm:text-sm"
          >
            Accept All
          </Button>
        </div>
      </div>
    </div>
  );
}
