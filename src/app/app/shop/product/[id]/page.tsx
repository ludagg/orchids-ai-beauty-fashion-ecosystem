"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Star, Heart, Share2, MapPin, ChevronRight, Check, ShieldCheck, Ruler } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductCard } from '@/components/shop/ProductCard';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useEmblaCarousel from 'embla-carousel-react';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const toggleWishlist = async () => {
    const newState = !isWishlisted;
    setIsWishlisted(newState);
    try {
        if (newState) {
            await fetch('/api/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: product.id })
            });
            toast.success("Added to wishlist");
        } else {
            await fetch(`/api/favorites?productId=${product.id}`, {
                method: 'DELETE'
            });
            toast.success("Removed from wishlist");
        }
    } catch (err) {
        setIsWishlisted(!newState);
        toast.error("Failed to update wishlist");
    }
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`/api/products/${id}`)
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                toast.error(data.error);
                router.push('/app/shop');
                return;
            }
            setProduct(data);
            // Initialize variants
            if (data.colors && data.colors.length > 0) setSelectedColor(data.colors[0]);
            if (data.sizes && data.sizes.length > 0) setSelectedSize(data.sizes[0]);
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            toast.error("Failed to load product");
            setLoading(false);
        });
    }
  }, [id, router]);

  const handleAddToCart = async (goToCheckout = false) => {
    if (!product) return;

    // Check variants
    if (product.colors?.length > 0 && !selectedColor) {
        toast.error("Please select a color");
        return;
    }
    if (product.sizes?.length > 0 && !selectedSize) {
        toast.error("Please select a size");
        return;
    }

    try {
        const res = await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                productId: product.id,
                variantId: null, // Logic to match variant ID if needed, or just store options
                quantity,
                selectedOptions: {
                    color: selectedColor,
                    size: selectedSize
                }
            })
        });

        if (res.ok) {
            toast.success("Added to cart");
            if (goToCheckout) {
                router.push('/app/checkout'); // Or Cart? Prompt says "Book Now goes directly to booking confirmation" -> Checkout
            }
        } else {
            const err = await res.json();
            if (res.status === 401) {
                 toast.error("Please login to continue");
                 // Redirect to login logic
            } else {
                 toast.error(err.error || "Failed to add to cart");
            }
        }
    } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
    }
  };

  if (loading) {
    return <div className="p-4 space-y-4">
        <Skeleton className="h-[300px] w-full rounded-xl" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
    </div>;
  }

  if (!product) return null;

  const isSale = product.salePrice && product.salePrice < product.originalPrice;
  const currentPrice = isSale ? product.salePrice : product.originalPrice;

  // Format Price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price / 100);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Top Bar / Nav (optional, usually provided by layout or back button) */}
      <div className="sticky top-0 z-40 flex items-center justify-between bg-background/80 p-4 backdrop-blur-md">
         <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronRight className="h-6 w-6 rotate-180" />
         </Button>
         <div className="flex gap-2">
            <Button variant="ghost" size="icon">
                <Share2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleWishlist} className={isWishlisted ? "text-red-500" : ""}>
                <Heart className={cn("h-5 w-5", isWishlisted && "fill-current")} />
            </Button>
         </div>
      </div>

      {/* Gallery */}
      <div className="relative aspect-[3/4] w-full bg-muted overflow-hidden" ref={emblaRef}>
        <div className="flex h-full touch-pan-y">
            {[product.mainImageUrl, ...(product.galleryUrls || [])].map((src, index) => (
                <div className="flex-[0_0_100%] min-w-0 relative h-full" key={index}>
                    <Image
                        src={src}
                        alt={`${product.name} - ${index}`}
                        fill
                        className="object-cover"
                        priority={index === 0}
                    />
                </div>
            ))}
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
             {[product.mainImageUrl, ...(product.galleryUrls || [])].map((_, index) => (
                 <div key={index} className="h-1.5 w-1.5 rounded-full bg-white/50" />
             ))}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Header Info */}
        <div className="space-y-2">
             <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-xl font-bold leading-tight">{product.name}</h1>
                    <p className="text-sm text-muted-foreground">{product.brand}</p>
                </div>
                <div className="text-right">
                    <div className="text-lg font-bold">{formatPrice(currentPrice)}</div>
                    {isSale && (
                        <div className="text-sm text-muted-foreground line-through decoration-red-500">
                            {formatPrice(product.originalPrice)}
                        </div>
                    )}
                </div>
             </div>

             <div className="flex items-center gap-2">
                <div className="flex items-center text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="ml-1 text-sm font-medium">{product.rating?.toFixed(1) || "New"}</span>
                </div>
                <span className="text-sm text-muted-foreground">({product.reviewCount || 0} reviews)</span>
             </div>
        </div>

        {/* AI Fit Check */}
        <Dialog>
            <DialogTrigger asChild>
                <div className="flex items-center justify-between rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 cursor-pointer">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white">
                            <Ruler className="h-4 w-4" />
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">
                                AI recommends size M for you
                            </div>
                            <div className="text-xs text-muted-foreground">Based on your profile</div>
                        </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>AI Fit Analysis</DialogTitle>
                    <DialogDescription>
                        We analyzed your previous purchases and profile measurements.
                        This brand typically runs true to size.
                    </DialogDescription>
                </DialogHeader>
                {/* Mock chart or details */}
                <div className="h-40 bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                    Fit Graph Placeholder
                </div>
            </DialogContent>
        </Dialog>

        {/* Variants */}
        <div className="space-y-4">
            {product.colors && product.colors.length > 0 && (
                <div className="space-y-2">
                    <span className="text-sm font-medium">Color: {selectedColor?.name || "Select"}</span>
                    <div className="flex flex-wrap gap-2">
                        {product.colors.map((color: any) => (
                            <button
                                key={color.name}
                                onClick={() => setSelectedColor(color)}
                                className={cn(
                                    "h-8 w-8 rounded-full border-2 transition-all",
                                    selectedColor?.name === color.name ? "border-primary scale-110" : "border-transparent ring-1 ring-border"
                                )}
                                style={{ backgroundColor: color.hex }}
                                aria-label={color.name}
                            />
                        ))}
                    </div>
                </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-2">
                    <span className="text-sm font-medium">Size: {selectedSize?.name || "Select"}</span>
                    <div className="flex flex-wrap gap-2">
                        {product.sizes.map((size: any) => (
                            <button
                                key={size.name}
                                onClick={() => setSelectedSize(size)}
                                className={cn(
                                    "flex h-10 min-w-[2.5rem] items-center justify-center rounded-md border text-sm font-medium transition-colors px-2",
                                    selectedSize?.name === size.name
                                        ? "border-yellow-500 bg-yellow-50 text-yellow-900 ring-1 ring-yellow-500"
                                        : "border-input bg-background hover:bg-accent hover:text-accent-foreground"
                                )}
                            >
                                {size.name}
                                {size.name === 'M' && (
                                     <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                                      </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>

        {/* Key Info */}
        <div className="space-y-3 rounded-lg border p-4 bg-muted/20">
             <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                    <div className="text-sm font-medium">Available at {product.salon?.name || "Partner Salon"}</div>
                    <div className="text-xs text-muted-foreground">{product.salon?.address || "City Center"}</div>
                </div>
             </div>
             <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                     <div className="text-sm font-medium">Return Policy</div>
                     <div className="text-xs text-muted-foreground">Easy returns within 7 days at store.</div>
                </div>
             </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
            <h3 className="font-semibold">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description}
            </p>
        </div>

        {/* Reviews */}
        <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
                 <h3 className="font-semibold">Reviews ({product.reviewCount})</h3>
                 <Button variant="link" className="text-xs h-auto p-0">See all</Button>
            </div>
            {product.reviews && product.reviews.length > 0 ? (
                <div className="space-y-4">
                    {product.reviews.map((review: any) => (
                        <div key={review.id} className="space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded-full bg-gray-200 overflow-hidden relative">
                                     {review.user?.image ? (
                                         <Image src={review.user.image} alt={review.user.name} fill />
                                     ) : (
                                         <div className="flex h-full w-full items-center justify-center text-[10px] font-bold">
                                             {review.user?.name?.charAt(0) || "U"}
                                         </div>
                                     )}
                                </div>
                                <span className="text-sm font-medium">{review.user?.name}</span>
                                <div className="flex text-yellow-500">
                                    {Array.from({ length: review.rating }).map((_, i) => (
                                        <Star key={i} className="h-3 w-3 fill-current" />
                                    ))}
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">{review.comment}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-sm text-muted-foreground">No reviews yet.</div>
            )}
        </div>

        {/* Similar Products */}
        {product.similarProducts && product.similarProducts.length > 0 && (
            <div className="space-y-4 pt-4 border-t">
                <h3 className="font-semibold">You Might Also Like</h3>
                <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 snap-x no-scrollbar">
                  {product.similarProducts.map((p: any) => (
                    <div key={p.id} className="min-w-[160px] w-[160px] snap-center">
                       <ProductCard product={p} />
                    </div>
                  ))}
                </div>
            </div>
        )}

      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex gap-3 max-w-7xl">
            <Button variant="outline" className="flex-1" onClick={() => handleAddToCart(false)}>
                Add to Cart
            </Button>
            <Button className="flex-1 bg-yellow-500 text-black hover:bg-yellow-600 font-bold" onClick={() => handleAddToCart(true)}>
                Book Now
            </Button>
        </div>
      </div>
    </div>
  );
}
