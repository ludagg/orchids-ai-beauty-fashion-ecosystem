import { describe, it, expect } from 'vitest'
import { formatPrice } from './utils'

describe('sanity check', () => {
  it('should be true', () => {
    expect(true).toBe(true)
  })
})

describe('formatPrice', () => {
  it('should format cents to INR by default', () => {
    // 1000 cents = 10.00 INR
    const result = formatPrice(1000);
    // Depending on the exact Node.js version, it might insert narrow non-breaking spaces or regular spaces.
    // We check if it contains the symbol '₹' and '10.00'
    expect(result).toContain('₹');
    expect(result).toContain('10.00');
  })

  it('should format cents to EUR if specified', () => {
    const result = formatPrice(1500, 'fr-FR', 'EUR');
    expect(result).toContain('€');
    expect(result).toContain('15,00');
  })

  it('should format cents to USD if specified', () => {
    const result = formatPrice(2500, 'en-US', 'USD');
    expect(result).toContain('$');
    expect(result).toContain('25.00');
  })
})
