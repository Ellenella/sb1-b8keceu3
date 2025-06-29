// Bot Service - Manages bot data and provides it to other components
export interface BotData {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'suspended';
  requestCount: number;
  blockedCount: number;
  complianceScore: number;
  rules: string[];
  lastActivity: string;
  createdAt: string;
}

class BotService {
  private static instance: BotService;
  private bots: BotData[] = [
    {
      id: 'bot_001',
      name: 'Customer Support Bot',
      description: 'Handles customer inquiries and support tickets',
      status: 'active',
      requestCount: 15847,
      blockedCount: 234,
      complianceScore: 94.2,
      rules: ['Toxicity Detection', 'PII Protection', 'Bias Filter'],
      lastActivity: '2 minutes ago',
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 'bot_002',
      name: 'Content Moderation Bot',
      description: 'Moderates user-generated content and comments',
      status: 'active',
      requestCount: 8934,
      blockedCount: 567,
      complianceScore: 91.8,
      rules: ['Toxicity Detection', 'Profanity Filter', 'Hate Speech Detection'],
      lastActivity: '5 minutes ago',
      createdAt: '2024-01-10T14:20:00Z'
    },
    {
      id: 'bot_003',
      name: 'HR Assistant Bot',
      description: 'Assists with HR queries and job recommendations',
      status: 'inactive',
      requestCount: 2156,
      blockedCount: 89,
      complianceScore: 96.5,
      rules: ['Bias Detection', 'Gender Bias Filter', 'Age Bias Filter'],
      lastActivity: '2 days ago',
      createdAt: '2024-01-05T09:15:00Z'
    }
  ];

  static getInstance(): BotService {
    if (!BotService.instance) {
      BotService.instance = new BotService();
    }
    return BotService.instance;
  }

  // Get all bots
  getBots(): BotData[] {
    return this.bots;
  }

  // Get active bots only
  getActiveBots(): BotData[] {
    return this.bots.filter(bot => bot.status === 'active');
  }

  // Get aggregated metrics from all bots
  getAggregatedMetrics() {
    const activeBots = this.getActiveBots();
    
    const totalRequests = activeBots.reduce((sum, bot) => sum + bot.requestCount, 0);
    const totalBlocked = activeBots.reduce((sum, bot) => sum + bot.blockedCount, 0);
    const avgCompliance = activeBots.length > 0 
      ? activeBots.reduce((sum, bot) => sum + bot.complianceScore, 0) / activeBots.length 
      : 0;

    // Get unique rules across all active bots
    const allRules = new Set<string>();
    activeBots.forEach(bot => {
      bot.rules.forEach(rule => allRules.add(rule));
    });

    return {
      totalRequests,
      totalBlocked,
      avgCompliance: Math.round(avgCompliance * 10) / 10,
      activeRules: allRules.size,
      activeBots: activeBots.length,
      totalBots: this.bots.length
    };
  }

  // Generate incidents based on bot activity
  generateIncidentsFromBots() {
    const incidents = [];
    const incidentTypes = [
      { type: 'Bias Detection', severity: 'high', rules: ['Bias Detection', 'Gender Bias Filter', 'Racial Bias Filter'] },
      { type: 'Toxic Content', severity: 'critical', rules: ['Toxicity Detection', 'Hate Speech Detection'] },
      { type: 'PII Exposure', severity: 'high', rules: ['PII Protection'] },
      { type: 'Profanity Filter', severity: 'medium', rules: ['Profanity Filter'] },
      { type: 'Medical Advice', severity: 'high', rules: ['Medical Advice Filter'] }
    ];

    const activeBots = this.getActiveBots();
    
    // Generate incidents based on bot activity and rules
    activeBots.forEach(bot => {
      const botIncidentCount = Math.floor(bot.blockedCount * 0.1); // 10% of blocked requests become incidents
      
      for (let i = 0; i < Math.min(botIncidentCount, 3); i++) {
        // Find incident types that match bot's rules
        const matchingIncidents = incidentTypes.filter(incident => 
          incident.rules.some(rule => bot.rules.includes(rule))
        );
        
        if (matchingIncidents.length > 0) {
          const incident = matchingIncidents[Math.floor(Math.random() * matchingIncidents.length)];
          const minutesAgo = Math.floor(Math.random() * 120) + (i * 10);
          
          incidents.push({
            id: `${bot.id}_incident_${i}`,
            type: incident.type,
            message: this.generateIncidentMessage(incident.type, bot.name),
            severity: incident.severity,
            time: this.formatTimeAgo(minutesAgo),
            status: incident.severity === 'critical' ? 'blocked' : (Math.random() > 0.3 ? 'blocked' : 'flagged'),
            confidence: Math.round((80 + Math.random() * 15) * 10) / 10,
            botId: bot.id,
            botName: bot.name
          });
        }
      }
    });

    return incidents.sort((a, b) => {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity as keyof typeof severityOrder] - severityOrder[a.severity as keyof typeof severityOrder];
    });
  }

  private generateIncidentMessage(type: string, botName: string): string {
    const messages = {
      'Bias Detection': [
        `Gender bias detected in ${botName} response`,
        `Racial bias identified in ${botName} output`,
        `Age bias found in ${botName} recommendation`
      ],
      'Toxic Content': [
        `Harmful language detected in ${botName} interaction`,
        `Offensive content blocked by ${botName}`,
        `Hate speech prevented in ${botName} response`
      ],
      'PII Exposure': [
        `Personal information exposure risk in ${botName}`,
        `PII leak prevented by ${botName} protection`,
        `Sensitive data blocked in ${botName} output`
      ],
      'Profanity Filter': [
        `Explicit language filtered by ${botName}`,
        `Inappropriate content blocked in ${botName}`,
        `Profanity detected and removed by ${botName}`
      ],
      'Medical Advice': [
        `Unauthorized medical advice blocked by ${botName}`,
        `Health recommendation flagged in ${botName}`,
        `Medical diagnosis attempt prevented by ${botName}`
      ]
    };

    const typeMessages = messages[type as keyof typeof messages] || [`Issue detected in ${botName}`];
    return typeMessages[Math.floor(Math.random() * typeMessages.length)];
  }

  private formatTimeAgo(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else {
      const hours = Math.floor(minutes / 60);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    }
  }

  // Generate risk score data based on bot rules and activity
  generateRiskScoreData() {
    const activeBots = this.getActiveBots();
    const data = [];
    
    for (let i = 23; i >= 0; i--) {
      const time = new Date(Date.now() - i * 60 * 60 * 1000);
      const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
      
      // Calculate risk scores based on bot activity and rules
      let biasRisk = 0;
      let toxicityRisk = 0;
      let hallucinationRisk = 0;
      
      activeBots.forEach(bot => {
        const activityMultiplier = bot.requestCount > 1000 ? 1.2 : 0.8;
        const complianceMultiplier = (100 - bot.complianceScore) / 100;
        
        if (bot.rules.some(rule => rule.includes('Bias'))) {
          biasRisk += (15 + Math.random() * 10) * activityMultiplier * complianceMultiplier;
        }
        
        if (bot.rules.some(rule => rule.includes('Toxicity') || rule.includes('Hate'))) {
          toxicityRisk += (10 + Math.random() * 8) * activityMultiplier * complianceMultiplier;
        }
        
        // Hallucination risk based on general AI activity
        hallucinationRisk += (8 + Math.random() * 7) * activityMultiplier * complianceMultiplier;
      });
      
      // Normalize and add time-based variation
      const hour = time.getHours();
      const businessHourMultiplier = (hour >= 8 && hour <= 18) ? 1.3 : 0.7;
      
      data.push({
        time: timeStr,
        bias: Math.round(Math.max(5, Math.min(50, biasRisk * businessHourMultiplier))),
        toxicity: Math.round(Math.max(3, Math.min(40, toxicityRisk * businessHourMultiplier))),
        hallucination: Math.round(Math.max(8, Math.min(35, hallucinationRisk * businessHourMultiplier)))
      });
    }
    
    return data;
  }

  // Generate weekly incident data based on bot activity
  generateWeeklyIncidentData() {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const activeBots = this.getActiveBots();
    
    return days.map((day, index) => {
      const weekdayMultiplier = index < 5 ? 1.2 : 0.6; // More activity on weekdays
      
      let totalBlocked = 0;
      let totalFlagged = 0;
      
      activeBots.forEach(bot => {
        const dailyActivity = bot.requestCount / 30; // Approximate daily requests
        const blockRate = bot.blockedCount / bot.requestCount;
        
        const dailyBlocked = Math.round(dailyActivity * blockRate * weekdayMultiplier * (0.8 + Math.random() * 0.4));
        const dailyFlagged = Math.round(dailyBlocked * 1.5); // More flagged than blocked
        
        totalBlocked += dailyBlocked;
        totalFlagged += dailyFlagged;
      });
      
      return {
        day,
        blocked: Math.max(1, totalBlocked),
        flagged: Math.max(2, totalFlagged)
      };
    });
  }

  // Subscribe to bot updates (simulated real-time updates)
  subscribeToUpdates(callback: (bots: BotData[]) => void): () => void {
    const interval = setInterval(() => {
      // Simulate bot activity updates
      this.bots = this.bots.map(bot => {
        if (bot.status === 'active') {
          const requestIncrease = Math.floor(Math.random() * 10) + 1;
          const blockIncrease = Math.random() > 0.7 ? Math.floor(Math.random() * 3) : 0;
          
          return {
            ...bot,
            requestCount: bot.requestCount + requestIncrease,
            blockedCount: bot.blockedCount + blockIncrease,
            lastActivity: Math.random() > 0.5 ? 'Just now' : `${Math.floor(Math.random() * 5) + 1} minutes ago`
          };
        }
        return bot;
      });
      
      callback(this.bots);
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }
}

export const botService = BotService.getInstance();