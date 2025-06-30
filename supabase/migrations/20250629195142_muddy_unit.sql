/*
  # Legal Policies Schema for Privacy Policy and Terms of Service

  1. New Tables
    - `legal_policies`: Stores privacy policies and terms of service
      - `id` (uuid, primary key)
      - `policy_type` (text, not null) - 'privacy_policy', 'terms_of_service'
      - `version` (text, not null) - e.g., '1.0', '2.1'
      - `title` (text, not null)
      - `effective_date` (timestamptz, not null)
      - `jurisdictions` (text array, not null) - e.g., ['GDPR', 'CCPA', 'COPPA', 'PIPEDA']
      - `content_markdown` (text, not null) - human-readable markdown
      - `content_json` (jsonb, not null) - machine-readable structured data
      - `blockchain_hash` (text) - hash of the policy content recorded on Algorand
      - `blockchain_tx_id` (text) - Algorand transaction ID
      - `blockchain_asset_id` (text) - Algorand ASA ID
      - `ipfs_hash` (text) - IPFS hash for decentralized storage
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
      - `status` (text, not null) - 'draft', 'published', 'archived'
      - `created_by` (uuid, references profiles.id)
      - `compliance_score` (numeric, default 0) - calculated compliance score (0-100)
      - `data_categories` (text array) - types of data collected
      - `retention_period` (interval) - how long data is retained
      - `children_data` (boolean, default false) - whether data is collected from children
      - `payment_processing` (boolean, default false) - whether payments are processed
      - `cookies_used` (boolean, default false) - whether cookies are used
      - `analytics_used` (boolean, default false) - whether analytics are used
      - `marketing_communications` (boolean, default false) - whether marketing emails are sent

    - `policy_versions`: Tracks version history of policies
      - `id` (uuid, primary key)
      - `policy_id` (uuid, references legal_policies.id)
      - `version` (text, not null)
      - `content_markdown` (text, not null)
      - `content_json` (jsonb, not null)
      - `effective_date` (timestamptz, not null)
      - `created_at` (timestamptz, default now())
      - `created_by` (uuid, references profiles.id)
      - `blockchain_hash` (text)
      - `blockchain_tx_id` (text)
      - `blockchain_asset_id` (text)
      - `ipfs_hash` (text)
      - `compliance_score` (numeric, default 0)

    - `policy_consents`: Tracks user consent to policies
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users.id)
      - `policy_id` (uuid, references legal_policies.id)
      - `policy_version` (text, not null)
      - `consented_at` (timestamptz, default now())
      - `ip_address` (text)
      - `user_agent` (text)
      - `consent_method` (text) - 'explicit', 'implicit'
      - `blockchain_verified` (boolean, default false)
      - `blockchain_tx_id` (text)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to view published policies
    - Add policies for compliance officers and executives to manage policies
    - Add policies for users to view their own consents
*/

-- Create legal_policies table
CREATE TABLE IF NOT EXISTS legal_policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_type text NOT NULL CHECK (policy_type IN ('privacy_policy', 'terms_of_service')),
  version text NOT NULL,
  title text NOT NULL,
  effective_date timestamptz NOT NULL,
  jurisdictions text[] NOT NULL,
  content_markdown text NOT NULL,
  content_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  blockchain_hash text,
  blockchain_tx_id text,
  blockchain_asset_id text,
  ipfs_hash text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  status text NOT NULL CHECK (status IN ('draft', 'published', 'archived')),
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  compliance_score numeric DEFAULT 0 CHECK (compliance_score >= 0 AND compliance_score <= 100),
  data_categories text[],
  retention_period interval,
  children_data boolean DEFAULT false,
  payment_processing boolean DEFAULT false,
  cookies_used boolean DEFAULT false,
  analytics_used boolean DEFAULT false,
  marketing_communications boolean DEFAULT false
);

-- Create policy_versions table
CREATE TABLE IF NOT EXISTS policy_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id uuid NOT NULL REFERENCES legal_policies(id) ON DELETE CASCADE,
  version text NOT NULL,
  content_markdown text NOT NULL,
  content_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  effective_date timestamptz NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  blockchain_hash text,
  blockchain_tx_id text,
  blockchain_asset_id text,
  ipfs_hash text,
  compliance_score numeric DEFAULT 0 CHECK (compliance_score >= 0 AND compliance_score <= 100)
);

-- Create policy_consents table
CREATE TABLE IF NOT EXISTS policy_consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  policy_id uuid NOT NULL REFERENCES legal_policies(id) ON DELETE CASCADE,
  policy_version text NOT NULL,
  consented_at timestamptz DEFAULT now() NOT NULL,
  ip_address text,
  user_agent text,
  consent_method text CHECK (consent_method IN ('explicit', 'implicit')),
  blockchain_verified boolean DEFAULT false,
  blockchain_tx_id text
);

-- Enable Row Level Security
ALTER TABLE legal_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE policy_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE policy_consents ENABLE ROW LEVEL SECURITY;

-- Policies for legal_policies
CREATE POLICY "Anyone can view published policies"
  ON legal_policies
  FOR SELECT
  USING (status = 'published');

CREATE POLICY "Compliance officers and executives can manage policies"
  ON legal_policies
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('compliance_officer', 'executive')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('compliance_officer', 'executive')
    )
  );

-- Policies for policy_versions
CREATE POLICY "Anyone can view policy versions"
  ON policy_versions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM legal_policies
      WHERE legal_policies.id = policy_versions.policy_id
      AND legal_policies.status = 'published'
    )
  );

CREATE POLICY "Compliance officers and executives can manage policy versions"
  ON policy_versions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('compliance_officer', 'executive')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('compliance_officer', 'executive')
    )
  );

-- Policies for policy_consents
CREATE POLICY "Users can view their own consents"
  ON policy_consents
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own consents"
  ON policy_consents
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Compliance officers and executives can view all consents"
  ON policy_consents
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('compliance_officer', 'executive')
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_legal_policies_type_status ON legal_policies(policy_type, status);
CREATE INDEX IF NOT EXISTS idx_legal_policies_effective_date ON legal_policies(effective_date);
CREATE INDEX IF NOT EXISTS idx_policy_versions_policy_id ON policy_versions(policy_id);
CREATE INDEX IF NOT EXISTS idx_policy_versions_version ON policy_versions(policy_id, version);
CREATE INDEX IF NOT EXISTS idx_policy_consents_user_id ON policy_consents(user_id);
CREATE INDEX IF NOT EXISTS idx_policy_consents_policy_id ON policy_consents(policy_id);

-- Add updated_at triggers
CREATE TRIGGER update_legal_policies_updated_at
  BEFORE UPDATE ON legal_policies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();