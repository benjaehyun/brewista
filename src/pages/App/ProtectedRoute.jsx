import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../utilities/auth-context';
import { useAuthModal } from '../../utilities/auth-modal-context';

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  const { openLoginModal } = useAuthModal();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    openLoginModal();
    // Store the attempted location
    sessionStorage.setItem('intendedPath', location.pathname);
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;