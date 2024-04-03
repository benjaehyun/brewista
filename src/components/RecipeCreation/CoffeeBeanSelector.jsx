import React, { useState, useEffect } from 'react';
// Placeholder for fetching beans and adding a new bean
// import { fetchCoffeeBeans, addNewBean } from '../../api';

export default function CoffeeBeanSelector({ coffeeBeanList,selectedBean, setSelectedBean }) {
  const [isAddingNewBean, setIsAddingNewBean] = useState(false);


  const handleSelectBean = (beanId) => {
    setSelectedBean(beanId);
    // Optionally close the selector or reset state as needed
  };

  const handleAddNewBean = () => {
    // Placeholder for adding a new bean functionality
    setIsAddingNewBean(true);
    // Show form for adding a new bean or open a modal
  };

  return (
    <div>
      {/* Searchable dropdown or a list for selecting a bean */}
      <div>
        {/* Iterate over beans and display them */}
        {coffeeBeanList.map((bean) => (
          <div key={bean._id} onClick={() => handleSelectBean(bean._id)}>
            {bean.name} - {bean.roaster}
          </div>
        ))}
      </div>
      <button onClick={handleAddNewBean}>+ Add New Bean</button>
      {/* Form or modal for adding a new bean */}
      {isAddingNewBean && (
        <div>
          {/* Form fields for adding a new coffee bean */}
        </div>
      )}
    </div>
  );
}
