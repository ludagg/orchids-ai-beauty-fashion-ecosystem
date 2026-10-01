"use client";

import { ARTryOn } from "@/components/shop/ai/ARTryOn";

export default function TestARPage() {
    return (
        <div className="p-8 max-w-sm mx-auto flex flex-col gap-8 justify-center min-h-screen">
            <h1 className="text-xl font-bold">Isolated AR Try-On Test</h1>
            <ARTryOn />
        </div>
    );
}
