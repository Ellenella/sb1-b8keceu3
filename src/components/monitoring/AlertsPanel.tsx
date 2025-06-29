import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Settings, 
  Mail, 
  Webhook, 
  TrendingDown, 
  TrendingUp, 
  Bug, 
  Star,
  Download,
  Users,
  X,
  Plus
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface Alert {
  id: string;
  type: 'download_drop' | 'issue_spike' | 'new_feedback' | 'milestone' | 'security';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  read: boolean;
  data?: any;
}

interface AlertRule {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  threshold: number;
  channels: ('email' | 'webhook' | 'dashboard')[];
  description: string;
}

export function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [alertRules, setAlertRules] = useState<AlertRule[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [newRule, setNewRule] = useState({
    name: '',
    type: 'download_drop',
    threshold: 20,
    channels: ['dashboard'] as ('email' | 'webhook' | 'dashboard')[]
  });

  useEffect(() => {
    loadAlerts();
    loadAlertRules();
    
    // Simulate real-time alerts
    const interval = setInterval(checkForNewAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadAlerts = () => {
    // Mock alerts data
    const mockAlerts: Alert[] = [
      {
        id: 'alert_001',
        type: 'download_drop',
        title: 'Download Drop Alert',
        message: 'Daily downloads dropped by 25% compared to yesterday',
        severity: 'high',
        timestamp: '2024-01-15T10:30:00Z',
        read: false,
        data: { previousDownloads: 1200, currentDownloads: 900, dropPercentage: 25 }
      },
      {
        id: 'alert_002',
        type: 'new_feedback',
        title: 'Critical Bug Report',
        message: 'New critical issue reported: Memory leak in production',
        severity: 'critical',
        timestamp: '2024-01-15T09:15:00Z',
        read: false,
        data: { issueNumber: 42, author: 'backend_dev' }
      },
      {
        id: 'alert_003',
        type: 'milestone',
        title: 'Download Milestone',
        message: 'Package reached 100K total downloads!',
        severity: 'low',
        timestamp: '2024-01-14T16:45:00Z',
        read: true,
        data: { milestone: 100000 }
      },
      {
        id: 'alert_004',
        type: 'issue_spike',
        title: 'Issue Activity Spike',
        message: '5 new issues opened in the last hour',
        severity: 'medium',
        timestamp: '2024-01-14T14:20:00Z',
        read: true,
        data: { newIssues: 5, timeframe: '1 hour' }
      }
    ];
    
    setAlerts(mockAlerts);
  };

  const loadAlertRules = () => {
    const mockRules: AlertRule[] = [
      {
        id: 'rule_001',
        name: 'Download Drop Alert',
        type: 'download_drop',
        enabled: true,
        threshold: 20,
        channels: ['email', 'dashboard'],
        description: 'Alert when daily downloads drop by more than threshold percentage'
      },
      {
        id: 'rule_002',
        name: 'Critical Issues',
        type: 'critical_issue',
        enabled: true,
        threshold: 1,
        channels: ['email', 'webhook', 'dashboard'],
        description: 'Immediate alert for critical bug reports'
      },
      {
        id: 'rule_003',
        name: 'Weekly Summary',
        type: 'weekly_report',
        enabled: true,
        threshold: 0,
        channels: ['email'],
        description: 'Weekly analytics and feedback summary'
      },
      {
        id: 'rule_004',
        name: 'Star Milestones',
        type: 'star_milestone',
        enabled: false,
        threshold: 100,
        channels: ['dashboard'],
        description: 'Alert when reaching star count milestones'
      }
    ];
    
    setAlertRules(mockRules);
  };

  const checkForNewAlerts = () => {
    // Simulate new alerts occasionally
    if (Math.random() > 0.8) {
      const newAlert: Alert = {
        id: `alert_${Date.now()}`,
        type: 'new_feedback',
        title: 'New Feature Request',
        message: 'User requested Python SDK support',
        severity: 'medium',
        timestamp: new Date().toISOString(),
        read: false,
        data: { type: 'feature_request' }
      };
      
      setAlerts(prev => [newAlert, ...prev]);
    }
  };

  const markAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, read: true } : alert
    ));
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const toggleRule = (ruleId: string) => {
    setAlertRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const addNewRule = () => {
    if (!newRule.name.trim()) return;
    
    const rule: AlertRule = {
      id: `rule_${Date.now()}`,
      name: newRule.name,
      type: newRule.type,
      enabled: true,
      threshold: newRule.threshold,
      channels: newRule.channels,
      description: `Custom rule: ${newRule.name}`
    };
    
    setAlertRules(prev => [...prev, rule]);
    setNewRule({
      name: '',
      type: 'download_drop',
      threshold: 20,
      channels: ['dashboard']
    });
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'download_drop': return TrendingDown;
      case 'issue_spike': return Bug;
      case 'new_feedback': return Bell;
      case 'milestone': return Star;
      case 'security': return AlertTriangle;
      default: return Bell;
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'neutral';
      default: return 'neutral';
    }
  };

  const unreadCount = alerts.filter(alert => !alert.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Monitoring Alerts</h2>
          <p className="text-gray-600">Real-time notifications and monitoring rules</p>
        </div>
        <div className="flex items-center space-x-3">
          {unreadCount > 0 && (
            <Badge variant="error">{unreadCount} unread</Badge>
          )}
          <Button variant="outline" onClick={() => setShowSettings(!showSettings)} icon={Settings}>
            Alert Rules
          </Button>
        </div>
      </div>

      {/* Alert Rules Settings */}
      {showSettings && (
        <Card>
          <CardHeader>
            <CardTitle>Alert Rules Configuration</CardTitle>
            <p className="text-sm text-gray-600">Configure when and how you receive alerts</p>
          </CardHeader>
          
          <div className="space-y-4">
            {/* Existing Rules */}
            <div className="space-y-3">
              {alertRules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={rule.enabled}
                        onChange={() => toggleRule(rule.id)}
                        className="rounded"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">{rule.name}</h4>
                        <p className="text-sm text-gray-600">{rule.description}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500">Threshold: {rule.threshold}%</span>
                          <span className="text-xs text-gray-500">•</span>
                          <div className="flex space-x-1">
                            {rule.channels.map((channel) => (
                              <Badge key={channel} variant="neutral" size="sm">
                                {channel}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Badge variant={rule.enabled ? 'success' : 'neutral'}>
                    {rule.enabled ? 'Active' : 'Disabled'}
                  </Badge>
                </div>
              ))}
            </div>

            {/* Add New Rule */}
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-3">Add New Alert Rule</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="Rule name"
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <select
                  value={newRule.type}
                  onChange={(e) => setNewRule({ ...newRule, type: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="download_drop">Download Drop</option>
                  <option value="issue_spike">Issue Spike</option>
                  <option value="star_milestone">Star Milestone</option>
                  <option value="security">Security Alert</option>
                </select>
                <input
                  type="number"
                  placeholder="Threshold"
                  value={newRule.threshold}
                  onChange={(e) => setNewRule({ ...newRule, threshold: parseInt(e.target.value) })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Button onClick={addNewRule} icon={Plus} disabled={!newRule.name.trim()}>
                  Add Rule
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Active Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
          <p className="text-sm text-gray-600">Latest monitoring notifications</p>
        </CardHeader>
        
        <div className="space-y-3">
          {alerts.length > 0 ? (
            alerts.map((alert) => {
              const IconComponent = getAlertIcon(alert.type);
              return (
                <div 
                  key={alert.id} 
                  className={`p-4 border rounded-lg transition-colors ${
                    alert.read ? 'border-gray-200 bg-white' : 'border-blue-200 bg-blue-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${getAlertColor(alert.severity)}`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900">{alert.title}</h4>
                          <Badge variant={getSeverityBadge(alert.severity) as any} size="sm">
                            {alert.severity}
                          </Badge>
                          {!alert.read && (
                            <Badge variant="info" size="sm">New</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>{new Date(alert.timestamp).toLocaleString()}</span>
                          {alert.data && (
                            <span>
                              {alert.type === 'download_drop' && `${alert.data.dropPercentage}% drop`}
                              {alert.type === 'milestone' && `${alert.data.milestone.toLocaleString()} downloads`}
                              {alert.type === 'issue_spike' && `${alert.data.newIssues} new issues`}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!alert.read && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => markAsRead(alert.id)}
                          icon={CheckCircle}
                        >
                          Mark Read
                        </Button>
                      )}
                      <button
                        onClick={() => dismissAlert(alert.id)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No alerts at this time</p>
              <p className="text-sm text-gray-400">Your package monitoring is active</p>
            </div>
          )}
        </div>
      </Card>

      {/* Alert Channels */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Channels</CardTitle>
          <p className="text-sm text-gray-600">Configure how you receive notifications</p>
        </CardHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <Mail className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h4 className="font-medium text-gray-900 mb-2">Email Alerts</h4>
            <p className="text-sm text-gray-600 mb-3">Receive alerts via email</p>
            <Badge variant="success">Configured</Badge>
          </div>
          
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <Webhook className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <h4 className="font-medium text-gray-900 mb-2">Webhooks</h4>
            <p className="text-sm text-gray-600 mb-3">Send alerts to your systems</p>
            <Badge variant="neutral">Not Configured</Badge>
          </div>
          
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <Bell className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h4 className="font-medium text-gray-900 mb-2">Dashboard</h4>
            <p className="text-sm text-gray-600 mb-3">View alerts in dashboard</p>
            <Badge variant="success">Active</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}