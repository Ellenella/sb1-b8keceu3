import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface UserProfile {
  id: string;
  email: string;
  role: 'developer' | 'compliance_officer' | 'auditor' | 'executive';
  full_name: string;
  avatar_url?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper function to clear auth state immediately
  const clearAuthState = () => {
    setUser(null);
    setProfile(null);
    setLoading(false);
  };

  useEffect(() => {
    // Check if Supabase is properly configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase configuration missing. Using demo mode.');
      // Set demo user for development
      const demoUser = {
        id: 'demo-user-123',
        email: 'demo@ethicguard.com',
        role: 'developer' as const,
        full_name: 'Demo User',
      };
      setProfile(demoUser);
      setUser({ id: 'demo-user-123', email: 'demo@ethicguard.com' } as User);
      setLoading(false);
      return;
    }

    // Get initial session with error handling for invalid refresh tokens
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
        // If it's a refresh token error, clear the session immediately
        if (error.message?.includes('refresh_token_not_found') || 
            error.message?.includes('Invalid Refresh Token')) {
          console.log('Invalid refresh token detected, clearing session...');
          clearAuthState();
          supabase.auth.signOut().catch(console.error);
          return;
        }
        setLoading(false);
        return;
      }

      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    }).catch((error) => {
      console.error('Error getting session:', error);
      // Handle refresh token errors immediately
      if (error.message?.includes('refresh_token_not_found') || 
          error.message?.includes('Invalid Refresh Token')) {
        console.log('Invalid refresh token detected, clearing session...');
        clearAuthState();
        supabase.auth.signOut().catch(console.error);
        return;
      }
      setLoading(false);
    });

    // Listen for auth changes with improved error handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        // Handle token refresh errors - clear state immediately
        if (event === 'TOKEN_REFRESHED' && !session) {
          console.log('Token refresh failed, clearing state and signing out...');
          clearAuthState();
          await supabase.auth.signOut().catch(console.error);
          return;
        }

        // Handle signed out state
        if (event === 'SIGNED_OUT' || !session) {
          clearAuthState();
          return;
        }

        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      // Check if Supabase is properly configured before making the request
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('Supabase not configured, skipping profile fetch');
        setLoading(false);
        return;
      }

      // Validate URL format before making request
      if (!supabaseUrl.startsWith('https://')) {
        console.error('Invalid Supabase URL format. Creating demo profile instead.');
        const demoProfile = {
          id: userId,
          email: user?.email || 'demo@ethicguard.com',
          role: 'developer' as const,
          full_name: 'Demo User',
        };
        setProfile(demoProfile);
        setLoading(false);
        return;
      }

      // Add a timeout to prevent hanging requests
      const timeoutPromise = new Promise<null>((_, reject) => {
        setTimeout(() => reject(new Error('Profile fetch timeout')), 10000);
      });

      const fetchPromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      // Race between fetch and timeout
      const { data, error } = await Promise.race([
        fetchPromise,
        timeoutPromise.then(() => ({ data: null, error: new Error('Fetch timeout') }))
      ]);

      if (error) {
        console.error('Supabase error fetching profile:', error);
        
        // Check if this is an auth-related error
        if (error.message?.includes('refresh_token_not_found') || 
            error.message?.includes('Invalid Refresh Token') ||
            error.message?.includes('JWT expired')) {
          console.log('Auth error during profile fetch, clearing state...');
          clearAuthState();
          supabase.auth.signOut().catch(console.error);
          return;
        }
        
        // For other errors, create a demo profile to keep the app functional
        console.log('Creating demo profile due to fetch error');
        const demoProfile = {
          id: userId,
          email: user?.email || 'demo@ethicguard.com',
          role: 'developer' as const,
          full_name: 'Demo User',
        };
        setProfile(demoProfile);
        setLoading(false);
        return;
      }
      
      // If no profile data found, create a demo profile
      if (!data) {
        console.log('No profile found, creating demo profile');
        const demoProfile = {
          id: userId,
          email: user?.email || 'demo@ethicguard.com',
          role: 'developer' as const,
          full_name: 'Demo User',
        };
        setProfile(demoProfile);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Network error fetching profile:', error);
      
      // Check if this is an auth-related error
      if (error instanceof Error && 
          (error.message?.includes('refresh_token_not_found') || 
           error.message?.includes('Invalid Refresh Token') ||
           error.message?.includes('JWT expired'))) {
        console.log('Auth error during profile fetch, clearing state...');
        clearAuthState();
        supabase.auth.signOut().catch(console.error);
        return;
      }
      
      // For any network or other errors, create a demo profile to keep the app functional
      console.log('Creating demo profile due to network error');
      const demoProfile = {
        id: user?.id || userId,
        email: user?.email || 'demo@ethicguard.com',
        role: 'developer' as const,
        full_name: 'Demo User',
      };
      setProfile(demoProfile);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: UserProfile['role']) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (data.user && !error) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email,
            full_name: fullName,
            role,
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
        }
      }

      return { data, error };
    } catch (error) {
      console.error('Sign up error:', error);
      return { data: null, error: error as Error };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?mode=reset`,
      });
      return { error };
    } catch (error) {
      console.error('Reset password error:', error);
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out user...');
      
      // Check if Supabase is configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseAnonKey) {
        // Demo mode - just clear state and redirect
        console.log('Demo mode: clearing state and redirecting');
        clearAuthState();
        
        // Force redirect to home page
        window.location.href = '/';
        return { error: null };
      }

      // Clear local state immediately BEFORE attempting Supabase sign out
      console.log('Clearing auth state immediately...');
      clearAuthState();

      // Then attempt Supabase sign out
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Supabase sign out error:', error);
        // Don't return the error since we've already cleared state
      } else {
        console.log('Successfully signed out from Supabase');
      }
      
      // Force redirect to home page
      window.location.href = '/';
      
      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      
      // Ensure state is cleared even if there's an error
      clearAuthState();
      window.location.href = '/';
      
      return { error: null }; // Don't return the error since we've handled it
    }
  };

  return {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };
}