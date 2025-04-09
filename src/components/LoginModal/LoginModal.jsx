import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Switch from 'react-switch';
import LogInForm from '../Auth/LogInForm';
import SignUpForm from '../Auth/SignUpForm';

const LoginModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate()



  const handleClose = () => {
    onClose();
    // Optionally, could navigate to a specific page here
    // navigate('/');
  };

  const handleSuccessfulAuth = () => {
    onClose();
    const intendedPath = sessionStorage.getItem('intendedPath');
    if (intendedPath) {
      sessionStorage.removeItem('intendedPath');
      navigate(intendedPath);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" id="my-modal">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {isLogin ? 'Log In' : 'Sign Up'}
            </h3>
            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-600">Login</span>
              <Switch
                onChange={() => setIsLogin(!isLogin)}
                checked={!isLogin}
                onColor="#86d3ff"
                onHandleColor="#2693e6"
                handleDiameter={24}
                uncheckedIcon={false}
                checkedIcon={false}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                height={20}
                width={48}
                className="react-switch"
              />
              <span className="ml-2 text-sm text-gray-600">Sign Up</span>
            </div>
          </div>
          <div className="mt-2">
            {isLogin ? (
              <LogInForm onSuccess={handleSuccessfulAuth} />
            ) : (
              <SignUpForm onSuccess={handleSuccessfulAuth} />
            )}
          </div>
          <div className="mt-4">
            <button
              className="w-full px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
              onClick={handleClose}
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