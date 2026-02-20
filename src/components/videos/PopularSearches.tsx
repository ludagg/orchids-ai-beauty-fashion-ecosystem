import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const POPULAR_SEARCHES = [
  "Makeup Tutorials",
  "Skincare Routine",
  "Summer Fashion",
  "Nail Art Ideas",
  "Hair Care Tips",
  "GRWM",
  "Product Reviews",
  "Sustainable Beauty",
  "DIY Style",
  "Trending Now",
  "Haul",
  "Korean Beauty"
];

export function PopularSearches() {
  return (
    <div className="w-full py-2 bg-background">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex w-max space-x-2 p-4 pt-2">
          {POPULAR_SEARCHES.map((search) => (
            <Badge
              key={search}
              variant="secondary"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-4 py-1.5 text-sm font-normal rounded-full border bg-muted/50"
            >
              #{search.replace(/\s+/g, '')}
            </Badge>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="hidden" />
      </ScrollArea>
    </div>
  );
}
