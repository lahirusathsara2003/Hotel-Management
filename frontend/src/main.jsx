import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#00e5ff',
        },
        secondary: {
            main: '#f50057',
        },
        background: {
            default: '#09090b',
            paper: '#18181b',
        },
    },
    typography: {
        fontFamily: '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
    }
});

export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#00bcd4', // A slightly darker cyan for better contrast on white
        },
        secondary: {
            main: '#f50057',
        },
        background: {
            default: '#f8fafc',
            paper: '#ffffff',
        },
        text: {
            primary: '#0f172a',
            secondary: '#64748b',
        }
    },
    typography: {
        fontFamily: '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                    fontWeight: 600,
                },
                containedPrimary: {
                    background: 'linear-gradient(135deg, #00bcd4 0%, #00acc1 100%)',
                    boxShadow: '0 4px 12px rgba(0, 188, 212, 0.25)',
                }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                }
            }
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#ffffff',
                    color: '#0f172a',
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                }
            }
        }
    }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <App />
    </ThemeProvider>
  </React.StrictMode>,
)
