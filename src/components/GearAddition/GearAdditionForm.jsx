import React, { useState, useEffect } from 'react';

import debounce from 'lodash.debounce';

export default function GearAdditionForm ({onClose}) {
  // State for input fields
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [modification, setModification] = useState('');
  
  // State for suggestions
  const [brandSuggestions, setBrandSuggestions] = useState([]);
  const [modelSuggestions, setModelSuggestions] = useState([]);
  const [modificationSuggestions, setModificationSuggestions] = useState([]);

  // Example debounce function for brand suggestions, similar functions for models and modifications
  const fetchBrandSuggestions = debounce(async (query) => {
    // Placeholder for real fetch call
    console.log('Fetching brands for query:', query);
    // Mock data for demonstration
    setBrandSuggestions(['Brand1', 'Brand2', 'Brand3', 'Brand4', 'Brand5', 'Brand6', 'Brand7', 'Brand8', 'Brand9', 'Brand10']);
  }, 300);

  // Handlers for input changes
  const handleBrandChange = (e) => {
    const value = e.target.value;
    setBrand(value);
    fetchBrandSuggestions(value);
  };

  // Add similar handlers for models and modifications

  // Placeholder function for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(`Adding Gear: Brand - ${brand}, Model - ${model}, Modification - ${modification}`);
    onClose(); // Close the modal on successful submission
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Brand"
          value={brand}
          onChange={handleBrandChange}
          className="input w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {brandSuggestions.length > 0 && (
          <ul className="absolute z-10 max-h-40 w-full overflow-auto bg-white border border-gray-200 rounded-md mt-1">
            {brandSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => { setBrand(suggestion); setBrandSuggestions([]); }}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Implement similar structure for model and modification inputs with suggestions */}
      
      <button type="submit" className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Add Gear</button>
    </form>
  );
};
