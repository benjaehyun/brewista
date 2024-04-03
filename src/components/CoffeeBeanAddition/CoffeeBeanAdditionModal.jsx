import React from 'react';
import CoffeeBeanAdditionForm from './CoffeeBeanAdditionForm';

export default function CoffeeBeanAdditionModal({ isOpen, onClose, updateCoffeeBeanList }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="bg-white p-5 rounded-lg shadow-lg relative max-w-md mx-auto">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-700 font-bold">X</button>
        <h2 className="text-lg font-semibold mb-4">Add New Coffee Bean</h2>
        <CoffeeBeanAdditionForm updateCoffeeBeanList={updateCoffeeBeanList} onClose={onClose} />
      </div>
    </div>
  );
}
