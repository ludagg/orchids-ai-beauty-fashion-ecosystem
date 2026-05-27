import { describe, it, expect, mock, beforeEach } from "bun:test";
import { GET } from "./route";
import { NextRequest } from "next/server";

// Mock the db
mock.module("@/lib/db", () => {
    return {
        db: {
            select: mock(() => ({
                from: mock(() => ({
                    groupBy: mock(() => ({
                        orderBy: mock(() => ({
                            limit: mock().mockResolvedValue([
                                { userId: "user1", videoCount: 10 },
                                { userId: "user2", videoCount: 5 }
                            ])
                        }))
                    }))
                }))
            })),
            query: {
                users: {
                    findMany: mock().mockResolvedValue([
                        { id: "user1", name: "User One", image: "img1" },
                        { id: "user2", name: "User Two", image: "img2" }
                    ])
                },
                videos: {
                    findMany: mock().mockResolvedValue([
                        { userId: "user2" } // user2 is live
                    ])
                }
            }
        }
    };
});

// Need to mock the Drizzle imports to prevent actual DB execution
mock.module("drizzle-orm", () => {
    return {
        eq: mock(),
        desc: mock(),
        count: mock(),
        inArray: mock(),
        and: mock()
    }
});

describe("GET /api/creators", () => {
    it("should return formatted creators with live status prioritizing live users", async () => {
        const req = new NextRequest("http://localhost/api/creators");
        const res = await GET(req);

        expect(res.status).toBe(200);

        const data = await res.json();

        expect(data).toHaveLength(2);

        // user2 is live, so they should be sorted first despite having less videos
        expect(data[0].id).toBe("user2");
        expect(data[0].isLive).toBe(true);
        expect(data[0].name).toBe("User Two");

        expect(data[1].id).toBe("user1");
        expect(data[1].isLive).toBe(false);
        expect(data[1].name).toBe("User One");
    });
});
