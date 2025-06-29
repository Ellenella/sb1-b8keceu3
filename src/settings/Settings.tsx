import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Key, 
  Save, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  AlertTriangle, 
  Trash2, 
  Plus, 
  X
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';

interface SettingsSection {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
}

interface APIKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
  permissions: string[];
  status: 'active' | 'inactive';
}

export function Settings() {
  const { profile } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [copiedKey, setCopiedKey] = useState('');
  const [showCreateKeyModal, setShowCreateKeyModal] = useState(false);
  const [newKeyData, setNewKeyData] = useState({
    name: '',
    permissions: [] as string[]
  });

  // Profile settings with validation
  const [profileData, setProfileData] = useState({
    fullName: profile?.full_name || '',
    email: profile?.email || '',
    role: profile?.role || 'developer',
    department: 'Engineering',
    location: 'San Francisco, CA',
    timezone: 'America/Los_Angeles',
    phone: '+1 (555) 123-4567',
    bio: 'Passionate about AI governance and ethical technology development.',
  });

  const [validationErrors, setValidationErrors] = useState({
    fullName: '',
    email: ''
  });

  // API Keys
  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: 'key_001',
      name: 'Production API Key',
      key: 'eg_sk_live_abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567abc123def',
      created: '2024-01-15',
      lastUsed: '2 hours ago',
      permissions: ['shield', 'log', 'reports'],
      status: 'active'
    }
  ]);

  const availablePermissions = [
    { id: 'shield', name: 'Shield Content', description: 'Analyze and block harmful content' },
    { id: 'log', name: 'Log Responses', description: 'Log AI interactions for compliance' },
    { id: 'reports', name: 'Generate Reports', description: 'Access compliance and analytics reports' },
    { id: 'bias', name: 'Bias Detection', description: 'Detect bias in AI outputs' },
    { id: 'toxicity', name: 'Toxicity Detection', description: 'Detect toxic content' }
  ];

  const settingsSections: SettingsSection[] = [
    {
      id: 'profile',
      title: 'Profile & Account',
      icon: User,
      description: 'Manage your personal information and account details'
    },
    {
      id: 'api-keys',
      title: 'API Keys',
      icon: Key,
      description: 'Create and manage API keys for SDK integration'
    }
  ];

  // Validation
  const validateForm = () => {
    const errors = {
      fullName: '',
      email: ''
    };

    if (!profileData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }

    if (!profileData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    setValidationErrors(errors);
    return !errors.fullName && !errors.email;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setHasChanges(false);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Saving settings:', {
      profile: profileData
    });
    
    setSaving(false);
  };

  const generateApiKey = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'eg_sk_live_';
    for (let i = 0; i < 48; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const createApiKey = () => {
    if (!newKeyData.name.trim()) {
      alert('Please enter a name for the API key');
      return;
    }

    if (newKeyData.permissions.length === 0) {
      alert('Please select at least one permission');
      return;
    }

    const newKey: APIKey = {
      id: `key_${Date.now()}`,
      name: newKeyData.name,
      key: generateApiKey(),
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
      permissions: newKeyData.permissions,
      status: 'active'
    };
    
    setApiKeys([...apiKeys, newKey]);
    setNewKeyData({ name: '', permissions: [] });
    setShowCreateKeyModal(false);
    setHasChanges(true);
  };

  const toggleKeyVisibility = (keyId: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(keyId)) {
      newVisible.delete(keyId);
    } else {
      newVisible.add(keyId);
    }
    setVisibleKeys(newVisible);
  };

  const copyApiKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 2000);
  };

  const deleteApiKey = (keyId: string) => {
    if (confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      setApiKeys(apiKeys.filter(key => key.id !== keyId));
      setHasChanges(true);
    }
  };

  const maskApiKey = (key: string) => {
    return key.substring(0, 12) + '•'.repeat(20) + key.substring(key.length - 8);
  };

  const togglePermission = (permission: string) => {
    const newPermissions = newKeyData.permissions.includes(permission)
      ? newKeyData.permissions.filter(p => p !== permission)
      : [...newKeyData.permissions, permission];
    
    setNewKeyData({ ...newKeyData, permissions: newPermissions });
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-6">
              <div className="h-24 w-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                {profileData.fullName ? profileData.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {profileData.fullName || 'User'}
                </h3>
                <p className="text-gray-600">{profileData.email}</p>
                <Badge variant="info" className="mt-2">
                  {profileData.role.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={profileData.fullName}
                  onChange={(e) => {
                    setProfileData({ ...profileData, fullName: e.target.value });
                    setHasChanges(true);
                    if (validationErrors.fullName) {
                      setValidationErrors({ ...validationErrors, fullName: '' });
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.fullName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                />
                {validationErrors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => {
                    setProfileData({ ...profileData, email: e.target.value });
                    setHasChanges(true);
                    if (validationErrors.email) {
                      setValidationErrors({ ...validationErrors, email: '' });
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email address"
                />
                {validationErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <input
                  type="text"
                  value={profileData.department}
                  onChange={(e) => {
                    setProfileData({ ...profileData, department: e.target.value });
                    setHasChanges(true);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => {
                    setProfileData({ ...profileData, phone: e.target.value });
                    setHasChanges(true);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) => {
                    setProfileData({ ...profileData, location: e.target.value });
                    setHasChanges(true);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                <select
                  value={profileData.timezone}
                  onChange={(e) => {
                    setProfileData({ ...profileData, timezone: e.target.value });
                    setHasChanges(true);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="UTC">UTC</option>
                  <option value="Europe/London">London (GMT)</option>
                  <option value="Europe/Paris">Paris (CET)</option>
                  <option value="Asia/Tokyo">Tokyo (JST)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                value={profileData.bio}
                onChange={(e) => {
                  setProfileData({ ...profileData, bio: e.target.value });
                  setHasChanges(true);
                }}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Required Fields</p>
                  <p className="text-sm text-blue-800">
                    Full name and email are required to save your profile changes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'api-keys':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">API Keys</h3>
                <p className="text-sm text-gray-600">Create and manage API keys for SDK integration</p>
              </div>
              <Button onClick={() => setShowCreateKeyModal(true)} icon={Plus}>
                Create New Key
              </Button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Key className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">SDK Integration</p>
                  <p className="text-sm text-blue-800">
                    Use these API keys in the EthicGuard SDK to protect your AI applications. 
                    Copy the key and use it in your SDK configuration.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {apiKeys.map((apiKey) => (
                <Card key={apiKey.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900">{apiKey.name}</h4>
                      <p className="text-sm text-gray-600">
                        Created: {apiKey.created} • Last used: {apiKey.lastUsed}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={apiKey.status === 'active' ? 'success' : 'neutral'}>
                        {apiKey.status}
                      </Badge>
                      <button
                        onClick={() => deleteApiKey(apiKey.id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                        title="Delete API key"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">API Key</label>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                          className="text-gray-500 hover:text-gray-700"
                          title={visibleKeys.has(apiKey.id) ? 'Hide key' : 'Show key'}
                        >
                          {visibleKeys.has(apiKey.id) ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => copyApiKey(apiKey.key)}
                          className="text-gray-500 hover:text-gray-700"
                          title="Copy to clipboard"
                        >
                          {copiedKey === apiKey.key ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <code className="text-sm bg-white px-3 py-2 rounded border block font-mono">
                      {visibleKeys.has(apiKey.id) ? apiKey.key : maskApiKey(apiKey.key)}
                    </code>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Permissions</p>
                    <div className="flex flex-wrap gap-2">
                      {apiKey.permissions.map((permission) => (
                        <Badge key={permission} variant="info" size="sm">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}

              {apiKeys.length === 0 && (
                <div className="text-center py-8">
                  <Key className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No API keys created yet</p>
                  <p className="text-sm text-gray-400">Create your first API key to start using the SDK</p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return <div>Select a settings section</div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account preferences and API keys</p>
        </div>
        <div className="flex space-x-3">
          {hasChanges && activeSection === 'profile' && (
            <Button
              onClick={handleSave}
              loading={saving}
              icon={Save}
              disabled={!profileData.fullName.trim() || !profileData.email.trim()}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-1/4">
          <Card className="p-4">
            <nav className="space-y-2">
              {settingsSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <section.icon className="h-5 w-5" />
                  <div>
                    <p className="font-medium">{section.title}</p>
                    <p className="text-xs text-gray-500">{section.description}</p>
                  </div>
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4">
          <Card className="p-6">
            {renderContent()}
          </Card>
        </div>
      </div>

      {/* Create API Key Modal */}
      {showCreateKeyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Create New API Key</h2>
              <button
                onClick={() => setShowCreateKeyModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newKeyData.name}
                  onChange={(e) => setNewKeyData({ ...newKeyData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Production API Key"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permissions <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {availablePermissions.map((permission) => (
                    <label key={permission.id} className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={newKeyData.permissions.includes(permission.id)}
                        onChange={() => togglePermission(permission.id)}
                        className="mt-1"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{permission.name}</p>
                        <p className="text-xs text-gray-600">{permission.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setShowCreateKeyModal(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={createApiKey}
                disabled={!newKeyData.name.trim() || newKeyData.permissions.length === 0}
              >
                Create Key
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}