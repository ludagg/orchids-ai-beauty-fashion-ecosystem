import { describe, expect, it, mock, beforeEach } from "bun:test";
import { NextRequest } from "next/server";
import { GET } from "./route";

const mockResults = [
  {
    id: "s1",
    name: "Haircut",
    description: "A nice haircut",
    price: 3000,
    duration: 30,
    category: "Hair",
    image: null,
    salonId: "salon1",
    salonName: "Great Salon",
    salonCity: "Paris"
  }
];

const mockQueryBuilder = {
  from: mock(() => mockQueryBuilder),
  leftJoin: mock(() => mockQueryBuilder),
  where: mock(() => mockQueryBuilder),
  orderBy: mock(() => mockQueryBuilder),
  limit: mock(() => Promise.resolve(mockResults))
};

mock.module("@/lib/db", () => ({
  db: {
    select: mock(() => mockQueryBuilder)
  }
}));

describe("GET /api/services", () => {
  beforeEach(() => {
    mockQueryBuilder.limit.mockClear();
  });

  it("should return services", async () => {
    const req = new NextRequest("http://localhost:3000/api/services");
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual(mockResults);
  });

  it("should handle query parameters", async () => {
    const req = new NextRequest("http://localhost:3000/api/services?q=hair&category=Hair&minPrice=10&maxPrice=50&salonId=salon1");
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual(mockResults);
  });
});
