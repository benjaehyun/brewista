import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export default function TastingNotesInput({ tastingNotes, setTastingNotes }) {
    const [inputValue, setInputValue] = useState('');

    const handleAddNote = () => {
        if (inputValue.trim() && tastingNotes.length < 20) {
            setTastingNotes([...tastingNotes, inputValue.trim()]);
            setInputValue('');
        }
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddNote();
        }
    };

    const handleRemoveNote = (index) => {
        const newNotes = [...tastingNotes];
        newNotes.splice(index, 1);
        setTastingNotes(newNotes);
    };

    return (
        <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-2">Add Tasting Notes</div>
            <div className="flex items-center">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Add tasting note"
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <button
                    type="button"
                    onClick={handleAddNote}
                    className="ml-2 px-3 py-2 bg-blue-500 text-white rounded-md focus:outline-none hover:bg-blue-600"
                >
                    + Add
                </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
                {tastingNotes.map((note, index) => (
                    <div key={index} className="flex items-center bg-gray-100 px-2 py-1 rounded-full shadow-sm">
                        <span className="mr-2">{note}</span>
                        <button
                            type="button"
                            onClick={() => handleRemoveNote(index)}
                            className="text-red-500 hover:text-red-700"
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
