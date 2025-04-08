import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../utilities/auth-context';
import { useAuthModal } from '../../utilities/auth-modal-context';

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  const { openLoginModal } = useAuthModal();
  const location = useLocation();

  useEffect(() => {
    // Only open the login modal if the user is not authenticated and not currently loading
    if (!user && !isLoading) {
      openLoginModal();
      // Store the attempted location
      sessionStorage.setItem('intendedPath', location.pathname);
    }
  }, [user, isLoading, openLoginModal, location.pathname]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;