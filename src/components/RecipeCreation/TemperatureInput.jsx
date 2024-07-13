import React from 'react';

export default function TemperatureInput({ waterTemp, setWaterTemp, waterTempUnit, setWaterTempUnit }) {
    const handleTempChange = (e) => {
        setWaterTemp(e.target.value ? parseFloat(e.target.value) : '');
    };

    const handleUnitChange = (e) => {
        setWaterTempUnit(e.target.value);
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Water Temperature</label>
                <input
                    type="number"
                    name="waterTemp"
                    value={waterTemp}
                    onChange={handleTempChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter temperature"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                <div className="flex justify-center space-x-4">
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            name="waterTempUnit"
                            value="Celsius"
                            checked={waterTempUnit === 'Celsius'}
                            onChange={handleUnitChange}
                            className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                        />
                        <span className="ml-2">Celsius</span>
                    </label>
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            name="waterTempUnit"
                            value="Fahrenheit"
                            checked={waterTempUnit === 'Fahrenheit'}
                            onChange={handleUnitChange}
                            className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                        />
                        <span className="ml-2">Fahrenheit</span>
                    </label>
                </div>
            </div>
        </div>
    );
}


