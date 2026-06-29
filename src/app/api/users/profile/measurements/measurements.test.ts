import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PATCH } from './route';
import { NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';

const mocks = vi.hoisted(() => {
    const mockUpdate = vi.fn().mockReturnThis();
    const mockSet = vi.fn().mockReturnThis();
    const mockWhere = vi.fn().mockResolvedValue([]);
    const mockGetSession = vi.fn();

    mockUpdate.mockImplementation(() => ({
        set: mockSet.mockImplementation(() => ({
            where: mockWhere
        }))
    }));

    return {
        mockUpdate,
        mockSet,
        mockWhere,
        mockGetSession
    };
});

// Mock next/headers
vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers())
}));

// Mock db
vi.mock('@/lib/db', () => ({
  db: {
    update: mocks.mockUpdate
  }
}));

// Mock better-auth
vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: mocks.mockGetSession
    }
  }
}));

describe('PATCH /api/users/profile/measurements', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if unauthorized', async () => {
    mocks.mockGetSession.mockResolvedValue(null);

    const req = new NextRequest('http://localhost/api/users/profile/measurements', {
      method: 'PATCH',
      body: JSON.stringify({
        height: '180',
        weight: '75',
        bodyType: 'regular'
      }),
    });

    const response = await PATCH(req);
    expect(response.status).toBe(401);
  });

  it('should update measurements', async () => {
    mocks.mockGetSession.mockResolvedValue({
        user: { id: 'test-user-123' }
    });

    const req = new NextRequest('http://localhost/api/users/profile/measurements', {
      method: 'PATCH',
      body: JSON.stringify({
        height: '180',
        weight: '75',
        bodyType: 'regular'
      }),
    });

    const response = await PATCH(req);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.message).toBe('Measurements updated successfully');

    expect(mocks.mockUpdate).toHaveBeenCalled();
    expect(mocks.mockSet).toHaveBeenCalledWith(expect.objectContaining({
        height: '180',
        weight: '75',
        bodyType: 'regular'
    }));
    expect(mocks.mockWhere).toHaveBeenCalled();
  });

  it('should return 400 for invalid input types (if any)', async () => {
    mocks.mockGetSession.mockResolvedValue({
        user: { id: 'test-user-123' }
    });

    const req = new NextRequest('http://localhost/api/users/profile/measurements', {
      method: 'PATCH',
      body: JSON.stringify({
        height: 180, // should be string
        weight: '75',
        bodyType: 'regular'
      }),
    });

    const response = await PATCH(req);
    expect(response.status).toBe(400);
  });
});
