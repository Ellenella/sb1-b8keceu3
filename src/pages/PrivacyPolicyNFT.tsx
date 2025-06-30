import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  FileText, 
  Check, 
  Copy, 
  Download, 
  ExternalLink, 
  Clock, 
  Hash, 
  Globe, 
  Users, 
  Layers,
  Verified,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { blockchainService, PolicyNFTMetadata } from '../services/blockchainService';

export function PrivacyPolicyNFT() {
  const [loading, setLoading] = useState(false);
  const [minting, setMinting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mintedRecord, setMintedRecord] = useState<any>(null);
  const [copiedHash, setCopiedHash] = useState('');
  
  // Policy data
  const [policyData, setPolicyData] = useState({
    policyText: `# EthicGuard Privacy Policy

## 1. Introduction

EthicGuard ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI governance platform.

## 2. Information We Collect

We collect the following types of information:

### 2.1 Personal Information
- Contact information (name, email address, phone number)
- Account credentials
- Company information
- Payment information

### 2.2 AI Interaction Data
- AI prompts and responses (hashed for privacy)
- Content analysis results
- Compliance metrics and scores

### 2.3 Usage Information
- Log data and analytics
- Device information
- IP address and location data

## 3. How We Use Your Information

We use your information for the following purposes:
- Providing and maintaining our services
- Processing transactions
- Sending service notifications
- Improving our services
- Compliance with legal obligations

## 4. Data Retention

We retain your information for as long as your account is active or as needed to provide services, comply with legal obligations, resolve disputes, and enforce agreements.

## 5. Data Security

We implement appropriate technical and organizational measures to protect your information against unauthorized access, alteration, disclosure, or destruction.

## 6. Your Rights

Depending on your location, you may have rights regarding your personal information, including:
- Access to your data
- Correction of inaccurate data
- Deletion of your data
- Restriction of processing
- Data portability
- Objection to processing

## 7. International Transfers

Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place for such transfers.

## 8. Changes to This Policy

We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.

## 9. Contact Us

If you have questions about this Privacy Policy, please contact us at:
- Email: privacy@ethicguard.com
- Address: 123 Compliance Street, San Francisco, CA 94105

Last Updated: June 15, 2024
Version: 3.0`,
    version: '3.0',
    companyIdentifier: 'EthicGuard Inc.',
    jurisdiction: 'Global (US, EU, UK)',
    complianceFrameworks: ['GDPR', 'CCPA', 'HIPAA', 'PIPEDA'],
    authorizedSigners: ['John Smith (CEO)', 'Jane Doe (DPO)']
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(''), 2000);
  };

  const mintPolicyNFT = async () => {
    try {
      setMinting(true);
      setError(null);
      
      // Prepare metadata
      const metadata: Omit<PolicyNFTMetadata, 'policyHash'> = {
        policyVersion: policyData.version,
        timestamp: new Date().toISOString(),
        companyIdentifier: policyData.companyIdentifier,
        jurisdiction: policyData.jurisdiction,
        complianceFrameworks: policyData.complianceFrameworks,
        authorizedSigners: policyData.authorizedSigners
      };
      
      // Mint NFT
      const record = await blockchainService.mintPolicyNFT(policyData.policyText, metadata);
      
      // Set success state
      setMintedRecord(record);
      setSuccess(true);
      
    } catch (err) {
      console.error('Error minting policy NFT:', err);
      setError(err instanceof Error ? err.message : 'Failed to mint policy NFT');
    } finally {
      setMinting(false);
    }
  };

  const downloadPolicy = () => {
    const blob = new Blob([policyData.policyText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `privacy-policy-v${policyData.version}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const resetForm = () => {
    setSuccess(false);
    setMintedRecord(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Privacy Policy NFT Minting</h1>
          <p className="text-gray-600 mt-1">
            Create an immutable blockchain record of your privacy policy
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Policy Editor */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Privacy Policy Document
              </CardTitle>
            </CardHeader>
            <div className="p-6 space-y-4">
              {!success ? (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-2">
                      <label className="text-sm font-medium text-gray-700">Version:</label>
                      <input
                        type="text"
                        value={policyData.version}
                        onChange={(e) => setPolicyData({...policyData, version: e.target.value})}
                        className="px-2 py-1 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                    <Button variant="outline" size="sm" onClick={downloadPolicy} icon={Download}>
                      Download
                    </Button>
                  </div>
                  
                  <textarea
                    value={policyData.policyText}
                    onChange={(e) => setPolicyData({...policyData, policyText: e.target.value})}
                    className="w-full h-[500px] p-4 border border-gray-300 rounded-lg font-mono text-sm"
                  />
                </>
              ) : (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-green-900">NFT Successfully Minted</p>
                        <p className="text-sm text-green-800">
                          Your privacy policy has been successfully recorded on the Algorand blockchain
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3">Transaction Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Transaction Hash:</span>
                        <div className="flex items-center space-x-2">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {mintedRecord?.txHash.substring(0, 16)}...
                          </code>
                          <button
                            onClick={() => copyToClipboard(mintedRecord?.txHash)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {copiedHash === mintedRecord?.txHash ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Block Height:</span>
                        <span className="text-sm font-medium">{mintedRecord?.blockHeight.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Token ID:</span>
                        <span className="text-sm font-medium">{mintedRecord?.metadata.tokenId}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Contract Address:</span>
                        <div className="flex items-center space-x-2">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {mintedRecord?.metadata.contractAddress.substring(0, 16)}...
                          </code>
                          <button
                            onClick={() => copyToClipboard(mintedRecord?.metadata.contractAddress)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {copiedHash === mintedRecord?.metadata.contractAddress ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">IPFS Hash:</span>
                        <div className="flex items-center space-x-2">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {mintedRecord?.metadata.ipfsHash.substring(0, 16)}...
                          </code>
                          <button
                            onClick={() => copyToClipboard(mintedRecord?.metadata.ipfsHash)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {copiedHash === mintedRecord?.metadata.ipfsHash ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={() => blockchainService.openExplorer(mintedRecord)}
                      icon={ExternalLink}
                    >
                      View on Algorand Explorer
                    </Button>
                    <Button onClick={resetForm}>
                      Mint Another Policy
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column - Metadata & Actions */}
        <div className="space-y-6">
          {!success ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lock className="h-5 w-5 mr-2" />
                    Policy Metadata
                  </CardTitle>
                </CardHeader>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Identifier
                    </label>
                    <input
                      type="text"
                      value={policyData.companyIdentifier}
                      onChange={(e) => setPolicyData({...policyData, companyIdentifier: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Jurisdiction
                    </label>
                    <input
                      type="text"
                      value={policyData.jurisdiction}
                      onChange={(e) => setPolicyData({...policyData, jurisdiction: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Compliance Frameworks
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {policyData.complianceFrameworks.map((framework, index) => (
                        <Badge key={index} variant="info">
                          {framework}
                          <button
                            onClick={() => {
                              const newFrameworks = [...policyData.complianceFrameworks];
                              newFrameworks.splice(index, 1);
                              setPolicyData({...policyData, complianceFrameworks: newFrameworks});
                            }}
                            className="ml-1 text-blue-700 hover:text-blue-900"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex">
                      <input
                        type="text"
                        placeholder="Add framework (e.g., GDPR)"
                        id="framework-input"
                        className="w-full px-3 py-2 border border-gray-300 rounded-l-lg"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const input = document.getElementById('framework-input') as HTMLInputElement;
                            if (input.value.trim()) {
                              setPolicyData({
                                ...policyData, 
                                complianceFrameworks: [...policyData.complianceFrameworks, input.value.trim()]
                              });
                              input.value = '';
                            }
                          }
                        }}
                      />
                      <button
                        className="px-3 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
                        onClick={() => {
                          const input = document.getElementById('framework-input') as HTMLInputElement;
                          if (input.value.trim()) {
                            setPolicyData({
                              ...policyData, 
                              complianceFrameworks: [...policyData.complianceFrameworks, input.value.trim()]
                            });
                            input.value = '';
                          }
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Authorized Signers
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {policyData.authorizedSigners.map((signer, index) => (
                        <Badge key={index} variant="neutral">
                          {signer}
                          <button
                            onClick={() => {
                              const newSigners = [...policyData.authorizedSigners];
                              newSigners.splice(index, 1);
                              setPolicyData({...policyData, authorizedSigners: newSigners});
                            }}
                            className="ml-1 text-gray-700 hover:text-gray-900"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex">
                      <input
                        type="text"
                        placeholder="Add signer (e.g., John Smith, CEO)"
                        id="signer-input"
                        className="w-full px-3 py-2 border border-gray-300 rounded-l-lg"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const input = document.getElementById('signer-input') as HTMLInputElement;
                            if (input.value.trim()) {
                              setPolicyData({
                                ...policyData, 
                                authorizedSigners: [...policyData.authorizedSigners, input.value.trim()]
                              });
                              input.value = '';
                            }
                          }
                        }}
                      />
                      <button
                        className="px-3 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
                        onClick={() => {
                          const input = document.getElementById('signer-input') as HTMLInputElement;
                          if (input.value.trim()) {
                            setPolicyData({
                              ...policyData, 
                              authorizedSigners: [...policyData.authorizedSigners, input.value.trim()]
                            });
                            input.value = '';
                          }
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Layers className="h-5 w-5 mr-2" />
                    Blockchain Configuration
                  </CardTitle>
                </CardHeader>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Blockchain Network</span>
                    <Badge variant="info">Algorand</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">NFT Standard</span>
                    <Badge variant="neutral">Algorand ASA</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">IPFS Storage</span>
                    <Badge variant="success">Enabled</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Access Control</span>
                    <Badge variant="info">Regulatory Access</Badge>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">Blockchain Record</p>
                        <p className="text-sm text-blue-800">
                          This will create an immutable record of your privacy policy on the Algorand blockchain, 
                          with metadata stored on IPFS. The NFT will be owned by your organization and can be 
                          verified by regulators.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card>
                <div className="p-6">
                  <Button 
                    className="w-full" 
                    onClick={mintPolicyNFT}
                    loading={minting}
                    disabled={minting}
                  >
                    {minting ? 'Minting NFT...' : 'Mint Privacy Policy NFT'}
                  </Button>
                  
                  {error && (
                    <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Verified className="h-5 w-5 mr-2" />
                  Verification Details
                </CardTitle>
              </CardHeader>
              <div className="p-6 space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-medium text-green-900 mb-2">NFT Verification</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-green-700">Policy Version:</span>
                      <span className="font-medium text-green-900">v{policyData.version}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-green-700">Timestamp:</span>
                      <span className="font-medium text-green-900">{new Date().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-green-700">Blockchain:</span>
                      <span className="font-medium text-green-900">Algorand</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-green-700">Verification Status:</span>
                      <span className="font-medium text-green-900">Verified ✓</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900">Compliance Frameworks</h3>
                  <div className="flex flex-wrap gap-2">
                    {policyData.complianceFrameworks.map((framework, index) => (
                      <Badge key={index} variant="info">{framework}</Badge>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900">Authorized Signers</h3>
                  <div className="flex flex-wrap gap-2">
                    {policyData.authorizedSigners.map((signer, index) => (
                      <Badge key={index} variant="neutral">{signer}</Badge>
                    ))}
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Regulatory Access</p>
                      <p className="text-sm text-blue-800">
                        Regulators can verify this policy using the Verification Portal in the Audit Trail section.
                      </p>
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={downloadPolicy} 
                  icon={Download}
                >
                  Download Verified Policy
                </Button>
              </div>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Automated Minting
              </CardTitle>
            </CardHeader>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Auto-Update Frequency</span>
                <select className="px-2 py-1 border border-gray-300 rounded-md text-sm">
                  <option>On Every Change</option>
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Notification Recipients</span>
                <Badge variant="info">3 Stakeholders</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Version Control</span>
                <Badge variant="success">Enabled</Badge>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-900">Automated Minting</p>
                    <p className="text-sm text-yellow-800">
                      Automated minting will create a new NFT whenever your privacy policy is updated, 
                      ensuring a complete audit trail of all changes.
                    </p>
                  </div>
                </div>
              </div>
              
              <Button variant="outline" className="w-full">
                Configure Automation
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}