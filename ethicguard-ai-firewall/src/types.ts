/**
 * Type definitions for EthicGuard AI Firewall SDK
 */

export interface DetectionResult {
  blocked: boolean;
  confidence: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  riskScores: {
    toxicity: number;
    bias: number;
    hallucination: number;
    pii: number;
  };
  detectedIssues: string[];
  suggestedResponse?: string;
}

export interface BiasAnalysis {
  hasBias: boolean;
  biasTypes: string[];
  confidence: number;
  explanation: string;
}

export interface ToxicityAnalysis {
  isToxic: boolean;
  toxicityScore: number;
  categories: string[];
  explanation: string;
}

export interface PIIDetection {
  detected: boolean;
  confidence: number;
  types: string[];
  locations: Array<{
    type: string;
    start: number;
    end: number;
    value: string;
  }>;
}

export interface HallucinationCheck {
  detected: boolean;
  confidence: number;
  explanation: string;
  factualErrors: string[];
}

export interface ComplianceMetrics {
  totalRequests: number;
  blockedRequests: number;
  flaggedRequests: number;
  complianceScore: number;
  averageRiskScore: number;
  topViolations: Array<{
    rule: string;
    count: number;
    severity: string;
    trend: 'increasing' | 'decreasing' | 'stable';
  }>;
}

export interface RuleConfiguration {
  name: string;
  type: 'toxicity' | 'bias' | 'pii' | 'hallucination' | 'custom';
  threshold: number;
  action: 'block' | 'flag' | 'log';
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
  metadata?: Record<string, any>;
}

export interface APIError {
  code: string;
  message: string;
  details?: Record<string, any>;
  requestId?: string;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

export interface SDKOptions {
  retryAttempts?: number;
  retryDelay?: number;
  enableLogging?: boolean;
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
  customHeaders?: Record<string, string>;
}