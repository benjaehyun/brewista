import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../utilities/auth-context';
import { useAuthModal } from '../../utilities/auth-modal-context';
import ProtectedLink from '../../pages/App/ProtectedLink';

export default function NavBar () {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { openLoginModal } = useAuthModal();

  const handleLogOut = () => {
    logout();
    closeDrawer();
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click outside drawer
  useEffect(() => {
    const handleClickOutside = (event) => {
      const drawer = document.getElementById('mobile-drawer');
      const menuButton = document.getElementById('menu-button');
      
      if (isDrawerOpen && drawer && !drawer.contains(event.target) && !menuButton.contains(event.target)) {
        closeDrawer();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDrawerOpen]);

  const handleAuthClick = () => {
    closeDrawer();
    openLoginModal();
  };

  // Shared link click handler
  const handleLinkClick = () => {
    closeDrawer();
  };

  return (
    <>
      {/* Main Navigation Bar */}
      <nav className={`fixed top-0 w-full z-20 transition-all duration-300 ease-in-out ${
        isScrolled ? 'bg-white shadow-md' : 'bg-gray-800'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and Mobile Menu Button */}
            <div className="flex items-center">
              <Link 
                to="/" 
                className={`text-xl font-bold ${isScrolled ? 'text-gray-800' : 'text-white'}`}
                onClick={handleLinkClick}
              >
                brewista
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              <Link 
                to="/recipes" 
                className={`${isScrolled ? 'text-gray-800' : 'text-white'} hover:opacity-75 transition-opacity`}
                onClick={handleLinkClick}
              >
                Recipes
              </Link>
              {user ? (
                <>
                  <ProtectedLink 
                    to="/myrecipes" 
                    className={`${isScrolled ? 'text-gray-800' : 'text-white'} hover:opacity-75 transition-opacity`}
                    onClick={handleLinkClick}
                  >
                    My Recipes
                  </ProtectedLink>
                  <ProtectedLink 
                    to="/savedrecipes" 
                    className={`${isScrolled ? 'text-gray-800' : 'text-white'} hover:opacity-75 transition-opacity`}
                    onClick={handleLinkClick}
                  >
                    Saved Recipes
                  </ProtectedLink>
                  <ProtectedLink 
                    to="/recipes/create" 
                    className={`${isScrolled ? 'text-gray-800' : 'text-white'} hover:opacity-75 transition-opacity`}
                    onClick={handleLinkClick}
                  >
                    Add A Recipe
                  </ProtectedLink>
                  <ProtectedLink 
                    to="/profile" 
                    className={`${isScrolled ? 'text-gray-800' : 'text-white'} hover:opacity-75 transition-opacity`}
                    onClick={handleLinkClick}
                  >
                    Profile
                  </ProtectedLink>
                  <span className={`${isScrolled ? 'text-gray-800' : 'text-white'}`}>Welcome, {user.username}</span>
                  <button 
                    onClick={handleLogOut}
                    className={`${isScrolled ? 'text-gray-800' : 'text-white'} hover:opacity-75 transition-opacity`}
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <button 
                  onClick={handleAuthClick}
                  className={`${isScrolled ? 'text-gray-800' : 'text-white'} hover:opacity-75 transition-opacity`}
                >
                  Login / Sign Up
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button
                id="menu-button"
                onClick={() => setIsDrawerOpen(true)}
                className={`p-2 rounded-md ${isScrolled ? 'text-gray-800' : 'text-white'}`}
              >
                <FontAwesomeIcon icon={faBars} size="lg" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 md:hidden ${
          isDrawerOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div
          id="mobile-drawer"
          className={`fixed inset-y-0 right-0 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
            isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Drawer Header */}
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-800">Menu</span>
            <button
              onClick={closeDrawer}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700"
            >
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="py-4">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/recipes" 
                className="px-6 py-2 text-gray-600 hover:bg-gray-100 flex items-center justify-between"
                onClick={handleLinkClick}
              >
                Recipes
                <FontAwesomeIcon icon={faChevronRight} size="sm" className="text-gray-400" />
              </Link>
              
              {user ? (
                <>
                  <ProtectedLink 
                    to="/myrecipes" 
                    className="px-6 py-2 text-gray-600 hover:bg-gray-100 flex items-center justify-between"
                    onClick={handleLinkClick}
                  >
                    My Recipes
                    <FontAwesomeIcon icon={faChevronRight} size="sm" className="text-gray-400" />
                  </ProtectedLink>
                  <ProtectedLink 
                    to="/savedrecipes" 
                    className="px-6 py-2 text-gray-600 hover:bg-gray-100 flex items-center justify-between"
                    onClick={handleLinkClick}
                  >
                    Saved Recipes
                    <FontAwesomeIcon icon={faChevronRight} size="sm" className="text-gray-400" />
                  </ProtectedLink>
                  <ProtectedLink 
                    to="/recipes/create" 
                    className="px-6 py-2 text-gray-600 hover:bg-gray-100 flex items-center justify-between"
                    onClick={handleLinkClick}
                  >
                    Add A Recipe
                    <FontAwesomeIcon icon={faChevronRight} size="sm" className="text-gray-400" />
                  </ProtectedLink>
                  <ProtectedLink 
                    to="/profile" 
                    className="px-6 py-2 text-gray-600 hover:bg-gray-100 flex items-center justify-between"
                    onClick={handleLinkClick}
                  >
                    Profile
                    <FontAwesomeIcon icon={faChevronRight} size="sm" className="text-gray-400" />
                  </ProtectedLink>
                  
                  <div className="px-6 py-2 border-t border-gray-200">
                    <p className="text-sm text-gray-500">Signed in as</p>
                    <p className="font-medium text-gray-800">{user.username}</p>
                  </div>
                  
                  <button 
                    onClick={handleLogOut}
                    className="px-6 py-2 text-red-600 hover:bg-red-50 text-left"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <button 
                  onClick={handleAuthClick}
                  className="px-6 py-2 text-blue-600 hover:bg-blue-50 text-left"
                >
                  Login / Sign Up
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};