import React, { useState, useContext } from 'react';
import { 
    Box, Card, CardContent, Typography, TextField, Button, Alert, 
    Link as MuiLink, MenuItem, CircularProgress, IconButton, InputAdornment, Snackbar 
} from '@mui/material';
import { Visibility, VisibilityOff, Person, Email, Phone, Lock, Badge } from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

import { darkTheme } from '../main';
import { ThemeProvider, CssBaseline as MuiCssBaseline } from '@mui/material';

export default function Register() {
    const { registerUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'customer'
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [apiError, setApiError] = useState('');
    const [success, setSuccess] = useState(false);

    const validate = (name, value) => {
        let error = '';
        if (name === 'name' && value.length < 3) error = 'Name must be at least 3 characters';
        if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Invalid email format';
        if (name === 'phone' && !/^\d{10}$/.test(value)) error = 'Phone must be exactly 10 digits';
        if (name === 'password' && value.length < 6) error = 'Password must be at least 6 characters';
        if (name === 'confirmPassword' && value !== formData.password) error = 'Passwords do not match';
        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: validate(name, value) });
    };

    const isFormInvalid = () => {
        return !formData.name || !formData.email || !formData.phone || 
               !formData.password || formData.password !== formData.confirmPassword ||
               Object.values(errors).some(x => x !== '');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setApiError('');
        try {
            const { confirmPassword, ...submitData } = formData;
            await registerUser(submitData);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setApiError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <MuiCssBaseline />
            <Box sx={{ 
                display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',
                backgroundImage: 'url(/hotel_bg.png)', backgroundSize: 'cover', backgroundPosition: 'center',
                position: 'relative',
                '&::before': {
                    content: '""', position: 'absolute', top: 0, right: 0, bottom: 0, left: 0,
                    backgroundColor: 'rgba(9, 9, 11, 0.85)', zIndex: 0
                }
            }}>
                <Card sx={{ 
                    minWidth: 450, zIndex: 1, backgroundColor: 'rgba(24, 24, 27, 0.8)',
                    backdropFilter: 'blur(16px)', border: '1px solid rgba(0, 229, 255, 0.4)',
                    boxShadow: '0 0 40px 0 rgba(0, 229, 255, 0.25)', borderRadius: 4
                }}>
                    <CardContent sx={{ p: 4 }}>
                        <Typography variant="h4" align="center" sx={{ color: '#00e5ff', fontWeight: 700, mb: 1 }}>
                            Create Account
                        </Typography>
                        <Typography variant="body2" align="center" sx={{ color: 'rgba(255,255,255,0.6)', mb: 3 }}>
                            Join the luxury experience
                        </Typography>

                        {apiError && <Alert severity="error" sx={{ mb: 2 }}>{apiError}</Alert>}

                        <form onSubmit={handleSubmit}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <TextField
                                    label="Full Name" name="name" fullWidth required
                                    value={formData.name} onChange={handleChange}
                                    error={!!errors.name} helperText={errors.name}
                                    InputProps={{ startAdornment: (<InputAdornment position="start"><Person sx={{ color: '#00e5ff' }} /></InputAdornment>) }}
                                />
                                <TextField
                                    label="Email" name="email" type="email" fullWidth required
                                    value={formData.email} onChange={handleChange}
                                    error={!!errors.email} helperText={errors.email}
                                    InputProps={{ startAdornment: (<InputAdornment position="start"><Email sx={{ color: '#00e5ff' }} /></InputAdornment>) }}
                                />
                                <TextField
                                    label="Phone Number" name="phone" fullWidth required
                                    value={formData.phone} onChange={handleChange}
                                    error={!!errors.phone} helperText={errors.phone}
                                    InputProps={{ startAdornment: (<InputAdornment position="start"><Phone sx={{ color: '#00e5ff' }} /></InputAdornment>) }}
                                />
                                <TextField
                                    label="Role" name="role" select fullWidth required
                                    value={formData.role} onChange={handleChange}
                                    InputProps={{ startAdornment: (<InputAdornment position="start"><Badge sx={{ color: '#00e5ff' }} /></InputAdornment>) }}
                                >
                                    <MenuItem value="customer">Customer</MenuItem>
                                    <MenuItem value="staff">Staff</MenuItem>
                                    <MenuItem value="admin">Admin</MenuItem>
                                </TextField>
                                <TextField
                                    label="Password" name="password" type={showPassword ? 'text' : 'password'} fullWidth required
                                    value={formData.password} onChange={handleChange}
                                    error={!!errors.password} helperText={errors.password}
                                    InputProps={{ 
                                        startAdornment: (<InputAdornment position="start"><Lock sx={{ color: '#00e5ff' }} /></InputAdornment>),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <TextField
                                    label="Confirm Password" name="confirmPassword" type={showPassword ? 'text' : 'password'} fullWidth required
                                    value={formData.confirmPassword} onChange={handleChange}
                                    error={!!errors.confirmPassword} helperText={errors.confirmPassword}
                                    InputProps={{ startAdornment: (<InputAdornment position="start"><Lock sx={{ color: '#00e5ff' }} /></InputAdornment>) }}
                                />

                                <Button
                                    fullWidth type="submit" variant="contained" 
                                    disabled={loading || isFormInvalid()}
                                    sx={{ 
                                        mt: 2, py: 1.5, fontWeight: 700, fontSize: '1rem',
                                        background: 'linear-gradient(45deg, #00e5ff 30%, #00b0ff 90%)',
                                        boxShadow: '0 4px 20px 0 rgba(0, 229, 255, 0.4)'
                                    }}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
                                </Button>

                                <Box sx={{ textAlign: 'center', mt: 2 }}>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                        Already have an account?{' '}
                                        <MuiLink component={Link} to="/login" sx={{ color: '#00e5ff', textDecoration: 'none', fontWeight: 600 }}>
                                            Login here
                                        </MuiLink>
                                    </Typography>
                                </Box>
                            </Box>
                        </form>
                    </CardContent>
                </Card>

                <Snackbar open={success} autoHideDuration={6000}>
                    <Alert severity="success" sx={{ width: '100%' }}>
                        Registration successful! Redirecting to login...
                    </Alert>
                </Snackbar>
            </Box>
        </ThemeProvider>
    );
}
