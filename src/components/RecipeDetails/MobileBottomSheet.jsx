import React, { useEffect, useRef } from 'react';
import { useSpring, animated } from 'react-spring';

export default function MobileBottomSheet({ step, onClose }) {
  const sheetRef = useRef(null);
  
    const animation = useSpring({
      from: { transform: 'translateY(100%)' },
      to: { transform: 'translateY(0)' },
    });
  
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (sheetRef.current && !sheetRef.current.contains(event.target)) {
          onClose();
        }
      };
  
      document.addEventListener('mousedown', handleClickOutside);
  
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [onClose]);
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50">
        <animated.div 
          ref={sheetRef}
          style={animation} 
          className="fixed bottom-0 left-0 right-0 bg-white p-4 rounded-t-lg shadow-lg"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Step Details</h3>
            <button onClick={onClose} className="text-gray-500">&times;</button>
          </div>
          <p className="mb-2">{step.description}</p>
          {step.time && <p className="text-sm text-gray-600">Time: {step.time} seconds</p>}
          {step.waterAmount && <p className="text-sm text-gray-600">Water: {step.waterAmount} ml</p>}
          {step.isBloom && <p className="text-sm text-blue-600">Bloom phase</p>}
        </animated.div>
      </div>
    );
  };
  