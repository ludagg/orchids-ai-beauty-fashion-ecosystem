"use client";

import { Search, X } from "lucide-react";
import { useRef, useEffect } from "react";
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSubmit) {
      onSubmit(value);
    }
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Focus search on '/' key press if not already in an input
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) {
        if (!e.metaKey && !e.ctrlKey) {
          e.preventDefault();
          // Check if the input is actually visible (not in a hidden responsive container)
          if (inputRef.current && inputRef.current.offsetParent !== null) {
             inputRef.current.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  return (
    <div className={`relative ${className}`} role="search">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
      <input
        ref={inputRef}
        type="search"
        aria-label="Search"
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2 bg-secondary border-transparent focus:bg-card focus:border-border rounded-full text-sm transition-all outline-none text-foreground"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {value ? (
        <button
          type="button"
          onClick={() => {
            onChange("");
            inputRef.current?.focus();
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted text-muted-foreground transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 outline-none"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      ) : (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:block pointer-events-none">
          <Kbd className="bg-background/50 text-[10px] h-4.5 min-w-4.5">/</Kbd>
        </div>
      )}
    </div>
  );
}
