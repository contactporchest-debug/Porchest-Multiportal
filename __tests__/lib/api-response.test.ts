/**
 * Unit tests for lib/api-response.ts
 * Tests all standardized API response functions
 */

// Mock validations to avoid MongoDB/BSON import issues
jest.mock('@/lib/validations', () => ({
  formatValidationError: (error: any) => ({
    message: 'Validation failed',
    errors: error.errors.map((err: any) => ({
      field: err.path.join('.'),
      message: err.message,
    })),
  }),
}))

// Mock Next.js server components before importing
jest.mock('next/server', () => {
  return {
    NextResponse: class MockNextResponse {
      status: number
      body: any
      headers: Map<string, string>

      constructor(body: any, init?: { status?: number; headers?: Headers }) {
        this.body = body
        this.status = init?.status || 200
        this.headers = new Map()

        if (init?.headers) {
          ;(init.headers as any).forEach((value: string, key: string) => {
            this.headers.set(key, value)
          })
        }
      }

      static json(data: any, init?: { status?: number }) {
        const response = new this(JSON.stringify(data), init)
        response.headers.set('Content-Type', 'application/json')
        return response
      }

      async json() {
        return JSON.parse(this.body)
      }
    },
  }
})

import { ZodError } from 'zod'
import { NextResponse } from 'next/server'
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  notFoundResponse,
  unauthorizedResponse,
  forbiddenResponse,
  conflictResponse,
  internalServerErrorResponse,
  badRequestResponse,
  tooManyRequestsResponse,
  createdResponse,
  noContentResponse,
  paginatedResponse,
  handleApiError,
  withErrorHandling,
  withCacheHeaders,
  withCorsHeaders,
} from '@/lib/api-response'

// Mock logger
jest.mock('@/lib/logger', () => ({
  logger: {
    error: jest.fn(),
  },
}))

describe('API Response Utilities', () => {
  describe('successResponse', () => {
    it('should return success response with data', async () => {
      const data = { id: 1, name: 'Test' }
      const response = successResponse(data)

      expect(response.status).toBe(200)

      const json = await response.json()
      expect(json.success).toBe(true)
      expect(json.data).toEqual(data)
      expect(json.meta?.timestamp).toBeDefined()
    })

    it('should support custom status codes', async () => {
      const response = successResponse({ message: 'OK' }, 202)

      expect(response.status).toBe(202)
    })

    it('should include custom metadata', async () => {
      const response = successResponse(
        { data: 'test' },
        200,
        { requestId: 'req-123' }
      )

      const json = await response.json()
      expect(json.meta?.requestId).toBe('req-123')
      expect(json.meta?.timestamp).toBeDefined()
    })

    it('should format timestamp as ISO string', async () => {
      const response = successResponse({ test: true })

      const json = await response.json()
      expect(json.meta?.timestamp).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
      )
    })
  })

  describe('errorResponse', () => {
    it('should return error response with message', async () => {
      const response = errorResponse('Something went wrong')

      expect(response.status).toBe(400)

      const json = await response.json()
      expect(json.success).toBe(false)
      expect(json.error?.message).toBe('Something went wrong')
      expect(json.meta?.timestamp).toBeDefined()
    })

    it('should support custom status codes', async () => {
      const response = errorResponse('Server error', 500)

      expect(response.status).toBe(500)
    })

    it('should include error code', async () => {
      const response = errorResponse('Invalid input', 400, 'INVALID_INPUT')

      const json = await response.json()
      expect(json.error?.code).toBe('INVALID_INPUT')
    })

    it('should include error details', async () => {
      const details = { field: 'email', reason: 'Invalid format' }
      const response = errorResponse('Validation failed', 400, 'VALIDATION_ERROR', details)

      const json = await response.json()
      expect(json.error?.details).toEqual(details)
    })
  })

  describe('validationErrorResponse', () => {
    it('should format Zod validation errors', async () => {
      const zodError = new ZodError([
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'number',
          path: ['email'],
          message: 'Expected string, received number',
        },
      ])

      const response = validationErrorResponse(zodError)

      expect(response.status).toBe(400)

      const json = await response.json()
      expect(json.success).toBe(false)
      expect(json.error?.code).toBe('VALIDATION_ERROR')
      expect(json.error?.message).toBe('Validation failed')
      expect(json.error?.details).toBeDefined()
      expect(Array.isArray(json.error?.details)).toBe(true)
    })

    it('should include field paths in error details', async () => {
      const zodError = new ZodError([
        {
          code: 'too_small',
          minimum: 8,
          type: 'string',
          inclusive: true,
          path: ['password'],
          message: 'String must contain at least 8 characters',
        },
      ])

      const response = validationErrorResponse(zodError)
      const json = await response.json()

      expect(json.error?.details[0].field).toBe('password')
      expect(json.error?.details[0].message).toContain('8 characters')
    })
  })

  describe('HTTP Status Responses', () => {
    it('should return 404 not found response', async () => {
      const response = notFoundResponse('User')

      expect(response.status).toBe(404)

      const json = await response.json()
      expect(json.error?.message).toBe('User not found')
      expect(json.error?.code).toBe('NOT_FOUND')
    })

    it('should return 401 unauthorized response', async () => {
      const response = unauthorizedResponse()

      expect(response.status).toBe(401)

      const json = await response.json()
      expect(json.error?.message).toBe('Unauthorized access')
      expect(json.error?.code).toBe('UNAUTHORIZED')
    })

    it('should return 403 forbidden response', async () => {
      const response = forbiddenResponse('Admin access required')

      expect(response.status).toBe(403)

      const json = await response.json()
      expect(json.error?.message).toBe('Admin access required')
      expect(json.error?.code).toBe('FORBIDDEN')
    })

    it('should return 409 conflict response', async () => {
      const response = conflictResponse('Email already exists')

      expect(response.status).toBe(409)

      const json = await response.json()
      expect(json.error?.message).toBe('Email already exists')
      expect(json.error?.code).toBe('CONFLICT')
    })

    it('should return 400 bad request response', async () => {
      const response = badRequestResponse('Invalid request body')

      expect(response.status).toBe(400)

      const json = await response.json()
      expect(json.error?.message).toBe('Invalid request body')
      expect(json.error?.code).toBe('BAD_REQUEST')
    })

    it('should return 429 too many requests response', async () => {
      const response = tooManyRequestsResponse('Rate limit exceeded', 60)

      expect(response.status).toBe(429)
      expect(response.headers.get('Retry-After')).toBe('60')

      const json = await response.json()
      expect(json.error?.message).toBe('Rate limit exceeded')
      expect(json.error?.code).toBe('TOO_MANY_REQUESTS')
    })

    it('should return 201 created response', async () => {
      const data = { id: 1, name: 'New Resource' }
      const response = createdResponse(data, '/api/resources/1')

      expect(response.status).toBe(201)
      expect(response.headers.get('Location')).toBe('/api/resources/1')

      const json = await response.json()
      expect(json.data).toEqual(data)
    })

    it('should return 204 no content response', () => {
      const response = noContentResponse()

      expect(response.status).toBe(204)
      expect(response.body).toBeNull()
    })
  })

  describe('internalServerErrorResponse', () => {
    const logger = require('@/lib/logger').logger

    beforeEach(() => {
      logger.error.mockClear()
      process.env.NODE_ENV = 'development'
    })

    it('should return 500 internal server error', async () => {
      const response = internalServerErrorResponse()

      expect(response.status).toBe(500)

      const json = await response.json()
      expect(json.error?.message).toBe('Internal server error')
      expect(json.error?.code).toBe('INTERNAL_ERROR')
    })

    it('should log error details', async () => {
      const error = new Error('Database connection failed')
      internalServerErrorResponse('Database error', error)

      expect(logger.error).toHaveBeenCalledWith(
        'Internal Server Error',
        error,
        { message: 'Database error', details: undefined }
      )
    })

    it('should expose details in development', async () => {
      process.env.NODE_ENV = 'development'
      const details = { stack: 'Error stack trace' }

      const response = internalServerErrorResponse('Error', details)
      const json = await response.json()

      expect(json.error?.details).toEqual(details)
    })

    it('should hide details in production', async () => {
      process.env.NODE_ENV = 'production'
      const details = { stack: 'Sensitive error info' }

      const response = internalServerErrorResponse('Error', details)
      const json = await response.json()

      expect(json.error?.details).toBeUndefined()
    })
  })

  describe('paginatedResponse', () => {
    it('should return paginated data with metadata', async () => {
      const paginatedData = {
        items: [{ id: 1 }, { id: 2 }, { id: 3 }],
        pagination: {
          page: 1,
          limit: 10,
          total: 3,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      }

      const response = paginatedResponse(paginatedData)

      expect(response.status).toBe(200)

      const json = await response.json()
      expect(json.data?.items).toHaveLength(3)
      expect(json.data?.pagination.page).toBe(1)
      expect(json.data?.pagination.total).toBe(3)
    })

    it('should support custom status codes', async () => {
      const paginatedData = {
        items: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      }

      const response = paginatedResponse(paginatedData, 206)

      expect(response.status).toBe(206)
    })
  })

  describe('handleApiError', () => {
    it('should handle Zod validation errors', async () => {
      const zodError = new ZodError([
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'number',
          path: ['field'],
          message: 'Invalid type',
        },
      ])

      const response = handleApiError(zodError)

      expect(response.status).toBe(400)

      const json = await response.json()
      expect(json.error?.code).toBe('VALIDATION_ERROR')
    })

    it('should handle MongoDB duplicate key errors', async () => {
      const mongoError = { code: 11000, message: 'Duplicate key' }

      const response = handleApiError(mongoError)

      expect(response.status).toBe(409)

      const json = await response.json()
      expect(json.error?.code).toBe('CONFLICT')
    })

    it('should handle custom errors with status', async () => {
      const customError = { message: 'Custom error', status: 418 }

      const response = handleApiError(customError)

      expect(response.status).toBe(418)

      const json = await response.json()
      expect(json.error?.message).toBe('Custom error')
    })

    it('should handle Error instances', async () => {
      const error = new Error('Something went wrong')

      const response = handleApiError(error)

      expect(response.status).toBe(500)

      const json = await response.json()
      expect(json.error?.message).toBe('Something went wrong')
    })

    it('should handle unknown errors', async () => {
      const response = handleApiError('unknown error')

      expect(response.status).toBe(500)

      const json = await response.json()
      expect(json.error?.message).toBe('An unexpected error occurred')
    })

    it('should default to 500 for errors without status', async () => {
      const error = { message: 'No status code' }

      const response = handleApiError(error)

      expect(response.status).toBe(500)
    })
  })

  describe('withErrorHandling', () => {
    it('should call handler and return response on success', async () => {
      const mockHandler = jest.fn(async () => successResponse({ test: 'data' }))
      const wrappedHandler = withErrorHandling(mockHandler)

      const response = await wrappedHandler('arg1', 'arg2')

      expect(mockHandler).toHaveBeenCalledWith('arg1', 'arg2')
      expect(response.status).toBe(200)
    })

    it('should catch errors and return error response', async () => {
      const mockHandler = jest.fn(async () => {
        throw new Error('Handler error')
      })
      const wrappedHandler = withErrorHandling(mockHandler)

      const response = await wrappedHandler()

      expect(response.status).toBe(500)

      const json = await response.json()
      expect(json.error?.message).toBe('Handler error')
    })

    it('should handle Zod errors thrown by handler', async () => {
      const zodError = new ZodError([
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'number',
          path: ['field'],
          message: 'Invalid',
        },
      ])

      const mockHandler = jest.fn(async () => {
        throw zodError
      })
      const wrappedHandler = withErrorHandling(mockHandler)

      const response = await wrappedHandler()

      expect(response.status).toBe(400)

      const json = await response.json()
      expect(json.error?.code).toBe('VALIDATION_ERROR')
    })

    it('should preserve handler arguments', async () => {
      const mockHandler = jest.fn(async (a: number, b: string) => {
        return successResponse({ a, b })
      })
      const wrappedHandler = withErrorHandling(mockHandler)

      await wrappedHandler(42, 'test')

      expect(mockHandler).toHaveBeenCalledWith(42, 'test')
    })
  })

  describe('withCacheHeaders', () => {
    it('should add no-cache headers when maxAge is 0', () => {
      const response = successResponse({ data: 'test' })
      const cachedResponse = withCacheHeaders(response, 0)

      const cacheControl = cachedResponse.headers.get('Cache-Control')
      expect(cacheControl).toContain('no-store')
      expect(cacheControl).toContain('no-cache')
      expect(cacheControl).toContain('must-revalidate')
    })

    it('should add public cache headers with max-age', () => {
      const response = successResponse({ data: 'test' })
      const cachedResponse = withCacheHeaders(response, 3600)

      const cacheControl = cachedResponse.headers.get('Cache-Control')
      expect(cacheControl).toContain('public')
      expect(cacheControl).toContain('max-age=3600')
    })

    it('should add s-maxage when provided', () => {
      const response = successResponse({ data: 'test' })
      const cachedResponse = withCacheHeaders(response, 3600, 7200)

      const cacheControl = cachedResponse.headers.get('Cache-Control')
      expect(cacheControl).toContain('max-age=3600')
      expect(cacheControl).toContain('s-maxage=7200')
    })

    it('should default to no-cache', () => {
      const response = successResponse({ data: 'test' })
      const cachedResponse = withCacheHeaders(response)

      const cacheControl = cachedResponse.headers.get('Cache-Control')
      expect(cacheControl).toContain('no-store')
    })
  })

  describe('withCorsHeaders', () => {
    it('should add CORS headers with default origin', () => {
      const response = successResponse({ data: 'test' })
      const corsResponse = withCorsHeaders(response)

      expect(corsResponse.headers.get('Access-Control-Allow-Origin')).toBe('*')
      expect(corsResponse.headers.get('Access-Control-Allow-Methods')).toBe(
        'GET, POST, PUT, DELETE, OPTIONS'
      )
      expect(corsResponse.headers.get('Access-Control-Allow-Headers')).toBe(
        'Content-Type, Authorization'
      )
    })

    it('should add CORS headers with custom origin', () => {
      const response = successResponse({ data: 'test' })
      const corsResponse = withCorsHeaders(response, 'https://example.com')

      expect(corsResponse.headers.get('Access-Control-Allow-Origin')).toBe(
        'https://example.com'
      )
    })

    it('should return the same response object', () => {
      const response = successResponse({ data: 'test' })
      const corsResponse = withCorsHeaders(response)

      expect(corsResponse).toBe(response)
    })
  })
})
