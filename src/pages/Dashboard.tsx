import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Bot,
  Key,
  BarChart3,
  Eye,
  Settings,
  Zap,
  Globe,
  Database,
  Brain,
  Lock,
  FileText,
  ArrowUp,
  ArrowDown,
  Minus,
  ExternalLink,
  Filter,
  Calendar,
  Download,
  PieChart,
  TrendingDown,
  X,
  Server,
  Wifi,
  HardDrive,
  Cpu,
  Info
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { RiskScoreChart } from '../components/charts/RiskScoreChart';
import { useDashboardData } from '../hooks/useDashboardData';
import { useAuth } from '../hooks/useAuth';
import { botService } from '../services/botService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart, RadialBarChart, RadialBar, Cell } from 'recharts';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  href: string;
  badge?: string;
}

interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: string;
  responseTime: number;
  services: {
    aiDetection: 'operational' | 'degraded' | 'down';
    database: 'operational' | 'degraded' | 'down';
    api: 'operational' | 'degraded' | 'down';
    blockchain: 'operational' | 'degraded' | 'down';
  };
}

interface IncidentDetailModalProps {
  incident: any;
  onClose: () => void;
}

interface SystemStatusModalProps {
  systemHealth: SystemHealth;
  onClose: () => void;
}

function SystemStatusModal({ systemHealth, onClose }: SystemStatusModalProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  
  // Generate mock system metrics based on time range
  const generateMetrics = (hours: number) => {
    const data = [];
    for (let i = hours - 1; i >= 0; i--) {
      const time = new Date();
      time.setHours(time.getHours() - i);
      
      data.push({
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        cpu: Math.random() * 30 + 20, // 20-50%
        memory: Math.random() * 40 + 30, // 30-70%
        responseTime: Math.random() * 50 + 30, // 30-80ms
        requests: Math.floor(Math.random() * 1000) + 500 // 500-1500 req/min
      });
    }
    return data;
  };

  const [systemMetrics, setSystemMetrics] = useState(() => generateMetrics(24));

  useEffect(() => {
    const hours = selectedTimeRange === '1h' ? 1 : selectedTimeRange === '6h' ? 6 : 24;
    setSystemMetrics(generateMetrics(hours));
  }, [selectedTimeRange]);

  const getServiceStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-600 bg-green-100';
      case 'degraded': return 'text-yellow-600 bg-yellow-100';
      case 'down': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'aiDetection': return Brain;
      case 'database': return Database;
      case 'api': return Server;
      case 'blockchain': return Globe;
      default: return Activity;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">System Status Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Overall Status */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-green-900">All Systems Operational</h3>
                    <p className="text-green-700">All services are running normally</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-700">Uptime: {systemHealth.uptime}</p>
                  <p className="text-sm text-green-700">Response: {systemHealth.responseTime}ms</p>
                </div>
              </div>
            </div>

            {/* Service Status Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(systemHealth.services).map(([service, status]) => {
                const IconComponent = getServiceIcon(service);
                return (
                  <div key={service} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${getServiceStatusColor(status)}`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <Badge variant={status === 'operational' ? 'success' : status === 'degraded' ? 'warning' : 'error'}>
                        {status}
                      </Badge>
                    </div>
                    <h4 className="font-medium text-gray-900 capitalize">
                      {service.replace(/([A-Z])/g, ' $1').trim()}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {status === 'operational' ? 'Running smoothly' : 
                       status === 'degraded' ? 'Minor issues detected' : 
                       'Service unavailable'}
                    </p>
                    <div className="mt-2 text-xs text-gray-500">
                      Last check: {new Date().toLocaleTimeString()}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Performance Metrics */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
                <select
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                  className="text-sm border border-gray-300 rounded px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="1h">Last Hour</option>
                  <option value="6h">Last 6 Hours</option>
                  <option value="24h">Last 24 Hours</option>
                </select>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* CPU & Memory Usage */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">System Resources</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={systemMetrics}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="time" 
                          stroke="#6b7280"
                          fontSize={12}
                        />
                        <YAxis 
                          stroke="#6b7280"
                          fontSize={12}
                          label={{ value: 'Usage (%)', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip 
                          formatter={(value: any, name: string) => [`${value.toFixed(1)}%`, name === 'cpu' ? 'CPU' : 'Memory']}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="cpu" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          name="CPU Usage"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="memory" 
                          stroke="#10b981" 
                          strokeWidth={2}
                          name="Memory Usage"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Response Time & Requests */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">API Performance</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={systemMetrics}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="time" 
                          stroke="#6b7280"
                          fontSize={12}
                        />
                        <YAxis 
                          yAxisId="left"
                          stroke="#6b7280"
                          fontSize={12}
                          label={{ value: 'Response (ms)', angle: -90, position: 'insideLeft' }}
                        />
                        <YAxis 
                          yAxisId="right"
                          orientation="right"
                          stroke="#6b7280"
                          fontSize={12}
                          label={{ value: 'Requests/min', angle: 90, position: 'insideRight' }}
                        />
                        <Tooltip 
                          formatter={(value: any, name: string) => [
                            name === 'responseTime' ? `${value.toFixed(1)}ms` : `${Math.floor(value)} req/min`,
                            name === 'responseTime' ? 'Response Time' : 'Requests'
                          ]}
                        />
                        <Legend />
                        <Line 
                          yAxisId="left"
                          type="monotone" 
                          dataKey="responseTime" 
                          stroke="#f59e0b" 
                          strokeWidth={2}
                          name="Response Time"
                        />
                        <Line 
                          yAxisId="right"
                          type="monotone" 
                          dataKey="requests" 
                          stroke="#8b5cf6" 
                          strokeWidth={2}
                          name="Requests/min"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* System Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Server className="h-6 w-6 text-blue-600" />
                  <h4 className="font-medium text-blue-900">Infrastructure</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Region:</span>
                    <span className="font-medium text-blue-900">US-East-1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Load Balancers:</span>
                    <span className="font-medium text-blue-900">3 Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Auto Scaling:</span>
                    <span className="font-medium text-blue-900">Enabled</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Database className="h-6 w-6 text-green-600" />
                  <h4 className="font-medium text-green-900">Database</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-700">Connections:</span>
                    <span className="font-medium text-green-900">45/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Query Time:</span>
                    <span className="font-medium text-green-900">12ms avg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Replication:</span>
                    <span className="font-medium text-green-900">Healthy</span>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Brain className="h-6 w-6 text-purple-600" />
                  <h4 className="font-medium text-purple-900">AI Services</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-purple-700">Claude API:</span>
                    <span className="font-medium text-purple-900">Online</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-700">BERT Models:</span>
                    <span className="font-medium text-purple-900">3 Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-700">Detection Rate:</span>
                    <span className="font-medium text-purple-900">94.2%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Events */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent System Events</h3>
              <div className="space-y-3">
                {[
                  { time: '2 minutes ago', event: 'Auto-scaling triggered: Added 2 new instances', type: 'info' },
                  { time: '15 minutes ago', event: 'Database backup completed successfully', type: 'success' },
                  { time: '1 hour ago', event: 'AI model cache refreshed', type: 'info' },
                  { time: '3 hours ago', event: 'Security scan completed - No issues found', type: 'success' },
                  { time: '6 hours ago', event: 'Scheduled maintenance completed', type: 'info' }
                ].map((event, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`h-2 w-2 rounded-full ${
                      event.type === 'success' ? 'bg-green-500' : 
                      event.type === 'warning' ? 'bg-yellow-500' : 
                      event.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{event.event}</p>
                      <p className="text-xs text-gray-500">{event.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function IncidentDetailModal({ incident, onClose }: IncidentDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Incident Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Incident Overview */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{incident.type}</h3>
                <div className="flex items-center space-x-2">
                  <Badge variant={
                    incident.severity === 'critical' ? 'error' : 
                    incident.severity === 'high' ? 'warning' : 
                    incident.severity === 'medium' ? 'info' : 'neutral'
                  }>
                    {incident.severity}
                  </Badge>
                  <Badge variant={incident.status === 'blocked' ? 'error' : 'warning'}>
                    {incident.status}
                  </Badge>
                </div>
              </div>
              <p className="text-gray-700 mb-4">{incident.message}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Bot:</span>
                  <span className="ml-2 text-gray-900">{incident.botName || 'Unknown'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Time:</span>
                  <span className="ml-2 text-gray-900">{incident.time}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Confidence:</span>
                  <span className="ml-2 text-gray-900">{incident.confidence || 'N/A'}%</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">ID:</span>
                  <span className="ml-2 text-gray-900">{incident.id}</span>
                </div>
              </div>
            </div>

            {/* Risk Analysis */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Risk Analysis</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Toxicity', 'Bias', 'Hallucination', 'PII'].map((risk, index) => {
                  const score = Math.floor(Math.random() * 100);
                  return (
                    <div key={risk} className="bg-gray-50 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-gray-900">{score}%</div>
                      <div className="text-sm text-gray-600">{risk}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions Taken */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Actions Taken</h4>
              <div className={`p-3 rounded-lg ${incident.status === 'blocked' ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                <p className="text-sm">
                  Content was {incident.status} due to {incident.type.toLowerCase()} detection.
                  {incident.status === 'blocked' ? ' User was shown a safe alternative response.' : ' Content was flagged for review.'}
                </p>
              </div>
            </div>

            {/* Recommended Actions */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Recommended Actions</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-700">Review and update content filtering rules</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-700">Monitor similar patterns in future interactions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-700">Consider adjusting detection thresholds</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced Incident Chart with Radial Progress
function EnhancedIncidentChart() {
  const { data, loading, error } = useDashboardData();
  
  // Generate weekly incident data with more detail
  const weeklyData = [
    { day: 'Mon', blocked: 23, flagged: 45, resolved: 67, total: 135 },
    { day: 'Tue', blocked: 31, flagged: 52, resolved: 78, total: 161 },
    { day: 'Wed', blocked: 18, flagged: 38, resolved: 54, total: 110 },
    { day: 'Thu', blocked: 27, flagged: 41, resolved: 63, total: 131 },
    { day: 'Fri', blocked: 35, flagged: 58, resolved: 89, total: 182 },
    { day: 'Sat', blocked: 12, flagged: 25, resolved: 34, total: 71 },
    { day: 'Sun', blocked: 8, flagged: 19, resolved: 26, total: 53 }
  ];

  // Summary data for radial chart
  const summaryData = [
    { name: 'Resolved', value: 411, fill: '#10b981' },
    { name: 'Flagged', value: 278, fill: '#f59e0b' },
    { name: 'Blocked', value: 154, fill: '#ef4444' }
  ];

  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">Failed to load incident data</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-80">
      {/* Line Chart */}
      <div className="h-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={weeklyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis 
              dataKey="day" 
              stroke="#6b7280"
              fontSize={12}
              tick={{ fill: '#6b7280' }}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tick={{ fill: '#6b7280' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="resolved" 
              stroke="#10b981" 
              strokeWidth={3}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              name="Resolved"
            />
            <Line 
              type="monotone" 
              dataKey="flagged" 
              stroke="#f59e0b" 
              strokeWidth={3}
              dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
              name="Flagged"
            />
            <Line 
              type="monotone" 
              dataKey="blocked" 
              stroke="#ef4444" 
              strokeWidth={3}
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
              name="Blocked"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Radial Summary */}
      <div className="h-full flex flex-col justify-center">
        <ResponsiveContainer width="100%" height="70%">
          <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="80%" data={summaryData}>
            <RadialBar dataKey="value" cornerRadius={10} fill="#8884d8" />
            <Tooltip formatter={(value: any) => [value, 'Incidents']} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="flex justify-center space-x-6 mt-4">
          {summaryData.map((item, index) => (
            <div key={index} className="text-center">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-sm font-medium text-gray-700">{item.name}</span>
              </div>
              <div className="text-lg font-bold text-gray-900">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Dashboard() {
  const { profile } = useAuth();
  const { 
    metrics, 
    recentIncidents, 
    loading, 
    error, 
    lastUpdated, 
    refetch 
  } = useDashboardData();

  const [timeRange, setTimeRange] = useState('24h');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [showSystemModal, setShowSystemModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    status: 'healthy',
    uptime: '99.9%',
    responseTime: 45,
    services: {
      aiDetection: 'operational',
      database: 'operational',
      api: 'operational',
      blockchain: 'operational'
    }
  });

  // Enhanced metrics with additional data
  const [enhancedMetrics, setEnhancedMetrics] = useState({
    activeBots: 0,
    totalApiKeys: 0,
    complianceRules: 0,
    avgResponseTime: 0,
    successRate: 0,
    dataProcessed: '0 GB'
  });

  useEffect(() => {
    loadEnhancedData();
    
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(() => {
        handleRefresh();
        loadEnhancedData();
      }, 30000); // Refresh every 30 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, refetch]);

  const loadEnhancedData = () => {
    // Get data from bot service
    const botMetrics = botService.getAggregatedMetrics();
    
    setEnhancedMetrics({
      activeBots: botMetrics.activeBots,
      totalApiKeys: 3, // From settings/API keys
      complianceRules: 12, // From AI governance
      avgResponseTime: 45 + Math.floor(Math.random() * 20), // 45-65ms
      successRate: 99.2 + Math.random() * 0.7, // 99.2-99.9%
      dataProcessed: `${(Math.random() * 5 + 2).toFixed(1)} GB` // 2-7 GB
    });

    // Simulate system health updates
    setSystemHealth(prev => ({
      ...prev,
      responseTime: 35 + Math.floor(Math.random() * 30),
      services: {
        aiDetection: Math.random() > 0.1 ? 'operational' : 'degraded',
        database: Math.random() > 0.05 ? 'operational' : 'degraded',
        api: Math.random() > 0.02 ? 'operational' : 'degraded',
        blockchain: Math.random() > 0.08 ? 'operational' : 'degraded'
      }
    }));
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await Promise.all([
        refetch.metrics(),
        refetch.incidents()
      ]);
      loadEnhancedData();
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleExport = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      metrics: metrics,
      enhancedMetrics: enhancedMetrics,
      systemHealth: systemHealth,
      recentIncidents: recentIncidents?.slice(0, 10),
      timeRange: timeRange
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dashboard-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleViewAllIncidents = () => {
    window.location.href = '/ai-governance';
  };

  const handleIncidentDetails = (incident: any) => {
    setSelectedIncident(incident);
    setShowIncidentModal(true);
  };

  const handleSystemStatusDetails = () => {
    setShowSystemModal(true);
  };

  const handleAutoRefreshToggle = (checked: boolean) => {
    setAutoRefresh(checked);
    if (checked) {
      // Immediately refresh when enabling auto-refresh
      handleRefresh();
    }
  };

  const getStatIcon = (index: number) => {
    const icons = [Activity, XCircle, CheckCircle, Shield, Bot, Key, BarChart3, Zap];
    return icons[index] || Activity;
  };

  const getStatColor = (index: number) => {
    const colors = [
      'text-blue-600', 'text-red-600', 'text-green-600', 'text-purple-600',
      'text-orange-600', 'text-indigo-600', 'text-pink-600', 'text-yellow-600'
    ];
    return colors[index] || 'text-blue-600';
  };

  const getChangeIcon = (change: string) => {
    if (change.startsWith('+')) return ArrowUp;
    if (change.startsWith('-')) return ArrowDown;
    return Minus;
  };

  const getChangeColor = (change: string, index: number) => {
    const isPositive = change.startsWith('+');
    const isNegative = change.startsWith('-');
    
    // For blocked requests, positive change is bad (red), negative is good (green)
    if (index === 1) {
      return isPositive ? 'text-red-600' : isNegative ? 'text-green-600' : 'text-gray-600';
    }
    
    // For other metrics, positive change is generally good
    return isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-600';
  };

  const quickActions: QuickAction[] = [
    {
      id: 'bot-management',
      title: 'Manage Bots',
      description: 'Register new AI bots and configure rules',
      icon: Bot,
      color: 'bg-blue-100 text-blue-600',
      href: '/bot-management',
      badge: `${enhancedMetrics.activeBots} active`
    },
    {
      id: 'ai-governance',
      title: 'AI Governance',
      description: 'Configure compliance rules and policies',
      icon: Brain,
      color: 'bg-purple-100 text-purple-600',
      href: '/ai-governance',
      badge: `${enhancedMetrics.complianceRules} rules`
    },
    {
      id: 'sdk-integration',
      title: 'SDK Integration',
      description: 'Get API keys and integration guides',
      icon: Key,
      color: 'bg-green-100 text-green-600',
      href: '/sdk',
      badge: `${enhancedMetrics.totalApiKeys} keys`
    },
    {
      id: 'audit-trail',
      title: 'Audit Trail',
      description: 'View blockchain compliance records',
      icon: Database,
      color: 'bg-orange-100 text-orange-600',
      href: '/audit-trail'
    }
  ];

  if (loading && !metrics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
          <p className="text-sm text-gray-500 mt-2">Fetching real-time metrics from AI systems...</p>
        </div>
      </div>
    );
  }

  if (error && !metrics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-2">Failed to load dashboard</p>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={handleRefresh} icon={RefreshCw} loading={refreshing}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const stats = metrics ? [
    {
      name: 'Total Requests',
      value: metrics.totalRequests.toLocaleString(),
      change: metrics.requestsChange,
      description: 'AI requests processed',
    },
    {
      name: 'Blocked Requests',
      value: metrics.blockedRequests.toLocaleString(),
      change: metrics.blockedChange,
      description: 'Harmful content blocked',
    },
    {
      name: 'Compliance Score',
      value: `${metrics.complianceScore}%`,
      change: metrics.complianceChange,
      description: 'Overall compliance rating',
    },
    {
      name: 'Active Rules',
      value: metrics.activeRules.toString(),
      change: metrics.rulesChange,
      description: 'Governance rules enabled',
    },
    {
      name: 'Active Bots',
      value: enhancedMetrics.activeBots.toString(),
      change: '+2',
      description: 'Connected AI systems',
    },
    {
      name: 'API Keys',
      value: enhancedMetrics.totalApiKeys.toString(),
      change: '+1',
      description: 'SDK integrations',
    },
    {
      name: 'Response Time',
      value: `${enhancedMetrics.avgResponseTime}ms`,
      change: '-5ms',
      description: 'Average detection latency',
    },
    {
      name: 'Success Rate',
      value: `${enhancedMetrics.successRate.toFixed(1)}%`,
      change: '+0.2%',
      description: 'System reliability',
    },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your AI governance systems today
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {lastUpdated && (
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <label className="flex items-center space-x-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => handleAutoRefreshToggle(e.target.checked)}
                className="rounded"
              />
              <span>Auto-refresh</span>
            </label>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            icon={RefreshCw}
            loading={refreshing}
            disabled={loading}
          >
            {refreshing ? 'Updating...' : 'Refresh'}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            icon={Download}
            onClick={handleExport}
          >
            Export
          </Button>
        </div>
      </div>

      {/* System Health Status */}
      <Card className="border-l-4 border-l-green-500">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">System Status: All Systems Operational</h3>
              <p className="text-sm text-gray-600">
                Uptime: {systemHealth.uptime} • Response Time: {systemHealth.responseTime}ms • Data Processed: {enhancedMetrics.dataProcessed}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {Object.entries(systemHealth.services).map(([service, status]) => (
                <div key={service} className="flex items-center space-x-1">
                  <div className={`h-2 w-2 rounded-full ${
                    status === 'operational' ? 'bg-green-500' : 
                    status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <span className="text-xs text-gray-500 capitalize">{service}</span>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              icon={Eye}
              onClick={handleSystemStatusDetails}
            >
              Details
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = getStatIcon(index);
          const ChangeIcon = getChangeIcon(stat.change);
          return (
            <Card key={stat.name} className="relative overflow-hidden hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between p-6">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                </div>
                <div className={`h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center`}>
                  <IconComponent className={`h-6 w-6 ${getStatColor(index)}`} />
                </div>
              </div>
              <div className="px-6 pb-4 flex items-center">
                <ChangeIcon className={`h-3 w-3 mr-1 ${getChangeColor(stat.change, index)}`} />
                <span className={`text-sm font-medium ${getChangeColor(stat.change, index)}`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-2">from last week</span>
              </div>
              {loading && (
                <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <p className="text-sm text-gray-600">Common tasks and navigation shortcuts</p>
        </CardHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <a
              key={action.id}
              href={action.href}
              className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-start space-x-3">
                <div className={`h-10 w-10 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {action.title}
                    </h4>
                    <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                  {action.badge && (
                    <Badge variant="neutral" size="sm" className="mt-2">
                      {action.badge}
                    </Badge>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Risk Scores Over Time</CardTitle>
                <p className="text-sm text-gray-600">Real-time bias, toxicity, and hallucination trends</p>
              </div>
              <div className="flex items-center space-x-2">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="1h">Last Hour</option>
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <RiskScoreChart />
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Weekly Incident Analysis</CardTitle>
                <p className="text-sm text-gray-600">Comprehensive incident tracking with resolution status</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                icon={BarChart3}
                onClick={handleViewAllIncidents}
              >
                View Details
              </Button>
            </div>
          </CardHeader>
          <EnhancedIncidentChart />
        </Card>
      </div>

      {/* Recent Incidents */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent AI Governance Incidents</CardTitle>
              <p className="text-sm text-gray-600 mt-1">Latest violations and actions taken across all connected systems</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="info" size="sm">
                Live Feed
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                icon={Eye}
                onClick={handleViewAllIncidents}
              >
                View All
              </Button>
            </div>
          </div>
        </CardHeader>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {recentIncidents && recentIncidents.length > 0 ? (
            recentIncidents.slice(0, 8).map((incident) => (
              <div key={incident.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex-shrink-0">
                    <AlertTriangle className={`h-5 w-5 ${
                      incident.severity === 'critical' ? 'text-red-500' :
                      incident.severity === 'high' ? 'text-orange-500' : 
                      incident.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                    }`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{incident.type}</p>
                      {incident.botName && (
                        <Badge variant="neutral" size="sm">
                          {incident.botName}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">{incident.message}</p>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                      {incident.confidence && (
                        <span>Confidence: {incident.confidence}%</span>
                      )}
                      <span>{incident.time}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 flex-shrink-0">
                  <Badge variant={
                    incident.severity === 'critical' ? 'error' : 
                    incident.severity === 'high' ? 'warning' : 
                    incident.severity === 'medium' ? 'info' : 'neutral'
                  } size="sm">
                    {incident.severity}
                  </Badge>
                  <Badge variant={incident.status === 'blocked' ? 'error' : 'warning'} size="sm">
                    {incident.status}
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    icon={Eye}
                    onClick={() => handleIncidentDetails(incident)}
                  >
                    Details
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <AlertTriangle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No recent incidents</p>
              <p className="text-sm text-gray-400">Your AI systems are running smoothly</p>
            </div>
          )}
          
          {loading && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-sm text-gray-500">Loading latest incidents...</span>
            </div>
          )}
        </div>
      </Card>

      {/* Role-based Insights */}
      {profile?.role && (
        <Card>
          <CardHeader>
            <CardTitle>
              {profile.role === 'developer' && 'Developer Insights'}
              {profile.role === 'compliance_officer' && 'Compliance Overview'}
              {profile.role === 'auditor' && 'Audit Summary'}
              {profile.role === 'executive' && 'Executive Summary'}
            </CardTitle>
            <p className="text-sm text-gray-600">
              Personalized insights based on your role and responsibilities
            </p>
          </CardHeader>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {profile.role === 'developer' && (
              <>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{enhancedMetrics.avgResponseTime}ms</div>
                  <div className="text-sm text-gray-600">Avg API Response</div>
                  <div className="text-xs text-green-600 mt-1">-12% this week</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{enhancedMetrics.successRate.toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                  <div className="text-xs text-green-600 mt-1">+0.3% this week</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{enhancedMetrics.totalApiKeys}</div>
                  <div className="text-sm text-gray-600">Active API Keys</div>
                  <div className="text-xs text-blue-600 mt-1">1 new this week</div>
                </div>
              </>
            )}
            
            {profile.role === 'compliance_officer' && (
              <>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{metrics?.complianceScore}%</div>
                  <div className="text-sm text-gray-600">Compliance Score</div>
                  <div className="text-xs text-green-600 mt-1">+2.1% this month</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{enhancedMetrics.complianceRules}</div>
                  <div className="text-sm text-gray-600">Active Rules</div>
                  <div className="text-xs text-blue-600 mt-1">2 updated</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{metrics?.blockedRequests.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Violations Blocked</div>
                  <div className="text-xs text-green-600 mt-1">-5% this week</div>
                </div>
              </>
            )}
            
            {(profile.role === 'auditor' || profile.role === 'executive') && (
              <>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{metrics?.totalRequests.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Requests</div>
                  <div className="text-xs text-green-600 mt-1">+15% this month</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">100%</div>
                  <div className="text-sm text-gray-600">Audit Coverage</div>
                  <div className="text-xs text-green-600 mt-1">All systems monitored</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{enhancedMetrics.dataProcessed}</div>
                  <div className="text-sm text-gray-600">Data Processed</div>
                  <div className="text-xs text-blue-600 mt-1">This month</div>
                </div>
              </>
            )}
          </div>
        </Card>
      )}

      {/* System Status Modal */}
      {showSystemModal && (
        <SystemStatusModal
          systemHealth={systemHealth}
          onClose={() => setShowSystemModal(false)}
        />
      )}

      {/* Incident Detail Modal */}
      {showIncidentModal && selectedIncident && (
        <IncidentDetailModal
          incident={selectedIncident}
          onClose={() => {
            setShowIncidentModal(false);
            setSelectedIncident(null);
          }}
        />
      )}
    </div>
  );
}