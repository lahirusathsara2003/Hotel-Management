import React, { useState, useContext } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Alert, Link as MuiLink } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

import { darkTheme } from '../main';
import { ThemeProvider, CssBaseline } from '@mui/material';

export default function Login() {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            const role = localStorage.getItem('role')?.toLowerCase();
            
            if (role === 'admin') navigate('/dashboard');
            else if (role === 'staff') navigate('/staff-panel');
            else if (role === 'customer') navigate('/customer-dashboard');
            else navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh', 
                backgroundImage: 'url(/hotel_bg.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0, right: 0, bottom: 0, left: 0,
                    backgroundColor: 'rgba(9, 9, 11, 0.85)',
                    zIndex: 0
                }
            }}>
                <Card sx={{ 
                    minWidth: 400, 
                    zIndex: 1, 
                    backgroundColor: 'rgba(24, 24, 27, 0.8)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(0, 229, 255, 0.4)',
                    boxShadow: '0 0 40px 0 rgba(0, 229, 255, 0.25)',
                    borderRadius: 4
                }}>
                    <CardContent sx={{ p: 4 }}>
                        <Typography variant="h4" align="center" sx={{ color: '#00e5ff', fontWeight: 700, mb: 1 }}>
                            Welcome Back
                        </Typography>
                        <Typography variant="body2" align="center" sx={{ color: 'rgba(255,255,255,0.6)', mb: 3 }}>
                            Sign in to your account
                        </Typography>
                        
                        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                        
                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Email Address"
                                type="email"
                                variant="outlined"
                                margin="normal"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <TextField
                                fullWidth
                                label="Password"
                                type="password"
                                variant="outlined"
                                margin="normal"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                sx={{ 
                                    mt: 3, mb: 2, py: 1.5, fontWeight: 700,
                                    background: 'linear-gradient(45deg, #00e5ff 30%, #00b0ff 90%)',
                                    boxShadow: '0 4px 20px 0 rgba(0, 229, 255, 0.4)'
                                }}
                            >
                                Login
                            </Button>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                    Don't have an account?{' '}
                                    <MuiLink component={Link} to="/register" sx={{ color: '#00e5ff', textDecoration: 'none', fontWeight: 600 }}>
                                        Sign up here
                                    </MuiLink>
                                </Typography>
                            </Box>
                        </form>
                    </CardContent>
                </Card>
            </Box>
        </ThemeProvider>
    );
}
