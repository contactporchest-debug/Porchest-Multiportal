/**
 * Unit tests for lib/logger.ts
 * Tests logging functionality, PII redaction, and request tracking
 */

// Mock server-only module
jest.mock('server-only', () => ({}))

import {
  logger,
  Logger,
  LogLevel,
  generateRequestId,
  createRequestLogger,
  logApiRequest,
  timeFunction,
} from '@/lib/logger'

describe('Logger', () => {
  // Mock console methods
  let consoleLogSpy: jest.SpyInstance
  let consoleWarnSpy: jest.SpyInstance
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation()
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
    logger.clearContext()

    // Set to development mode for pretty printing
    process.env.NODE_ENV = 'development'
    process.env.LOG_LEVEL = 'DEBUG'
  })

  afterEach(() => {
    consoleLogSpy.mockRestore()
    consoleWarnSpy.mockRestore()
    consoleErrorSpy.mockRestore()
  })

  describe('Log Levels', () => {
    it('should have correct log level values', () => {
      expect(LogLevel.TRACE).toBe(10)
      expect(LogLevel.DEBUG).toBe(20)
      expect(LogLevel.INFO).toBe(30)
      expect(LogLevel.WARN).toBe(40)
      expect(LogLevel.ERROR).toBe(50)
      expect(LogLevel.FATAL).toBe(60)
    })
  })

  describe('Basic Logging', () => {
    it('should have trace logging method', () => {
      // TRACE level exists but may not log depending on LOG_LEVEL config
      expect(typeof logger.trace).toBe('function')
      // Call it to ensure no errors
      logger.trace('Test trace message')
      // In DEBUG mode (default for tests), TRACE won't be logged
      // This is correct behavior
    })

    it('should log debug messages', () => {
      logger.debug('Test debug message')
      expect(consoleLogSpy).toHaveBeenCalled()
      const output = consoleLogSpy.mock.calls[0][0]
      expect(output).toContain('DEBUG')
      expect(output).toContain('Test debug message')
    })

    it('should log info messages', () => {
      logger.info('Test info message')
      expect(consoleLogSpy).toHaveBeenCalled()
      const output = consoleLogSpy.mock.calls[0][0]
      expect(output).toContain('INFO')
      expect(output).toContain('Test info message')
    })

    it('should log warning messages', () => {
      logger.warn('Test warning message')
      expect(consoleWarnSpy).toHaveBeenCalled()
      const output = consoleWarnSpy.mock.calls[0][0]
      expect(output).toContain('WARN')
      expect(output).toContain('Test warning message')
    })

    it('should log error messages', () => {
      const error = new Error('Test error')
      logger.error('Test error message', error)
      expect(consoleErrorSpy).toHaveBeenCalled()
      const output = consoleErrorSpy.mock.calls[0][0]
      expect(output).toContain('ERROR')
      expect(output).toContain('Test error message')
    })

    it('should log fatal messages', () => {
      const error = new Error('Fatal error')
      logger.fatal('Test fatal message', error)
      expect(consoleErrorSpy).toHaveBeenCalled()
      const output = consoleErrorSpy.mock.calls[0][0]
      expect(output).toContain('FATAL')
      expect(output).toContain('Test fatal message')
    })
  })

  describe('Metadata Logging', () => {
    it('should include metadata in logs', () => {
      logger.info('Test with metadata', { userId: '123', action: 'login' })
      expect(consoleLogSpy).toHaveBeenCalled()
      const output = consoleLogSpy.mock.calls[0][0]
      expect(output).toContain('userId')
      expect(output).toContain('123')
      expect(output).toContain('action')
      expect(output).toContain('login')
    })

    it('should handle Error objects in error logs', () => {
      const error = new Error('Test error')
      error.stack = 'Error stack trace'

      logger.error('Error occurred', error, { context: 'test' })
      expect(consoleErrorSpy).toHaveBeenCalled()
      const output = consoleErrorSpy.mock.calls[0][0]

      expect(output).toContain('Test error')
      expect(output).toContain('Error stack trace')
    })

    it('should handle non-Error objects in error logs', () => {
      const customError = { code: 'CUSTOM_ERROR', details: 'Something went wrong' }

      logger.error('Custom error', customError)
      expect(consoleErrorSpy).toHaveBeenCalled()
      const output = consoleErrorSpy.mock.calls[0][0]

      expect(output).toContain('CUSTOM_ERROR')
      expect(output).toContain('Something went wrong')
    })
  })

  describe('Context Management', () => {
    it('should set and get context', () => {
      logger.setContext({ requestId: 'req-123', userId: 'user-456' })
      const context = logger.getContext()

      expect(context.requestId).toBe('req-123')
      expect(context.userId).toBe('user-456')
    })

    it('should merge context when setting multiple times', () => {
      logger.setContext({ requestId: 'req-123' })
      logger.setContext({ userId: 'user-456' })

      const context = logger.getContext()
      expect(context.requestId).toBe('req-123')
      expect(context.userId).toBe('user-456')
    })

    it('should clear context', () => {
      logger.setContext({ requestId: 'req-123', userId: 'user-456' })
      logger.clearContext()

      const context = logger.getContext()
      expect(Object.keys(context)).toHaveLength(0)
    })

    it('should include context in all logs', () => {
      logger.setContext({ requestId: 'req-789' })
      logger.info('Test message')

      expect(consoleLogSpy).toHaveBeenCalled()
      const output = consoleLogSpy.mock.calls[0][0]
      expect(output).toContain('req-789')
    })

    it('should merge context with log metadata', () => {
      logger.setContext({ requestId: 'req-123' })
      logger.info('Test message', { userId: 'user-456' })

      expect(consoleLogSpy).toHaveBeenCalled()
      const output = consoleLogSpy.mock.calls[0][0]
      expect(output).toContain('req-123')
      expect(output).toContain('user-456')
    })
  })

  describe('PII Redaction', () => {
    it('should redact password fields', () => {
      logger.info('User data', { username: 'john', password: 'secret123' })

      expect(consoleLogSpy).toHaveBeenCalled()
      const output = consoleLogSpy.mock.calls[0][0]
      expect(output).toContain('john')
      expect(output).not.toContain('secret123')
      expect(output).toContain('[REDACTED]')
    })

    it('should redact password_hash fields', () => {
      logger.info('User data', { email: 'test@example.com', password_hash: '$2b$10$...' })

      expect(consoleLogSpy).toHaveBeenCalled()
      const output = consoleLogSpy.mock.calls[0][0]
      expect(output).toContain('test@example.com')
      expect(output).not.toContain('$2b$10')
      expect(output).toContain('[REDACTED]')
    })

    it('should redact token fields', () => {
      logger.info('Auth data', { userId: '123', token: 'jwt-token-here' })

      expect(consoleLogSpy).toHaveBeenCalled()
      const output = consoleLogSpy.mock.calls[0][0]
      expect(output).not.toContain('jwt-token-here')
      expect(output).toContain('[REDACTED]')
    })

    it('should redact apiKey fields', () => {
      logger.info('API call', { endpoint: '/api/test', apiKey: 'sk-12345' })

      expect(consoleLogSpy).toHaveBeenCalled()
      const output = consoleLogSpy.mock.calls[0][0]
      expect(output).not.toContain('sk-12345')
      expect(output).toContain('[REDACTED]')
    })

    it('should redact authorization headers', () => {
      logger.info('Request', { authorization: 'Bearer token123' })

      expect(consoleLogSpy).toHaveBeenCalled()
      const output = consoleLogSpy.mock.calls[0][0]
      expect(output).not.toContain('Bearer token123')
      expect(output).toContain('[REDACTED]')
    })

    it('should redact cookie fields', () => {
      logger.info('Request', { cookie: 'sessionId=abc123' })

      expect(consoleLogSpy).toHaveBeenCalled()
      const output = consoleLogSpy.mock.calls[0][0]
      expect(output).not.toContain('sessionId=abc123')
      expect(output).toContain('[REDACTED]')
    })

    it('should redact secret fields', () => {
      logger.info('Config', { appName: 'test', secret: 'my-secret-key' })

      expect(consoleLogSpy).toHaveBeenCalled()
      const output = consoleLogSpy.mock.calls[0][0]
      expect(output).not.toContain('my-secret-key')
      expect(output).toContain('[REDACTED]')
    })

    it('should redact nested password fields', () => {
      logger.info('User update', {
        user: {
          name: 'John',
          password: 'secret123'
        }
      })

      expect(consoleLogSpy).toHaveBeenCalled()
      const output = consoleLogSpy.mock.calls[0][0]
      expect(output).toContain('John')
      expect(output).not.toContain('secret123')
      expect(output).toContain('[REDACTED]')
    })

    it('should not redact non-sensitive fields', () => {
      logger.info('Safe data', {
        username: 'john',
        email: 'john@example.com',
        age: 30,
        preferences: { theme: 'dark' }
      })

      expect(consoleLogSpy).toHaveBeenCalled()
      const output = consoleLogSpy.mock.calls[0][0]
      expect(output).toContain('john')
      expect(output).toContain('john@example.com')
      expect(output).toContain('30')
      expect(output).toContain('dark')
    })
  })

  describe('Log Level Filtering', () => {
    it('should respect DEBUG log level in development', () => {
      // In development (current env), DEBUG should be logged
      logger.debug('This should be logged in dev')
      expect(consoleLogSpy).toHaveBeenCalled()
      const output = consoleLogSpy.mock.calls[0][0]
      expect(output).toContain('DEBUG')
    })

    it('should log INFO messages', () => {
      logger.info('This should be logged')
      expect(consoleLogSpy).toHaveBeenCalled()
      const output = consoleLogSpy.mock.calls[0][0]
      expect(output).toContain('INFO')
    })

    it('should always log ERROR messages', () => {
      logger.error('Error message', new Error('test'))
      expect(consoleErrorSpy).toHaveBeenCalled()
      const output = consoleErrorSpy.mock.calls[0][0]
      expect(output).toContain('ERROR')
    })

    it('should always log FATAL messages', () => {
      logger.fatal('Fatal message')
      expect(consoleErrorSpy).toHaveBeenCalled()
      const output = consoleErrorSpy.mock.calls[0][0]
      expect(output).toContain('FATAL')
    })
  })

  describe('Output Formatting', () => {
    it('should use pretty print in development', () => {
      logger.info('Test message')

      expect(consoleLogSpy).toHaveBeenCalled()
      const output = consoleLogSpy.mock.calls[0][0]

      // Should contain ANSI color codes in development
      expect(output).toContain('\x1b')
      expect(output).toContain('INFO')
      expect(output).toContain('Test message')
    })

    it('should format logs with color codes for different levels', () => {
      // Clear previous calls
      consoleLogSpy.mockClear()
      consoleWarnSpy.mockClear()
      consoleErrorSpy.mockClear()

      logger.info('Info message')
      logger.warn('Warning message')
      logger.error('Error message')

      // Each level should have color codes
      expect(consoleLogSpy).toHaveBeenCalledTimes(1)
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1)
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1)

      const infoOutput = consoleLogSpy.mock.calls[0][0]
      const warnOutput = consoleWarnSpy.mock.calls[0][0]
      const errorOutput = consoleErrorSpy.mock.calls[0][0]

      expect(infoOutput).toContain('\x1b')
      expect(warnOutput).toContain('\x1b')
      expect(errorOutput).toContain('\x1b')
    })

    it('should include timestamp in all logs', () => {
      logger.info('Test message')

      expect(consoleLogSpy).toHaveBeenCalled()
      const output = consoleLogSpy.mock.calls[0][0]

      // ISO timestamp format
      expect(output).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
    })
  })

  describe('Child Logger', () => {
    it('should create child logger with additional context', () => {
      const parentLogger = new (logger.constructor as typeof Logger)()
      parentLogger.setContext({ requestId: 'req-123' })

      const childLogger = parentLogger.child({ userId: 'user-456' })
      childLogger.info('Child log')

      expect(consoleLogSpy).toHaveBeenCalled()
      const output = consoleLogSpy.mock.calls[0][0]
      expect(output).toContain('req-123')
      expect(output).toContain('user-456')
    })

    it('should not affect parent logger context', () => {
      const parentLogger = new (logger.constructor as typeof Logger)()
      parentLogger.setContext({ requestId: 'req-123' })

      const childLogger = parentLogger.child({ userId: 'user-456' })

      const parentContext = parentLogger.getContext()
      expect(parentContext.userId).toBeUndefined()
      expect(parentContext.requestId).toBe('req-123')
    })

    it('should allow multiple child loggers', () => {
      const parentLogger = new (logger.constructor as typeof Logger)()
      parentLogger.setContext({ requestId: 'req-123' })

      const child1 = parentLogger.child({ userId: 'user-1' })
      const child2 = parentLogger.child({ userId: 'user-2' })

      child1.info('Child 1')
      child2.info('Child 2')

      expect(consoleLogSpy).toHaveBeenCalledTimes(2)
      expect(consoleLogSpy.mock.calls[0][0]).toContain('user-1')
      expect(consoleLogSpy.mock.calls[1][0]).toContain('user-2')
    })
  })

  describe('Request ID Generation', () => {
    it('should generate unique request IDs', () => {
      const id1 = generateRequestId()
      const id2 = generateRequestId()

      expect(id1).not.toBe(id2)
      expect(id1).toMatch(/^req_\d+_[a-z0-9]+$/)
      expect(id2).toMatch(/^req_\d+_[a-z0-9]+$/)
    })

    it('should include timestamp in request ID', () => {
      const id = generateRequestId()
      const parts = id.split('_')

      expect(parts[0]).toBe('req')
      expect(Number(parts[1])).toBeGreaterThan(0)
      expect(parts[2]).toBeTruthy()
    })
  })

  describe('Request Logger', () => {
    function createMockRequest(method: string, url: string, headers: Record<string, string> = {}): Request {
      return {
        method,
        url,
        headers: {
          get: (key: string) => headers[key.toLowerCase()] || null,
        },
      } as Request
    }

    it('should create request logger with request context', () => {
      const req = createMockRequest('GET', 'http://localhost:3000/api/test', {
        'user-agent': 'Test Agent',
      })

      const requestLogger = createRequestLogger(req)
      requestLogger.info('Test log')

      expect(consoleLogSpy).toHaveBeenCalled()
      const output = consoleLogSpy.mock.calls[0][0]
      expect(output).toContain('GET')
      expect(output).toContain('/api/test')
      expect(output).toContain('Test Agent')
      expect(output).toMatch(/req_\d+_[a-z0-9]+/)
    })

    it('should handle missing user-agent', () => {
      const req = createMockRequest('POST', 'http://localhost:3000/api/submit')

      const requestLogger = createRequestLogger(req)
      const context = requestLogger.getContext()

      expect(context.method).toBe('POST')
      expect(context.path).toBe('/api/submit')
      expect(context.userAgent).toBeUndefined()
    })
  })

  describe('API Request Logging', () => {
    // Simple Response mock
    class MockResponse {
      status: number
      constructor(status: number) {
        this.status = status
      }
    }

    function createMockRequest(url: string): Request {
      return {
        method: 'GET',
        url,
        headers: {
          get: () => null,
        },
      } as Request
    }

    it('should log successful API requests', async () => {
      const req = createMockRequest('http://localhost:3000/api/test')
      const mockResponse = new MockResponse(200) as Response

      const handler = jest.fn(async () => mockResponse)

      const response = await logApiRequest(req, handler)

      expect(response).toBe(mockResponse)
      expect(consoleLogSpy).toHaveBeenCalledTimes(2) // start + complete

      const startLog = consoleLogSpy.mock.calls[0][0]
      const completeLog = consoleLogSpy.mock.calls[1][0]

      expect(startLog).toContain('API request started')
      expect(completeLog).toContain('API request completed')
      expect(completeLog).toContain('200')
      expect(completeLog).toContain('duration')
    })

    it('should log failed API requests', async () => {
      const req = createMockRequest('http://localhost:3000/api/test')
      const error = new Error('API failed')

      const handler = jest.fn(async () => {
        throw error
      })

      await expect(logApiRequest(req, handler)).rejects.toThrow('API failed')

      expect(consoleLogSpy).toHaveBeenCalledTimes(1) // start only
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1) // error

      const errorLog = consoleErrorSpy.mock.calls[0][0]
      expect(errorLog).toContain('API request failed')
      expect(errorLog).toContain('API failed')
      expect(errorLog).toContain('duration')
    })

    it('should measure request duration', async () => {
      const req = createMockRequest('http://localhost:3000/api/test')
      const mockResponse = new MockResponse(200) as Response

      const handler = jest.fn(async () => {
        await new Promise(resolve => setTimeout(resolve, 50))
        return mockResponse
      })

      await logApiRequest(req, handler)

      const completeLog = consoleLogSpy.mock.calls[1][0]
      expect(completeLog).toContain('duration')

      // Duration should be at least 50ms
      const match = completeLog.match(/"duration":\s*(\d+)/)
      if (match) {
        const duration = parseInt(match[1])
        expect(duration).toBeGreaterThanOrEqual(50)
      }
    })
  })

  describe('Performance Timing', () => {
    it('should time successful function execution', async () => {
      const testFn = jest.fn(async () => {
        await new Promise(resolve => setTimeout(resolve, 50))
        return 'result'
      })

      const result = await timeFunction('testOperation', testFn)

      expect(result).toBe('result')
      expect(testFn).toHaveBeenCalled()
      expect(consoleLogSpy).toHaveBeenCalled()

      const output = consoleLogSpy.mock.calls[0][0]
      expect(output).toContain('testOperation completed')
      expect(output).toContain('duration')
    })

    it('should time failed function execution', async () => {
      const error = new Error('Operation failed')
      const testFn = jest.fn(async () => {
        await new Promise(resolve => setTimeout(resolve, 50))
        throw error
      })

      await expect(timeFunction('failedOperation', testFn)).rejects.toThrow('Operation failed')

      expect(testFn).toHaveBeenCalled()
      expect(consoleErrorSpy).toHaveBeenCalled()

      const output = consoleErrorSpy.mock.calls[0][0]
      expect(output).toContain('failedOperation failed')
      expect(output).toContain('duration')
    })

    it('should use custom logger instance', async () => {
      const customLogger = new (logger.constructor as typeof Logger)()
      customLogger.setContext({ customContext: 'test' })

      await timeFunction('operation', async () => 'result', customLogger)

      expect(consoleLogSpy).toHaveBeenCalled()
      const output = consoleLogSpy.mock.calls[0][0]
      expect(output).toContain('customContext')
      expect(output).toContain('test')
    })
  })
})
