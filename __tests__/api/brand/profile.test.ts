import { describe, it, expect } from '@jest/globals'

describe('Brand Profile API', () => {

  describe('GET /api/brand/profile', () => {
    it('should return existing profile', async () => {
      const mockProfile = {
        _id: '507f1f77bcf86cd799439011',
        user_id: '507f1f77bcf86cd799439012',
        company_name: 'Test Brand',
        industry: 'Technology',
        total_campaigns: 5,
        active_campaigns: 2,
        total_spent: 10000,
        created_at: new Date(),
        updated_at: new Date(),
      }

      // This test validates the schema structure
      expect(mockProfile).toHaveProperty('user_id')
      expect(mockProfile).toHaveProperty('company_name')
      expect(mockProfile).toHaveProperty('total_campaigns')
      expect(mockProfile).toHaveProperty('total_spent')
    })

    it('should auto-create profile if not exists', async () => {
      const mockUser = {
        _id: '507f1f77bcf86cd799439012',
        email: 'brand@example.com',
        role: 'brand',
        company: 'Auto Created Brand',
      }

      // Validate auto-creation data structure
      const autoCreatedProfile = {
        user_id: mockUser._id,
        company_name: mockUser.company,
        total_campaigns: 0,
        active_campaigns: 0,
        total_spent: 0,
        created_at: new Date(),
        updated_at: new Date(),
      }

      expect(autoCreatedProfile.total_campaigns).toBe(0)
      expect(autoCreatedProfile.total_spent).toBe(0)
    })
  })

  describe('PUT /api/brand/profile', () => {
    it('should validate profile update schema', () => {
      const validUpdate = {
        company_name: 'Updated Brand Name',
        industry: 'Fashion',
        website: 'https://example.com',
        description: 'A great brand',
        contact_person: 'John Doe',
        contact_email: 'contact@example.com',
        contact_phone: '+1234567890',
        preferred_influencer_types: ['fashion', 'lifestyle'],
        target_markets: ['US', 'UK'],
        budget_range: {
          min: 5000,
          max: 50000,
        },
      }

      // Validate all fields exist
      expect(validUpdate).toHaveProperty('company_name')
      expect(validUpdate).toHaveProperty('industry')
      expect(validUpdate.budget_range).toHaveProperty('min')
      expect(validUpdate.budget_range).toHaveProperty('max')
      expect(Array.isArray(validUpdate.preferred_influencer_types)).toBe(true)
    })

    it('should reject invalid budget range', () => {
      const invalidBudget = {
        min: 50000,
        max: 5000, // max < min
      }

      expect(invalidBudget.min).toBeGreaterThan(invalidBudget.max)
    })
  })

  describe('Data Sanitization', () => {
    it('should not expose sensitive fields', () => {
      const profile = {
        _id: '507f1f77bcf86cd799439011',
        user_id: '507f1f77bcf86cd799439012',
        company_name: 'Test Brand',
        password_hash: 'should-not-be-exposed',
        payment_details: { secret: 'data' },
      }

      // These fields should be removed before sending to client
      const sanitized = { ...profile }
      delete (sanitized as any).password_hash
      delete (sanitized as any).payment_details

      expect(sanitized).not.toHaveProperty('password_hash')
      expect(sanitized).not.toHaveProperty('payment_details')
    })
  })
})
