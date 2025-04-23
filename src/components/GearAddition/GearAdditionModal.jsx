import React, { useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import GearAdditionForm from './GearAdditionForm';

export default function GearAdditionModal({ isOpen, onClose, getApiProfile }) {
    const modalRef = useRef(null);
    
    // Handle click outside and escape key to close
    useEffect(() => {
        function handler(event) {
            // For click, check if click is outside the modal
            if (event.type === 'mousedown' && modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
            
            // For key events, check if it's  escape 
            if (event.type === 'keydown' && event.key === 'Escape') {
                onClose();
            }
        }
        
        // Add listeners if modal is open
        if (isOpen) {
            document.addEventListener('mousedown', handler);
            document.addEventListener('keydown', handler);
        }
        
        // flean up listeners 
        return () => {
            document.removeEventListener('mousedown', handler);
            document.removeEventListener('keydown', handler);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* background */}
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
            
            {/* Modal  wrapper */}
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                {/* content */}
                <div 
                ref={modalRef}
                className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-lg"
                >
                    {/* Header */}
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                        <div className="flex items-start justify-between">
                            <h3 className="text-lg font-semibold leading-6 text-gray-900">
                                Add New Gear
                            </h3>
                            <button
                                type="button"
                                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onClick={onClose}
                            >
                                <span className="sr-only">Close</span>
                                <X className="h-6 w-6" aria-hidden="true" />
                            </button>
                        </div>
                        
                        {/* Divider */}
                        <div className="mt-4 border-t border-gray-200" />
                        
                        {/* Form */}
                        <div className="mt-4">
                            <GearAdditionForm 
                                getApiProfile={getApiProfile} 
                                onClose={onClose}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}