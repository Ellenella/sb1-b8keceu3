import React, { useState } from 'react';
import { 
  Lock, 
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
  Globe,
  Download,
  Edit,
  Eye,
  Copy,
  Check,
  X,
  ExternalLink,
  Calendar,
  Building,
  Users,
  Database,
  Printer,
  Save,
  Upload,
  Hash,
  Link,
  Info
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

const privacyModules = [
  {
    id: 'policy-generator',
    name: 'Policy Generator',
    description: 'One-click GDPR/CCPA/COPPA-ready policy generator with auto-updates',
    status: 'active',
    policies: 12,
    updates: 34,
    accuracy: 99.1,
    icon: FileText,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    id: 'data-flow-monitor',
    name: 'Data Flow Monitor',
    description: 'Auto-enforcement blocks non-compliant data flows in real-time',
    status: 'active',
    blocked: 89,
    flagged: 156,
    accuracy: 96.8,
    icon: Activity,
    color: 'bg-green-100 text-green-600',
  },
  {
    id: 'nft-versioning',
    name: 'NFT Versioning',
    description: 'Mints every policy update on-chain for immutable legal proof',
    status: 'active',
    minted: 23,
    verified: 23,
    accuracy: 100.0,
    icon: Shield,
    color: 'bg-purple-100 text-purple-600',
  },
];

const recentPolicyUpdates = [
  {
    id: 1,
    type: 'GDPR Update',
    policy: 'Privacy Policy v2.3',
    change: 'Added new data retention clauses',
    severity: 'medium',
    timestamp: '2 hours ago',
    status: 'published',
    nftHash: 'ALGO_TX_2024_001',
    realTxId: 'DEMO_TX_001', // Demo transaction for testing
  },
  {
    id: 2,
    type: 'CCPA Compliance',
    policy: 'Terms of Service v1.8',
    change: 'Updated California consumer rights section',
    severity: 'high',
    timestamp: '6 hours ago',
    status: 'published',
    nftHash: 'ALGO_TX_2024_002',
    realTxId: 'DEMO_TX_002',
  },
  {
    id: 3,
    type: 'COPPA Update',
    policy: 'Children Privacy Policy v1.2',
    change: 'Enhanced parental consent mechanisms',
    severity: 'high',
    timestamp: '1 day ago',
    status: 'published',
    nftHash: 'ALGO_TX_2024_003',
    realTxId: 'DEMO_TX_003',
  },
  {
    id: 4,
    type: 'Data Breach Protocol',
    policy: 'Incident Response Policy v3.1',
    change: 'Updated notification timelines',
    severity: 'critical',
    timestamp: '2 days ago',
    status: 'published',
    nftHash: 'ALGO_TX_2024_004',
    realTxId: 'DEMO_TX_004',
  },
];

const performanceMetrics = [
  { label: 'Active Policies', value: '47', change: '+8%', positive: true },
  { label: 'Compliance Score', value: '98.7%', change: '+2.1%', positive: true },
  { label: 'Data Flows Blocked', value: '234', change: '+15%', positive: true },
  { label: 'NFTs Minted', value: '156', change: '+23%', positive: true },
];

const availableTemplates = [
  { 
    id: 'gdpr',
    name: 'GDPR Privacy Policy', 
    region: 'EU', 
    status: 'active', 
    lastUpdated: '2024-01-10',
    description: 'Comprehensive GDPR-compliant privacy policy template',
    sections: ['Data Collection', 'Legal Basis', 'User Rights', 'Data Transfers', 'Retention', 'Contact Information']
  },
  { 
    id: 'ccpa',
    name: 'CCPA Privacy Notice', 
    region: 'California', 
    status: 'active', 
    lastUpdated: '2024-01-08',
    description: 'California Consumer Privacy Act compliant notice',
    sections: ['Personal Information Categories', 'Sources', 'Business Purposes', 'Consumer Rights', 'Non-Discrimination']
  },
  { 
    id: 'coppa',
    name: 'COPPA Children Policy', 
    region: 'US', 
    status: 'active', 
    lastUpdated: '2024-01-05',
    description: 'Children\'s Online Privacy Protection Act compliance',
    sections: ['Information Collection', 'Parental Consent', 'Disclosure', 'Access Rights', 'Contact Information']
  },
  { 
    id: 'pipeda',
    name: 'PIPEDA Privacy Policy', 
    region: 'Canada', 
    status: 'draft', 
    lastUpdated: '2024-01-03',
    description: 'Personal Information Protection and Electronic Documents Act',
    sections: ['Collection Purposes', 'Consent', 'Use and Disclosure', 'Retention', 'Access Rights', 'Complaints']
  },
];

const complianceDetails = {
  gdpr: {
    title: 'General Data Protection Regulation (GDPR)',
    jurisdiction: 'European Union',
    requirements: [
      'Lawful basis for processing personal data',
      'Data subject rights (access, rectification, erasure, portability)',
      'Privacy by design and by default',
      'Data protection impact assessments',
      'Appointment of Data Protection Officer (if required)',
      'Breach notification within 72 hours'
    ],
    penalties: 'Up to €20 million or 4% of annual global turnover',
    keyPrinciples: ['Lawfulness', 'Fairness', 'Transparency', 'Purpose limitation', 'Data minimization', 'Accuracy']
  },
  ccpa: {
    title: 'California Consumer Privacy Act (CCPA)',
    jurisdiction: 'California, United States',
    requirements: [
      'Right to know what personal information is collected',
      'Right to delete personal information',
      'Right to opt-out of sale of personal information',
      'Right to non-discrimination for exercising privacy rights',
      'Disclosure of personal information categories',
      'Reasonable security procedures'
    ],
    penalties: 'Up to $7,500 per violation',
    keyPrinciples: ['Transparency', 'Consumer Control', 'Non-discrimination', 'Reasonable Security']
  },
  coppa: {
    title: 'Children\'s Online Privacy Protection Act (COPPA)',
    jurisdiction: 'United States',
    requirements: [
      'Parental consent for children under 13',
      'Clear privacy notice about information collection',
      'Limited collection of personal information',
      'No conditioning participation on disclosure',
      'Parental access to child\'s information',
      'Secure deletion of information'
    ],
    penalties: 'Up to $43,792 per violation',
    keyPrinciples: ['Parental Control', 'Limited Collection', 'Secure Handling', 'Transparency']
  }
};

export function PrivacyTerms() {
  const [selectedModule, setSelectedModule] = useState('policy-generator');
  const [moduleStates, setModuleStates] = useState<Record<string, 'active' | 'inactive'>>({
    'policy-generator': 'active',
    'data-flow-monitor': 'active',
    'nft-versioning': 'active'
  });

  // Modal states
  const [showConfigureModal, setShowConfigureModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showUpdatesModal, setShowUpdatesModal] = useState(false);
  const [showComplianceModal, setShowComplianceModal] = useState(false);
  const [showMonitorModal, setShowMonitorModal] = useState(false);
  const [showRecordsModal, setShowRecordsModal] = useState(false);
  const [showGeneratorModal, setShowGeneratorModal] = useState(false);
  const [showAlgorandModal, setShowAlgorandModal] = useState(false);

  // Form and data states
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [selectedCompliance, setSelectedCompliance] = useState<string>('');
  const [selectedUpdate, setSelectedUpdate] = useState<any>(null);
  const [copiedText, setCopiedText] = useState('');
  const [generatedPolicy, setGeneratedPolicy] = useState<string>('');
  const [policyForm, setPolicyForm] = useState({
    companyName: '',
    businessType: '',
    contactEmail: '',
    effectiveDate: new Date().toISOString().split('T')[0],
    jurisdictions: [] as string[],
    dataTypes: [] as string[],
    retentionPeriod: '2 years',
    hasChildren: false,
    hasPayments: false,
    hasCookies: true,
    hasAnalytics: true,
    hasMarketing: false
  });

  const toggleModule = (moduleId: string) => {
    setModuleStates(prev => ({
      ...prev,
      [moduleId]: prev[moduleId] === 'active' ? 'inactive' : 'active'
    }));
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const handlePreviewTemplate = (template: any) => {
    setSelectedTemplate(template);
    setShowPreviewModal(true);
  };

  const handleUseTemplate = (template: any) => {
    // Pre-fill the policy generator with template-specific settings
    const templateSettings = {
      gdpr: {
        jurisdictions: ['gdpr'],
        dataTypes: ['personal_identifiers', 'contact_information', 'usage_data'],
        hasChildren: false,
        businessType: 'Technology Company'
      },
      ccpa: {
        jurisdictions: ['ccpa'],
        dataTypes: ['personal_identifiers', 'commercial_information', 'internet_activity'],
        hasChildren: false,
        businessType: 'E-commerce Platform'
      },
      coppa: {
        jurisdictions: ['coppa'],
        dataTypes: ['personal_identifiers', 'contact_information'],
        hasChildren: true,
        businessType: 'Educational Platform'
      },
      pipeda: {
        jurisdictions: ['pipeda'],
        dataTypes: ['personal_identifiers', 'contact_information', 'financial_information'],
        hasChildren: false,
        businessType: 'Financial Services'
      }
    };

    const settings = templateSettings[template.id as keyof typeof templateSettings];
    if (settings) {
      setPolicyForm(prev => ({
        ...prev,
        ...settings
      }));
    }

    setShowPreviewModal(false);
    setShowGeneratorModal(true);
  };

  const handleViewCompliance = (complianceType: string) => {
    setSelectedCompliance(complianceType);
    setShowComplianceModal(true);
  };

  const handleViewAlgorandRecord = (update: any) => {
    setSelectedUpdate(update);
    setShowAlgorandModal(true);
  };

  const generatePolicy = () => {
    if (!policyForm.companyName || !policyForm.businessType || !policyForm.contactEmail) {
      alert('Please fill in all required fields (Company Name, Business Type, Contact Email)');
      return;
    }

    const jurisdictionText = policyForm.jurisdictions.map(j => {
      switch(j) {
        case 'gdpr': return 'GDPR (European Union)';
        case 'ccpa': return 'CCPA (California)';
        case 'coppa': return 'COPPA (United States)';
        case 'pipeda': return 'PIPEDA (Canada)';
        default: return j;
      }
    }).join(', ');

    const dataTypesText = policyForm.dataTypes.map(dt => {
      switch(dt) {
        case 'personal_identifiers': return 'Personal identifiers (name, email, phone)';
        case 'contact_information': return 'Contact information';
        case 'usage_data': return 'Website usage data';
        case 'device_information': return 'Device and browser information';
        case 'location_data': return 'Location data';
        case 'financial_information': return 'Financial and payment information';
        case 'health_information': return 'Health-related information';
        case 'biometric_data': return 'Biometric data';
        case 'commercial_information': return 'Commercial information';
        case 'internet_activity': return 'Internet activity information';
        default: return dt;
      }
    }).join(', ');

    const policy = `
# PRIVACY POLICY

**Effective Date:** ${new Date(policyForm.effectiveDate).toLocaleDateString()}
**Company:** ${policyForm.companyName}
**Business Type:** ${policyForm.businessType}
**Compliance:** ${jurisdictionText}

---

## 1. INFORMATION WE COLLECT

We collect the following types of personal information:
${dataTypesText}

## 2. HOW WE USE YOUR INFORMATION

We use your personal information for the following purposes:
- To provide and maintain our services
- To process transactions and payments
- To communicate with you about our services
- To improve our website and services
- To comply with legal obligations

## 3. INFORMATION SHARING AND DISCLOSURE

We may share your personal information in the following circumstances:
- With your consent
- To comply with legal obligations
- To protect our rights and safety
- With service providers who assist us in operating our business

## 4. DATA RETENTION

We retain your personal information for ${policyForm.retentionPeriod} or as long as necessary to fulfill the purposes outlined in this policy.

## 5. YOUR RIGHTS

Depending on your jurisdiction, you may have the following rights:
${policyForm.jurisdictions.includes('gdpr') ? '- Right to access, rectify, or erase your personal data\n- Right to data portability\n- Right to object to processing\n' : ''}
${policyForm.jurisdictions.includes('ccpa') ? '- Right to know what personal information we collect\n- Right to delete personal information\n- Right to opt-out of sale of personal information\n' : ''}
${policyForm.jurisdictions.includes('coppa') && policyForm.hasChildren ? '- Parental rights to access and delete children\'s information\n' : ''}

## 6. SECURITY MEASURES

We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.

## 7. COOKIES AND TRACKING TECHNOLOGIES

${policyForm.hasCookies ? 'We use cookies and similar tracking technologies to enhance your experience on our website.' : 'We do not use cookies or tracking technologies.'}

${policyForm.hasAnalytics ? '\n## 8. ANALYTICS\n\nWe use analytics services to understand how our website is used and to improve our services.' : ''}

${policyForm.hasMarketing ? '\n## 9. MARKETING COMMUNICATIONS\n\nWe may send you marketing communications about our services. You can opt-out at any time.' : ''}

${policyForm.hasChildren ? '\n## 10. CHILDREN\'S PRIVACY\n\nWe take special care to protect the privacy of children under 13. We obtain parental consent before collecting personal information from children.' : ''}

## ${policyForm.hasChildren ? '11' : policyForm.hasMarketing ? '10' : policyForm.hasAnalytics ? '9' : '8'}. CONTACT US

If you have any questions about this Privacy Policy, please contact us at:
**Email:** ${policyForm.contactEmail}
**Company:** ${policyForm.companyName}

## ${policyForm.hasChildren ? '12' : policyForm.hasMarketing ? '11' : policyForm.hasAnalytics ? '10' : '9'}. CHANGES TO THIS POLICY

We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the effective date.

---

*This policy was generated using EthicGuard Privacy & Terms Autopilot and is compliant with ${jurisdictionText} as of 2025.*
    `.trim();

    setGeneratedPolicy(policy);
  };

  const downloadPolicy = (format: 'html' | 'pdf') => {
    if (!generatedPolicy) {
      alert('Please generate a policy first');
      return;
    }

    if (format === 'html') {
      const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Privacy Policy - ${policyForm.companyName}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
        h2 { color: #555; margin-top: 30px; }
        .meta { background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 30px; }
    </style>
</head>
<body>
    <div class="meta">
        <strong>Generated by EthicGuard Privacy & Terms Autopilot</strong><br>
        <strong>Date:</strong> ${new Date().toLocaleDateString()}<br>
        <strong>Company:</strong> ${policyForm.companyName}
    </div>
    ${generatedPolicy.replace(/\n/g, '<br>').replace(/# /g, '<h1>').replace(/## /g, '</h1><h2>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
</body>
</html>
      `;

      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `privacy-policy-${policyForm.companyName.toLowerCase().replace(/\s+/g, '-')}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      // For PDF, open print dialog
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Privacy Policy - ${policyForm.companyName}</title>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; }
                h1 { color: #333; }
                h2 { color: #555; margin-top: 20px; }
                @media print { body { margin: 0; } }
              </style>
            </head>
            <body>
              ${generatedPolicy.replace(/\n/g, '<br>').replace(/# /g, '<h1>').replace(/## /g, '</h1><h2>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const handleJurisdictionChange = (jurisdiction: string) => {
    setPolicyForm(prev => ({
      ...prev,
      jurisdictions: prev.jurisdictions.includes(jurisdiction)
        ? prev.jurisdictions.filter(j => j !== jurisdiction)
        : [...prev.jurisdictions, jurisdiction]
    }));
  };

  const handleDataTypeChange = (dataType: string) => {
    setPolicyForm(prev => ({
      ...prev,
      dataTypes: prev.dataTypes.includes(dataType)
        ? prev.dataTypes.filter(dt => dt !== dataType)
        : [...prev.dataTypes, dataType]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Privacy & Terms Autopilot</h1>
          <p className="text-gray-600 mt-1">Automated privacy policy management and compliance enforcement</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" icon={Settings} onClick={() => setShowConfigureModal(true)}>
            Configure
          </Button>
          <Button icon={FileText} onClick={() => setShowGeneratorModal(true)}>
            Generate Policy
          </Button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric, index) => (
          <Card key={index}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
              </div>
              <div className="h-12 w-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <Lock className="h-6 w-6 text-purple-600" />
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

      {/* Privacy Modules */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy & Terms Modules</CardTitle>
          <p className="text-sm text-gray-600">Manage automated privacy compliance tools</p>
        </CardHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {privacyModules.map((module) => (
            <div key={module.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`h-12 w-12 ${module.color} rounded-lg flex items-center justify-center`}>
                  <module.icon className="h-6 w-6" />
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={moduleStates[module.id] === 'active' ? 'success' : 'neutral'}>
                    {moduleStates[module.id]}
                  </Badge>
                  <button
                    onClick={() => toggleModule(module.id)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    {moduleStates[module.id] === 'active' ? (
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
                {module.id === 'policy-generator' && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Policies:</span>
                      <span className="font-medium text-blue-600">{module.policies}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Updates:</span>
                      <span className="font-medium text-green-600">{module.updates}</span>
                    </div>
                  </>
                )}
                {module.id === 'data-flow-monitor' && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Blocked:</span>
                      <span className="font-medium text-red-600">{module.blocked}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Flagged:</span>
                      <span className="font-medium text-orange-600">{module.flagged}</span>
                    </div>
                  </>
                )}
                {module.id === 'nft-versioning' && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Minted:</span>
                      <span className="font-medium text-purple-600">{module.minted}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Verified:</span>
                      <span className="font-medium text-green-600">{module.verified}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Accuracy:</span>
                  <span className="font-medium text-green-600">{module.accuracy}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Policy Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Available Policy Templates</CardTitle>
          <p className="text-sm text-gray-600">Pre-built compliance templates for different jurisdictions</p>
        </CardHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableTemplates.map((template, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">{template.name}</h4>
                  <p className="text-sm text-gray-600">{template.region}</p>
                  <p className="text-xs text-gray-500">Updated: {new Date(template.lastUpdated).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={template.status === 'active' ? 'success' : 'neutral'}>
                    {template.status}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" icon={Eye} onClick={() => handlePreviewTemplate(template)}>
                  Preview
                </Button>
                <Button size="sm" onClick={() => handleUseTemplate(template)}>
                  Use This Template
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Policy Updates */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Policy Updates</CardTitle>
            <button 
              onClick={() => setShowUpdatesModal(true)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              View All Updates
            </button>
          </div>
        </CardHeader>
        <div className="space-y-4">
          {recentPolicyUpdates.map((update) => (
            <div key={update.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <FileText className={`h-5 w-5 ${
                      update.severity === 'critical' ? 'text-red-500' :
                      update.severity === 'high' ? 'text-orange-500' : 'text-blue-500'
                    }`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{update.type}</p>
                    <p className="text-sm text-gray-600">{update.policy}</p>
                    <p className="text-xs text-gray-500">{update.change}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <Badge variant="success" size="sm">
                        {update.status}
                      </Badge>
                      <Badge variant={getSeverityColor(update.severity) as any} size="sm">
                        {update.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{update.timestamp}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    icon={ExternalLink}
                    onClick={() => handleViewAlgorandRecord(update)}
                  >
                    View Records
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center p-6">
          <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Generate Policy</h3>
          <p className="text-gray-600 mb-4">Create GDPR/CCPA compliant policies instantly</p>
          <Button variant="outline" className="w-full" onClick={() => setShowGeneratorModal(true)}>
            Start Generator
          </Button>
        </Card>
        
        <Card className="text-center p-6">
          <Activity className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Monitor Data Flows</h3>
          <p className="text-gray-600 mb-4">Real-time compliance monitoring</p>
          <Button variant="outline" className="w-full" onClick={() => setShowMonitorModal(true)}>
            View Monitor
          </Button>
        </Card>
        
        <Card className="text-center p-6">
          <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Mint NFT Proof</h3>
          <p className="text-gray-600 mb-4">Create immutable policy records</p>
          <Button variant="outline" className="w-full" onClick={() => setShowRecordsModal(true)}>
            Mint Now
          </Button>
        </Card>
      </div>

      {/* Configure Modal */}
      {showConfigureModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Configure Privacy & Terms Settings</h2>
              <button
                onClick={() => setShowConfigureModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Module Settings</h3>
                <div className="space-y-4">
                  {privacyModules.map((module) => (
                    <div key={module.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{module.name}</p>
                        <p className="text-sm text-gray-600">{module.description}</p>
                      </div>
                      <button
                        onClick={() => toggleModule(module.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          moduleStates[module.id] === 'active' ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            moduleStates[module.id] === 'active' ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Auto-Update Policies</h4>
                    <p className="text-sm text-gray-600 mb-3">Automatically update policies when regulations change</p>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                    </button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Blockchain Recording</h4>
                    <p className="text-sm text-gray-600 mb-3">Record all policy changes on Algorand blockchain</p>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowConfigureModal(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowConfigureModal(false)}>
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Template Preview Modal */}
      {showPreviewModal && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">{selectedTemplate.name} Preview</h2>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Template Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-blue-800">Region:</span>
                    <span className="ml-2 text-blue-700">{selectedTemplate.region}</span>
                  </div>
                  <div>
                    <span className="font-medium text-blue-800">Status:</span>
                    <span className="ml-2 text-blue-700">{selectedTemplate.status}</span>
                  </div>
                  <div>
                    <span className="font-medium text-blue-800">Last Updated:</span>
                    <span className="ml-2 text-blue-700">{new Date(selectedTemplate.lastUpdated).toLocaleDateString()}</span>
                  </div>
                </div>
                <p className="text-blue-700 mt-2">{selectedTemplate.description}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Included Sections</h3>
                <div className="grid grid-cols-2 gap-2">
                  {selectedTemplate.sections.map((section: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-gray-700">{section}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Sample Content</h3>
                <div className="bg-gray-50 border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">1. Information We Collect</h4>
                  <p className="text-sm text-gray-700 mb-4">
                    This section outlines the types of personal information we collect from users, including but not limited to:
                    contact information, usage data, device information, and any other data relevant to our services.
                  </p>
                  
                  <h4 className="font-medium text-gray-900 mb-2">2. How We Use Your Information</h4>
                  <p className="text-sm text-gray-700 mb-4">
                    We use the collected information to provide our services, improve user experience, communicate with users,
                    and comply with legal obligations as required by applicable regulations.
                  </p>
                  
                  <p className="text-xs text-gray-500 italic">
                    * This is a sample preview. The actual generated policy will be comprehensive and tailored to your specific business needs.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Compliance Features</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-700">Automatically includes required legal disclosures</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-700">Jurisdiction-specific language and requirements</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-700">Professional legal terminology</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-700">Regular updates for regulatory changes</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowPreviewModal(false)}>
                Close
              </Button>
              <Button onClick={() => handleUseTemplate(selectedTemplate)}>
                Use This Template
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Policy Generator Modal */}
      {showGeneratorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Privacy Policy Generator</h2>
              <button
                onClick={() => setShowGeneratorModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form Section */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                      <input
                        type="text"
                        value={policyForm.companyName}
                        onChange={(e) => setPolicyForm(prev => ({ ...prev, companyName: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your Company Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Business Type *</label>
                      <select
                        value={policyForm.businessType}
                        onChange={(e) => setPolicyForm(prev => ({ ...prev, businessType: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Business Type</option>
                        <option value="Technology Company">Technology Company</option>
                        <option value="E-commerce Platform">E-commerce Platform</option>
                        <option value="Educational Platform">Educational Platform</option>
                        <option value="Healthcare Provider">Healthcare Provider</option>
                        <option value="Financial Services">Financial Services</option>
                        <option value="Media & Entertainment">Media & Entertainment</option>
                        <option value="Professional Services">Professional Services</option>
                        <option value="Non-Profit Organization">Non-Profit Organization</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email *</label>
                      <input
                        type="email"
                        value={policyForm.contactEmail}
                        onChange={(e) => setPolicyForm(prev => ({ ...prev, contactEmail: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="contact@yourcompany.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Effective Date</label>
                      <input
                        type="date"
                        value={policyForm.effectiveDate}
                        onChange={(e) => setPolicyForm(prev => ({ ...prev, effectiveDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Requirements</h3>
                  <div className="space-y-3">
                    {[
                      { id: 'gdpr', label: 'GDPR (European Union)', desc: 'General Data Protection Regulation' },
                      { id: 'ccpa', label: 'CCPA (California)', desc: 'California Consumer Privacy Act' },
                      { id: 'coppa', label: 'COPPA (United States)', desc: 'Children\'s Online Privacy Protection Act' },
                      { id: 'pipeda', label: 'PIPEDA (Canada)', desc: 'Personal Information Protection and Electronic Documents Act' }
                    ].map((jurisdiction) => (
                      <label key={jurisdiction.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={policyForm.jurisdictions.includes(jurisdiction.id)}
                          onChange={() => handleJurisdictionChange(jurisdiction.id)}
                          className="mt-1"
                        />
                        <div>
                          <span className="font-medium text-gray-900">{jurisdiction.label}</span>
                          <p className="text-sm text-gray-600">{jurisdiction.desc}</p>
                          <button
                            onClick={() => handleViewCompliance(jurisdiction.id)}
                            className="text-xs text-blue-600 hover:text-blue-700 mt-1"
                          >
                            View Requirements
                          </button>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Collection Types</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { id: 'personal_identifiers', label: 'Personal Identifiers', desc: 'Name, email, phone number' },
                      { id: 'contact_information', label: 'Contact Information', desc: 'Address, phone, email' },
                      { id: 'usage_data', label: 'Usage Data', desc: 'Website analytics, user behavior' },
                      { id: 'device_information', label: 'Device Information', desc: 'Browser, IP address, device type' },
                      { id: 'location_data', label: 'Location Data', desc: 'GPS coordinates, approximate location' },
                      { id: 'financial_information', label: 'Financial Information', desc: 'Payment details, billing info' },
                      { id: 'health_information', label: 'Health Information', desc: 'Medical records, health data' },
                      { id: 'biometric_data', label: 'Biometric Data', desc: 'Fingerprints, facial recognition' },
                      { id: 'commercial_information', label: 'Commercial Information', desc: 'Purchase history, preferences' },
                      { id: 'internet_activity', label: 'Internet Activity', desc: 'Browsing history, search queries' }
                    ].map((dataType) => (
                      <label key={dataType.id} className="flex items-start space-x-3 p-2 border rounded hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={policyForm.dataTypes.includes(dataType.id)}
                          onChange={() => handleDataTypeChange(dataType.id)}
                          className="mt-1"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-900">{dataType.label}</span>
                          <p className="text-xs text-gray-600">{dataType.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Data Retention Period</label>
                      <select
                        value={policyForm.retentionPeriod}
                        onChange={(e) => setPolicyForm(prev => ({ ...prev, retentionPeriod: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="1 year">1 year</option>
                        <option value="2 years">2 years</option>
                        <option value="3 years">3 years</option>
                        <option value="5 years">5 years</option>
                        <option value="7 years">7 years</option>
                        <option value="As long as necessary">As long as necessary</option>
                      </select>
                    </div>
                    
                    <div className="space-y-3">
                      {[
                        { key: 'hasChildren', label: 'Collect data from children under 13', desc: 'Requires COPPA compliance' },
                        { key: 'hasPayments', label: 'Process payments', desc: 'Includes payment processing disclosures' },
                        { key: 'hasCookies', label: 'Use cookies', desc: 'Includes cookie policy section' },
                        { key: 'hasAnalytics', label: 'Use analytics', desc: 'Includes analytics tracking disclosures' },
                        { key: 'hasMarketing', label: 'Send marketing communications', desc: 'Includes marketing opt-out provisions' }
                      ].map((setting) => (
                        <label key={setting.key} className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            checked={policyForm[setting.key as keyof typeof policyForm] as boolean}
                            onChange={(e) => setPolicyForm(prev => ({ ...prev, [setting.key]: e.target.checked }))}
                            className="mt-1"
                          />
                          <div>
                            <span className="text-sm font-medium text-gray-900">{setting.label}</span>
                            <p className="text-xs text-gray-600">{setting.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Section */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Generated Policy Preview</h3>
                  {generatedPolicy ? (
                    <div className="space-y-4">
                      <div className="bg-gray-50 border rounded-lg p-4 max-h-96 overflow-y-auto">
                        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                          {generatedPolicy}
                        </pre>
                      </div>
                      <div className="flex space-x-3">
                        <Button variant="outline" icon={Download} onClick={() => downloadPolicy('html')}>
                          Download HTML
                        </Button>
                        <Button variant="outline" icon={Printer} onClick={() => downloadPolicy('pdf')}>
                          Print/PDF
                        </Button>
                        <Button variant="outline" icon={Copy} onClick={() => copyToClipboard(generatedPolicy)}>
                          {copiedText === generatedPolicy ? 'Copied!' : 'Copy Text'}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">Fill out the form and click "Generate Policy" to see your custom privacy policy</p>
                      <Button onClick={generatePolicy} disabled={!policyForm.companyName || !policyForm.businessType || !policyForm.contactEmail}>
                        Generate Compliant Policy
                      </Button>
                    </div>
                  )}
                </div>

                {generatedPolicy && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 mb-2">✅ Compliance Status</h4>
                    <div className="space-y-2">
                      {policyForm.jurisdictions.map(jurisdiction => (
                        <div key={jurisdiction} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-800">
                            {jurisdiction.toUpperCase()} Compliant
                          </span>
                        </div>
                      ))}
                      {policyForm.jurisdictions.length === 0 && (
                        <p className="text-sm text-green-800">Basic privacy policy generated</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-8 pt-6 border-t">
              <div className="text-sm text-gray-600">
                * Required fields must be completed to generate policy
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setShowGeneratorModal(false)}>
                  Close
                </Button>
                <Button 
                  onClick={generatePolicy}
                  disabled={!policyForm.companyName || !policyForm.businessType || !policyForm.contactEmail}
                >
                  Generate Policy
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compliance Details Modal */}
      {showComplianceModal && selectedCompliance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {complianceDetails[selectedCompliance as keyof typeof complianceDetails]?.title}
              </h2>
              <button
                onClick={() => setShowComplianceModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {(() => {
              const details = complianceDetails[selectedCompliance as keyof typeof complianceDetails];
              if (!details) return null;
              
              return (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Jurisdiction</h3>
                    <p className="text-blue-800">{details.jurisdiction}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Key Requirements</h3>
                    <div className="space-y-2">
                      {details.requirements.map((req, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Key Principles</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {details.keyPrinciples.map((principle, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-2 text-center">
                          <span className="text-sm font-medium text-gray-700">{principle}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="font-semibold text-red-900 mb-2">Penalties for Non-Compliance</h3>
                    <p className="text-red-800">{details.penalties}</p>
                  </div>
                </div>
              );
            })()}
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowComplianceModal(false)}>
                Close
              </Button>
              <Button onClick={() => {
                setShowComplianceModal(false);
                setShowGeneratorModal(true);
              }}>
                Generate Compliant Policy
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Algorand Records Modal */}
      {showAlgorandModal && selectedUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Blockchain Record Details</h2>
              <button
                onClick={() => setShowAlgorandModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-semibold text-purple-900 mb-3">Policy Update Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-purple-800">Policy:</span>
                    <span className="ml-2 text-purple-700">{selectedUpdate.policy}</span>
                  </div>
                  <div>
                    <span className="font-medium text-purple-800">Type:</span>
                    <span className="ml-2 text-purple-700">{selectedUpdate.type}</span>
                  </div>
                  <div>
                    <span className="font-medium text-purple-800">Timestamp:</span>
                    <span className="ml-2 text-purple-700">{selectedUpdate.timestamp}</span>
                  </div>
                  <div>
                    <span className="font-medium text-purple-800">Status:</span>
                    <Badge variant="success" size="sm">{selectedUpdate.status}</Badge>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="font-medium text-purple-800">Change:</span>
                  <p className="text-purple-700 mt-1">{selectedUpdate.change}</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-3">Algorand Blockchain Record</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded border">
                    <div>
                      <span className="font-medium text-gray-700">Transaction ID:</span>
                      <p className="text-sm text-gray-600 font-mono">{selectedUpdate.realTxId}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        icon={Copy}
                        onClick={() => copyToClipboard(selectedUpdate.realTxId)}
                      >
                        {copiedText === selectedUpdate.realTxId ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-white rounded border">
                    <div>
                      <span className="font-medium text-gray-700">Policy Hash:</span>
                      <p className="text-sm text-gray-600 font-mono">{selectedUpdate.nftHash}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        icon={Copy}
                        onClick={() => copyToClipboard(selectedUpdate.nftHash)}
                      >
                        {copiedText === selectedUpdate.nftHash ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <Info className="h-4 w-4 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800">Demo Mode Notice</h4>
                        <p className="text-sm text-yellow-700 mt-1">
                          This is a demonstration of blockchain integration. In production, these would be real Algorand transactions 
                          providing immutable proof of policy updates. The transaction IDs shown are for demonstration purposes.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-white rounded border">
                      <span className="font-medium text-gray-700">Block Height:</span>
                      <p className="text-gray-600">Demo: 12,345,678</p>
                    </div>
                    <div className="p-3 bg-white rounded border">
                      <span className="font-medium text-gray-700">Confirmation Time:</span>
                      <p className="text-gray-600">~4.5 seconds</p>
                    </div>
                    <div className="p-3 bg-white rounded border">
                      <span className="font-medium text-gray-700">Network:</span>
                      <p className="text-gray-600">Algorand Testnet</p>
                    </div>
                    <div className="p-3 bg-white rounded border">
                      <span className="font-medium text-gray-700">Fee:</span>
                      <p className="text-gray-600">0.001 ALGO</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-3">Verification Benefits</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-800">Immutable record of policy changes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-800">Cryptographic proof of authenticity</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-800">Regulatory compliance documentation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-800">Transparent audit trail for authorities</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowAlgorandModal(false)}>
                Close
              </Button>
              <Button 
                variant="outline" 
                icon={ExternalLink}
                onClick={() => {
                  alert('Demo Mode: In production, this would open the Algorand explorer with the real transaction details.');
                }}
              >
                View on Algorand Explorer (Demo)
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* All Updates Modal */}
      {showUpdatesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">All Policy Updates</h2>
              <button
                onClick={() => setShowUpdatesModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              {recentPolicyUpdates.map((update) => (
                <div key={update.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <FileText className={`h-5 w-5 ${
                          update.severity === 'critical' ? 'text-red-500' :
                          update.severity === 'high' ? 'text-orange-500' : 'text-blue-500'
                        }`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{update.type}</p>
                        <p className="text-sm text-gray-600">{update.policy}</p>
                        <p className="text-xs text-gray-500">{update.change}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <Badge variant="success" size="sm">
                            {update.status}
                          </Badge>
                          <Badge variant={getSeverityColor(update.severity) as any} size="sm">
                            {update.severity}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{update.timestamp}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        icon={ExternalLink}
                        onClick={() => handleViewAlgorandRecord(update)}
                      >
                        View Records
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end mt-6">
              <Button onClick={() => setShowUpdatesModal(false)}>
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
              <h2 className="text-xl font-bold text-gray-900">Data Flow Monitor</h2>
              <button
                onClick={() => setShowMonitorModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-3">Real-time Monitoring Status</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-800">Active Monitoring</span>
                  </div>
                  <div className="text-green-700">89 data flows blocked today</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Blocked Data Flows</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between p-2 bg-red-50 rounded">
                      <span className="text-sm">Unauthorized third-party sharing</span>
                      <span className="text-sm font-medium text-red-600">23</span>
                    </div>
                    <div className="flex justify-between p-2 bg-red-50 rounded">
                      <span className="text-sm">Cross-border transfer violations</span>
                      <span className="text-sm font-medium text-red-600">18</span>
                    </div>
                    <div className="flex justify-between p-2 bg-red-50 rounded">
                      <span className="text-sm">Consent requirement violations</span>
                      <span className="text-sm font-medium text-red-600">31</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Flagged Activities</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between p-2 bg-yellow-50 rounded">
                      <span className="text-sm">Retention period warnings</span>
                      <span className="text-sm font-medium text-yellow-600">45</span>
                    </div>
                    <div className="flex justify-between p-2 bg-yellow-50 rounded">
                      <span className="text-sm">Data minimization alerts</span>
                      <span className="text-sm font-medium text-yellow-600">67</span>
                    </div>
                    <div className="flex justify-between p-2 bg-yellow-50 rounded">
                      <span className="text-sm">Purpose limitation flags</span>
                      <span className="text-sm font-medium text-yellow-600">23</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button onClick={() => setShowMonitorModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* NFT Records Modal */}
      {showRecordsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">NFT Versioning & Blockchain Records</h2>
              <button
                onClick={() => setShowRecordsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-semibold text-purple-900 mb-3">Blockchain Integration Status</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">23</div>
                    <div className="text-sm text-purple-700">NFTs Minted</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">100%</div>
                    <div className="text-sm text-purple-700">Verification Rate</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Recent NFT Records</h3>
                <div className="space-y-3">
                  {recentPolicyUpdates.slice(0, 3).map((update) => (
                    <div key={update.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{update.policy}</p>
                        <p className="text-sm text-gray-600">{update.timestamp}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant="success" size="sm">Minted</Badge>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          icon={ExternalLink}
                          onClick={() => handleViewAlgorandRecord(update)}
                        >
                          View on Algorand Explorer
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-3">Mint New Policy NFT</h3>
                <p className="text-blue-800 mb-4">
                  Create an immutable blockchain record of your current privacy policy for legal verification.
                </p>
                <Button icon={Shield}>
                  Mint Policy NFT on Algorand
                </Button>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button onClick={() => setShowRecordsModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}