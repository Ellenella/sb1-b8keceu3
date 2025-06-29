import axios, { AxiosInstance } from 'axios';
import { createHash } from 'crypto';

export interface EthicGuardConfig {
  apiKey: string;
  baseUrl?: string;
  environment?: 'development' | 'staging' | 'production';
  timeout?: number;
  retries?: number;
}

export interface ShieldRequest {
  prompt: string;
  userId?: string;
  sessionId?: string;
  applicationId?: string;
  metadata?: Record<string, any>;
}

export interface ShieldResponse {
  blocked: boolean;
  reason?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  ruleViolated?: string;
  suggestedResponse?: string;
  requestId: string;
  processingTime: number;
  riskScores: {
    toxicity: number;
    bias: number;
    hallucination: number;
    pii: number;
  };
}

export interface LogRequest {
  prompt: string;
  response: string;
  userId?: string;
  sessionId?: string;
  applicationId?: string;
  metadata?: Record<string, any>;
}

export interface LogResponse {
  logged: boolean;
  requestId: string;
  complianceScore: number;
  violations: Array<{
    rule: string;
    severity: string;
    confidence: number;
  }>;
}

export interface BiasDetectionResult {
  detected: boolean;
  biasTypes: string[];
  confidence: number;
  suggestions: string[];
}

export interface ToxicityResult {
  toxic: boolean;
  score: number;
  categories: string[];
}

export interface ComplianceReport {
  totalRequests: number;
  blockedRequests: number;
  complianceScore: number;
  topViolations: Array<{
    rule: string;
    count: number;
    severity: string;
  }>;
  timeRange: {
    start: string;
    end: string;
  };
}

export interface HealthCheckResult {
  status: 'healthy' | 'unhealthy';
  version: string;
  latency: number;
  services: {
    claude: 'operational' | 'degraded' | 'down';
    bert: 'operational' | 'degraded' | 'down';
    database: 'operational' | 'degraded' | 'down';
  };
}

export class EthicGuardFirewall {
  private client: AxiosInstance;
  private config: Required<EthicGuardConfig>;

  constructor(config: EthicGuardConfig) {
    if (!config.apiKey) {
      throw new Error('EthicGuard API key is required');
    }

    this.config = {
      baseUrl: 'https://api.ethicguard.com/v1',
      environment: 'production',
      timeout: 30000,
      retries: 3,
      ...config
    };

    this.client = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': `EthicGuard-NodeJS-SDK/1.0.0`,
        'X-Environment': this.config.environment
      }
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        if (this.config.environment === 'development') {
          console.log(`[EthicGuard] ${config.method?.toUpperCase()} ${config.url}`);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling and retries
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 429) {
          console.warn('[EthicGuard] Rate limit exceeded, retrying...');
          await this.delay(1000);
          return this.client.request(error.config);
        }
        
        if (error.response?.status >= 500 && error.config.retryCount < this.config.retries) {
          error.config.retryCount = (error.config.retryCount || 0) + 1;
          await this.delay(Math.pow(2, error.config.retryCount) * 1000);
          return this.client.request(error.config);
        }
        
        return Promise.reject(error);
      }
    );
  }

  /**
   * Shield an AI prompt before processing
   * Blocks harmful, biased, or non-compliant content using Claude 3 Sonnet and BERT
   */
  async shield(request: ShieldRequest): Promise<ShieldResponse> {
    try {
      const startTime = Date.now();
      
      // Hash the prompt for privacy
      const promptHash = this.hashContent(request.prompt);
      
      const response = await this.client.post('/shield', {
        promptHash,
        prompt: request.prompt, // In production, only send hash
        userId: request.userId,
        sessionId: request.sessionId,
        applicationId: request.applicationId,
        metadata: request.metadata,
        timestamp: new Date().toISOString()
      });

      const processingTime = Date.now() - startTime;

      return {
        blocked: response.data.blocked,
        reason: response.data.reason,
        severity: response.data.severity,
        confidence: response.data.confidence,
        ruleViolated: response.data.ruleViolated,
        suggestedResponse: response.data.suggestedResponse,
        requestId: response.data.requestId,
        processingTime,
        riskScores: response.data.riskScores
      };
    } catch (error) {
      console.error('[EthicGuard] Shield request failed:', error);
      
      // Fail-safe: allow request but log the error
      return {
        blocked: false,
        confidence: 0,
        requestId: this.generateRequestId(),
        processingTime: 0,
        riskScores: {
          toxicity: 0,
          bias: 0,
          hallucination: 0,
          pii: 0
        }
      };
    }
  }

  /**
   * Log AI response for monitoring and compliance
   */
  async logResponse(request: LogRequest): Promise<LogResponse> {
    try {
      const promptHash = this.hashContent(request.prompt);
      const responseHash = this.hashContent(request.response);

      const response = await this.client.post('/log', {
        promptHash,
        responseHash,
        userId: request.userId,
        sessionId: request.sessionId,
        applicationId: request.applicationId,
        metadata: request.metadata,
        timestamp: new Date().toISOString()
      });

      return {
        logged: true,
        requestId: response.data.requestId,
        complianceScore: response.data.complianceScore,
        violations: response.data.violations || []
      };
    } catch (error) {
      console.error('[EthicGuard] Log request failed:', error);
      return {
        logged: false,
        requestId: this.generateRequestId(),
        complianceScore: 0,
        violations: []
      };
    }
  }

  /**
   * Detect bias in content using Claude 3 Sonnet
   */
  async detectBias(content: string, options?: { types?: string[] }): Promise<BiasDetectionResult> {
    try {
      const response = await this.client.post('/analyze/bias', {
        content,
        types: options?.types || ['gender', 'racial', 'age', 'religious']
      });

      return response.data;
    } catch (error) {
      console.error('[EthicGuard] Bias detection failed:', error);
      return {
        detected: false,
        biasTypes: [],
        confidence: 0,
        suggestions: []
      };
    }
  }

  /**
   * Check content toxicity using BERT models
   */
  async checkToxicity(content: string): Promise<ToxicityResult> {
    try {
      const response = await this.client.post('/analyze/toxicity', {
        content
      });

      return response.data;
    } catch (error) {
      console.error('[EthicGuard] Toxicity check failed:', error);
      return {
        toxic: false,
        score: 0,
        categories: []
      };
    }
  }

  /**
   * Generate compliance report
   */
  async getComplianceReport(
    startDate: string, 
    endDate: string, 
    applicationId?: string
  ): Promise<ComplianceReport> {
    try {
      const params = new URLSearchParams({
        startDate,
        endDate,
        ...(applicationId && { applicationId })
      });

      const response = await this.client.get(`/reports/compliance?${params}`);
      return response.data;
    } catch (error) {
      console.error('[EthicGuard] Compliance report failed:', error);
      throw error;
    }
  }

  /**
   * Middleware for Express.js applications
   */
  middleware() {
    return async (req: any, res: any, next: any) => {
      if (req.body && req.body.prompt) {
        try {
          const shieldResult = await this.shield({
            prompt: req.body.prompt,
            userId: req.user?.id || req.body.userId,
            sessionId: req.sessionID || req.body.sessionId,
            applicationId: req.headers['x-application-id'] || req.body.applicationId
          });

          if (shieldResult.blocked) {
            return res.status(400).json({
              error: 'Content blocked by AI Firewall',
              reason: shieldResult.reason,
              severity: shieldResult.severity,
              requestId: shieldResult.requestId,
              suggestedResponse: shieldResult.suggestedResponse
            });
          }

          req.ethicguard = shieldResult;
        } catch (error) {
          console.error('[EthicGuard] Middleware error:', error);
          // Continue processing on error (fail-safe)
        }
      }
      next();
    };
  }

  /**
   * Decorator for protecting functions
   */
  protect(options?: { userId?: string; applicationId?: string }) {
    return (target: any, propertyName: string, descriptor: PropertyDescriptor) => {
      const method = descriptor.value;

      descriptor.value = async function (...args: any[]) {
        const prompt = args[0]; // Assume first argument is the prompt
        
        if (typeof prompt === 'string') {
          const shieldResult = await this.shield({
            prompt,
            userId: options?.userId,
            applicationId: options?.applicationId
          });

          if (shieldResult.blocked) {
            throw new Error(`Content blocked: ${shieldResult.reason}`);
          }
        }

        return method.apply(this, args);
      };
    };
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    try {
      const response = await this.client.get('/health');
      return {
        status: 'healthy',
        version: response.data.version,
        latency: Date.now() - startTime,
        services: response.data.services || {
          claude: 'operational',
          bert: 'operational',
          database: 'operational'
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        version: 'unknown',
        latency: Date.now() - startTime,
        services: {
          claude: 'down',
          bert: 'down',
          database: 'down'
        }
      };
    }
  }

  /**
   * Configure custom rules
   */
  async configureRules(rules: Record<string, any>): Promise<{ success: boolean; rulesApplied: number }> {
    try {
      const response = await this.client.post('/rules/configure', { rules });
      return response.data;
    } catch (error) {
      console.error('[EthicGuard] Rule configuration failed:', error);
      throw error;
    }
  }

  /**
   * Get current configuration
   */
  async getConfiguration(): Promise<Record<string, any>> {
    try {
      const response = await this.client.get('/configuration');
      return response.data;
    } catch (error) {
      console.error('[EthicGuard] Get configuration failed:', error);
      throw error;
    }
  }

  /**
   * Utility methods
   */
  private hashContent(content: string): string {
    return createHash('sha256').update(content).digest('hex');
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get SDK version
   */
  static get version(): string {
    return '1.0.0';
  }
}

// Export types and main class
export default EthicGuardFirewall;

// Named exports for convenience
export {
  EthicGuardFirewall as Firewall,
  EthicGuardFirewall as EthicGuard
};