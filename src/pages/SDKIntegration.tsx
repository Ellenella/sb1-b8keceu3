import React, { useState } from 'react';
import { Code, Copy, Check, ExternalLink, Book, Shield, Zap, Globe, Key, Settings, Info, Package, X, Eye, EyeOff } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

interface CodeExample {
  id: string;
  title: string;
  description: string;
  language: string;
  code: string;
  category: 'installation' | 'basic' | 'integration';
}

interface SDKFeature {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}

export function SDKIntegration() {
  const [activeTab, setActiveTab] = useState('overview');
  const [copiedCode, setCopiedCode] = useState('');
  const [selectedExample, setSelectedExample] = useState<CodeExample | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey] = useState('eg_sk_live_abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567abc123def');
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkModalContent, setLinkModalContent] = useState({ title: '', message: '', url: '' });
  const [showInstallModal, setShowInstallModal] = useState(false);

  // Repository and package information
  const repoInfo = {
    owner: 'ethicguard',
    repo: 'ai-firewall-nodejs',
    packageName: '@ethicguard/ai-firewall'
  };

  const showLinkInfo = (title: string, message: string, url: string) => {
    setLinkModalContent({ title, message, url });
    setShowLinkModal(true);
  };

  const openGitHub = () => {
    showLinkInfo(
      'GitHub Repository',
      'In production, this would open the EthicGuard AI Firewall GitHub repository with source code, documentation, and issue tracking.',
      `https://github.com/${repoInfo.owner}/${repoInfo.repo}`
    );
  };

  const openNPM = () => {
    showLinkInfo(
      'NPM Package',
      'In production, this would open the NPM package page with installation instructions, version history, and package details.',
      `https://www.npmjs.com/package/${repoInfo.packageName}`
    );
  };

  const openDocs = () => {
    showLinkInfo(
      'API Documentation',
      'In production, this would open the comprehensive API documentation with detailed guides, examples, and reference materials.',
      'https://docs.ethicguard.com/sdk/nodejs'
    );
  };

  const handleNpmInstall = () => {
    setShowInstallModal(true);
  };

  const copyInstallCommand = (command: string) => {
    navigator.clipboard.writeText(command);
    setCopiedCode(command);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const sdkFeatures: SDKFeature[] = [
    {
      icon: Shield,
      title: 'Real-time AI Protection',
      description: 'Block toxic content, bias, and hallucinations',
      color: 'bg-red-100 text-red-600'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Fast detection latency with edge infrastructure and intelligent caching',
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      icon: Globe,
      title: 'Universal Integration',
      description: 'Works with OpenAI, Anthropic, Hugging Face, and any AI provider or custom model',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Key,
      title: 'Privacy First',
      description: 'Content hashing ensures your data never leaves your infrastructure',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: Settings,
      title: 'Configurable Rules',
      description: 'Custom thresholds, severity levels, and governance policies for your use case',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: Shield,
      title: 'Compliance Ready',
      description: 'Compliant with automated audit trails and reporting',
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  const codeExamples: CodeExample[] = [
    {
      id: 'install',
      title: 'Installation',
      description: 'Install the EthicGuard AI Firewall SDK',
      language: 'bash',
      category: 'installation',
      code: `# Install via npm
npm install ${repoInfo.packageName}

# Install via yarn
yarn add ${repoInfo.packageName}

# Verify installation
node -e "console.log(require('${repoInfo.packageName}').version)"`
    },
    {
      id: 'basic-setup',
      title: 'Basic Setup',
      description: 'Initialize the EthicGuard client with your API key',
      language: 'javascript',
      category: 'basic',
      code: `const { EthicGuardFirewall } = require('${repoInfo.packageName}');

// Initialize with your API key
const firewall = new EthicGuardFirewall({
  apiKey: process.env.ETHICGUARD_API_KEY,
  environment: 'production'
});

// Health check
const health = await firewall.healthCheck();
console.log('EthicGuard Status:', health.status);`
    },
    {
      id: 'shield-content',
      title: 'Shield AI Content',
      description: 'Protect your AI interactions with real-time content analysis',
      language: 'javascript',
      category: 'basic',
      code: `// Shield a user prompt before sending to AI
const result = await firewall.shield({
  prompt: userInput,
  userId: 'user-123',
  sessionId: 'session-456',
  applicationId: 'my-chat-app'
});

if (result.blocked) {
  console.log('Content blocked:', result.reason);
  console.log('Severity:', result.severity);
  
  // Use suggested safe response
  return result.suggestedResponse;
}

// Safe to proceed with AI call
const aiResponse = await yourAIProvider.generate(userInput);

// Log the response for compliance
await firewall.logResponse({
  prompt: userInput,
  response: aiResponse,
  userId: 'user-123'
});`
    },
    {
      id: 'openai-integration',
      title: 'OpenAI Integration',
      description: 'Complete integration with OpenAI GPT models',
      language: 'javascript',
      category: 'integration',
      code: `const OpenAI = require('openai');
const { EthicGuardFirewall } = require('${repoInfo.packageName}');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const firewall = new EthicGuardFirewall({ apiKey: process.env.ETHICGUARD_API_KEY });

async function protectedChat(messages, userId) {
  const userMessage = messages[messages.length - 1].content;
  
  // Shield the input
  const shieldResult = await firewall.shield({
    prompt: userMessage,
    userId,
    applicationId: 'openai-chat'
  });
  
  if (shieldResult.blocked) {
    return {
      blocked: true,
      reason: shieldResult.reason,
      suggestedResponse: shieldResult.suggestedResponse
    };
  }
  
  // Call OpenAI
  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: messages
  });
  
  const response = completion.choices[0].message.content;
  
  // Log for compliance
  await firewall.logResponse({
    prompt: userMessage,
    response: response,
    userId,
    applicationId: 'openai-chat'
  });
  
  return {
    blocked: false,
    response: response
  };
}`
    },
    {
      id: 'express-middleware',
      title: 'Express.js Middleware',
      description: 'Automatic protection for all AI endpoints',
      language: 'javascript',
      category: 'integration',
      code: `const express = require('express');
const { EthicGuardFirewall } = require('${repoInfo.packageName}');

const app = express();
const firewall = new EthicGuardFirewall({
  apiKey: process.env.ETHICGUARD_API_KEY
});

// Automatic protection for all AI endpoints
app.use('/api/ai', firewall.middleware());

app.post('/api/ai/chat', async (req, res) => {
  // Middleware already checked req.body.prompt
  // req.ethicguard contains shield results
  
  if (req.ethicguard?.blocked) {
    return res.status(400).json({
      error: 'Content blocked',
      reason: req.ethicguard.reason,
      suggestedResponse: req.ethicguard.suggestedResponse
    });
  }
  
  const aiResponse = await generateResponse(req.body.prompt);
  
  await firewall.logResponse({
    prompt: req.body.prompt,
    response: aiResponse,
    userId: req.body.userId
  });
  
  res.json({ response: aiResponse });
});`
    },
    {
      id: 'anthropic-integration',
      title: 'Anthropic Claude Integration',
      description: 'Protect Claude interactions with advanced bias detection',
      language: 'javascript',
      category: 'integration',
      code: `const Anthropic = require('@anthropic-ai/sdk');
const { EthicGuardFirewall } = require('${repoInfo.packageName}');

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const firewall = new EthicGuardFirewall({ apiKey: process.env.ETHICGUARD_API_KEY });

async function protectedClaude(prompt, userId) {
  // Shield the prompt
  const shieldResult = await firewall.shield({
    prompt,
    userId,
    applicationId: 'claude-chat'
  });
  
  if (shieldResult.blocked) {
    return { 
      blocked: true, 
      reason: shieldResult.reason,
      suggestedResponse: shieldResult.suggestedResponse
    };
  }
  
  // Call Claude
  const message = await anthropic.messages.create({
    model: 'claude-3-sonnet-20240229',
    max_tokens: 1000,
    messages: [{ role: 'user', content: prompt }]
  });
  
  const response = message.content[0].text;
  
  // Log for monitoring
  await firewall.logResponse({
    prompt,
    response,
    userId,
    applicationId: 'claude-chat'
  });
  
  return { 
    blocked: false, 
    response
  };
}`
    }
  ];

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const filteredExamples = activeTab === 'overview' 
    ? codeExamples 
    : codeExamples.filter(example => example.category === activeTab);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="h-16 w-16 bg-blue-600 rounded-xl flex items-center justify-center mr-4">
            <Code className="h-8 w-8 text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-3xl font-bold text-gray-900">EthicGuard AI Firewall SDK</h1>
            <p className="text-lg text-gray-600">Real-time AI governance for Node.js applications</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-4 mb-6">
          <Badge variant="success">v1.0.0</Badge>
          <Badge variant="info">Production Ready</Badge>
          <Badge variant="neutral">MIT License</Badge>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            icon={Package} 
            size="lg"
            onClick={handleNpmInstall}
          >
            npm install {repoInfo.packageName}
          </Button>
          <Button 
            variant="outline" 
            icon={Code} 
            size="lg"
            onClick={openGitHub}
          >
            View on GitHub
          </Button>
          <Button 
            variant="outline" 
            icon={Book} 
            size="lg"
            onClick={openDocs}
          >
            API Documentation
          </Button>
        </div>
      </div>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>Key Features</CardTitle>
          <p className="text-sm text-gray-600">
            Comprehensive AI governance
          </p>
        </CardHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sdkFeatures.map((feature, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className={`h-12 w-12 ${feature.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Start */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Start</CardTitle>
          <p className="text-sm text-gray-600">Get started with EthicGuard in under 5 minutes</p>
        </CardHeader>
        <div className="space-y-6">
          {/* API Key Setup */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-blue-900">1. Get Your API Key</h4>
              <Badge variant="info">Required</Badge>
            </div>
            <p className="text-blue-800 text-sm mb-3">
              Your API key is already generated and ready to use:
            </p>
            <div className="flex items-center space-x-2">
              <code className="flex-1 bg-white px-3 py-2 rounded border text-sm">
                {showApiKey ? apiKey : apiKey.substring(0, 20) + '•'.repeat(20) + apiKey.substring(apiKey.length - 8)}
              </code>
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="p-2 text-blue-600 hover:text-blue-700"
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              <button
                onClick={() => copyToClipboard(apiKey)}
                className="p-2 text-blue-600 hover:text-blue-700"
              >
                {copiedCode === apiKey ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Installation */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900">2. Install the SDK</h4>
              <Badge variant="neutral">npm</Badge>
            </div>
            <div className="bg-gray-900 rounded-lg p-3 flex items-center justify-between">
              <code className="text-green-400 text-sm">npm install {repoInfo.packageName}</code>
              <button
                onClick={() => copyInstallCommand(`npm install ${repoInfo.packageName}`)}
                className="ml-3 p-1 text-gray-400 hover:text-white"
              >
                {copiedCode === `npm install ${repoInfo.packageName}` ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Basic Usage */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-green-900">3. Start Protecting Your AI</h4>
              <Badge variant="success">Ready</Badge>
            </div>
            <div className="bg-gray-900 rounded-lg p-3 overflow-x-auto">
              <pre className="text-green-400 text-sm">
{`const { EthicGuardFirewall } = require('${repoInfo.packageName}');

const firewall = new EthicGuardFirewall({
  apiKey: '${apiKey.substring(0, 20)}...',
  environment: 'production'
});

// Protect your AI calls
const result = await firewall.shield({
  prompt: userInput,
  userId: 'user-123'
});

if (result.blocked) {
  console.log('Blocked:', result.reason);
} else {
  // Safe to proceed with AI
}`}
              </pre>
            </div>
          </div>
        </div>
      </Card>

      {/* Code Examples */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Code Examples</CardTitle>
              <p className="text-sm text-gray-600">
                Complete integration examples for popular AI providers and frameworks
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-500">{repoInfo.packageName}</span>
            </div>
          </div>
        </CardHeader>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'All Examples', count: codeExamples.length },
              { id: 'installation', label: 'Installation', count: codeExamples.filter(e => e.category === 'installation').length },
              { id: 'basic', label: 'Basic Usage', count: codeExamples.filter(e => e.category === 'basic').length },
              { id: 'integration', label: 'Integrations', count: codeExamples.filter(e => e.category === 'integration').length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Examples Grid */}
        <div className="grid grid-cols-1 gap-6">
          {filteredExamples.map((example) => (
            <div key={example.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{example.title}</h4>
                    <p className="text-sm text-gray-600">{example.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="neutral" size="sm">{example.language}</Badge>
                    <button
                      onClick={() => copyToClipboard(example.code)}
                      className="p-1 text-gray-500 hover:text-gray-700"
                    >
                      {copiedCode === example.code ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => setSelectedExample(example)}
                      className="p-1 text-gray-500 hover:text-gray-700"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="bg-gray-900 p-4 overflow-x-auto">
                <pre className="text-green-400 text-sm">
                  <code>{example.code}</code>
                </pre>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* NPM Install Modal */}
      {showInstallModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Install EthicGuard SDK</h2>
              <button
                onClick={() => setShowInstallModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Package className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">NPM Package</p>
                    <p className="text-sm text-blue-800 mt-1">
                      Install the EthicGuard AI Firewall SDK using your preferred package manager.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">NPM</p>
                  <div className="bg-gray-900 rounded-lg p-3 flex items-center justify-between">
                    <code className="text-green-400 text-sm">npm install {repoInfo.packageName}</code>
                    <button
                      onClick={() => copyInstallCommand(`npm install ${repoInfo.packageName}`)}
                      className="ml-3 p-1 text-gray-400 hover:text-white"
                    >
                      {copiedCode === `npm install ${repoInfo.packageName}` ? (
                        <Check className="h-4 w-4 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Yarn</p>
                  <div className="bg-gray-900 rounded-lg p-3 flex items-center justify-between">
                    <code className="text-green-400 text-sm">yarn add {repoInfo.packageName}</code>
                    <button
                      onClick={() => copyInstallCommand(`yarn add ${repoInfo.packageName}`)}
                      className="ml-3 p-1 text-gray-400 hover:text-white"
                    >
                      {copiedCode === `yarn add ${repoInfo.packageName}` ? (
                        <Check className="h-4 w-4 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">pnpm</p>
                  <div className="bg-gray-900 rounded-lg p-3 flex items-center justify-between">
                    <code className="text-green-400 text-sm">pnpm add {repoInfo.packageName}</code>
                    <button
                      onClick={() => copyInstallCommand(`pnpm add ${repoInfo.packageName}`)}
                      className="ml-3 p-1 text-gray-400 hover:text-white"
                    >
                      {copiedCode === `pnpm add ${repoInfo.packageName}` ? (
                        <Check className="h-4 w-4 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900">Next Steps</p>
                    <p className="text-sm text-green-800 mt-1">
                      After installation, check the Quick Start guide below to begin protecting your AI applications.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setShowInstallModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Link Info Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">{linkModalContent.title}</h2>
              <button
                onClick={() => setShowLinkModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Demo Mode</p>
                    <p className="text-sm text-blue-800 mt-1">
                      {linkModalContent.message}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm font-medium text-gray-700 mb-2">Production URL:</p>
                <code className="text-sm text-gray-600 break-all">
                  {linkModalContent.url}
                </code>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900">Available in Production</p>
                    <p className="text-sm text-green-800 mt-1">
                      This link will work when the EthicGuard platform is deployed to production.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={() => copyToClipboard(linkModalContent.url)}
                icon={Copy}
              >
                Copy URL
              </Button>
              <Button onClick={() => setShowLinkModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Example Detail Modal */}
      {selectedExample && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedExample.title}</h2>
                <p className="text-gray-600">{selectedExample.description}</p>
              </div>
              <button
                onClick={() => setSelectedExample(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <div className="flex justify-between items-center mb-4">
                <Badge variant="neutral">{selectedExample.language}</Badge>
                <button
                  onClick={() => copyToClipboard(selectedExample.code)}
                  className="flex items-center space-x-2 text-gray-400 hover:text-white"
                >
                  {copiedCode === selectedExample.code ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  <span className="text-sm">Copy</span>
                </button>
              </div>
              <pre className="text-green-400 text-sm">
                <code>{selectedExample.code}</code>
              </pre>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setSelectedExample(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}