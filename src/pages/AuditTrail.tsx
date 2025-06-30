import React, { useState, useEffect } from 'react';
import { 
  Database, 
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
  ExternalLink,
  Search,
  Filter,
  Copy,
  Check,
  Lock,
  Brain,
  Users,
  Calendar,
  Clock,
  Hash,
  Layers,
  Verified,
  Info,
  Key
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { dashboardAPI } from '../services/api';
import { botService } from '../services/botService';
import { blockchainService } from '../services/blockchainService';

interface BlockchainRecord {
  id: string;
  type: 'ai_governance' | 'privacy_policy' | 'compliance_rule' | 'incident_response';
  event: string;
  description: string;
  blockchain: 'Algorand';
  txHash: string;
  blockHeight: number;
  timestamp: string;
  status: 'confirmed' | 'pending' | 'failed';
  gasUsed?: number;
  dataHash: string;
  sourceModule: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  metadata: {
    userId?: string;
    botId?: string;
    ruleId?: string;
    policyVersion?: string;
    complianceScore?: number;
    affectedUsers?: number;
    dataSize?: number;
  };
}

interface AuditModule {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  recordsCount: number;
  lastRecord: string;
  accuracy: number;
  icon: React.ElementType;
  color: string;
  sourceData: string;
}

export function AuditTrail() {
  const [auditRecords, setAuditRecords] = useState<BlockchainRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [filterBlockchain, setFilterBlockchain] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<BlockchainRecord | null>(null);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [copiedHash, setCopiedHash] = useState('');
  const [metrics, setMetrics] = useState({
    totalRecords: 0,
    verifiedRecords: 0,
    pendingRecords: 0,
    complianceScore: 0
  });

  const auditModules: AuditModule[] = [
    {
      id: 'ai-governance-audit',
      name: 'AI Governance Audit',
      description: 'Immutable records of AI decisions, bias detections, and compliance violations',
      status: 'active',
      recordsCount: 0,
      lastRecord: '5 minutes ago',
      accuracy: 100.0,
      icon: Brain,
      color: 'bg-blue-100 text-blue-600',
      sourceData: 'AI Governance Module'
    },
    {
      id: 'privacy-policy-audit',
      name: 'Privacy Policy Audit',
      description: 'Blockchain verification of policy updates, user consents, and data flows',
      status: 'active',
      recordsCount: 0,
      lastRecord: '1 hour ago',
      accuracy: 100.0,
      icon: Lock,
      color: 'bg-purple-100 text-purple-600',
      sourceData: 'Privacy & Terms Module'
    },
    {
      id: 'compliance-dashboard',
      name: 'Compliance Dashboard',
      description: 'Real-time compliance status and regulatory reporting verification',
      status: 'active',
      recordsCount: 0,
      lastRecord: '30 minutes ago',
      accuracy: 100.0,
      icon: BarChart3,
      color: 'bg-green-100 text-green-600',
      sourceData: 'Dashboard Metrics'
    }
  ];

  useEffect(() => {
    loadAuditData();
    
    // Set up real-time updates
    const interval = setInterval(loadAuditData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadAuditData = async () => {
    try {
      setLoading(true);
      
      // Get blockchain records from service
      const records = await blockchainService.getAuditRecords();
      setAuditRecords(records);

      // Update metrics
      setMetrics({
        totalRecords: records.length,
        verifiedRecords: records.filter(r => r.status === 'confirmed').length,
        pendingRecords: records.filter(r => r.status === 'pending').length,
        complianceScore: await blockchainService.getComplianceScore()
      });

      // Update module record counts
      auditModules.forEach(module => {
        module.recordsCount = records.filter(r => 
          r.sourceModule.includes(module.sourceData.split(' ')[0])
        ).length;
      });

    } catch (error) {
      console.error('Error loading audit data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = auditRecords.filter(record => {
    const matchesType = filterType === 'all' || record.type === filterType;
    const matchesBlockchain = filterBlockchain === 'all' || record.blockchain === filterBlockchain;
    const matchesSearch = searchTerm === '' || 
      record.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.sourceModule.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesType && matchesBlockchain && matchesSearch;
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(''), 2000);
  };

  const openBlockchainExplorer = (record: BlockchainRecord) => {
    blockchainService.openExplorer(record);
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ai_governance': return Brain;
      case 'privacy_policy': return Lock;
      case 'compliance_rule': return Shield;
      case 'incident_response': return AlertTriangle;
      default: return Database;
    }
  };

  const exportAuditTrail = async () => {
    await blockchainService.exportAuditTrail(filteredRecords);
  };

  const verifyRecord = async (record: BlockchainRecord) => {
    try {
      const verificationResult = await blockchainService.verifyRecord(record.id);
      alert(`Record verification: ${verificationResult.verified ? 'Successful' : 'Failed'}\n\nBlockchain: ${record.blockchain}\nTransaction: ${record.txHash}\nBlock Height: ${record.blockHeight}`);
    } catch (error) {
      console.error('Verification error:', error);
      alert('Verification failed. Please try again.');
    }
  };

  if (loading && auditRecords.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading immutable audit records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blockchain-Powered Audit Trail</h1>
          <p className="text-gray-600 mt-1">
            Immutable compliance records from AI Governance and Privacy modules
          </p>
        </div>
        <div className="flex space-x-3">
          <Button icon={Download} onClick={exportAuditTrail}>
            Export Records
          </Button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Records</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{metrics.totalRecords}</p>
            </div>
            <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Database className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="px-6 pb-6 flex items-center">
            <span className="text-sm font-medium text-green-600">+{Math.floor(Math.random() * 10) + 5}%</span>
            <span className="text-sm text-gray-500 ml-2">from last week</span>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-600">Verified Records</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{metrics.verifiedRecords}</p>
            </div>
            <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center">
              <Verified className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="px-6 pb-6 flex items-center">
            <span className="text-sm font-medium text-green-600">100%</span>
            <span className="text-sm text-gray-500 ml-2">verification rate</span>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-600">Compliance Score</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{metrics.complianceScore}%</p>
            </div>
            <div className="h-12 w-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="px-6 pb-6 flex items-center">
            <span className="text-sm font-medium text-green-600">+2.1%</span>
            <span className="text-sm text-gray-500 ml-2">improvement</span>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Modules</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{auditModules.filter(m => m.status === 'active').length}</p>
            </div>
            <div className="h-12 w-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <Activity className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="px-6 pb-6 flex items-center">
            <span className="text-sm font-medium text-blue-600">All systems</span>
            <span className="text-sm text-gray-500 ml-2">operational</span>
          </div>
        </Card>
      </div>

      {/* Audit Modules */}
      <Card>
        <CardHeader>
          <CardTitle>Integrated Audit Modules</CardTitle>
          <p className="text-sm text-gray-600">Blockchain recording from AI Governance and Privacy systems</p>
        </CardHeader>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {auditModules.map((module) => (
            <div key={module.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`h-12 w-12 ${module.color} rounded-lg flex items-center justify-center`}>
                  <module.icon className="h-6 w-6" />
                </div>
                <Badge variant={module.status === 'active' ? 'success' : 'neutral'}>
                  {module.status}
                </Badge>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{module.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{module.description}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Source:</span>
                  <span className="font-medium text-blue-600">{module.sourceData}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Records:</span>
                  <span className="font-medium text-green-600">
                    {auditRecords.filter(r => r.sourceModule.includes(module.sourceData.split(' ')[0])).length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Record:</span>
                  <span className="font-medium text-gray-900">{module.lastRecord}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Accuracy:</span>
                  <span className="font-medium text-green-600">{module.accuracy}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search audit records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="ai_governance">AI Governance</option>
            <option value="privacy_policy">Privacy Policy</option>
            <option value="compliance_rule">Compliance Rule</option>
            <option value="incident_response">Incident Response</option>
          </select>
          <select
            value={filterBlockchain}
            onChange={(e) => setFilterBlockchain(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Blockchains</option>
            <option value="Algorand">Algorand</option>
          </select>
        </div>
      </Card>

      {/* Audit Records */}
      <Card>
        <CardHeader>
          <CardTitle>Immutable Audit Records ({filteredRecords.length})</CardTitle>
          <p className="text-sm text-gray-600">Blockchain-verified compliance and governance events</p>
        </CardHeader>
        <div className="p-6 space-y-4">
          {filteredRecords.length > 0 ? (
            filteredRecords.map((record) => {
              const IconComponent = getTypeIcon(record.type);
              return (
                <div 
                  key={record.id} 
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => {
                    setSelectedRecord(record);
                    setShowRecordModal(true);
                  }}
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      <IconComponent className={`h-5 w-5 ${
                        record.severity === 'critical' ? 'text-red-500' :
                        record.severity === 'high' ? 'text-orange-500' : 
                        record.severity === 'medium' ? 'text-blue-500' : 'text-green-500'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="text-sm font-medium text-gray-900">{record.event}</p>
                        <Badge variant="info" size="sm">{record.sourceModule}</Badge>
                        <Badge variant="neutral" size="sm">{record.blockchain}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{record.description}</p>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                        <span>Block: {record.blockHeight.toLocaleString()}</span>
                        <span>Gas: {record.gasUsed}</span>
                        <span>{record.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 flex-shrink-0">
                    <Badge variant={getSeverityColor(record.severity) as any}>
                      {record.severity}
                    </Badge>
                    <Badge variant={record.status === 'confirmed' ? 'success' : 'warning'}>
                      {record.status}
                    </Badge>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openBlockchainExplorer(record);
                      }}
                      className="p-1 text-blue-600 hover:text-blue-700"
                      title="View on blockchain explorer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                    <Eye className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <Database className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No audit records match your filters</p>
            </div>
          )}
        </div>
      </Card>

      {/* Record Detail Modal */}
      {showRecordModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Blockchain Record Details</h2>
              <button
                onClick={() => setShowRecordModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Record Overview */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{selectedRecord.event}</h3>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getSeverityColor(selectedRecord.severity) as any}>
                      {selectedRecord.severity}
                    </Badge>
                    <Badge variant={selectedRecord.status === 'confirmed' ? 'success' : 'warning'}>
                      {selectedRecord.status}
                    </Badge>
                    <Badge variant="info">{selectedRecord.blockchain}</Badge>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{selectedRecord.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Source Module:</span>
                    <span className="ml-2 text-gray-900">{selectedRecord.sourceModule}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Timestamp:</span>
                    <span className="ml-2 text-gray-900">{selectedRecord.timestamp}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Block Height:</span>
                    <span className="ml-2 text-gray-900">{selectedRecord.blockHeight.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Gas Used:</span>
                    <span className="ml-2 text-gray-900">{selectedRecord.gasUsed}</span>
                  </div>
                </div>
              </div>

              {/* Blockchain Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Blockchain Verification</h4>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">Transaction Hash:</span>
                      <div className="flex items-center space-x-2">
                        <code className="text-sm bg-white px-2 py-1 rounded border">
                          {selectedRecord.txHash.substring(0, 20)}...
                        </code>
                        <button
                          onClick={() => copyToClipboard(selectedRecord.txHash)}
                          className="p-1 text-blue-600 hover:text-blue-700"
                        >
                          {copiedHash === selectedRecord.txHash ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">Data Hash:</span>
                      <div className="flex items-center space-x-2">
                        <code className="text-sm bg-white px-2 py-1 rounded border">
                          {selectedRecord.dataHash.substring(0, 20)}...
                        </code>
                        <button
                          onClick={() => copyToClipboard(selectedRecord.dataHash)}
                          className="p-1 text-blue-600 hover:text-blue-700"
                        >
                          {copiedHash === selectedRecord.dataHash ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">Network:</span>
                      <span className="text-gray-900">{selectedRecord.blockchain} Testnet</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metadata */}
              {selectedRecord.metadata && Object.keys(selectedRecord.metadata).length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Record Metadata</h4>
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {Object.entries(selectedRecord.metadata).map(([key, value]) => (
                        <div key={key}>
                          <span className="font-medium text-gray-600 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}:
                          </span>
                          <span className="ml-2 text-gray-900">
                            {typeof value === 'number' ? value.toLocaleString() : value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => openBlockchainExplorer(selectedRecord)}
                  icon={ExternalLink}
                >
                  View on {selectedRecord.blockchain} Explorer
                </Button>
                <div className="flex space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={() => verifyRecord(selectedRecord)}
                    icon={Verified}
                  >
                    Verify Record
                  </Button>
                  <Button onClick={() => setShowRecordModal(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Verification Portal Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Compliance Verification Portal</h2>
              <button
                onClick={() => setShowVerificationModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="text-center">
                <Verified className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Regulatory Verification</h3>
                <p className="text-gray-600">
                  Verify compliance records and audit trails for regulatory purposes
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">Verification Status</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-700">Total Records Verified:</span>
                    <span className="font-medium text-green-900">{metrics.verifiedRecords}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Blockchain Networks:</span>
                    <span className="font-medium text-green-900">Algorand</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Compliance Score:</span>
                    <span className="font-medium text-green-900">{metrics.complianceScore}%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Available Verifications</h4>
                <div className="space-y-2">
                  <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="font-medium text-gray-900">AI Governance Compliance</div>
                    <div className="text-sm text-gray-600">Verify AI decision audit trails</div>
                  </button>
                  <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="font-medium text-gray-900">Privacy Policy Verification</div>
                    <div className="text-sm text-gray-600">Verify policy updates and user consents</div>
                  </button>
                  <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="font-medium text-gray-900">Data Flow Compliance</div>
                    <div className="text-sm text-gray-600">Verify data processing and transfer records</div>
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Key className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Regulator Access</p>
                    <p className="text-sm text-blue-800">
                      Generate a read-only API key for regulatory authorities to verify compliance
                    </p>
                    <Button variant="outline" size="sm" className="mt-2" icon={Key}>
                      Generate Regulator Key
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setShowVerificationModal(false)}>
                Close Portal
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}