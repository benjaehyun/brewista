import GearAdditionForm from "../GearAddition/GearAdditionForm"


// export default function GearSection({ gear, onAddGear }) {
//     // Placeholder for gear data. Assume `gear` prop is passed down or fetched here.
//     return (
//         // Add a button in GearSection for adding new gear
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//             <button 
//                 onClick={onAddGear} 
//                 className="p-4 bg-gray-200 shadow rounded flex justify-center items-center text-gray-700 font-bold cursor-pointer"
//             >
//                 + Add New Gear
//             </button>
//             <h1 className="text-center">gear section</h1>
//             <h1 className="text-center">gear section</h1>
//             <h1 className="text-center">gear section</h1>
//             {gear?.map((item) => (
//                 <div key={item.id} className="p-4 bg-white shadow rounded">
//                 <h3 className="text-md font-semibold">{item.name}</h3>
//                 {/* Additional gear details */}
//                 </div>
//             ))}
//         </div>
//     );
//   }

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

export default function GearSection({ gear, onAddGear, removeGearItem }) {
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [selectedGearId, setSelectedGearId] = useState(null);

  const gearTypes = ['Brewer', 'Paper', 'Grinder', 'Kettle', 'Scale', 'Other'];
  const [filter, setFilter] = useState('');

  const filteredGear = filter ? gear.filter(item => item.type === filter) : gear;

  const showConfirmModal = (gearId) => {
    setSelectedGearId(gearId);
    setIsConfirmModalVisible(true);
  };

  const removeGear = async () => {
    await removeGearItem(selectedGearId);
    console.log(`removing gear ${selectedGearId}`)
    setIsConfirmModalVisible(false);
  };

  return (
    <div>
        <div className="flex flex-wrap gap-2 p-4 justify-center items-center">
            {gearTypes.map((type) => (
            <button key={type} onClick={() => setFilter(type)} className="px-3 py-1 text-sm text-blue-700 bg-blue-100 rounded-full hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                {type}
            </button>
            ))}
            <button onClick={() => setFilter('')} className="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500">
            Show All
            </button>
            <button 
            onClick={onAddGear} 
            className="ml-auto px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
            + Add New Gear
            </button>
        </div>

        {/* Gear grid */}
        <div className="max-h-[350px] overflow-auto p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredGear.map((item, index) => (
            <div key={index} className="relative p-4 bg-white shadow rounded-lg">
                <button 
                onClick={() => showConfirmModal(item._id)} 
                className="absolute top-0 right-0 p-2 text-white bg-red-500 rounded-full hover:bg-red-600 focus:outline-none"
                style={{ transform: 'translate(50%, -50%)', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                <FontAwesomeIcon icon={faTrashAlt} size="s" />
                </button>
                <h3 className="text-md font-semibold">{item.brand}</h3>
                <p className="text-sm">Model: {item.model}</p>
                <p className="text-sm">Modifications: {item.modifications || 'None'}</p>
                <p className="text-sm">Type: {item.type}</p>
            </div>
            ))}
        </div>

      {/* Gear removal confirmation modal */}
      {isConfirmModalVisible && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center px-4 z-40">
          <div className="bg-white rounded-lg max-w-md w-full p-4 shadow-lg z-50">
            <h2 className="text-lg font-semibold">Confirm Removal</h2>
            <p>Are you sure you want to remove this gear item?</p>
            <div className="mt-4 flex justify-center gap-4">
              <button
                onClick={() => setIsConfirmModalVisible(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={removeGear}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
