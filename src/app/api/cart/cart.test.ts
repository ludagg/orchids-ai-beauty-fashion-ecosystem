import { describe, it, expect, mock, beforeEach } from "bun:test";
import { NextRequest } from "next/server";
import { GET, POST } from "./route";

// Mock nanoid
mock.module("nanoid", () => ({
  nanoid: () => "mock-nanoid",
}));

// Setup mock DB functions first so we can reference them in the module mock
const mockFindFirstCarts = mock(() => null);
const mockFindFirstCartItems = mock(() => null);
const mockInsertValues = mock(() => Promise.resolve([{ id: "mock-nanoid" }]));
const mockInsertCarts = mock(() => ({ values: mockInsertValues }));
const mockInsertCartItems = mock(() => ({ values: mockInsertValues }));
const mockUpdateSet = mock(() => ({ where: mock(() => Promise.resolve([{ id: "mock-item-id" }])) }));
const mockUpdateCartItems = mock(() => ({ set: mockUpdateSet }));

// Mock next/headers
mock.module("next/headers", () => ({
  headers: mock(() => new Headers()),
}));

// Mock the DB and its schemas
mock.module("@/lib/db", () => ({
  db: {
    query: {
      carts: {
        findFirst: mockFindFirstCarts,
      },
      cartItems: {
        findFirst: mockFindFirstCartItems,
      },
    },
    insert: (schema: any) => {
      if (schema.name === "carts") return mockInsertCarts();
      if (schema.name === "cartItems") return mockInsertCartItems();
      return { values: mock(() => Promise.resolve([])) };
    },
    update: (schema: any) => {
      if (schema.name === "cartItems") return mockUpdateCartItems();
      return { set: mock(() => ({ where: mock(() => Promise.resolve([])) })) };
    },
  },
}));

mock.module("@/db/schema/cart", () => ({
  carts: { name: "carts" },
  cartItems: { name: "cartItems" },
}));

mock.module("@/db/schema/commerce", () => ({
  products: { name: "products" },
}));

// Mock drizzle-orm
mock.module("drizzle-orm", () => ({
  eq: mock((col: any, val: any) => ({ _type: "eq", col, val })),
  and: mock((...args: any[]) => ({ _type: "and", args })),
  isNull: mock((col: any) => ({ _type: "isNull", col })),
}));

// Mock auth
const mockGetSession = mock(() => Promise.resolve(null));
mock.module("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: mockGetSession,
    },
  },
}));

describe("Cart API Routes", () => {
  beforeEach(() => {
    mockGetSession.mockClear();
    mockFindFirstCarts.mockClear();
    mockFindFirstCartItems.mockClear();
    mockInsertValues.mockClear();
    mockInsertCarts.mockClear();
    mockInsertCartItems.mockClear();
    mockUpdateSet.mockClear();
    mockUpdateCartItems.mockClear();
  });

  describe("GET /api/cart", () => {
    it("should return 401 if user is not authenticated", async () => {
      mockGetSession.mockResolvedValue(null);

      const req = new NextRequest("http://localhost:3000/api/cart");
      const res = await GET(req);

      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.error).toBe("Unauthorized");
    });

    it("should return empty items array if no active cart exists", async () => {
      mockGetSession.mockResolvedValue({ user: { id: "user-123" } });
      mockFindFirstCarts.mockResolvedValue(null);

      const req = new NextRequest("http://localhost:3000/api/cart");
      const res = await GET(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.items).toEqual([]);
    });

    it("should return active cart with items", async () => {
      mockGetSession.mockResolvedValue({ user: { id: "user-123" } });
      const mockCart = {
        id: "cart-123",
        userId: "user-123",
        items: [
          { id: "item-1", productId: "prod-1", quantity: 2 }
        ]
      };
      mockFindFirstCarts.mockResolvedValue(mockCart);

      const req = new NextRequest("http://localhost:3000/api/cart");
      const res = await GET(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toEqual(mockCart);
    });
  });

  describe("POST /api/cart", () => {
    it("should return 401 if user is not authenticated", async () => {
      mockGetSession.mockResolvedValue(null);

      const req = new NextRequest("http://localhost:3000/api/cart", {
        method: "POST",
        body: JSON.stringify({ productId: "prod-1", quantity: 1 })
      });
      const res = await POST(req);

      expect(res.status).toBe(401);
    });

    it("should return 400 if productId or quantity is missing", async () => {
      mockGetSession.mockResolvedValue({ user: { id: "user-123" } });

      const req = new NextRequest("http://localhost:3000/api/cart", {
        method: "POST",
        body: JSON.stringify({ productId: "prod-1" }) // missing quantity
      });
      const res = await POST(req);

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toBe("Missing required fields");
    });

    it("should create new cart and insert item if no active cart exists", async () => {
      mockGetSession.mockResolvedValue({ user: { id: "user-123" } });

      // First call finds no cart, so it creates one.
      // Second call (at the end) returns the updated cart.
      mockFindFirstCarts
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ id: "mock-nanoid", items: [{ productId: "prod-1", quantity: 1 }] });

      mockFindFirstCartItems.mockResolvedValue(null);

      const req = new NextRequest("http://localhost:3000/api/cart", {
        method: "POST",
        body: JSON.stringify({ productId: "prod-1", quantity: 1 })
      });

      const res = await POST(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.id).toBe("mock-nanoid");

      expect(mockInsertCarts).toHaveBeenCalled();
      expect(mockInsertCartItems).toHaveBeenCalled();
    });

    it("should update quantity if item already exists in cart", async () => {
      mockGetSession.mockResolvedValue({ user: { id: "user-123" } });

      mockFindFirstCarts.mockResolvedValue({ id: "cart-123", userId: "user-123" });
      mockFindFirstCartItems.mockResolvedValue({ id: "item-123", productId: "prod-1", quantity: 2 });

      const req = new NextRequest("http://localhost:3000/api/cart", {
        method: "POST",
        body: JSON.stringify({ productId: "prod-1", quantity: 3 })
      });

      const res = await POST(req);

      expect(res.status).toBe(200);
      expect(mockUpdateCartItems).toHaveBeenCalled();
      expect(mockInsertCartItems).not.toHaveBeenCalled();
    });
  });
});
