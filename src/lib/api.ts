// API service layer
// Organizations: real Supabase calls
// Other entities: mock data (will be migrated later)
import type { MirrorSettings, MirrorRepository, IgnoreRule, MirrorRun, SourceOrganization, SourceOrganizationRow, RemoteProject } from '../types/database';
import { getMutableState } from './mockData';
import { supabase } from './supabase';
import i18n from '../i18n';

const DELAY = 300;

function delay(ms = DELAY): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// Mock user for auth
const MOCK_USER = {
  id: 'mock-user-001',
  email: 'git-mirror@m-s.ch',
  name: 'Max Mustermann',
};

type MockUser = typeof MOCK_USER;
type MockSession = { access_token: string; expires_at: number } | null;

let _currentUser: MockUser | null = null;
let _session: MockSession = null;

// Convert DB row to frontend type
function rowToOrganization(row: SourceOrganizationRow): SourceOrganization {
  if (row.provider === 'github') {
    return {
      id: row.id,
      name: row.name,
      url: row.url,
      provider: 'github',
      tags: row.tags ?? [],
      pat: row.pat,
      pat_expiry: row.pat_expiry ?? '',
    };
  }
  return {
    id: row.id,
    name: row.name,
    url: row.url,
    provider: 'azure_devops',
    tags: row.tags ?? [],
    pat: row.pat,
    pat_expiry: row.pat_expiry ?? '',
  };
}

export const api = {
  // --- Auth ---
  auth: {
    async signIn(email: string, _password: string): Promise<{ user: MockUser; session: MockSession }> {
      await delay();
      _currentUser = { ...MOCK_USER, email };
      _session = { access_token: 'mock-token-' + Date.now(), expires_at: Date.now() + 86400_000 };
      return { user: _currentUser, session: _session };
    },

    async signUp(email: string, _password: string): Promise<{ user: MockUser; session: MockSession }> {
      await delay();
      _currentUser = { ...MOCK_USER, email };
      _session = { access_token: 'mock-token-' + Date.now(), expires_at: Date.now() + 86400_000 };
      return { user: _currentUser, session: _session };
    },

    async signOut(): Promise<void> {
      await delay(100);
      _currentUser = null;
      _session = null;
    },

    async getSession(): Promise<{ user: MockUser | null; session: MockSession }> {
      await delay(100);
      return { user: _currentUser, session: _session };
    },

    async signInWithEntraId(): Promise<never> {
      throw new Error('Entra ID Anmeldung ist derzeit deaktiviert.');
    },

    get entraIdEnabled() {
      return false;
    },
  },

  // --- Organizations (Supabase) ---
  organizations: {
    async list(): Promise<SourceOrganization[]> {
      const { data, error } = await supabase
        .from('source_organizations')
        .select('*')
        .order('created_at', { ascending: true });
      if (error) throw error;
      return (data as SourceOrganizationRow[]).map(rowToOrganization);
    },

    async save(orgs: SourceOrganization[]): Promise<void> {
      // Fetch current DB state to determine inserts, updates, deletes
      const { data: existing, error: fetchError } = await supabase
        .from('source_organizations')
        .select('id');
      if (fetchError) throw fetchError;

      const existingIds = new Set((existing ?? []).map((r: { id: string }) => r.id));
      const incomingIds = new Set(orgs.map(o => o.id));

      // Delete removed orgs
      const toDelete = [...existingIds].filter(id => !incomingIds.has(id));
      if (toDelete.length > 0) {
        const { error } = await supabase
          .from('source_organizations')
          .delete()
          .in('id', toDelete);
        if (error) throw error;
      }

      // Upsert all current orgs
      if (orgs.length > 0) {
        const rows = orgs.map(org => ({
          id: org.id,
          name: org.name,
          url: org.url,
          provider: org.provider,
          tags: org.tags ?? [],
          pat: org.pat,
          pat_expiry: org.pat_expiry || null,
          updated_at: new Date().toISOString(),
        }));
        const { error } = await supabase
          .from('source_organizations')
          .upsert(rows, { onConflict: 'id' });
        if (error) throw error;
      }
    },

    async fetchProjects(provider: string, orgUrl: string, pat: string): Promise<RemoteProject[]> {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const response = await fetch(`${supabaseUrl}/functions/v1/fetch-projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({ provider, orgUrl, pat }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${response.status}`);
      }
      const data = await response.json();
      return data.projects as RemoteProject[];
    },
  },

  // --- Settings (mock, ohne organizations) ---
  settings: {
    async get(): Promise<MirrorSettings | null> {
      await delay();
      const state = getMutableState();
      return state.settings ? { ...state.settings } : null;
    },

    async save(data: Partial<MirrorSettings>): Promise<MirrorSettings> {
      await delay();
      const state = getMutableState();
      if (!state.settings) {
        const newSettings: MirrorSettings = {
          id: generateId('settings'),
          user_id: MOCK_USER.id,
          storage_path: '',
          schedule_cron: '0 2 * * *',
          schedule_enabled: false,
          max_parallel_jobs: 4,
          notification_daily_emails: [],
          notification_error_emails: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...data,
        };
        state.settings = newSettings;
      } else {
        state.settings = { ...state.settings, ...data, updated_at: new Date().toISOString() };
      }
      return { ...state.settings };
    },
  },

  // --- Repositories (mock) ---
  repositories: {
    async list(filters?: {
      status?: MirrorRepository['status'];
      project?: string;
      search?: string;
    }): Promise<MirrorRepository[]> {
      await delay();
      const state = getMutableState();
      let repos = [...state.repositories];
      if (filters?.status) repos = repos.filter(r => r.status === filters.status);
      if (filters?.project) repos = repos.filter(r => r.project_name === filters.project);
      if (filters?.search) {
        const s = filters.search.toLowerCase();
        repos = repos.filter(r => r.repository_name.toLowerCase().includes(s) || r.project_name.toLowerCase().includes(s));
      }
      return repos.map(r => ({ ...r }));
    },

    async getById(id: string): Promise<MirrorRepository | null> {
      await delay();
      const state = getMutableState();
      const repo = state.repositories.find(r => r.id === id);
      return repo ? { ...repo } : null;
    },

    async getStats(): Promise<{
      total: number; active: number; error: number; orphaned: number;
      pending: number; ignored: number; totalSizeBytes: number;
      totalBranches: number; totalTags: number;
    }> {
      await delay(150);
      const state = getMutableState();
      const repos = state.repositories;
      return {
        total: repos.length,
        active: repos.filter(r => r.status === 'active' && !r.is_ignored).length,
        error: repos.filter(r => r.status === 'error').length,
        orphaned: repos.filter(r => r.status === 'orphaned').length,
        pending: repos.filter(r => r.status === 'pending').length,
        ignored: repos.filter(r => r.is_ignored).length,
        totalSizeBytes: repos.reduce((sum, r) => sum + r.size_bytes, 0),
        totalBranches: repos.reduce((sum, r) => sum + r.branch_count, 0),
        totalTags: repos.reduce((sum, r) => sum + r.tag_count, 0),
      };
    },
  },

  // --- Ignore Rules (mock) ---
  ignoreRules: {
    async list(): Promise<IgnoreRule[]> {
      await delay();
      return getMutableState().ignoreRules.map(r => ({ ...r }));
    },

    async create(data: { pattern: string; rule_type: IgnoreRule['rule_type']; description: string }): Promise<IgnoreRule> {
      await delay();
      const state = getMutableState();
      const rule: IgnoreRule = {
        id: generateId('rule'), user_id: MOCK_USER.id, pattern: data.pattern,
        rule_type: data.rule_type, description: data.description, is_active: true,
        matched_count: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
      };
      state.ignoreRules = [...state.ignoreRules, rule];
      return { ...rule };
    },

    async update(id: string, data: Partial<IgnoreRule>): Promise<IgnoreRule> {
      await delay();
      const state = getMutableState();
      const idx = state.ignoreRules.findIndex(r => r.id === id);
      if (idx === -1) throw new Error('Regel nicht gefunden');
      const updated = { ...state.ignoreRules[idx], ...data, updated_at: new Date().toISOString() };
      state.ignoreRules = state.ignoreRules.map(r => r.id === id ? updated : r);
      return { ...updated };
    },

    async remove(id: string): Promise<void> {
      await delay();
      const state = getMutableState();
      state.ignoreRules = state.ignoreRules.filter(r => r.id !== id);
    },
  },

  // --- Mirror Runs (mock) ---
  mirrorRuns: {
    async list(limit = 20): Promise<MirrorRun[]> {
      await delay();
      return getMutableState().mirrorRuns
        .sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime())
        .slice(0, limit)
        .map(r => ({ ...r }));
    },

    async getById(id: string): Promise<MirrorRun | null> {
      await delay();
      const run = getMutableState().mirrorRuns.find(r => r.id === id);
      return run ? { ...run } : null;
    },

    async trigger(): Promise<MirrorRun> {
      await delay(500);
      const state = getMutableState();
      const repos = state.repositories.filter(r => !r.is_ignored);
      const run: MirrorRun = {
        id: generateId('run'), user_id: MOCK_USER.id,
        job_id: `manual-${new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14)}`,
        trigger_type: 'manual', status: 'running', started_at: new Date().toISOString(),
        completed_at: null, total_repositories: repos.length, synced_count: 0,
        failed_count: 0, skipped_count: 0, new_repos_count: 0, error_summary: null,
        log_entries: [
          { timestamp: new Date().toISOString(), level: 'info', message: i18n.t('mockData.logs.runStarted') },
          { timestamp: new Date().toISOString(), level: 'info', message: i18n.t('mockData.logs.reposDetected', { count: repos.length }) },
        ],
        created_at: new Date().toISOString(),
      };
      state.mirrorRuns = [run, ...state.mirrorRuns];

      // Simulate completion after 3 seconds
      setTimeout(() => {
        const errorRepos = repos.filter(r => r.status === 'error');
        const ignoredCount = state.repositories.filter(r => r.is_ignored).length;
        run.status = 'completed';
        run.completed_at = new Date().toISOString();
        run.synced_count = repos.length - errorRepos.length - ignoredCount;
        run.failed_count = errorRepos.length;
        run.skipped_count = ignoredCount;
        run.error_summary = errorRepos.length > 0
          ? i18n.t('mockData.errors.repoFailed', { count: errorRepos.length, repo: errorRepos.map(r => r.repository_name).join(', ') })
          : null;
        run.log_entries.push({ timestamp: new Date().toISOString(), level: 'info', message: i18n.t('mockData.logs.runCompleted') });
      }, 3000);

      return { ...run };
    },

    async getLatest(): Promise<MirrorRun | null> {
      await delay(150);
      const runs = getMutableState().mirrorRuns;
      if (runs.length === 0) return null;
      const sorted = [...runs].sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime());
      return { ...sorted[0] };
    },
  },
};
