import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Types
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category?: string;
  inStock?: boolean;
  rating?: number;
  reviewCount?: number;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  hasMore: boolean;
}

// API Functions
const fetchProducts = async (params: Record<string, string> = {}): Promise<Product[]> => {
  const searchParams = new URLSearchParams(params);
  const res = await fetch(`/api/products?${searchParams}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
};

const fetchProduct = async (id: string): Promise<Product> => {
  const res = await fetch(`/api/products/${id}`);
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
};

// React Query Hooks
export function useProducts(params: Record<string, string> = {}) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => fetchProducts(params),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id),
    enabled: !!id,
  });
}

// Search Products
export function useSearchProducts(query: string) {
  return useQuery({
    queryKey: ['products', 'search', query],
    queryFn: () => fetchProducts({ search: query }),
    enabled: query.length > 0,
  });
}

// Categories
export function useProductsByCategory(category: string) {
  return useQuery({
    queryKey: ['products', 'category', category],
    queryFn: () => fetchProducts({ category }),
    enabled: !!category,
  });
}
