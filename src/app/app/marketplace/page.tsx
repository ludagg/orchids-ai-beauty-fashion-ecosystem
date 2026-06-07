"use client";

import { motion } from "framer-motion";
import {
  ShoppingBag,
  Filter,
  Star,
  Tag,
  Loader2
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import SearchBar from "@/components/SearchBar";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";

const CATEGORIES = ["All", "Clothing", "Beauty & Skincare", "Hair Care", "Nail Care", "Fragrances", "Accessories", "Wellness"];

interface Product {
  id: string;
  name: string;
  brand: string | null;
  price: number;
  rating: number;
  reviewCount: number;
  images: string[] | null;
  category: string | null;
  salon: {
    name: string;
  } | null;
}

const ProductImage = ({ src, alt, className }: { src?: string | null, alt: string, className?: string }) => {
  const [imgSrc, setImgSrc] = useState(src || "/images/product-placeholder.png");

  useEffect(() => {
    setImgSrc(src || "/images/product-placeholder.png");
  }, [src]);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      className={cn("object-cover transition-transform duration-700 ease-out", className)}
      onError={() => {
        if (imgSrc !== "/images/product-placeholder.png") {
          setImgSrc("/images/product-placeholder.png");
        }
      }}
      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
    />
  );
};

export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory !== "All") {
          params.append("category", selectedCategory);
        }
        if (searchQuery) {
            params.append("search", searchQuery);
        }

        const res = await fetch(`/api/products?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
        fetchProducts();
    }, 300); // Debounce search

    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery]);

  const formatPrice = (cents: number) => {
    return (cents / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1400px] mx-auto w-full">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold font-display tracking-tight text-foreground">Marketplace</h1>
          <p className="text-muted-foreground mt-1 text-base">Curated fashion & beauty from our partners.</p>
        </div>

        <div className="flex items-center gap-3">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search products..."
            className="hidden sm:block w-64"
          />
          <button
            aria-label="Filter products"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm font-medium hover:bg-secondary transition-all"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </section>

      {/* Categories Scroll */}
      <section className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            aria-pressed={selectedCategory === category}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === category
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-card border border-border text-muted-foreground hover:border-foreground hover:text-foreground"
            }`}
          >
            {category}
          </button>
        ))}
      </section>

      {/* Product Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : products.length === 0 ? (
        <div className="py-20">
          <Empty>
            <EmptyHeader>
              <EmptyMedia>
                <ShoppingBag className="w-12 h-12 text-muted-foreground" />
              </EmptyMedia>
              <EmptyTitle>No products found</EmptyTitle>
              <EmptyDescription>
                We couldn&apos;t find any products matching your current filters or search query.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      ) : (
        <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product, i) => (
            <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group"
            >
                <Link href={`/app/marketplace/${product.id}`} className="block h-full flex flex-col">
                <div className="relative aspect-[4/5] rounded-[24px] sm:rounded-[32px] overflow-hidden mb-3 sm:mb-4 shadow-sm border border-border bg-secondary">
                    <ProductImage
                      src={product.images && product.images.length > 0 ? product.images[0] : null}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Overlay Tags */}
                    {product.rating > 4.5 && (
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                        <div className="px-3 py-1 rounded-full bg-background/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 text-foreground">
                            <Tag className="w-3 h-3 text-rose-500" />
                            Featured
                        </div>
                        </div>
                    )}
                </div>

                <div className="px-1 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                    <h3 className="font-semibold text-sm sm:text-[15px] truncate text-foreground pr-2">{product.name}</h3>
                    {product.rating > 0 && (
                        <div className="hidden sm:flex items-center gap-1 text-xs font-bold bg-secondary px-2 py-0.5 rounded-full text-foreground flex-shrink-0">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            {product.rating.toFixed(1)}
                        </div>
                    )}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2 truncate">{product.brand || product.salon?.name}</p>
                    <div className="mt-auto flex items-center justify-between">
                    <p className="font-bold text-base sm:text-lg text-rose-600">{formatPrice(product.price)}</p>
                    {product.reviewCount > 0 && (
                         <p className="text-[10px] sm:text-[11px] text-muted-foreground hidden sm:block">{product.reviewCount} reviews</p>
                    )}
                    </div>
                </div>
                </Link>
            </motion.div>
            ))}
        </section>
      )}
    </div>
  );
}
