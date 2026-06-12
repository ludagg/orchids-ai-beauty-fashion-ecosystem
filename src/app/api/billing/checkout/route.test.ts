import { expect, test, describe, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

// Mock dependencies
vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

vi.mock('@/lib/stripe', () => ({
  stripe: {
    checkout: {
      sessions: {
        create: vi.fn(),
      },
    },
  },
}));

import { auth } from '@/lib/auth';
import { stripe } from '@/lib/stripe';

// Mock Request Class to avoid next/server hoisting issues
class MockRequest {
  constructor(public body: any, public headersObj: Record<string, string> = {}) {}

  async json() { return this.body; }

  headers = {
    get: (key: string) => this.headersObj[key] || null,
  };
}

describe('Billing Checkout API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('returns 401 if unauthorized', async () => {
    (auth.api.getSession as any).mockResolvedValueOnce(null);

    const req = new MockRequest({ priceId: 'price_123' });
    const res = await POST(req as any);
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  test('returns 400 if priceId is missing', async () => {
    (auth.api.getSession as any).mockResolvedValueOnce({
      user: { id: 'user_123' },
    });

    const req = new MockRequest({});
    const res = await POST(req as any);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe('Price ID is required');
  });

  test('creates a checkout session and returns url', async () => {
    (auth.api.getSession as any).mockResolvedValueOnce({
      user: { id: 'user_123' },
    });

    (stripe.checkout.sessions.create as any).mockResolvedValueOnce({
      url: 'https://checkout.stripe.com/test',
    });

    const req = new MockRequest({ priceId: 'price_123' }, { origin: 'http://test.com' });
    const res = await POST(req as any);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.url).toBe('https://checkout.stripe.com/test');

    expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(expect.objectContaining({
      mode: 'subscription',
      line_items: [{ price: 'price_123', quantity: 1 }],
      metadata: { userId: 'user_123' },
      success_url: 'http://test.com/app/billing?success=true',
    }));
  });
});