"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { format } from "date-fns";
import { Loader2, MessageSquare, Star, Search, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Review {
  id: string;
  salonId: string;
  rating: number;
  comment: string | null;
  images: string[] | null;
  isVerified: boolean;
  createdAt: string;
  salonReply: string | null;
  salonReplyAt: string | null;
  user: {
    name: string;
    image: string | null;
  };
  salon: {
    name: string;
    ownerId: string;
  };
}

export default function BusinessReviewsPage() {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchReviews() {
        if (!session?.user?.id) return;

        try {
            const res = await fetch(`/api/reviews?sort=newest`);
            if (res.ok) {
                const allReviews: Review[] = await res.json();
                // Filter where salon.ownerId === session.user.id
                const myReviews = allReviews.filter((r: any) => r.salon?.ownerId === session.user.id);
                setReviews(myReviews);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setLoading(false);
        }
    }

    if (session) {
        fetchReviews();
    }
  }, [session]);

  const handleReply = async (reviewId: string) => {
    if (!replyText.trim()) return;
    setIsSubmitting(true);

    try {
        const res = await fetch(`/api/reviews/${reviewId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ salonReply: replyText })
        });

        if (res.ok) {
            toast.success("Reply posted successfully");
            setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, salonReply: replyText, salonReplyAt: new Date().toISOString() } : r));
            setReplyingId(null);
            setReplyText("");
        } else {
            toast.error("Failed to post reply");
        }
    } catch (error) {
        toast.error("Something went wrong");
    } finally {
        setIsSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold font-display">Reviews Management</h1>
                <p className="text-muted-foreground">Manage and reply to customer reviews across all your salons.</p>
            </div>
        </div>

        <div className="space-y-4">
            {reviews.length === 0 ? (
                <div className="text-center py-20 border rounded-3xl bg-muted/20">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-bold">No reviews yet</h3>
                    <p className="text-muted-foreground">Reviews from your customers will appear here.</p>
                </div>
            ) : (
                reviews.map(review => (
                    <div key={review.id} className="p-6 rounded-3xl bg-card border border-border">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex gap-4">
                                <Avatar>
                                    <AvatarImage src={review.user.image || ""} />
                                    <AvatarFallback>{review.user.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold">{review.user.name}</p>
                                        <span className="text-sm text-muted-foreground">reviewed</span>
                                        <p className="font-bold text-foreground">{review.salon.name}</p>
                                        {review.isVerified && <CheckCircle2 className="w-4 h-4 text-emerald-500" title="Verified Visit" />}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "fill-amber-500 text-amber-500" : "text-muted-foreground/30"}`} />
                                            ))}
                                        </div>
                                        <span className="text-xs text-muted-foreground">{format(new Date(review.createdAt), "MMM d, yyyy")}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className="text-muted-foreground mb-4 pl-14">{review.comment}</p>

                        {review.images && review.images.length > 0 && (
                            <div className="flex gap-2 mb-4 pl-14">
                                {review.images.map((img, i) => (
                                    <div key={i} className="w-16 h-16 rounded-lg overflow-hidden border border-border">
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="pl-14">
                            {review.salonReply ? (
                                <div className="bg-muted/50 p-4 rounded-xl border border-border">
                                    <p className="text-xs font-bold uppercase tracking-wide mb-1 flex items-center gap-2">
                                        <MessageSquare className="w-3 h-3" />
                                        Your Reply
                                        <span className="text-[10px] text-muted-foreground font-normal normal-case ml-auto">
                                            {format(new Date(review.salonReplyAt!), "MMM d, yyyy")}
                                        </span>
                                    </p>
                                    <p className="text-sm">{review.salonReply}</p>
                                </div>
                            ) : replyingId === review.id ? (
                                <div className="space-y-2">
                                    <Textarea
                                        value={replyText}
                                        onChange={e => setReplyText(e.target.value)}
                                        placeholder="Write a reply..."
                                        className="bg-muted/30"
                                    />
                                    <div className="flex gap-2">
                                        <Button size="sm" onClick={() => handleReply(review.id)} disabled={isSubmitting}>
                                            {isSubmitting && <Loader2 className="w-3 h-3 mr-2 animate-spin" />}
                                            Post Reply
                                        </Button>
                                        <Button size="sm" variant="ghost" onClick={() => setReplyingId(null)}>Cancel</Button>
                                    </div>
                                </div>
                            ) : (
                                <Button size="sm" variant="outline" onClick={() => { setReplyingId(review.id); setReplyText(""); }}>
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    Reply
                                </Button>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
  );
}
