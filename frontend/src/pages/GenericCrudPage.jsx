import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Button, Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, 
    DialogActions, TextField, IconButton, Snackbar, Alert, MenuItem, Chip 
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import axios from '../api/axios';

import { useNavigate } from 'react-router-dom';

export default function GenericCrudPage({ entity, title, columns, canCreate = true, editLabel = 'Edit', afterSavePath = null }) {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [editingId, setEditingId] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const fetchData = async () => {
        try {
            const res = await axios.get(`/${entity}`);
            setData(res.data);
        } catch (err) {
            showSnackbar('Error fetching data', 'error');
        }
    };

    useEffect(() => {
        fetchData();
    }, [entity]);

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    const validateField = (col, value, allData = formData) => {
        if (col.required && (!value || String(value).trim() === '')) {
            return `${col.label} is required`;
        }
        if (value) {
            if (col.minLength && String(value).length < col.minLength) {
                return `Minimum ${col.minLength} characters required`;
            }
            if (col.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                return 'Invalid email format';
            }
            if (col.pattern && !new RegExp(col.pattern).test(value)) {
                return col.errorMsg || 'Invalid format';
            }
            if (col.min !== undefined && Number(value) < col.min) {
                return `Value must be at least ${col.min}`;
            }
            if (col.name === 'check_out_date' && allData.check_in_date) {
                if (new Date(value) <= new Date(allData.check_in_date)) {
                    return 'Check-out date must be after Check-in date';
                }
            }
        }
        return '';
    };

    const [dynamicOptions, setDynamicOptions] = useState({});

    const fetchDynamicOptions = async (col) => {
        if (col.fetchUrl && !dynamicOptions[col.name]) {
            try {
                const res = await axios.get(col.fetchUrl);
                setDynamicOptions(prev => ({ ...prev, [col.name]: res.data }));
            } catch (err) {
                console.error(`Error fetching options for ${col.name}`, err);
            }
        }
    };

    const handleOpen = (item = null) => {
        columns.forEach(col => {
            if (col.fetchUrl) fetchDynamicOptions(col);
        });
        if (item) {
            setFormData(item);
            setEditingId(item._id);
        } else {
            const initialData = {};
            // Pre-fill today's date for date fields that are readOnly
            columns.forEach(col => {
                if (col.type === 'date' && col.readOnly) {
                    initialData[col.name] = new Date().toISOString().split('T')[0];
                }
            });
            setFormData(initialData);
            setEditingId(null);
        }
        setErrors({});
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setFormData({});
        setErrors({});
        setEditingId(null);
    };

    const handleChange = (e, col) => {
        const val = e.target.value;
        const newFormData = { ...formData, [col.name]: val };
        
        // Auto-calculate amount for payments when reservation is selected
        if (entity === 'payments' && col.name === 'reservation_id') {
            const selectedRes = (dynamicOptions['reservation_id'] || []).find(r => r.reservation_id === val);
            if (selectedRes && selectedRes.total_amount !== undefined) {
                newFormData.amount = selectedRes.total_amount;
                // Default to today's date if empty
                if (!newFormData.date) {
                    newFormData.date = new Date().toISOString().split('T')[0];
                }
            }
        }

        setFormData(newFormData);
        
        const error = validateField(col, val, newFormData);
        setErrors(prev => ({ ...prev, [col.name]: error }));
        
        if (col.name === 'check_in_date' && newFormData.check_out_date) {
            const outCol = columns.find(c => c.name === 'check_out_date');
            if (outCol) {
                const outError = validateField(outCol, newFormData.check_out_date, newFormData);
                setErrors(prev => ({ ...prev, check_out_date: outError }));
            }
        }
    };

    const isFormValid = () => {
        let valid = true;
        columns.forEach(col => {
            const err = validateField(col, formData[col.name], formData);
            if (err) valid = false;
        });
        return valid;
    };

    const handleSave = async () => {
        try {
            const payload = { ...formData };
            delete payload._id;

            if (editingId) {
                await axios.put(`/${entity}/${editingId}`, payload);
                showSnackbar('Updated successfully');
            } else {
                await axios.post(`/${entity}`, payload);
                showSnackbar('Added successfully');
                if (afterSavePath) {
                    setTimeout(() => navigate(afterSavePath), 1000);
                }
            }
            fetchData();
            handleClose();
        } catch (err) {
            showSnackbar(err.response?.data?.message || 'Error saving data', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await axios.delete(`/${entity}/${id}`);
                showSnackbar('Deleted successfully');
                fetchData();
            } catch (err) {
                showSnackbar(err.response?.data?.message || 'Error deleting data', 'error');
            }
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">{title}</Typography>
                {canCreate && (
                    <Button variant="contained" color="primary" onClick={() => handleOpen()}>
                        Add New
                    </Button>
                )}
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columns.map(col => (
                                <TableCell key={col.name} sx={{ fontWeight: 'bold' }}>
                                    {col.label}
                                </TableCell>
                            ))}
                            <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row) => (
                            <TableRow key={row._id}>
                                {columns.map(col => (
                                    <TableCell key={col.name}>
                                        {col.name === 'status' ? (
                                            <Chip 
                                                label={row[col.name]} 
                                                color={
                                                    row[col.name] === 'Available' || row[col.name] === 'Success' || row[col.name] === 'Paid' 
                                                    ? 'success' 
                                                    : row[col.name] === 'Half Payment' ? 'warning'
                                                    : (row[col.name] === 'Unavailable' || row[col.name] === 'Booked' || row[col.name] === 'Pending' || row[col.name] === 'Cancelled' ? 'error' : 'default')
                                                }
                                                variant="outlined"
                                                size="small"
                                            />
                                        ) : col.name === 'staff_reply' ? (
                                            <Typography variant="body2" sx={{ fontStyle: 'italic', color: row[col.name] ? '#00bcd4' : 'rgba(0,0,0,0.3)' }}>
                                                {row[col.name] || 'No reply yet'}
                                            </Typography>
                                        ) : (
                                            row[col.displayField || col.name]
                                        )}
                                    </TableCell>
                                ))}
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                    {(() => {
                                        const isLocked = entity === 'payments' && row.status === 'Success';
                                        return (
                                            <>
                                                {editLabel !== 'Edit' ? (
                                                    <Button 
                                                        size="small" 
                                                        variant="contained" 
                                                        color="primary" 
                                                        onClick={() => handleOpen(row)}
                                                        disabled={isLocked}
                                                        sx={{ mr: 1, textTransform: 'none', fontWeight: 600 }}
                                                    >
                                                        {editLabel}
                                                    </Button>
                                                ) : (
                                                    <IconButton 
                                                        color="primary" 
                                                        onClick={() => handleOpen(row)} 
                                                        disabled={isLocked}
                                                        title={isLocked ? "Success payments cannot be edited" : editLabel}
                                                    >
                                                        <Edit />
                                                    </IconButton>
                                                )}
                                                <IconButton 
                                                    color="error" 
                                                    onClick={() => handleDelete(row._id)} 
                                                    disabled={isLocked}
                                                    title={isLocked ? "Success payments cannot be deleted" : "Delete"}
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </>
                                        );
                                    })()}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{editingId ? editLabel : 'Add'} {title}</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {columns.filter(col => !col.readOnly || !!editingId).map(col => (
                            <TextField
                                key={col.name}
                                label={col.label}
                                type={col.type === 'date' ? 'date' : col.type}
                                select={col.type === 'select'}
                                fullWidth
                                value={formData[col.name] || ''}
                                onChange={(e) => handleChange(e, col)}
                                error={!!errors[col.name]}
                                helperText={errors[col.name] || ''}
                                InputLabelProps={col.type === 'date' ? { shrink: true } : undefined}
                                InputProps={{ readOnly: col.readOnly }}
                                placeholder={col.readOnly && !editingId && col.type !== 'date' ? '(Auto-generated)' : ''}
                                required={col.required && (!col.readOnly || editingId)}
                            >
                                {col.type === 'select' && (dynamicOptions[col.name] || col.options || []).map((opt) => (
                                    <MenuItem key={opt._id || opt} value={opt[col.optionValue] || opt}>
                                        {opt[col.optionLabel] || opt}
                                    </MenuItem>
                                ))}
                            </TextField>
                        ))}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained" color="primary" disabled={!isFormValid()}>Save</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
