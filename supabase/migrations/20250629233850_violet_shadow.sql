/*
  # Batch Analysis Schema

  1. New Tables
    - `batch_analysis_datasets`: Stores uploaded datasets for batch analysis
      - `id` (text, primary key)
      - `file_name` (text, not null)
      - `total_records` (integer, not null)
      - `processed_records` (integer, not null)
      - `status` (text, not null) - 'uploading', 'processing', 'completed', 'failed'
      - `results` (jsonb, default '[]')
      - `summary` (jsonb, default '{}')
      - `user_id` (uuid, references auth.users.id)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on the table
    - Add policies for authenticated users to manage their own datasets
    - Add policies for compliance officers and auditors to view all datasets
*/

-- Create batch_analysis_datasets table
CREATE TABLE IF NOT EXISTS batch_analysis_datasets (
  id text PRIMARY KEY,
  file_name text NOT NULL,
  total_records integer NOT NULL,
  processed_records integer NOT NULL,
  status text NOT NULL CHECK (status IN ('uploading', 'processing', 'completed', 'failed')),
  results jsonb DEFAULT '[]'::jsonb,
  summary jsonb DEFAULT '{}'::jsonb,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE batch_analysis_datasets ENABLE ROW LEVEL SECURITY;

-- Policies for batch_analysis_datasets
CREATE POLICY "Users can view their own datasets"
  ON batch_analysis_datasets
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can insert their own datasets"
  ON batch_analysis_datasets
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can update their own datasets"
  ON batch_analysis_datasets
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() OR user_id IS NULL)
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can delete their own datasets"
  ON batch_analysis_datasets
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Compliance officers and auditors can view all datasets"
  ON batch_analysis_datasets
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('compliance_officer', 'auditor', 'executive')
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_batch_analysis_datasets_user_id ON batch_analysis_datasets(user_id);
CREATE INDEX IF NOT EXISTS idx_batch_analysis_datasets_status ON batch_analysis_datasets(status);
CREATE INDEX IF NOT EXISTS idx_batch_analysis_datasets_created_at ON batch_analysis_datasets(created_at);

-- Add updated_at trigger
CREATE TRIGGER update_batch_analysis_datasets_updated_at
  BEFORE UPDATE ON batch_analysis_datasets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();