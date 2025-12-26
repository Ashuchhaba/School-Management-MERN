import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { replace: true });
    } else if (!loading && user && allowedRoles && !allowedRoles.includes(user.role)) {
      navigate('/login', { replace: true }); // Or an unauthorized page
    }
  }, [user, loading, navigate, allowedRoles]);

  if (loading) {
    // Return null or a loading spinner to prevent content from flashing
    return null;
  }

  return (user && allowedRoles && allowedRoles.includes(user.role)) ? <Outlet /> : null;
};

export default ProtectedRoute;
