import { describe, it, expect, vi } from 'vitest';
import { GET } from './route';
import { NextResponse } from 'next/server';

// Mock DB and schema
vi.mock('@/lib/db', () => ({
  db: {
    query: {
      services: { findFirst: vi.fn() },
      openingHours: { findFirst: vi.fn() },
      bookings: { findMany: vi.fn() },
    },
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        innerJoin: vi.fn(() => ({
          where: vi.fn(() => [])
        }))
      }))
    })),
  }
}));

describe('Bookings Availability API - Date Validation', () => {

  const createMockRequest = (dateStr: string | null) => {
    let url = 'http://localhost/api/bookings/availability?salonId=1&serviceId=1';
    if (dateStr !== null) {
      url += `&date=${dateStr}`;
    }
    return new Request(url);
  };

  it('returns 400 if date parameter is missing', async () => {
    const req = new Request('http://localhost/api/bookings/availability?salonId=1&serviceId=1');
    const res = await GET(req) as NextResponse;

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Missing parameters');
  });

  it('returns 400 for invalid format (not YYYY-MM-DD)', async () => {
    const req = createMockRequest('2025/05/01');
    const res = await GET(req) as NextResponse;

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Invalid date format (YYYY-MM-DD)');
  });

  it('returns 400 for invalid format (missing parts)', async () => {
    const req = createMockRequest('2025-05');
    const res = await GET(req) as NextResponse;

    expect(res.status).toBe(400);
  });

  it('returns 400 for rolled-over dates (e.g. Feb 31st)', async () => {
    const req = createMockRequest('2025-02-31');
    const res = await GET(req) as NextResponse;

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Invalid date value');
  });

  it('returns 400 for non-existent months (e.g. 13)', async () => {
    const req = createMockRequest('2025-13-01');
    const res = await GET(req) as NextResponse;

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Invalid date value');
  });

});
