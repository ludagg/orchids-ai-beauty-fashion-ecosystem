import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface FilterChip {
  label: string;
  value: string;
  count?: number;
}

interface FilterChipsProps {
  filters: FilterChip[];
  selectedValue: string;
  onSelect: (value: string) => void;
  className?: string;
}

export function FilterChips({ filters, selectedValue, onSelect, className }: FilterChipsProps) {
  return (
    <div className={cn("w-full border-b bg-background py-2", className)}>
      <ScrollArea className="w-full whitespace-nowrap px-4">
        <div className="flex w-max space-x-2 p-1">
          {filters.map((filter) => (
            <Button
              key={filter.value}
              variant={selectedValue === filter.value ? "default" : "outline"}
              size="sm"
              onClick={() => onSelect(filter.value)}
              className="rounded-full px-4 h-8 text-xs font-medium transition-colors"
            >
              {filter.label}
              {filter.count !== undefined && (
                <span className="ml-1 text-[10px] opacity-70">({filter.count})</span>
              )}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  );
}
