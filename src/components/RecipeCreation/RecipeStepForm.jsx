import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPencil, faBars, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const StepCard = ({ step, index, onEdit, onDelete, isRatio }) => {
    return (
        <div className="flex items-center bg-white rounded-md shadow-md p-4 w-full break-words">
            <div className="flex-1 min-w-0 mr-3 overflow-hidden">
                <div className="truncate font-semibold text-sm" title={`Step ${index + 1}: ${step.description}`}>
                    Step {index + 1}: {step.description}
                </div>
                <div className="space-y-0.5 mt-1">
                    {step.time && (
                        <div className="truncate text-xs text-gray-600" title={`Time: ${step.time} seconds`}>
                            Time: {step.time} seconds
                        </div>
                    )}
                    {step.waterAmount && (
                        <div className="truncate text-xs text-gray-600" title={`Water: ${step.waterAmount} ${isRatio ? 'parts' : 'ml'}`}>
                            Water: {step.waterAmount} {isRatio ? 'parts' : 'ml'}
                        </div>
                    )}
                    {step.isBloom && (
                        <div className="truncate text-xs text-gray-600">
                            Bloom Phase
                        </div>
                    )}
                </div>
            </div>
            <div className="flex items-center space-x-1 flex-shrink-0 ml-auto">
                <button
                    onClick={() => onEdit(step, index)}
                    className="p-1.5 text-blue-600 hover:text-blue-800"
                    title="Edit"
                >
                    <FontAwesomeIcon icon={faPencil} className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onDelete(index)}
                    className="p-1.5 text-red-600 hover:text-red-800"
                    title="Delete"
                >
                    <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default function RecipeStepForm({ steps, setSteps, isTimed, isRatio }) {
    const [description, setDescription] = useState('');
    const [time, setTime] = useState('');
    const [waterAmount, setWaterAmount] = useState('');
    const [isBloom, setIsBloom] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editForm, setEditForm] = useState({
        description: '',
        time: '',
        waterAmount: '',
        isBloom: false
    });

    const handleAddStep = () => {
        if (!description.trim()) {
            // Could add error message/toast here
            return;
        }

        const newStep = {
            description: description.trim(),
            time: isTimed && time ? parseFloat(time) : undefined,
            waterAmount: waterAmount ? parseFloat(waterAmount) : undefined,
            isBloom,
        };
        setSteps([...steps, newStep]);
        resetForm();
    };

    const resetForm = () => {
        setDescription('');
        setTime('');
        setWaterAmount('');
        setIsBloom(false);
    };

    const handleRemoveStep = (index) => {
        if (window.confirm('Are you sure you want to delete this step?')) {
            const newSteps = steps.slice();
            newSteps.splice(index, 1);
            setSteps(newSteps);
        }
    };

    const startEditing = (step, index) => {
        setEditingIndex(index);
        setEditForm({
            description: step.description,
            time: step.time || '',
            waterAmount: step.waterAmount || '',
            isBloom: step.isBloom
        });
    };

    const handleEditSave = (index) => {
        if (!editForm.description.trim()) {
            // Could add error message/toast here
            return;
        }

        const newSteps = [...steps];
        newSteps[index] = {
            description: editForm.description.trim(),
            time: editForm.time ? parseFloat(editForm.time) : undefined,
            waterAmount: editForm.waterAmount ? parseFloat(editForm.waterAmount) : undefined,
            isBloom: editForm.isBloom
        };
        setSteps(newSteps);
        setEditingIndex(null);
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        
        const newSteps = Array.from(steps);
        const [reorderedStep] = newSteps.splice(result.source.index, 1);
        newSteps.splice(result.destination.index, 0, reorderedStep);
        
        setSteps(newSteps);
    };

    const renderEditForm = (index) => (
        <div className="w-full p-4 bg-white rounded-md shadow-md space-y-4">
            {/* Step number indicator */}
            <div className="text-md font-semibold text-gray-700 border-b pb-1">
                Editing Step {index + 1}
            </div>
            
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Description
                </label>
                <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full px-2 py-1 border text-sm rounded resize-y min-h-[80px]"
                    placeholder="Describe this step"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Time input with label */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Time (seconds)
                    </label>
                    <input
                        type="number"
                        value={editForm.time}
                        onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                        className="w-full px-2 py-1 border rounded"
                        min="0"
                    />
                </div>

                {/* Water amount input with label */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        {isRatio ? 'Water (ratio)' : 'Water (ml)'}
                    </label>
                    <input
                        type="number"
                        value={editForm.waterAmount}
                        onChange={(e) => setEditForm({ ...editForm, waterAmount: e.target.value })}
                        className="w-full px-2 py-1 border rounded"
                        min="0"
                    />
                </div>
            </div>

            <div className="flex items-center pt-2">
                <input
                    type="checkbox"
                    checked={editForm.isBloom}
                    onChange={(e) => setEditForm({ ...editForm, isBloom: e.target.checked })}
                    className="form-checkbox h-4 w-4"
                    id={`bloom-checkbox-${index}`}
                />
                <label 
                    htmlFor={`bloom-checkbox-${index}`}
                    className="ml-2 text-sm font-medium text-gray-700"
                >
                    Bloom Phase
                </label>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t">
                <button
                    onClick={() => handleEditSave(index)}
                    className="px-3 py-1.5 text-sm bg-green-50 text-green-600 hover:bg-green-100 rounded-md flex items-center gap-2"
                    title="Save"
                >
                    <FontAwesomeIcon icon={faCheck} />
                    <span>Save</span>
                </button>
                <button
                    onClick={() => setEditingIndex(null)}
                    className="px-3 py-1.5 text-sm bg-red-50 text-red-600 hover:bg-red-100 rounded-md flex items-center gap-2"
                    title="Cancel"
                >
                    <FontAwesomeIcon icon={faXmark} />
                    <span>Cancel</span>
                </button>
            </div>
        </div>
    );

    return (
        <div className="w-full space-y-4">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Description (*required) </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-y min-h-[60px]"
                        placeholder="Describe this step"
                        // required
                    />
                </div>
                {isTimed && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Time (seconds)</label>
                        <input
                            type="number"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Enter time in seconds"
                            min="0"
                        />
                    </div>
                )}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        {isRatio ? 'Ratio Amount' : 'Water Amount (ml)'}
                    </label>
                    <input
                        type="number"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={waterAmount}
                        onChange={(e) => setWaterAmount(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder={isRatio ? "Enter ratio amount (e.g., 15 for 1:15)" : "Enter water amount in ml"}
                        min="0"
                    />
                </div>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={isBloom}
                        onChange={() => setIsBloom(!isBloom)}
                        className="form-checkbox h-4 w-4 text-blue-600"
                    />
                    <label className="ml-2 block text-sm font-medium text-gray-700">Bloom Phase</label>
                </div>
                <button
                    type="button"
                    onClick={handleAddStep}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-md focus:outline-none hover:bg-blue-600 disabled:bg-blue-300"
                    disabled={!description.trim()}
                >
                    Add Step
                </button>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="steps">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="w-full space-y-2 overflow-hidden"
                        >
                            {steps.map((step, index) => (
                                <Draggable
                                    key={index}
                                    draggableId={`step-${index}`}
                                    index={index}
                                >
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className="flex items-center w-full gap-2"
                                        >
                                            <div
                                                {...provided.dragHandleProps}
                                                className="p-2 text-gray-400 hover:text-gray-600 flex-shrink-0"
                                            >
                                                <FontAwesomeIcon icon={faBars} className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0 overflow-hidden">
                                                {editingIndex === index ? renderEditForm(index) : (
                                                    <StepCard
                                                        step={step}
                                                        index={index}
                                                        onEdit={startEditing}
                                                        onDelete={handleRemoveStep}
                                                        isRatio={isRatio}
                                                        
                                                    />
                                                )}
                                            </div>
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