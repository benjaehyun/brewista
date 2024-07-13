import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function TastingNotesInput({ tastingNotes, setTastingNotes }) {
    const [newNote, setNewNote] = useState('');

    const handleAddNote = () => {
        if (newNote.trim() && newNote.length <= 20) {
            setTastingNotes([...tastingNotes, newNote.trim()]);
            setNewNote('');
        }
    };

    const handleRemoveNote = (index) => {
        setTastingNotes(tastingNotes.filter((_, i) => i !== index));
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const reorderedNotes = Array.from(tastingNotes);
        const [movedNote] = reorderedNotes.splice(result.source.index, 1);
        reorderedNotes.splice(result.destination.index, 0, movedNote);
        setTastingNotes(reorderedNotes);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddNote();
        }
    };

    return (
        <div>
            <div className="flex space-x-2 mb-4">
                <input
                    type="text"
                    placeholder="Add tasting note"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                    type="button"
                    onClick={handleAddNote}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    + Add
                </button>
            </div>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="tastingNotes" direction="horizontal">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="flex flex-wrap gap-2"
                        >
                            {tastingNotes.map((note, index) => (
                                <Draggable key={index} draggableId={`tastingNote-${index}`} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className="flex items-center px-3 py-1 bg-gray-100 rounded-md shadow cursor-pointer"
                                            style={{
                                                ...provided.draggableProps.style,
                                                display: 'inline-flex',
                                                whiteSpace: 'nowrap',
                                                margin: '0 8px 8px 0',
                                            }}
                                        >
                                            <span>{note}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveNote(index)}
                                                className="ml-2 text-red-500 hover:text-red-700"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
}
