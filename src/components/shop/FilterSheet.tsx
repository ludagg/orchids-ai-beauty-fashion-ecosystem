"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SlidersHorizontal, RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

export interface FilterState {
  minPrice: number; // in cents
  maxPrice: number; // in cents
  minRating: number;
  inStock: boolean;
  sortBy: string;
}

export const defaultFilters: FilterState = {
  minPrice: 0,
  maxPrice: 50000, // 500.00
  minRating: 0,
  inStock: false,
  sortBy: 'newest',
};

interface FilterSheetProps {
  filters: FilterState;
  onApply: (newFilters: FilterState) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  triggerClassName?: string;
}

export function FilterSheet({ filters, onApply, open, onOpenChange, triggerClassName }: FilterSheetProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);
  const [isOpen, setIsOpen] = useState(false);

  // Sync props to state when sheet opens
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters, isOpen]);

  const handleApply = () => {
    onApply(localFilters);
    setIsOpen(false);
    if (onOpenChange) onOpenChange(false);
  };

  const handleReset = () => {
    setLocalFilters(defaultFilters);
  };

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(cents / 100);
  };

  const activeFilterCount = (() => {
    let count = 0;
    if (filters.minPrice !== defaultFilters.minPrice || filters.maxPrice !== defaultFilters.maxPrice) count++;
    if (filters.minRating !== defaultFilters.minRating) count++;
    if (filters.inStock !== defaultFilters.inStock) count++;
    if (filters.sortBy !== defaultFilters.sortBy) count++;
    return count;
  })();

  return (
    <Sheet open={open !== undefined ? open : isOpen} onOpenChange={onOpenChange || setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className={triggerClassName}>
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[300px] sm:w-[400px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filter Products</SheetTitle>
          <SheetDescription>
             Refine your search results.
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-8">
          {/* Sort By */}
          <div className="space-y-4">
            <Label>Sort By</Label>
            <Select
              value={localFilters.sortBy}
              onValueChange={(val) => setLocalFilters({ ...localFilters, sortBy: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest Arrivals</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
                <SelectItem value="rating">Top Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Price Range</Label>
              <span className="text-sm text-muted-foreground">
                {formatPrice(localFilters.minPrice)} - {formatPrice(localFilters.maxPrice)}
              </span>
            </div>
            <Slider
              defaultValue={[defaultFilters.minPrice, defaultFilters.maxPrice]}
              value={[localFilters.minPrice, localFilters.maxPrice]}
              max={100000} // Max 1000.00
              step={100}
              onValueChange={(val) => setLocalFilters({ ...localFilters, minPrice: val[0], maxPrice: val[1] })}
              className="py-4"
            />
          </div>

          {/* Rating */}
          <div className="space-y-4">
             <div className="flex items-center justify-between">
              <Label>Minimum Rating</Label>
              <span className="text-sm text-muted-foreground">{localFilters.minRating > 0 ? `${localFilters.minRating}+ Stars` : 'Any'}</span>
            </div>
             <Slider
              defaultValue={[0]}
              value={[localFilters.minRating]}
              max={5}
              step={0.5}
              onValueChange={(val) => setLocalFilters({ ...localFilters, minRating: val[0] })}
              className="py-4"
            />
          </div>

          {/* In Stock */}
          <div className="flex items-center justify-between">
            <Label htmlFor="instock-mode">In Stock Only</Label>
            <Switch
              id="instock-mode"
              checked={localFilters.inStock}
              onCheckedChange={(checked) => setLocalFilters({ ...localFilters, inStock: checked })}
            />
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Button variant="outline" className="flex-1" onClick={handleReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button className="flex-1" onClick={handleApply}>
            Show Results
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
