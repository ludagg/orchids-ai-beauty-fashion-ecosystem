"use client";

import { ARTryOn } from '@/components/shop/ai/ARTryOn';

export default function TestPage() {
    return (
        <div className="p-10 flex flex-col items-center justify-center min-h-screen bg-background">
            <h1 className="text-2xl font-bold mb-6">AR Try-On Test Component</h1>
            <ARTryOn />
        </div>
    );
}
