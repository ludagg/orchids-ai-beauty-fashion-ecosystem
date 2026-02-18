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
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        // Only focus if visible
        if (inputRef.current && inputRef.current.offsetParent !== null) {
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
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <input
        ref={inputRef}
        type="text"
        aria-label="Search"
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2 bg-secondary border-transparent focus:bg-card focus:border-border rounded-full text-sm transition-all outline-none text-foreground"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
        {value ? (
          <button
            onClick={() => onChange("")}
            className="p-1 hover:bg-muted rounded-full transition-colors"
            aria-label="Clear search"
          >
            <X className="w-3 h-3 text-muted-foreground" />
          </button>
        ) : (
          <Kbd className="hidden md:flex bg-background border border-border shadow-sm text-[10px] opacity-80">/</Kbd>
        )}
      </div>
    </div>
  );
}
