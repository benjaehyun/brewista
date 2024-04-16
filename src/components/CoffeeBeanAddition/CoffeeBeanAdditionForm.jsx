import React, { useState, useCallback, useEffect } from 'react';
import debounce from 'lodash.debounce';
import * as coffeeBeanAPI from '../../utilities/coffeeBean-api';

export default function CoffeeBeanAdditionForm({ onClose, updateCoffeeBeanList }) {
    const [roaster, setRoaster] = useState('');
    const [origin, setOrigin] = useState('');
    const [roastLevel, setRoastLevel] = useState('');
    const [process, setProcess] = useState('');
  
    const [showSuggestion, setShowSuggestion] = useState('');
  
    const [roasterSuggestions, setRoasterSuggestions] = useState([]);
    const [originSuggestions, setOriginSuggestions] = useState([]);
    const [roastLevelSuggestions, setRoastLevelSuggestions] = useState([]);
    const [processSuggestions, setProcessSuggestions] = useState([]);
  
    const [blurTimeoutId, setBlurTimeoutId] = useState(null);

    const isFormValid = roaster && origin && roastLevel; // Process is optional
  
    const fetchSuggestionsDebounced = useCallback(debounce(async (field, query) => {
        // console.log(`Fetching: ${field}, Query: ${query}`);
        let suggestions;
        switch (field) {
        case 'roaster':
            suggestions = await coffeeBeanAPI.fetchRoasters(query);
            setRoasterSuggestions([...suggestions, 'Add New Roaster']);
            setShowSuggestion('roaster');
            break;
        case 'origin':
            suggestions = await coffeeBeanAPI.fetchOrigins(roaster, query);
            setOriginSuggestions([...suggestions, 'Add New Origin']);
            setShowSuggestion('origin');
            break;
        case 'roastLevel':
            suggestions = await coffeeBeanAPI.fetchRoastLevels(roaster, origin, query);
            setRoastLevelSuggestions([...suggestions, 'Add New Roast Level']);
            setShowSuggestion('roastLevel');
            break;
        case 'process':
            suggestions = await coffeeBeanAPI.fetchProcesses(roaster, origin, roastLevel, query);
            setProcessSuggestions([...suggestions, 'Add New Process']);
            setShowSuggestion('process');
            break;
        default:
            setShowSuggestion('');
            break;
        }
    }, 400), []);
  
    useEffect(() => {
      return () => {
        fetchSuggestionsDebounced.cancel();
      };
    }, [fetchSuggestionsDebounced]);


    // input change handlers 
    const handleRoasterChange = (e) => {
        setRoaster(e.target.value);
        // console.log(`Roaster Changed: ${e.target.value}`)
        fetchSuggestionsDebounced('roaster', e.target.value);
    };

    const handleOriginChange = (e) => {
        setOrigin(e.target.value);
        fetchSuggestionsDebounced('origin', e.target.value);
    };

    const handleRoastLevelChange = (e) => {
        setRoastLevel(e.target.value);
        fetchSuggestionsDebounced('roastLevel', e.target.value);
    };
    
    const handleProcessChange = (e) => {
        setProcess(e.target.value);
        fetchSuggestionsDebounced('process', e.target.value);
    };


    // suggestion selection handler 
    const handleSelectRoaster = (suggestion) => {
        if (suggestion !== 'Add New Roaster') {
          setRoaster(suggestion);
        } 
        setRoasterSuggestions([]);
        setShowSuggestion('');
    };

    const handleSelectOrigin = (suggestion) => {
        if (suggestion !== 'Add New Origin') {
            setOrigin(suggestion);
        }
        setOriginSuggestions([]);
        setShowSuggestion('');
    };
    
    const handleSelectRoastLevel = (suggestion) => {
        if (suggestion !== 'Add New Roast Level') {
            setRoastLevel(suggestion);
        }
        setRoastLevelSuggestions([]);
        setShowSuggestion('');
    };
    
    const handleSelectProcess = (suggestion) => {
        if (suggestion !== 'Add New Process') {
            setProcess(suggestion);
        }
        setProcessSuggestions([]);
        setShowSuggestion('');
    };

    const handleBlur = () => {
        const timeoutId = setTimeout(() => {
            setShowSuggestion('');
            setBlurTimeoutId(null);
        }, 200); // Delay before hiding the suggestions
        setBlurTimeoutId(timeoutId);
    };

    const handleFocus = (field) => {
        if (blurTimeoutId) {
            clearTimeout(blurTimeoutId);
            setBlurTimeoutId(null);
        }
        // Directly show suggestions for the focused field
        setShowSuggestion(field);
    };


    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!isFormValid) return;
      try {
        console.log(`Adding New Coffee Bean: ${roaster}, ${origin}, ${roastLevel}, ${process}`)
        // await coffeeBeanAPI.addNewCoffeeBean({ roaster, origin, roastLevel, process });
        updateCoffeeBeanList();
        onClose();
      } catch (error) {
        console.error('Error adding new coffee bean:', error);
      }
    };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        {/* Roaster Input and Dropdown */}
        <div className="relative">
            <input
                type="text"
                placeholder="Roaster"
                value={roaster}
                onChange={handleRoasterChange}
                onFocus={() => handleFocus('roaster')}
                onBlur={handleBlur}
                className="input w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {showSuggestion === 'roaster' && (
                <ul className="absolute z-10 max-h-40 w-full overflow-auto bg-white border border-gray-200 rounded-md mt-1">
                {roasterSuggestions.map((suggestion, index) => (
                    <li key={index} className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleSelectRoaster(suggestion)}>
                    {suggestion}
                    </li>
                ))}
                </ul>
            )}
        </div>

        {/* Origin Input and Dropdown */}
        <div className="relative">
            <input
                type="text"
                placeholder="Origin"
                value={origin}
                onChange={handleOriginChange}
                onFocus={() => handleFocus('origin')}
                onBlur={handleBlur}
                className="input w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {showSuggestion === 'origin' && (
                <ul className="absolute z-10 max-h-40 w-full overflow-auto bg-white border border-gray-200 rounded-md mt-1">
                {originSuggestions.map((suggestion, index) => (
                    <li key={index} className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleSelectOrigin(suggestion)}>
                    {suggestion}
                    </li>
                ))}
                </ul>
            )}
        </div>
  
        {/* Roast Level Input and Dropdown, considering roaster and origin */}
        <div className="relative">
            <input
                type="text"
                placeholder="Roast Level"
                value={roastLevel}
                onChange={handleRoastLevelChange}
                onFocus={() => handleFocus('roastLevel')}
                onBlur={handleBlur}
                className="input w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {showSuggestion === 'roastLevel' && (
                <ul className="absolute z-10 max-h-40 w-full overflow-auto bg-white border border-gray-200 rounded-md mt-1">
                {roastLevelSuggestions.map((suggestion, index) => (
                    <li key={index} className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleSelectRoastLevel(suggestion)}>
                    {suggestion}
                    </li>
                ))}
                </ul>
            )}
        </div>

  
        {/* Process Input and Dropdown, considering roaster, origin, and roast level */}
        <div className="relative">
            <input
                type="text"
                placeholder="Process (optional)"
                value={process}
                onChange={handleProcessChange}
                onFocus={() => handleFocus('process')}
                onBlur={handleBlur}
                className="input w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {showSuggestion === 'process' && (
                <ul className="absolute z-10 max-h-40 w-full overflow-auto bg-white border border-gray-200 rounded-md mt-1">
                {processSuggestions.map((suggestion, index) => (
                    <li key={index} className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleSelectProcess(suggestion)}>
                    {suggestion}
                    </li>
                ))}
                </ul>
            )}
        </div>

        <button 
        type="submit" 
        disabled={!isFormValid}
        className={`w-full px-4 py-2 text-white font-semibold rounded-md ${isFormValid ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        >
            Add Coffee Bean
        </button>
    </form>
  );
}
