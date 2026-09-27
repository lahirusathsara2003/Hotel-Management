import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Grid, Card, CardContent, CircularProgress, TextField, Button, IconButton, Chip } from '@mui/material';
import { Edit as EditIcon, Cancel as CancelIcon } from '@mui/icons-material';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';

export default function GuestFeedback() {
    const { user } = useContext(AuthContext);
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [editingFeedback, setEditingFeedback] = useState(null);

    const fetchFeedback = async () => {
        try {
            const res = await axios.get('/feedback');
            setFeedbacks(res.data);
            
            // Mark as seen if customer
            if (user?.email) {
                await axios.post('/feedback/mark-seen', { email: user.email });
            }
        } catch (err) {
            console.error("Error fetching feedback", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedback();
    }, [user?.email]);

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
            if (editingFeedback) {
                await axios.put(`/feedback/${editingFeedback._id}`, payload);
                alert('Feedback updated successfully!');
            } else {
                await axios.post('/feedback', payload);
                alert('Feedback submitted successfully!');
            }
            e.target.reset();
            setEditingFeedback(null);
            fetchFeedback();
        } catch (err) {
            alert('Error saving feedback');
        } finally {
            setSubmitting(false);
        }
    };

    const startEditing = (fb) => {
        setEditingFeedback(fb);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

    return (
        <Box sx={{ p: 4, maxWidth: 1000, margin: '0 auto' }}>
            <Typography variant="h4" sx={{ color: '#00bcd4', fontWeight: 700, mb: 4 }}>
                Guest Reviews & Experiences
            </Typography>

            {/* Feedback Form (Add/Edit) */}
            <Box sx={{ mb: 6, p: 4, borderRadius: 4, background: '#ffffff', border: '1px solid rgba(0, 0, 0, 0.05)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ color: '#0f172a', fontWeight: 700 }}>
                        {editingFeedback ? 'Update Your Review' : 'Share Your Experience'}
                    </Typography>
                    {editingFeedback && (
                        <Button 
                            startIcon={<CancelIcon />} color="error" 
                            onClick={() => setEditingFeedback(null)}
                        >
                            Cancel Edit
                        </Button>
                    )}
                </Box>
                <form onSubmit={handleFeedbackSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField 
                                name="customer_name" label="Full Name" fullWidth required
                                defaultValue={editingFeedback?.customer_name || user?.username || ''}
                                key={editingFeedback?._id + 'name'}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField 
                                name="email" label="Email Address" type="email" fullWidth required
                                defaultValue={editingFeedback?.email || user?.email || ''}
                                key={editingFeedback?._id + 'email'}
                            />
                        </Grid>
                        <Grid item xs={12} md={10}>
                            <TextField 
                                name="message" label="Your Message" multiline rows={3} fullWidth required
                                defaultValue={editingFeedback?.message || ''}
                                key={editingFeedback?._id + 'msg'}
                                placeholder="How was your stay?"
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <TextField 
                                name="rating" label="Rating (1-5)" type="number" fullWidth required
                                defaultValue={editingFeedback?.rating || ''}
                                key={editingFeedback?._id + 'rat'}
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
                                {submitting ? <CircularProgress size={24} color="inherit" /> : (editingFeedback ? 'Update Review' : 'Submit Feedback')}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>

            <Typography variant="h5" sx={{ color: '#0f172a', mb: 3, fontWeight: 700 }}>Recent Reviews</Typography>
            <Grid container spacing={3}>
                {feedbacks.length === 0 ? (
                    <Grid item xs={12}>
                        <Typography sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                            No reviews yet. Be the first to share your experience!
                        </Typography>
                    </Grid>
                ) : (
                    feedbacks.map((fb) => {
                        const isOwnFeedback = fb.email === user?.email;
                        const canEdit = isOwnFeedback && !fb.staff_reply;

                        return (
                            <Grid item xs={12} key={fb._id}>
                                <Card sx={{ 
                                    backgroundColor: '#ffffff', 
                                    border: '1px solid rgba(0, 0, 0, 0.05)', 
                                    borderRadius: 3,
                                    position: 'relative',
                                    transition: 'all 0.3s',
                                    boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                                    '&:hover': { border: '1px solid rgba(0, 188, 212, 0.3)', transform: 'translateY(-2px)', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }
                                }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Typography sx={{ color: '#00bcd4', fontWeight: 600 }}>{fb.customer_name}</Typography>
                                                {isOwnFeedback && <Chip label="My Review" size="small" variant="outlined" sx={{ color: '#00bcd4', borderColor: '#00bcd4', height: 20 }} />}
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography sx={{ color: '#4caf50' }}>{'★'.repeat(fb.rating)}{'☆'.repeat(5-fb.rating)}</Typography>
                                                {canEdit && (
                                                    <IconButton size="small" sx={{ color: '#00bcd4' }} onClick={() => startEditing(fb)}>
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                )}
                                            </Box>
                                        </Box>
                                        <Typography sx={{ color: 'text.primary', mb: 2 }}>{fb.message}</Typography>
                                        
                                        {fb.staff_reply && (
                                            <Box sx={{ 
                                                p: 2, mt: 2, ml: 2, borderRadius: 2, 
                                                backgroundColor: 'rgba(0, 188, 212, 0.05)', 
                                                borderLeft: '4px solid #00bcd4' 
                                            }}>
                                                <Typography variant="caption" sx={{ color: '#00bcd4', fontWeight: 'bold', display: 'block', mb: 0.5 }}>
                                                    STAFF RESPONSE:
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                                                    {fb.staff_reply}
                                                </Typography>
                                            </Box>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })
                )}
            </Grid>
        </Box>
    );
}
