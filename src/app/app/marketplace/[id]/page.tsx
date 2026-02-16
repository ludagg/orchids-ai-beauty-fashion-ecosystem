"use client";

import { motion } from "framer-motion";
import {
  ShoppingBag,
  Heart,
  ChevronLeft,
  Star,
  CheckCircle2,
  ShieldCheck,
  Truck,
  RotateCcw,
  Loader2,
  MapPin,
  Clock,
  MessageCircle
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  images: string[] | null;
  category: string | null;
  brand: string | null;
  rating: number;
  reviewCount: number;
  salon: {
    id: string;
    name: string;
    city: string;
  } | null;
}

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image: string | null;
  };
}

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [reserving, setReserving] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [chatLoading, setChatLoading] = useState(false);

  // Review form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      try {
        const [productRes, reviewsRes] = await Promise.all([
            fetch(`/api/products/${id}`),
            fetch(`/api/products/${id}/reviews`)
        ]);

        if (productRes.ok) {
          const data = await productRes.json();
          setProduct(data);
        }
        if (reviewsRes.ok) {
            const data = await reviewsRes.json();
            setReviews(data);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const handleReserve = async () => {
    if (!session) {
      toast.error("Please login to reserve items");
      router.push("/auth?mode=signin");
      return;
    }

    setReserving(true);
    try {
        const res = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                productId: id,
                quantity: quantity
            })
        });

        if (res.ok) {
            toast.success("Product reserved successfully! Pay at salon.");
            router.push('/app/bookings?tab=Orders');
        } else {
            const error = await res.json();
            toast.error(error.error || "Failed to reserve product");
        }
    } catch (error) {
        console.error("Reservation error:", error);
        toast.error("Something went wrong");
    } finally {
        setReserving(false);
    }
  };

  const handleChat = async () => {
    if (!session) {
        toast.error("Please login to chat");
        router.push("/auth?mode=signin");
        return;
    }

    if (!product?.salon) {
        toast.error("Seller information not available");
        return;
    }

    setChatLoading(true);
    try {
        const res = await fetch('/api/conversations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ salonId: product.salon.id })
        });

        if (res.ok) {
            const data = await res.json();
            router.push(`/app/conversations/${data.id}`);
        } else {
            toast.error("Failed to start chat");
        }
    } catch (error) {
        console.error("Chat error:", error);
    } finally {
        setChatLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!session) {
      toast.error("Please login to verify this product");
      return;
    }

    setSubmittingReview(true);
    try {
        const res = await fetch(`/api/products/${id}/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                rating: reviewRating,
                comment: reviewComment
            })
        });

        if (res.ok) {
            const reviewsRes = await fetch(`/api/products/${id}/reviews`);
            if (reviewsRes.ok) {
                setReviews(await reviewsRes.json());
            }
            toast.success("Review submitted!");
            setReviewComment("");
            setReviewRating(5);
        } else {
             const error = await res.json();
             toast.error(error.error || "Failed to submit review");
        }
    } catch (error) {
        console.error("Review error:", error);
    } finally {
        setSubmittingReview(false);
    }
  };

  const formatPrice = (cents: number) => {
    return (cents / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Link href="/app/marketplace" className="text-primary hover:underline mt-4 block">
          Back to Marketplace
        </Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0
    ? product.images
    : ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop"];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto w-full">
      <Link
        href="/app/marketplace"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8 group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Marketplace
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-[3/4] rounded-[40px] overflow-hidden bg-secondary border border-border">
            <motion.img
              key={activeImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              src={images[activeImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activeImage === i ? "border-foreground" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Link href={product.salon ? `/app/salons/${product.salon.id}` : '#'} className="text-sm font-bold text-rose-600 uppercase tracking-widest hover:underline">
                {product.brand || product.salon?.name || "Generic"}
              </Link>
              {product.rating > 0 && (
                <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/30 px-2 py-1 rounded-lg border border-amber-100 dark:border-amber-900/30">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span className="font-bold text-amber-700 dark:text-amber-400">{product.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
            <h1 className="text-4xl sm:text-5xl font-semibold font-display tracking-tight text-foreground mb-4">{product.name}</h1>
            <p className="text-3xl font-bold text-foreground">{formatPrice(product.price)}</p>
          </div>

          <div className="flex items-center gap-4 py-6 border-y border-border">
             {product.stock > 0 ? (
                 <div className="flex items-center gap-2 text-emerald-600 font-medium">
                     <CheckCircle2 className="w-5 h-5" />
                     In Stock ({product.stock} available)
                 </div>
             ) : (
                 <div className="flex items-center gap-2 text-rose-600 font-medium">
                     <CheckCircle2 className="w-5 h-5" />
                     Out of Stock
                 </div>
             )}
             <div className="h-6 w-px bg-border" />
             <div className="flex items-center gap-2 text-muted-foreground font-medium">
                 <ShieldCheck className="w-5 h-5" />
                 Authentic
             </div>
          </div>

          <p className="text-muted-foreground leading-relaxed text-lg">
            {product.description || "No description available for this product."}
          </p>

          <div className="space-y-4">
             <div className="flex items-center justify-between">
                 <span className="font-bold text-foreground">Quantity</span>
                 <div className="flex items-center gap-4 bg-secondary rounded-xl p-1">
                     <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-card shadow-sm font-bold hover:bg-muted"
                     >
                         -
                     </button>
                     <span className="w-4 text-center font-bold">{quantity}</span>
                     <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-card shadow-sm font-bold hover:bg-muted"
                     >
                         +
                     </button>
                 </div>
             </div>

            <button
                onClick={handleReserve}
                disabled={product.stock === 0 || reserving}
                className="w-full h-16 rounded-2xl bg-foreground text-background font-bold text-lg hover:bg-foreground/90 transition-all shadow-xl shadow-foreground/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {reserving ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShoppingBag className="w-5 h-5" />}
                {reserving ? "Reserving..." : "Reserve for Pickup"}
            </button>
            <p className="text-center text-xs text-muted-foreground">
                Reserve online, pay when you collect at <strong>{product.salon?.name || "the salon"}</strong>.
            </p>

            <button
                onClick={handleChat}
                disabled={!product.salon || chatLoading}
                className="w-full h-14 rounded-2xl border border-border bg-card hover:bg-secondary/50 text-foreground font-bold text-lg transition-all flex items-center justify-center gap-2"
            >
                {chatLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <MessageCircle className="w-5 h-5" />}
                Chat with Seller
            </button>
          </div>

          {/* Delivery/Pickup Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-secondary/50 border border-border">
                <MapPin className="w-5 h-5 mb-2 text-primary" />
                <p className="font-bold text-sm">Pickup Location</p>
                <p className="text-xs text-muted-foreground mt-1">{product.salon?.city || "Bangalore"}</p>
            </div>
            <div className="p-4 rounded-2xl bg-secondary/50 border border-border">
                <Clock className="w-5 h-5 mb-2 text-primary" />
                <p className="font-bold text-sm">Ready in</p>
                <p className="text-xs text-muted-foreground mt-1">2-4 hours</p>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="pt-8 border-t border-border space-y-6">
            <h3 className="text-2xl font-bold font-display">Reviews</h3>

             {/* Review Form */}
             {session ? (
                <div className="p-6 rounded-3xl bg-secondary/30 border border-border space-y-4">
                    <h4 className="font-bold text-lg">Write a Review</h4>
                    <div className="flex gap-2 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setReviewRating(star)}
                                className="focus:outline-none transition-transform active:scale-90"
                            >
                                <Star
                                    className={`w-6 h-6 ${
                                        star <= reviewRating
                                        ? "fill-amber-500 text-amber-500"
                                        : "text-muted-foreground"
                                    }`}
                                />
                            </button>
                        ))}
                    </div>
                    <Textarea
                        placeholder="Share your experience..."
                        className="bg-card min-h-[100px]"
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                    />
                    <div className="flex justify-end">
                            <button
                            onClick={handleSubmitReview}
                            disabled={submittingReview}
                            className="px-5 py-2.5 rounded-xl bg-foreground text-background text-sm font-bold hover:bg-foreground/90 transition-all disabled:opacity-50"
                            >
                            {submittingReview ? "Submitting..." : "Submit Review"}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center p-6 bg-secondary/30 rounded-3xl">
                    <p className="text-muted-foreground mb-3">Log in to write a review.</p>
                    <Link href="/auth?mode=signin" className="font-bold text-primary hover:underline">Login</Link>
                </div>
            )}

            <div className="space-y-4">
                {reviews.length === 0 ? (
                    <p className="text-muted-foreground">No reviews yet.</p>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="p-4 rounded-2xl bg-card border border-border">
                             <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-secondary overflow-hidden">
                                        {review.user.image && <img src={review.user.image} className="w-full h-full object-cover" />}
                                    </div>
                                    <span className="font-bold text-sm">{review.user.name}</span>
                                </div>
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? "fill-amber-500 text-amber-500" : "text-muted-foreground/30"}`} />
                                    ))}
                                </div>
                             </div>
                             <p className="text-sm text-muted-foreground">{review.comment}</p>
                        </div>
                    ))
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
