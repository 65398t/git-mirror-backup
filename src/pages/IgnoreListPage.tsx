// Ignore rules management page
import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { api } from '../lib/api';
import type { IgnoreRule } from '../types/database';

export default function IgnoreListPage() {
  const [rules, setRules] = useState<IgnoreRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newPattern, setNewPattern] = useState('');
  const [newType, setNewType] = useState<IgnoreRule['rule_type']>('repository');
  const [newDescription, setNewDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const { t } = useTranslation();

  const RULE_TYPE_LABELS: Record<string, string> = {
    repository: t('ignoreList.ruleTypeRepository'),
    project_repository: t('ignoreList.ruleTypeProjectRepo'),
    wildcard: t('ignoreList.ruleTypeWildcard'),
  };

  const loadRules = useCallback(async () => {
    try { setRules(await api.ignoreRules.list()); } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadRules(); }, [loadRules, t]);

  const handleCreate = async () => {
    if (!newPattern.trim()) return;
    setSaving(true);
    try {
      await api.ignoreRules.create({ pattern: newPattern.trim(), rule_type: newType, description: newDescription.trim() });
      setDialogOpen(false);
      setNewPattern('');
      setNewType('repository');
      setNewDescription('');
      await loadRules();
    } finally { setSaving(false); }
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    await api.ignoreRules.update(id, { is_active: !isActive });
    await loadRules();
  };

  const handleDelete = async (id: string) => {
    await api.ignoreRules.remove(id);
    await loadRules();
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}><CircularProgress /></Box>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>{t('ignoreList.title')}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>{t('ignoreList.addRule')}</Button>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('ignoreList.pattern')}</TableCell>
                <TableCell>{t('mirrorRuns.type')}</TableCell>
                <TableCell>{t('ignoreList.description')}</TableCell>
                <TableCell align="center">{t('ignoreList.matches')}</TableCell>
                <TableCell align="center">{t('ignoreList.active')}</TableCell>
                <TableCell align="center">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rules.map(rule => (
                <TableRow key={rule.id} hover>
                  <TableCell><Typography variant="body2" fontFamily="monospace" fontWeight={500}>{rule.pattern}</Typography></TableCell>
                  <TableCell><Chip label={RULE_TYPE_LABELS[rule.rule_type] || rule.rule_type} size="small" variant="outlined" /></TableCell>
                  <TableCell>{rule.description}</TableCell>
                  <TableCell align="center">{rule.matched_count}</TableCell>
                  <TableCell align="center"><Switch checked={rule.is_active} onChange={() => handleToggle(rule.id, rule.is_active)} size="small" /></TableCell>
                  <TableCell align="center"><IconButton size="small" color="error" onClick={() => handleDelete(rule.id)}><DeleteIcon /></IconButton></TableCell>
                </TableRow>
              ))}
              {rules.length === 0 && (
                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4 }}><Typography color="text.secondary">{t('ignoreList.noRules')}</Typography></TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('ignoreList.newRule')}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <TextField label={t('ignoreList.pattern')} value={newPattern} onChange={e => setNewPattern(e.target.value)} placeholder={t('ignoreList.patternPlaceholder')} fullWidth />
          <FormControl fullWidth>
            <InputLabel>{t('ignoreList.ruleType')}</InputLabel>
            <Select value={newType} label={t('ignoreList.ruleType')} onChange={e => setNewType(e.target.value as IgnoreRule['rule_type'])}>
              <MenuItem value="repository">{t('ignoreList.typeRepository')}</MenuItem>
              <MenuItem value="project_repository">{t('ignoreList.typeProjectRepo')}</MenuItem>
              <MenuItem value="wildcard">{t('ignoreList.typeWildcard')}</MenuItem>
            </Select>
          </FormControl>
          <TextField label={t('ignoreList.description')} value={newDescription} onChange={e => setNewDescription(e.target.value)} multiline rows={2} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>{t('common.cancel')}</Button>
          <Button variant="contained" onClick={handleCreate} disabled={!newPattern.trim() || saving}>{saving ? t('common.saving') : t('common.save')}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}