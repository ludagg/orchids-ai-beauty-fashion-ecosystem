import { describe, it, expect, mock, beforeEach } from 'bun:test';
import { NextRequest } from 'next/server';
import { GET, POST } from './route';

// Mock `next/headers` to prevent "called outside request scope" errors
mock.module('next/headers', () => ({
  headers: mock(() => new Headers())
}));

// Create mocks for the DB operations
const findFirstCartMock = mock();
const insertCartMock = mock();
const findFirstCartItemMock = mock();
const updateCartItemMock = mock();
const insertCartItemMock = mock();

// Mock Drizzle DB and schema
mock.module('@/lib/db', () => ({
  db: {
    query: {
      carts: { findFirst: findFirstCartMock },
      cartItems: { findFirst: findFirstCartItemMock }
    },
    insert: mock(() => ({
      values: insertCartMock
    })),
    update: mock(() => ({
      set: mock(() => ({
        where: updateCartItemMock
      }))
    }))
  }
}));

// Mock `drizzle-orm` operators
mock.module('drizzle-orm', () => ({
  eq: mock(() => 'eq'),
  and: mock(() => 'and'),
  isNull: mock(() => 'isNull')
}));

// Mock Better Auth
const getSessionMock = mock();
mock.module('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: getSessionMock
    }
  }
}));

describe('Cart API Route', () => {
  beforeEach(() => {
    mock.restore();
    findFirstCartMock.mockReset();
    insertCartMock.mockReset();
    findFirstCartItemMock.mockReset();
    updateCartItemMock.mockReset();
    insertCartItemMock.mockReset();
    getSessionMock.mockReset();
  });

  describe('GET', () => {
    it('returns 401 when unauthorized', async () => {
      getSessionMock.mockResolvedValueOnce(null);

      const req = new NextRequest('http://localhost:3000/api/cart');
      const res = await GET(req);

      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.error).toBe('Unauthorized');
    });

    it('returns empty items array when no active cart exists', async () => {
      getSessionMock.mockResolvedValueOnce({ user: { id: 'user_1' } });
      findFirstCartMock.mockResolvedValueOnce(null);

      const req = new NextRequest('http://localhost:3000/api/cart');
      const res = await GET(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toEqual({ items: [] });
    });

    it('returns active cart when it exists', async () => {
      getSessionMock.mockResolvedValueOnce({ user: { id: 'user_1' } });
      const mockCart = { id: 'cart_1', items: [{ id: 'item_1' }] };
      findFirstCartMock.mockResolvedValueOnce(mockCart);

      const req = new NextRequest('http://localhost:3000/api/cart');
      const res = await GET(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toEqual(mockCart);
    });
  });

  describe('POST', () => {
    it('returns 401 when unauthorized', async () => {
      getSessionMock.mockResolvedValueOnce(null);

      const req = new NextRequest('http://localhost:3000/api/cart', {
        method: 'POST',
        body: JSON.stringify({ productId: 'prod_1', quantity: 1 })
      });
      const res = await POST(req);

      expect(res.status).toBe(401);
    });

    it('returns 400 when missing productId or quantity', async () => {
      getSessionMock.mockResolvedValueOnce({ user: { id: 'user_1' } });

      const req = new NextRequest('http://localhost:3000/api/cart', {
        method: 'POST',
        body: JSON.stringify({ quantity: 1 }) // missing productId
      });
      const res = await POST(req);

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toBe('Missing required fields');
    });

    it('creates a new cart if none exists, then adds item', async () => {
      getSessionMock.mockResolvedValueOnce({ user: { id: 'user_1' } });

      // 1. Get or Create Cart -> returns null
      findFirstCartMock.mockResolvedValueOnce(null);
      // 2. Insert Cart Mock
      insertCartMock.mockResolvedValueOnce({ id: 'new_cart' });
      // 3. Find existing item -> returns null
      findFirstCartItemMock.mockResolvedValueOnce(null);
      // 4. Returns the updated cart
      findFirstCartMock.mockResolvedValueOnce({ id: 'new_cart', items: [{ productId: 'prod_1' }] });

      const req = new NextRequest('http://localhost:3000/api/cart', {
        method: 'POST',
        body: JSON.stringify({ productId: 'prod_1', quantity: 1 })
      });

      const res = await POST(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toEqual({ id: 'new_cart', items: [{ productId: 'prod_1' }] });
    });
  });
});
