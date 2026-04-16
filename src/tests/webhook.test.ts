import { describe, it, expect, beforeEach, afterAll, mock } from 'bun:test';

// Mock NextRequest and NextResponse
mock.module('next/server', () => {
  class NextRequest {
    headers: Map<string, string>;
    constructor(private input: string, private init?: { headers?: Record<string, string> }) {
      this.headers = new Map(Object.entries(init?.headers || {}));
    }
    async text() {
      return this.input;
    }
  }

  const NextResponse = {
    json: (body: any, init?: { status?: number }) => ({
      body,
      status: init?.status || 200,
    }),
  };

  return { NextRequest, NextResponse };
});

mock.module('@/lib/logger', () => ({
  logger: {
    info: mock(),
    error: mock(),
  },
}));

mock.module('@/lib/stripe', () => ({
  stripe: {
    webhooks: {
      constructEvent: mock((body, sig, secret) => {
        if (sig === 'invalid') throw new Error('Invalid signature');
        return { type: 'payment_intent.succeeded', data: { object: { metadata: { orderId: 'test_order' } } } };
      }),
    },
  },
}));

// Mock db
mock.module('@/lib/db', () => {
  const updateMock = mock(() => ({
    set: mock(() => ({
      where: mock(() => ({
        returning: mock(() => [{ id: 'test_order' }]),
      })),
    })),
  }));

  const findFirstMock = mock(() => Promise.resolve({
    id: 'test_order',
    items: [{ productId: 'test_product', quantity: 1 }],
  }));

  return {
    db: {
      update: updateMock,
      query: {
        orders: {
          findFirst: findFirstMock,
        },
      },
    },
  };
});


describe('Stripe Webhook', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = process.env;
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should return 500 if STRIPE_WEBHOOK_SECRET is missing', async () => {
    delete process.env.STRIPE_WEBHOOK_SECRET;

    // Import dynamically after env is changed
    const { POST } = await import('@/app/api/webhooks/stripe/route');
    const { NextRequest } = await import('next/server');

    const req = new NextRequest('dummy_body', {
      headers: { 'Stripe-Signature': 'valid_sig' }
    }) as any;

    const res = await POST(req);
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Server Configuration Error');
  });

  it('should return 400 if signature verification fails', async () => {
    process.env.STRIPE_WEBHOOK_SECRET = 'secret';

    const { POST } = await import('@/app/api/webhooks/stripe/route');
    const { NextRequest } = await import('next/server');

    const req = new NextRequest('dummy_body', {
      headers: { 'Stripe-Signature': 'invalid' }
    }) as any;

    const res = await POST(req);
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Webhook Error: Invalid signature');
  });

  it('should process payment_intent.succeeded successfully', async () => {
    process.env.STRIPE_WEBHOOK_SECRET = 'secret';

    const { POST } = await import('@/app/api/webhooks/stripe/route');
    const { NextRequest } = await import('next/server');

    const req = new NextRequest('dummy_body', {
      headers: { 'Stripe-Signature': 'valid_sig' }
    }) as any;

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(res.body.received).toBe(true);
  });
});
