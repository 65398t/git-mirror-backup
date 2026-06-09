// Database types for the Git Mirror Backup system
export type SourceProviderType = 'azure_devops' | 'github';

export interface AzureDevOpsOrganization {
  id: string;
  name: string;
  url: string;
  provider: 'azure_devops';
  tags: string[];
  pat: string;
  pat_expiry: string;
}

export interface GitHubOrganization {
  id: string;
  name: string;
  url: string;
  provider: 'github';
  tags: string[];
  pat: string;
  pat_expiry: string;
}

export type SourceOrganization = AzureDevOpsOrganization | GitHubOrganization;

export interface RemoteProject {
  id: string;
  name: string;
  description: string;
}

// Database row type for source_organizations table
export interface SourceOrganizationRow {
  id: string;
  name: string;
  url: string;
  provider: SourceProviderType;
  tags: string[];
  pat: string;
  pat_expiry: string | null;
  user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface MirrorSettings {
  id: string;
  user_id: string;
  storage_path: string;
  schedule_cron: string;
  schedule_enabled: boolean;
  max_parallel_jobs: number;
  notification_daily_emails: string[];
  notification_error_emails: string[];
  created_at: string;
  updated_at: string;
}

export interface MirrorRepository {
  id: string;
  user_id: string;
  repository_id: string;
  project_name: string;
  repository_name: string;
  remote_url: string;
  local_path: string;
  status: 'active' | 'orphaned' | 'error' | 'pending';
  last_synced_at: string | null;
  last_error: string | null;
  size_bytes: number;
  branch_count: number;
  tag_count: number;
  is_ignored: boolean;
  created_at: string;
  updated_at: string;
}

export interface IgnoreRule {
  id: string;
  user_id: string;
  pattern: string;
  rule_type: 'repository' | 'project_repository' | 'wildcard';
  description: string;
  is_active: boolean;
  matched_count: number;
  created_at: string;
  updated_at: string;
}

export interface MirrorRun {
  id: string;
  user_id: string;
  job_id: string;
  trigger_type: 'scheduled' | 'manual';
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  started_at: string;
  completed_at: string | null;
  total_repositories: number;
  synced_count: number;
  failed_count: number;
  skipped_count: number;
  new_repos_count: number;
  error_summary: string | null;
  log_entries: LogEntry[];
  created_at: string;
}

export interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  repository?: string;
  project?: string;
}

export interface RestoreTest {
  id: string;
  user_id: string;
  repository_id: string;
  status: 'passed' | 'failed';
  tested_at: string;
  branches_verified: number;
  tags_verified: number;
  error_message: string | null;
  created_at: string;
}
