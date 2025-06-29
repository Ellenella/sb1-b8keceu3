import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  BarChart3, 
  LogOut,
  ChevronDown,
  Brain,
  Lock,
  Database,
  Bot,
  Upload,
  Code,
  Settings
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const navigation = [
  { name: 'Overview Dashboard', href: '/dashboard', icon: BarChart3, roles: ['developer', 'compliance_officer', 'auditor', 'executive'] },
  { name: 'Bot Management', href: '/bot-management', icon: Bot, roles: ['developer', 'compliance_officer', 'executive'] },
  { name: 'AI Governance', href: '/ai-governance', icon: Brain, roles: ['developer', 'compliance_officer', 'auditor', 'executive'] },
  { name: 'Batch Analysis', href: '/batch-analysis', icon: Upload, roles: ['developer', 'compliance_officer', 'auditor', 'executive'] },
  { name: 'Privacy & Terms', href: '/privacy-terms', icon: Lock, roles: ['developer', 'compliance_officer', 'auditor', 'executive'] },
  { name: 'Audit Trail', href: '/audit-trail', icon: Database, roles: ['auditor', 'executive', 'compliance_officer'] },
  { name: 'SDK Integration', href: '/sdk', icon: Code, roles: ['developer'] },
  { name: 'Settings', href: '/settings', icon: Settings, roles: ['developer', 'compliance_officer', 'auditor', 'executive'] },
];

export function Sidebar() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  // Show all navigation items if no profile (demo mode) or filter by role
  const filteredNavigation = profile?.role 
    ? navigation.filter(item => item.roles.includes(profile.role))
    : navigation;

  const handleSignOut = async () => {
    try {
      console.log('Sign out button clicked');
      
      // Show loading state briefly
      const button = document.querySelector('[data-signout-btn]') as HTMLButtonElement;
      if (button) {
        button.disabled = true;
        button.textContent = 'Signing out...';
      }
      
      // Call sign out function
      const { error } = await signOut();
      
      if (error) {
        console.error('Sign out failed:', error);
        // Reset button state on error
        if (button) {
          button.disabled = false;
          button.textContent = 'Sign Out';
        }
        // Still try to redirect even on error
        window.location.href = '/';
      }
      
      // Note: If successful, signOut() will handle the redirect
    } catch (error) {
      console.error('Unexpected sign out error:', error);
      // Force redirect as fallback
      window.location.href = '/';
    }
  };

  const handleUserClick = () => {
    navigate('/profile');
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      {/* Logo */}
      <div className="flex items-center px-6 py-4 border-b border-gray-800 bg-gray-900">
        <Shield className="h-8 w-8 text-blue-400" />
        <span className="ml-3 text-xl font-bold">EthicGuard</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 bg-gray-900">
        {filteredNavigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* User Menu */}
      <div className="border-t border-gray-800 p-4 bg-gray-900">
        <button
          onClick={handleUserClick}
          className="flex items-center mb-4 w-full hover:bg-gray-800 rounded-lg p-2 transition-colors"
        >
          <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-sm font-medium">
              {profile?.full_name?.charAt(0).toUpperCase() || 'D'}
            </span>
          </div>
          <div className="ml-3 flex-1 text-left">
            <p className="text-sm font-medium">{profile?.full_name || 'Demo User'}</p>
            <p className="text-xs text-gray-400 capitalize">{profile?.role?.replace('_', ' ') || 'Developer'}</p>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>
        <button
          data-signout-btn
          onClick={handleSignOut}
          className="flex items-center w-full px-4 py-2 text-sm text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogOut className="h-4 w-4 mr-3" />
          Sign Out
        </button>
      </div>
    </div>
  );
}