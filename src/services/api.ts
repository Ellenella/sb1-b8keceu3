import { supabase } from '../lib/supabase';
import { botService } from './botService';
import { aiDetectionService } from './aiDetectionService';

export interface DashboardMetrics {
  totalRequests: number;
  blockedRequests: number;
  complianceScore: number;
  activeRules: number;
  requestsChange: string;
  blockedChange: string;
  complianceChange: string;
  rulesChange: string;
}

export interface RiskScoreData {
  time: string;
  bias: number;
  toxicity: number;
  hallucination: number;
}

export interface IncidentData {
  day: string;
  blocked: number;
  flagged: number;
}

export interface RecentIncident {
  id: number | string;
  type: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  time: string;
  status: 'blocked' | 'flagged';
  confidence?: number;
  botId?: string;
  botName?: string;
}

// Enhanced API that integrates with bot data and real AI detection
export class DashboardAPI {
  private static instance: DashboardAPI;
  private metricsCache: DashboardMetrics | null = null;
  private lastFetch: number = 0;
  private readonly CACHE_DURATION = 30000; // 30 seconds

  static getInstance(): DashboardAPI {
    if (!DashboardAPI.instance) {
      DashboardAPI.instance = new DashboardAPI();
    }
    return DashboardAPI.instance;
  }

  // Get metrics from integrated bot data
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const now = Date.now();
    
    // Use cache if recent
    if (this.metricsCache && (now - this.lastFetch) < this.CACHE_DURATION) {
      return this.metricsCache;
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Get real data from bot service
    const botMetrics = botService.getAggregatedMetrics();
    
    // Add some realistic variation and growth simulation
    const baseTime = Math.floor(now / 60000); // Change every minute
    const variation = Math.sin(baseTime * 0.1) * 0.1; // ±10% variation
    
    const totalRequests = Math.floor(botMetrics.totalRequests * (1 + variation));
    const blockedRequests = Math.floor(botMetrics.totalBlocked * (1 + variation * 0.5));
    const complianceScore = Math.max(85, Math.min(99, botMetrics.avgCompliance + variation * 5));
    const activeRules = botMetrics.activeRules;

    // Calculate realistic changes (simulate week-over-week comparison)
    const prevWeekMultiplier = 0.85 + Math.random() * 0.3; // 85-115% of current
    const requestsChange = Math.round(((1 - prevWeekMultiplier) * 100));
    const blockedChange = Math.round(((1 - prevWeekMultiplier * 0.9) * 100)); // Slightly different trend
    const complianceChange = Math.round(((complianceScore / (complianceScore - 2)) - 1) * 100 * 10) / 10;

    this.metricsCache = {
      totalRequests,
      blockedRequests,
      complianceScore: Math.round(complianceScore * 10) / 10,
      activeRules,
      requestsChange: `${requestsChange >= 0 ? '+' : ''}${requestsChange}%`,
      blockedChange: `${blockedChange >= 0 ? '+' : ''}${blockedChange}%`,
      complianceChange: `${complianceChange >= 0 ? '+' : ''}${complianceChange}%`,
      rulesChange: `+${Math.floor(Math.random() * 3)}`, // Rules don't change as frequently
    };

    this.lastFetch = now;
    return this.metricsCache;
  }

  // Get risk score data from bot service
  async getRiskScoreData(): Promise<RiskScoreData[]> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return botService.generateRiskScoreData();
  }

  // Get weekly incident data from bot service
  async getWeeklyIncidentData(): Promise<IncidentData[]> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return botService.generateWeeklyIncidentData();
  }

  // Get recent incidents from bot activity
  async getRecentIncidents(): Promise<RecentIncident[]> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return botService.generateIncidentsFromBots();
  }

  // NEW: Real AI content analysis using Claude and BERT
  async analyzeContent(prompt: string, response?: string, userId?: string): Promise<{
    blocked: boolean;
    reason?: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    confidence: number;
    riskScores: {
      toxicity: number;
      bias: number;
      hallucination: number;
      pii: number;
    };
    detectedIssues: string[];
    suggestedResponse?: string;
    requestId: string;
  }> {
    try {
      // Use real AI detection service
      const detectionResult = await aiDetectionService.detectContent(prompt, response);
      
      // Log the analysis to database if Supabase is configured
      const requestId = this.generateRequestId();
      
      try {
        if (supabase) {
          await supabase.from('incidents').insert({
            prompt_hash: this.hashContent(prompt),
            response_hash: response ? this.hashContent(response) : null,
            rule_violated: detectionResult.detectedIssues.join(', ') || 'No violations',
            severity: detectionResult.severity,
            blocked_reason: detectionResult.detectedIssues.join('; '),
            suggested_fix: detectionResult.suggestedResponse,
            user_id: userId,
            application_id: 'ai-governance-dashboard',
            metadata: {
              riskScores: detectionResult.riskScores,
              confidence: detectionResult.confidence,
              detectionMethod: 'claude-bert-hybrid'
            }
          });
        }
      } catch (dbError) {
        console.error('Failed to log incident to database:', dbError);
      }

      return {
        blocked: detectionResult.blocked,
        reason: detectionResult.detectedIssues.join('; '),
        severity: detectionResult.severity,
        confidence: detectionResult.confidence,
        riskScores: detectionResult.riskScores,
        detectedIssues: detectionResult.detectedIssues,
        suggestedResponse: detectionResult.suggestedResponse,
        requestId
      };

    } catch (error) {
      console.error('Content analysis error:', error);
      
      // Fallback to basic analysis
      return {
        blocked: false,
        reason: 'Analysis service unavailable',
        severity: 'low',
        confidence: 0,
        riskScores: { toxicity: 0, bias: 0, hallucination: 0, pii: 0 },
        detectedIssues: ['Service unavailable'],
        requestId: this.generateRequestId()
      };
    }
  }

  // Subscribe to real-time metrics updates
  subscribeToMetrics(callback: (metrics: DashboardMetrics) => void): () => void {
    const interval = setInterval(async () => {
      try {
        // Clear cache to force fresh data
        this.metricsCache = null;
        const metrics = await this.getDashboardMetrics();
        callback(metrics);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }

  // Subscribe to real-time incident updates
  subscribeToIncidents(callback: (incidents: RecentIncident[]) => void): () => void {
    const interval = setInterval(async () => {
      try {
        const incidents = await this.getRecentIncidents();
        callback(incidents);
      } catch (error) {
        console.error('Error fetching incidents:', error);
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }

  // Get bot-specific analytics
  async getBotAnalytics(botId?: string) {
    const bots = botService.getBots();
    
    if (botId) {
      const bot = bots.find(b => b.id === botId);
      if (!bot) throw new Error('Bot not found');
      
      return {
        bot,
        incidents: botService.generateIncidentsFromBots().filter(i => i.botId === botId),
        performance: {
          requestCount: bot.requestCount,
          blockedCount: bot.blockedCount,
          blockRate: (bot.blockedCount / bot.requestCount) * 100,
          complianceScore: bot.complianceScore
        }
      };
    }
    
    return {
      bots,
      totalMetrics: botService.getAggregatedMetrics(),
      allIncidents: botService.generateIncidentsFromBots()
    };
  }

  // Utility methods
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private hashContent(content: string): string {
    // Simple hash function for demo - in production use crypto
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }
}

export const dashboardAPI = DashboardAPI.getInstance();