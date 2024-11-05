import React, { useState, useEffect } from 'react';
import { useAuth } from '../../utilities/auth-context';
import { Loader2 } from 'lucide-react';

export default function UserProfile() {
  const { userProfile, updateProfile } = useAuth(); // Get both profile and update function from auth
  const [editMode, setEditMode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  // Store the initial form data to compare changes against
  const initialFormData = {
    displayName: userProfile?.displayName || '',
    bio: userProfile?.bio || '',
  };
  const [formData, setFormData] = useState(initialFormData);
  const [isFormDirty, setIsFormDirty] = useState(false);

  useEffect(() => {
    // When the profile prop changes, update the form data and reset form dirty state
    setFormData({
      displayName: userProfile?.displayName || '',
      bio: userProfile?.bio || '',
    });
    setIsFormDirty(false);
  }, [userProfile]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => {
      const newData = { ...prevState, [name]: value };
      // Check if the form data is different from the initial data
      const formDirty = newData.displayName !== initialFormData.displayName || 
                       newData.bio !== initialFormData.bio;
      setIsFormDirty(formDirty);
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormDirty || isUpdating) return;

    setIsUpdating(true);
    setError(null);

    try {
      await updateProfile(formData);
      setEditMode(false);
      setIsFormDirty(false);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setIsFormDirty(false);
    setEditMode(false);
    setError(null);
  };

  return (
    <div className="text-center mb-6">
      {editMode ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          <div className="flex flex-col md:flex-row md:items-center md:justify-center md:space-x-4">
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 md:text-right md:w-1/4">
              Display Name
            </label>
            <input
              id="displayName"
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              className="mt-1 block w-full md:w-3/5 rounded-md border-2 border-gray-300 shadow-sm p-3 
                       focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 sm:text-sm"
              disabled={isUpdating}
            />
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-center md:space-x-4">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 md:text-right md:w-1/4">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="mt-1 block w-full md:w-3/5 rounded-md border-2 border-gray-300 shadow-sm p-3 
                       focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 sm:text-sm"
              placeholder="Tell us about yourself..."
              disabled={isUpdating}
            />
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            <button 
              type="submit" 
              disabled={!isFormDirty || isUpdating}
              className={`inline-flex justify-center items-center gap-2 py-2 px-4 border border-transparent 
                         shadow-sm text-sm font-medium rounded-md 
                         ${isFormDirty && !isUpdating
                           ? 'text-white bg-blue-500 hover:bg-blue-700' 
                           : 'text-gray-500 bg-gray-200 cursor-not-allowed'
                         } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {isUpdating && <Loader2 size={16} className="animate-spin" />}
              Save
            </button>
            <button 
              type="button"
              onClick={handleCancel}
              disabled={isUpdating}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm 
                       font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <h1 className="text-2xl font-bold">
            {userProfile?.displayName || 'No display name set'}
          </h1>
          <p className="text-gray-700 mt-2">
            {userProfile?.bio || 'No bio yet'}
          </p>
          <button 
            onClick={() => setEditMode(true)} 
            className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm 
                     text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-700 
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Edit Profile
          </button>
        </>
      )}
    </div>
  );
}