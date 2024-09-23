import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../utilities/auth-context';
import { useAuthModal } from '../../utilities/auth-modal-context';

const ProtectedLink = ({ to, children, className }) => {
    const { user } = useAuth();
    const { openLoginModal } = useAuthModal();

    const handleClick = (e) => {
        if (!user) {
            e.preventDefault();
            openLoginModal();
        }
    };

    return (
        <Link to={to} onClick={handleClick} className={className}>
            {children}
        </Link>
    );
};

export default ProtectedLink;