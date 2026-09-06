"use client";

import { useEffect, useState } from 'react';

// A mock version of the product page for testing the UI component standalone
import ProductDetailPage from '@/app/app/shop/product/[id]/page';
import { useParams } from 'next/navigation';

export default function TestPage() {
    return (
        <div>
            <h1>Test Environment</h1>
            <p>We are going to render the component with a mock ID.</p>
        </div>
    );
}
