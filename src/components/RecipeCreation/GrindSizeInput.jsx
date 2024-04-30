export default function GrindSizeInput({ grindSize, setGrindSize }) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setGrindSize(prev => ({
            ...prev,
            [name]: name === 'description' ? value : value ? parseFloat(value) : ''
        }));
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Steps</label>
                <input
                    type="number"
                    step="0.1"  
                    name="steps"
                    value={grindSize.steps}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Microsteps (optional)</label>
                <input
                    type="number"
                    step="0.1"  
                    name="microsteps"
                    value={grindSize.microsteps}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Description (optional)</label>
                <textarea
                    name="description"
                    value={grindSize.description}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Feel free to add a short note about your grind settings to make it easier to understand how you input the steps/microsteps"
                />
            </div>
        </div>
    );
}
