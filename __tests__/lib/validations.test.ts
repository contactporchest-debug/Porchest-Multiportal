import { z } from 'zod'

// Mock MongoDB ObjectId
jest.mock('mongodb', () => ({
  ObjectId: class ObjectId {
    constructor(id?: string) {
      // Reject empty strings and invalid formats
      if (id !== undefined && (id === '' || !/^[a-f\d]{24}$/i.test(id))) {
        throw new Error('Invalid ObjectId')
      }
    }
    toString() {
      return '507f1f77bcf86cd799439011'
    }
  },
}))

// Import after mocking
import { ObjectId } from 'mongodb'
import {
  // Common validators
  objectIdSchema,
  emailSchema,
  passwordSchema,
  phoneSchema,
  urlSchema,
  positiveNumberSchema,
  nonNegativeNumberSchema,

  // Complex schemas
  registerSchema,
  createCampaignSchema,
  createWithdrawalSchema,
  updateInfluencerProfileSchema,

  // Helper functions
  validateRequest,
  validateQuery,
  safeValidate,
  formatValidationError,
} from '@/lib/validations'

describe('Common Validators', () => {
  describe('objectIdSchema', () => {
    it('should accept valid ObjectId strings', () => {
      const validId = new ObjectId().toString()
      expect(() => objectIdSchema.parse(validId)).not.toThrow()
    })

    it('should reject invalid ObjectId strings', () => {
      expect(() => objectIdSchema.parse('invalid-id')).toThrow()
      expect(() => objectIdSchema.parse('12345')).toThrow()
      expect(() => objectIdSchema.parse('')).toThrow()
    })

    it('should reject non-string values', () => {
      expect(() => objectIdSchema.parse(123)).toThrow()
      expect(() => objectIdSchema.parse(null)).toThrow()
      expect(() => objectIdSchema.parse(undefined)).toThrow()
    })
  })

  describe('emailSchema', () => {
    it('should accept valid email addresses', () => {
      expect(emailSchema.parse('test@example.com')).toBe('test@example.com')
      expect(emailSchema.parse('user+tag@domain.co.uk')).toBe('user+tag@domain.co.uk')
    })

    it('should lowercase and trim emails', () => {
      expect(emailSchema.parse('TEST@EXAMPLE.COM')).toBe('test@example.com')
      expect(emailSchema.parse('User@Domain.COM')).toBe('user@domain.com')
    })

    it('should reject invalid email formats', () => {
      expect(() => emailSchema.parse('notanemail')).toThrow()
      expect(() => emailSchema.parse('missing@domain')).toThrow()
      expect(() => emailSchema.parse('@example.com')).toThrow()
      expect(() => emailSchema.parse('user@')).toThrow()
    })
  })

  describe('passwordSchema', () => {
    it('should accept valid passwords', () => {
      expect(() => passwordSchema.parse('Password123')).not.toThrow()
      expect(() => passwordSchema.parse('SecurePass1')).not.toThrow()
      expect(() => passwordSchema.parse('MyP@ssw0rd')).not.toThrow()
    })

    it('should reject passwords shorter than 8 characters', () => {
      expect(() => passwordSchema.parse('Pass1')).toThrow('at least 8 characters')
    })

    it('should reject passwords without uppercase letters', () => {
      expect(() => passwordSchema.parse('password123')).toThrow('uppercase letter')
    })

    it('should reject passwords without lowercase letters', () => {
      expect(() => passwordSchema.parse('PASSWORD123')).toThrow('lowercase letter')
    })

    it('should reject passwords without numbers', () => {
      expect(() => passwordSchema.parse('PasswordOnly')).toThrow('number')
    })
  })

  describe('phoneSchema', () => {
    it('should accept valid phone numbers', () => {
      expect(phoneSchema.parse('+1234567890')).toBe('+1234567890')
      expect(phoneSchema.parse('+447911123456')).toBe('+447911123456')
      expect(phoneSchema.parse('1234567890')).toBe('1234567890')
    })

    it('should accept undefined (optional)', () => {
      expect(phoneSchema.parse(undefined)).toBeUndefined()
    })

    it('should reject invalid phone formats', () => {
      expect(() => phoneSchema.parse('1')).toThrow('Invalid phone number') // Too short
      expect(() => phoneSchema.parse('abc123')).toThrow()
      expect(() => phoneSchema.parse('+0123456789')).toThrow() // Cannot start with 0 after +
      expect(() => phoneSchema.parse('12345678901234567')).toThrow() // Too long (>15 digits total)
    })
  })

  describe('urlSchema', () => {
    it('should accept valid URLs', () => {
      expect(urlSchema.parse('https://example.com')).toBe('https://example.com')
      expect(urlSchema.parse('http://localhost:3000')).toBe('http://localhost:3000')
      expect(urlSchema.parse('https://sub.domain.com/path?query=1')).toBe('https://sub.domain.com/path?query=1')
    })

    it('should accept undefined (optional)', () => {
      expect(urlSchema.parse(undefined)).toBeUndefined()
    })

    it('should reject invalid URLs', () => {
      expect(() => urlSchema.parse('not-a-url')).toThrow('Invalid URL')
      expect(() => urlSchema.parse('example.com')).toThrow() // Missing protocol
      expect(() => urlSchema.parse('http://')).toThrow() // Missing domain
    })
  })

  describe('positiveNumberSchema', () => {
    it('should accept positive numbers', () => {
      expect(positiveNumberSchema.parse(1)).toBe(1)
      expect(positiveNumberSchema.parse(100.5)).toBe(100.5)
      expect(positiveNumberSchema.parse(0.01)).toBe(0.01)
    })

    it('should reject zero and negative numbers', () => {
      expect(() => positiveNumberSchema.parse(0)).toThrow('positive number')
      expect(() => positiveNumberSchema.parse(-1)).toThrow('positive number')
      expect(() => positiveNumberSchema.parse(-0.01)).toThrow()
    })
  })

  describe('nonNegativeNumberSchema', () => {
    it('should accept zero and positive numbers', () => {
      expect(nonNegativeNumberSchema.parse(0)).toBe(0)
      expect(nonNegativeNumberSchema.parse(1)).toBe(1)
      expect(nonNegativeNumberSchema.parse(100.5)).toBe(100.5)
    })

    it('should reject negative numbers', () => {
      expect(() => nonNegativeNumberSchema.parse(-1)).toThrow('non-negative')
      expect(() => nonNegativeNumberSchema.parse(-0.01)).toThrow()
    })
  })
})

describe('Complex Schemas', () => {
  describe('registerSchema', () => {
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Password123',
      role: 'brand' as const,
      phone: '+1234567890',
      company: 'ACME Inc',
    }

    it('should accept valid registration data', () => {
      expect(() => registerSchema.parse(validData)).not.toThrow()
    })

    it('should require name with at least 2 characters', () => {
      expect(() => registerSchema.parse({ ...validData, name: 'A' })).toThrow('at least 2 characters')
    })

    it('should trim name and lowercase email', () => {
      const result = registerSchema.parse({
        ...validData,
        name: '  John Doe  ',
        email: 'JOHN@EXAMPLE.COM',
      })
      expect(result.name).toBe('John Doe')
      expect(result.email).toBe('john@example.com')
    })

    it('should enforce password rules', () => {
      expect(() => registerSchema.parse({ ...validData, password: 'weak' })).toThrow()
    })

    it('should accept valid roles', () => {
      const roles = ['brand', 'influencer', 'client', 'employee', 'admin']
      roles.forEach((role) => {
        expect(() => registerSchema.parse({ ...validData, role })).not.toThrow()
      })
    })

    it('should reject invalid roles', () => {
      expect(() => registerSchema.parse({ ...validData, role: 'invalid' })).toThrow()
    })
  })

  describe('createCampaignSchema', () => {
    const validData = {
      name: 'Summer Campaign 2024',
      description: 'A campaign for summer products',
      budget: 10000,
      target_audience: {
        age_range: { min: 18, max: 35 },
        gender: ['male', 'female'],
        locations: ['US', 'UK'],
        interests: ['fashion', 'lifestyle'],
      },
    }

    it('should accept valid campaign data', () => {
      expect(() => createCampaignSchema.parse(validData)).not.toThrow()
    })

    it('should require name with at least 3 characters', () => {
      expect(() => createCampaignSchema.parse({ ...validData, name: 'AB' })).toThrow('at least 3 characters')
    })

    it('should require positive budget', () => {
      expect(() => createCampaignSchema.parse({ ...validData, budget: 0 })).toThrow('positive')
      expect(() => createCampaignSchema.parse({ ...validData, budget: -100 })).toThrow()
    })

    it('should validate age range (min <= max)', () => {
      const invalidAgeRange = {
        ...validData,
        target_audience: {
          age_range: { min: 35, max: 18 }, // min > max
        },
      }
      expect(() => createCampaignSchema.parse(invalidAgeRange)).toThrow('less than or equal to max age')
    })

    it('should reject age below 13', () => {
      const invalidAge = {
        ...validData,
        target_audience: {
          age_range: { min: 10, max: 18 },
        },
      }
      expect(() => createCampaignSchema.parse(invalidAge)).toThrow()
    })

    it('should limit array sizes', () => {
      const tooManyLocations = {
        ...validData,
        target_audience: {
          locations: Array(51).fill('location'), // Max 50
        },
      }
      expect(() => createCampaignSchema.parse(tooManyLocations)).toThrow()
    })
  })

  describe('createWithdrawalSchema', () => {
    const validData = {
      amount: 100,
      payment_method: 'bank_transfer' as const,
      payment_details: {
        account_number: '12345678',
        account_name: 'John Doe',
        bank_name: 'Test Bank',
      },
    }

    it('should accept valid withdrawal data', () => {
      expect(() => createWithdrawalSchema.parse(validData)).not.toThrow()
    })

    it('should enforce minimum withdrawal amount', () => {
      expect(() => createWithdrawalSchema.parse({ ...validData, amount: 5 })).toThrow('Minimum withdrawal')
    })

    it('should enforce maximum withdrawal amount', () => {
      expect(() => createWithdrawalSchema.parse({ ...validData, amount: 150000 })).toThrow('Maximum withdrawal')
    })

    it('should require at least one payment detail', () => {
      const emptyDetails = {
        ...validData,
        payment_details: {},
      }
      expect(() => createWithdrawalSchema.parse(emptyDetails)).toThrow('Payment details are required')
    })

    it('should accept PayPal email as payment detail', () => {
      const paypalData = {
        amount: 100,
        payment_method: 'paypal' as const,
        payment_details: {
          paypal_email: 'user@example.com',
        },
      }
      expect(() => createWithdrawalSchema.parse(paypalData)).not.toThrow()
    })
  })

  describe('updateInfluencerProfileSchema', () => {
    it('should accept valid profile updates', () => {
      const validData = {
        bio: 'Fashion influencer based in NYC',
        profile_picture: 'https://example.com/photo.jpg',
        social_media: {
          instagram: {
            handle: '@johndoe',
            url: 'https://instagram.com/johndoe',
            followers: 100000,
            verified: true,
          },
        },
        content_categories: ['fashion', 'lifestyle'],
        primary_platform: 'instagram' as const,
        pricing: {
          post: 500,
          story: 200,
          reel: 800,
        },
      }
      expect(() => updateInfluencerProfileSchema.parse(validData)).not.toThrow()
    })

    it('should require positive pricing values', () => {
      const invalidPricing = {
        pricing: {
          post: 0,
        },
      }
      expect(() => updateInfluencerProfileSchema.parse(invalidPricing)).toThrow()
    })

    it('should validate URLs in social media', () => {
      const invalidUrl = {
        social_media: {
          instagram: {
            url: 'not-a-url',
          },
        },
      }
      expect(() => updateInfluencerProfileSchema.parse(invalidUrl)).toThrow('Invalid URL')
    })
  })
})

describe('Helper Functions', () => {
  describe('validateRequest', () => {
    const testSchema = z.object({
      name: z.string().min(2),
      age: z.number().positive(),
    })

    it('should return validated data for valid input', () => {
      const data = { name: 'John', age: 25 }
      const result = validateRequest(testSchema, data)
      expect(result).toEqual(data)
    })

    it('should throw ZodError for invalid input', () => {
      const invalidData = { name: 'A', age: -5 }
      expect(() => validateRequest(testSchema, invalidData)).toThrow(z.ZodError)
    })

    it('should throw for missing required fields', () => {
      const incompleteData = { name: 'John' }
      expect(() => validateRequest(testSchema, incompleteData)).toThrow()
    })

    it('should apply transformations', () => {
      const emailTestSchema = z.object({
        email: emailSchema,
      })
      const result = validateRequest(emailTestSchema, { email: 'TEST@EXAMPLE.COM' })
      expect(result.email).toBe('test@example.com')
    })
  })

  describe('validateQuery', () => {
    const testSchema = z.object({
      page: z.coerce.number().int().positive().default(1),
      limit: z.coerce.number().int().positive().default(20),
      search: z.string().optional(),
    })

    it('should validate URLSearchParams', () => {
      const params = new URLSearchParams('page=2&limit=50&search=test')
      const result = validateQuery(testSchema, params)
      expect(result).toEqual({ page: 2, limit: 50, search: 'test' })
    })

    it('should validate plain objects', () => {
      const params = { page: '3', limit: '10' }
      const result = validateQuery(testSchema, params)
      expect(result).toEqual({ page: 3, limit: 10 })
    })

    it('should apply default values', () => {
      const params = new URLSearchParams()
      const result = validateQuery(testSchema, params)
      expect(result).toEqual({ page: 1, limit: 20 })
    })

    it('should coerce string numbers to numbers', () => {
      const params = { page: '5', limit: '25' }
      const result = validateQuery(testSchema, params)
      expect(typeof result.page).toBe('number')
      expect(typeof result.limit).toBe('number')
    })
  })

  describe('safeValidate', () => {
    const testSchema = z.object({
      name: z.string().min(2),
      age: z.number().positive(),
    })

    it('should return success result for valid data', () => {
      const data = { name: 'John', age: 25 }
      const result = safeValidate(testSchema, data)

      if (result.success) {
        expect(result.data).toEqual(data)
      } else {
        fail('Expected validation to succeed')
      }
    })

    it('should return error result for invalid data', () => {
      const invalidData = { name: 'A', age: -5 }
      const result = safeValidate(testSchema, invalidData)

      if (!result.success) {
        expect(result.error).toBeInstanceOf(z.ZodError)
        expect(result.error.errors.length).toBeGreaterThan(0)
      } else {
        fail('Expected validation to fail')
      }
    })

    it('should not throw errors', () => {
      const invalidData = { name: 'A' }
      expect(() => safeValidate(testSchema, invalidData)).not.toThrow()
    })
  })

  describe('formatValidationError', () => {
    it('should format single field error', () => {
      const schema = z.object({ name: z.string().min(5) })
      try {
        schema.parse({ name: 'ab' })
      } catch (error) {
        if (error instanceof z.ZodError) {
          const formatted = formatValidationError(error)
          expect(formatted.message).toBe('Validation failed')
          expect(formatted.errors).toHaveLength(1)
          expect(formatted.errors[0].field).toBe('name')
          expect(formatted.errors[0].message).toContain('at least 5')
        }
      }
    })

    it('should format multiple field errors', () => {
      const schema = z.object({
        name: z.string().min(5),
        age: z.number().positive(),
      })
      try {
        schema.parse({ name: 'ab', age: -5 })
      } catch (error) {
        if (error instanceof z.ZodError) {
          const formatted = formatValidationError(error)
          expect(formatted.errors).toHaveLength(2)
          expect(formatted.errors.map(e => e.field)).toContain('name')
          expect(formatted.errors.map(e => e.field)).toContain('age')
        }
      }
    })

    it('should format nested field errors', () => {
      const schema = z.object({
        user: z.object({
          name: z.string().min(2),
        }),
      })
      try {
        schema.parse({ user: { name: 'a' } })
      } catch (error) {
        if (error instanceof z.ZodError) {
          const formatted = formatValidationError(error)
          expect(formatted.errors[0].field).toBe('user.name')
        }
      }
    })

    it('should handle array index errors', () => {
      const schema = z.object({
        items: z.array(z.string().min(3)),
      })
      try {
        schema.parse({ items: ['ab', 'cd'] })
      } catch (error) {
        if (error instanceof z.ZodError) {
          const formatted = formatValidationError(error)
          expect(formatted.errors.length).toBeGreaterThan(0)
          expect(formatted.errors[0].field).toMatch(/items\.\d+/)
        }
      }
    })
  })
})
