import { describe, it, expect } from 'vitest'

describe('sanity check', () => {
  it('should be true', () => {
    expect(true).toBe(true)
  })
})

import { formatPrice, cn } from './utils';

describe('formatPrice', () => {
  it('formats cents to INR string by default', () => {
    expect(formatPrice(10000)).toBe('₹100');
  });

  it('handles custom currency and locale', () => {
    expect(formatPrice(10000, 'en-US', 'USD')).toBe('$100');
  });
});

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
  });

  it('handles conditional class names', () => {
    expect(cn('bg-red-500', false && 'text-white')).toBe('bg-red-500');
  });

  it('merges tailwind class names correctly', () => {
    expect(cn('p-4', 'p-8')).toBe('p-8');
  });
});
