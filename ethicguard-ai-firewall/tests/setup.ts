/**
 * Test setup configuration
 */

// Mock environment variables for testing
process.env.ETHICGUARD_API_KEY = 'test-api-key';
process.env.ETHICGUARD_BASE_URL = 'https://api.test.ethicguard.com/v1';

// Global test timeout
jest.setTimeout(30000);

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};