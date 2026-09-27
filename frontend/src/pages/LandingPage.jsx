import React, { useContext } from 'react';
import { 
    Box, AppBar, Toolbar, Typography, Button, Container, Grid, 
    Card, CardContent, CardMedia, Stack, Divider, IconButton,
    useTheme, useMediaQuery
} from '@mui/material';
import { 
    Hotel, Restaurant, Pool, Spa, Phone, Email, LocationOn, 
    ChevronRight, RoomService, Stars, Shield
} from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function LandingPage() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleBookNow = () => {
        if (user) {
            if (user.role?.toLowerCase() === 'customer') {
                navigate('/book');
            } else if (user.role?.toLowerCase() === 'staff') {
                navigate('/staff-panel');
            } else {
                navigate('/dashboard');
            }
        } else {
            navigate('/login');
        }
    };

    const handleDashboardRedirect = () => {
        if (user.role?.toLowerCase() === 'customer') {
            navigate('/customer-dashboard');
        } else if (user.role?.toLowerCase() === 'staff') {
            navigate('/staff-panel');
        } else {
            navigate('/dashboard');
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc', overflowX: 'hidden' }}>
            {/* Header / Navigation */}
            <AppBar 
                position="sticky" 
                sx={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.85)', 
                    backdropFilter: 'blur(12px)', 
                    color: '#0f172a',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
                }}
            >
                <Container maxWidth="lg">
                    <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
                        {/* Logo */}
                        <Typography 
                            variant="h5" 
                            noWrap 
                            onClick={() => scrollToSection('hero')}
                            sx={{ 
                                fontWeight: 800, 
                                letterSpacing: '0.1rem',
                                color: '#00bcd4', 
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}
                        >
                            <Hotel /> THE AZURE
                        </Typography>

                        {/* Navigation Links - Hidden on Mobile */}
                        {!isMobile && (
                            <Stack direction="row" spacing={3}>
                                <Button onClick={() => scrollToSection('about')} sx={{ color: '#475569', fontWeight: 600 }}>About</Button>
                                <Button onClick={() => scrollToSection('rooms')} sx={{ color: '#475569', fontWeight: 600 }}>Rooms</Button>
                                <Button onClick={() => scrollToSection('facilities')} sx={{ color: '#475569', fontWeight: 600 }}>Facilities</Button>
                                <Button onClick={() => scrollToSection('contact')} sx={{ color: '#475569', fontWeight: 600 }}>Contact</Button>
                            </Stack>
                        )}

                        {/* Sign In / Sign Up / Dashboard Buttons */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            {user ? (
                                <>
                                    {!isMobile && (
                                        <Typography variant="body2" sx={{ color: '#64748b', mr: 1 }}>
                                            Welcome, <strong>{user.username}</strong>
                                        </Typography>
                                    )}
                                    <Button 
                                        variant="contained" 
                                        color="primary"
                                        size="medium"
                                        onClick={handleDashboardRedirect}
                                        sx={{ 
                                            borderRadius: 2, 
                                            px: 3, 
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            background: 'linear-gradient(135deg, #00bcd4 0%, #00acc1 100%)',
                                            boxShadow: '0 4px 12px rgba(0, 188, 212, 0.25)',
                                        }}
                                    >
                                        Dashboard
                                    </Button>
                                    <Button 
                                        variant="outlined" 
                                        color="inherit" 
                                        size="medium"
                                        onClick={() => { logout(); navigate('/'); }}
                                        sx={{ 
                                            borderRadius: 2, 
                                            textTransform: 'none',
                                            borderColor: '#cbd5e1',
                                            color: '#475569',
                                            '&:hover': {
                                                borderColor: '#94a3b8',
                                                backgroundColor: '#f1f5f9'
                                            }
                                        }}
                                    >
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button 
                                        component={Link}
                                        to="/login"
                                        variant="text" 
                                        sx={{ 
                                            color: '#475569', 
                                            fontWeight: 600,
                                            textTransform: 'none',
                                            px: 2
                                        }}
                                    >
                                        Sign In
                                    </Button>
                                    <Button 
                                        component={Link}
                                        to="/register"
                                        variant="contained" 
                                        color="primary"
                                        sx={{ 
                                            borderRadius: 2, 
                                            px: 3,
                                            fontWeight: 600,
                                            textTransform: 'none',
                                            background: 'linear-gradient(135deg, #00bcd4 0%, #00acc1 100%)',
                                            boxShadow: '0 4px 12px rgba(0, 188, 212, 0.25)',
                                        }}
                                    >
                                        Sign Up
                                    </Button>
                                </>
                            )}
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Hero Section */}
            <Box 
                id="hero"
                sx={{ 
                    position: 'relative',
                    height: '80vh',
                    backgroundImage: 'url(/hotel_bg.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    color: '#ffffff',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0, right: 0, bottom: 0, left: 0,
                        backgroundColor: 'rgba(15, 23, 42, 0.65)',
                        zIndex: 1
                    }
                }}
            >
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={8}>
                            <Typography 
                                variant="h1" 
                                sx={{ 
                                    fontWeight: 800, 
                                    fontSize: { xs: '2.8rem', md: '4rem' },
                                    lineHeight: 1.15,
                                    mb: 2,
                                    textShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                    color: '#ffffff'
                                }}
                            >
                                Experience the Pinnacle of Luxury & Comfort
                            </Typography>
                            <Typography 
                                variant="h5" 
                                sx={{ 
                                    mb: 4, 
                                    fontWeight: 400, 
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    textShadow: '0 2px 6px rgba(0,0,0,0.3)'
                                }}
                            >
                                Welcome to THE AZURE, a sanctuary of sophisticated living, gourmet dining, and world-class hospitality in the heart of the city.
                            </Typography>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <Button 
                                    variant="contained" 
                                    size="large"
                                    onClick={handleBookNow}
                                    sx={{ 
                                        borderRadius: 2, 
                                        px: 4, 
                                        py: 1.5,
                                        fontSize: '1.05rem',
                                        background: 'linear-gradient(135deg, #00bcd4 0%, #00acc1 100%)',
                                        boxShadow: '0 6px 20px rgba(0, 188, 212, 0.4)',
                                    }}
                                >
                                    Book Your Stay
                                </Button>
                                <Button 
                                    variant="outlined" 
                                    size="large"
                                    onClick={() => scrollToSection('rooms')}
                                    sx={{ 
                                        borderRadius: 2, 
                                        px: 4, 
                                        py: 1.5,
                                        fontSize: '1.05rem',
                                        color: '#ffffff',
                                        borderColor: '#ffffff',
                                        borderWidth: '2px',
                                        '&:hover': {
                                            borderColor: '#00bcd4',
                                            backgroundColor: 'rgba(0, 188, 212, 0.1)',
                                            borderWidth: '2px',
                                        }
                                    }}
                                >
                                    Explore Rooms
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* About / Details Section */}
            <Container id="about" maxWidth="lg" sx={{ py: 10 }}>
                <Grid container spacing={6} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Box sx={{ position: 'relative' }}>
                            <Box 
                                component="img" 
                                src="/hotel_bg.png" 
                                alt="THE AZURE Interior" 
                                sx={{ 
                                    width: '100%', 
                                    borderRadius: 4, 
                                    boxShadow: '0 12px 24px rgba(0,0,0,0.08)',
                                    border: '1px solid rgba(0, 0, 0, 0.05)'
                                }}
                            />
                            <Box 
                                sx={{ 
                                    position: 'absolute', 
                                    bottom: -20, 
                                    right: -20, 
                                    backgroundColor: '#ffffff', 
                                    p: 3, 
                                    borderRadius: 3, 
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                    display: { xs: 'none', sm: 'flex' },
                                    alignItems: 'center',
                                    gap: 2
                                }}
                            >
                                <Box sx={{ backgroundColor: 'rgba(0,188,212,0.1)', p: 1.5, borderRadius: '50%', color: '#00bcd4' }}>
                                    <Stars fontSize="large" />
                                </Box>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>5-Star</Typography>
                                    <Typography variant="body2" color="textSecondary">Hotel Experience</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography 
                            variant="overline" 
                            sx={{ color: '#00bcd4', fontWeight: 800, letterSpacing: '0.15em' }}
                        >
                            Welcome to THE AZURE
                        </Typography>
                        <Typography 
                            variant="h2" 
                            sx={{ fontWeight: 800, mt: 1, mb: 3, color: '#0f172a', fontSize: { xs: '2rem', md: '2.5rem' } }}
                        >
                            A Sanctuary Crafted for Discerning Guests
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#64748b', mb: 3, lineHeight: 1.8 }}>
                            At THE AZURE, we redefine comfort by blending luxury with standard-setting convenience. Located in the cultural and business heart of the metropolis, our establishment offers an escape from the ordinary. 
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#64748b', mb: 4, lineHeight: 1.8 }}>
                            Whether you are visiting for an executive retreat, a family holiday, or a romantic escape, our suites, dining terraces, and spa facilities ensure your time is spent in perfect serenity.
                        </Typography>

                        <Grid container spacing={3}>
                            <Grid item xs={6}>
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                    <Shield sx={{ color: '#00bcd4' }} />
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155' }}>Fully Secured Stay</Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={6}>
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                    <RoomService sx={{ color: '#00bcd4' }} />
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155' }}>24/7 Concierge</Typography>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>

            {/* Rooms Section */}
            <Box id="rooms" sx={{ backgroundColor: '#f1f5f9', py: 10 }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                        <Typography 
                            variant="overline" 
                            sx={{ color: '#00bcd4', fontWeight: 800, letterSpacing: '0.15em' }}
                        >
                            Our Accommodations
                        </Typography>
                        <Typography 
                            variant="h2" 
                            sx={{ fontWeight: 800, mt: 1, mb: 2, color: '#0f172a', fontSize: { xs: '2rem', md: '2.5rem' } }}
                        >
                            Suites Designed for Ultimate Relaxation
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#64748b', maxWidth: 600, mx: 'auto' }}>
                            Choose from our curated collection of spacious rooms. Each comes equipped with smart climate control, premium bedding, and breathtaking views.
                        </Typography>
                    </Box>

                    <Grid container spacing={4}>
                        {/* Deluxe Room */}
                        <Grid item xs={12} md={4}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-8px)' } }}>
                                <CardMedia
                                    component="img"
                                    height="240"
                                    image="/hotel_room.png"
                                    alt="Deluxe Room"
                                />
                                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                    <Typography variant="h5" component="div" sx={{ fontWeight: 700, mb: 1, color: '#0f172a' }}>
                                        Deluxe Sanctuary Room
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2.5, minHeight: 60 }}>
                                        An elegant space featuring premium king-sized bedding, modern executive workstation, smart TV, and high-speed fiber internet.
                                    </Typography>
                                    <Divider sx={{ my: 2 }} />
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Box>
                                            <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>Starting from</Typography>
                                            <Typography variant="h6" sx={{ color: '#00bcd4', fontWeight: 800 }}>LKR 50,000 <span style={{ fontSize: '0.8rem', fontWeight: 400, color: '#64748b' }}>/ night</span></Typography>
                                        </Box>
                                        <Button 
                                            variant="text" 
                                            color="primary" 
                                            endIcon={<ChevronRight />}
                                            onClick={handleBookNow}
                                            sx={{ fontWeight: 700 }}
                                        >
                                            Book
                                        </Button>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Executive Suite */}
                        <Grid item xs={12} md={4}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-8px)' } }}>
                                <CardMedia
                                    component="img"
                                    height="240"
                                    image="/hotel_dining.png"
                                    alt="Executive Suite"
                                />
                                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                    <Typography variant="h5" component="div" sx={{ fontWeight: 700, mb: 1, color: '#0f172a' }}>
                                        Executive Poolfront Suite
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2.5, minHeight: 60 }}>
                                        Perfect for business or relaxation. Features a separate lounge area, dining table, panoramic pool front views, and luxury marble bathroom.
                                    </Typography>
                                    <Divider sx={{ my: 2 }} />
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Box>
                                            <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>Starting from</Typography>
                                            <Typography variant="h6" sx={{ color: '#00bcd4', fontWeight: 800 }}>LKR 85,000 <span style={{ fontSize: '0.8rem', fontWeight: 400, color: '#64748b' }}>/ night</span></Typography>
                                        </Box>
                                        <Button 
                                            variant="text" 
                                            color="primary" 
                                            endIcon={<ChevronRight />}
                                            onClick={handleBookNow}
                                            sx={{ fontWeight: 700 }}
                                        >
                                            Book
                                        </Button>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Presidential Suite */}
                        <Grid item xs={12} md={4}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-8px)' } }}>
                                <CardMedia
                                    component="img"
                                    height="240"
                                    image="/hotel_bg.png"
                                    alt="Presidential Suite"
                                />
                                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                    <Typography variant="h5" component="div" sx={{ fontWeight: 700, mb: 1, color: '#0f172a' }}>
                                        THE AZURE Presidential Suite
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2.5, minHeight: 60 }}>
                                        The peak of luxury. Includes two bedrooms, private dining, expansive skyline terrace, personal butler services, and custom jacuzzi.
                                    </Typography>
                                    <Divider sx={{ my: 2 }} />
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Box>
                                            <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>Starting from</Typography>
                                            <Typography variant="h6" sx={{ color: '#00bcd4', fontWeight: 800 }}>LKR 150,000 <span style={{ fontSize: '0.8rem', fontWeight: 400, color: '#64748b' }}>/ night</span></Typography>
                                        </Box>
                                        <Button 
                                            variant="text" 
                                            color="primary" 
                                            endIcon={<ChevronRight />}
                                            onClick={handleBookNow}
                                            sx={{ fontWeight: 700 }}
                                        >
                                            Book
                                        </Button>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* facilities Section */}
            <Container id="facilities" maxWidth="lg" sx={{ py: 10 }}>
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography 
                        variant="overline" 
                        sx={{ color: '#00bcd4', fontWeight: 800, letterSpacing: '0.15em' }}
                    >
                        World-Class Services
                    </Typography>
                    <Typography 
                        variant="h2" 
                        sx={{ fontWeight: 800, mt: 1, mb: 2, color: '#0f172a', fontSize: { xs: '2rem', md: '2.5rem' } }}
                    >
                        Exclusive Resort Facilities
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748b', maxWidth: 600, mx: 'auto' }}>
                        Designed to satisfy every indulgence, we offer high-end leisure services inside the hotel complex.
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ p: 4, backgroundColor: '#ffffff', borderRadius: 4, textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.03)' }}>
                            <Box sx={{ backgroundColor: 'rgba(0,188,212,0.08)', color: '#00bcd4', display: 'inline-flex', p: 2, borderRadius: '50%', mb: 2 }}>
                                <Restaurant fontSize="large" />
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#0f172a' }}>Fine Dining</Typography>
                            <Typography variant="body2" color="textSecondary">Award-winning dining curated by our Michelin-starred chef crew.</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ p: 4, backgroundColor: '#ffffff', borderRadius: 4, textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.03)' }}>
                            <Box sx={{ backgroundColor: 'rgba(0,188,212,0.08)', color: '#00bcd4', display: 'inline-flex', p: 2, borderRadius: '50%', mb: 2 }}>
                                <Pool fontSize="large" />
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#0f172a' }}>Infinity Pool</Typography>
                            <Typography variant="body2" color="textSecondary">A temperature-controlled pool overlooking the city skyline.</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ p: 4, backgroundColor: '#ffffff', borderRadius: 4, textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.03)' }}>
                            <Box sx={{ backgroundColor: 'rgba(0,188,212,0.08)', color: '#00bcd4', display: 'inline-flex', p: 2, borderRadius: '50%', mb: 2 }}>
                                <Spa fontSize="large" />
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#0f172a' }}>Rejuvenating Spa</Typography>
                            <Typography variant="body2" color="textSecondary">Premium massage therapists and high-end botanical spa treatments.</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ p: 4, backgroundColor: '#ffffff', borderRadius: 4, textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.03)' }}>
                            <Box sx={{ backgroundColor: 'rgba(0,188,212,0.08)', color: '#00bcd4', display: 'inline-flex', p: 2, borderRadius: '50%', mb: 2 }}>
                                <RoomService fontSize="large" />
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#0f172a' }}>Valet & Butler</Typography>
                            <Typography variant="body2" color="textSecondary">Complimentary valet parking and customized helper assistance.</Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            {/* Contact Info & Location Section */}
            <Box id="contact" sx={{ backgroundColor: '#1e293b', color: '#f8fafc', py: 10 }}>
                <Container maxWidth="lg">
                    <Grid container spacing={6}>
                        {/* Text and Info */}
                        <Grid item xs={12} md={6}>
                            <Typography 
                                variant="overline" 
                                sx={{ color: '#00bcd4', fontWeight: 800, letterSpacing: '0.15em' }}
                            >
                                Get in Touch
                            </Typography>
                            <Typography 
                                variant="h2" 
                                sx={{ fontWeight: 800, mt: 1, mb: 3, fontSize: { xs: '2rem', md: '2.5rem' }, color: '#ffffff' }}
                            >
                                Contact Our Concierge
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#94a3b8', mb: 5, lineHeight: 1.8 }}>
                                Have questions about booking, hosting private corporate events, or customized suites? Our team is available 24/7 to assist. Reach out directly or visit us.
                            </Typography>

                            <Stack spacing={3}>
                                <Stack direction="row" spacing={2.5} alignItems="center">
                                    <Box sx={{ backgroundColor: 'rgba(0,188,212,0.1)', color: '#00bcd4', p: 1.5, borderRadius: 2 }}>
                                        <Phone />
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>Call Us</Typography>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>+94 (111) 019-283</Typography>
                                    </Box>
                                </Stack>

                                <Stack direction="row" spacing={2.5} alignItems="center">
                                    <Box sx={{ backgroundColor: 'rgba(0,188,212,0.1)', color: '#00bcd4', p: 1.5, borderRadius: 2 }}>
                                        <Email />
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>Email Us</Typography>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>concierge@theazure.com</Typography>
                                    </Box>
                                </Stack>

                                <Stack direction="row" spacing={2.5} alignItems="center">
                                    <Box sx={{ backgroundColor: 'rgba(0,188,212,0.1)', color: '#00bcd4', p: 1.5, borderRadius: 2 }}>
                                        <LocationOn />
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>Location</Typography>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>1 Galle Face, Colombo 2, Sri Lanka</Typography>
                                    </Box>
                                </Stack>
                            </Stack>
                        </Grid>

                        {/* Visual Form / Details Map Mock */}
                        <Grid item xs={12} md={6}>
                            <Box 
                                sx={{ 
                                    backgroundColor: '#0f172a', 
                                    p: 4, 
                                    borderRadius: 4, 
                                    border: '1px solid #334155',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                                }}
                            >
                                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#ffffff' }}>Concierge Desk</Typography>
                                <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>Our front desk reception is located in the Main Lobby, ground level. For express checking-out or immediate baggage assistance, dial Extension 0 from any room line.</Typography>
                                
                                <Box 
                                    sx={{ 
                                        height: 200, 
                                        borderRadius: 2, 
                                        backgroundColor: '#1e293b', 
                                        border: '1px dashed #475569',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 1
                                    }}
                                >
                                    <LocationOn sx={{ color: '#00bcd4', fontSize: '2.5rem' }} />
                                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>Interactive Location Map</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>THE AZURE Grand Lobby entrance</Typography>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Footer */}
            <Box sx={{ backgroundColor: '#0f172a', color: '#64748b', py: 4, borderTop: '1px solid #1e293b' }}>
                <Container maxWidth="lg">
                    <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
                        <Typography variant="body2">
                            &copy; {new Date().getFullYear()} THE AZURE. All rights reserved.
                        </Typography>
                        <Stack direction="row" spacing={3}>
                            <Button size="small" onClick={() => scrollToSection('about')} sx={{ color: '#64748b', '&:hover': { color: '#00bcd4' } }}>About Us</Button>
                            <Button size="small" onClick={() => scrollToSection('rooms')} sx={{ color: '#64748b', '&:hover': { color: '#00bcd4' } }}>Suites</Button>
                            <Button size="small" onClick={() => scrollToSection('contact')} sx={{ color: '#64748b', '&:hover': { color: '#00bcd4' } }}>Contact</Button>
                        </Stack>
                    </Stack>
                </Container>
            </Box>
        </Box>
    );
}
