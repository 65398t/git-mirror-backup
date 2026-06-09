// Repository inventory page with filtering
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { api } from '../lib/api';
import type { MirrorRepository, SourceOrganization } from '../types/database';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

export default function RepositoriesPage() {
  const [repos, setRepos] = useState<MirrorRepository[]>([]);
  const [organizations, setOrganizations] = useState<SourceOrganization[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [projectFilter, setProjectFilter] = useState<string>('');
  const { t, i18n: i18nInstance } = useTranslation();

  const formatRelativeTime = (iso: string | null): string => {
    if (!iso) return t('time.never');
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60_000);
    if (mins < 60) return t('time.minutesAgo', { count: mins });
    const hours = Math.floor(mins / 60);
    if (hours < 24) return t('time.hoursAgo', { count: hours });
    return t('time.daysAgo', { count: Math.floor(hours / 24) });
  };

  useEffect(() => {
    (async () => {
      try {
        const [r, orgs] = await Promise.all([api.repositories.list(), api.organizations.list()]);
        setRepos(r);
        setOrganizations(orgs);
      } finally {
        setLoading(false);
      }
    })();
  }, [i18nInstance.language]);

  const filteredRepos = repos.filter(r => {
    if (statusFilter && r.status !== statusFilter) return false;
    if (projectFilter && r.project_name !== projectFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      if (!r.repository_name.toLowerCase().includes(s) && !r.project_name.toLowerCase().includes(s)) return false;
    }
    return true;
  });

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}><CircularProgress /></Box>;

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>{t('repositories.title')}</Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField size="small" placeholder={t('common.search')} value={search} onChange={e => setSearch(e.target.value)}
            slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> } }}
            sx={{ minWidth: 220 }} />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>{t('repositories.status')}</InputLabel>
            <Select value={statusFilter} label={t('repositories.status')} onChange={e => setStatusFilter(e.target.value)}>
              <MenuItem value="">{t('common.all')}</MenuItem>
              <MenuItem value="active">{t('status.active')}</MenuItem>
              <MenuItem value="error">{t('status.error')}</MenuItem>
              <MenuItem value="orphaned">{t('status.orphaned')}</MenuItem>
              <MenuItem value="pending">{t('status.pending')}</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>{t('repositories.project')}</InputLabel>
            <Select value={projectFilter} label={t('repositories.project')} onChange={e => setProjectFilter(e.target.value)}>
              <MenuItem value="">{t('common.all')}</MenuItem>
              {organizations.flatMap(o => o.tags ?? []).filter((p, i, a) => a.indexOf(p) === i).map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
            </Select>
          </FormControl>
          <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center', ml: 'auto' }}>
            {t('repositories.countOfTotal', { filtered: filteredRepos.length, total: repos.length })}
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t('repositories.repository')}</TableCell>
                <TableCell>{t('repositories.project')}</TableCell>
                <TableCell>{t('repositories.status')}</TableCell>
                <TableCell align="right">{t('repositories.size')}</TableCell>
                <TableCell align="right">{t('repositories.branches')}</TableCell>
                <TableCell align="right">{t('repositories.tags')}</TableCell>
                <TableCell>{t('repositories.lastSync')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRepos.map(repo => (
                <TableRow key={repo.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>{repo.repository_name}</Typography>
                    {repo.is_ignored && <Chip label={t('repositories.ignored')} size="small" sx={{ ml: 1 }} />}
                  </TableCell>
                  <TableCell>{repo.project_name}</TableCell>
                  <TableCell><Chip label={t(`status.${repo.status}`)} color={({ active: 'success', error: 'error', orphaned: 'warning', pending: 'info' } as const)[repo.status] || 'default'} size="small" /></TableCell>
                  <TableCell align="right">{formatBytes(repo.size_bytes)}</TableCell>
                  <TableCell align="right">{repo.branch_count}</TableCell>
                  <TableCell align="right">{repo.tag_count}</TableCell>
                  <TableCell>{formatRelativeTime(repo.last_synced_at)}</TableCell>
                </TableRow>
              ))}
              {filteredRepos.length === 0 && (
                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4 }}><Typography color="text.secondary">{t('repositories.noRepos')}</Typography></TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}