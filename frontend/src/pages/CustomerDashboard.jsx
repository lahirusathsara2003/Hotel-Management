import React, { useState, useEffect, useContext } from 'react';
import { 
    Box, Typography, Grid, Card, CardContent, Button, 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    CircularProgress, Chip, TextField
} from '@mui/material';
import { Hotel, EventAvailable, ReceiptLong } from '@mui/icons-material';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function CustomerDashboard() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [roomsCount, setRoomsCount] = useState(0);
    const [feedbacks, setFeedbacks] = useState([]);
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const fetchDashboardData = async () => {
        try {
            const [bookingsRes, roomsRes, feedbackRes, offersRes] = await Promise.all([
                axios.get('/reservations/my'),
                axios.get('/rooms/available'),
                axios.get('/feedback'),
                axios.get('/offers')
            ]);
            setBookings(bookingsRes.data);
            setRoomsCount(roomsRes.data.length);
            setFeedbacks(feedbackRes.data);
            setOffers(offersRes.data);
        } catch (err) {
            console.error("Error fetching dashboard data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const payload = {
            customer_name: formData.get('customer_name'),
            email: formData.get('email'),
            message: formData.get('message'),
            rating: Number(formData.get('rating'))
        };
        setSubmitting(true);
        try {
            await axios.post('/feedback', payload);
            alert('Feedback submitted successfully!');
            e.target.reset();
            fetchDashboardData();
        } catch (err) {
            alert('Error submitting feedback');
        } finally {
            setSubmitting(false);
        }
    };

    const actions = [
        { 
            title: 'My Bookings', 
            count: `${bookings.length} ${bookings.length === 1 ? 'Booking' : 'Bookings'}`, 
            icon: <Hotel fontSize="large" />, 
            color: '#00bcd4',
            onClick: () => {} 
        },
        { 
            title: 'Available Rooms', 
            count: roomsCount, 
            icon: <EventAvailable fontSize="large" />, 
            color: '#4caf50',
            onClick: () => navigate('/book')
        },
        { 
            title: 'My Profile', 
            count: user?.username || 'Member', 
            icon: <ReceiptLong fontSize="large" />, 
            color: '#f50057',
            onClick: () => {} 
        },
    ];

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ color: '#00bcd4', fontWeight: 700, mb: 1 }}>
                Welcome, {user?.username || 'Guest'}
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
                Experience the finest hotel services at your fingertips.
            </Typography>

            <Grid container spacing={3}>
                {actions.map((action, index) => (
                    <Grid item xs={12} md={4} key={index}>
                        <Card sx={{ 
                            backgroundColor: '#ffffff',
                            border: `1px solid ${action.color}44`,
                            boxShadow: `0 4px 20px 0 rgba(0,0,0,0.05)`,
                            borderRadius: 3,
                            height: '100%'
                        }}>
                            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
                                <Box sx={{ color: action.color, mb: 2 }}>{action.icon}</Box>
                                <Typography variant="h6" sx={{ color: '#0f172a', fontWeight: 600 }}>
                                    {action.title}
                                </Typography>
                                <Typography sx={{ color: 'text.secondary', mb: 3 }}>
                                    {action.count}
                                </Typography>
                                <Button 
                                    variant="outlined" 
                                    sx={{ color: action.color, borderColor: action.color, borderRadius: 2 }}
                                    onClick={action.onClick}
                                >
                                    {action.title === 'Available Rooms' ? 'Book Now' : 'View Details'}
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Typography variant="h5" sx={{ color: '#0f172a', mt: 6, mb: 3, fontWeight: 700 }}>My Recent Bookings</Typography>
            <TableContainer component={Paper} sx={{ backgroundColor: '#ffffff', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: '#00bcd4', fontWeight: 'bold' }}>ID</TableCell>
                            <TableCell sx={{ color: '#00bcd4', fontWeight: 'bold' }}>Room No</TableCell>
                            <TableCell sx={{ color: '#00bcd4', fontWeight: 'bold' }}>Type</TableCell>
                            <TableCell sx={{ color: '#00bcd4', fontWeight: 'bold' }}>Check-In</TableCell>
                            <TableCell sx={{ color: '#00bcd4', fontWeight: 'bold' }}>Check-Out</TableCell>
                            <TableCell sx={{ color: '#00bcd4', fontWeight: 'bold' }}>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bookings.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ color: 'text.secondary', py: 4 }}>
                                    You have no bookings yet. 
                                    <Button sx={{ ml: 2, color: '#00bcd4', fontWeight: 600 }} onClick={() => navigate('/book')}>Book a room</Button>
                                </TableCell>
                            </TableRow>
                        ) : (
                            bookings.map((booking) => (
                                <TableRow key={booking._id}>
                                    <TableCell sx={{ color: '#00bcd4', fontWeight: 600 }}>{booking.reservation_id}</TableCell>
                                    <TableCell sx={{ color: '#0f172a' }}>{booking.room_number || 'N/A'}</TableCell>
                                    <TableCell sx={{ color: '#0f172a' }}>{booking.room_type || 'N/A'}</TableCell>
                                    <TableCell sx={{ color: '#0f172a' }}>{booking.check_in_date}</TableCell>
                                    <TableCell sx={{ color: '#0f172a' }}>{booking.check_out_date}</TableCell>
                                    <TableCell>
                                        <Chip label="Confirmed" color="primary" size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Typography variant="h5" sx={{ color: '#0f172a', mt: 6, mb: 3, fontWeight: 700 }}>Guest Reviews & Replies</Typography>
            <Grid container spacing={3}>
                {feedbacks.length === 0 ? (
                    <Grid item xs={12}>
                        <Typography sx={{ color: 'text.secondary', fontStyle: 'italic' }}>No reviews yet.</Typography>
                    </Grid>
                ) : (
                    feedbacks.map((fb) => (
                        <Grid item xs={12} key={fb._id}>
                            <Card sx={{ backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.05)', borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography sx={{ color: '#00bcd4', fontWeight: 600 }}>{fb.customer_name}</Typography>
                                        <Typography sx={{ color: '#4caf50' }}>{'★'.repeat(fb.rating)}</Typography>
                                    </Box>
                                    <Typography sx={{ color: '#0f172a', mb: 2 }}>{fb.message}</Typography>
                                    
                                    {fb.staff_reply && (
                                        <Box sx={{ 
                                            p: 2, mt: 1, ml: 2, borderRadius: 2, 
                                            backgroundColor: 'rgba(0, 188, 212, 0.05)', 
                                            borderLeft: '4px solid #00bcd4' 
                                        }}>
                                            <Typography variant="caption" sx={{ color: '#00bcd4', fontWeight: 'bold', display: 'block', mb: 0.5 }}>
                                                STAFF RESPONSE:
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'text.primary', fontStyle: 'italic' }}>
                                                {fb.staff_reply}
                                            </Typography>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>

            <Box sx={{ mt: 6, p: 4, borderRadius: 4, background: '#ffffff', border: '1px solid rgba(0, 0, 0, 0.05)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <Typography variant="h5" sx={{ color: '#0f172a', mb: 3, fontWeight: 700 }}>Give Us Your Feedback</Typography>
                <form onSubmit={handleFeedbackSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField 
                                name="customer_name" label="Full Name" fullWidth required
                                defaultValue={user?.username || ''}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField 
                                name="email" label="Email Address" type="email" fullWidth required
                                defaultValue={user?.email || ''}
                            />
                        </Grid>
                        <Grid item xs={12} md={10}>
                            <TextField 
                                name="message" label="Your Message" multiline rows={3} fullWidth required
                                placeholder="How was your stay?"
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <TextField 
                                name="rating" label="Rating (1-5)" type="number" fullWidth required
                                InputProps={{ inputProps: { min: 1, max: 5 } }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button 
                                type="submit" variant="contained" disabled={submitting}
                                sx={{ 
                                    py: 1.5, px: 6, 
                                    background: 'linear-gradient(135deg, #00bcd4 0%, #00acc1 100%)',
                                    color: '#fff', fontWeight: 700, borderRadius: 2
                                }}
                            >
                                {submitting ? <CircularProgress size={24} color="inherit" /> : 'Submit Feedback'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>

            <Typography variant="h5" sx={{ color: '#0f172a', mt: 6, mb: 3, fontWeight: 700 }}>Exclusive Offers & Packages</Typography>
            <Grid container spacing={3}>
                {offers.length === 0 ? (
                    <Grid item xs={12}>
                        <Box sx={{ p: 4, borderRadius: 4, background: '#ffffff', border: '1px dotted rgba(0,0,0,0.2)', textAlign: 'center' }}>
                            <Typography sx={{ color: 'text.secondary' }}>No special offers available at the moment. Stay tuned!</Typography>
                        </Box>
                    </Grid>
                ) : (
                    offers.filter(o => o.status === 'Active').map((offer) => (
                        <Grid item xs={12} md={6} key={offer._id}>
                            <Box sx={{ 
                                p: 3, borderRadius: 4, 
                                background: 'linear-gradient(45deg, rgba(0, 188, 212, 0.05), rgba(0, 172, 193, 0.02))', 
                                border: '1px solid rgba(10, 162, 188, 0.2)',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
                            }}>
                                <Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                        <Typography variant="h6" sx={{ color: '#00bcd4', fontWeight: 700 }}>{offer.title}</Typography>
                                        <Chip label={offer.type} size="small" variant="outlined" sx={{ color: '#00bcd4', borderColor: '#00bcd4', fontWeight: 600 }} />
                                    </Box>
                                    <Typography variant="body2" sx={{ color: 'text.primary', mb: 2 }}>
                                        {offer.description}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                        <Typography variant="h5" sx={{ color: '#2e7d32', fontWeight: 800 }}>{offer.value}</Typography>
                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>OFF</Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                        Valid until: {offer.end_date}
                                    </Typography>
                                    <Button variant="contained" size="small" sx={{ background: '#00bcd4', color: '#fff', fontWeight: 700, borderRadius: 2 }}>
                                        Claim Now
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>
                    ))
                )}
            </Grid>
        </Box>
    );
}
