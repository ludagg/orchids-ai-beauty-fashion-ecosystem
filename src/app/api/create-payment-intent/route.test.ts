import { describe, it, expect, mock, beforeEach } from "bun:test";
import { POST } from "./route";
import { NextRequest } from "next/server";

// Mock better-auth using module mocking
mock.module("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: async () => ({
        user: { id: "user_123" }
      })
    }
  }
}));

// Provide empty implementations to avoid missing native Next.js server functions during tests
mock.module("next/headers", () => ({
  headers: async () => new Headers()
}));

// Mock Stripe so it doesn't attempt real network requests
mock.module("@/lib/stripe", () => ({
  stripe: {
    paymentIntents: {
      create: async (params: any) => ({
        id: "pi_mock123",
        client_secret: "mock_secret"
      })
    }
  }
}));

// Mock nanoid to have predictable ids
mock.module("nanoid", () => ({
  nanoid: () => "mock-nanoid"
}));

// Mock DB interactions for both queries and transactions
let transactionMock: ReturnType<typeof mock>;
let insertValuesMock: ReturnType<typeof mock>;

mock.module("@/lib/db", () => {
  insertValuesMock = mock((values: any) => Promise.resolve());

  const insertMock = mock((table: any) => ({
    values: insertValuesMock
  }));

  const updateMock = mock((table: any) => ({
    set: mock().mockReturnThis(),
    where: mock().mockResolvedValue(true)
  }));

  transactionMock = mock(async (callback: any) => {
    // Provide a mocked tx object
    const tx = {
      insert: insertMock,
    };
    await callback(tx);
  });

  return {
    db: {
      query: {
        products: {
          findMany: async () => [
            { id: "prod_1", name: "Product 1", totalStock: 10, salePrice: null, originalPrice: 1000 }, // 1000 cents = 10 units
            { id: "prod_2", name: "Product 2", totalStock: 5, salePrice: 1500, originalPrice: 2000 }
          ]
        }
      },
      transaction: transactionMock,
      update: updateMock,
    }
  };
});

describe("POST /api/create-payment-intent", () => {
  beforeEach(() => {
    if (transactionMock) transactionMock.mockClear();
    if (insertValuesMock) insertValuesMock.mockClear();
  });

  it("should process checkout and batch insert order items", async () => {
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

    // Verify successful response
    expect(res.status).toBe(200);
    expect(data.clientSecret).toBe("mock_secret");
    expect(data.orderId).toBe("mock-nanoid");

    // Verify transaction was called once
    expect(transactionMock).toHaveBeenCalledTimes(1);

    // Verify insert.values() was called twice:
    // 1st time for the `orders` table (1 object)
    // 2nd time for the `orderItems` table (1 array with 2 objects) -> Batch insert verified
    expect(insertValuesMock).toHaveBeenCalledTimes(2);

    // Check the second call arguments (the array of items)
    const itemsInserted = insertValuesMock.mock.calls[1][0];
    expect(Array.isArray(itemsInserted)).toBe(true);
    expect(itemsInserted.length).toBe(2);

    // Validate logic for price mappings (Schema validation)
    expect(itemsInserted[0].productId).toBe("prod_1");
    expect(itemsInserted[0].priceAtPurchase).toBe(1000); // from originalPrice

    expect(itemsInserted[1].productId).toBe("prod_2");
    expect(itemsInserted[1].priceAtPurchase).toBe(1500); // from salePrice
  });

  it("should reject if stock is insufficient based on totalStock", async () => {
    const req = new NextRequest("http://localhost/api/create-payment-intent", {
      method: "POST",
      body: JSON.stringify({
        items: [
          { id: "prod_2", quantity: 10 } // db has totalStock 5
        ],
      })
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toContain("Insufficient stock");
    expect(transactionMock).not.toHaveBeenCalled();
  });
});
