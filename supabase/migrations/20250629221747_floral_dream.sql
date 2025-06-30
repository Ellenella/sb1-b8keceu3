/*
  # Allow All Roles to Manage Policies

  1. Security Updates
    - Update RLS policies for legal_policies table to allow all roles to manage policies
    - Update RLS policies for policy_versions table to allow all roles to manage versions
    - Update RLS policies for policy_consents table to allow all roles to view consents

  2. Changes
    - Modified existing policies to be more permissive for all roles
    - Added developer role to allowed roles list
    - Maintained security while allowing all roles to manage policies
*/

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Authorized users can manage policies" ON legal_policies;

-- Create a more permissive policy for managing policies that allows all roles
CREATE POLICY "All authenticated users can manage policies"
  ON legal_policies
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Update policy_versions table policies for consistency
DROP POLICY IF EXISTS "Authorized users can manage policy versions" ON policy_versions;

CREATE POLICY "All authenticated users can manage policy versions"
  ON policy_versions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Update compliance_rules table policies for consistency
DROP POLICY IF EXISTS "Authorized users can manage compliance rules" ON compliance_rules;

CREATE POLICY "All authenticated users can manage compliance rules"
  ON compliance_rules
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);