// Configuration / settings page
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SaveIcon from '@mui/icons-material/Save';
import SyncIcon from '@mui/icons-material/Sync';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { api } from '../lib/api';
import type { SourceOrganization, SourceProviderType, IgnoreRule } from '../types/database';
import ProjectSelectionModal from '../components/ProjectSelectionModal';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [organizations, setOrganizations] = useState<SourceOrganization[]>([]);
  const [storagePath, setStoragePath] = useState('');
  const [scheduleCron, setScheduleCron] = useState('');
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [maxParallelJobs, setMaxParallelJobs] = useState(4);
  const [dailyEmails, setDailyEmails] = useState<string[]>([]);
  const [errorEmails, setErrorEmails] = useState<string[]>([]);
  const [dailyInput, setDailyInput] = useState('');
  const [errorInput, setErrorInput] = useState('');
  const [dailyInputError, setDailyInputError] = useState('');
  const [errorInputError, setErrorInputError] = useState('');
  const [projectModalOrg, setProjectModalOrg] = useState<SourceOrganization | null>(null);
  const [ignoreRules, setIgnoreRules] = useState<IgnoreRule[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    (async () => {
      try {
        const [orgs, data, rules] = await Promise.all([
          api.organizations.list(),
          api.settings.get(),
          api.ignoreRules.list(),
        ]);
        setOrganizations(orgs);
        setIgnoreRules(rules);
        if (data) {
          setStoragePath(data.storage_path);
          setScheduleCron(data.schedule_cron);
          setScheduleEnabled(data.schedule_enabled);
          setMaxParallelJobs(data.max_parallel_jobs);
          setDailyEmails(data.notification_daily_emails ?? []);
          setErrorEmails(data.notification_error_emails ?? []);
        }
      } finally { setLoading(false); }
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    setSaveError('');
    try {
      await Promise.all([
        api.organizations.save(organizations),
        api.settings.save({
          storage_path: storagePath, schedule_cron: scheduleCron,
          schedule_enabled: scheduleEnabled, max_parallel_jobs: maxParallelJobs,
          notification_daily_emails: dailyEmails, notification_error_emails: errorEmails,
        }),
      ]);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : t('settings.saveError'));
    } finally { setSaving(false); }
  };

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const addEmail = (
    value: string,
    list: string[],
    setList: (v: string[]) => void,
    setInput: (v: string) => void,
    setError: (v: string) => void,
  ) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (!isValidEmail(trimmed)) { setError(t('settings.invalidEmail')); return; }
    if (!list.includes(trimmed)) setList([...list, trimmed]);
    setInput('');
    setError('');
  };

  const updateOrg = (id: string, patch: Partial<SourceOrganization>) => {
    setOrganizations(prev => prev.map(o => o.id === id ? { ...o, ...patch } as SourceOrganization : o));
  };

  const addOrg = (provider: SourceProviderType) => {
    const id = crypto.randomUUID();
    const newOrg: SourceOrganization = provider === 'github'
      ? { id, name: '', url: '', provider: 'github', tags: [], pat: '', pat_expiry: '' }
      : { id, name: '', url: '', provider: 'azure_devops', tags: [], pat: '', pat_expiry: '' };
    setOrganizations(prev => [...prev, newOrg]);
  };

  const removeOrg = (id: string) => {
    setOrganizations(prev => prev.filter(o => o.id !== id));
  };

  const getPatExpiryInfo = (expiry: string): { color: 'error' | 'warning' | 'success'; label: string } => {
    if (!expiry) return { color: 'warning', label: '' };
    const days = Math.ceil((new Date(expiry).getTime() - Date.now()) / 86400_000);
    if (days < 0) return { color: 'error', label: t('settings.patExpired') };
    if (days <= 14) return { color: 'warning', label: t('settings.patExpiresInDays', { count: days }) };
    return { color: 'success', label: t('settings.patExpiresInDays', { count: days }) };
  };

  const azureOrgs = organizations.filter(o => o.provider === 'azure_devops');
  const githubOrgs = organizations.filter(o => o.provider === 'github');

  const renderOrgCard = (org: SourceOrganization, idx: number) => {
    const expiryInfo = getPatExpiryInfo(org.pat_expiry);
    return (
      <Box key={org.id}>
        {idx > 0 && <Divider sx={{ mb: 2 }} />}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <TextField
              label={t('settings.organizationName')}
              value={org.name}
              onChange={e => updateOrg(org.id, { name: e.target.value })}
              fullWidth
            />
            <IconButton color="error" onClick={() => removeOrg(org.id)} title={t('settings.removeOrganization')} sx={{ mt: 0.5 }}>
              <DeleteOutlineIcon />
            </IconButton>
          </Box>
          <TextField
            label={t('settings.organizationUrl')}
            value={org.url}
            onChange={e => updateOrg(org.id, { url: e.target.value })}
            fullWidth
            placeholder={org.provider === 'azure_devops' ? 'https://dev.azure.com/OrgName' : 'https://github.com/OrgName'}
            helperText={t('settings.organizationUrlHelp')}
          />
          {/* Projects fetch + ignored projects display */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {org.provider === 'azure_devops' ? t('settings.azureDevOpsProjects') : t('settings.githubRepos')}
              </Typography>
              <Button
                size="small"
                startIcon={<SyncIcon />}
                onClick={() => setProjectModalOrg(org)}
                disabled={!org.url || !org.pat}
              >
                {t('settings.fetchProjects')}
              </Button>
            </Box>
            {(() => {
              const orgIgnored = ignoreRules.filter(r =>
                r.rule_type === 'project_repository' && r.is_active && r.description === `org:${org.id}`
              );
              if (orgIgnored.length > 0) {
                return (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {orgIgnored.map(rule => (
                      <Chip
                        key={rule.id}
                        label={rule.pattern}
                        size="small"
                        color="default"
                        variant="outlined"
                        onDelete={async () => {
                          await api.ignoreRules.remove(rule.id);
                          setIgnoreRules(prev => prev.filter(r => r.id !== rule.id));
                        }}
                      />
                    ))}
                    <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center', ml: 0.5 }}>
                      ({t('settings.ignoredProjects')})
                    </Typography>
                  </Box>
                );
              }
              return (
                <Typography variant="caption" color="text.secondary">
                  {t('settings.allProjectsMirrored')}
                </Typography>
              );
            })()}
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label={t('settings.pat')}
              value={org.pat}
              onChange={e => updateOrg(org.id, { pat: e.target.value })}
              fullWidth
              type="password"
            />
            <TextField
              label={t('settings.patExpiry')}
              value={org.pat_expiry}
              onChange={e => updateOrg(org.id, { pat_expiry: e.target.value })}
              type="date"
              sx={{ minWidth: 200 }}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Box>
          {org.pat_expiry && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {expiryInfo.color !== 'success' && <WarningAmberIcon fontSize="small" color={expiryInfo.color} />}
              <Chip label={expiryInfo.label} color={expiryInfo.color} size="small" />
            </Box>
          )}
        </Box>
      </Box>
    );
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}><CircularProgress /></Box>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>{t('settings.title')}</Typography>
        <Button variant="contained" startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />} onClick={handleSave} disabled={saving}>
          {t('common.save')}
        </Button>
      </Box>

      {success && <Alert icon={<CheckCircleIcon />} severity="success" sx={{ mb: 3 }}>{t('settings.savedSuccess')}</Alert>}
      {saveError && <Alert severity="error" sx={{ mb: 3 }}>{saveError}</Alert>}

      <Grid container spacing={3}>
        {/* Azure DevOps Organisationen */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>{t('settings.azureDevOps')}</Typography>
                <Button size="small" startIcon={<AddCircleOutlineIcon />} onClick={() => addOrg('azure_devops')}>{t('settings.addOrganization')}</Button>
              </Box>
              {azureOrgs.length === 0 && (
                <Typography variant="body2" color="text.secondary">{t('settings.noOrganizations')}</Typography>
              )}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {azureOrgs.map((org, idx) => renderOrgCard(org, idx))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* GitHub Organisationen */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>{t('settings.githubOrgs')}</Typography>
                <Button size="small" startIcon={<AddCircleOutlineIcon />} onClick={() => addOrg('github')}>{t('settings.addOrganization')}</Button>
              </Box>
              {githubOrgs.length === 0 && (
                <Typography variant="body2" color="text.secondary">{t('settings.noGithubOrganizations')}</Typography>
              )}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {githubOrgs.map((org, idx) => renderOrgCard(org, idx))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>{t('settings.storage')}</Typography>
              <TextField label={t('settings.storagePath')} value={storagePath} onChange={e => setStoragePath(e.target.value)} fullWidth helperText={t('settings.storagePathHelp')} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>{t('settings.schedule')}</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel control={<Switch checked={scheduleEnabled} onChange={e => setScheduleEnabled(e.target.checked)} />} label={t('settings.scheduleEnabled')} />
                <TextField label={t('settings.cronExpression')} value={scheduleCron} onChange={e => setScheduleCron(e.target.value)} fullWidth helperText={t('settings.cronHelp')} disabled={!scheduleEnabled} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>{t('settings.performance')}</Typography>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{t('settings.maxParallelJobs', { count: maxParallelJobs })}</Typography>
                <Slider value={maxParallelJobs} onChange={(_, v) => setMaxParallelJobs(v as number)} min={1} max={12} step={1} marks valueLabelDisplay="auto" />
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" color="text.secondary">{t('settings.performanceNote')}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>{t('settings.notifications')}</Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>{t('settings.dailyReportEmails')}</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1, minHeight: 32 }}>
                    {dailyEmails.map(email => (
                      <Chip key={email} label={email} size="small" onDelete={() => setDailyEmails(dailyEmails.filter(e => e !== email))} />
                    ))}
                  </Box>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder={t('settings.addEmail')}
                    value={dailyInput}
                    onChange={e => { setDailyInput(e.target.value); setDailyInputError(''); }}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addEmail(dailyInput, dailyEmails, setDailyEmails, setDailyInput, setDailyInputError); } }}
                    error={!!dailyInputError}
                    helperText={dailyInputError || t('settings.dailyReportEmailsHelp')}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton size="small" onClick={() => addEmail(dailyInput, dailyEmails, setDailyEmails, setDailyInput, setDailyInputError)}>
                              <AddCircleOutlineIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>{t('settings.errorOnlyEmails')}</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1, minHeight: 32 }}>
                    {errorEmails.map(email => (
                      <Chip key={email} label={email} size="small" color="warning" onDelete={() => setErrorEmails(errorEmails.filter(e => e !== email))} />
                    ))}
                  </Box>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder={t('settings.addEmail')}
                    value={errorInput}
                    onChange={e => { setErrorInput(e.target.value); setErrorInputError(''); }}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addEmail(errorInput, errorEmails, setErrorEmails, setErrorInput, setErrorInputError); } }}
                    error={!!errorInputError}
                    helperText={errorInputError || t('settings.errorOnlyEmailsHelp')}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton size="small" onClick={() => addEmail(errorInput, errorEmails, setErrorEmails, setErrorInput, setErrorInputError)}>
                              <AddCircleOutlineIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {projectModalOrg && (
        <ProjectSelectionModal
          open={!!projectModalOrg}
          onClose={() => setProjectModalOrg(null)}
          organization={projectModalOrg}
          existingIgnored={
            ignoreRules
              .filter(r => r.rule_type === 'project_repository' && r.is_active && r.description === `org:${projectModalOrg.id}`)
              .map(r => r.pattern)
          }
          onConfirm={async (ignoredProjects: string[]) => {
            try {
              // Remove old ignore rules for this org
              const oldRules = ignoreRules.filter(r =>
                r.rule_type === 'project_repository' && r.description === `org:${projectModalOrg.id}`
              );
              for (const rule of oldRules) {
                await api.ignoreRules.remove(rule.id);
              }
              // Create new ignore rules for unselected projects
              const newRules: IgnoreRule[] = [];
              for (const name of ignoredProjects) {
                const rule = await api.ignoreRules.create({
                  pattern: name,
                  rule_type: 'project_repository',
                  description: `org:${projectModalOrg.id}`,
                });
                newRules.push(rule);
              }
              // Update local state
              setIgnoreRules(prev => [
                ...prev.filter(r => !(r.rule_type === 'project_repository' && r.description === `org:${projectModalOrg.id}`)),
                ...newRules,
              ]);
              setSuccess(true);
              setTimeout(() => setSuccess(false), 3000);
            } catch (err) {
              setSaveError(err instanceof Error ? err.message : t('settings.saveError'));
            }
          }}
        />
      )}
    </Box>
  );
}