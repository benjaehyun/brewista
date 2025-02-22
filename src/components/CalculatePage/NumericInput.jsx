import React from 'react';

const NumericInput = ({ 
    value, 
    onChange, 
    placeholder = "Enter a number", 
    className = "", 
    min = "0",
    step = "any",
    label,
    required = false,
    disabled = false
}) => {
    const handleChange = (e) => {
        const value = e.target.value;
        // Only call onChange if the value is empty or a valid number
        if (value === '' || !isNaN(value)) {
            onChange(e);
        }
    };

    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <input
                    type="number"
                    inputMode="decimal"
                    pattern="[0-9]*"
                    min={min}
                    step={step}
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    className={`
                    w-full px-3 py-2 
                    border border-gray-300 rounded-md 
                    shadow-sm
                    text-gray-800 
                    placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
                    ${className}
                    `}
            />
        </div>
    );
};

export default NumericInput;