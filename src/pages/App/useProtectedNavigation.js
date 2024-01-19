import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export function useProtectedNavigation(isAuthenticated) {
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const navigate = useNavigate();

    const protectedNavigate = useCallback((path, isProtectedRoute) => {
        if (isProtectedRoute && !isAuthenticated) {
            setLoginModalOpen(true);
        } else {
            navigate(path);
        }
    }, [isAuthenticated, navigate]);

    return { isLoginModalOpen, setLoginModalOpen, protectedNavigate };
}
