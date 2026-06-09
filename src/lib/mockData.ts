// Realistic demo data for the mock API
// This data simulates an Azure DevOps organization with multiple projects and repositories
import i18n from '../i18n';
import type { MirrorSettings, MirrorRepository, IgnoreRule, MirrorRun, LogEntry } from '../types/database';

const t = (key: string, options?: Record<string, unknown>) => i18n.t(key, options);

const USER_ID = 'mock-user-001';

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 3600_000).toISOString();
}

function daysAgo(d: number): string {
  return new Date(Date.now() - d * 86400_000).toISOString();
}

export const mockSettings: MirrorSettings = {
  id: 'settings-001',
  user_id: USER_ID,
  storage_path: '/opt/azdo-mirror-backup/repos',
  schedule_cron: '0 2 * * *',
  schedule_enabled: true,
  max_parallel_jobs: 6,
  notification_daily_emails: ['admin@m-s.ch', 'ops-team@m-s.ch'],
  notification_error_emails: ['alerts@m-s.ch', 'oncall@m-s.ch'],
  created_at: daysAgo(90),
  updated_at: hoursAgo(2),
};

export const mockRepositories: MirrorRepository[] = [
  // Platform project
  { id: 'repo-001', user_id: USER_ID, repository_id: 'azdo-r001', project_name: 'Platform', repository_name: 'platform-core', remote_url: 'https://dev.azure.com/ms-software-engineering/Platform/_git/platform-core', local_path: '/opt/azdo-mirror-backup/repos/Platform/platform-core.git', status: 'active', last_synced_at: hoursAgo(2), last_error: null, size_bytes: 524_288_000, branch_count: 42, tag_count: 128, is_ignored: false, created_at: daysAgo(90), updated_at: hoursAgo(2) },
  { id: 'repo-002', user_id: USER_ID, repository_id: 'azdo-r002', project_name: 'Platform', repository_name: 'platform-api', remote_url: 'https://dev.azure.com/ms-software-engineering/Platform/_git/platform-api', local_path: '/opt/azdo-mirror-backup/repos/Platform/platform-api.git', status: 'active', last_synced_at: hoursAgo(2), last_error: null, size_bytes: 156_000_000, branch_count: 18, tag_count: 65, is_ignored: false, created_at: daysAgo(85), updated_at: hoursAgo(2) },
  { id: 'repo-003', user_id: USER_ID, repository_id: 'azdo-r003', project_name: 'Platform', repository_name: 'platform-sdk', remote_url: 'https://dev.azure.com/ms-software-engineering/Platform/_git/platform-sdk', local_path: '/opt/azdo-mirror-backup/repos/Platform/platform-sdk.git', status: 'active', last_synced_at: hoursAgo(2), last_error: null, size_bytes: 89_000_000, branch_count: 12, tag_count: 34, is_ignored: false, created_at: daysAgo(80), updated_at: hoursAgo(2) },
  { id: 'repo-004', user_id: USER_ID, repository_id: 'azdo-r004', project_name: 'Platform', repository_name: 'platform-docs', remote_url: 'https://dev.azure.com/ms-software-engineering/Platform/_git/platform-docs', local_path: '/opt/azdo-mirror-backup/repos/Platform/platform-docs.git', status: 'active', last_synced_at: hoursAgo(2), last_error: null, size_bytes: 12_000_000, branch_count: 3, tag_count: 10, is_ignored: false, created_at: daysAgo(75), updated_at: hoursAgo(2) },
  { id: 'repo-005', user_id: USER_ID, repository_id: 'azdo-r005', project_name: 'Platform', repository_name: 'legacy-auth-module', remote_url: 'https://dev.azure.com/ms-software-engineering/Platform/_git/legacy-auth-module', local_path: '/opt/azdo-mirror-backup/repos/Platform/legacy-auth-module.git', status: 'active', last_synced_at: hoursAgo(2), last_error: null, size_bytes: 45_000_000, branch_count: 5, tag_count: 22, is_ignored: false, created_at: daysAgo(90), updated_at: hoursAgo(2) },

  // WebApps project
  { id: 'repo-006', user_id: USER_ID, repository_id: 'azdo-r006', project_name: 'WebApps', repository_name: 'customer-portal', remote_url: 'https://dev.azure.com/ms-software-engineering/WebApps/_git/customer-portal', local_path: '/opt/azdo-mirror-backup/repos/WebApps/customer-portal.git', status: 'active', last_synced_at: hoursAgo(2), last_error: null, size_bytes: 312_000_000, branch_count: 28, tag_count: 95, is_ignored: false, created_at: daysAgo(88), updated_at: hoursAgo(2) },
  { id: 'repo-007', user_id: USER_ID, repository_id: 'azdo-r007', project_name: 'WebApps', repository_name: 'admin-dashboard', remote_url: 'https://dev.azure.com/ms-software-engineering/WebApps/_git/admin-dashboard', local_path: '/opt/azdo-mirror-backup/repos/WebApps/admin-dashboard.git', status: 'active', last_synced_at: hoursAgo(2), last_error: null, size_bytes: 198_000_000, branch_count: 15, tag_count: 42, is_ignored: false, created_at: daysAgo(70), updated_at: hoursAgo(2) },
  { id: 'repo-008', user_id: USER_ID, repository_id: 'azdo-r008', project_name: 'WebApps', repository_name: 'mobile-app-backend', remote_url: 'https://dev.azure.com/ms-software-engineering/WebApps/_git/mobile-app-backend', local_path: '/opt/azdo-mirror-backup/repos/WebApps/mobile-app-backend.git', status: 'error', last_synced_at: hoursAgo(26), last_error: 'mockData.errors.httpForbidden', size_bytes: 78_000_000, branch_count: 9, tag_count: 18, is_ignored: false, created_at: daysAgo(60), updated_at: hoursAgo(2) },
  { id: 'repo-009', user_id: USER_ID, repository_id: 'azdo-r009', project_name: 'WebApps', repository_name: 'design-system', remote_url: 'https://dev.azure.com/ms-software-engineering/WebApps/_git/design-system', local_path: '/opt/azdo-mirror-backup/repos/WebApps/design-system.git', status: 'active', last_synced_at: hoursAgo(2), last_error: null, size_bytes: 234_000_000, branch_count: 7, tag_count: 55, is_ignored: false, created_at: daysAgo(65), updated_at: hoursAgo(2) },

  // Infrastructure project
  { id: 'repo-010', user_id: USER_ID, repository_id: 'azdo-r010', project_name: 'Infrastructure', repository_name: 'terraform-modules', remote_url: 'https://dev.azure.com/ms-software-engineering/Infrastructure/_git/terraform-modules', local_path: '/opt/azdo-mirror-backup/repos/Infrastructure/terraform-modules.git', status: 'active', last_synced_at: hoursAgo(2), last_error: null, size_bytes: 23_000_000, branch_count: 8, tag_count: 45, is_ignored: false, created_at: daysAgo(82), updated_at: hoursAgo(2) },
  { id: 'repo-011', user_id: USER_ID, repository_id: 'azdo-r011', project_name: 'Infrastructure', repository_name: 'k8s-manifests', remote_url: 'https://dev.azure.com/ms-software-engineering/Infrastructure/_git/k8s-manifests', local_path: '/opt/azdo-mirror-backup/repos/Infrastructure/k8s-manifests.git', status: 'active', last_synced_at: hoursAgo(2), last_error: null, size_bytes: 8_500_000, branch_count: 4, tag_count: 30, is_ignored: false, created_at: daysAgo(78), updated_at: hoursAgo(2) },
  { id: 'repo-012', user_id: USER_ID, repository_id: 'azdo-r012', project_name: 'Infrastructure', repository_name: 'ci-cd-templates', remote_url: 'https://dev.azure.com/ms-software-engineering/Infrastructure/_git/ci-cd-templates', local_path: '/opt/azdo-mirror-backup/repos/Infrastructure/ci-cd-templates.git', status: 'active', last_synced_at: hoursAgo(2), last_error: null, size_bytes: 5_200_000, branch_count: 6, tag_count: 20, is_ignored: false, created_at: daysAgo(75), updated_at: hoursAgo(2) },
  { id: 'repo-013', user_id: USER_ID, repository_id: 'azdo-r013', project_name: 'Infrastructure', repository_name: 'archive-monitoring-v1', remote_url: 'https://dev.azure.com/ms-software-engineering/Infrastructure/_git/archive-monitoring-v1', local_path: '/opt/azdo-mirror-backup/repos/Infrastructure/archive-monitoring-v1.git', status: 'active', last_synced_at: hoursAgo(2), last_error: null, size_bytes: 15_000_000, branch_count: 2, tag_count: 8, is_ignored: true, created_at: daysAgo(90), updated_at: hoursAgo(2) },

  // DataPipelines project
  { id: 'repo-014', user_id: USER_ID, repository_id: 'azdo-r014', project_name: 'DataPipelines', repository_name: 'etl-framework', remote_url: 'https://dev.azure.com/ms-software-engineering/DataPipelines/_git/etl-framework', local_path: '/opt/azdo-mirror-backup/repos/DataPipelines/etl-framework.git', status: 'active', last_synced_at: hoursAgo(2), last_error: null, size_bytes: 67_000_000, branch_count: 11, tag_count: 28, is_ignored: false, created_at: daysAgo(55), updated_at: hoursAgo(2) },
  { id: 'repo-015', user_id: USER_ID, repository_id: 'azdo-r015', project_name: 'DataPipelines', repository_name: 'spark-jobs', remote_url: 'https://dev.azure.com/ms-software-engineering/DataPipelines/_git/spark-jobs', local_path: '/opt/azdo-mirror-backup/repos/DataPipelines/spark-jobs.git', status: 'active', last_synced_at: hoursAgo(2), last_error: null, size_bytes: 145_000_000, branch_count: 14, tag_count: 38, is_ignored: false, created_at: daysAgo(50), updated_at: hoursAgo(2) },
  { id: 'repo-016', user_id: USER_ID, repository_id: 'azdo-r016', project_name: 'DataPipelines', repository_name: 'data-lake-ingestion', remote_url: 'https://dev.azure.com/ms-software-engineering/DataPipelines/_git/data-lake-ingestion', local_path: '/opt/azdo-mirror-backup/repos/DataPipelines/data-lake-ingestion.git', status: 'pending', last_synced_at: null, last_error: null, size_bytes: 0, branch_count: 0, tag_count: 0, is_ignored: false, created_at: hoursAgo(1), updated_at: hoursAgo(1) },

  // Orphaned repo
  { id: 'repo-017', user_id: USER_ID, repository_id: 'azdo-r017', project_name: 'Platform', repository_name: 'deprecated-utils', remote_url: 'https://dev.azure.com/ms-software-engineering/Platform/_git/deprecated-utils', local_path: '/opt/azdo-mirror-backup/repos/Platform/deprecated-utils.git', status: 'orphaned', last_synced_at: daysAgo(30), last_error: 'mockData.errors.repoNotFound', size_bytes: 3_200_000, branch_count: 1, tag_count: 5, is_ignored: false, created_at: daysAgo(90), updated_at: daysAgo(1) },

  // Ignored repo
  { id: 'repo-018', user_id: USER_ID, repository_id: 'azdo-r018', project_name: 'WebApps', repository_name: 'test-sandbox', remote_url: 'https://dev.azure.com/ms-software-engineering/WebApps/_git/test-sandbox', local_path: '/opt/azdo-mirror-backup/repos/WebApps/test-sandbox.git', status: 'active', last_synced_at: daysAgo(5), last_error: null, size_bytes: 1_100_000, branch_count: 2, tag_count: 0, is_ignored: true, created_at: daysAgo(40), updated_at: daysAgo(5) },
];

function getIgnoreRules(): IgnoreRule[] {
  return [
    { id: 'rule-001', user_id: USER_ID, pattern: 'test-sandbox', rule_type: 'repository', description: t('mockData.ignoreRules.sandboxDesc'), is_active: true, matched_count: 1, created_at: daysAgo(30), updated_at: daysAgo(30) },
    { id: 'rule-002', user_id: USER_ID, pattern: '*/archive-*', rule_type: 'wildcard', description: t('mockData.ignoreRules.archiveDesc'), is_active: true, matched_count: 1, created_at: daysAgo(28), updated_at: daysAgo(28) },
    { id: 'rule-003', user_id: USER_ID, pattern: 'Sandbox/experimental-tool', rule_type: 'project_repository', description: t('mockData.ignoreRules.experimentalDesc'), is_active: false, matched_count: 0, created_at: daysAgo(20), updated_at: daysAgo(15) },
    { id: 'rule-004', user_id: USER_ID, pattern: '*/temp-*', rule_type: 'wildcard', description: t('mockData.ignoreRules.tempDesc'), is_active: true, matched_count: 0, created_at: daysAgo(10), updated_at: daysAgo(10) },
  ];
}

function buildLogEntries(baseTime: string, repoCount: number, failedRepos: string[]): LogEntry[] {
  const base = new Date(baseTime).getTime();
  const entries: LogEntry[] = [
    { timestamp: new Date(base).toISOString(), level: 'info', message: t('mockData.logs.runStarted') },
    { timestamp: new Date(base + 2000).toISOString(), level: 'info', message: t('mockData.logs.reposDetected', { count: repoCount }) },
    { timestamp: new Date(base + 5000).toISOString(), level: 'info', message: t('mockData.logs.syncStarted', { count: 6 }) },
  ];

  let offset = 8000;
  for (let i = 1; i <= repoCount - failedRepos.length - 2; i++) {
    if (i % 4 === 0) {
      entries.push({ timestamp: new Date(base + offset).toISOString(), level: 'info', message: t('mockData.logs.syncProgress', { current: i, total: repoCount }) });
    }
    offset += 3000;
  }

  for (const repo of failedRepos) {
    entries.push({ timestamp: new Date(base + offset).toISOString(), level: 'error', message: t('mockData.logs.syncFailed'), repository: repo, project: 'WebApps' });
    offset += 1000;
  }

  entries.push({ timestamp: new Date(base + offset + 2000).toISOString(), level: 'info', message: t('mockData.logs.runCompleted') });
  return entries;
}

function getMirrorRuns(): MirrorRun[] {
  return [
    { id: 'run-001', user_id: USER_ID, job_id: 'sched-20260531-020000', trigger_type: 'scheduled', status: 'completed', started_at: hoursAgo(2), completed_at: hoursAgo(1.5), total_repositories: 18, synced_count: 15, failed_count: 1, skipped_count: 2, new_repos_count: 1, error_summary: t('mockData.errors.repoFailed', { count: 1, repo: 'mobile-app-backend' }), log_entries: buildLogEntries(hoursAgo(2), 18, ['mobile-app-backend']), created_at: hoursAgo(2) },
    { id: 'run-002', user_id: USER_ID, job_id: 'sched-20260530-020000', trigger_type: 'scheduled', status: 'completed', started_at: hoursAgo(26), completed_at: hoursAgo(25.4), total_repositories: 17, synced_count: 15, failed_count: 0, skipped_count: 2, new_repos_count: 0, error_summary: null, log_entries: buildLogEntries(hoursAgo(26), 17, []), created_at: hoursAgo(26) },
    { id: 'run-003', user_id: USER_ID, job_id: 'manual-20260529-143022', trigger_type: 'manual', status: 'completed', started_at: hoursAgo(50), completed_at: hoursAgo(49.3), total_repositories: 17, synced_count: 15, failed_count: 0, skipped_count: 2, new_repos_count: 0, error_summary: null, log_entries: buildLogEntries(hoursAgo(50), 17, []), created_at: hoursAgo(50) },
    { id: 'run-004', user_id: USER_ID, job_id: 'sched-20260529-020000', trigger_type: 'scheduled', status: 'completed', started_at: daysAgo(2.9), completed_at: daysAgo(2.85), total_repositories: 17, synced_count: 14, failed_count: 1, skipped_count: 2, new_repos_count: 0, error_summary: t('mockData.errors.repoFailed', { count: 1, repo: 'mobile-app-backend' }), log_entries: buildLogEntries(daysAgo(2.9), 17, ['mobile-app-backend']), created_at: daysAgo(2.9) },
    { id: 'run-005', user_id: USER_ID, job_id: 'sched-20260528-020000', trigger_type: 'scheduled', status: 'completed', started_at: daysAgo(3.9), completed_at: daysAgo(3.85), total_repositories: 17, synced_count: 15, failed_count: 0, skipped_count: 2, new_repos_count: 0, error_summary: null, log_entries: buildLogEntries(daysAgo(3.9), 17, []), created_at: daysAgo(3.9) },
    { id: 'run-006', user_id: USER_ID, job_id: 'sched-20260527-020000', trigger_type: 'scheduled', status: 'completed', started_at: daysAgo(4.9), completed_at: daysAgo(4.85), total_repositories: 16, synced_count: 14, failed_count: 0, skipped_count: 2, new_repos_count: 0, error_summary: null, log_entries: buildLogEntries(daysAgo(4.9), 16, []), created_at: daysAgo(4.9) },
    { id: 'run-007', user_id: USER_ID, job_id: 'manual-20260525-091500', trigger_type: 'manual', status: 'failed', started_at: daysAgo(6), completed_at: daysAgo(5.98), total_repositories: 16, synced_count: 0, failed_count: 16, skipped_count: 0, new_repos_count: 0, error_summary: t('mockData.errors.patExpired'), log_entries: [
      { timestamp: daysAgo(6), level: 'info', message: t('mockData.logs.runStarted') },
      { timestamp: daysAgo(6), level: 'error', message: t('mockData.logs.authFailed') },
      { timestamp: daysAgo(6), level: 'error', message: t('mockData.logs.allReposFailed', { count: 16 }) },
    ], created_at: daysAgo(6) },
  ];
}

// Mutable copy for runtime state management
let _settings: MirrorSettings | null = { ...mockSettings };
let _repositories: MirrorRepository[] = mockRepositories.map(r => ({ ...r }));
let _ignoreRules: IgnoreRule[] = getIgnoreRules();
let _mirrorRuns: MirrorRun[] = getMirrorRuns();

// Re-generate translated data when language changes
i18n.on('languageChanged', () => {
  _ignoreRules = getIgnoreRules();
  _mirrorRuns = getMirrorRuns();
  _repositories = mockRepositories.map(r => ({
    ...r,
    last_error: r.last_error ? t(r.last_error) : null,
  }));
});

export function getMutableState() {
  return {
    get settings() { return _settings; },
    set settings(v: MirrorSettings | null) { _settings = v; },
    get repositories() { return _repositories; },
    set repositories(v: MirrorRepository[]) { _repositories = v; },
    get ignoreRules() { return _ignoreRules; },
    set ignoreRules(v: IgnoreRule[]) { _ignoreRules = v; },
    get mirrorRuns() { return _mirrorRuns; },
    set mirrorRuns(v: MirrorRun[]) { _mirrorRuns = v; },
  };
}
