import React, { useState, useEffect, useContext } from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, Button, IconButton, Badge } from '@mui/material';
import { Menu as MenuIcon, Dashboard, People, Hotel, Event, CheckCircle, Payment, Person, RoomService, Assessment } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const drawerWidth = 240;

const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard', roles: ['admin'] },
    { text: 'Staff Panel', icon: <Dashboard />, path: '/staff-panel', roles: ['staff'] },
    { text: 'Customer Dashboard', icon: <Dashboard />, path: '/customer-dashboard', roles: ['customer'] },
    { text: 'Users', icon: <Person />, path: '/users', roles: ['admin'] },
    { text: 'Customers', icon: <People />, path: '/customers', roles: ['admin', 'staff'] },
    { text: 'Rooms', icon: <Hotel />, path: '/rooms', roles: ['admin', 'staff'] },
    { text: 'Reservations', icon: <Event />, path: '/reservations', roles: ['admin', 'staff'] },
    { text: 'Book a Room', icon: <Hotel />, path: '/book', roles: ['customer'] },
    { text: 'Payments', icon: <Payment />, path: '/payments', roles: ['admin', 'staff'] },
    { text: 'Feedback', icon: <People />, path: '/feedback', roles: ['admin', 'staff', 'customer'], hasBadge: true },
    { text: 'Offers', icon: <RoomService />, path: '/offers', roles: ['admin', 'staff'] },
    { text: 'Reports', icon: <Assessment />, path: '/reports', roles: ['admin'] },
];

export default function Layout({ children }) {
    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [unreadReplies, setUnreadReplies] = useState(0);

    useEffect(() => {
        const checkUnread = async () => {
            if (user?.role?.toLowerCase() === 'customer' && user?.email) {
                try {
                    const res = await axios.get('/feedback');
                    const unread = res.data.filter(fb => 
                        fb.email === user.email && 
                        fb.staff_reply && 
                        fb.reply_seen_by_customer === false
                    ).length;
                    setUnreadReplies(unread);
                } catch (err) {
                    console.error("Error checking unread feedback", err);
                }
            }
        };

        checkUnread();
        const interval = setInterval(checkUnread, 30000); // Check every 30s
        return () => clearInterval(interval);
    }, [user, location.pathname]);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <div>
            <Toolbar>
                <Typography variant="h6" noWrap sx={{ color: '#00bcd4', fontWeight: 'bold' }}>
                    THE AZURE
                </Typography>
            </Toolbar>
            <List sx={{ px: 1 }}>
                {menuItems.filter(item => item.roles.includes(user?.role?.toLowerCase())).map((item) => {
                    const isActive = location.pathname === item.path;
                    const showBadge = item.hasBadge && unreadReplies > 0 && user?.role?.toLowerCase() === 'customer';
                    
                    return (
                        <ListItem 
                            button 
                            key={item.text} 
                            onClick={() => navigate(item.path)}
                            sx={{
                                my: 0.5,
                                borderRadius: 2,
                                transition: 'all 0.2s',
                                ...(isActive && {
                                    backgroundColor: 'rgba(0, 188, 212, 0.1)',
                                    borderLeft: '4px solid #00bcd4',
                                }),
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 188, 212, 0.05)',
                                }
                            }}
                        >
                            <ListItemIcon sx={{ color: isActive ? '#00bcd4' : 'inherit' }}>
                                <Badge color="error" variant="dot" invisible={!showBadge}>
                                    {item.icon}
                                </Badge>
                            </ListItemIcon>
                            <ListItemText 
                                primary={item.text} 
                                primaryTypographyProps={{ 
                                    fontWeight: isActive ? 600 : 400,
                                    color: isActive ? '#00bcd4' : 'inherit'
                                }} 
                            />
                        </ListItem>
                    );
                })}
            </List>
        </div>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(0,0,0,0.05)', color: 'inherit' }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: 700 }}>
                        THE AZURE <span style={{ color: '#00bcd4', fontSize: '0.8rem', fontWeight: 400, marginLeft: '10px' }}>| {user?.role} PANEL</span>
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2" color="text.secondary">{user?.username}</Typography>
                        <Button variant="outlined" size="small" color="primary" sx={{ borderRadius: 2 }} onClick={() => { logout(); navigate('/login'); }}>Logout</Button>
                    </Box>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: '#ffffff', color: '#0f172a' },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: '#ffffff', color: '#0f172a', borderRight: '1px solid rgba(0,0,0,0.05)' },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, minHeight: '100vh', backgroundColor: '#f8fafc' }}
            >
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
}
