import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('movieApp_currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  /**
   * Unified Login for both Users and Admin
   */
  const login = (email, password) => {
    // 1. Check if it's Admin
    if (email === 'admin@movieapp.com' && password === 'admin123') {
      const adminData = {
        username: 'Administrator',
        email: email,
        role: 'admin',
        id: 'admin-001'
      };
      setUser(adminData);
      localStorage.setItem('movieApp_currentUser', JSON.stringify(adminData));
      toast.success('Welcome, Admin!');
      return { success: true, role: 'admin' };
    }

    // 2. Check if it's a Regular User
    const users = JSON.parse(localStorage.getItem('movieApp_users') || '[]');
    const foundUser = users.find(u => u.email === email && u.password === password);

    if (foundUser) {
      const userData = { ...foundUser, role: 'user' };
      setUser(userData);
      localStorage.setItem('movieApp_currentUser', JSON.stringify(userData));
      toast.success(`Welcome back, ${foundUser.username}!`);
      return { success: true, role: 'user' };
    }

    toast.error('Invalid email or password');
    return { success: false };
  };

  /**
   * Register a new user
   */
  const register = (userData) => {
    const users = JSON.parse(localStorage.getItem('movieApp_users') || '[]');
    
    // Check if email already exists
    if (users.find(u => u.email === userData.email)) {
      toast.error('Email already registered');
      return false;
    }

    const newUser = { 
      ...userData, 
      id: `user-${Date.now()}`,
      role: 'user' 
    };
    
    users.push(newUser);
    localStorage.setItem('movieApp_users', JSON.stringify(users));
    toast.success('Account created! You can now login.');
    return true;
  };

  const logout = () => {
    localStorage.removeItem('movieApp_currentUser');
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAdmin: user?.role === 'admin', 
      loading, 
      login, 
      register, 
      logout 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
