"use client";

import { AIFitCheckDialog } from "@/components/shop/ai/AIFitCheckDialog";
import { ARTryOn } from "@/components/shop/ai/ARTryOn";

// Dummy product for testing without DB dependencies
const dummyProduct = {
    id: "test_1",
    name: "Classic Cotton T-Shirt",
    brand: "Basics Co.",
    category: "Clothing"
};

export default function TestAIPage() {
    return (
        <div className="p-8 max-w-md mx-auto space-y-8 bg-zinc-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-8">AI Features Test Page</h1>

            <div className="space-y-4 bg-white p-6 rounded-xl shadow-sm border">
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Product Info</h2>
                <div className="text-lg font-semibold">{dummyProduct.name}</div>
                <div className="text-sm text-gray-500">{dummyProduct.brand}</div>
            </div>

            <div className="space-y-4">
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">AI Fit Intelligence</h2>
                <AIFitCheckDialog product={dummyProduct} />
            </div>

            <div className="space-y-4">
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Virtual Experience</h2>
                <ARTryOn product={dummyProduct} />
            </div>
        </div>
    );
}
