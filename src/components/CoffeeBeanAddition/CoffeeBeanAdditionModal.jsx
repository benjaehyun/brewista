import React, { useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import CoffeeBeanAdditionForm from './CoffeeBeanAdditionForm';

export default function CoffeeBeanAdditionModal({ isOpen, onClose, updateCoffeeBeanList }) {
  const modalRef = useRef(null);
  

  useEffect(() => {
    function handler(event) {
      // for click, check if click is outside the modal
        if (event.type === 'mousedown' && modalRef.current && !modalRef.current.contains(event.target)) {
            onClose();
        }
        
        // for key events, check if it's Escape key
        if (event.type === 'keydown' && event.key === 'Escape') {
            onClose();
        }
        }
        
        // Add both listeners if modal is open
        if (isOpen) {
            document.addEventListener('mousedown', handler);
            document.addEventListener('keydown', handler);
        }
        
        // Clean up listeners 
        return () => {
            document.removeEventListener('mousedown', handler);
            document.removeEventListener('keydown', handler);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Background */}
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
            
            {/* Modal wrapper */}
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                {/* Modal content */}
                <div 
                ref={modalRef}
                className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-lg"
                >
                    {/* Header */}
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                        <div className="flex items-start justify-between">
                        <h3 className="text-lg font-semibold leading-6 text-gray-900">
                            Add New Coffee Bean
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
                        <CoffeeBeanAdditionForm 
                            onClose={onClose} 
                            updateCoffeeBeanList={updateCoffeeBeanList} 
                        />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}