import { describe, it, expect } from 'vitest'
import { formatPrice } from './utils'

describe('formatPrice', () => {
  it('should format correctly for INR', () => {
    expect(formatPrice(100000)).toBe('₹1,000.00'); // 1000 INR
  })
})
