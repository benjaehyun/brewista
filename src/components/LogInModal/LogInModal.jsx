import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export default function LogInModal({ isOpen, onClose }) {
    const navigate = useNavigate();

    function handleLoginRedirect() {
        navigate('/auth');
        onClose(); // Navigate first, then close
    }

    // Adjusted to handle the event on the modal content instead of the backdrop
    function handleModalContentClick(e) {
        e.stopPropagation(); // Prevents the click from propagating to the backdrop
    }

    useEffect(() => {
        function handleKeyDown(e) {
            if (e.key === 'Escape') {
                onClose();
            }
        }

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center" onClick={onClose}>
            <div className="bg-white p-5 rounded-lg relative" onClick={handleModalContentClick}>
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-700">
                    <FontAwesomeIcon icon={faTimes} />
                </button>
                <h2 className="text-lg">You need to be logged in to access this feature.</h2>
                <button
                    onClick={handleLoginRedirect}
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                >
                    Login / Sign Up
                </button>
                <button
                    onClick={onClose}
                    className="bg-gray-500 text-white px-4 py-2 rounded mt-4"
                >
                    Close
                </button>
            </div>
        </div>
    );
}
