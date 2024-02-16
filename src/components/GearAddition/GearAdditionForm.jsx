import React, { useState, useEffect } from 'react';

import debounce from 'lodash.debounce';

export default function GearAdditionForm ({onClose}) {
  //  input fields
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [modification, setModification] = useState('');
  
  // query suggestions
  const [brandSuggestions, setBrandSuggestions] = useState([]);
  const [modelSuggestions, setModelSuggestions] = useState([]);
  const [modificationSuggestions, setModificationSuggestions] = useState([]);

  // example debounce usage in fetch requests for brand suggestions
  const fetchBrandSuggestions = debounce(async (query) => {
    // placeholder for real fetch call
    console.log('Fetching brands for query:', query);
    // mock data to populate dropdown
    setBrandSuggestions(['Brand1', 'Brand2', 'Brand3', 'Brand4', 'Brand5', 'Brand6', 'Brand7', 'Brand8', 'Brand9', 'Brand10']);
  }, 300);

  const fetchModelSuggestions = debounce(async (query) => {
    console.log('Fetching models for query:', query);
    setModelSuggestions(['Model1', 'Model2', 'Model3', 'Model4', 'Model5', 'Model6', 'Model7', 'Model8', 'Model9', 'Model10']);
  }, 300);
  
  const fetchModificationSuggestions = debounce(async (query) => {
    console.log('Fetching modifications for query:', query);
    setModificationSuggestions(['Modification1', 'Modification2', 'Modification3', 'Modification4', 'Modification5', 'Modification6', 'Modification7', 'Modification8', 'Modification9', 'Modification10']);
  }, 300);



  // handlers for input changes
  const handleBrandChange = (e) => {
    const value = e.target.value;
    setBrand(value);
    fetchBrandSuggestions(value);
  };

  const handleModelChange = (e) => {
    const value = e.target.value;
    setModel(value);
    fetchModelSuggestions(value);
  };

  const handleModificationChange = (e) => {
    const value = e.target.value;
    setModification(value);
    fetchModificationSuggestions(value);
  };



  // placeholder for form submission
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
            <li 
              key={brandSuggestions.length} 
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {setBrandSuggestions([])}}
            >
              Add Brand
              </li>
          </ul>
        )}
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Model"
          value={model}
          onChange={handleModelChange}
          className="input w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {modelSuggestions.length > 0 && (
          <ul className="absolute z-10 max-h-40 w-full overflow-auto bg-white border border-gray-200 rounded-md mt-1">
            {modelSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => { setModel(suggestion); setModelSuggestions([]); }}
              >
                {suggestion}
              </li>
            ))}
            <li 
              key={modelSuggestions.length} 
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {setModelSuggestions([])}}
            >
              Add Model
              </li>
          </ul>
        )}
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Modifications"
          value={modification}
          onChange={handleModificationChange}
          className="input w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {modificationSuggestions.length > 0 && (
          <ul className="absolute z-10 max-h-40 w-full overflow-auto bg-white border border-gray-200 rounded-md mt-1">
            {modificationSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => { setModification(suggestion); setModificationSuggestions([]); }}
              >
                {suggestion}
              </li>
            ))}
            <li 
              key={modificationSuggestions.length} 
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {setModificationSuggestions([])}}
            >
              Add Modification
              </li>
          </ul>
        )}
      </div>      
      <button type="submit" className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Add Gear</button>
    </form>
  );
};
