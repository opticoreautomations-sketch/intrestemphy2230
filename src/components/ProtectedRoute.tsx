import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute: React.FC<{ role?: 'student' | 'teacher' }> = ({ role }) => {
  const { user, profile, loading, isTeacher } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'teacher' && !isTeacher) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};
