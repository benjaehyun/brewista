import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export default function RecipeStepForm({ steps, setSteps, isTimed, isRatio }) {
    const [description, setDescription] = useState('');
    const [time, setTime] = useState('');
    const [waterAmount, setWaterAmount] = useState('');
    const [isBloom, setIsBloom] = useState(false);

    const handleAddStep = () => {
        const newStep = {
            description,
            time: isTimed && time ? parseFloat(time) : undefined,
            waterAmount: waterAmount ? parseFloat(waterAmount) : undefined,
            isBloom,
        };
        setSteps([...steps, newStep]);
        setDescription('');
        setTime('');
        setWaterAmount('');
        setIsBloom(false);
    };

    const handleRemoveStep = (index) => {
        const newSteps = steps.slice();
        newSteps.splice(index, 1);
        setSteps(newSteps);
    };

    return (
        <div>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Describe this step"
                        
                    />
                </div>
                {isTimed && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Time (seconds)</label>
                        <input
                            type="number"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Enter time in seconds"
                        />
                    </div>
                )}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        {isRatio ? 'Ratio Amount' : 'Water Amount (ml)'}
                    </label>
                    <input
                        type="number"
                        value={waterAmount}
                        onChange={(e) => setWaterAmount(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder={isRatio ? "Enter ratio amount (e.g., 15 for 1:15)" : "Enter water amount in ml"}
                    />
                </div>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={isBloom}
                        onChange={() => setIsBloom(!isBloom)}
                        className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                    />
                    <label className="ml-2 block text-sm font-medium text-gray-700">Bloom Phase</label>
                </div>
                <button
                    type="button"
                    onClick={handleAddStep}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md focus:outline-none hover:bg-blue-600"
                >
                    Add Step
                </button>
            </div>
            <div className="mt-4 space-y-2">
                {steps.map((step, index) => (
                    <div key={index} className="p-4 bg-gray-100 rounded-md shadow-md flex justify-between items-center">
                        <div className="text-center">
                            <p className="font-semibold">{step.description}</p>
                            {step.time && <p className="text-sm text-gray-600">Time: {step.time} seconds</p>}
                            {step.waterAmount && <p className="text-sm text-gray-600">Water: {step.waterAmount} {isRatio ? 'parts' : 'ml'}</p>}
                            {step.isBloom && <p className="text-sm text-gray-600">Bloom Phase</p>}
                        </div>
                        <button
                            type="button"
                            onClick={() => handleRemoveStep(index)}
                            className="text-red-500 hover:text-red-700"
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
