import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Layout from './components/Layout';

// Pages placeholders
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import GenericCrudPage from './pages/GenericCrudPage';
import StaffPanel from './pages/StaffPanel';
import CustomerDashboard from './pages/CustomerDashboard';
import CustomerBooking from './pages/CustomerBooking';
import GuestFeedback from './pages/GuestFeedback';

const userSchema = [
    { name: 'username', label: 'Name', type: 'text', required: true, minLength: 3 },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'password', label: 'Password', type: 'password', required: true, minLength: 6 },
    { name: 'role', label: 'Role', type: 'text', required: true }
];

const customerSchema = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'phone', label: 'Phone', type: 'text', required: true, pattern: '^[0-9]{10}$', errorMsg: 'Must be 10 digits' },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'address', label: 'Address', type: 'text', required: true },
    { name: 'id_proof', label: 'ID Proof', type: 'text', required: true }
];

const roomSchema = [
    { name: 'room_number', label: 'Room Number', type: 'text', required: true },
    { name: 'type', label: 'Type', type: 'text', required: true },
    { name: 'price_per_night', label: 'Price', type: 'number', required: true, min: 0.01 },
    { name: 'status', label: 'Status', type: 'select', required: true, options: ['Available', 'Booked', 'Unavailable'] }
];

const reservationSchema = [
    { name: 'reservation_id', label: 'Reservation ID', type: 'text', readOnly: true },
    { 
        name: 'customer_id', label: 'Customer', type: 'select', required: true,
        fetchUrl: '/customers', optionLabel: 'name', optionValue: '_id',
        displayField: 'customer_name'
    },
    { 
        name: 'room_id', label: 'Room', type: 'select', required: true,
        fetchUrl: '/rooms/available', optionLabel: 'room_number', optionValue: '_id',
        displayField: 'room_number'
    },
    { name: 'check_in_date', label: 'Check-in Date', type: 'date', required: true },
    { name: 'check_out_date', label: 'Check-out Date', type: 'date', required: true }
];


const paymentSchema = [
    { 
        name: 'reservation_id', label: 'Reservation ID', type: 'select', required: true,
        fetchUrl: '/reservations/unpaid', optionLabel: 'reservation_id', optionValue: 'reservation_id'
    },
    { name: 'amount', label: 'Amount', type: 'number', required: true, min: 0.01 },
    { 
        name: 'payment_method', label: 'Payment Method', type: 'select', required: true,
        options: ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Online Payment']
    },
    { name: 'status', label: 'Status', type: 'select', required: true, options: ['Pending', 'Success', 'Half Payment'] },
    { name: 'date', label: 'Date', type: 'date', required: true, readOnly: true }
];



const feedbackSchema = [
    { name: 'customer_name', label: 'Customer Name', type: 'text', required: true, readOnly: true },
    { name: 'email', label: 'Email', type: 'email', required: true, readOnly: true },
    { name: 'message', label: 'Feedback Message', type: 'text', required: true, readOnly: true },
    { name: 'rating', label: 'Rating (1-5)', type: 'number', required: true, min: 1, max: 5, readOnly: true },
    { name: 'staff_reply', label: 'Staff Reply', type: 'text', required: false }
];

const offerSchema = [
    { name: 'title', label: 'Offer Title', type: 'text', required: true },
    { name: 'type', label: 'Type', type: 'select', required: true, options: ['Discount', 'Package', 'Special Offer', 'Seasonal'] },
    { name: 'description', label: 'Description', type: 'text', required: true },
    { name: 'value', label: 'Discount Value (e.g. 20% or LKR 5000)', type: 'text', required: true },
    { name: 'start_date', label: 'Start Date', type: 'date', required: true },
    { name: 'end_date', label: 'End Date', type: 'date', required: true },
    { name: 'status', label: 'Status', type: 'select', required: true, options: ['Active', 'Expired', 'Upcoming'] }
];

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);
    
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    
    if (allowedRoles && !allowedRoles.includes(user.role?.toLowerCase())) {
        // Redirect to their respective dashboard if they don't have access
        const dashboardPath = user.role?.toLowerCase() === 'customer' ? '/customer-dashboard' : '/dashboard';
        return <Navigate to={dashboardPath} />;
    }
    
    return <Layout>{children}</Layout>;
};

// Root redirect based on role
const RootRedirect = () => {
    const { user, loading } = useContext(AuthContext);
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    
    if (user.role?.toLowerCase() === 'customer') {
        return <Navigate to="/customer-dashboard" />;
    } else if (user.role?.toLowerCase() === 'staff') {
        return <Navigate to="/staff-panel" />;
    }
    return <Dashboard />;
};

function FeedbackWrapper({ feedbackSchema }) {
    const { user } = useContext(AuthContext);
    if (user?.role?.toLowerCase() === 'customer') {
        return <GuestFeedback />;
    }
    return <GenericCrudPage 
        entity="feedback" 
        title="Customer Feedback" 
        columns={feedbackSchema} 
        canCreate={false} 
        editLabel="Reply"
    />;
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* Public Landing Page */}
                    <Route path="/" element={<LandingPage />} />
                    
                    {/* Protected Routes */}
                    <Route path="/dashboard" element={<ProtectedRoute><RootRedirect /></ProtectedRoute>} />
                    <Route path="/staff-panel" element={<ProtectedRoute allowedRoles={['staff', 'admin']}><StaffPanel /></ProtectedRoute>} />
                    <Route path="/customer-dashboard" element={<ProtectedRoute allowedRoles={['customer', 'admin']}><CustomerDashboard /></ProtectedRoute>} />
                    <Route path="/book" element={<ProtectedRoute allowedRoles={['customer', 'admin']}><CustomerBooking /></ProtectedRoute>} />
                    
                    <Route path="/users" element={<ProtectedRoute allowedRoles={['admin']}><GenericCrudPage entity="users" title="User Management" columns={userSchema} /></ProtectedRoute>} />
                    <Route path="/customers" element={<ProtectedRoute allowedRoles={['admin', 'staff']}><GenericCrudPage entity="customers" title="Customer Management" columns={customerSchema} /></ProtectedRoute>} />
                    <Route path="/rooms" element={<ProtectedRoute allowedRoles={['admin', 'staff']}><GenericCrudPage entity="rooms" title="Room Management" columns={roomSchema} /></ProtectedRoute>} />
                    <Route path="/reservations" element={<ProtectedRoute allowedRoles={['admin', 'staff']}><GenericCrudPage entity="reservations" title="Reservation System" columns={reservationSchema} afterSavePath="/payments" /></ProtectedRoute>} />
                    <Route path="/payments" element={<ProtectedRoute allowedRoles={['admin', 'staff']}><GenericCrudPage entity="payments" title="Payments" columns={paymentSchema} /></ProtectedRoute>} />
                    <Route path="/feedback" element={<ProtectedRoute allowedRoles={['admin', 'staff', 'customer']}><FeedbackWrapper feedbackSchema={feedbackSchema} /></ProtectedRoute>} />
                    <Route path="/offers" element={<ProtectedRoute allowedRoles={['admin', 'staff']}><GenericCrudPage entity="offers" title="Offers & Packages" columns={offerSchema} /></ProtectedRoute>} />
                    <Route path="/reports" element={<ProtectedRoute allowedRoles={['admin']}><div style={{ color: '#fff', padding: '20px' }}>Reports Page (Admin Only)</div></ProtectedRoute>} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
