import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Admin route but user is not admin
  if (role === 'admin' && user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  // User route but guest/admin trying to access (though admin can usually access everything)
  if (role === 'user' && !user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
