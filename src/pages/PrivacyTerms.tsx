import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Shield, 
  Lock, 
  Download, 
  Save, 
  Eye, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  Edit, 
  Clock, 
  Calendar, 
  Globe, 
  CheckSquare, 
  Square,
  AlertCircle,
  CheckCircle,
  X,
  ArrowRight,
  Layers,
  Database,
  ExternalLink
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { policyGeneratorService, PolicyFormData, GeneratedPolicy } from '../services/policyGeneratorService';
import { blockchainService } from '../services/blockchainService';

export function PrivacyTerms() {
  const [activeTab, setActiveTab] = useState<'policies' | 'generator' | 'nft'>('policies');
  const [policies, setPolicies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [minting, setMinting] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<any | null>(null);
  const [generatedPolicy, setGeneratedPolicy] = useState<GeneratedPolicy | null>(null);
  const [mintSuccess, setMintSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState('');
  
  // Form data for policy generator
  const [formData, setFormData] = useState<PolicyFormData>({
    companyName: 'EthicGuard',
    businessType: 'Technology',
    contactEmail: 'privacy@ethicguard.com',
    effectiveDate: new Date().toISOString().split('T')[0],
    complianceRequirements: ['GDPR', 'CCPA', 'COPPA', 'PIPEDA'],
    dataCollectionTypes: [
      'Personal Identifiers',
      'Contact Information',
      'Usage Data',
      'Device Information'
    ],
    retentionPeriod: '2',
    childrenData: false,
    processPayments: true,
    useCookies: true,
    useAnalytics: true,
    sendMarketing: false
  });

  // Load policies on component mount
  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    setLoading(true);
    try {
      const data = await policyGeneratorService.getPolicies();
      setPolicies(data);
    } catch (error) {
      console.error('Error loading policies:', error);
      setError('Failed to load policies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePolicy = async (type: 'privacy_policy' | 'terms_of_service') => {
    setGenerating(true);
    setError(null);
    
    try {
      let policy: GeneratedPolicy;
      
      if (type === 'privacy_policy') {
        policy = await policyGeneratorService.generatePrivacyPolicy(formData);
      } else {
        policy = await policyGeneratorService.generateTermsOfService(formData);
      }
      
      setGeneratedPolicy(policy);
    } catch (error) {
      console.error('Error generating policy:', error);
      setError('Failed to generate policy. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSavePolicy = async (type: 'privacy_policy' | 'terms_of_service', status: 'draft' | 'published' = 'draft') => {
    if (!generatedPolicy) return;
    
    setSaving(true);
    setError(null);
    
    try {
      const result = await policyGeneratorService.savePolicy(type, generatedPolicy, formData, status);
      
      if (result.success) {
        await loadPolicies();
        
        if (status === 'published') {
          // If published, offer to mint as NFT
          setSelectedPolicy({
            id: result.id,
            policy_type: type,
            version: generatedPolicy.version,
            title: generatedPolicy.title
          });
          setActiveTab('nft');
        }
      } else {
        setError(result.error || 'Failed to save policy');
      }
    } catch (error) {
      console.error('Error saving policy:', error);
      setError('Failed to save policy. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleMintNFT = async () => {
    if (!selectedPolicy) return;
    
    setMinting(true);
    setError(null);
    setMintSuccess(false);
    
    try {
      const result = await policyGeneratorService.mintPolicyNFT(
        selectedPolicy.id,
        selectedPolicy.policy_type as 'privacy_policy' | 'terms_of_service'
      );
      
      if (result.success) {
        setMintSuccess(true);
        await loadPolicies();
      } else {
        setError(result.error || 'Failed to mint policy NFT');
      }
    } catch (error) {
      console.error('Error minting policy NFT:', error);
      setError('Failed to mint policy NFT. Please try again.');
    } finally {
      setMinting(false);
    }
  };

  const handleViewPolicy = async (policy: any) => {
    setSelectedPolicy(policy);
    setActiveTab('policies');
  };

  const handleDeletePolicy = async (policyId: string) => {
    // In a real implementation, this would delete the policy from the database
    alert('Delete functionality would be implemented in production');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const downloadPolicy = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const toggleComplianceRequirement = (requirement: string) => {
    setFormData(prev => {
      if (prev.complianceRequirements.includes(requirement)) {
        return {
          ...prev,
          complianceRequirements: prev.complianceRequirements.filter(r => r !== requirement)
        };
      } else {
        return {
          ...prev,
          complianceRequirements: [...prev.complianceRequirements, requirement]
        };
      }
    });
  };

  const toggleDataCollectionType = (type: string) => {
    setFormData(prev => {
      if (prev.dataCollectionTypes.includes(type)) {
        return {
          ...prev,
          dataCollectionTypes: prev.dataCollectionTypes.filter(t => t !== type)
        };
      } else {
        return {
          ...prev,
          dataCollectionTypes: [...prev.dataCollectionTypes, type]
        };
      }
    });
  };

  const renderPoliciesList = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Legal Policies</h2>
        <Button onClick={() => setActiveTab('generator')} icon={Plus}>
          Create New Policy
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading policies...</p>
        </div>
      ) : policies.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Policies Found</h3>
            <p className="text-gray-600 mb-6">
              You haven't created any privacy policies or terms of service yet.
            </p>
            <Button onClick={() => setActiveTab('generator')} icon={Plus}>
              Create Your First Policy
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {policies.map((policy) => (
            <Card key={policy.id} className="hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      policy.policy_type === 'privacy_policy' 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-purple-100 text-purple-600'
                    }`}>
                      {policy.policy_type === 'privacy_policy' ? (
                        <Lock className="h-5 w-5" />
                      ) : (
                        <FileText className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{policy.title}</h3>
                      <p className="text-sm text-gray-600">
                        Version {policy.version} • {new Date(policy.effective_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={policy.status === 'published' ? 'success' : 'neutral'}>
                      {policy.status}
                    </Badge>
                    <Badge variant="info">
                      {policy.compliance_score}% Compliant
                    </Badge>
                    {policy.blockchain_tx_id && (
                      <Badge variant="success">
                        Blockchain Verified
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {policy.jurisdictions?.map((jurisdiction: string) => (
                    <Badge key={jurisdiction} variant="neutral" size="sm">
                      {jurisdiction}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {policy.blockchain_tx_id ? (
                      <div className="flex items-center">
                        <Database className="h-4 w-4 mr-1" />
                        <span>Blockchain ID: {policy.blockchain_tx_id.substring(0, 8)}...</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Created {new Date(policy.created_at).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleViewPolicy(policy)}
                      icon={Eye}
                    >
                      View
                    </Button>
                    {policy.status !== 'published' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDeletePolicy(policy.id)}
                        icon={Trash2}
                      >
                        Delete
                      </Button>
                    )}
                    {!policy.blockchain_tx_id && policy.status === 'published' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setSelectedPolicy(policy);
                          setActiveTab('nft');
                        }}
                        icon={Shield}
                      >
                        Mint NFT
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {selectedPolicy && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{selectedPolicy.title}</CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant={selectedPolicy.status === 'published' ? 'success' : 'neutral'}>
                  {selectedPolicy.status}
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => downloadPolicy(
                    selectedPolicy.content_markdown, 
                    `${selectedPolicy.policy_type === 'privacy_policy' ? 'privacy-policy' : 'terms-of-service'}-v${selectedPolicy.version}.md`
                  )}
                  icon={Download}
                >
                  Download
                </Button>
              </div>
            </div>
          </CardHeader>
          <div className="p-6">
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Version:</span>
                  <span className="ml-2">{selectedPolicy.version}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Effective Date:</span>
                  <span className="ml-2">{new Date(selectedPolicy.effective_date).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Compliance Score:</span>
                  <span className="ml-2">{selectedPolicy.compliance_score}%</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Frameworks:</span>
                  <span className="ml-2">{selectedPolicy.jurisdictions?.join(', ')}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Created:</span>
                  <span className="ml-2">{new Date(selectedPolicy.created_at).toLocaleDateString()}</span>
                </div>
                {selectedPolicy.blockchain_tx_id && (
                  <div>
                    <span className="font-medium text-gray-700">Blockchain Verified:</span>
                    <span className="ml-2">Yes</span>
                  </div>
                )}
              </div>
            </div>

            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap bg-white p-6 border border-gray-200 rounded-lg">
                {selectedPolicy.content_markdown}
              </div>
            </div>

            {selectedPolicy.blockchain_tx_id && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Blockchain Verification</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-700">Transaction Hash:</span>
                    <div className="flex items-center space-x-2">
                      <code className="text-xs bg-white px-2 py-1 rounded border">
                        {selectedPolicy.blockchain_tx_id}
                      </code>
                      <button
                        onClick={() => copyToClipboard(selectedPolicy.blockchain_tx_id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {copiedText === selectedPolicy.blockchain_tx_id ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  {selectedPolicy.blockchain_hash && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-700">Content Hash:</span>
                      <div className="flex items-center space-x-2">
                        <code className="text-xs bg-white px-2 py-1 rounded border">
                          {selectedPolicy.blockchain_hash.substring(0, 16)}...
                        </code>
                        <button
                          onClick={() => copyToClipboard(selectedPolicy.blockchain_hash)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {copiedText === selectedPolicy.blockchain_hash ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                  {selectedPolicy.ipfs_hash && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-700">IPFS Hash:</span>
                      <div className="flex items-center space-x-2">
                        <code className="text-xs bg-white px-2 py-1 rounded border">
                          {selectedPolicy.ipfs_hash}
                        </code>
                        <button
                          onClick={() => copyToClipboard(selectedPolicy.ipfs_hash)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {copiedText === selectedPolicy.ipfs_hash ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      if (selectedPolicy.blockchain_tx_id) {
                        blockchainService.openExplorer({
                          ...selectedPolicy,
                          txHash: selectedPolicy.blockchain_tx_id,
                          blockchain: 'Algorand'
                        });
                      }
                    }}
                    icon={ExternalLink}
                    className="w-full"
                  >
                    View on Algorand Explorer
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Permission Error Display */}
      {error && error.includes('permission') && (
        <Card>
          <div className="p-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-900 mb-2">Permission Required</h4>
                  <p className="text-sm text-yellow-800 mb-3">
                    {error}
                  </p>
                  <p className="text-sm text-yellow-700">
                    To create and manage legal policies, you need to have either a 'compliance_officer' or 'executive' role. 
                    Please contact your administrator to update your role permissions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );

  const renderPolicyGenerator = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Policy Generator</h2>
        <Button variant="outline" onClick={() => setActiveTab('policies')} icon={ArrowRight}>
          Back to Policies
        </Button>
      </div>

      {/* Permission Check Warning */}
      {error && error.includes('permission') && (
        <Card>
          <div className="p-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-900 mb-2">Permission Required</h4>
                  <p className="text-sm text-yellow-800 mb-3">
                    {error}
                  </p>
                  <p className="text-sm text-yellow-700">
                    You can still generate policies for preview, but you'll need proper permissions to save them.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
        </CardHeader>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your Company Name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.businessType}
                onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Business Type</option>
                <option value="Technology">Technology</option>
                <option value="E-commerce">E-commerce</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Finance">Finance</option>
                <option value="Education">Education</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="contact@yourcompany.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Effective Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.effectiveDate}
                onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Compliance Requirements</CardTitle>
        </CardHeader>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <button
                  onClick={() => toggleComplianceRequirement('GDPR')}
                  className="flex-shrink-0 mt-0.5"
                >
                  {formData.complianceRequirements.includes('GDPR') ? (
                    <CheckSquare className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Square className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                <div>
                  <p className="font-medium text-gray-900">GDPR (European Union)</p>
                  <p className="text-sm text-gray-600">General Data Protection Regulation</p>
                  <button
                    className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                    onClick={() => alert('GDPR requirements would be shown here')}
                  >
                    View Requirements
                  </button>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <button
                  onClick={() => toggleComplianceRequirement('CCPA')}
                  className="flex-shrink-0 mt-0.5"
                >
                  {formData.complianceRequirements.includes('CCPA') ? (
                    <CheckSquare className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Square className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                <div>
                  <p className="font-medium text-gray-900">CCPA (California)</p>
                  <p className="text-sm text-gray-600">California Consumer Privacy Act</p>
                  <button
                    className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                    onClick={() => alert('CCPA requirements would be shown here')}
                  >
                    View Requirements
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <button
                  onClick={() => toggleComplianceRequirement('COPPA')}
                  className="flex-shrink-0 mt-0.5"
                >
                  {formData.complianceRequirements.includes('COPPA') ? (
                    <CheckSquare className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Square className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                <div>
                  <p className="font-medium text-gray-900">COPPA (United States)</p>
                  <p className="text-sm text-gray-600">Children's Online Privacy Protection Act</p>
                  <button
                    className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                    onClick={() => alert('COPPA requirements would be shown here')}
                  >
                    View Requirements
                  </button>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <button
                  onClick={() => toggleComplianceRequirement('PIPEDA')}
                  className="flex-shrink-0 mt-0.5"
                >
                  {formData.complianceRequirements.includes('PIPEDA') ? (
                    <CheckSquare className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Square className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                <div>
                  <p className="font-medium text-gray-900">PIPEDA (Canada)</p>
                  <p className="text-sm text-gray-600">Personal Information Protection and Electronic Documents Act</p>
                  <button
                    className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                    onClick={() => alert('PIPEDA requirements would be shown here')}
                  >
                    View Requirements
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Collection Types</CardTitle>
        </CardHeader>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: 'Personal Identifiers', desc: 'Name, email, phone number' },
              { id: 'Contact Information', desc: 'Address, phone, email' },
              { id: 'Usage Data', desc: 'Website analytics, user behavior' },
              { id: 'Device Information', desc: 'Browser, IP address, device type' },
              { id: 'Location Data', desc: 'GPS coordinates, approximate location' },
              { id: 'Financial Information', desc: 'Payment details, billing info' },
              { id: 'Health Information', desc: 'Medical records, health data' },
              { id: 'Biometric Data', desc: 'Fingerprints, facial recognition' },
              { id: 'Commercial Information', desc: 'Purchase history, preferences' },
              { id: 'Internet Activity', desc: 'Browsing history, search queries' }
            ].map((type) => (
              <div key={type.id} className="flex items-start space-x-3">
                <button
                  onClick={() => toggleDataCollectionType(type.id)}
                  className="flex-shrink-0 mt-0.5"
                >
                  {formData.dataCollectionTypes.includes(type.id) ? (
                    <CheckSquare className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Square className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                <div>
                  <p className="font-medium text-gray-900">{type.id}</p>
                  <p className="text-sm text-gray-600">{type.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Settings</CardTitle>
        </CardHeader>
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Retention Period
            </label>
            <div className="flex items-center">
              <input
                type="number"
                value={formData.retentionPeriod}
                onChange={(e) => setFormData({ ...formData, retentionPeriod: e.target.value })}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                max="10"
              />
              <span className="ml-2">years</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <button
                onClick={() => setFormData({ ...formData, childrenData: !formData.childrenData })}
                className="flex-shrink-0 mt-0.5"
              >
                {formData.childrenData ? (
                  <CheckSquare className="h-5 w-5 text-blue-600" />
                ) : (
                  <Square className="h-5 w-5 text-gray-400" />
                )}
              </button>
              <div>
                <p className="font-medium text-gray-900">Collect data from children under 13</p>
                <p className="text-sm text-gray-600">Requires COPPA compliance</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <button
                onClick={() => setFormData({ ...formData, processPayments: !formData.processPayments })}
                className="flex-shrink-0 mt-0.5"
              >
                {formData.processPayments ? (
                  <CheckSquare className="h-5 w-5 text-blue-600" />
                ) : (
                  <Square className="h-5 w-5 text-gray-400" />
                )}
              </button>
              <div>
                <p className="font-medium text-gray-900">Process payments</p>
                <p className="text-sm text-gray-600">Includes payment processing disclosures</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <button
                onClick={() => setFormData({ ...formData, useCookies: !formData.useCookies })}
                className="flex-shrink-0 mt-0.5"
              >
                {formData.useCookies ? (
                  <CheckSquare className="h-5 w-5 text-blue-600" />
                ) : (
                  <Square className="h-5 w-5 text-gray-400" />
                )}
              </button>
              <div>
                <p className="font-medium text-gray-900">Use cookies</p>
                <p className="text-sm text-gray-600">Includes cookie policy section</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <button
                onClick={() => setFormData({ ...formData, useAnalytics: !formData.useAnalytics })}
                className="flex-shrink-0 mt-0.5"
              >
                {formData.useAnalytics ? (
                  <CheckSquare className="h-5 w-5 text-blue-600" />
                ) : (
                  <Square className="h-5 w-5 text-gray-400" />
                )}
              </button>
              <div>
                <p className="font-medium text-gray-900">Use analytics</p>
                <p className="text-sm text-gray-600">Includes analytics tracking disclosures</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <button
                onClick={() => setFormData({ ...formData, sendMarketing: !formData.sendMarketing })}
                className="flex-shrink-0 mt-0.5"
              >
                {formData.sendMarketing ? (
                  <CheckSquare className="h-5 w-5 text-blue-600" />
                ) : (
                  <Square className="h-5 w-5 text-gray-400" />
                )}
              </button>
              <div>
                <p className="font-medium text-gray-900">Send marketing communications</p>
                <p className="text-sm text-gray-600">Includes marketing opt-out provisions</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => setActiveTab('policies')}
        >
          Cancel
        </Button>
        <div className="space-x-3">
          <Button 
            onClick={() => handleGeneratePolicy('privacy_policy')}
            loading={generating}
            disabled={generating || !formData.companyName || !formData.contactEmail}
          >
            Generate Privacy Policy
          </Button>
          <Button 
            onClick={() => handleGeneratePolicy('terms_of_service')}
            loading={generating}
            disabled={generating || !formData.companyName || !formData.contactEmail}
          >
            Generate Terms of Service
          </Button>
        </div>
      </div>

      {generatedPolicy && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Generated Policy Preview</CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant={generatedPolicy.complianceScore >= 95 ? 'success' : 'warning'}>
                  {generatedPolicy.complianceScore}% Compliant
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => downloadPolicy(
                    generatedPolicy.markdown, 
                    `${generatedPolicy.title.toLowerCase().replace(/\s+/g, '-')}-v${generatedPolicy.version}.md`
                  )}
                  icon={Download}
                >
                  Download
                </Button>
              </div>
            </div>
          </CardHeader>
          <div className="p-6 space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Title:</span>
                  <span className="ml-2">{generatedPolicy.title}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Version:</span>
                  <span className="ml-2">{generatedPolicy.version}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Effective Date:</span>
                  <span className="ml-2">{new Date(generatedPolicy.effectiveDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap bg-white p-6 border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
                {generatedPolicy.markdown}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Compliance Analysis</h4>
              <div className="space-y-3">
                {generatedPolicy.complianceDetails.map((detail) => (
                  <div key={detail.framework} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${
                        detail.score >= 95 ? 'bg-green-100 text-green-600' : 
                        detail.score >= 80 ? 'bg-yellow-100 text-yellow-600' : 
                        'bg-red-100 text-red-600'
                      }`}>
                        {detail.score >= 95 ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <AlertCircle className="h-4 w-4" />
                        )}
                      </div>
                      <span className="font-medium">{detail.framework}</span>
                    </div>
                    <Badge variant={detail.score >= 95 ? 'success' : detail.score >= 80 ? 'warning' : 'error'}>
                      {detail.score}%
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setGeneratedPolicy(null)}
              >
                Discard
              </Button>
              <Button 
                onClick={() => handleSavePolicy(
                  generatedPolicy.title.toLowerCase().includes('privacy') ? 'privacy_policy' : 'terms_of_service',
                  'draft'
                )}
                loading={saving}
                disabled={saving}
              >
                Save as Draft
              </Button>
              <Button 
                onClick={() => handleSavePolicy(
                  generatedPolicy.title.toLowerCase().includes('privacy') ? 'privacy_policy' : 'terms_of_service',
                  'published'
                )}
                loading={saving}
                disabled={saving}
              >
                Publish
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );

  const renderNFTMinting = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Blockchain NFT Minting</h2>
        <Button variant="outline" onClick={() => setActiveTab('policies')} icon={ArrowRight}>
          Back to Policies
        </Button>
      </div>

      {selectedPolicy ? (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Mint Policy as NFT</CardTitle>
              <Badge variant="info">
                {selectedPolicy.policy_type === 'privacy_policy' ? 'Privacy Policy' : 'Terms of Service'}
              </Badge>
            </div>
          </CardHeader>
          <div className="p-6 space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Layers className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Blockchain Verification</p>
                  <p className="text-sm text-blue-800">
                    Experience the perfect blend of innovation and security with Nodely. This will create an immutable record of your privacy policy on the Algorand blockchain, 
                    with metadata stored on IPFS. The NFT will be owned by your organization and can be 
                    verified by regulators.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Policy Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Title:</span>
                  <span className="ml-2">{selectedPolicy.title}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Version:</span>
                  <span className="ml-2">{selectedPolicy.version}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Effective Date:</span>
                  <span className="ml-2">{new Date(selectedPolicy.effective_date).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Status:</span>
                  <span className="ml-2">{selectedPolicy.status}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Frameworks:</span>
                  <span className="ml-2">{selectedPolicy.jurisdictions?.join(', ')}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Compliance Score:</span>
                  <span className="ml-2">{selectedPolicy.compliance_score}%</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">Blockchain Benefits</h4>
              <ul className="space-y-2 text-sm text-green-800">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Immutable proof of policy existence and content</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Verifiable timestamp for regulatory compliance</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Transparent version history for auditing</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Enhanced legal protection through cryptographic verification</span>
                </li>
              </ul>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {mintSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <p className="text-sm text-green-700">
                    Policy successfully minted as an NFT on the Algorand blockchain!
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setActiveTab('policies')}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleMintNFT}
                loading={minting}
                disabled={minting || mintSuccess}
                icon={Shield}
              >
                {minting ? 'Minting...' : 'Mint as NFT'}
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="text-center py-12">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Policy Selected</h3>
            <p className="text-gray-600 mb-6">
              Please select a published policy to mint as an NFT.
            </p>
            <Button onClick={() => setActiveTab('policies')}>
              View Policies
            </Button>
          </div>
        </Card>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Privacy & Terms Autopilot</h1>
          <p className="text-gray-600 mt-1">
            Generate, manage, and enforce privacy policies and terms of service
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className={`py-4 px-6 font-medium text-sm border-b-2 ${
            activeTab === 'policies'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
          onClick={() => setActiveTab('policies')}
        >
          Policies
        </button>
        <button
          className={`py-4 px-6 font-medium text-sm border-b-2 ${
            activeTab === 'generator'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
          onClick={() => setActiveTab('generator')}
        >
          Policy Generator
        </button>
        <button
          className={`py-4 px-6 font-medium text-sm border-b-2 ${
            activeTab === 'nft'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
          onClick={() => setActiveTab('nft')}
        >
          Blockchain NFT
        </button>
      </div>

      {/* Content */}
      {activeTab === 'policies' && renderPoliciesList()}
      {activeTab === 'generator' && renderPolicyGenerator()}
      {activeTab === 'nft' && renderNFTMinting()}
    </div>
  );
}