import { describe, it, expect } from 'vitest'
import { formatPrice } from './utils'

describe('sanity check', () => {
  it('should be true', () => {
    expect(true).toBe(true)
  })
})

describe('formatPrice', () => {
  it('should format cents into INR currency string by default', () => {
    expect(formatPrice(10000)).toBe('₹100') // 10000 cents = 100 INR
    expect(formatPrice(5500)).toBe('₹55')
  })

  it('should format cents into specified currency string', () => {
    const formatted = formatPrice(10000, 'en-US', 'USD')
    // Node 18+ Intl.NumberFormat might use narrower spaces or exact formats, but it should contain $100
    expect(formatted).toContain('100')
    expect(formatted).toContain('$')
  })
})
