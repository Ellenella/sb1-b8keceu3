import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Plus, 
  Key, 
  Shield, 
  Activity, 
  Settings, 
  Copy, 
  Check, 
  Eye, 
  EyeOff,
  Trash2,
  Edit,
  AlertTriangle,
  Save,
  X
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

interface BotRegistration {
  id: string;
  name: string;
  description: string;
  apiKey: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  lastActivity: string;
  requestCount: number;
  blockedCount: number;
  complianceScore: number;
  rules: string[];
}

const mockBots: BotRegistration[] = [
  {
    id: 'bot_001',
    name: 'Customer Support Bot',
    description: 'Handles customer inquiries and support tickets',
    apiKey: 'eg_sk_live_abc123def456ghi789jkl012mno345pqr678stu901vwx234yz',
    status: 'active',
    createdAt: '2024-01-15T10:30:00Z',
    lastActivity: '2 minutes ago',
    requestCount: 15847,
    blockedCount: 234,
    complianceScore: 94.2,
    rules: ['Toxicity Detection', 'PII Protection', 'Bias Filter']
  },
  {
    id: 'bot_002',
    name: 'Content Moderation Bot',
    description: 'Moderates user-generated content and comments',
    apiKey: 'eg_sk_live_def456ghi789jkl012mno345pqr678stu901vwx234yz567abc',
    status: 'active',
    createdAt: '2024-01-10T14:20:00Z',
    lastActivity: '5 minutes ago',
    requestCount: 8934,
    blockedCount: 567,
    complianceScore: 91.8,
    rules: ['Toxicity Detection', 'Profanity Filter', 'Hate Speech Detection']
  },
  {
    id: 'bot_003',
    name: 'HR Assistant Bot',
    description: 'Assists with HR queries and job recommendations',
    apiKey: 'eg_sk_live_ghi789jkl012mno345pqr678stu901vwx234yz567abc123def',
    status: 'inactive',
    createdAt: '2024-01-05T09:15:00Z',
    lastActivity: '2 days ago',
    requestCount: 2156,
    blockedCount: 89,
    complianceScore: 96.5,
    rules: ['Bias Detection', 'Gender Bias Filter', 'Age Bias Filter']
  }
];

export function BotManagement() {
  const [bots, setBots] = useState<BotRegistration[]>(mockBots);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingBot, setEditingBot] = useState<string | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [copiedKey, setCopiedKey] = useState<string>('');
  const [newBot, setNewBot] = useState({
    name: '',
    description: '',
    rules: [] as string[]
  });
  const [editForm, setEditForm] = useState<Partial<BotRegistration>>({});

  const availableRules = [
    'Toxicity Detection',
    'Bias Detection', 
    'Gender Bias Filter',
    'Racial Bias Filter',
    'Age Bias Filter',
    'PII Protection',
    'Profanity Filter',
    'Hate Speech Detection',
    'Medical Advice Filter',
    'Financial Advice Filter'
  ];

  const toggleKeyVisibility = (botId: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(botId)) {
      newVisible.delete(botId);
    } else {
      newVisible.add(botId);
    }
    setVisibleKeys(newVisible);
  };

  const copyApiKey = (apiKey: string) => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(apiKey);
    setTimeout(() => setCopiedKey(''), 2000);
  };

  const generateApiKey = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'eg_sk_live_';
    for (let i = 0; i < 48; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleCreateBot = () => {
    if (!newBot.name.trim()) return;

    const bot: BotRegistration = {
      id: `bot_${Date.now()}`,
      name: newBot.name,
      description: newBot.description,
      apiKey: generateApiKey(),
      status: 'active',
      createdAt: new Date().toISOString(),
      lastActivity: 'Never',
      requestCount: 0,
      blockedCount: 0,
      complianceScore: 100,
      rules: newBot.rules
    };

    setBots([...bots, bot]);
    setNewBot({ name: '', description: '', rules: [] });
    setShowCreateModal(false);
  };

  const startEdit = (bot: BotRegistration) => {
    setEditingBot(bot.id);
    setEditForm({
      name: bot.name,
      description: bot.description,
      rules: [...bot.rules]
    });
  };

  const cancelEdit = () => {
    setEditingBot(null);
    setEditForm({});
  };

  const saveEdit = () => {
    if (!editingBot || !editForm.name?.trim()) return;

    setBots(bots.map(bot => 
      bot.id === editingBot 
        ? { 
            ...bot, 
            name: editForm.name!,
            description: editForm.description || '',
            rules: editForm.rules || []
          }
        : bot
    ));
    
    setEditingBot(null);
    setEditForm({});
  };

  const toggleBotStatus = (botId: string) => {
    setBots(bots.map(bot => 
      bot.id === botId 
        ? { ...bot, status: bot.status === 'active' ? 'inactive' : 'active' }
        : bot
    ));
  };

  const deleteBot = (botId: string) => {
    setBots(bots.filter(bot => bot.id !== botId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'neutral';
      case 'suspended': return 'error';
      default: return 'neutral';
    }
  };

  const maskApiKey = (key: string) => {
    return key.substring(0, 12) + '•'.repeat(20) + key.substring(key.length - 8);
  };

  const toggleRuleInEdit = (rule: string) => {
    const currentRules = editForm.rules || [];
    if (currentRules.includes(rule)) {
      setEditForm({
        ...editForm,
        rules: currentRules.filter(r => r !== rule)
      });
    } else {
      setEditForm({
        ...editForm,
        rules: [...currentRules, rule]
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bot Management</h1>
          <p className="text-gray-600 mt-1">Register and manage your AI bots with governance rules</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} icon={Plus}>
          Register New Bot
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bots</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{bots.length}</p>
            </div>
            <Bot className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Bots</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {bots.filter(bot => bot.status === 'active').length}
              </p>
            </div>
            <Activity className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {bots.reduce((sum, bot) => sum + bot.requestCount, 0).toLocaleString()}
              </p>
            </div>
            <Shield className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Compliance</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {Math.round(bots.reduce((sum, bot) => sum + bot.complianceScore, 0) / bots.length)}%
              </p>
            </div>
            <Check className="h-8 w-8 text-green-600" />
          </div>
        </Card>
      </div>

      {/* Bot List */}
      <div className="grid grid-cols-1 gap-6">
        {bots.map((bot) => (
          <Card key={bot.id}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4 flex-1">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Bot className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  {editingBot === bot.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editForm.name || ''}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="text-lg font-semibold text-gray-900 bg-white border border-gray-300 rounded px-2 py-1 w-full"
                        placeholder="Bot name"
                      />
                      <textarea
                        value={editForm.description || ''}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        className="text-sm text-gray-600 bg-white border border-gray-300 rounded px-2 py-1 w-full"
                        rows={2}
                        placeholder="Bot description"
                      />
                    </div>
                  ) : (
                    <>
                      <h3 className="text-lg font-semibold text-gray-900">{bot.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{bot.description}</p>
                    </>
                  )}
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>ID: {bot.id}</span>
                    <span>Created: {new Date(bot.createdAt).toLocaleDateString()}</span>
                    <span>Last Activity: {bot.lastActivity}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={getStatusColor(bot.status) as any}>
                  {bot.status}
                </Badge>
                {editingBot === bot.id ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={cancelEdit}
                      icon={X}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={saveEdit}
                      icon={Save}
                      disabled={!editForm.name?.trim()}
                    >
                      Save
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleBotStatus(bot.id)}
                    >
                      {bot.status === 'active' ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      icon={Edit}
                      onClick={() => startEdit(bot)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="danger" 
                      size="sm" 
                      icon={Trash2} 
                      onClick={() => deleteBot(bot.id)}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* API Key Section */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">API Key</label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleKeyVisibility(bot.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {visibleKeys.has(bot.id) ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => copyApiKey(bot.apiKey)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {copiedKey === bot.apiKey ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <code className="text-sm bg-white px-3 py-2 rounded border block">
                {visibleKeys.has(bot.id) ? bot.apiKey : maskApiKey(bot.apiKey)}
              </code>
            </div>

            {/* Stats and Rules */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Performance Metrics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Requests:</span>
                    <span className="font-medium">{bot.requestCount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Blocked Requests:</span>
                    <span className="font-medium text-red-600">{bot.blockedCount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Block Rate:</span>
                    <span className="font-medium">
                      {bot.requestCount > 0 ? ((bot.blockedCount / bot.requestCount) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Compliance Score:</span>
                    <span className="font-medium text-green-600">{bot.complianceScore}%</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Active Rules</h4>
                {editingBot === bot.id ? (
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {availableRules.map((rule) => (
                      <label key={rule} className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={(editForm.rules || []).includes(rule)}
                          onChange={() => toggleRuleInEdit(rule)}
                          className="mr-2"
                        />
                        <span className="text-gray-700">{rule}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {bot.rules.map((rule, index) => (
                      <Badge key={index} variant="info" size="sm">
                        {rule}
                      </Badge>
                    ))}
                    {bot.rules.length === 0 && (
                      <span className="text-sm text-gray-500">No rules configured</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Bot Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Register New Bot</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bot Name</label>
                <input
                  type="text"
                  value={newBot.name}
                  onChange={(e) => setNewBot({ ...newBot, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter bot name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newBot.description}
                  onChange={(e) => setNewBot({ ...newBot, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describe what this bot does"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Governance Rules</label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {availableRules.map((rule) => (
                    <label key={rule} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newBot.rules.includes(rule)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewBot({ ...newBot, rules: [...newBot.rules, rule] });
                          } else {
                            setNewBot({ ...newBot, rules: newBot.rules.filter(r => r !== rule) });
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">{rule}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateBot} disabled={!newBot.name.trim()}>
                Register Bot
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Integration Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Guide</CardTitle>
          <p className="text-sm text-gray-600">How to integrate your bot with EthicGuard AI Firewall</p>
        </CardHeader>
        <div className="space-y-4">
          <div className="bg-gray-900 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">1. Install the SDK</h4>
            <code className="text-green-400 text-sm block">npm install @ethicguard/ai-firewall</code>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">2. Initialize the Client</h4>
            <pre className="text-green-400 text-sm overflow-x-auto">
{`const { EthicGuardFirewall } = require('@ethicguard/ai-firewall');

const firewall = new EthicGuardFirewall({
  apiKey: 'your-api-key-here',
  environment: 'production'
});`}
            </pre>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">3. Protect Your AI Calls</h4>
            <pre className="text-green-400 text-sm overflow-x-auto">
{`const response = await firewall.shield({
  prompt: userInput,
  userId: 'user-123',
  sessionId: 'session-456'
});

if (response.blocked) {
  console.log('Request blocked:', response.reason);
  return response.suggestedResponse;
}

// Proceed with your AI call
const aiResponse = await yourAIProvider.generate(userInput);

// Log the response for monitoring
await firewall.logResponse({
  prompt: userInput,
  response: aiResponse,
  userId: 'user-123'
});`}
            </pre>
          </div>
        </div>
      </Card>
    </div>
  );
}