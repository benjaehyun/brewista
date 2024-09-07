import React, { useEffect, useRef } from 'react';
import { useSpring, animated } from 'react-spring';


export default function DescriptionModal({ step, onClose }) {
    const modalRef = useRef(null);

    const animation = useSpring({
        from: { opacity: 0, transform: 'scale(0.9)' },
        to: { opacity: 1, transform: 'scale(1)' },
    });

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
            onClose();
            }
        };

        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscapeKey);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <animated.div 
        ref={modalRef}
        style={animation} 
        className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full"
        >
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Step Details</h3>
            <button onClick={onClose} className="text-gray-500">&times;</button>
        </div>
        <p className="mb-4">{step.description}</p>
        {step.time && <p className="text-sm text-gray-600 mb-2">Time: {step.time} seconds</p>}
        {step.waterAmount && <p className="text-sm text-gray-600 mb-2">Water: {step.waterAmount} ml</p>}
        {step.isBloom && <p className="text-sm text-blue-600">Bloom phase</p>}
        </animated.div>
    </div>
  );
};