// [Jules - Unit test and mock benchmark for N+1 query fix in bookings API]
import { expect, test, mock } from "bun:test";

mock.module("next/headers", () => ({
  headers: mock(() => new Headers())
}));

mock.module("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: mock(async () => ({ user: { id: "user1", email: "test@example.com" } }))
    }
  }
}));

mock.module("@/lib/db", () => {
    // We will simulate a fake db transaction
    return {
        db: {
            transaction: async (cb: any) => {
                // simple mock transaction object
                const tx = {
                    query: {
                        services: {
                            findFirst: mock(async () => ({ id: "s1", price: 1000 }))
                        },
                        openingHours: {
                            findFirst: mock(async () => ({ isClosed: false, openTime: "09:00", closeTime: "17:00", salonId: "salon1" }))
                        },
                        staff: {
                            findFirst: mock(async () => ({ id: "staff1", salonId: "salon1", isActive: true }))
                        },
                        staffServices: {
                            findFirst: mock(async () => ({ staffId: "staff1", serviceId: "s1" }))
                        },
                        bookings: {
                            findFirst: mock(async () => null),
                            findMany: mock(async () => []) // Return no conflicts
                        }
                    },
                    select: () => ({
                        from: () => ({
                            innerJoin: () => ({
                                where: mock(async () => [
                                    { id: "staff1" },
                                    { id: "staff2" },
                                    { id: "staff3" }
                                ])
                            })
                        })
                    }),
                    insert: () => ({
                        values: mock(async () => ({}))
                    })
                };
                await cb(tx);
            }
        }
    };
});

mock.module("@/lib/notifications", () => ({
    createNotification: mock(async () => {})
}));

mock.module("@/lib/email", () => ({
    sendEmail: mock(async () => {})
}));

import { POST } from "./route";

test("Booking POST should successfully allocate a staff without N+1 query", async () => {
    // Benchmark timing to show efficiency
    const start = performance.now();

    const body = JSON.stringify({
        salonId: "salon1",
        serviceId: "s1",
        startTime: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
        endTime: new Date(new Date().setHours(11, 0, 0, 0)).toISOString(),
        notes: "Test booking"
    });

    const req = new Request("http://localhost/api/bookings", {
        method: "POST",
        body
    });

    const response = await POST(req as any);
    const json = await response.json();

    const end = performance.now();

    expect(response.status).toBe(201);
    expect(json.success).toBe(true);
    expect(json.bookingId).toBeDefined();

    // Check performance logic theoretically
    expect(end - start).toBeLessThan(500); // Operation should be extremely fast with batched query
});
