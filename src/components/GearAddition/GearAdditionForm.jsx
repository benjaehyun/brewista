import React, { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash.debounce';
import * as gearAPI from '../../services/api/gear-api';
import { Loader2 } from 'lucide-react';

export default function GearAdditionForm({ onClose, getApiProfile }) {
    const gearTypes = ['Brewer', 'Paper', 'Grinder', 'Kettle', 'Scale', 'Other'];

    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [modification, setModification] = useState('');
    const [gearType, setGearType] = useState('');

    const [brandSuggestions, setBrandSuggestions] = useState([]);
    const [modelSuggestions, setModelSuggestions] = useState([]);
    const [modificationSuggestions, setModificationSuggestions] = useState([]);

    const [isDropdownVisible, setIsDropdownVisible] = useState({
        brand: false,
        model: false,
        modification: false
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    
    const isFormValid = brand && model && gearType;

    // Debounced fetch requests 
    const fetchBrandSuggestions = useCallback(debounce(async (query) => {
        try {
            const apiBrandSuggestions = await gearAPI.fetchBrands(query);
            setBrandSuggestions([...apiBrandSuggestions, 'Add New Brand']);
            setIsDropdownVisible(prev => ({ ...prev, brand: true }));
        } catch (err) {
            console.error('Error fetching brands:', err);
        }
    }, 400), []);

    const fetchModelSuggestions = useCallback(debounce(async (brand, query) => {
        try {
            const apiModelSuggestions = await gearAPI.fetchModels(brand, query);
            setModelSuggestions([...apiModelSuggestions, 'Add New Model']);
            setIsDropdownVisible(prev => ({ ...prev, model: true }));
        } catch (err) {
            console.error('Error fetching models:', err);
        }
    }, 400), []);

    const fetchModificationSuggestions = useCallback(debounce(async (brand, model, query) => {
        try {
            const apiModificationSuggestions = await gearAPI.fetchModifications(brand, model, query);
            setModificationSuggestions([...apiModificationSuggestions, 'Add New Modification']);
            setIsDropdownVisible(prev => ({ ...prev, modification: true }));
        } catch (err) {
            console.error('Error fetching modifications:', err);
        }
    }, 400), []);

    // Cancel debounced fetched requests if component unmounts 
    useEffect(() => {
        return () => {
            fetchBrandSuggestions.cancel();
            fetchModelSuggestions.cancel();
            fetchModificationSuggestions.cancel();
        };
    }, [fetchBrandSuggestions, fetchModelSuggestions, fetchModificationSuggestions]);


    const handleBrandChange = (e) => {
        setBrand(e.target.value);
        fetchBrandSuggestions(e.target.value);
    };

    const handleModelChange = (e) => {
        setModel(e.target.value);
        fetchModelSuggestions(brand, e.target.value);
    };

    const handleModificationChange = (e) => {
        setModification(e.target.value);
        fetchModificationSuggestions(brand, model, e.target.value);
    };

    // Close dropdowns without changing input fields
    const handleSelectBrand = (suggestion) => {
        if (suggestion !== 'Add New Brand') setBrand(suggestion);
        setIsDropdownVisible(prev => ({ ...prev, brand: false }));
        setBrandSuggestions([]);
    };

    const handleSelectModel = (suggestion) => {
        if (suggestion !== 'Add New Model') setModel(suggestion);
        setIsDropdownVisible(prev => ({ ...prev, model: false }));
        setModelSuggestions([]);
    };

    const handleSelectModification = (suggestion) => {
        if (suggestion !== 'Add New Modification') setModification(suggestion);
        setIsDropdownVisible(prev => ({ ...prev, modification: false }));
        setModificationSuggestions([]);
    };

    const handleGearTypeChange = (event) => {
        setGearType(event.target.value);
    };  


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) return;
        
        setIsSubmitting(true);
        setError(null);
        
        try {
        await gearAPI.addGear({ brand, model, modifications: modification, type: gearType });
        await getApiProfile();
        onClose();
        } catch (error) {
        console.error('Error submitting gear:', error);
        setError('Failed to add gear. Please try again.');
        setIsSubmitting(false);
        }
    };

    // Helper function for dropdown visibility
    const toggleDropdown = (field, value) => {
        setIsDropdownVisible(prev => ({ ...prev, [field]: value }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                    {error}
                </div>
            )}
            
            {/* Brand input and dropdown */}
            <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                    Brand <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Enter brand name"
                        value={brand}
                        onChange={handleBrandChange}
                        onFocus={() => toggleDropdown('brand', true)}
                        onBlur={() => setTimeout(() => toggleDropdown('brand', false), 200)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                    {isDropdownVisible.brand && brandSuggestions.length > 0 && (
                        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-56 overflow-auto">
                            <ul className="py-1">
                                {brandSuggestions.map((suggestion, index) => (
                                <li
                                    key={index}
                                    className={`px-4 py-2 text-sm hover:bg-blue-50 cursor-pointer ${
                                    suggestion === 'Add New Brand'
                                        ? 'text-blue-600 font-medium border-t border-gray-100'
                                        : 'text-gray-700'
                                    }`}
                                    onClick={() => handleSelectBrand(suggestion)}
                                >
                                    {suggestion}
                                </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Model input and dropdown */}
            <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                    Model <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Enter model name"
                        value={model}
                        onChange={handleModelChange}
                        onFocus={() => toggleDropdown('model', true)}
                        onBlur={() => setTimeout(() => toggleDropdown('model', false), 200)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                    {isDropdownVisible.model && modelSuggestions.length > 0 && (
                        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-56 overflow-auto">
                            <ul className="py-1">
                                {modelSuggestions.map((suggestion, index) => (
                                <li
                                    key={index}
                                    className={`px-4 py-2 text-sm hover:bg-blue-50 cursor-pointer ${
                                    suggestion === 'Add New Model'
                                        ? 'text-blue-600 font-medium border-t border-gray-100'
                                        : 'text-gray-700'
                                    }`}
                                    onClick={() => handleSelectModel(suggestion)}
                                >
                                    {suggestion}
                                </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Modifications input and dropdown (optional) */}
            <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                    Modifications <span className="text-gray-400">(optional)</span>
                </label>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Describe any modifications"
                        value={modification}
                        onChange={handleModificationChange}
                        onFocus={() => toggleDropdown('modification', true)}
                        onBlur={() => setTimeout(() => toggleDropdown('modification', false), 200)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {isDropdownVisible.modification && modificationSuggestions.length > 0 && (
                        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-56 overflow-auto">
                            <ul className="py-1">
                                {modificationSuggestions.map((suggestion, index) => (
                                <li
                                    key={index}
                                    className={`px-4 py-2 text-sm hover:bg-blue-50 cursor-pointer ${
                                    suggestion === 'Add New Modification'
                                        ? 'text-blue-600 font-medium border-t border-gray-100'
                                        : 'text-gray-700'
                                    }`}
                                    onClick={() => handleSelectModification(suggestion)}
                                >
                                    {suggestion}
                                </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Gear Type Radio Selection */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Gear Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {gearTypes.map((type) => (
                        <label
                        key={type}
                        className={`
                            flex items-center space-x-2 p-2 rounded-md cursor-pointer
                            ${gearType === type 
                            ? 'bg-blue-50 border-2 border-blue-200' 
                            : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'}
                        `}
                        >
                        <input
                            type="radio"
                            name="gearType"
                            value={type}
                            checked={gearType === type}
                            onChange={handleGearTypeChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="text-sm">{type}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
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
                    'Add Gear'
                )}
                </button>
            </div>
        </form>
    );
}