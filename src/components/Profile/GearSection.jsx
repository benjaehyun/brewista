import GearAdditionForm from "../GearAddition/GearAdditionForm"


export default function GearSection({ gear, onAddGear }) {
    // Placeholder for gear data. Assume `gear` prop is passed down or fetched here.
    return (
        // Add a button in GearSection for adding new gear
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <button 
                onClick={onAddGear} 
                className="p-4 bg-gray-200 shadow rounded flex justify-center items-center text-gray-700 font-bold cursor-pointer"
            >
                + Add New Gear
            </button>
            <h1 className="text-center">gear section</h1>
            <h1 className="text-center">gear section</h1>
            <h1 className="text-center">gear section</h1>
            {gear?.map((item) => (
                <div key={item.id} className="p-4 bg-white shadow rounded">
                <h3 className="text-md font-semibold">{item.name}</h3>
                {/* Additional gear details */}
                </div>
            ))}
        </div>
    );
  }
  
