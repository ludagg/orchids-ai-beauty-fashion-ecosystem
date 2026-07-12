"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  images: string[];
  totalStock: number;
  featured?: boolean;
  createdAt?: string | Date;
}

interface ProductCardProps {
  product: Product;
  view?: 'grid' | 'list';
}

export function ProductCard({ product, view = 'grid' }: ProductCardProps) {
  const isSale = product.price < product.originalPrice;
  const isNew = product.createdAt && new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const isLowStock = product.totalStock > 0 && product.totalStock <= 5;
  const isOutOfStock = product.totalStock === 0;

  // Helper to format price
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Optimistic update
    const newState = !isWishlisted;
    setIsWishlisted(newState);
    setIsUpdating(true);

    try {
        if (newState) {
            const res = await fetch('/api/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: product.id })
            });
            if (!res.ok) throw new Error();
            toast.success("Added to wishlist");
        } else {
            const res = await fetch(`/api/favorites?productId=${product.id}`, {
                method: 'DELETE'
            });
            if (!res.ok) throw new Error();
            toast.success("Removed from wishlist");
        }
    } catch (err) {
        setIsWishlisted(!newState); // Revert
        toast.error("Failed to update wishlist");
    } finally {
        setIsUpdating(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price / 100);
  };

  return (
    <div className="group relative">
      <Link href={`/app/shop/product/${product.id}`} className="block">
        <div className={cn(
          "relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md",
          view === 'list' ? "flex flex-row" : "flex flex-col"
        )}>
          {/* Image Container */}
          <div className={cn(
            "relative overflow-hidden bg-muted",
            view === 'list' ? "w-1/3 aspect-[3/4]" : "aspect-[3/4] w-full"
          )}>
            {product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
            ) : (
               <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">No Image</div>
            )}

            {/* Badges */}
            <div className="absolute left-2 top-2 flex flex-col gap-1">
              {isOutOfStock && <Badge variant="destructive">Out of Stock</Badge>}
              {!isOutOfStock && isLowStock && <Badge variant="destructive">Low Stock</Badge>}
              {!isOutOfStock && isSale && <Badge variant="secondary" className="bg-red-500 text-white">Sale</Badge>}
              {!isOutOfStock && isNew && <Badge className="bg-blue-500 text-white">New</Badge>}
            </div>
          </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-4">
          <div className="mb-1 text-xs text-muted-foreground">{product.brand}</div>
          <h3 className="line-clamp-2 text-sm font-medium leading-tight">{product.name}</h3>

          <div
            className="mt-2 flex items-center gap-1"
            role="img"
            aria-label={`Rating: ${product.rating.toFixed(1)} out of 5 stars from ${product.reviewCount} reviews`}
          >
             <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" aria-hidden="true" />
             <span className="text-xs font-medium">{product.rating.toFixed(1)}</span>
             <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
          </div>

          <div className="mt-auto flex items-end gap-2 pt-2">
            <span className="text-base font-bold">{formatPrice(product.price)}</span>
            {isSale && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>

    {/* Wishlist Button - Moved outside Link to fix invalid nesting */}
    <div className={cn(
      "absolute top-2 z-10",
      view === 'list' ? "left-[calc(33.33%-2.5rem)]" : "right-2"
    )}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            disabled={isUpdating}
            className={cn(
              "h-8 w-8 rounded-full backdrop-blur-sm transition-colors",
              isWishlisted
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-black/20 text-white hover:bg-black/40"
            )}
            onClick={toggleWishlist}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            {isUpdating ? (
              <Spinner className="h-4 w-4 text-white" />
            ) : (
              <Heart className={cn("h-4 w-4", isWishlisted && "fill-current")} />
            )}
            <span className="sr-only">{isWishlisted ? "Remove from wishlist" : "Add to wishlist"}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>{isWishlisted ? "Remove from wishlist" : "Add to wishlist"}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  </div>
  );
}
