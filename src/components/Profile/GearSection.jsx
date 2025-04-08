import React, { useState, useCallback, useEffect } from 'react';
import { Plus, Filter, Trash2, Loader2 } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faVideo, 
  faLayerGroup, 
  faBlender, 
  faTint, 
  faBalanceScale,
  faCubesStacked
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../hooks/auth-context';

const getGearIcon = (gearType) => {
  switch (gearType) {
    case 'Brewer':
      return <FontAwesomeIcon icon={faVideo}  style={{ transform: 'rotate(270deg)' }} />;
    case 'Paper':
      return <FontAwesomeIcon icon={faLayerGroup} />;
    case 'Grinder':
      return <FontAwesomeIcon icon={faBlender} />;
    case 'Kettle':
      return <FontAwesomeIcon icon={faTint} />;
    case 'Scale':
      return <FontAwesomeIcon icon={faBalanceScale} />;
    default:
      return <FontAwesomeIcon icon={faCubesStacked} />;
  }
};

const GearSection = ({ onAddGear }) => {
  const { userProfile, removeGearFromProfile } = useAuth();
  const [filter, setFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGearId, setSelectedGearId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [error, setError] = useState(null);

  const gear = userProfile?.gear || [];
  const filteredGear = filter ? gear.filter(item => item.type === filter) : gear;

  const handleRemove = useCallback((e, gearId) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedGearId(gearId);
    setShowConfirmModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    if (!isRemoving) {
      setShowConfirmModal(false);
      setSelectedGearId(null);
      setError(null);
    }
  }, [isRemoving]);

  const handleConfirmRemove = async () => {
    if (!selectedGearId || isRemoving) return;

    setIsRemoving(true);
    setError(null);
    try {
      await removeGearFromProfile(selectedGearId);
      handleCloseModal();
    } catch (error) {
      setError('Failed to remove gear. Please try again.');
    } finally {
      setIsRemoving(false);
    }
  };

  // Clear filter if category becomes empty
  // useEffect(() => {
  //   if (filter && filteredGear.length === 0) {
  //     setFilter('');
  //   }
  // }, [filteredGear.length, filter]);

  const gearTypes = ['Brewer', 'Paper', 'Grinder', 'Kettle', 'Scale', 'Other'];

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2 rounded-full transition-colors ${
            showFilters || filter 
              ? 'bg-blue-100 text-blue-600' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          aria-label="Filter gear"
        >
          <Filter size={20} />
        </button>
        <button
          onClick={onAddGear}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
        >
          <Plus size={20} />
          <span>Add Gear</span>
        </button>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-lg">
          <button
            onClick={() => setFilter('')}
            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
              !filter 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            All
          </button>
          {gearTypes.map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-full transition-colors ${
                filter === type 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <span className="w-4 h-4">{getGearIcon(type)}</span>
              {type}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto p-1">
        {filteredGear.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            {filter 
              ? `No ${filter.toLowerCase()} gear found` 
              : "No gear added yet"}
          </div>
        ) : (
          filteredGear.map((item) => (
            <div 
              key={item._id}
              className="relative bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-colors"
            >
              <button
                onClick={(e) => handleRemove(e, item._id)}
                className="absolute right-2 top-2 p-1.5 rounded-full bg-white shadow-sm border border-gray-200 
                         text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors z-30"
                aria-label={`Remove ${item.brand} ${item.model}`}
              >
                <Trash2 size={16} />
              </button>

              <div className="relative pt-2">
                <div className="absolute left-0 top-2">
                  <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg text-gray-600">
                    {getGearIcon(item.type)}
                  </div>
                </div>

                <div className="text-center">
                  <span className="inline-block px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full mb-1">
                    {item.type}
                  </span>
                  <h3 className="font-medium text-gray-900 truncate">
                    {item.brand}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">
                    {item.model}
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100">
                {item.modifications ? (
                  <div className="text-sm text-gray-600 text-center">
                    <span className="font-medium text-gray-700">Modifications:</span>
                    <p className="mt-1">{item.modifications}</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 justify-center py-1 px-3 bg-gray-50 rounded-lg">
                    <span className="text-xs text-gray-400">Stock Configuration</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {showConfirmModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-white rounded-lg max-w-sm w-full p-6"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-2">Remove Gear</h3>
            {error && (
              <p className="text-red-500 text-sm mb-4">{error}</p>
            )}
            <p className="text-gray-600 mb-4">
              Are you sure you want to remove this item from your gear collection?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-gray-600 hover:text-gray-700 transition-colors"
                disabled={isRemoving}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRemove}
                disabled={isRemoving}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors 
                         disabled:bg-red-300 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isRemoving && <Loader2 size={16} className="animate-spin" />}
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GearSection;