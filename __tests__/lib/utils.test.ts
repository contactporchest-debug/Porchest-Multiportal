import { formatNumber, formatCurrency, formatDate, formatDateTime } from '@/lib/utils'

describe('Utility Functions', () => {
  describe('formatNumber', () => {
    it('should format numbers under 1000 as-is', () => {
      expect(formatNumber(500)).toBe('500')
      expect(formatNumber(999)).toBe('999')
    })

    it('should format thousands with K suffix', () => {
      expect(formatNumber(1000)).toBe('1.0K')
      expect(formatNumber(5500)).toBe('5.5K')
      expect(formatNumber(999999)).toBe('1000.0K')
    })

    it('should format millions with M suffix', () => {
      expect(formatNumber(1000000)).toBe('1.0M')
      expect(formatNumber(2500000)).toBe('2.5M')
    })
  })

  describe('formatCurrency', () => {
    it('should format USD currency by default', () => {
      expect(formatCurrency(1000)).toBe('$1,000')
      expect(formatCurrency(1500.50)).toBe('$1,501')
    })

    it('should format different currencies', () => {
      expect(formatCurrency(1000, 'EUR')).toBe('€1,000')
      expect(formatCurrency(1000, 'GBP')).toBe('£1,000')
    })
  })

  describe('formatDate', () => {
    it('should format dates correctly', () => {
      const date = new Date('2025-01-15')
      const formatted = formatDate(date)
      expect(formatted).toContain('Jan')
      expect(formatted).toContain('15')
      expect(formatted).toContain('2025')
    })
  })

  describe('formatDateTime', () => {
    it('should format datetime with time', () => {
      const date = new Date('2025-01-15T14:30:00')
      const formatted = formatDateTime(date)
      expect(formatted).toContain('Jan')
      expect(formatted).toContain('2:30')
    })
  })
})
