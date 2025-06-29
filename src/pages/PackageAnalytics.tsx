import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Download, 
  Star, 
  GitBranch, 
  Users, 
  MessageSquare, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Globe, 
  Package, 
  BarChart3, 
  PieChart, 
  Activity, 
  RefreshCw,
  ExternalLink,
  Eye,
  Heart,
  Bug,
  Lightbulb,
  Calendar,
  Filter,
  Search,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart as RechartsPieChart, Cell, BarChart, Bar } from 'recharts';

interface PackageStats {
  downloads: {
    daily: number;
    weekly: number;
    monthly: number;
    total: number;
  };
  github: {
    stars: number;
    forks: number;
    watchers: number;
    issues: number;
    pullRequests: number;
  };
  npm: {
    version: string;
    lastPublished: string;
    dependencies: number;
    size: string;
  };
  usage: {
    activeInstallations: number;
    countries: number;
    topCountries: Array<{ name: string; downloads: number; percentage: number }>;
  };
}

interface Feedback {
  id: string;
  type: 'bug' | 'feature' | 'question' | 'praise';
  title: string;
  description: string;
  author: string;
  date: string;
  status: 'open' | 'closed' | 'in-progress';
  priority: 'low' | 'medium' | 'high' | 'critical';
  labels: string[];
  upvotes: number;
  comments: number;
}

interface DownloadData {
  date: string;
  downloads: number;
  version: string;
}

export function PackageAnalytics() {
  const [stats, setStats] = useState<PackageStats | null>(null);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [downloadHistory, setDownloadHistory] = useState<DownloadData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [feedbackFilter, setFeedbackFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    loadAnalyticsData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(loadAnalyticsData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Simulate API calls to NPM and GitHub
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock package statistics
      setStats({
        downloads: {
          daily: 1247 + Math.floor(Math.random() * 200),
          weekly: 8934 + Math.floor(Math.random() * 1000),
          monthly: 34567 + Math.floor(Math.random() * 5000),
          total: 156789 + Math.floor(Math.random() * 10000)
        },
        github: {
          stars: 2147 + Math.floor(Math.random() * 50),
          forks: 312 + Math.floor(Math.random() * 10),
          watchers: 89 + Math.floor(Math.random() * 5),
          issues: 8 + Math.floor(Math.random() * 3),
          pullRequests: 3 + Math.floor(Math.random() * 2)
        },
        npm: {
          version: '1.0.0',
          lastPublished: '3 days ago',
          dependencies: 2,
          size: '45.2 KB'
        },
        usage: {
          activeInstallations: 1234 + Math.floor(Math.random() * 100),
          countries: 67,
          topCountries: [
            { name: 'United States', downloads: 12456, percentage: 35.2 },
            { name: 'Germany', downloads: 8934, percentage: 25.3 },
            { name: 'United Kingdom', downloads: 5678, percentage: 16.1 },
            { name: 'Canada', downloads: 3456, percentage: 9.8 },
            { name: 'France', downloads: 2345, percentage: 6.6 },
            { name: 'Others', downloads: 2567, percentage: 7.0 }
          ]
        }
      });

      // Mock download history
      const history = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        history.push({
          date: date.toISOString().split('T')[0],
          downloads: Math.floor(Math.random() * 500) + 800,
          version: i < 5 ? '1.0.0' : '0.9.0'
        });
      }
      setDownloadHistory(history);

      // Mock feedback data
      setFeedback([
        {
          id: 'fb_001',
          type: 'feature',
          title: 'Add Python SDK support',
          description: 'Would love to see a Python version of this SDK for our ML pipelines',
          author: 'dev_user_123',
          date: '2024-01-12',
          status: 'in-progress',
          priority: 'high',
          labels: ['enhancement', 'python', 'sdk'],
          upvotes: 23,
          comments: 8
        },
        {
          id: 'fb_002',
          type: 'bug',
          title: 'Memory leak in long-running processes',
          description: 'Noticed memory usage increasing over time in production',
          author: 'backend_dev',
          date: '2024-01-11',
          status: 'open',
          priority: 'critical',
          labels: ['bug', 'memory', 'production'],
          upvotes: 15,
          comments: 12
        },
        {
          id: 'fb_003',
          type: 'praise',
          title: 'Excellent documentation and examples',
          description: 'The integration guides are fantastic, got up and running in minutes!',
          author: 'startup_cto',
          date: '2024-01-10',
          status: 'closed',
          priority: 'low',
          labels: ['documentation', 'positive'],
          upvotes: 31,
          comments: 5
        },
        {
          id: 'fb_004',
          type: 'question',
          title: 'How to configure custom thresholds?',
          description: 'Need help setting up custom bias detection thresholds for our use case',
          author: 'ml_engineer',
          date: '2024-01-09',
          status: 'closed',
          priority: 'medium',
          labels: ['question', 'configuration', 'bias'],
          upvotes: 7,
          comments: 3
        },
        {
          id: 'fb_005',
          type: 'feature',
          title: 'Webhook support for real-time notifications',
          description: 'Would be great to have webhooks for incident notifications',
          author: 'devops_lead',
          date: '2024-01-08',
          status: 'open',
          priority: 'medium',
          labels: ['enhancement', 'webhooks', 'notifications'],
          upvotes: 18,
          comments: 6
        }
      ]);

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadAnalyticsData();
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return ArrowUp;
    if (change < 0) return ArrowDown;
    return Minus;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getFeedbackIcon = (type: string) => {
    switch (type) {
      case 'bug': return Bug;
      case 'feature': return Lightbulb;
      case 'question': return MessageSquare;
      case 'praise': return Heart;
      default: return MessageSquare;
    }
  };

  const getFeedbackColor = (type: string) => {
    switch (type) {
      case 'bug': return 'error';
      case 'feature': return 'info';
      case 'question': return 'warning';
      case 'praise': return 'success';
      default: return 'neutral';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'neutral';
      default: return 'neutral';
    }
  };

  const filteredFeedback = feedback.filter(item => {
    const matchesFilter = feedbackFilter === 'all' || item.type === feedbackFilter;
    const matchesSearch = searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#6B7280'];

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading package analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Package Analytics & Monitoring</h1>
          <p className="text-gray-600 mt-1">
            Track downloads, user feedback, and package performance
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {lastUpdated && (
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            icon={RefreshCw}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <div className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Downloads</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.downloads.total.toLocaleString()}
                </p>
                <div className="flex items-center mt-2">
                  <ArrowUp className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+12.5%</span>
                  <span className="text-sm text-gray-500 ml-2">this month</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Download className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-gray-600">GitHub Stars</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.github.stars.toLocaleString()}
                </p>
                <div className="flex items-center mt-2">
                  <ArrowUp className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+45</span>
                  <span className="text-sm text-gray-500 ml-2">this week</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Installations</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.usage.activeInstallations.toLocaleString()}
                </p>
                <div className="flex items-center mt-2">
                  <ArrowUp className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+8.3%</span>
                  <span className="text-sm text-gray-500 ml-2">this month</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-gray-600">Open Issues</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.github.issues}
                </p>
                <div className="flex items-center mt-2">
                  <ArrowDown className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">-2</span>
                  <span className="text-sm text-gray-500 ml-2">this week</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Download Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Download Trends</CardTitle>
                <p className="text-sm text-gray-600">Daily downloads over the last 30 days</p>
              </div>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </div>
          </CardHeader>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={downloadHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: any) => [value.toLocaleString(), 'Downloads']}
                />
                <Area 
                  type="monotone" 
                  dataKey="downloads" 
                  stroke="#3B82F6" 
                  fill="#3B82F6"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Geographic Distribution</CardTitle>
            <p className="text-sm text-gray-600">Downloads by country</p>
          </CardHeader>
          <div className="space-y-4">
            {stats?.usage.topCountries.map((country, index) => (
              <div key={country.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-900">{country.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${country.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-16 text-right">
                    {country.downloads.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Package Information */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                NPM Package
              </CardTitle>
            </CardHeader>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Version:</span>
                <Badge variant="info">{stats.npm.version}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Size:</span>
                <span className="font-medium">{stats.npm.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Dependencies:</span>
                <span className="font-medium">{stats.npm.dependencies}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Published:</span>
                <span className="font-medium">{stats.npm.lastPublished}</span>
              </div>
              <Button variant="outline" size="sm" className="w-full" icon={ExternalLink}>
                View on NPM
              </Button>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <GitBranch className="h-5 w-5 mr-2" />
                GitHub Repository
              </CardTitle>
            </CardHeader>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Stars:</span>
                <span className="font-medium">{stats.github.stars.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Forks:</span>
                <span className="font-medium">{stats.github.forks}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Watchers:</span>
                <span className="font-medium">{stats.github.watchers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Open Issues:</span>
                <span className="font-medium">{stats.github.issues}</span>
              </div>
              <Button variant="outline" size="sm" className="w-full" icon={ExternalLink}>
                View on GitHub
              </Button>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Usage Statistics
              </CardTitle>
            </CardHeader>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Daily Downloads:</span>
                <span className="font-medium">{stats.downloads.daily.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Weekly Downloads:</span>
                <span className="font-medium">{stats.downloads.weekly.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Downloads:</span>
                <span className="font-medium">{stats.downloads.monthly.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Countries:</span>
                <span className="font-medium">{stats.usage.countries}</span>
              </div>
              <Button variant="outline" size="sm" className="w-full" icon={BarChart3}>
                Detailed Analytics
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* User Feedback */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Feedback & Issues</CardTitle>
              <p className="text-sm text-gray-600">Community feedback, bug reports, and feature requests</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="info">{filteredFeedback.length} items</Badge>
            </div>
          </div>
        </CardHeader>

        {/* Feedback Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search feedback..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={feedbackFilter}
            onChange={(e) => setFeedbackFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="bug">Bug Reports</option>
            <option value="feature">Feature Requests</option>
            <option value="question">Questions</option>
            <option value="praise">Praise</option>
          </select>
        </div>

        {/* Feedback List */}
        <div className="space-y-4">
          {filteredFeedback.map((item) => {
            const IconComponent = getFeedbackIcon(item.type);
            return (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                      item.type === 'bug' ? 'bg-red-100' :
                      item.type === 'feature' ? 'bg-blue-100' :
                      item.type === 'question' ? 'bg-yellow-100' : 'bg-green-100'
                    }`}>
                      <IconComponent className={`h-4 w-4 ${
                        item.type === 'bug' ? 'text-red-600' :
                        item.type === 'feature' ? 'text-blue-600' :
                        item.type === 'question' ? 'text-yellow-600' : 'text-green-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>by {item.author}</span>
                        <span>{item.date}</span>
                        <div className="flex items-center space-x-1">
                          <ArrowUp className="h-3 w-3" />
                          <span>{item.upvotes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="h-3 w-3" />
                          <span>{item.comments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <Badge variant={getFeedbackColor(item.type) as any} size="sm">
                      {item.type}
                    </Badge>
                    <Badge variant={getPriorityColor(item.priority) as any} size="sm">
                      {item.priority}
                    </Badge>
                    <Badge variant={item.status === 'open' ? 'warning' : item.status === 'closed' ? 'success' : 'info'} size="sm">
                      {item.status}
                    </Badge>
                  </div>
                </div>
                
                {item.labels.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.labels.map((label, index) => (
                      <Badge key={index} variant="neutral" size="sm">
                        {label}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredFeedback.length === 0 && (
          <div className="text-center py-8">
            <MessageSquare className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No feedback matches your filters</p>
          </div>
        )}
      </Card>

      {/* Monitoring Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Monitoring & Alerts</CardTitle>
          <p className="text-sm text-gray-600">Set up automated monitoring for your package</p>
        </CardHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Download Alerts</h4>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span className="text-sm">Alert when daily downloads drop by 20%</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span className="text-sm">Weekly download summary</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm">New country adoption notifications</span>
              </label>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Issue Alerts</h4>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span className="text-sm">New critical issues</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span className="text-sm">High-priority feature requests</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm">Weekly feedback summary</span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button>Save Alert Settings</Button>
        </div>
      </Card>
    </div>
  );
}