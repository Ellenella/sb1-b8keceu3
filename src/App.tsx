import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { Layout } from './components/layout/Layout';
import { Landing } from './pages/Landing';
import { Blog } from './pages/Blog';
import { Documentation } from './pages/Documentation';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { BotManagement } from './pages/BotManagement';
import { AIGovernance } from './pages/AIGovernance';
import { BatchAnalysis } from './pages/BatchAnalysis';
import { PrivacyTerms } from './pages/PrivacyTerms';
import { AuditTrail } from './pages/AuditTrail';
import { UserProfile } from './pages/UserProfile';
import { SDKIntegration } from './pages/SDKIntegration';
import { Settings } from './pages/Settings';

function App() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show dashboard if user exists OR if we're in demo mode (profile exists without Supabase)
  const isAuthenticated = user || profile;

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Landing />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/docs" element={<Documentation />} />
        <Route path="/auth" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Auth />} />
        
        {/* Protected routes */}
        {isAuthenticated ? (
          <Route path="/" element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/bot-management" element={<BotManagement />} />
            <Route path="/ai-governance" element={<AIGovernance />} />
            <Route path="/batch-analysis" element={<BatchAnalysis />} />
            <Route path="/privacy-terms" element={<PrivacyTerms />} />
            <Route path="/audit-trail" element={<AuditTrail />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/sdk" element={<SDKIntegration />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/auth" replace />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;