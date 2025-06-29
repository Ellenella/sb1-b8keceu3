import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration. Please check your .env file.');
  console.error('Required variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY');
}

// Validate URL format
if (supabaseUrl && !supabaseUrl.startsWith('https://')) {
  console.error('Invalid Supabase URL format. URL should start with https://');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    // Add retry configuration for token refresh
    retryAttempts: 3,
    // Handle refresh token errors gracefully
    onRefreshTokenError: (error) => {
      console.error('Refresh token error:', error);
      // Clear the session if refresh token is invalid
      if (error.message?.includes('refresh_token_not_found') || 
          error.message?.includes('Invalid Refresh Token')) {
        console.log('Clearing invalid session...');
        supabase.auth.signOut().catch(console.error);
      }
    }
  }
});

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          role: 'developer' | 'compliance_officer' | 'auditor' | 'executive';
          full_name: string;
          avatar_url?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role: 'developer' | 'compliance_officer' | 'auditor' | 'executive';
          full_name: string;
          avatar_url?: string;
        };
        Update: {
          role?: 'developer' | 'compliance_officer' | 'auditor' | 'executive';
          full_name?: string;
          avatar_url?: string;
        };
      };
      compliance_rules: {
        Row: {
          id: string;
          name: string;
          description: string;
          rule_type: 'toxicity' | 'bias' | 'keyword' | 'regex' | 'custom';
          rule_config: any;
          threshold: number;
          is_active: boolean;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          description: string;
          rule_type: 'toxicity' | 'bias' | 'keyword' | 'regex' | 'custom';
          rule_config: any;
          threshold: number;
          is_active?: boolean;
          created_by: string;
        };
        Update: {
          name?: string;
          description?: string;
          rule_config?: any;
          threshold?: number;
          is_active?: boolean;
        };
      };
      incidents: {
        Row: {
          id: string;
          prompt_hash: string;
          response_hash: string;
          rule_violated: string;
          severity: 'low' | 'medium' | 'high' | 'critical';
          blocked_reason: string;
          suggested_fix?: string;
          user_id?: string;
          application_id?: string;
          metadata: any;
          created_at: string;
        };
        Insert: {
          prompt_hash: string;
          response_hash: string;
          rule_violated: string;
          severity: 'low' | 'medium' | 'high' | 'critical';
          blocked_reason: string;
          suggested_fix?: string;
          user_id?: string;
          application_id?: string;
          metadata?: any;
        };
        Update: {
          severity?: 'low' | 'medium' | 'high' | 'critical';
          blocked_reason?: string;
          suggested_fix?: string;
          metadata?: any;
        };
      };
    };
  };
};