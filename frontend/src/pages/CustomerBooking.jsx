import React, { useState, useEffect, useContext } from 'react';
import { 
    Box, Typography, Grid, Card, CardContent, Button, TextField, 
    MenuItem, CircularProgress, Alert, Snackbar, Paper 
} from '@mui/material';
import { Hotel, DateRange, CheckCircle } from '@mui/icons-material';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function CustomerBooking() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [error, setError] = useState('');
    const [successData, setSuccessData] = useState(null);

    const [formData, setFormData] = useState({
        room_id: '',
        check_in_date: '',
        check_out_date: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [roomsRes, customerRes] = await Promise.all([
                axios.get('/rooms/available'),
                axios.get('/customers/me')
            ]);
            setRooms(roomsRes.data);
            setCustomer(customerRes.data);
        } catch (err) {
            setError('Could not load booking information. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        if (!customer) return setError('Customer profile not found');
        
        setBookingLoading(true);
        try {
            const selectedRoom = rooms.find(r => r._id === formData.room_id);
            const payload = {
                ...formData,
                customer_id: customer._id
            };
            const res = await axios.post('/reservations', payload);
            setSuccessData({
                ...res.data,
                room_number: selectedRoom.room_number,
                room_type: selectedRoom.type,
                check_in_date: formData.check_in_date,
                check_out_date: formData.check_out_date
            });
            setFormData({ room_id: '', check_in_date: '', check_out_date: '' });
            fetchData(); // Refresh available rooms
        } catch (err) {
            setError(err.response?.data?.message || 'Error creating reservation');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

    if (successData) {
        return (
            <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
                <CheckCircle sx={{ color: '#4caf50', fontSize: 80, mb: 2 }} />
                <Typography variant="h4" sx={{ color: '#0f172a', fontWeight: 700, mb: 1 }}>Booking Confirmed!</Typography>
                <Typography sx={{ color: 'text.secondary', mb: 4 }}>Your luxury stay at THE AZURE has been reserved.</Typography>
                
                <Card sx={{ 
                    maxWidth: 500, width: '100%', 
                    backgroundColor: '#ffffff', 
                    border: '1px solid rgba(0, 188, 212, 0.2)', 
                    borderRadius: 4, p: 2,
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'
                }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                            <Typography sx={{ color: 'text.secondary' }}>Reservation ID:</Typography>
                            <Typography sx={{ color: '#00bcd4', fontWeight: 700 }}>{successData.reservation_id}</Typography>
                        </Box>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontWeight: 600 }}>ROOM</Typography>
                                <Typography sx={{ color: '#0f172a', fontWeight: 600 }}>Room {successData.room_number} ({successData.room_type})</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontWeight: 600 }}>GUEST</Typography>
                                <Typography sx={{ color: '#0f172a', fontWeight: 600 }}>{user?.username}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontWeight: 600 }}>CHECK-IN</Typography>
                                <Typography sx={{ color: '#0f172a', fontWeight: 600 }}>{successData.check_in_date}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontWeight: 600 }}>CHECK-OUT</Typography>
                                <Typography sx={{ color: '#0f172a', fontWeight: 600 }}>{successData.check_out_date}</Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
                
                <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                    <Button variant="outlined" onClick={() => setSuccessData(null)} sx={{ color: '#00bcd4', borderColor: '#00bcd4' }}>Book Another Room</Button>
                    <Button variant="contained" onClick={() => navigate('/customer-dashboard')} sx={{ background: '#00bcd4', color: '#fff', fontWeight: 700 }}>Go to Dashboard</Button>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4, maxWidth: 900, margin: '0 auto' }}>
            <Typography variant="h4" sx={{ color: '#00bcd4', fontWeight: 700, mb: 4 }}>
                Book Your Stay
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>}

            <Grid container spacing={4}>
                <Grid item xs={12} md={5}>
                    <Paper sx={{ 
                        p: 4, backgroundColor: '#ffffff', 
                        borderRadius: 4,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                        border: '1px solid rgba(0, 0, 0, 0.05)'
                    }}>
                        <Typography variant="h6" sx={{ color: '#0f172a', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <DateRange sx={{ color: '#00bcd4' }} /> Reservation Details
                        </Typography>
                        <form onSubmit={handleBooking}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <TextField
                                    select label="Select Room" fullWidth required
                                    value={formData.room_id}
                                    onChange={(e) => setFormData({ ...formData, room_id: e.target.value })}
                                >
                                    {rooms.map((room) => (
                                        <MenuItem key={room._id} value={room._id}>
                                            Room {room.room_number} - {room.type} (LKR {room.price_per_night}/night)
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <TextField
                                    label="Check-in Date" type="date" fullWidth required
                                    InputLabelProps={{ shrink: true }}
                                    value={formData.check_in_date}
                                    onChange={(e) => setFormData({ ...formData, check_in_date: e.target.value })}
                                />

                                <TextField
                                    label="Check-out Date" type="date" fullWidth required
                                    InputLabelProps={{ shrink: true }}
                                    value={formData.check_out_date}
                                    onChange={(e) => setFormData({ ...formData, check_out_date: e.target.value })}
                                />

                                <Button 
                                    variant="contained" fullWidth type="submit"
                                    disabled={bookingLoading || !formData.room_id}
                                    sx={{ 
                                        mt: 2, py: 1.5, fontWeight: 700,
                                        background: 'linear-gradient(45deg, #00bcd4 30%, #00acc1 90%)',
                                        boxShadow: '0 4px 15px 0 rgba(0, 188, 212, 0.3)',
                                        color: '#fff'
                                    }}
                                >
                                    {bookingLoading ? <CircularProgress size={24} color="inherit" /> : 'Confirm Booking'}
                                </Button>
                            </Box>
                        </form>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={7}>
                    <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2 }}>Available Rooms</Typography>
                    <Grid container spacing={2}>
                        {rooms.length === 0 ? (
                            <Grid item xs={12}>
                                <Typography sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                                    No rooms currently available. Please check back later.
                                </Typography>
                            </Grid>
                        ) : (
                            rooms.map((room) => (
                                <Grid item xs={12} sm={6} key={room._id}>
                                    <Card sx={{ 
                                        backgroundColor: '#ffffff', 
                                        border: '1px solid rgba(0,0,0,0.05)',
                                        borderRadius: 2,
                                        transition: 'all 0.2s',
                                        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', border: '1px solid rgba(0, 188, 212, 0.3)' }
                                    }}>
                                        <CardContent>
                                            <Typography variant="h6" sx={{ color: '#00bcd4', fontWeight: 600 }}>
                                                Room {room.room_number}
                                            </Typography>
                                            <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
                                                {room.type}
                                            </Typography>
                                            <Typography sx={{ color: '#0f172a', mt: 1, fontWeight: 700 }}>
                                                LKR {room.price_per_night} <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'text.secondary' }}>/ night</span>
                                            </Typography>
                                            <Button 
                                                size="small" 
                                                sx={{ mt: 1, color: '#00bcd4', fontWeight: 600 }}
                                                onClick={() => setFormData({ ...formData, room_id: room._id })}
                                            >
                                                Select This Room
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))
                        )}
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
}
