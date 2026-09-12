"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { GitCompare, Sparkles, Loader2, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

// A small mock context or prop passed in to add products to comparison
// For simplicity in this implementation, we assume products to compare are passed directly
interface CompareDialogProps {
    initialProducts?: any[];
}

export default function CompareDialog({ initialProducts = [] }: CompareDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [products, setProducts] = useState<any[]>(initialProducts);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleCompare = async () => {
        if (products.length < 2) return;

        setLoading(true);
        try {
            const res = await fetch("/api/ai-compare", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productIds: products.map(p => p.id) })
            });

            if (res.ok) {
                const data = await res.json();
                setResult(data);
            }
        } catch (error) {
            console.error("Failed to compare products", error);
        } finally {
            setLoading(false);
        }
    };

    const removeProduct = (id: string) => {
        setProducts(products.filter(p => p.id !== id));
        setResult(null); // Reset result when list changes
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <GitCompare className="w-4 h-4" /> Compare
                    {products.length > 0 && (
                        <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {products.length}
                        </span>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl w-[95vw] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-violet-500" />
                        AI Comparison
                    </DialogTitle>
                    <DialogDescription>
                        Select at least two products to get an AI-powered comparison to help you choose the best option.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Selected Products */}
                    <div className="flex flex-wrap gap-4 items-end">
                        {products.map(product => (
                            <div key={product.id} className="relative w-24 h-32 border rounded-lg overflow-hidden group">
                                <img src={product.mainImageUrl || product.images?.[0] || 'https://via.placeholder.com/150'} alt={product.name} className="w-full h-full object-cover" />
                                <button
                                    onClick={() => removeProduct(product.id)}
                                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                                <div className="absolute bottom-0 inset-x-0 bg-background/80 backdrop-blur-sm p-1 text-[10px] truncate text-center font-medium">
                                    {product.name}
                                </div>
                            </div>
                        ))}

                        {products.length < 3 && (
                            <div className="w-24 h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-muted-foreground gap-2 cursor-pointer hover:bg-muted/50 transition-colors">
                                <Plus className="w-6 h-6" />
                                <span className="text-[10px] text-center px-2">Add item</span>
                            </div>
                        )}
                    </div>

                    {!result && (
                        <Button
                            onClick={handleCompare}
                            disabled={products.length < 2 || loading}
                            className="w-full bg-violet-600 hover:bg-violet-700 text-white"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <GitCompare className="w-4 h-4 mr-2" />}
                            Compare Now
                        </Button>
                    )}

                    {loading && (
                        <div className="py-8 text-center text-muted-foreground animate-pulse">
                            AI is analyzing product features and reviews...
                        </div>
                    )}

                    {result && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-violet-50 dark:bg-violet-950/20 p-4 rounded-lg border border-violet-100 dark:border-violet-900/50">
                                <p className="text-sm font-medium leading-relaxed">{result.summary}</p>
                            </div>

                            <div className="border rounded-lg overflow-hidden">
                                <div className="grid grid-cols-[100px_1fr] md:grid-cols-[120px_1fr] divide-x">
                                    {/* Features loop */}
                                    {result.features?.map((feature: any, idx: number) => (
                                        <div key={idx} className="contents">
                                            <div className="bg-muted p-3 text-xs font-semibold flex items-center border-b last:border-b-0">
                                                {feature.name}
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-3 divide-x border-b last:border-b-0">
                                                {products.map(p => (
                                                    <div
                                                        key={p.id}
                                                        className={`p-3 text-xs leading-relaxed ${result.recommendation === p.id ? 'bg-green-50/50 dark:bg-green-950/10' : ''}`}
                                                    >
                                                        {feature.values[p.id] || "N/A"}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
