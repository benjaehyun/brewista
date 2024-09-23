import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utilities/auth-context';

export function useProtectedNavigation() {
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();

    const protectedNavigate = useCallback((path, isProtectedRoute) => {
        if (isProtectedRoute && !user) {
            setLoginModalOpen(true);
        } else {
            navigate(path);
        }
    }, [user, navigate]);

    return { isLoginModalOpen, setLoginModalOpen, protectedNavigate };
}