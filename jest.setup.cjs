// Learn more: https://github.com/testing-library/jest-dom
require('@testing-library/jest-dom')

// Mock environment variables
process.env.NEXTAUTH_URL = 'http://localhost:3000'
process.env.NEXTAUTH_SECRET = 'test-secret-key-minimum-32-characters-long-for-production'
process.env.MONGODB_URI = 'mongodb://localhost:27017/porchestDB_test'
process.env.NODE_ENV = 'test'

// Suppress console errors in tests (unless explicitly testing error logging)
const originalError = console.error
const originalWarn = console.warn

beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render') ||
        args[0].includes('Not implemented: HTMLFormElement.prototype.submit') ||
        args[0].includes('Error: Not implemented'))
    ) {
      return
    }
    originalError.call(console, ...args)
  }

  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ')
    ) {
      return
    }
    originalWarn.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
  console.warn = originalWarn
})

// Global test utilities
global.mockSession = (role = 'brand', email = 'test@example.com') => {
  return {
    user: {
      id: 'test-user-id',
      email,
      name: 'Test User',
      role,
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  }
}

global.mockRequest = (body = {}, headers = {}) => {
  return {
    json: async () => body,
    headers: new Headers(headers),
  }
}
