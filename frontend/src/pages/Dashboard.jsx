import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { Hotel, People, Event, Payment } from '@mui/icons-material';
import axios from '../api/axios';

const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ 
        minWidth: 200, 
        borderLeft: `4px solid ${color}`,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100px',
            height: '100%',
            background: `linear-gradient(to right, transparent, ${color}15)`,
            transform: 'skewX(-20deg) translateX(20px)',
            zIndex: 0
        }
    }}>
        <CardContent sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography color="textSecondary" gutterBottom variant="subtitle2" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                        {title}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        {value}
                    </Typography>
                </Box>
                <Box sx={{ 
                    color: color, 
                    p: 1.5, 
                    backgroundColor: `${color}15`, 
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {React.cloneElement(icon, { fontSize: 'large' })}
                </Box>
            </Box>
        </CardContent>
    </Card>
);

export default function Dashboard() {
    const [stats, setStats] = useState({ rooms: 0, customers: 0, reservations: 0, revenue: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [roomsRes, custRes, resRes, payRes] = await Promise.all([
                    axios.get('/rooms'),
                    axios.get('/customers'),
                    axios.get('/reservations'),
                    axios.get('/payments')
                ]);
                
                const revenue = payRes.data.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
                
                setStats({
                    rooms: roomsRes.data.length,
                    customers: custRes.data.length,
                    reservations: resRes.data.length,
                    revenue: revenue
                });
            } catch (err) {
                console.error("Failed to fetch dashboard stats", err);
            }
        };
        fetchStats();
    }, []);

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 4 }}>Dashboard Overview</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Total Rooms" value={stats.rooms} icon={<Hotel />} color="#1976d2" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Total Customers" value={stats.customers} icon={<People />} color="#2e7d32" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Active Reservations" value={stats.reservations} icon={<Event />} color="#ed6c02" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Total Revenue" value={`LKR ${stats.revenue}`} icon={<Payment />} color="#9c27b0" />
                </Grid>
            </Grid>
        </Box>
    );
}
