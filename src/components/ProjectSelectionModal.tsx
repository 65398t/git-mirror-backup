// Modal for selecting projects/repos fetched from Azure DevOps or GitHub API
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import type { RemoteProject, SourceOrganization } from '../types/database';
import { api } from '../lib/api';
import ScrollContainer from './ScrollContainer';

interface ProjectSelectionModalProps {
  open: boolean;
  onClose: () => void;
  organization: SourceOrganization;
  existingIgnored: string[];
  onConfirm: (ignoredProjects: string[]) => void;
}

export default function ProjectSelectionModal({ open, onClose, organization, existingIgnored, onConfirm }: ProjectSelectionModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [remoteProjects, setRemoteProjects] = useState<RemoteProject[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [fetched, setFetched] = useState(false);
  const [search, setSearch] = useState('');
  const { t } = useTranslation();

  const handleOpen = async () => {
    if (fetched) return;
    setLoading(true);
    setError('');
    try {
      const projects = await api.organizations.fetchProjects(
        organization.provider,
        organization.url,
        organization.pat,
      );
      setRemoteProjects(projects);
      setFetched(true);

      // Pre-select all projects except those already on the ignore list
      const ignoredSet = new Set(existingIgnored);
      setSelected(new Set(projects.filter(p => !ignoredSet.has(p.name)).map(p => p.name)));
    } catch (err) {
      setError(err instanceof Error ? err.message : t('settings.fetchProjectsError'));
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (name: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    const visible = filteredProjects.map(p => p.name);
    const allSelected = visible.every(n => selected.has(n));
    setSelected(prev => {
      const next = new Set(prev);
      if (allSelected) {
        visible.forEach(n => next.delete(n));
      } else {
        visible.forEach(n => next.add(n));
      }
      return next;
    });
  };

  const handleConfirm = () => {
    // Return the unselected projects as ignored
    const ignored = remoteProjects
      .filter(p => !selected.has(p.name))
      .map(p => p.name)
      .sort();
    onConfirm(ignored);
    onClose();
  };

  const filteredProjects = remoteProjects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  const allVisibleSelected = filteredProjects.length > 0 && filteredProjects.every(p => selected.has(p.name));
  const someVisibleSelected = filteredProjects.some(p => selected.has(p.name));

  const providerLabel = organization.provider === 'azure_devops'
    ? t('settings.azureDevOpsProjects')
    : t('settings.githubRepos');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      scroll="paper"
      slotProps={{ transition: { onEntered: handleOpen } }}
      aria-labelledby="project-selection-title"
    >
      <DialogTitle id="project-selection-title">
        {providerLabel}
        {organization.name && (
          <Typography variant="body2" color="text.secondary">
            {organization.name} - {organization.url}
          </Typography>
        )}
      </DialogTitle>
      <DialogContent dividers>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        )}

        {fetched && !loading && remoteProjects.length === 0 && (
          <Typography color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
            {t('settings.noProjectsFound')}
          </Typography>
        )}

        {fetched && remoteProjects.length > 0 && (
          <>
            <TextField
              size="small"
              placeholder={t('common.search')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={allVisibleSelected}
                    indeterminate={someVisibleSelected && !allVisibleSelected}
                    onChange={handleSelectAll}
                  />
                }
                label={
                  <Typography variant="body2" fontWeight={600}>
                    {t('settings.selectAll')} ({selected.size}/{remoteProjects.length})
                  </Typography>
                }
              />
            </Box>

            <ScrollContainer maxHeight={400}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {filteredProjects.map(project => (
                  <FormControlLabel
                    key={project.id}
                    control={
                      <Checkbox
                        checked={selected.has(project.name)}
                        onChange={() => handleToggle(project.name)}
                        size="small"
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body2">{project.name}</Typography>
                        {project.description && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            {project.description}
                          </Typography>
                        )}
                      </Box>
                    }
                    sx={{ alignItems: 'flex-start', py: 0.5, mx: 0 }}
                  />
                ))}
              </Box>
            </ScrollContainer>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.cancel')}</Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={loading || !fetched}
        >
          {t('settings.confirmSelection')} ({remoteProjects.length - selected.size} {t('settings.ignored')})
        </Button>
      </DialogActions>
    </Dialog>
  );
}
