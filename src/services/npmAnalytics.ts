// NPM Analytics Service - Real API integration for package monitoring
export interface NPMPackageData {
  name: string;
  version: string;
  description: string;
  downloads: {
    lastDay: number;
    lastWeek: number;
    lastMonth: number;
  };
  repository?: {
    type: string;
    url: string;
  };
  maintainers: Array<{
    name: string;
    email: string;
  }>;
  time: {
    created: string;
    modified: string;
  };
  size: number;
  dependencies: Record<string, string>;
}

export interface GitHubRepoData {
  id: number;
  name: string;
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  language: string;
  topics: string[];
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed';
  user: {
    login: string;
    avatar_url: string;
  };
  labels: Array<{
    name: string;
    color: string;
  }>;
  created_at: string;
  updated_at: string;
  comments: number;
}

class NPMAnalyticsService {
  private static instance: NPMAnalyticsService;
  private readonly NPM_API_BASE = 'https://registry.npmjs.org';
  private readonly NPM_DOWNLOADS_API = 'https://api.npmjs.org/downloads';
  private readonly GITHUB_API_BASE = 'https://api.github.com';

  static getInstance(): NPMAnalyticsService {
    if (!NPMAnalyticsService.instance) {
      NPMAnalyticsService.instance = new NPMAnalyticsService();
    }
    return NPMAnalyticsService.instance;
  }

  /**
   * Fetch package information from NPM registry
   */
  async getPackageInfo(packageName: string): Promise<NPMPackageData> {
    try {
      const response = await fetch(`${this.NPM_API_BASE}/${packageName}`);
      if (!response.ok) {
        throw new Error(`NPM API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Get download statistics
      const downloads = await this.getDownloadStats(packageName);
      
      return {
        name: data.name,
        version: data['dist-tags'].latest,
        description: data.description,
        downloads,
        repository: data.repository,
        maintainers: data.maintainers || [],
        time: data.time,
        size: data.versions[data['dist-tags'].latest].dist?.unpackedSize || 0,
        dependencies: data.versions[data['dist-tags'].latest].dependencies || {}
      };
    } catch (error) {
      console.error('Error fetching package info:', error);
      throw error;
    }
  }

  /**
   * Fetch download statistics from NPM
   */
  async getDownloadStats(packageName: string): Promise<{
    lastDay: number;
    lastWeek: number;
    lastMonth: number;
  }> {
    try {
      const [dayResponse, weekResponse, monthResponse] = await Promise.all([
        fetch(`${this.NPM_DOWNLOADS_API}/point/last-day/${packageName}`),
        fetch(`${this.NPM_DOWNLOADS_API}/point/last-week/${packageName}`),
        fetch(`${this.NPM_DOWNLOADS_API}/point/last-month/${packageName}`)
      ]);

      const [dayData, weekData, monthData] = await Promise.all([
        dayResponse.json(),
        weekResponse.json(),
        monthResponse.json()
      ]);

      return {
        lastDay: dayData.downloads || 0,
        lastWeek: weekData.downloads || 0,
        lastMonth: monthData.downloads || 0
      };
    } catch (error) {
      console.error('Error fetching download stats:', error);
      return { lastDay: 0, lastWeek: 0, lastMonth: 0 };
    }
  }

  /**
   * Fetch detailed download history
   */
  async getDownloadHistory(packageName: string, period: string = 'last-month'): Promise<Array<{
    day: string;
    downloads: number;
  }>> {
    try {
      const response = await fetch(`${this.NPM_DOWNLOADS_API}/range/${period}/${packageName}`);
      if (!response.ok) {
        throw new Error(`Downloads API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.downloads || [];
    } catch (error) {
      console.error('Error fetching download history:', error);
      return [];
    }
  }

  /**
   * Fetch GitHub repository information
   */
  async getGitHubRepoInfo(owner: string, repo: string): Promise<GitHubRepoData> {
    try {
      const response = await fetch(`${this.GITHUB_API_BASE}/repos/${owner}/${repo}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          // Add GitHub token if available
          ...(process.env.GITHUB_TOKEN && {
            'Authorization': `token ${process.env.GITHUB_TOKEN}`
          })
        }
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching GitHub repo info:', error);
      throw error;
    }
  }

  /**
   * Fetch GitHub issues for feedback analysis
   */
  async getGitHubIssues(owner: string, repo: string, state: 'open' | 'closed' | 'all' = 'all'): Promise<GitHubIssue[]> {
    try {
      const response = await fetch(`${this.GITHUB_API_BASE}/repos/${owner}/${repo}/issues?state=${state}&per_page=100`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          ...(process.env.GITHUB_TOKEN && {
            'Authorization': `token ${process.env.GITHUB_TOKEN}`
          })
        }
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching GitHub issues:', error);
      return [];
    }
  }

  /**
   * Analyze package health and trends
   */
  async analyzePackageHealth(packageName: string): Promise<{
    healthScore: number;
    trends: {
      downloads: 'increasing' | 'decreasing' | 'stable';
      issues: 'improving' | 'worsening' | 'stable';
      community: 'growing' | 'shrinking' | 'stable';
    };
    recommendations: string[];
  }> {
    try {
      const packageInfo = await this.getPackageInfo(packageName);
      const downloadHistory = await this.getDownloadHistory(packageName);
      
      // Calculate health score based on various factors
      let healthScore = 100;
      const recommendations: string[] = [];

      // Download trend analysis
      const recentDownloads = downloadHistory.slice(-7);
      const olderDownloads = downloadHistory.slice(-14, -7);
      
      const recentAvg = recentDownloads.reduce((sum, d) => sum + d.downloads, 0) / recentDownloads.length;
      const olderAvg = olderDownloads.reduce((sum, d) => sum + d.downloads, 0) / olderDownloads.length;
      
      const downloadTrend = recentAvg > olderAvg * 1.1 ? 'increasing' : 
                           recentAvg < olderAvg * 0.9 ? 'decreasing' : 'stable';

      if (downloadTrend === 'decreasing') {
        healthScore -= 20;
        recommendations.push('Downloads are declining. Consider marketing efforts or feature updates.');
      }

      // Dependency analysis
      const depCount = Object.keys(packageInfo.dependencies).length;
      if (depCount > 10) {
        healthScore -= 10;
        recommendations.push('Consider reducing dependencies to improve package reliability.');
      }

      // Size analysis
      if (packageInfo.size > 1000000) { // 1MB
        healthScore -= 15;
        recommendations.push('Package size is large. Consider optimizing bundle size.');
      }

      return {
        healthScore: Math.max(0, healthScore),
        trends: {
          downloads: downloadTrend,
          issues: 'stable', // Would need GitHub data for accurate analysis
          community: downloadTrend === 'increasing' ? 'growing' : 'stable'
        },
        recommendations
      };
    } catch (error) {
      console.error('Error analyzing package health:', error);
      return {
        healthScore: 0,
        trends: { downloads: 'stable', issues: 'stable', community: 'stable' },
        recommendations: ['Unable to analyze package health due to API errors.']
      };
    }
  }

  /**
   * Set up monitoring alerts (webhook integration)
   */
  async setupMonitoring(packageName: string, config: {
    webhookUrl?: string;
    emailAlerts?: string[];
    thresholds: {
      downloadDropPercentage: number;
      criticalIssueAlert: boolean;
      weeklyReport: boolean;
    };
  }): Promise<{ success: boolean; monitoringId: string }> {
    try {
      // In a real implementation, this would set up monitoring infrastructure
      // For now, we'll simulate the setup
      
      console.log(`Setting up monitoring for ${packageName}:`, config);
      
      // Store monitoring configuration (would use a database in production)
      const monitoringId = `monitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Set up periodic checks (would use a job queue in production)
      this.scheduleMonitoringChecks(packageName, config, monitoringId);
      
      return {
        success: true,
        monitoringId
      };
    } catch (error) {
      console.error('Error setting up monitoring:', error);
      return {
        success: false,
        monitoringId: ''
      };
    }
  }

  /**
   * Schedule periodic monitoring checks
   */
  private scheduleMonitoringChecks(packageName: string, config: any, monitoringId: string): void {
    // In production, this would use a proper job scheduler
    console.log(`Scheduled monitoring checks for ${packageName} (ID: ${monitoringId})`);
    
    // Example: Check downloads every hour
    setInterval(async () => {
      try {
        const stats = await this.getDownloadStats(packageName);
        const history = await this.getDownloadHistory(packageName, 'last-week');
        
        // Check for download drops
        if (history.length >= 2) {
          const latest = history[history.length - 1].downloads;
          const previous = history[history.length - 2].downloads;
          const dropPercentage = ((previous - latest) / previous) * 100;
          
          if (dropPercentage > config.thresholds.downloadDropPercentage) {
            this.sendAlert(packageName, 'download_drop', {
              dropPercentage,
              latest,
              previous
            }, config);
          }
        }
      } catch (error) {
        console.error('Error in monitoring check:', error);
      }
    }, 60 * 60 * 1000); // Check every hour
  }

  /**
   * Send monitoring alerts
   */
  private async sendAlert(packageName: string, alertType: string, data: any, config: any): Promise<void> {
    try {
      const alertMessage = {
        package: packageName,
        type: alertType,
        timestamp: new Date().toISOString(),
        data
      };

      // Send webhook if configured
      if (config.webhookUrl) {
        await fetch(config.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(alertMessage)
        });
      }

      // Send email alerts if configured
      if (config.emailAlerts && config.emailAlerts.length > 0) {
        // In production, integrate with email service (SendGrid, AWS SES, etc.)
        console.log('Email alert would be sent to:', config.emailAlerts);
      }

      console.log('Alert sent:', alertMessage);
    } catch (error) {
      console.error('Error sending alert:', error);
    }
  }

  /**
   * Generate analytics report
   */
  async generateReport(packageName: string, period: 'week' | 'month' | 'quarter' = 'month'): Promise<{
    summary: {
      totalDownloads: number;
      averageDaily: number;
      peakDay: { date: string; downloads: number };
      growth: number;
    };
    insights: string[];
    recommendations: string[];
  }> {
    try {
      const periodMap = {
        week: 'last-week',
        month: 'last-month',
        quarter: 'last-quarter'
      };

      const history = await this.getDownloadHistory(packageName, periodMap[period]);
      const packageInfo = await this.getPackageInfo(packageName);

      if (history.length === 0) {
        throw new Error('No download history available');
      }

      const totalDownloads = history.reduce((sum, d) => sum + d.downloads, 0);
      const averageDaily = totalDownloads / history.length;
      const peakDay = history.reduce((max, d) => d.downloads > max.downloads ? d : max);

      // Calculate growth (compare first and last week)
      const firstWeek = history.slice(0, 7);
      const lastWeek = history.slice(-7);
      const firstWeekAvg = firstWeek.reduce((sum, d) => sum + d.downloads, 0) / firstWeek.length;
      const lastWeekAvg = lastWeek.reduce((sum, d) => sum + d.downloads, 0) / lastWeek.length;
      const growth = ((lastWeekAvg - firstWeekAvg) / firstWeekAvg) * 100;

      // Generate insights
      const insights: string[] = [];
      const recommendations: string[] = [];

      if (growth > 20) {
        insights.push(`Strong growth of ${growth.toFixed(1)}% in download trends`);
        recommendations.push('Consider increasing marketing efforts to capitalize on growth');
      } else if (growth < -10) {
        insights.push(`Download decline of ${Math.abs(growth).toFixed(1)}% detected`);
        recommendations.push('Investigate potential issues and consider feature updates');
      }

      if (averageDaily > 1000) {
        insights.push('High adoption rate indicates strong community interest');
      }

      const dependencyCount = Object.keys(packageInfo.dependencies).length;
      if (dependencyCount > 5) {
        recommendations.push('Consider reducing dependencies to improve reliability');
      }

      return {
        summary: {
          totalDownloads,
          averageDaily: Math.round(averageDaily),
          peakDay: {
            date: peakDay.day,
            downloads: peakDay.downloads
          },
          growth: Math.round(growth * 10) / 10
        },
        insights,
        recommendations
      };
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }
}

export const npmAnalyticsService = NPMAnalyticsService.getInstance();