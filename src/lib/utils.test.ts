import { describe, it, expect } from 'vitest'
import { formatPrice } from './utils'

describe('sanity check', () => {
  it('should be true', () => {
    expect(true).toBe(true)
  })
})

describe('formatPrice', () => {
  it('should format cents into rupees correctly by default', () => {
    // 10000 cents (paise) = 100 INR
    expect(formatPrice(10000)).toBe('₹100')
  })

  it('should format correctly for custom locale and currency', () => {
    // 15000 cents = $150 USD
    expect(formatPrice(15000, 'en-US', 'USD')).toBe('$150')
  })

  it('should handle euros with french locale', () => {
    // 25000 cents = 250 EUR
    const formatted = formatPrice(25000, 'fr-FR', 'EUR')
    // We use match because of potential non-breaking spaces or simple spaces based on environment
    expect(formatted).toMatch(/250(\s| )€/)
  })
})
