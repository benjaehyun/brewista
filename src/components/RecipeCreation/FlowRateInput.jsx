import React from 'react'

export default function FlowRateInput({ flowRate, setFlowRate }) {
    const handleChange = (e) => {
        const { value } = e.target;
        setFlowRate(value ? parseFloat(value) : ''); // Parse as floating-point number
    };

    return (
        <div>
            <p className="mb-2 text-sm text-gray-600">Optional - Specify the flow rate of water in milliliters per second.</p>
            <label className="block text-sm font-medium text-gray-700">Flow Rate (ml/s)</label>
            <input
                type="number"
                step="0.1"  
                name="flowRate"
                value={flowRate}
                onChange={handleChange}
                placeholder="Enter flow rate in ml/s"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
        </div>
    )
}
