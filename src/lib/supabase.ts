import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase configuration. Please check your .env file.');
  console.error('Required variables:');
  console.error('  VITE_SUPABASE_URL=https://your-project-id.supabase.co');
  console.error('  VITE_SUPABASE_ANON_KEY=your_supabase_anon_key');
  console.error('');
  console.error('📝 To fix this:');
  console.error('1. Create a .env file in your project root');
  console.error('2. Copy the contents from .env.example');
  console.error('3. Replace the placeholder values with your actual Supabase credentials');
  console.error('4. Restart the development server');
  
  throw new Error('Supabase configuration is missing. Please check your .env file.');
}

// Validate URL format
if (!supabaseUrl.startsWith('https://')) {
  console.error('❌ Invalid Supabase URL format.');
  console.error(`Current URL: "${supabaseUrl}"`);
  console.error('Expected format: https://your-project-id.supabase.co');
  console.error('');
  console.error('📝 To fix this:');
  console.error('1. Check your .env file');
  console.error('2. Ensure VITE_SUPABASE_URL starts with https://');
  console.error('3. Get the correct URL from your Supabase project dashboard');
  
  throw new Error('Invalid Supabase URL format. URL must start with https://');
}

// Validate URL is a valid URL
try {
  new URL(supabaseUrl);
} catch (error) {
  console.error('❌ Invalid Supabase URL.');
  console.error(`Current URL: "${supabaseUrl}"`);
  console.error('Please check that your VITE_SUPABASE_URL is a valid URL.');
  
  throw new Error('Invalid Supabase URL. Please check your .env file.');
}

// Validate anon key format (basic check)
if (supabaseAnonKey.length < 100) {
  console.error('❌ Invalid Supabase anonymous key.');
  console.error('The anonymous key appears to be too short or invalid.');
  console.error('Please check your VITE_SUPABASE_ANON_KEY in the .env file.');
  
  throw new Error('Invalid Supabase anonymous key. Please check your .env file.');
}

console.log('✅ Supabase configuration validated successfully');

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
      legal_policies: {
        Row: {
          id: string;
          policy_type: 'privacy_policy' | 'terms_of_service';
          version: string;
          title: string;
          effective_date: string;
          jurisdictions: string[];
          content_markdown: string;
          content_json: any;
          blockchain_hash?: string;
          blockchain_tx_id?: string;
          blockchain_asset_id?: string;
          ipfs_hash?: string;
          created_at: string;
          updated_at: string;
          status: 'draft' | 'published' | 'archived';
          created_by?: string;
          compliance_score: number;
          data_categories?: string[];
          retention_period?: string;
          children_data: boolean;
          payment_processing: boolean;
          cookies_used: boolean;
          analytics_used: boolean;
          marketing_communications: boolean;
        };
        Insert: {
          policy_type: 'privacy_policy' | 'terms_of_service';
          version: string;
          title: string;
          effective_date: Date;
          jurisdictions: string[];
          content_markdown: string;
          content_json: any;
          blockchain_hash?: string;
          blockchain_tx_id?: string;
          blockchain_asset_id?: string;
          ipfs_hash?: string;
          status: 'draft' | 'published' | 'archived';
          created_by?: string;
          compliance_score?: number;
          data_categories?: string[];
          retention_period?: string;
          children_data?: boolean;
          payment_processing?: boolean;
          cookies_used?: boolean;
          analytics_used?: boolean;
          marketing_communications?: boolean;
        };
        Update: {
          version?: string;
          title?: string;
          effective_date?: Date;
          jurisdictions?: string[];
          content_markdown?: string;
          content_json?: any;
          blockchain_hash?: string;
          blockchain_tx_id?: string;
          blockchain_asset_id?: string;
          ipfs_hash?: string;
          status?: 'draft' | 'published' | 'archived';
          compliance_score?: number;
          data_categories?: string[];
          retention_period?: string;
          children_data?: boolean;
          payment_processing?: boolean;
          cookies_used?: boolean;
          analytics_used?: boolean;
          marketing_communications?: boolean;
        };
      };
      policy_versions: {
        Row: {
          id: string;
          policy_id: string;
          version: string;
          content_markdown: string;
          content_json: any;
          effective_date: string;
          created_at: string;
          created_by?: string;
          blockchain_hash?: string;
          blockchain_tx_id?: string;
          blockchain_asset_id?: string;
          ipfs_hash?: string;
          compliance_score: number;
        };
        Insert: {
          policy_id: string;
          version: string;
          content_markdown: string;
          content_json: any;
          effective_date: Date;
          created_by?: string;
          blockchain_hash?: string;
          blockchain_tx_id?: string;
          blockchain_asset_id?: string;
          ipfs_hash?: string;
          compliance_score?: number;
        };
        Update: {
          version?: string;
          content_markdown?: string;
          content_json?: any;
          effective_date?: Date;
          blockchain_hash?: string;
          blockchain_tx_id?: string;
          blockchain_asset_id?: string;
          ipfs_hash?: string;
          compliance_score?: number;
        };
      };
      policy_consents: {
        Row: {
          id: string;
          user_id: string;
          policy_id: string;
          policy_version: string;
          consented_at: string;
          ip_address?: string;
          user_agent?: string;
          consent_method?: 'explicit' | 'implicit';
          blockchain_verified: boolean;
          blockchain_tx_id?: string;
        };
        Insert: {
          user_id: string;
          policy_id: string;
          policy_version: string;
          consented_at?: Date;
          ip_address?: string;
          user_agent?: string;
          consent_method?: 'explicit' | 'implicit';
          blockchain_verified?: boolean;
          blockchain_tx_id?: string;
        };
        Update: {
          consented_at?: Date;
          ip_address?: string;
          user_agent?: string;
          consent_method?: 'explicit' | 'implicit';
          blockchain_verified?: boolean;
          blockchain_tx_id?: string;
        };
      };
    };
  };
};