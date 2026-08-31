import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';
import { db } from '@/lib/db';

vi.mock('@/lib/db', () => ({
  db: {
    query: {
      products: {
        findMany: vi.fn(),
      }
    }
  }
}));

describe('GET /api/shop/home', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return shop home data successfully', async () => {
    // Mock the database responses
    const mockProducts = [
        {
            id: '1',
            name: 'Test Product',
            brand: 'Test Brand',
            originalPrice: 1000,
            salePrice: null,
            rating: 4.5,
            reviewCount: 10,
            mainImageUrl: 'http://example.com/image.jpg',
            galleryUrls: [],
            totalStock: 100,
            featured: true,
            createdAt: new Date('2023-01-01T00:00:00.000Z'),
            salon: { name: 'Test Salon', slug: 'test-salon' }
        }
    ];

    (db.query.products.findMany as any).mockResolvedValue(mockProducts);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);

    // There are 5 queries made in parallel, each gets the same mock data
    expect(data.hero.length).toBe(1);
    expect(data.recommended.length).toBe(1);
    expect(data.trending.length).toBe(1);
    expect(data.newArrivals.length).toBe(1);
    expect(data.bestSellers.length).toBe(1);

    expect(data.hero[0].name).toBe('Test Product');
    expect(data.hero[0].price).toBe(1000); // Check mapping
    expect(data.hero[0].images).toEqual(['http://example.com/image.jpg']);
  });

  it('should handle internal server error when database throws', async () => {
    (db.query.products.findMany as any).mockRejectedValue(new Error('DB Error'));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal Server Error');
  });
});
