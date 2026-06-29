import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PATCH } from './route';
import { NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';

// Mock next/headers
vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers())
}));

const { mockUpdate, mockSet, mockWhere, mockGetSession } = vi.hoisted(() => {
    const _mockUpdate = vi.fn().mockReturnThis();
    const _mockSet = vi.fn().mockReturnThis();
    const _mockWhere = vi.fn().mockResolvedValue([]);
    const _mockGetSession = vi.fn();

    _mockUpdate.mockImplementation(() => ({
        set: _mockSet.mockImplementation(() => ({
            where: _mockWhere
        }))
    }));

    return {
        mockUpdate: _mockUpdate,
        mockSet: _mockSet,
        mockWhere: _mockWhere,
        mockGetSession: _mockGetSession
    };
});

// Mock db
vi.mock('@/lib/db', () => ({
  db: {
    update: mockUpdate
  }
}));

// Mock better-auth
vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: mockGetSession
    }
  }
}));

describe('PATCH /api/users/profile/measurements', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if unauthorized', async () => {
    mockGetSession.mockResolvedValue(null);

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
    mockGetSession.mockResolvedValue({
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

    expect(mockUpdate).toHaveBeenCalled();
    expect(mockSet).toHaveBeenCalledWith(expect.objectContaining({
        height: '180',
        weight: '75',
        bodyType: 'regular'
    }));
    expect(mockWhere).toHaveBeenCalled();
  });

  it('should return 400 for invalid input types (if any)', async () => {
    mockGetSession.mockResolvedValue({
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
