"use client";

import { Search, X } from "lucide-react";
import { useEffect, useRef } from "react";

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
      // Focus search bar on '/' if not already in an input and no modifiers are pressed
      if (
        e.key === "/" &&
        !e.metaKey && !e.ctrlKey &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA" &&
        inputRef.current &&
        inputRef.current.offsetParent !== null // Check if visible
      ) {
        e.preventDefault();
        inputRef.current.focus();
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
        type="text"
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
            onClick={() => {
              onChange("");
              inputRef.current?.focus();
            }}
            className="p-1 rounded-full hover:bg-muted text-muted-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        <kbd className="hidden md:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 pointer-events-none">
          <span className="text-xs">/</span>
        </kbd>
      </div>
    </div>
  );
}
