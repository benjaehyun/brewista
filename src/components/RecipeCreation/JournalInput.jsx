import React from 'react';

export default function JournalInput({ journal, setJournal }) {
    const handleJournalChange = (e) => {
        setJournal(e.target.value);
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Journal</label>
                <textarea
                    name="journal"
                    value={journal}
                    onChange={handleJournalChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Write your journal entry here..."
                    rows="5"
                />
            </div>
        </div>
    );
}
