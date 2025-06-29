import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  Activity,
  CheckCircle,
  XCircle,
  Settings,
  Play,
  Pause,
  BarChart3,
  FileText,
  Zap,
  Bot,
  Users,
  Monitor,
  Download,
  Sliders,
  Eye,
  Info,
  Upload,
  Trash2,
  Calendar,
  Database,
  Scale,
  Bell,
  UserCheck,
  Lock,
  AlertCircle,
  Clock,
  MapPin,
  Building,
  Globe,
  Award,
  BookOpen,
  Gavel
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { botService } from '../services/botService';
import { dashboardAPI } from '../services/api';

const aiModules = [
  {
    id: 'firewall',
    name: 'AI Firewall',
    description: 'Blocks toxic and hallucinated AI outputs using advanced NLP',
    status: 'active',
    icon: Shield,
    color: 'bg-red-100 text-red-600',
  },
  {
    id: 'bias-detection',
    name: 'Bias Detection',
    description: 'Real-time detection of gender, racial, and other biases',
    status: 'active',
    icon: Brain,
    color: 'bg-orange-100 text-orange-600',
  },
  {
    id: 'compliance-reports',
    name: 'Compliance Reports',
    description: 'Generates SOC 2/GDPR-ready compliance documentation',
    status: 'active',
    icon: FileText,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    id: 'consent-verification',
    name: 'Consent Verification',
    description: 'Detects whether user consent has been captured before data processing',
    status: 'active',
    icon: UserCheck,
    color: 'bg-green-100 text-green-600',
  },
  {
    id: 'prompt-injection-firewall',
    name: 'Prompt Injection Firewall',
    description: 'Blocks malicious prompt injections and jailbreak attempts',
    status: 'active',
    icon: Lock,
    color: 'bg-purple-100 text-purple-600',
  },
];

// Enhanced incident data with detailed explanations
const getDetailedIncidentExplanation = (type: string, severity: string) => {
  const explanations = {
    'Toxic Content': {
      reason: 'Content contains harmful, offensive, or inappropriate language that violates community guidelines.',
      detection: 'Detected using BERT toxicity classification model with 91.8% accuracy.',
      examples: [
        'Hate speech targeting individuals or groups',
        'Threatening or violent language',
        'Harassment or bullying content',
        'Discriminatory language'
      ],
      action: 'Content was automatically blocked to prevent harm to users.',
      prevention: 'Consider rephrasing your request using respectful and constructive language.',
      legalImplications: 'May violate hate speech laws and platform liability regulations.',
      regulatoryArticles: ['GDPR Article 5 (lawfulness)', 'DSA Article 14 (illegal content)', 'EU AI Act Article 9 (prohibited practices)'],
      complianceStandards: ['GDPR', 'DSA', 'EU AI Act']
    },
    'Bias Detection': {
      reason: 'AI response shows unfair bias based on gender, race, age, or other protected characteristics.',
      detection: 'Analyzed using Claude 3 Sonnet with 94.2% accuracy for bias identification.',
      examples: [
        'Gender bias in job recommendations',
        'Racial stereotyping in descriptions',
        'Age discrimination in advice',
        'Cultural bias in suggestions'
      ],
      action: 'Response was flagged and alternative suggestions were provided.',
      prevention: 'Ensure prompts are inclusive and avoid assumptions about demographics.',
      legalImplications: 'Potential discrimination liability under employment and civil rights laws.',
      regulatoryArticles: ['EU AI Act Article 5 (prohibited AI practices)', 'GDPR Article 22 (automated decision-making)', 'Equal Employment Opportunity laws'],
      complianceStandards: ['EU AI Act', 'GDPR', 'SOC 2']
    },
    'PII Exposure': {
      reason: 'Content contains or risks exposing personally identifiable information (PII).',
      detection: 'Identified using pattern matching and NER models with 96.5% accuracy.',
      examples: [
        'Email addresses or phone numbers',
        'Social security numbers',
        'Credit card information',
        'Home addresses or personal details'
      ],
      action: 'Content was blocked to protect privacy and comply with data protection regulations.',
      prevention: 'Avoid including personal information in prompts or responses.',
      legalImplications: 'Severe penalties under data protection laws, potential class action lawsuits.',
      regulatoryArticles: ['GDPR Article 5 (data minimization)', 'GDPR Article 32 (security)', 'HIPAA Section 164.502', 'CCPA Section 1798.100'],
      complianceStandards: ['GDPR', 'HIPAA', 'CCPA', 'SOC 2']
    },
    'Medical Advice': {
      reason: 'Content provides medical advice without proper disclaimers or qualifications.',
      detection: 'Flagged by custom medical advice detection rules.',
      examples: [
        'Specific treatment recommendations',
        'Diagnosis suggestions',
        'Medication advice',
        'Health condition assessments'
      ],
      action: 'Content was flagged to prevent unauthorized medical guidance.',
      prevention: 'Include appropriate disclaimers and suggest consulting healthcare professionals.',
      legalImplications: 'Potential medical malpractice liability and regulatory violations.',
      regulatoryArticles: ['FDA Section 201(h)', 'Medical Practice Acts', 'HIPAA Section 164.502'],
      complianceStandards: ['HIPAA', 'SOC 2']
    },
    'Profanity Filter': {
      reason: 'Content contains explicit language or profanity.',
      detection: 'Detected using keyword filtering and context analysis.',
      examples: [
        'Strong profanity or vulgar language',
        'Sexually explicit content',
        'Inappropriate slang or terms'
      ],
      action: 'Content was filtered to maintain appropriate communication standards.',
      prevention: 'Use professional and appropriate language in all interactions.',
      legalImplications: 'May violate workplace harassment policies and platform terms.',
      regulatoryArticles: ['Platform Terms of Service', 'Workplace Harassment Laws'],
      complianceStandards: ['SOC 2']
    },
    'Consent Verification Failure': {
      reason: 'User consent was not properly captured before processing personal data.',
      detection: 'Consent verification module detected missing or invalid consent.',
      examples: [
        'Processing data without explicit consent',
        'Expired consent tokens',
        'Missing consent for sensitive data categories',
        'Invalid consent for minors'
      ],
      action: 'Data processing was halted until proper consent is obtained.',
      prevention: 'Ensure valid consent is captured before any data processing.',
      legalImplications: 'Severe GDPR fines up to 4% of annual revenue, regulatory investigations.',
      regulatoryArticles: ['GDPR Article 6 (lawfulness)', 'GDPR Article 7 (consent)', 'CCPA Section 1798.120', 'COPPA Section 312.5'],
      complianceStandards: ['GDPR', 'CCPA', 'COPPA', 'HIPAA']
    },
    'Prompt Injection Attack': {
      reason: 'Malicious attempt to override system instructions or jailbreak the AI.',
      detection: 'Prompt Injection Firewall detected suspicious instruction patterns.',
      examples: [
        'Attempts to ignore system prompts',
        'Jailbreak instructions',
        'Role-playing to bypass restrictions',
        'Malicious code injection attempts'
      ],
      action: 'Request was blocked and security team was notified.',
      prevention: 'Use proper input validation and sanitization.',
      legalImplications: 'Potential cybersecurity violations and system compromise liability.',
      regulatoryArticles: ['Computer Fraud and Abuse Act', 'EU Cybersecurity Act', 'GDPR Article 32 (security)'],
      complianceStandards: ['SOC 2', 'GDPR']
    }
  };

  return explanations[type as keyof typeof explanations] || {
    reason: 'Content violated one or more governance rules.',
    detection: 'Detected using AI governance monitoring systems.',
    examples: ['Various policy violations'],
    action: 'Content was reviewed and appropriate action was taken.',
    prevention: 'Follow platform guidelines and best practices.',
    legalImplications: 'Potential compliance and liability issues.',
    regulatoryArticles: ['General compliance requirements'],
    complianceStandards: ['SOC 2']
  };
};

// Mock uploaded datasets - in production this would come from a service
interface UploadedDataset {
  id: string;
  fileName: string;
  uploadTime: string;
  totalRecords: number;
  processedRecords: number;
  status: 'processing' | 'completed' | 'failed';
  violations: number;
  blockedContent: number;
  avgRiskScore: number;
  source: 'batch-upload';
}

// Compliance standards mapping
const getComplianceStandards = (rules: string[]) => {
  const standards = new Set<string>();
  
  rules.forEach(rule => {
    if (rule.includes('PII') || rule.includes('Privacy')) {
      standards.add('GDPR');
      standards.add('CCPA');
    }
    if (rule.includes('Medical') || rule.includes('Health')) {
      standards.add('HIPAA');
    }
    if (rule.includes('Bias') || rule.includes('Discrimination')) {
      standards.add('EU AI Act');
    }
    if (rule.includes('Toxicity') || rule.includes('Content')) {
      standards.add('DSA');
    }
    // All bots should have SOC 2 compliance
    standards.add('SOC 2');
  });
  
  return Array.from(standards);
};

const getComplianceColor = (standard: string) => {
  const colors = {
    'GDPR': 'bg-blue-100 text-blue-800',
    'HIPAA': 'bg-green-100 text-green-800',
    'CCPA': 'bg-purple-100 text-purple-800',
    'EU AI Act': 'bg-orange-100 text-orange-800',
    'DSA': 'bg-red-100 text-red-800',
    'SOC 2': 'bg-gray-100 text-gray-800',
    'COPPA': 'bg-pink-100 text-pink-800'
  };
  return colors[standard as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

// Alert system configuration
interface AlertRule {
  id: string;
  name: string;
  description: string;
  condition: string;
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  recipients: string[];
  isActive: boolean;
  lastTriggered?: string;
  triggerCount: number;
}

const defaultAlertRules: AlertRule[] = [
  {
    id: 'pii-exposure-alert',
    name: 'PII Exposure Alert',
    description: 'Triggers when PII exposure incidents exceed threshold',
    condition: 'PII flags > 5 per hour',
    threshold: 5,
    severity: 'critical',
    recipients: ['compliance@company.com', 'legal@company.com'],
    isActive: true,
    lastTriggered: '2 hours ago',
    triggerCount: 3
  },
  {
    id: 'hallucination-accuracy',
    name: 'Hallucination Accuracy Drop',
    description: 'Alerts when hallucination detection accuracy drops below threshold',
    condition: 'Accuracy < 80%',
    threshold: 80,
    severity: 'high',
    recipients: ['ai-team@company.com', 'compliance@company.com'],
    isActive: true,
    lastTriggered: '6 hours ago',
    triggerCount: 1
  },
  {
    id: 'consent-verification-failure',
    name: 'Consent Verification Failures',
    description: 'Triggers when consent verification fails repeatedly',
    condition: 'Consent failures > 3 per 15 minutes',
    threshold: 3,
    severity: 'critical',
    recipients: ['privacy@company.com', 'legal@company.com'],
    isActive: true,
    lastTriggered: '1 day ago',
    triggerCount: 2
  },
  {
    id: 'prompt-injection-attempts',
    name: 'Prompt Injection Attempts',
    description: 'Alerts on detected prompt injection or jailbreak attempts',
    condition: 'Injection attempts > 1 per 5 minutes',
    threshold: 1,
    severity: 'high',
    recipients: ['security@company.com', 'ai-team@company.com'],
    isActive: true,
    lastTriggered: '30 minutes ago',
    triggerCount: 7
  }
];

export function AIGovernance() {
  const [selectedModule, setSelectedModule] = useState('firewall');
  const [botMetrics, setBotMetrics] = useState(botService.getAggregatedMetrics());
  const [recentDetections, setRecentDetections] = useState<any[]>([]);
  const [connectedBots, setConnectedBots] = useState(botService.getActiveBots());
  const [uploadedDatasets, setUploadedDatasets] = useState<UploadedDataset[]>([
    {
      id: 'dataset_001',
      fileName: 'customer_support_logs.csv',
      uploadTime: '2024-01-15T14:30:00Z',
      totalRecords: 1250,
      processedRecords: 1250,
      status: 'completed',
      violations: 89,
      blockedContent: 34,
      avgRiskScore: 23,
      source: 'batch-upload'
    },
    {
      id: 'dataset_002',
      fileName: 'chatbot_responses.json',
      uploadTime: '2024-01-15T10:15:00Z',
      totalRecords: 856,
      processedRecords: 856,
      status: 'completed',
      violations: 156,
      blockedContent: 67,
      avgRiskScore: 31,
      source: 'batch-upload'
    }
  ]);
  const [loading, setLoading] = useState(true);
  const [moduleStates, setModuleStates] = useState<Record<string, 'active' | 'inactive'>>({
    firewall: 'active',
    'bias-detection': 'active',
    'compliance-reports': 'active',
    'consent-verification': 'active',
    'prompt-injection-firewall': 'active'
  });

  // Modal states
  const [showConfigureModal, setShowConfigureModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [showMonitorModal, setShowMonitorModal] = useState(false);
  const [showDetectionsModal, setShowDetectionsModal] = useState(false);
  const [showIncidentDetailModal, setShowIncidentDetailModal] = useState(false);
  const [showLawyerModal, setShowLawyerModal] = useState(false);
  const [showAlertsModal, setShowAlertsModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [alertRules, setAlertRules] = useState<AlertRule[]>(defaultAlertRules);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Get real-time data from connected bots
        const incidents = await dashboardAPI.getRecentIncidents();
        
        // Add incidents from uploaded datasets
        const datasetIncidents = uploadedDatasets.flatMap(dataset => 
          generateIncidentsFromDataset(dataset)
        );
        
        // Add new incident types for enhanced features
        const enhancedIncidents = [
          ...incidents,
          ...datasetIncidents,
          // Add consent verification incidents
          {
            id: 'consent_001',
            type: 'Consent Verification Failure',
            message: 'User consent not captured before processing health data',
            severity: 'critical',
            time: '15 minutes ago',
            status: 'blocked',
            confidence: 95.2,
            source: 'consent-module',
            botName: 'Health Assistant Bot'
          },
          // Add prompt injection incidents
          {
            id: 'injection_001',
            type: 'Prompt Injection Attack',
            message: 'Malicious attempt to override system instructions detected',
            severity: 'high',
            time: '30 minutes ago',
            status: 'blocked',
            confidence: 88.7,
            source: 'pif-module',
            botName: 'Customer Support Bot'
          }
        ];
        
        // Combine and sort by severity and time
        const allIncidents = enhancedIncidents.sort((a, b) => {
          const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          return severityOrder[b.severity as keyof typeof severityOrder] - severityOrder[a.severity as keyof typeof severityOrder];
        });
        
        setRecentDetections(allIncidents.slice(0, 8)); // Show latest 8
        
        // Update bot metrics
        setBotMetrics(botService.getAggregatedMetrics());
        setConnectedBots(botService.getActiveBots());
      } catch (error) {
        console.error('Error loading AI governance data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Subscribe to real-time updates
    const unsubscribe = botService.subscribeToUpdates((bots) => {
      setBotMetrics(botService.getAggregatedMetrics());
      setConnectedBots(botService.getActiveBots());
    });

    const incidentUnsubscribe = dashboardAPI.subscribeToIncidents((incidents) => {
      // Combine with dataset incidents
      const datasetIncidents = uploadedDatasets.flatMap(dataset => 
        generateIncidentsFromDataset(dataset)
      );
      const allIncidents = [...incidents, ...datasetIncidents].sort((a, b) => {
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return severityOrder[b.severity as keyof typeof severityOrder] - severityOrder[a.severity as keyof typeof severityOrder];
      });
      setRecentDetections(allIncidents.slice(0, 8));
    });

    return () => {
      unsubscribe();
      incidentUnsubscribe();
    };
  }, [uploadedDatasets]);

  // Generate incidents from uploaded datasets
  const generateIncidentsFromDataset = (dataset: UploadedDataset) => {
    if (dataset.status !== 'completed') return [];
    
    const incidentTypes = [
      { type: 'Bias Detection', severity: 'high' },
      { type: 'Toxic Content', severity: 'critical' },
      { type: 'PII Exposure', severity: 'high' },
      { type: 'Profanity Filter', severity: 'medium' }
    ];
    
    const incidents = [];
    const incidentCount = Math.min(3, Math.floor(dataset.violations * 0.1));
    
    for (let i = 0; i < incidentCount; i++) {
      const incident = incidentTypes[Math.floor(Math.random() * incidentTypes.length)];
      const hoursAgo = Math.floor((Date.now() - new Date(dataset.uploadTime).getTime()) / (1000 * 60 * 60));
      
      incidents.push({
        id: `${dataset.id}_incident_${i}`,
        type: incident.type,
        message: `${incident.type} detected in uploaded dataset: ${dataset.fileName}`,
        severity: incident.severity,
        time: hoursAgo < 24 ? `${hoursAgo} hours ago` : new Date(dataset.uploadTime).toLocaleDateString(),
        status: incident.severity === 'critical' ? 'blocked' : 'flagged',
        confidence: Math.round((80 + Math.random() * 15) * 10) / 10,
        source: 'batch-upload',
        datasetId: dataset.id,
        datasetName: dataset.fileName
      });
    }
    
    return incidents;
  };

  const toggleModule = (moduleId: string) => {
    setModuleStates(prev => ({
      ...prev,
      [moduleId]: prev[moduleId] === 'active' ? 'inactive' : 'active'
    }));
    
    // Show feedback
    const module = aiModules.find(m => m.id === moduleId);
    const newStatus = moduleStates[moduleId] === 'active' ? 'inactive' : 'active';
    console.log(`${module?.name} ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
  };

  const handleConfigure = () => {
    setShowConfigureModal(true);
  };

  const handleViewAnalytics = () => {
    setShowAnalyticsModal(true);
  };

  const handleOpenMonitor = () => {
    setShowMonitorModal(true);
  };

  const handleViewAllDetections = () => {
    setShowDetectionsModal(true);
  };

  const handleIncidentClick = (incident: any) => {
    setSelectedIncident(incident);
    setShowIncidentDetailModal(true);
  };

  const handleDeleteDataset = (datasetId: string) => {
    setUploadedDatasets(prev => prev.filter(d => d.id !== datasetId));
  };

  const handleGenerateReport = () => {
    // Generate and download compliance report including both bot and dataset data
    const reportData = {
      timestamp: new Date().toISOString(),
      realTimeData: {
        totalRequests: botMetrics.totalRequests,
        totalBlocked: botMetrics.totalBlocked,
        complianceScore: botMetrics.avgCompliance,
        activeBots: botMetrics.activeBots,
      },
      uploadedDatasets: uploadedDatasets.map(dataset => ({
        fileName: dataset.fileName,
        totalRecords: dataset.totalRecords,
        violations: dataset.violations,
        blockedContent: dataset.blockedContent,
        avgRiskScore: dataset.avgRiskScore,
        uploadTime: dataset.uploadTime
      })),
      modules: aiModules.map(module => ({
        name: module.name,
        status: moduleStates[module.id],
        ...getModuleMetrics(module.id)
      })),
      recentDetections: recentDetections.slice(0, 10)
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ai-governance-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'neutral';
      default: return 'neutral';
    }
  };

  // Calculate module metrics from connected bots and datasets
  const getModuleMetrics = (moduleId: string) => {
    const activeBots = connectedBots;
    let blocked = 0;
    let flagged = 0;
    let accuracy = 0;

    // Add bot metrics
    activeBots.forEach(bot => {
      if (moduleId === 'firewall' && bot.rules.some(rule => rule.includes('Toxicity') || rule.includes('Hate'))) {
        blocked += Math.floor(bot.blockedCount * 0.4);
        flagged += Math.floor(bot.blockedCount * 0.2);
      } else if (moduleId === 'bias-detection' && bot.rules.some(rule => rule.includes('Bias'))) {
        blocked += Math.floor(bot.blockedCount * 0.3);
        flagged += Math.floor(bot.blockedCount * 0.15);
      } else if (moduleId === 'consent-verification') {
        blocked += Math.floor(bot.blockedCount * 0.1);
        flagged += Math.floor(bot.blockedCount * 0.05);
      } else if (moduleId === 'prompt-injection-firewall') {
        blocked += Math.floor(bot.blockedCount * 0.05);
        flagged += Math.floor(bot.blockedCount * 0.02);
      }
      accuracy += bot.complianceScore;
    });

    // Add dataset metrics
    uploadedDatasets.forEach(dataset => {
      if (dataset.status === 'completed') {
        blocked += Math.floor(dataset.blockedContent * 0.6);
        flagged += Math.floor(dataset.violations * 0.4);
        accuracy += (100 - dataset.avgRiskScore); // Convert risk to compliance score
      }
    });

    const totalSources = activeBots.length + uploadedDatasets.filter(d => d.status === 'completed').length;
    
    return {
      blocked,
      flagged,
      accuracy: totalSources > 0 ? Math.round(accuracy / totalSources * 10) / 10 : 100
    };
  };

  // Calculate combined performance metrics
  const combinedMetrics = [
    { 
      label: 'Total Requests Processed', 
      value: (botMetrics.totalRequests + uploadedDatasets.reduce((sum, d) => sum + d.totalRecords, 0)).toLocaleString(), 
      change: '+12%', 
      positive: true,
      icon: Activity
    },
    { 
      label: 'Threats Blocked', 
      value: (botMetrics.totalBlocked + uploadedDatasets.reduce((sum, d) => sum + d.blockedContent, 0)).toLocaleString(), 
      change: '+8%', 
      positive: true,
      icon: Shield
    },
    { 
      label: 'Active Sources', 
      value: (botMetrics.activeBots + uploadedDatasets.filter(d => d.status === 'completed').length).toString(), 
      change: `+${uploadedDatasets.length}`, 
      positive: true,
      icon: Database
    },
    { 
      label: 'Avg Compliance Score', 
      value: `${Math.round((botMetrics.avgCompliance + uploadedDatasets.reduce((sum, d) => sum + (100 - d.avgRiskScore), 0) / Math.max(uploadedDatasets.length, 1)) / 2)}%`, 
      change: '+1.2%', 
      positive: true,
      icon: CheckCircle
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading AI governance data from connected sources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Governance Module</h1>
          <p className="text-gray-600 mt-1">
            Monitor and control AI outputs from {botMetrics.activeBots} connected bot{botMetrics.activeBots !== 1 ? 's' : ''} and {uploadedDatasets.length} uploaded dataset{uploadedDatasets.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" icon={Scale} onClick={() => setShowLawyerModal(true)}>
            Lawyer View
          </Button>
          <Button variant="outline" icon={Bell} onClick={() => setShowAlertsModal(true)}>
            Alerts
          </Button>
          <Button variant="outline" icon={Settings} onClick={handleConfigure}>
            Configure
          </Button>
          <Button icon={BarChart3} onClick={handleViewAnalytics}>
            View Analytics
          </Button>
        </div>
      </div>

      {/* Connected Bots Status with Compliance Standards */}
      {connectedBots.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bot className="h-5 w-5 mr-2 text-blue-600" />
              Connected Bots Status
            </CardTitle>
            <p className="text-sm text-gray-600">Real-time status of your integrated AI bots with compliance standards</p>
          </CardHeader>
          <div className="space-y-4">
            {connectedBots.map((bot) => {
              const complianceStandards = getComplianceStandards(bot.rules);
              return (
                <div key={bot.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Bot className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{bot.name}</p>
                      <p className="text-sm text-gray-500">{bot.lastActivity}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {complianceStandards.map((standard) => (
                          <span
                            key={standard}
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getComplianceColor(standard)}`}
                          >
                            {standard}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="success" size="sm">Active</Badge>
                    <p className="text-xs text-gray-500 mt-1">{bot.complianceScore}% compliance</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Uploaded Output Status - Fixed to Single Column */}
      {uploadedDatasets.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2 text-purple-600" />
                  Uploaded Output Analysis
                </CardTitle>
                <p className="text-sm text-gray-600">Batch analysis results from uploaded datasets</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => window.location.href = '/batch-analysis'}>
                <Upload className="h-4 w-4 mr-2" />
                Upload New Dataset
              </Button>
            </div>
          </CardHeader>
          {/* Changed to single column layout */}
          <div className="space-y-4">
            {uploadedDatasets.map((dataset) => (
              <div key={dataset.id} className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-100">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Database className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{dataset.fileName}</p>
                    <p className="text-sm text-gray-500">
                      {dataset.totalRecords.toLocaleString()} records • {new Date(dataset.uploadTime).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 flex-shrink-0">
                  <div className="text-right">
                    <Badge variant={dataset.status === 'completed' ? 'success' : dataset.status === 'processing' ? 'info' : 'error'} size="sm">
                      {dataset.status}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      {dataset.violations} violations • {dataset.avgRiskScore}% avg risk
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteDataset(dataset.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete dataset"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Combined Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {combinedMetrics.map((metric, index) => (
          <Card key={index}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
              </div>
              <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <metric.icon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className={`text-sm font-medium ${
                metric.positive ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.change}
              </span>
              <span className="text-sm text-gray-500 ml-2">from last week</span>
            </div>
          </Card>
        ))}
      </div>

      {/* AI Modules with Combined Data */}
      <Card>
        <CardHeader>
          <CardTitle>AI Protection Modules</CardTitle>
          <p className="text-sm text-gray-600">Manage and monitor your AI governance components with live data from all sources</p>
        </CardHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {aiModules.map((module) => {
            const moduleMetrics = getModuleMetrics(module.id);
            const currentStatus = moduleStates[module.id];
            return (
              <div key={module.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`h-12 w-12 ${module.color} rounded-lg flex items-center justify-center`}>
                    <module.icon className="h-6 w-6" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={currentStatus === 'active' ? 'success' : 'neutral'}>
                      {currentStatus}
                    </Badge>
                    <button
                      onClick={() => toggleModule(module.id)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title={`${currentStatus === 'active' ? 'Pause' : 'Resume'} ${module.name}`}
                    >
                      {currentStatus === 'active' ? (
                        <Pause className="h-4 w-4 text-gray-600" />
                      ) : (
                        <Play className="h-4 w-4 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{module.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{module.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Blocked:</span>
                    <span className="font-medium text-red-600">{moduleMetrics.blocked.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Flagged:</span>
                    <span className="font-medium text-orange-600">{moduleMetrics.flagged.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Accuracy:</span>
                    <span className="font-medium text-green-600">{moduleMetrics.accuracy}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Recent Detections from All Sources */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent AI Detections from All Sources</CardTitle>
            <button 
              onClick={handleViewAllDetections}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              View All Detections
            </button>
          </div>
        </CardHeader>
        <div className="space-y-4">
          {recentDetections.length > 0 ? (
            recentDetections.map((detection) => (
              <div 
                key={detection.id} 
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                onClick={() => handleIncidentClick(detection)}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <AlertTriangle className={`h-5 w-5 ${
                      detection.severity === 'critical' ? 'text-red-500' :
                      detection.severity === 'high' ? 'text-orange-500' : 'text-yellow-500'
                    }`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{detection.type}</p>
                    <p className="text-sm text-gray-600">{detection.message}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      {detection.botName && (
                        <Badge variant="info" size="sm">Bot: {detection.botName}</Badge>
                      )}
                      {detection.datasetName && (
                        <Badge variant="neutral" size="sm">Dataset: {detection.datasetName}</Badge>
                      )}
                      {detection.source === 'consent-module' && (
                        <Badge variant="warning" size="sm">Consent Module</Badge>
                      )}
                      {detection.source === 'pif-module' && (
                        <Badge variant="error" size="sm">PIF Module</Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    {detection.confidence && (
                      <p className="text-sm font-medium text-gray-900">{detection.confidence}% confidence</p>
                    )}
                    <p className="text-xs text-gray-500">{detection.time}</p>
                  </div>
                  <Badge variant={getSeverityColor(detection.severity) as any}>
                    {detection.severity}
                  </Badge>
                  <Badge variant={detection.status === 'blocked' ? 'error' : 'warning'}>
                    {detection.status}
                  </Badge>
                  <Eye className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Bot className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No recent detections</p>
              <p className="text-sm text-gray-400">
                {connectedBots.length === 0 && uploadedDatasets.length === 0
                  ? 'Connect bots or upload datasets to start monitoring AI governance'
                  : 'Your AI systems are running smoothly'
                }
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="text-center p-6">
          <Activity className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Monitor</h3>
          <p className="text-gray-600 mb-4">View live AI processing and detection activity</p>
          <Button variant="outline" className="w-full" onClick={handleOpenMonitor}>
            Open Monitor
          </Button>
        </Card>
        
        <Card className="text-center p-6">
          <FileText className="h-12 w-12 text-purple-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Export Reports</h3>
          <p className="text-gray-600 mb-4">Generate compliance reports for audits</p>
          <Button variant="outline" className="w-full" onClick={handleGenerateReport}>
            Generate Report
          </Button>
        </Card>
      </div>

      {/* Integration Status */}
      {connectedBots.length === 0 && uploadedDatasets.length === 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <div className="flex items-center space-x-4 p-6">
            <AlertTriangle className="h-8 w-8 text-orange-600" />
            <div>
              <h3 className="text-lg font-semibold text-orange-900">No Data Sources Connected</h3>
              <p className="text-orange-700 mb-4">
                Connect your AI bots or upload datasets to start monitoring governance and compliance in real-time.
              </p>
              <div className="flex space-x-3">
                <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                  Go to Bot Management
                </Button>
                <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                  Upload Dataset
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Lawyer Assistant Modal */}
      {showLawyerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Scale className="h-6 w-6 mr-2 text-purple-600" />
                Lawyer Assistant Dashboard
              </h2>
              <button
                onClick={() => setShowLawyerModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Critical Legal Risks */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-red-900 mb-3 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Critical Legal Risks Requiring Immediate Attention
                </h3>
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded border-l-4 border-red-500">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">PII Exposure in Health Data Processing</p>
                        <p className="text-sm text-gray-600">Potential HIPAA violation with severe penalties</p>
                        <p className="text-xs text-red-600 mt-1">Regulatory Articles: HIPAA §164.502, GDPR Art. 5</p>
                      </div>
                      <Badge variant="error">Critical</Badge>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      <p>Potential Liability: Up to $1.5M in HIPAA fines + civil lawsuits</p>
                      <p>Recommended Action: Immediate data processing halt, legal review required</p>
                    </div>
                  </div>
                  
                  <div className="bg-white p-3 rounded border-l-4 border-orange-500">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">Bias in Employment AI Recommendations</p>
                        <p className="text-sm text-gray-600">Potential discrimination liability under employment law</p>
                        <p className="text-xs text-orange-600 mt-1">Regulatory Articles: EU AI Act Art. 5, Equal Employment Opportunity laws</p>
                      </div>
                      <Badge variant="warning">High</Badge>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      <p>Potential Liability: Class action lawsuits, regulatory investigations</p>
                      <p>Recommended Action: Audit AI training data, implement bias testing</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Disclosure Requirements */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-yellow-900 mb-3 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Required Legal Disclosures
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-white rounded">
                    <span className="text-sm">Data breach notification (72-hour requirement)</span>
                    <Badge variant="warning">Pending</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white rounded">
                    <span className="text-sm">AI system transparency report (EU AI Act)</span>
                    <Badge variant="info">Due in 30 days</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white rounded">
                    <span className="text-sm">Algorithmic impact assessment</span>
                    <Badge variant="success">Completed</Badge>
                  </div>
                </div>
              </div>

              {/* Compliance Status by Jurisdiction */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-3">EU Compliance Status</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">GDPR</span>
                      <Badge variant="success">Compliant</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">EU AI Act</span>
                      <Badge variant="warning">Partial</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">DSA</span>
                      <Badge variant="success">Compliant</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-3">US Compliance Status</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">CCPA</span>
                      <Badge variant="success">Compliant</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">HIPAA</span>
                      <Badge variant="error">Non-Compliant</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">SOC 2</span>
                      <Badge variant="success">Compliant</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowLawyerModal(false)}>
                Close
              </Button>
              <Button>
                Generate Legal Report
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Alerts Modal - Removed Configure New Alert Section */}
      {showAlertsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Bell className="h-6 w-6 mr-2 text-orange-600" />
                Alert Management & Escalation Policies
              </h2>
              <button
                onClick={() => setShowAlertsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Active Alert Rules */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Alert Rules</h3>
                <div className="space-y-3">
                  {alertRules.map((rule) => (
                    <div key={rule.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-medium text-gray-900">{rule.name}</h4>
                          <Badge variant={rule.isActive ? 'success' : 'neutral'}>
                            {rule.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          <Badge variant={getSeverityColor(rule.severity) as any}>
                            {rule.severity}
                          </Badge>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <p>Triggered {rule.triggerCount} times</p>
                          {rule.lastTriggered && <p>Last: {rule.lastTriggered}</p>}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{rule.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Condition: {rule.condition}</span>
                        <span>Recipients: {rule.recipients.join(', ')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Alert Activity */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Alert Activity</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded">
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium">PII Exposure Alert triggered</span>
                    </div>
                    <span className="text-xs text-gray-500">2 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-medium">Prompt injection attempts detected</span>
                    </div>
                    <span className="text-xs text-gray-500">30 minutes ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">Hallucination accuracy drop</span>
                    </div>
                    <span className="text-xs text-gray-500">6 hours ago</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setShowAlertsModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Incident Detail Modal */}
      {showIncidentDetailModal && selectedIncident && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Incident Details</h2>
              <button
                onClick={() => setShowIncidentDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            {(() => {
              const explanation = getDetailedIncidentExplanation(selectedIncident.type, selectedIncident.severity);
              return (
                <div className="space-y-6">
                  {/* Incident Overview */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{selectedIncident.type}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getSeverityColor(selectedIncident.severity) as any}>
                          {selectedIncident.severity}
                        </Badge>
                        <Badge variant={selectedIncident.status === 'blocked' ? 'error' : 'warning'}>
                          {selectedIncident.status}
                        </Badge>
                        {selectedIncident.source === 'batch-upload' && (
                          <Badge variant="neutral">Batch Upload</Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">{selectedIncident.message}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Time:</span>
                        <span className="ml-2 text-gray-900">{selectedIncident.time}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Confidence:</span>
                        <span className="ml-2 text-gray-900">{selectedIncident.confidence}%</span>
                      </div>
                      {selectedIncident.botName && (
                        <div>
                          <span className="font-medium text-gray-600">Source Bot:</span>
                          <span className="ml-2 text-blue-600">{selectedIncident.botName}</span>
                        </div>
                      )}
                      {selectedIncident.datasetName && (
                        <div>
                          <span className="font-medium text-gray-600">Source Dataset:</span>
                          <span className="ml-2 text-purple-600">{selectedIncident.datasetName}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Compliance Standards Affected */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Award className="h-5 w-5 text-blue-600 mr-2" />
                      Compliance Standards Affected
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {explanation.complianceStandards.map((standard) => (
                        <span
                          key={standard}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getComplianceColor(standard)}`}
                        >
                          {standard}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Regulatory Articles Violated */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Gavel className="h-5 w-5 text-red-600 mr-2" />
                      Regulatory Articles Violated
                    </h4>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <ul className="list-disc list-inside space-y-1">
                        {explanation.regulatoryArticles.map((article, index) => (
                          <li key={index} className="text-red-800 text-sm">{article}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Legal Implications */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Scale className="h-5 w-5 text-purple-600 mr-2" />
                      Legal Implications
                    </h4>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <p className="text-purple-800">{explanation.legalImplications}</p>
                    </div>
                  </div>

                  {/* Why It Was Blocked */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Info className="h-5 w-5 text-blue-600 mr-2" />
                      Why This Content Was {selectedIncident.status === 'blocked' ? 'Blocked' : 'Flagged'}
                    </h4>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-gray-700">{explanation.reason}</p>
                    </div>
                  </div>

                  {/* Detection Method */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Detection Method</h4>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-gray-700">{explanation.detection}</p>
                    </div>
                  </div>

                  {/* Common Examples */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Common Examples of This Violation</h4>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <ul className="list-disc list-inside space-y-1">
                        {explanation.examples.map((example, index) => (
                          <li key={index} className="text-gray-700">{example}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Action Taken */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Action Taken</h4>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-gray-700">{explanation.action}</p>
                    </div>
                  </div>

                  {/* Prevention Tips */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">How to Prevent This</h4>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <p className="text-gray-700">{explanation.prevention}</p>
                    </div>
                  </div>

                  {/* Technical Details */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Technical Details</h4>
                    <div className="bg-gray-100 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">Detection Model:</span>
                          <span className="ml-2 text-gray-900">
                            {selectedIncident.type === 'Toxic Content' ? 'BERT Toxicity Classifier' :
                             selectedIncident.type === 'Bias Detection' ? 'Claude 3 Sonnet' :
                             selectedIncident.type === 'PII Exposure' ? 'Pattern Matching + NER' :
                             selectedIncident.type === 'Consent Verification Failure' ? 'Consent Verification Module' :
                             selectedIncident.type === 'Prompt Injection Attack' ? 'Prompt Injection Firewall' :
                             'Custom Rule Engine'}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Processing Time:</span>
                          <span className="ml-2 text-gray-900">{Math.floor(Math.random() * 50) + 10}ms</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Rule ID:</span>
                          <span className="ml-2 text-gray-900">RULE_{Math.floor(Math.random() * 1000) + 100}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Request ID:</span>
                          <span className="ml-2 text-gray-900">req_{Date.now()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
            
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setShowIncidentDetailModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Configure Modal */}
      {showConfigureModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Configure AI Governance Rules</h2>
              <button
                onClick={() => setShowConfigureModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Rule Thresholds</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Toxicity Detection</p>
                      <p className="text-sm text-gray-600">Block content with toxicity score above threshold</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="range" min="0" max="100" defaultValue="80" className="w-20" />
                      <span className="text-sm font-medium">80%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Bias Detection</p>
                      <p className="text-sm text-gray-600">Flag content with bias indicators</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="range" min="0" max="100" defaultValue="70" className="w-20" />
                      <span className="text-sm font-medium">70%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">PII Protection</p>
                      <p className="text-sm text-gray-600">Block personal information exposure</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="range" min="0" max="100" defaultValue="90" className="w-20" />
                      <span className="text-sm font-medium">90%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Consent Verification</p>
                      <p className="text-sm text-gray-600">Require valid consent before data processing</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="range" min="0" max="100" defaultValue="95" className="w-20" />
                      <span className="text-sm font-medium">95%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Prompt Injection Detection</p>
                      <p className="text-sm text-gray-600">Block malicious prompt injection attempts</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="range" min="0" max="100" defaultValue="85" className="w-20" />
                      <span className="text-sm font-medium">85%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowConfigureModal(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowConfigureModal(false)}>
                  Save Configuration
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Modal */}
      {showAnalyticsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">AI Governance Analytics</h2>
              <button
                onClick={() => setShowAnalyticsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Detection Trends</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Toxicity:</span>
                    <span className="font-medium text-red-600">↑ 12%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bias:</span>
                    <span className="font-medium text-orange-600">↓ 5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">PII Exposure:</span>
                    <span className="font-medium text-blue-600">↑ 8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Consent Failures:</span>
                    <span className="font-medium text-purple-600">↓ 15%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Prompt Injections:</span>
                    <span className="font-medium text-red-600">↑ 23%</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Source Performance</h3>
                <div className="space-y-2">
                  {connectedBots.slice(0, 2).map(bot => (
                    <div key={bot.id} className="flex justify-between">
                      <span className="text-gray-600">{bot.name}:</span>
                      <span className="font-medium text-green-600">{bot.complianceScore}%</span>
                    </div>
                  ))}
                  {uploadedDatasets.slice(0, 2).map(dataset => (
                    <div key={dataset.id} className="flex justify-between">
                      <span className="text-gray-600">{dataset.fileName}:</span>
                      <span className="font-medium text-purple-600">{100 - dataset.avgRiskScore}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Compliance Standards</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">GDPR:</span>
                    <span className="font-medium text-green-600">98.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">HIPAA:</span>
                    <span className="font-medium text-red-600">87.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">EU AI Act:</span>
                    <span className="font-medium text-orange-600">92.1%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">SOC 2:</span>
                    <span className="font-medium text-green-600">96.8%</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Alert Statistics</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Alerts:</span>
                    <span className="font-medium text-blue-600">47</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Critical:</span>
                    <span className="font-medium text-red-600">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">High:</span>
                    <span className="font-medium text-orange-600">15</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Response Time:</span>
                    <span className="font-medium text-green-600">2.3 min</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setShowAnalyticsModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Monitor Modal */}
      {showMonitorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Real-time AI Monitor</h2>
              <button
                onClick={() => setShowMonitorModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium text-green-900">System Status: Active</span>
                </div>
                <span className="text-sm text-green-700">All modules operational</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {connectedBots.map(bot => (
                  <div key={bot.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{bot.name}</span>
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Requests: {bot.requestCount.toLocaleString()}</p>
                      <p>Blocked: {bot.blockedCount.toLocaleString()}</p>
                      <p>Last Activity: {bot.lastActivity}</p>
                    </div>
                  </div>
                ))}
                {uploadedDatasets.map(dataset => (
                  <div key={dataset.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{dataset.fileName}</span>
                      <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Records: {dataset.totalRecords.toLocaleString()}</p>
                      <p>Violations: {dataset.violations.toLocaleString()}</p>
                      <p>Uploaded: {new Date(dataset.uploadTime).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setShowMonitorModal(false)}>
                Close Monitor
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* All Detections Modal */}
      {showDetectionsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">All AI Detections</h2>
              <button
                onClick={() => setShowDetectionsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              {recentDetections.map((detection) => (
                <div 
                  key={detection.id} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleIncidentClick(detection)}
                >
                  <div className="flex items-center space-x-4">
                    <AlertTriangle className={`h-5 w-5 ${
                      detection.severity === 'critical' ? 'text-red-500' :
                      detection.severity === 'high' ? 'text-orange-500' : 'text-yellow-500'
                    }`} />
                    <div>
                      <p className="font-medium text-gray-900">{detection.type}</p>
                      <p className="text-sm text-gray-600">{detection.message}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        {detection.botName && (
                          <Badge variant="info" size="sm">Bot: {detection.botName}</Badge>
                        )}
                        {detection.datasetName && (
                          <Badge variant="neutral" size="sm">Dataset: {detection.datasetName}</Badge>
                        )}
                        {detection.source === 'consent-module' && (
                          <Badge variant="warning" size="sm">Consent Module</Badge>
                        )}
                        {detection.source === 'pif-module' && (
                          <Badge variant="error" size="sm">PIF Module</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant={getSeverityColor(detection.severity) as any}>
                      {detection.severity}
                    </Badge>
                    <Badge variant={detection.status === 'blocked' ? 'error' : 'warning'}>
                      {detection.status}
                    </Badge>
                    <span className="text-xs text-gray-500">{detection.time}</span>
                    <Eye className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setShowDetectionsModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}