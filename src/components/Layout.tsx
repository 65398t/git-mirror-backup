// Main layout with responsive sidebar navigation
import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme, useColorScheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StorageIcon from '@mui/icons-material/Storage';
import SyncIcon from '@mui/icons-material/Sync';
import BlockIcon from '@mui/icons-material/Block';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LanguageIcon from '@mui/icons-material/Language';
import { useAuth } from '../contexts/AuthContext';
import ScrollContainer from './ScrollContainer';

const DRAWER_WIDTH = 260;

const LANGUAGES = [
  { code: 'de', label: 'Deutsch' },
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Francais' },
];

const NAV_ITEMS = [
  { labelKey: 'nav.dashboard', path: '/', icon: <DashboardIcon /> },
  { labelKey: 'nav.repositories', path: '/repositories', icon: <StorageIcon /> },
  { labelKey: 'nav.mirrorRuns', path: '/runs', icon: <SyncIcon /> },
  { labelKey: 'nav.ignoreList', path: '/ignore', icon: <BlockIcon /> },
  { labelKey: 'nav.settings', path: '/settings', icon: <SettingsIcon /> },
];

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [langMenuAnchor, setLangMenuAnchor] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { mode, setMode } = useColorScheme();
  const { t, i18n } = useTranslation();

  const handleNav = (path: string) => {
    navigate(path);
    if (isMobile) setMobileOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setLangMenuAnchor(null);
  };

  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', mt: '64px' }}>
      <ScrollContainer maxHeight="calc(100vh - 64px)" sx={{ flex: 1 }}>
        <List sx={{ px: 1, pt: 1 }}>
          {NAV_ITEMS.map(item => (
            <ListItemButton
              key={item.path}
              onClick={() => handleNav(item.path)}
              selected={isActive(item.path)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                py: 0.5,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  '& .MuiListItemIcon-root': { color: 'white' },
                  '&:hover': { bgcolor: 'primary.dark' },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={t(item.labelKey)} />
            </ListItemButton>
          ))}
        </List>
      </ScrollContainer>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar position="fixed" elevation={1} sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isMobile && (
              <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(true)} sx={{ mr: 1 }}>
                <MenuIcon />
              </IconButton>
            )}
            <Box component="img" src="/brand-logo.svg" alt={import.meta.env.VITE_ORG_NAME} sx={{ height: 32, filter: mode === 'dark' ? 'invert(1)' : 'none' }} />
          </Box>
          <Typography variant="h6" fontWeight={700} noWrap sx={{ color: 'inherit', letterSpacing: 0.5, flex: 1, textAlign: 'center' }}>
            Git Mirror Backup
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton color="inherit" onClick={(e) => setLangMenuAnchor(e.currentTarget)} size="small" title={currentLang.label}>
              <LanguageIcon />
            </IconButton>
            <IconButton color="inherit" onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')} size="small">
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
            <IconButton color="inherit" onClick={(e) => setUserMenuAnchor(e.currentTarget)} size="small">
              <AccountCircleIcon />
            </IconButton>
          </Box>
          <Menu
            anchorEl={langMenuAnchor}
            open={Boolean(langMenuAnchor)}
            onClose={() => setLangMenuAnchor(null)}
          >
            {LANGUAGES.map(lang => (
              <MenuItem
                key={lang.code}
                selected={i18n.language === lang.code}
                onClick={() => handleLanguageChange(lang.code)}
              >
                {lang.label}
              </MenuItem>
            ))}
          </Menu>
          <Menu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={() => setUserMenuAnchor(null)}
          >
            <MenuItem disabled>
              <Typography variant="body2" color="text.secondary" noWrap>
                {user?.email}
              </Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => { setUserMenuAnchor(null); signOut(); }}>
              <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
              {t('nav.signOut')}
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{ width: DRAWER_WIDTH, flexShrink: 0, '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}
        >
          {drawerContent}
        </Drawer>
      )}

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, mt: '64px' }}>
        <ScrollContainer maxHeight="calc(100vh - 64px)" sx={{ flex: 1 }}>
          <Box component="main" sx={{ p: 3 }}>
            <Outlet />
          </Box>
        </ScrollContainer>
      </Box>
    </Box>
  );
}
