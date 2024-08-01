import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export default function RecipeStepForm({ steps, setSteps, isTimed, setIsTimed }) {
    const [stepDescription, setStepDescription] = useState('');
    const [stepTime, setStepTime] = useState('');
    const [isBloom, setIsBloom] = useState(false);
    const [waterAmount, setWaterAmount] = useState('');
    const [ratio, setRatio] = useState('');
    const [isExplicit, setIsExplicit] = useState(true);

    const handleAddStep = () => {
        if (stepDescription.trim() === '') return;

        const newStep = {
            id: `step-${steps.length + 1}`,
            description: stepDescription,
            time: stepTime ? parseInt(stepTime, 10) : null,
            isBloom,
            waterAmount: waterAmount ? parseInt(waterAmount, 10) : null,
            ratio: ratio ? parseFloat(ratio) : null
        };

        setSteps([...steps, newStep]);
        setStepDescription('');
        setStepTime('');
        setIsBloom(false);
        setWaterAmount('');
        setRatio('');
    };

    const handleDeleteStep = (index) => {
        const newSteps = [...steps];
        newSteps.splice(index, 1);
        setSteps(newSteps);
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const reorderedSteps = Array.from(steps);
        const [removed] = reorderedSteps.splice(result.source.index, 1);
        reorderedSteps.splice(result.destination.index, 0, removed);
        setSteps(reorderedSteps);
    };

    return (
        <div>
            <div className="space-y-4">
                <div className="flex items-center">
                    <label className="block text-sm font-medium text-gray-700 mr-2">Recipe Type:</label>
                    <button
                        type="button"
                        onClick={() => setIsExplicit(true)}
                        className={`px-4 py-2 ${isExplicit ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-md focus:outline-none`}
                    >
                        Explicit
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsExplicit(false)}
                        className={`ml-2 px-4 py-2 ${!isExplicit ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-md focus:outline-none`}
                    >
                        Ratio
                    </button>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Step Description</label>
                    <input
                        type="text"
                        name="stepDescription"
                        value={stepDescription}
                        onChange={(e) => setStepDescription(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Describe the step"
                    />
                </div>
                
                {isExplicit ? (
                    <>
                        {isTimed && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Time (seconds)</label>
                                <input
                                    type="number"
                                    name="stepTime"
                                    value={stepTime}
                                    onChange={(e) => setStepTime(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Time in seconds (optional)"
                                />
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Water Amount (ml)</label>
                            <input
                                type="number"
                                name="waterAmount"
                                value={waterAmount}
                                onChange={(e) => setWaterAmount(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Water amount in ml (optional)"
                            />
                        </div>
                        {steps.length === 0 && (
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="isBloom"
                                    checked={isBloom}
                                    onChange={(e) => setIsBloom(e.target.checked)}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label className="ml-2 block text-sm font-medium text-gray-700">Is Bloom?</label>
                            </div>
                        )}
                    </>
                ) : (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ratio</label>
                        <input
                            type="number"
                            step="0.01"
                            name="ratio"
                            value={ratio}
                            onChange={(e) => setRatio(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Enter ratio (e.g., 1.5)"
                        />
                    </div>
                )}

                <button
                    type="button"
                    onClick={handleAddStep}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md focus:outline-none hover:bg-blue-600"
                >
                    Add Step
                </button>
            </div>
            
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="steps">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2 mt-4">
                            {steps.map((step, index) => (
                                <Draggable key={step.id} draggableId={step.id} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className="flex justify-between items-center p-2 bg-gray-100 rounded-md shadow-sm"
                                        >
                                            <div>
                                                <p className="font-medium">{step.description}</p>
                                                {isExplicit ? (
                                                    <>
                                                        {isTimed && step.time && <p className="text-sm text-gray-600">Time: {step.time} seconds</p>}
                                                        {step.waterAmount && <p className="text-sm text-gray-600">Water: {step.waterAmount} ml</p>}
                                                        {step.isBloom && <p className="text-sm text-gray-600">Bloom Phase</p>}
                                                    </>
                                                ) : (
                                                    <p className="text-sm text-gray-600">Ratio: {step.ratio}</p>
                                                )}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteStep(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
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
