import React, { useState } from 'react';
import { useAuth } from '../../utilities/auth-context';
import LogInForm from '../Auth/LogInForm';
import SignUpForm from '../Auth/SignUpForm';

const LoginModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, signup } = useAuth();

  const handleLogin = async (credentials) => {
    try {
      await login(credentials);
      onClose();
    } catch (error) {
        console.error('Failed to login:', error);
    }
  };

  const handleSignup = async (userData) => {
    try {
      await signup(userData);
      onClose();
    } catch (error) {
        console.error('Failed to sign up:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {isLogin ? 'Log In' : 'Sign Up'}
          </h3>
          <div className="mt-2 px-7 py-3">
            {isLogin ? (
              <LogInForm onSubmit={handleLogin} />
            ) : (
              <SignUpForm onSubmit={handleSignup} />
            )}
          </div>
          <div className="items-center px-4 py-3">
            <button
              id="ok-btn"
              className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Need to Sign Up?' : 'Already have an account?'}
            </button>
          </div>
          <div className="items-center px-4 py-3">
            <button
              id="close-btn"
              className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;