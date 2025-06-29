/*
  # Initial Database Schema for AI Compliance Platform

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique, not null)
      - `full_name` (text, not null)
      - `role` (text, not null) - developer, compliance_officer, auditor, executive
      - `avatar_url` (text, nullable)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

    - `compliance_rules`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `description` (text, not null)
      - `rule_type` (text, not null) - toxicity, bias, keyword, regex, custom
      - `rule_config` (jsonb, not null)
      - `threshold` (numeric, not null)
      - `is_active` (boolean, default true)
      - `created_by` (uuid, references profiles.id)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

    - `incidents`
      - `id` (uuid, primary key)
      - `prompt_hash` (text, not null)
      - `response_hash` (text, not null)
      - `rule_violated` (text, not null)
      - `severity` (text, not null) - low, medium, high, critical
      - `blocked_reason` (text, not null)
      - `suggested_fix` (text, nullable)
      - `user_id` (uuid, nullable, references profiles.id)
      - `application_id` (text, nullable)
      - `metadata` (jsonb, default '{}')
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for compliance officers and auditors to view incidents
    - Add policies for executives to view all data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('developer', 'compliance_officer', 'auditor', 'executive')),
  avatar_url text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create compliance_rules table
CREATE TABLE IF NOT EXISTS compliance_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  rule_type text NOT NULL CHECK (rule_type IN ('toxicity', 'bias', 'keyword', 'regex', 'custom')),
  rule_config jsonb NOT NULL DEFAULT '{}',
  threshold numeric NOT NULL DEFAULT 0.5,
  is_active boolean DEFAULT true NOT NULL,
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create incidents table
CREATE TABLE IF NOT EXISTS incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_hash text NOT NULL,
  response_hash text NOT NULL,
  rule_violated text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  blocked_reason text NOT NULL,
  suggested_fix text,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  application_id text,
  metadata jsonb DEFAULT '{}' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Compliance rules policies
CREATE POLICY "Authenticated users can view compliance rules"
  ON compliance_rules
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Compliance officers and executives can manage rules"
  ON compliance_rules
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

-- Incidents policies
CREATE POLICY "Users can view incidents they created"
  ON incidents
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Compliance officers and auditors can view all incidents"
  ON incidents
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('compliance_officer', 'auditor', 'executive')
    )
  );

CREATE POLICY "System can insert incidents"
  ON incidents
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_compliance_rules_active ON compliance_rules(is_active);
CREATE INDEX IF NOT EXISTS idx_compliance_rules_type ON compliance_rules(rule_type);
CREATE INDEX IF NOT EXISTS idx_incidents_severity ON incidents(severity);
CREATE INDEX IF NOT EXISTS idx_incidents_created_at ON incidents(created_at);
CREATE INDEX IF NOT EXISTS idx_incidents_user_id ON incidents(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_compliance_rules_updated_at
  BEFORE UPDATE ON compliance_rules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();