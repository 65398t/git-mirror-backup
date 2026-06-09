// Mirror runs history with manual trigger
import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { api } from '../lib/api';
import type { MirrorRun } from '../types/database';
import ScrollContainer from '../components/ScrollContainer';

function useDateLocale() {
  const { i18n } = useTranslation();
  const localeMap: Record<string, string> = { de: 'de-DE', en: 'en-GB', fr: 'fr-FR' };
  return localeMap[i18n.language] || 'de-DE';
}

export default function MirrorRunsPage() {
  const [runs, setRuns] = useState<MirrorRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { t, i18n: i18nInstance } = useTranslation();
  const dateLocale = useDateLocale();

  const formatDateTime = (iso: string): string => {
    return new Date(iso).toLocaleString(dateLocale, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (start: string, end: string | null): string => {
    if (!end) return t('time.runningDuration');
    const secs = Math.floor((new Date(end).getTime() - new Date(start).getTime()) / 1000);
    const mins = Math.floor(secs / 60);
    return mins > 0 ? `${mins}m ${secs % 60}s` : `${secs}s`;
  };

  const loadRuns = useCallback(async () => {
    try { setRuns(await api.mirrorRuns.list()); } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadRuns(); }, [loadRuns, i18nInstance.language]);

  const handleTrigger = async () => {
    setTriggering(true);
    try { await api.mirrorRuns.trigger(); setTimeout(loadRuns, 500); } finally { setTriggering(false); }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}><CircularProgress /></Box>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>{t('mirrorRuns.title')}</Typography>
        <Button variant="contained" startIcon={triggering ? <CircularProgress size={18} color="inherit" /> : <PlayArrowIcon />} onClick={handleTrigger} disabled={triggering}>
          {triggering ? t('mirrorRuns.triggering') : t('mirrorRuns.triggerButton')}
        </Button>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width={40} />
                <TableCell>{t('mirrorRuns.timestamp')}</TableCell>
                <TableCell>{t('mirrorRuns.type')}</TableCell>
                <TableCell>{t('mirrorRuns.status')}</TableCell>
                <TableCell align="right">{t('mirrorRuns.sync')}</TableCell>
                <TableCell align="right">{t('mirrorRuns.errors')}</TableCell>
                <TableCell align="right">{t('mirrorRuns.skipped')}</TableCell>
                <TableCell align="right">{t('mirrorRuns.new')}</TableCell>
                <TableCell>{t('mirrorRuns.duration')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {runs.map(run => (
                <React.Fragment key={run.id}>
                  <TableRow hover>
                    <TableCell>
                      <IconButton size="small" onClick={() => setExpandedId(expandedId === run.id ? null : run.id)}>
                        {expandedId === run.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </TableCell>
                    <TableCell>{formatDateTime(run.started_at)}</TableCell>
                    <TableCell><Chip label={run.trigger_type === 'scheduled' ? t('status.scheduled') : t('status.manual')} variant="outlined" size="small" /></TableCell>
                    <TableCell><Chip label={t(`status.${run.status}`)} color={({ completed: 'success', failed: 'error', running: 'info', cancelled: 'warning' } as const)[run.status] || 'default'} size="small" /></TableCell>
                    <TableCell align="right">{run.synced_count}</TableCell>
                    <TableCell align="right">{run.failed_count}</TableCell>
                    <TableCell align="right">{run.skipped_count}</TableCell>
                    <TableCell align="right">{run.new_repos_count}</TableCell>
                    <TableCell>{formatDuration(run.started_at, run.completed_at)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={9} sx={{ py: 0, borderBottom: expandedId === run.id ? undefined : 'none' }}>
                      <Collapse in={expandedId === run.id} timeout="auto" unmountOnExit>
                        <Box sx={{ py: 2 }}>
                          {run.error_summary && <Alert severity="error" sx={{ mb: 2 }}>{run.error_summary}</Alert>}
                          <Typography variant="subtitle2" sx={{ mb: 1 }}>{t('mirrorRuns.logEntries')}</Typography>
                          <Box sx={{ bgcolor: 'action.hover', borderRadius: 1, p: 1 }}>
                            <ScrollContainer maxHeight={300}>
                              {run.log_entries.map((entry, idx) => (
                                <Typography key={idx} variant="body2" sx={{
                                  fontFamily: 'monospace', fontSize: '0.8rem', py: 0.25,
                                  color: entry.level === 'error' ? 'error.main' : entry.level === 'warn' ? 'warning.main' : 'text.primary',
                                }}>
                                  {new Date(entry.timestamp).toLocaleTimeString(dateLocale)} [{entry.level.toUpperCase()}] {entry.message}
                                  {entry.repository && ` (${entry.repository})`}
                                </Typography>
                              ))}
                            </ScrollContainer>
                          </Box>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
              {runs.length === 0 && (
                <TableRow><TableCell colSpan={9} align="center" sx={{ py: 4 }}><Typography color="text.secondary">{t('mirrorRuns.noRuns')}</Typography></TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}