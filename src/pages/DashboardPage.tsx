// Dashboard overview page
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import StorageIcon from '@mui/icons-material/Storage';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ScheduleIcon from '@mui/icons-material/Schedule';
import SyncIcon from '@mui/icons-material/Sync';
import { api } from '../lib/api';
import type { MirrorRun } from '../types/database';

interface RepoStats {
  total: number;
  active: number;
  error: number;
  orphaned: number;
  pending: number;
  ignored: number;
  totalSizeBytes: number;
  totalBranches: number;
  totalTags: number;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

function useFormatRelativeTime() {
  const { t } = useTranslation();
  return (iso: string): string => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60_000);
    if (mins < 60) return t('time.minutesAgo', { count: mins });
    const hours = Math.floor(mins / 60);
    if (hours < 24) return t('time.hoursAgo', { count: hours });
    return t('time.daysAgo', { count: Math.floor(hours / 24) });
  };
}

function StatCard({ title, value, icon, color }: { title: string; value: string | number; icon: ReactNode; color?: string }) {
  return (
    <Card>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ color: color || 'primary.main' }}>{icon}</Box>
        <Box>
          <Typography variant="body2" color="text.secondary">{title}</Typography>
          <Typography variant="h5" fontWeight={700}>{value}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<RepoStats | null>(null);
  const [latestRun, setLatestRun] = useState<MirrorRun | null>(null);
  const [loading, setLoading] = useState(true);
  const { t, i18n: i18nInstance } = useTranslation();
  const formatRelativeTime = useFormatRelativeTime();

  useEffect(() => {
    (async () => {
      try {
        const [s, r] = await Promise.all([api.repositories.getStats(), api.mirrorRuns.getLatest()]);
        setStats(s);
        setLatestRun(r);
      } finally {
        setLoading(false);
      }
    })();
  }, [i18nInstance.language]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}><CircularProgress /></Box>;
  if (!stats) return <Alert severity="warning">{t('common.noData')}</Alert>;

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>{t('dashboard.title')}</Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}><StatCard title={t('dashboard.totalRepos')} value={stats.total} icon={<StorageIcon fontSize="large" />} /></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}><StatCard title={t('dashboard.active')} value={stats.active} icon={<CheckCircleIcon fontSize="large" />} color="success.main" /></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}><StatCard title={t('dashboard.errors')} value={stats.error} icon={<ErrorIcon fontSize="large" />} color="error.main" /></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}><StatCard title={t('dashboard.orphaned')} value={stats.orphaned} icon={<HelpOutlineIcon fontSize="large" />} color="warning.main" /></Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}><StatCard title={t('dashboard.storage')} value={formatBytes(stats.totalSizeBytes)} icon={<StorageIcon fontSize="large" />} color="secondary.main" /></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}><StatCard title={t('dashboard.totalBranches')} value={stats.totalBranches} icon={<SyncIcon fontSize="large" />} color="secondary.main" /></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}><StatCard title={t('dashboard.totalTags')} value={stats.totalTags} icon={<ScheduleIcon fontSize="large" />} color="secondary.main" /></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}><StatCard title={t('dashboard.ignored')} value={stats.ignored} icon={<ScheduleIcon fontSize="large" />} color="text.secondary" /></Grid>
      </Grid>

      {latestRun && (
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>{t('dashboard.lastRun')}</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
              <Chip label={t(`status.${latestRun.status}`)} color={latestRun.status === 'completed' ? 'success' : latestRun.status === 'failed' ? 'error' : 'info'} size="small" />
              <Typography variant="body2" color="text.secondary">{formatRelativeTime(latestRun.started_at)}</Typography>
              <Typography variant="body2">{latestRun.synced_count} {t('dashboard.synced')}, {latestRun.failed_count} {t('dashboard.failed')}, {latestRun.skipped_count} {t('dashboard.skipped')}</Typography>
              <Chip label={latestRun.trigger_type === 'scheduled' ? t('status.scheduled') : t('status.manual')} variant="outlined" size="small" />
            </Box>
            {latestRun.error_summary && <Alert severity="warning" sx={{ mt: 2 }}>{latestRun.error_summary}</Alert>}
          </CardContent>
        </Card>
      )}
    </Box>
  );
}