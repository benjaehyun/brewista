import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import * as userService from '../../utilities/users-service';
import ProtectedLink from '../../pages/App/ProtectedLink';

export default function NavBar({ user, setUser, protectedNavigate }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    function handleLogOut() {
        userService.logOut();
        setUser(null);
        setIsOpen(false);
    }

    function toggleMenu() {
        setIsOpen(!isOpen);
    }

    function closeMenu() {
        setIsOpen(false);
    }

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <nav className={`fixed top-0 w-full z-10 ${isScrolled ? 'bg-white shadow-md ' : 'bg-gray-800'} transition-all duration-300 ease-in-out p-3 md:flex md:px-8 md:py-6`}>
            <div className=" ml-0 mr-auto flex items-center justify-between">
                <Link to="/" className={`text-lg font-bold ${isScrolled ? 'text-gray-800' : 'text-white'}`} onClick={closeMenu}>brewista</Link>
                <button onClick={toggleMenu} className={`focus:outline-none md:hidden p-2 mr-2 ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
                    <FontAwesomeIcon icon={isOpen ? faTimes : faBars} size="lg" />
                </button>
            </div>
            <div className={`${isOpen ? 'block' : 'hidden'} md:flex md:items-center md:justify-between md:space-x-10`}>
                <Link to="/recipes" className={`block mt-2 md:inline-block md:mt-0 ${isScrolled ? 'text-gray-800' : 'text-white'}`} onClick={closeMenu}>Recipes</Link>
                <ProtectedLink to="/myrecipes" isProtected={true} protectedNavigate={protectedNavigate} className={`block mt-2 md:inline-block md:mt-0 ${isScrolled ? 'text-gray-800' : 'text-white'}`} onClick={closeMenu}>
                    My Recipes
                </ProtectedLink>
                {user && (
                    <>
                        <Link to="/myrecipes" className={`block mt-2 md:inline-block md:mt-0 ${isScrolled ? 'text-gray-800' : 'text-white'}`} onClick={closeMenu}>My Recipes</Link>
                        <span className={`block mt-2 md:inline-block md:mt-0 ${isScrolled ? 'text-gray-800' : 'text-white'}`}>Welcome, {user.name}</span>
                        <Link to="" onClick={handleLogOut} className={`block mt-2 md:inline-block md:mt-0 ${isScrolled ? 'text-gray-800' : 'text-white'}`}>Log Out</Link>
                    </>
                )}
                {!user && (
                    <Link to="/auth" className={`block mt-2 md:inline-block md:mt-0 ${isScrolled ? 'text-gray-800' : 'text-white'}`} onClick={closeMenu}>Login / Sign Up</Link>
                )}
            </div>
        </nav>
    );
}
