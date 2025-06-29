import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Shield, ArrowRight, AlertCircle, Users, Zap, Lock, Globe, Award, TrendingUp, Mail, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';

export function Auth() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'developer' as const,
  });

  const { signIn, signUp, resetPassword } = useAuth();

  // Check if Supabase is configured
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const isSupabaseConfigured = supabaseUrl && supabaseAnonKey;

  // Handle password reset mode
  useEffect(() => {
    if (mode === 'reset') {
      setShowForgotPassword(false);
      setSuccess('Please check your email for password reset instructions.');
    }
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!isSupabaseConfigured) {
      setError('Supabase is not configured. Please check your environment variables.');
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        if (!formData.fullName.trim()) {
          throw new Error('Full name is required');
        }
        
        const { error } = await signUp(
          formData.email,
          formData.password,
          formData.fullName,
          formData.role
        );
        if (error) throw error;
        
        setSuccess('Account created successfully! Please check your email to verify your account.');
      } else {
        const { error } = await signIn(formData.email, formData.password);
        if (error) throw error;
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      
      // Provide more specific error messages
      if (error.message?.includes('Failed to fetch')) {
        setError('Unable to connect to the server. Please check your internet connection and try again.');
      } else if (error.message?.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please check your credentials and try again.');
      } else if (error.message?.includes('User already registered')) {
        setError('An account with this email already exists. Please sign in instead.');
      } else if (error.message?.includes('Password should be at least 6 characters')) {
        setError('Password must be at least 6 characters long.');
      } else if (error.message?.includes('Unable to validate email address')) {
        setError('Please enter a valid email address.');
      } else {
        setError(error.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!formData.email.trim()) {
      setError('Please enter your email address.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await resetPassword(formData.email);
      if (error) throw error;
      
      setSuccess('Password reset instructions have been sent to your email.');
      setShowForgotPassword(false);
    } catch (error: any) {
      console.error('Reset password error:', error);
      setError(error.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      fullName: '',
      role: 'developer',
    });
    setError(null);
    setSuccess(null);
  };

  const switchMode = () => {
    setIsSignUp(!isSignUp);
    resetForm();
  };

  const toggleForgotPassword = () => {
    setShowForgotPassword(!showForgotPassword);
    resetForm();
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="flex items-center">
                <Shield className="h-8 w-8 text-blue-600" />
                <span className="ml-3 text-xl font-bold text-gray-900">EthicGuard</span>
              </Link>
              <div className="flex items-center space-x-6">
                <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
                <Link to="/blog" className="text-gray-600 hover:text-gray-900">Blog</Link>
                <Link to="/docs" className="text-gray-600 hover:text-gray-900">Docs</Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <Card>
              <div className="text-center p-6">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Configuration Required</h2>
                <p className="text-gray-600 mb-4">
                  Supabase configuration is missing. Please set up your environment variables.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg text-left">
                  <p className="text-sm font-medium text-gray-700 mb-2">Required environment variables:</p>
                  <code className="text-xs text-gray-600 block">
                    VITE_SUPABASE_URL=your_supabase_project_url<br />
                    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
                  </code>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Create a .env file in your project root with these variables.
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center mb-4">
                  <Shield className="h-8 w-8 text-blue-400" />
                  <span className="ml-3 text-xl font-bold">EthicGuard</span>
                </div>
                <p className="text-gray-400">
                  Making AI governance simple and accessible for organizations of all sizes.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Product</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#features" className="hover:text-white">Features</a></li>
                  <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                  <li><Link to="/docs" className="hover:text-white">Documentation</Link></li>
                  <li><a href="#" className="hover:text-white">API</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Company</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
                  <li><a href="#" className="hover:text-white">About</a></li>
                  <li><a href="#" className="hover:text-white">Careers</a></li>
                  <li><a href="#" className="hover:text-white">Contact</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Legal</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-white">Security</a></li>
                  <li><a href="#" className="hover:text-white">Compliance</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 EthicGuard. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="ml-3 text-xl font-bold text-gray-900">EthicGuard</span>
            </Link>
            <div className="flex items-center space-x-6">
              <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              <Link to="/blog" className="text-gray-600 hover:text-gray-900">Blog</Link>
              <Link to="/docs" className="text-gray-600 hover:text-gray-900">Docs</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
              {/* Logo */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">EthicGuard</h1>
                <p className="text-gray-600 mt-2">AI Governance Platform</p>
              </div>

              {/* Auth Form */}
              <Card>
                {showForgotPassword ? (
                  <form onSubmit={handleForgotPassword} className="space-y-6">
                    <div className="text-center">
                      <h2 className="text-xl font-semibold text-gray-900">Reset Password</h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Enter your email address and we'll send you a link to reset your password
                      </p>
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-center">
                          <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                          <p className="text-sm text-red-700">{error}</p>
                        </div>
                      </div>
                    )}

                    {success && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-green-500 mr-2" />
                          <p className="text-sm text-green-700">{success}</p>
                        </div>
                      </div>
                    )}

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your email address"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      loading={loading}
                      icon={Mail}
                    >
                      Send Reset Link
                    </Button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={toggleForgotPassword}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center"
                      >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to Sign In
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="text-center">
                      <h2 className="text-xl font-semibold text-gray-900">
                        {isSignUp ? 'Create your account' : 'Sign in to your account'}
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        {isSignUp ? 'Get started with EthicGuard' : 'Welcome back to EthicGuard'}
                      </p>
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-center">
                          <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                          <p className="text-sm text-red-700">{error}</p>
                        </div>
                      </div>
                    )}

                    {success && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-green-500 mr-2" />
                          <p className="text-sm text-green-700">{success}</p>
                        </div>
                      </div>
                    )}

                    {isSignUp && (
                      <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter your full name"
                        />
                      </div>
                    )}

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="password"
                        type="password"
                        required
                        minLength={6}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your password"
                      />
                      {isSignUp && (
                        <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
                      )}
                    </div>

                    {isSignUp && (
                      <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                          Role
                        </label>
                        <select
                          id="role"
                          value={formData.role}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="developer">Developer</option>
                          <option value="compliance_officer">Compliance Officer</option>
                          <option value="auditor">Auditor</option>
                          <option value="executive">Executive</option>
                        </select>
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full"
                      loading={loading}
                      icon={ArrowRight}
                    >
                      {isSignUp ? 'Create Account' : 'Sign In'}
                    </Button>

                    <div className="flex flex-col space-y-3 text-center">
                      {!isSignUp && (
                        <button
                          type="button"
                          onClick={toggleForgotPassword}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Forgot your password?
                        </button>
                      )}
                      
                      <button
                        type="button"
                        onClick={switchMode}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                      </button>
                    </div>
                  </form>
                )}
              </Card>

              <div className="text-center mt-8 text-xs text-gray-500">
                <p>By using EthicGuard, you agree to our Terms of Service and Privacy Policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Shield className="h-8 w-8 text-blue-400" />
                <span className="ml-3 text-xl font-bold">EthicGuard</span>
              </div>
              <p className="text-gray-400">
                Making AI governance simple and accessible for organizations of all sizes.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><Link to="/docs" className="hover:text-white">Documentation</Link></li>
                <li><a href="#" className="hover:text-white">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
                <li><a href="#" className="hover:text-white">Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EthicGuard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}