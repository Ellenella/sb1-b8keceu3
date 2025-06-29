import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Shield, 
  Edit, 
  Save, 
  X, 
  Camera,
  Key,
  Bell,
  Globe,
  Lock,
  Activity,
  Calendar,
  MapPin
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';

export function UserProfile() {
  const { profile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: profile?.full_name || 'Demo User',
    email: profile?.email || 'demo@ethicguard.com',
    role: profile?.role || 'developer',
    department: 'Engineering',
    location: 'San Francisco, CA',
    timezone: 'PST (UTC-8)',
    phone: '+1 (555) 123-4567',
    bio: 'Passionate about AI governance and ethical technology development.',
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    pushNotifications: true,
    weeklyReports: true,
    securityAlerts: true,
  });

  const handleSave = () => {
    // In a real app, this would save to the backend
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      fullName: profile?.full_name || 'Demo User',
      email: profile?.email || 'demo@ethicguard.com',
      role: profile?.role || 'developer',
      department: 'Engineering',
      location: 'San Francisco, CA',
      timezone: 'PST (UTC-8)',
      phone: '+1 (555) 123-4567',
      bio: 'Passionate about AI governance and ethical technology development.',
    });
    setIsEditing(false);
  };

  const activityLog = [
    { action: 'Signed in', timestamp: '2 hours ago', ip: '192.168.1.100' },
    { action: 'Updated AI governance rules', timestamp: '1 day ago', ip: '192.168.1.100' },
    { action: 'Generated compliance report', timestamp: '2 days ago', ip: '192.168.1.100' },
    { action: 'Reviewed incident #1234', timestamp: '3 days ago', ip: '192.168.1.100' },
    { action: 'Changed password', timestamp: '1 week ago', ip: '192.168.1.100' },
  ];

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'executive': return 'error';
      case 'compliance_officer': return 'warning';
      case 'auditor': return 'info';
      case 'developer': return 'success';
      default: return 'neutral';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
          <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
        </div>
        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel} icon={X}>
                Cancel
              </Button>
              <Button onClick={handleSave} icon={Save}>
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} icon={Edit}>
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <div className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                    {formData.fullName.charAt(0).toUpperCase()}
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 h-8 w-8 bg-gray-900 rounded-full flex items-center justify-center text-white hover:bg-gray-800">
                      <Camera className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{formData.fullName}</h3>
                  <p className="text-gray-600">{formData.email}</p>
                  <Badge variant={getRoleBadgeVariant(formData.role) as any} className="mt-2">
                    {formData.role.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{formData.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{formData.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{formData.department}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{formData.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{formData.location}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                  {isEditing ? (
                    <select
                      value={formData.timezone}
                      onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="PST (UTC-8)">PST (UTC-8)</option>
                      <option value="EST (UTC-5)">EST (UTC-5)</option>
                      <option value="GMT (UTC+0)">GMT (UTC+0)</option>
                      <option value="CET (UTC+1)">CET (UTC+1)</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 py-2">{formData.timezone}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                {isEditing ? (
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{formData.bio}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </p>
                    <p className="text-sm text-gray-600">
                      {key === 'emailAlerts' && 'Receive email notifications for important events'}
                      {key === 'pushNotifications' && 'Get push notifications in your browser'}
                      {key === 'weeklyReports' && 'Weekly compliance and activity reports'}
                      {key === 'securityAlerts' && 'Security-related notifications and alerts'}
                    </p>
                  </div>
                  <button
                    onClick={() => setNotifications({ ...notifications, [key]: !value })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      value ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        value ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Security */}
          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <Button variant="outline" className="w-full" icon={Key}>
                Change Password
              </Button>
              <Button variant="outline" className="w-full" icon={Shield}>
                Two-Factor Auth
              </Button>
              <Button variant="outline" className="w-full" icon={Activity}>
                Active Sessions
              </Button>
            </div>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Account Stats</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Member since</span>
                <span className="font-medium">Jan 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last login</span>
                <span className="font-medium">2 hours ago</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total sessions</span>
                <span className="font-medium">247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rules created</span>
                <span className="font-medium">12</span>
              </div>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              {activityLog.slice(0, 5).map((activity, index) => (
                <div key={index} className="text-sm">
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <p className="text-gray-500">{activity.timestamp}</p>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-4">
                View Full Activity Log
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}