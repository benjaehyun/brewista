import React from 'react';
import { Link } from 'react-router-dom';

const ProtectedLink = ({ to, isProtected, children, protectedNavigate, className }) => {
    const handleClick = (e) => {
        if (isProtected) {
            e.preventDefault(); // Prevent default link behavior
            protectedNavigate(to, isProtected);
        }
    };

    return (
        <Link to={to} onClick={handleClick} className={className}>
            {children}
        </Link>
    );
};

export default ProtectedLink;
