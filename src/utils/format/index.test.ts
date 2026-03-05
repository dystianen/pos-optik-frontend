import { formatCurrency, formatDate, formatLabel, formatSlug } from '@/utils/format'

describe('formatCurrency', () => {
  it('should format numbers to IDR currency', () => {
    // Note: Intl.NumberFormat might use non-breaking spaces or different characters for currency symbols depending on environment
    // We use a regex or check for the presence of "Rp" and correct digits
    const result = formatCurrency(10000)
    expect(result).toMatch(/Rp/)
    expect(result).toMatch(/10\.000/)
  })

  it('should handle string inputs', () => {
    const result = formatCurrency('15000')
    expect(result).toMatch(/15\.000/)
  })

  it('should format zero correctly', () => {
    const result = formatCurrency(0)
    expect(result).toMatch(/0/)
  })
})

describe('formatDate', () => {
  it('should format date strings correctly', () => {
    const date = '2024-03-05T10:00:00Z'
    const result = formatDate(date)
    // The actual output depends on timezone, but format is 'DD MMMM YYYY HH:mm'
    expect(result).toMatch(/\d{2} \w+ \d{4} \d{2}:\d{2}/)
  })
})

describe('formatLabel', () => {
  it('should convert kebab-case to Title Case', () => {
    expect(formatLabel('best-seller')).toBe('Best Seller')
    expect(formatLabel('new-eye-wear')).toBe('New Eye Wear')
  })

  it('should handle single words', () => {
    expect(formatLabel('product')).toBe('Product')
  })
})

describe('formatSlug', () => {
  it('should convert names to kebab-case', () => {
    expect(formatSlug('Best Seller')).toBe('best-seller')
    expect(formatSlug('  New Eye Wear  ')).toBe('new-eye-wear')
  })

  it('should handle special characters (basic)', () => {
    expect(formatSlug('Product Name!')).toBe('product-name!')
  })
})
