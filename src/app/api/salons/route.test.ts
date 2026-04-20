import { describe, expect, it, mock } from "bun:test";

mock.module("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: mock(() => Promise.resolve({ user: { id: "user_123" } })),
    },
  },
}));

mock.module("next/headers", () => ({
  headers: mock(() => new Headers()),
}));

mock.module("@/lib/db", () => ({
  db: {
    select: mock(() => ({
      from: mock(() => ({
        where: mock(() => ({
          limit: mock(() => ({
            orderBy: mock(() => Promise.resolve([{ id: "salon_1", name: "Test Salon" }])),
          })),
        })),
      })),
    })),
    insert: mock(() => ({
      values: mock(() => ({
        returning: mock(() => Promise.resolve([{ id: "salon_new", name: "New Salon" }])),
      })),
    })),
    update: mock(() => ({
      set: mock(() => ({
        where: mock(() => Promise.resolve()),
      })),
    })),
  },
}));

import { GET, POST } from "./route";
import { NextRequest } from "next/server";

describe("Salons API - GET", () => {
  it("should return a list of active salons", async () => {
    const req = new NextRequest("http://localhost/api/salons?limit=10");
    const res = await GET(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toBeInstanceOf(Array);
  });
});

describe("Salons API - POST", () => {
  it("should enforce the new partner schema and reject legacy payloads", async () => {
    // Legacy payload that should now be rejected with a 400 status
    const payload = {
      name: "Legacy Salon",
      description: "Legacy desc",
      address: "123 Main St",
      city: "City",
      zipCode: "123",
      type: "SALON"
    };

    const req = new NextRequest("http://localhost/api/salons", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("Invalid data");
  });
});
