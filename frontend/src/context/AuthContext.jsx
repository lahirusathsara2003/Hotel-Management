import React, { createContext, useState, useEffect } from 'react';
import axios from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        const email = localStorage.getItem('email');
        const role = localStorage.getItem('role');

        if (token && username) {
            setUser({ username, email, role, token });
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await axios.post('/auth/login', { email, password });
        const { token, role, username: resUsername, email: resEmail } = response.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('username', resUsername);
        localStorage.setItem('email', resEmail);
        
        setUser({ username: resUsername, email: resEmail, role, token });
    };

    const registerUser = async (userData) => {
        await axios.post('/auth/register', userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, registerUser, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
