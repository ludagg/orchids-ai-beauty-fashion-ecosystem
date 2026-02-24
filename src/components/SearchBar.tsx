"use client";

import { Search, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { Kbd } from "@/components/ui/kbd";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({ value, onChange, onSubmit, placeholder = "Search fashion, salons, styles...", className = "" }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !e.ctrlKey && !e.metaKey) {
        // Don't trigger if user is typing in an input or textarea
        if (
          document.activeElement?.tagName === "INPUT" ||
          document.activeElement?.tagName === "TEXTAREA"
        ) {
          return;
        }

        // Only focus the visible instance
        if (inputRef.current && inputRef.current.offsetParent !== null) {
          e.preventDefault();
          inputRef.current.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSubmit) {
      onSubmit(value);
    }
  };

  return (
    <div className={`relative ${className}`} role="search">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
      <input
        ref={inputRef}
        type="search"
        aria-label="Search"
        placeholder={placeholder}
        className="w-full pl-10 pr-12 py-2 bg-secondary border-transparent focus:bg-card focus:border-border rounded-full text-sm transition-all outline-none text-foreground"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="p-1 rounded-full hover:bg-muted text-muted-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        <Kbd className="hidden md:inline-flex opacity-50">/</Kbd>
      </div>
    </div>
  );
}
