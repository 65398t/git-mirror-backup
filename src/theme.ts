// MUI theme configuration with light/dark mode support
import { createTheme } from '@mui/material/styles';
import { blue, teal, grey } from '@mui/material/colors';

const theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#1F598C',
        },
        secondary: {
          main: teal[600],
        },
        background: {
          default: grey[50],
          paper: '#fff',
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: blue[400],
        },
        secondary: {
          main: teal[300],
        },
      },
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none',
        },
      },
    },
  },
});

export default theme;
