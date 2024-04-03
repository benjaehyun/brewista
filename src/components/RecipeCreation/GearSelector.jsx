import React from 'react'
import { useState } from 'react';

export default function GearSelector({ gear, selectedGear, setSelectedGear }) {

  const [expandedCategory, setExpandedCategory] = useState(null);

  const gearByType = gear.reduce((acc, item) => {
      acc[item.type] = acc[item.type] || [];
      acc[item.type].push(item);
      return acc;
  }, {});

  const handleToggleGear = (gearId) => {
      setSelectedGear(selectedGear.includes(gearId)
          ? selectedGear.filter(id => id !== gearId)
          : [...selectedGear, gearId]);
  };

  const toggleCategory = (category) => {
      setExpandedCategory(expandedCategory === category ? null : category);
  };

  return (
      <div className="space-y-2">
          {Object.entries(gearByType).map(([type, items]) => (
              <div key={type}>
                  <button
                      onClick={() => toggleCategory(type)}
                      className="w-full text-left px-4 py-2 bg-gray-200 text-gray-700 rounded-md focus:outline-none hover:bg-gray-300"
                  >
                      {type} <span className="float-right">{expandedCategory === type ? '-' : '+'}</span>
                  </button>
                  {expandedCategory === type && (
                      <ul className="mt-2 border border-gray-200 rounded-md">
                          {items.map(item => (
                            <li key={item._id} className="p-2 hover:bg-gray-50 rounded-md">
                                <div
                                    onClick={() => handleToggleGear(item._id)}
                                    className="flex items-start justify-between cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedGear.includes(item._id)}
                                        onChange={(e) => e.stopPropagation()} // Prevent checkbox from triggering the div's onClick twice.
                                        className="mt-1 cursor-pointer" 
                                        readOnly // Make the checkbox read-only since the div onClick controls the toggle.
                                    />
                                    <label className="flex-1 min-w-0 ml-2 cursor-pointer">
                                        <span className="block truncate font-medium">
                                            {`${item.brand} ${item.model}${item.modifications ? ',' : ''}`}
                                        </span>
                                        {item.modifications && (
                                            <span className="block text-xs text-gray-500 truncate">
                                                {` Modifications: ${item.modifications}`}
                                            </span>
                                        )}
                                    </label>
                                </div>
                            </li>
                        ))}
                      </ul>
                  )}
              </div>
          ))}
      </div>
  );
}
