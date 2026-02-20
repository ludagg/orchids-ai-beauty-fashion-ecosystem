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

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const isEditable = /INPUT|TEXTAREA/.test(document.activeElement?.tagName || "") || (document.activeElement as any)?.isContentEditable;
      if (e.key === "/" && !isEditable && inputRef.current?.offsetParent) {
        e.preventDefault();
        inputRef.current.focus();
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  return (
    <div className={`relative group ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
      <input
        ref={inputRef}
        type="text"
        aria-label="Search"
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2 bg-secondary border-transparent focus:bg-card focus:border-border rounded-full text-sm transition-all outline-none text-foreground"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && onSubmit) onSubmit(value);
          if (e.key === 'Escape') inputRef.current?.blur();
        }}
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
        {value ? (
          <button onClick={() => { onChange(""); inputRef.current?.focus(); }} className="p-1 rounded-full hover:bg-muted text-muted-foreground" aria-label="Clear search">
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <kbd className="hidden lg:flex h-5 select-none items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground pointer-events-none">/</kbd>
        )}
      </div>
    </div>
  );
}
