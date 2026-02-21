"use client";

import { motion } from "framer-motion";

interface CategoryPillsProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}

export default function CategoryPills({ categories, selected, onSelect }: CategoryPillsProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar px-1">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          aria-pressed={selected === cat}
          className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all border whitespace-nowrap ${
            selected === cat
              ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/10"
              : "bg-card text-muted-foreground border-border hover:border-foreground hover:text-foreground hover:bg-secondary/50"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
