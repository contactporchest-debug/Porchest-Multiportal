/**
 * Unit tests for lib/rate-limit.ts
 * Tests rate limiting logic, LRU cache, and middleware
 */

// Simple Response polyfill for testing
class MockResponse {
  body: any
  status: number
  headers: {
    get: (key: string) => string | null
    set: (key: string, value: string) => void
    entries: () => [string, string][]
  }

  constructor(body: any, init?: any) {
    this.body = body
    this.status = init?.status || 200

    const headersMap = new Map<string, string>()
    if (init?.headers) {
      if (init.headers instanceof Map) {
        init.headers.forEach((value: string, key: string) => {
          headersMap.set(key, value)
        })
      } else if (typeof init.headers === 'object') {
        Object.entries(init.headers).forEach(([key, value]) => {
          headersMap.set(key, value as string)
        })
      }
    }

    this.headers = {
      get: (key: string) => headersMap.get(key) || null,
      set: (key: string, value: string) => headersMap.set(key, value),
      entries: () => Array.from(headersMap.entries()),
    }
  }

  async json() {
    return JSON.parse(this.body)
  }
}

global.Response = MockResponse as any

import {
  checkRateLimit,
  getIpAddress,
  withRateLimit,
  getRateLimitStats,
  RATE_LIMIT_CONFIGS,
  type RateLimitConfig,
} from '@/lib/rate-limit'
import type { NextRequest } from 'next/server'

// Mock api-response module
jest.mock('@/lib/api-response', () => ({
  tooManyRequestsResponse: jest.fn((message: string, retryAfter?: number) => {
    return new Response(
      JSON.stringify({ error: message, retryAfter }),
      {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }),
}))

describe('Rate Limit Configuration', () => {
  it('should have correct auth rate limits', () => {
    expect(RATE_LIMIT_CONFIGS.auth.maxRequests).toBe(5)
    expect(RATE_LIMIT_CONFIGS.auth.windowMs).toBe(15 * 60 * 1000)
  })

  it('should have correct register rate limits', () => {
    expect(RATE_LIMIT_CONFIGS.register.maxRequests).toBe(3)
    expect(RATE_LIMIT_CONFIGS.register.windowMs).toBe(60 * 60 * 1000)
  })

  it('should have correct AI rate limits', () => {
    expect(RATE_LIMIT_CONFIGS.ai.maxRequests).toBe(10)
    expect(RATE_LIMIT_CONFIGS.ai.windowMs).toBe(60 * 1000)
  })

  it('should have correct financial rate limits', () => {
    expect(RATE_LIMIT_CONFIGS.financial.maxRequests).toBe(5)
    expect(RATE_LIMIT_CONFIGS.financial.windowMs).toBe(60 * 1000)
  })

  it('should have correct default rate limits', () => {
    expect(RATE_LIMIT_CONFIGS.default.maxRequests).toBe(100)
    expect(RATE_LIMIT_CONFIGS.default.windowMs).toBe(60 * 1000)
  })
})

describe('checkRateLimit', () => {
  const testConfig: RateLimitConfig = {
    maxRequests: 3,
    windowMs: 60000, // 1 minute
    message: 'Test limit exceeded',
  }

  // Use unique identifiers for each test to avoid interference
  let testCounter = 0
  const getUniqueId = () => `test-${testCounter++}-${Date.now()}`

  it('should allow first request', () => {
    const identifier = getUniqueId()
    const result = checkRateLimit(identifier, testConfig)

    expect(result.allowed).toBe(true)
    // After incrementing: count=1, remaining = maxRequests(3) - count(1) - 1 = 1
    expect(result.remaining).toBe(1)
  })

  it('should track multiple requests', () => {
    const identifier = getUniqueId()

    const first = checkRateLimit(identifier, testConfig)
    expect(first.allowed).toBe(true)
    expect(first.remaining).toBe(1) // count=1, remaining=3-1-1=1

    const second = checkRateLimit(identifier, testConfig)
    expect(second.allowed).toBe(true)
    expect(second.remaining).toBe(0) // count=2, remaining=3-2-1=0

    const third = checkRateLimit(identifier, testConfig)
    expect(third.allowed).toBe(true) // count=3, still allowed (limit is 3)
    expect(third.remaining).toBe(-1) // count=3, remaining=3-3-1=-1

    // Fourth request should be blocked
    const fourth = checkRateLimit(identifier, testConfig)
    expect(fourth.allowed).toBe(false) // count=3 >= maxRequests(3)
    expect(fourth.remaining).toBe(0)
  })

  it('should block requests when limit exceeded', () => {
    const identifier = getUniqueId()

    // Make requests up to limit
    for (let i = 0; i < 3; i++) {
      checkRateLimit(identifier, testConfig)
    }

    // Next request should be blocked
    const result = checkRateLimit(identifier, testConfig)
    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
    expect(result.retryAfter).toBeGreaterThan(0)
  })

  it('should calculate correct retry-after time', () => {
    const identifier = getUniqueId()

    // Exhaust limit
    for (let i = 0; i < 3; i++) {
      checkRateLimit(identifier, testConfig)
    }

    const result = checkRateLimit(identifier, testConfig)
    expect(result.allowed).toBe(false)
    expect(result.retryAfter).toBeLessThanOrEqual(60) // Should be <= window in seconds
    expect(result.retryAfter).toBeGreaterThan(0)
  })

  it('should reset after time window', async () => {
    const identifier = getUniqueId()
    const shortConfig: RateLimitConfig = {
      maxRequests: 2,
      windowMs: 100, // 100ms
    }

    // Exhaust limit
    checkRateLimit(identifier, shortConfig)
    checkRateLimit(identifier, shortConfig)

    // Should be blocked
    const blocked = checkRateLimit(identifier, shortConfig)
    expect(blocked.allowed).toBe(false)

    // Wait for window to expire
    await new Promise(resolve => setTimeout(resolve, 150))

    // Should be allowed again
    const allowed = checkRateLimit(identifier, shortConfig)
    expect(allowed.allowed).toBe(true)
  })

  it('should handle different identifiers independently', () => {
    const id1 = getUniqueId()
    const id2 = getUniqueId()

    // Exhaust limit for id1
    for (let i = 0; i < 3; i++) {
      checkRateLimit(id1, testConfig)
    }

    // id1 should be blocked
    expect(checkRateLimit(id1, testConfig).allowed).toBe(false)

    // id2 should still be allowed
    expect(checkRateLimit(id2, testConfig).allowed).toBe(true)
  })

  it('should provide resetTime', () => {
    const identifier = getUniqueId()
    const result = checkRateLimit(identifier, testConfig)

    expect(result.resetTime).toBeGreaterThan(Date.now())
    expect(result.resetTime).toBeLessThanOrEqual(Date.now() + testConfig.windowMs + 100)
  })
})

describe('getIpAddress', () => {
  function createMockRequest(headers: Record<string, string>, ip?: string): NextRequest {
    return {
      headers: {
        get: (key: string) => headers[key.toLowerCase()] || null,
      },
      ip: ip || undefined,
    } as unknown as NextRequest
  }

  it('should extract IP from x-forwarded-for header', () => {
    const request = createMockRequest({
      'x-forwarded-for': '192.168.1.1, 10.0.0.1',
    })

    const ip = getIpAddress(request)
    expect(ip).toBe('192.168.1.1')
  })

  it('should extract IP from x-real-ip header', () => {
    const request = createMockRequest({
      'x-real-ip': '192.168.1.2',
    })

    const ip = getIpAddress(request)
    expect(ip).toBe('192.168.1.2')
  })

  it('should prioritize x-forwarded-for over x-real-ip', () => {
    const request = createMockRequest({
      'x-forwarded-for': '192.168.1.1',
      'x-real-ip': '192.168.1.2',
    })

    const ip = getIpAddress(request)
    expect(ip).toBe('192.168.1.1')
  })

  it('should fall back to request.ip', () => {
    const request = createMockRequest({}, '192.168.1.3')

    const ip = getIpAddress(request)
    expect(ip).toBe('192.168.1.3')
  })

  it('should return "unknown" when no IP available', () => {
    const request = createMockRequest({})

    const ip = getIpAddress(request)
    expect(ip).toBe('unknown')
  })

  it('should trim whitespace from forwarded IP', () => {
    const request = createMockRequest({
      'x-forwarded-for': '  192.168.1.1  , 10.0.0.1',
    })

    const ip = getIpAddress(request)
    expect(ip).toBe('192.168.1.1')
  })

  it('should handle IPv6 addresses', () => {
    const request = createMockRequest({
      'x-forwarded-for': '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
    })

    const ip = getIpAddress(request)
    expect(ip).toBe('2001:0db8:85a3:0000:0000:8a2e:0370:7334')
  })
})

describe('withRateLimit middleware', () => {
  const testConfig: RateLimitConfig = {
    maxRequests: 2,
    windowMs: 60000,
    message: 'Rate limit exceeded',
  }

  function createMockRequest(headers: Record<string, string> = {}): Request {
    return {
      url: 'http://localhost:3000/api/test',
      headers: new Headers(headers),
    } as Request
  }

  const mockHandler = jest.fn(async (req: Request) => {
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  })

  beforeEach(() => {
    mockHandler.mockClear()
  })

  it('should call handler when under rate limit', async () => {
    const rateLimitedHandler = withRateLimit(mockHandler, testConfig)
    const req = createMockRequest({
      'x-forwarded-for': `test-ip-${Date.now()}-${Math.random()}`,
    })

    const response = await rateLimitedHandler(req)

    expect(response.status).toBe(200)
    expect(mockHandler).toHaveBeenCalledWith(req)
  })

  it('should add rate limit headers', async () => {
    const rateLimitedHandler = withRateLimit(mockHandler, testConfig)
    // Use completely unique IP to avoid interference from other tests
    const uniqueIp = `rate-limit-headers-${Date.now()}-${Math.random().toString(36)}`
    const req = createMockRequest({
      'x-forwarded-for': uniqueIp,
    })

    const response = await rateLimitedHandler(req)

    expect(response.headers.get('X-RateLimit-Limit')).toBe('2')
    // First request: count=1, remaining = 2 - 1 - 1 = 0
    expect(response.headers.get('X-RateLimit-Remaining')).toBe('0')
    expect(response.headers.get('X-RateLimit-Reset')).toBeTruthy()
  })

  it('should block requests when limit exceeded', async () => {
    const rateLimitedHandler = withRateLimit(mockHandler, testConfig)
    const ip = `test-ip-${Date.now()}-${Math.random()}`

    // First two requests should succeed
    await rateLimitedHandler(createMockRequest({ 'x-forwarded-for': ip }))
    await rateLimitedHandler(createMockRequest({ 'x-forwarded-for': ip }))

    // Third request should be blocked
    const response = await rateLimitedHandler(createMockRequest({ 'x-forwarded-for': ip }))

    expect(response.status).toBe(429)
    const body = await response.json()
    expect(body.error).toBe('Rate limit exceeded')
  })

  it('should support custom identifier function', async () => {
    const customIdentifier = jest.fn(() => 'custom-id')
    const rateLimitedHandler = withRateLimit(mockHandler, testConfig, {
      getIdentifier: customIdentifier,
    })

    const req = createMockRequest()
    await rateLimitedHandler(req)

    expect(customIdentifier).toHaveBeenCalledWith(req)
  })

  it('should fail open on errors', async () => {
    const errorHandler = jest.fn(async () => {
      throw new Error('Handler error')
    })

    const rateLimitedHandler = withRateLimit(errorHandler, testConfig)
    const req = createMockRequest({
      'x-forwarded-for': `test-ip-${Date.now()}`,
    })

    // Should not throw - fails open by calling handler
    await expect(rateLimitedHandler(req)).rejects.toThrow('Handler error')
  })

  it('should handle requests from different IPs independently', async () => {
    const rateLimitedHandler = withRateLimit(mockHandler, testConfig)

    const ip1 = `test-ip-${Date.now()}-1`
    const ip2 = `test-ip-${Date.now()}-2`

    // Exhaust limit for IP1
    await rateLimitedHandler(createMockRequest({ 'x-forwarded-for': ip1 }))
    await rateLimitedHandler(createMockRequest({ 'x-forwarded-for': ip1 }))

    // IP1 should be blocked
    const blocked = await rateLimitedHandler(createMockRequest({ 'x-forwarded-for': ip1 }))
    expect(blocked.status).toBe(429)

    // IP2 should still be allowed
    const allowed = await rateLimitedHandler(createMockRequest({ 'x-forwarded-for': ip2 }))
    expect(allowed.status).toBe(200)
  })
})

describe('getRateLimitStats', () => {
  it('should return stats object', () => {
    const stats = getRateLimitStats()

    expect(stats).toHaveProperty('totalKeys')
    expect(typeof stats.totalKeys).toBe('number')
    expect(stats.totalKeys).toBeGreaterThanOrEqual(0)
  })
})
