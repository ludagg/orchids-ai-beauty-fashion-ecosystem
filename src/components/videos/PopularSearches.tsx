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
    <div className="w-full py-3 bg-background border-b border-border/40">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex w-max space-x-3 px-4 pb-2">
          {POPULAR_SEARCHES.map((search) => (
            <Badge
              key={search}
              variant="outline"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all px-4 py-2 text-sm font-medium rounded-full border-muted-foreground/20 hover:border-primary bg-background shadow-sm hover:shadow-md"
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
