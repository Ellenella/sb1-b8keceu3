/*
  # Bot Management Database Schema

  1. New Tables
    - `bots`: Stores registered AI bots
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `description` (text, not null)
      - `api_key` (text, not null)
      - `status` (text, not null) - 'active', 'inactive', 'suspended'
      - `request_count` (integer, default 0)
      - `blocked_count` (integer, default 0)
      - `compliance_score` (numeric, default 100)
      - `rules` (text array, not null)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
      - `last_activity` (timestamptz)
      - `user_id` (uuid, references auth.users.id)

  2. Security
    - Enable RLS on the table
    - Add policies for users to manage their own bots
    - Add policies for compliance officers and executives to view all bots
*/

-- Create bots table
CREATE TABLE IF NOT EXISTS bots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  api_key text NOT NULL UNIQUE,
  status text NOT NULL CHECK (status IN ('active', 'inactive', 'suspended')),
  request_count integer DEFAULT 0 NOT NULL,
  blocked_count integer DEFAULT 0 NOT NULL,
  compliance_score numeric DEFAULT 100 NOT NULL CHECK (compliance_score >= 0 AND compliance_score <= 100),
  rules text[] NOT NULL DEFAULT '{}'::text[],
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  last_activity timestamptz,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable Row Level Security
ALTER TABLE bots ENABLE ROW LEVEL SECURITY;

-- Policies for bots
CREATE POLICY "Users can view their own bots"
  ON bots
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own bots"
  ON bots
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own bots"
  ON bots
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own bots"
  ON bots
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Compliance officers and executives can view all bots"
  ON bots
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
CREATE INDEX IF NOT EXISTS idx_bots_user_id ON bots(user_id);
CREATE INDEX IF NOT EXISTS idx_bots_status ON bots(status);
CREATE INDEX IF NOT EXISTS idx_bots_created_at ON bots(created_at);
CREATE INDEX IF NOT EXISTS idx_bots_last_activity ON bots(last_activity);

-- Add updated_at trigger
CREATE TRIGGER update_bots_updated_at
  BEFORE UPDATE ON bots
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();