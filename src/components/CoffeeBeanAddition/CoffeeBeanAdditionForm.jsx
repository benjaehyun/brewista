import React, { useState, useCallback, useEffect } from 'react';
import debounce from 'lodash.debounce';
import * as coffeeBeanAPI from '../../services/api/coffeeBean-api';
import { Loader2 } from 'lucide-react';

const formatFieldName = (field) => {
    // "roastLevel" -> "Roast Level"
    return field
        .replace(/([A-Z])/g, ' $1') // Add space before capitals
        .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
        .trim(); // Remove spaces
};

export default function CoffeeBeanAdditionForm({ onClose, updateCoffeeBeanList }) {
    const [formData, setFormData] = useState({
        roaster: '',
        origin: '',
        roastLevel: '',
        process: ''
    });
    
    const [suggestions, setSuggestions] = useState({
        roaster: [],
        origin: [],
        roastLevel: [],
        process: []
    });
    
    const [dropdownState, setDropdownState] = useState({
        roaster: false,
        origin: false,
        roastLevel: false,
        process: false
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Check if form is valid (required fields are filled)
    const isFormValid = formData.roaster && formData.origin && formData.roastLevel;

    // debounce fetch functions for autocomplete
    const fetchRoasterSuggestions = useCallback(
        debounce(async (query) => {
            try {
                const results = await coffeeBeanAPI.fetchRoasters(query);
                setSuggestions(prev => ({ 
                    ...prev, 
                    roaster: [...results, 'Add New Roaster'] 
                }));
            } catch (err) {
                console.error('Error fetching roaster suggestions:', err);
            }
        }, 300),
        []
    );

    const fetchOriginSuggestions = useCallback(
        debounce(async (roaster, query) => {
            if (!roaster) return;
            try {
                const results = await coffeeBeanAPI.fetchOrigins(roaster, query);
                setSuggestions(prev => ({ 
                    ...prev, 
                    origin: [...results, 'Add New Origin']
                }));
            } catch (err) {
                console.error('Error fetching origin suggestions:', err);
            }
        }, 300),
        []
    );

    const fetchRoastLevelSuggestions = useCallback(
        debounce(async (roaster, origin, query) => {
            if (!roaster || !origin) return;
            try {
                const results = await coffeeBeanAPI.fetchRoastLevels(roaster, origin, query);
                setSuggestions(prev => ({ 
                    ...prev, 
                    roastLevel: [...results, 'Add New Roast Level']
                }));
            } catch (err) {
                console.error('Error fetching roast level suggestions:', err);
            }
        }, 300),
        []
    );

    const fetchProcessSuggestions = useCallback(
        debounce(async (roaster, origin, roastLevel, query) => {
            if (!roaster || !origin || !roastLevel) return;
            try {
                const results = await coffeeBeanAPI.fetchProcesses(roaster, origin, roastLevel, query);
                setSuggestions(prev => ({ 
                ...prev, 
                process: [...results, 'Add New Process']
                }));
            } catch (err) {
                console.error('Error fetching process suggestions:', err);
            }
        }, 300),
        []
    );

    // Cancel debounce on unmount
    useEffect(() => {
        return () => {
            fetchRoasterSuggestions.cancel();
            fetchOriginSuggestions.cancel();
            fetchRoastLevelSuggestions.cancel();
            fetchProcessSuggestions.cancel();
        };
    }, [
        fetchRoasterSuggestions,
        fetchOriginSuggestions,
        fetchRoastLevelSuggestions,
        fetchProcessSuggestions
    ]);

    // input changes
    const handleChange = (field) => (e) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, [field]: value }));
        
        // get the appropriate suggestion fetch
        switch (field) {
            case 'roaster':
                fetchRoasterSuggestions(value);
                break;
            case 'origin':
                fetchOriginSuggestions(formData.roaster, value);
                break;
            case 'roastLevel':
                fetchRoastLevelSuggestions(formData.roaster, formData.origin, value);
                break;
            case 'process':
                fetchProcessSuggestions(formData.roaster, formData.origin, formData.roastLevel, value);
                break;
            default:
                break;
        }
    };

    // Handle selection from dropdown
    const handleSelect = (field, value) => {
        if (value !== `Add New ${formatFieldName(field)}`) {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
        setDropdownState(prev => ({ ...prev, [field]: false }));
    };

    // Toggle dropdown visibility
    const toggleDropdown = (field, state) => {
        setDropdownState(prev => ({ ...prev, [field]: state }));
        
        // If opening dropdown, fetch suggestions
        if (state) {
            switch (field) {
                case 'roaster':
                    fetchRoasterSuggestions(formData.roaster);
                    break;
                case 'origin':
                    fetchOriginSuggestions(formData.roaster, formData.origin);
                    break;
                case 'roastLevel':
                    fetchRoastLevelSuggestions(formData.roaster, formData.origin, formData.roastLevel);
                    break;
                case 'process':
                    fetchProcessSuggestions(formData.roaster, formData.origin, formData.roastLevel, formData.process);
                    break;
                default:
                    break;
            }
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) return;
        
        setIsSubmitting(true);
        setError(null);
        
        try {
        await coffeeBeanAPI.addCoffeeBean(formData);
        if (updateCoffeeBeanList) {
            await updateCoffeeBeanList();
        }
        onClose();
        } catch (err) {
        console.error('Error adding coffee bean:', err);
            setError('Failed to add coffee bean. Please try again.');
            setIsSubmitting(false);
        }
    };

    // Create dropdown component
    const Dropdown = ({ field, suggestions }) => (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-56 overflow-auto">
        <ul className="py-1">
            {suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
                <li
                key={index}
                className={`px-4 py-2 text-sm hover:bg-blue-50 cursor-pointer ${
                    suggestion === `Add New ${field.charAt(0).toUpperCase() + field.slice(1)}` 
                    ? 'text-blue-600 font-medium border-t border-gray-100' 
                    : 'text-gray-700'
                }`}
                onClick={() => handleSelect(field, suggestion)}
                >
                {suggestion}
                </li>
            ))
            ) : (
            <li className="px-4 py-2 text-sm text-gray-500">No suggestions found</li>
            )}
        </ul>
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                {error}
                </div>
            )}
            
            {/* Roaster Field */}
            <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                    Roaster <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                <input
                    type="text"
                    value={formData.roaster}
                    onChange={handleChange('roaster')}
                    onFocus={() => toggleDropdown('roaster', true)}
                    onBlur={() => setTimeout(() => toggleDropdown('roaster', false), 300)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter coffee roaster"
                    required
                />
                {dropdownState.roaster && (
                    <Dropdown field="roaster" suggestions={suggestions.roaster} />
                )}
                </div>
            </div>
            
            {/* Origin Field */}
            <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                    Origin <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                <input
                    type="text"
                    value={formData.origin}
                    onChange={handleChange('origin')}
                    onFocus={() => toggleDropdown('origin', true)}
                    onBlur={() => setTimeout(() => toggleDropdown('origin', false), 200)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter coffee origin"
                    required
                />
                {dropdownState.origin && (
                    <Dropdown field="origin" suggestions={suggestions.origin} />
                )}
                </div>
            </div>
            
            {/* Roast Level Field */}
            <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                Roast Level <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                <input
                    type="text"
                    value={formData.roastLevel}
                    onChange={handleChange('roastLevel')}
                    onFocus={() => toggleDropdown('roastLevel', true)}
                    onBlur={() => setTimeout(() => toggleDropdown('roastLevel', false), 200)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter roast level (Light, Medium, Dark)"
                    required
                />
                {dropdownState.roastLevel && (
                    <Dropdown field="roastLevel" suggestions={suggestions.roastLevel} />
                )}
                </div>
            </div>
            
            {/* Process Field (Optional) */}
            <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                Process <span className="text-gray-400">(optional)</span>
                </label>
                <div className="relative">
                <input
                    type="text"
                    value={formData.process}
                    onChange={handleChange('process')}
                    onFocus={() => toggleDropdown('process', true)}
                    onBlur={() => setTimeout(() => toggleDropdown('process', false), 200)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter processing method (Washed, Natural, etc.)"
                />
                {dropdownState.process && (
                    <Dropdown field="process" suggestions={suggestions.process} />
                )}
                </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-2">
                <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                disabled={isSubmitting}
                >
                    Cancel
                </button>
                <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className={`
                    inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-md 
                    ${isFormValid && !isSubmitting
                    ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    : 'bg-blue-300 cursor-not-allowed'
                    }
                `}
                >
                    {isSubmitting ? (
                        <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Adding...
                        </>
                    ) : (
                        'Add Coffee Bean'
                    )}
                </button>
            </div>
        </form>
    );
}