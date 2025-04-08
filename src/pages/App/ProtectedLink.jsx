import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/auth-context';
import { useAuthModal } from '../../hooks/auth-modal-context';

const ProtectedLink = ({ to, children, className, onClick }) => {
    const { user } = useAuth();
    const { openLoginModal } = useAuthModal();

    const handleClick = (e) => {
        if (!user) {
            e.preventDefault();
            openLoginModal();
        }
        // Call the passed onClick handler if it exists
        onClick?.(e);
    };

    return (
        <Link to={to} onClick={handleClick} className={className}>
            {children}
        </Link>
    );
};

export default ProtectedLink;