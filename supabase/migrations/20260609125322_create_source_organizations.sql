/*
# Create source_organizations table

Moves organization configuration from in-memory mock data to the database.
Supports both Azure DevOps and GitHub as source providers.

1. New Tables
  - `source_organizations`
    - `id` (uuid, primary key)
    - `name` (text, not null) - Display name of the organization
    - `url` (text, not null, default '') - Base URL (e.g. https://dev.azure.com/M-S)
    - `provider` (text, not null) - 'azure_devops' or 'github'
    - `projects` (text[], default '{}') - Azure DevOps projects (empty for GitHub)
    - `pat` (text, not null, default '') - Personal Access Token
    - `pat_expiry` (date, nullable) - PAT expiration date
    - `user_id` (uuid, FK to auth.users) - Owner for RLS
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

2. Security
  - Enable RLS on `source_organizations`.
  - Ownership-based policies: only authenticated users can access their own rows.

3. Notes
  - The `provider` column uses a CHECK constraint to enforce valid values.
  - The `projects` column is only relevant for azure_devops providers.
  - PAT is stored as text; in production this should be encrypted or stored in a vault.
*/

CREATE TABLE IF NOT EXISTS source_organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  url text NOT NULL DEFAULT '',
  provider text NOT NULL DEFAULT 'azure_devops' CHECK (provider IN ('azure_devops', 'github')),
  projects text[] NOT NULL DEFAULT '{}',
  pat text NOT NULL DEFAULT '',
  pat_expiry date,
  user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE source_organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_source_organizations" ON source_organizations FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "insert_own_source_organizations" ON source_organizations FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "update_own_source_organizations" ON source_organizations FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "delete_own_source_organizations" ON source_organizations FOR DELETE
  TO authenticated USING (auth.uid() = user_id);