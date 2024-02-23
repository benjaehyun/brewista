import React, { useState, useEffect, useCallback } from 'react';
import * as gearAPI from '../../utilities/gear-api';
import debounce from 'lodash.debounce';

export default function GearAdditionForm({ onClose }) {
  // Input fields
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [modification, setModification] = useState('');
  const [gearType, setGearType] = useState('');

  // Query suggestions
  const [brandSuggestions, setBrandSuggestions] = useState([]);
  const [modelSuggestions, setModelSuggestions] = useState([]);
  const [modificationSuggestions, setModificationSuggestions] = useState([]);

  // Dropdown visibility
  const [isBrandDropdownVisible, setIsBrandDropdownVisible] = useState(false);
  const [isModelDropdownVisible, setIsModelDropdownVisible] = useState(false);
  const [isModificationDropdownVisible, setIsModificationDropdownVisible] = useState(false);

  const gearTypes = ['Brewer', 'Paper', 'Grinder', 'Kettle', 'Scale', 'Other'];

  // Debounced fetch requests
  const fetchBrandSuggestions = useCallback(debounce(async (query) => {
    const apiBrandSuggestions = await gearAPI.fetchBrands(query);
    setBrandSuggestions(apiBrandSuggestions.length ? apiBrandSuggestions : ['Add Brand']);
    setIsBrandDropdownVisible(true); // Show dropdown when fetching
  }, 400), []);

  const fetchModelSuggestions = useCallback(debounce(async (brand, query) => {
    const apiModelSuggestions = await gearAPI.fetchModels(brand, query);
    setModelSuggestions(apiModelSuggestions.length ? apiModelSuggestions : ['Add Model']);
    setIsModelDropdownVisible(true); // Show dropdown when fetching
  }, 400), []);

  const fetchModificationSuggestions = useCallback(debounce(async (brand, model, query) => {
    const apiModificationSuggestions = await gearAPI.fetchModifications(brand, model, query);
    setModificationSuggestions(apiModificationSuggestions.length ? apiModificationSuggestions : ['Add Modification']);
    setIsModificationDropdownVisible(true); // Show dropdown when fetching
  }, 400), []);

  // Cancel debounced fetched requests if component unmounts 
  useEffect(() => {
    return () => {
      fetchBrandSuggestions.cancel();
      fetchModelSuggestions.cancel();
      fetchModificationSuggestions.cancel();
    };
  }, [fetchBrandSuggestions, fetchModelSuggestions, fetchModificationSuggestions]);

  // Handlers for input changes and dropdown selection
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
    if (suggestion !== 'Add Brand') setBrand(suggestion);
    setIsBrandDropdownVisible(false);
    setBrandSuggestions([]);
  };

  const handleSelectModel = (suggestion) => {
    if (suggestion !== 'Add Model') setModel(suggestion);
    setIsModelDropdownVisible(false);
    setModelSuggestions([]);
  };

  const handleSelectModification = (suggestion) => {
    if (suggestion !== 'Add Modification') setModification(suggestion);
    setIsModificationDropdownVisible(false);
    setModificationSuggestions([]);
  };

  const handleGearTypeChange = (event) => {
    setGearType(event.target.value);
  };  

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await gearAPI.addGear({ brand, model, modification, type: gearType });
      onClose(); // Close the modal on successful submission
    } catch (error) {
      console.error('Error submitting gear:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      {/* Brand input and conditional dropdown */}
      <div className="relative" onBlur={() => setIsBrandDropdownVisible(false)} onFocus={() => setIsBrandDropdownVisible(true)}>
        <input
          type="text"
          placeholder="Brand"
          value={brand}
          onChange={handleBrandChange}
          className="input w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {isBrandDropdownVisible && (
          <ul className="absolute z-10 max-h-40 w-full overflow-auto bg-white border border-gray-200 rounded-md mt-1">
            {brandSuggestions.map((suggestion, index) => (
              <li key={index} className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleSelectBrand(suggestion)}>
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Model input and conditional dropdown */}
      <div className="relative" onBlur={() => setIsModelDropdownVisible(false)} onFocus={() => setIsModelDropdownVisible(true)}>
        <input
          type="text"
          placeholder="Model"
          value={model}
          onChange={handleModelChange}
          className="input w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {isModelDropdownVisible && (
          <ul className="absolute z-10 max-h-40 w-full overflow-auto bg-white border border-gray-200 rounded-md mt-1">
            {modelSuggestions.map((suggestion, index) => (
              <li key={index} className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleSelectModel(suggestion)}>
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modifications input and conditional dropdown */}
      <div className="relative" onBlur={() => setIsModificationDropdownVisible(false)} onFocus={() => setIsModificationDropdownVisible(true)}>
        <input
          type="text"
          placeholder="Modifications"
          value={modification}
          onChange={handleModificationChange}
          className="input w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {isModificationDropdownVisible && (
          <ul className="absolute z-10 max-h-40 w-full overflow-auto bg-white border border-gray-200 rounded-md mt-1">
            {modificationSuggestions.map((suggestion, index) => (
              <li key={index} className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleSelectModification(suggestion)}>
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      <fieldset>
        <legend className="text-lg font-medium">Select Gear Type:</legend>
        <div className="mt-2 space-y-2">
          {gearTypes.map((type) => (
            <div key={type} className="flex items-center">
              <input
                id={type}
                type="radio"
                name="gearType"
                value={type}
                checked={gearType === type}
                onChange={handleGearTypeChange}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
              />
              <label htmlFor={type} className="ml-3 block text-sm font-medium text-gray-700">
                {type}
              </label>
            </div>
          ))}
        </div>
      </fieldset>

      <button type="submit" className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Add Gear</button>
    </form>
  );
}
