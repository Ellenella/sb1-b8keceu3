import { EthicGuardFirewall } from '../src/index';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('EthicGuardFirewall', () => {
  let firewall: EthicGuardFirewall;

  beforeEach(() => {
    firewall = new EthicGuardFirewall({
      apiKey: 'test-api-key',
      environment: 'development'
    });

    // Reset mocks
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should throw error if no API key provided', () => {
      expect(() => {
        new EthicGuardFirewall({} as any);
      }).toThrow('EthicGuard API key is required');
    });

    it('should initialize with default config', () => {
      const firewall = new EthicGuardFirewall({
        apiKey: 'test-key'
      });

      expect(firewall).toBeInstanceOf(EthicGuardFirewall);
    });

    it('should initialize with custom config', () => {
      const firewall = new EthicGuardFirewall({
        apiKey: 'test-key',
        baseUrl: 'https://custom.api.com',
        environment: 'staging',
        timeout: 5000
      });

      expect(firewall).toBeInstanceOf(EthicGuardFirewall);
    });
  });

  describe('shield', () => {
    it('should shield content successfully', async () => {
      const mockResponse = {
        data: {
          blocked: false,
          confidence: 85,
          requestId: 'req_123',
          riskScores: {
            toxicity: 10,
            bias: 5,
            hallucination: 8,
            pii: 0
          }
        }
      };

      mockedAxios.create.mockReturnValue({
        post: jest.fn().mockResolvedValue(mockResponse),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() }
        }
      } as any);

      const result = await firewall.shield({
        prompt: 'Hello, how are you?',
        userId: 'user-123'
      });

      expect(result.blocked).toBe(false);
      expect(result.confidence).toBe(85);
      expect(result.riskScores).toEqual({
        toxicity: 10,
        bias: 5,
        hallucination: 8,
        pii: 0
      });
    });

    it('should handle blocked content', async () => {
      const mockResponse = {
        data: {
          blocked: true,
          reason: 'Toxic content detected',
          severity: 'high',
          confidence: 95,
          requestId: 'req_456',
          suggestedResponse: 'Please rephrase your request.',
          riskScores: {
            toxicity: 95,
            bias: 10,
            hallucination: 5,
            pii: 0
          }
        }
      };

      mockedAxios.create.mockReturnValue({
        post: jest.fn().mockResolvedValue(mockResponse),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() }
        }
      } as any);

      const result = await firewall.shield({
        prompt: 'Toxic content here',
        userId: 'user-123'
      });

      expect(result.blocked).toBe(true);
      expect(result.reason).toBe('Toxic content detected');
      expect(result.severity).toBe('high');
      expect(result.suggestedResponse).toBe('Please rephrase your request.');
    });

    it('should handle API errors gracefully', async () => {
      mockedAxios.create.mockReturnValue({
        post: jest.fn().mockRejectedValue(new Error('API Error')),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() }
        }
      } as any);

      const result = await firewall.shield({
        prompt: 'Test prompt',
        userId: 'user-123'
      });

      // Should fail-safe to allow content
      expect(result.blocked).toBe(false);
      expect(result.confidence).toBe(0);
    });
  });

  describe('detectBias', () => {
    it('should detect bias successfully', async () => {
      const mockResponse = {
        data: {
          detected: true,
          biasTypes: ['gender'],
          confidence: 80,
          suggestions: ['Use gender-neutral language']
        }
      };

      mockedAxios.create.mockReturnValue({
        post: jest.fn().mockResolvedValue(mockResponse),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() }
        }
      } as any);

      const result = await firewall.detectBias('This job is perfect for a man');

      expect(result.detected).toBe(true);
      expect(result.biasTypes).toContain('gender');
      expect(result.confidence).toBe(80);
    });
  });

  describe('checkToxicity', () => {
    it('should check toxicity successfully', async () => {
      const mockResponse = {
        data: {
          toxic: false,
          score: 15,
          categories: []
        }
      };

      mockedAxios.create.mockReturnValue({
        post: jest.fn().mockResolvedValue(mockResponse),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() }
        }
      } as any);

      const result = await firewall.checkToxicity('This is a nice message');

      expect(result.toxic).toBe(false);
      expect(result.score).toBe(15);
    });
  });

  describe('healthCheck', () => {
    it('should return healthy status', async () => {
      const mockResponse = {
        data: {
          version: '1.0.0',
          services: {
            claude: 'operational',
            bert: 'operational',
            database: 'operational'
          }
        }
      };

      mockedAxios.create.mockReturnValue({
        get: jest.fn().mockResolvedValue(mockResponse),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() }
        }
      } as any);

      const result = await firewall.healthCheck();

      expect(result.status).toBe('healthy');
      expect(result.version).toBe('1.0.0');
      expect(result.services.claude).toBe('operational');
    });

    it('should handle unhealthy status', async () => {
      mockedAxios.create.mockReturnValue({
        get: jest.fn().mockRejectedValue(new Error('Service unavailable')),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() }
        }
      } as any);

      const result = await firewall.healthCheck();

      expect(result.status).toBe('unhealthy');
      expect(result.services.claude).toBe('down');
    });
  });

  describe('middleware', () => {
    it('should create Express middleware', () => {
      const middleware = firewall.middleware();
      expect(typeof middleware).toBe('function');
    });

    it('should process requests with prompts', async () => {
      const mockResponse = {
        data: {
          blocked: false,
          confidence: 85,
          requestId: 'req_123',
          riskScores: {
            toxicity: 10,
            bias: 5,
            hallucination: 8,
            pii: 0
          }
        }
      };

      mockedAxios.create.mockReturnValue({
        post: jest.fn().mockResolvedValue(mockResponse),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() }
        }
      } as any);

      const middleware = firewall.middleware();
      const req = {
        body: { prompt: 'Test prompt' },
        user: { id: 'user-123' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      await middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.ethicguard).toBeDefined();
    });
  });

  describe('static methods', () => {
    it('should return correct version', () => {
      expect(EthicGuardFirewall.version).toBe('1.0.0');
    });
  });
});