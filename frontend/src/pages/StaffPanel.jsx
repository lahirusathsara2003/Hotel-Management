import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { Assignment, Group, Schedule } from '@mui/icons-material';

export default function StaffPanel() {
    const stats = [
        { title: 'My Shift', value: '08:00 AM - 04:00 PM', icon: <Schedule fontSize="large" />, color: '#00bcd4' },
        { title: 'Pending Tasks', value: '5', icon: <Assignment fontSize="large" />, color: '#f50057' },
        { title: 'Active Staff', value: '12', icon: <Group fontSize="large" />, color: '#4caf50' },
    ];

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ color: '#00bcd4', fontWeight: 700, mb: 4 }}>
                Staff Management Panel
            </Typography>
            <Grid container spacing={3}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} md={4} key={index}>
                        <Card sx={{ 
                            backgroundColor: '#ffffff',
                            border: `1px solid ${stat.color}44`,
                            boxShadow: `0 4px 15px 0 ${stat.color}11`,
                            borderRadius: 3
                        }}>
                            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                <Box sx={{ color: stat.color }}>{stat.icon}</Box>
                                <Box>
                                    <Typography variant="subtitle2" sx={{ color: 'text.secondary', textTransform: 'uppercase' }}>
                                        {stat.title}
                                    </Typography>
                                    <Typography variant="h5" sx={{ color: '#0f172a', fontWeight: 700 }}>
                                        {stat.value}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Box sx={{ mt: 6, p: 4, borderRadius: 3, backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <Typography variant="h6" sx={{ color: '#0f172a', mb: 2 }}>Daily Operations</Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                    Welcome to the staff portal. Here you can manage room service requests, check daily schedules, and communicate with the management team.
                </Typography>
            </Box>
        </Box>
    );
}
