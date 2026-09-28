"use client";
import AIFitCheckDialog from '@/components/shop/ai/AIFitCheckDialog';

export default function TestAIFit() {
    const mockProduct = {
        id: "test-product-1",
        name: "Test T-Shirt",
        category: "Clothing",
        description: "A very nice test t-shirt.",
    };

    return (
        <div className="p-8 max-w-sm mx-auto">
            <h1 className="text-xl font-bold mb-4">AI Fit Check Demo</h1>
            <AIFitCheckDialog product={mockProduct} />
        </div>
    );
}
