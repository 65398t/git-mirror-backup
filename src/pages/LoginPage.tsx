// Login page with demo credentials
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import LoginIcon from '@mui/icons-material/Login';
import LanguageIcon from '@mui/icons-material/Language';
import { useColorScheme } from '@mui/material/styles';
import { useAuth } from '../contexts/AuthContext';

// Demo credentials for development (until Entra ID is active)
const DEMO_USERNAME = 'git-mirror@m-s.ch';
const DEMO_PASSWORD = 'Mirror2026!';

const LANGUAGES = [
  { code: 'de', label: 'DE' },
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
];

export default function LoginPage() {
  const { signIn, signInWithEntraId, entraIdEnabled } = useAuth();
  const { mode } = useColorScheme();
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState(DEMO_USERNAME);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate against demo credentials
    if (email !== DEMO_USERNAME || password !== DEMO_PASSWORD) {
      setError(t('login.invalidCredentials'));
      setLoading(false);
      return;
    }

    try {
      await signIn(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('login.loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', position: 'relative' }}>
      <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <LanguageIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
        <Select
          value={i18n.language}
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          size="small"
          variant="standard"
          sx={{ minWidth: 50 }}
        >
          {LANGUAGES.map(lang => (
            <MenuItem key={lang.code} value={lang.code}>{lang.label}</MenuItem>
          ))}
        </Select>
      </Box>

      <Card sx={{ maxWidth: 400, width: '100%', mx: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', mb: 3 }}>
            <Box component="img" src="/brand-logo.svg" alt={import.meta.env.VITE_ORG_NAME} sx={{ width: 200, mb: 1, ml: '72px', filter: mode === 'dark' ? 'invert(1)' : 'none' }} />
            <Typography variant="h5" fontWeight={700}>Git Mirror Backup</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0 }}>
              {t('common.version')} {__APP_VERSION__}-PoC
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label={t('login.email')} type="email" value={email} onChange={e => setEmail(e.target.value)} fullWidth required />
            <TextField label={t('login.password')} type="password" value={password} onChange={e => setPassword(e.target.value)} fullWidth required />
            <Button type="submit" variant="contained" fullWidth size="large" startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />} disabled={loading}>
              {t('login.signIn')}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Button variant="outlined" fullWidth disabled={!entraIdEnabled} onClick={signInWithEntraId}>
            {t('login.signInWithEntra')}
          </Button>
          {!entraIdEnabled && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
              {t('login.entraDisabled')}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}