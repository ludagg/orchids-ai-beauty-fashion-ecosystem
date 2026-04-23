import { describe, it, expect, mock, beforeEach, afterEach } from "bun:test";
import { POST } from "./route";
import { NextRequest } from "next/server";

// Mock dependencies
mock.module("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: mock(() => Promise.resolve({ user: { id: "user_1" } }))
    }
  }
}));

mock.module("next/headers", () => ({
  headers: mock(() => Promise.resolve(new Headers()))
}));

mock.module("@/lib/db", () => ({
  db: {
    query: {
      products: {
        findMany: mock(() => Promise.resolve([
          { id: "prod_1", name: "Product 1", originalPrice: 1000, salePrice: null, totalStock: 10 },
          { id: "prod_2", name: "Product 2", originalPrice: 2000, salePrice: 1500, totalStock: 5 }
        ]))
      }
    },
    transaction: mock(async (cb) => {
      const tx = {
        insert: mock(() => ({
          values: mock(() => Promise.resolve())
        }))
      };
      await cb(tx);
    }),
    update: mock(() => ({
      set: mock(() => ({
        where: mock(() => Promise.resolve())
      }))
    }))
  }
}));

mock.module("@/lib/stripe", () => ({
  stripe: {
    paymentIntents: {
      create: mock(() => Promise.resolve({
        id: "pi_123",
        client_secret: "secret_123"
      }))
    }
  }
}));

describe("POST /api/create-payment-intent", () => {
  it("should create a payment intent successfully with valid items", async () => {
    const req = new NextRequest("http://localhost/api/create-payment-intent", {
      method: "POST",
      body: JSON.stringify({
        items: [
          { id: "prod_1", quantity: 2 },
          { id: "prod_2", quantity: 1 }
        ],
        shippingAddress: { city: "Paris" }
      })
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.clientSecret).toBe("secret_123");
    expect(data.orderId).toBeDefined();
  });

  it("should return error if cart is empty", async () => {
    const req = new NextRequest("http://localhost/api/create-payment-intent", {
      method: "POST",
      body: JSON.stringify({ items: [] })
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("Cart is empty");
  });
});
