import React, { useState, useEffect } from 'react';

export default function UserProfile({ profile, updateProfile, setProfile }) {
  const [editMode, setEditMode] = useState(false);
  // Store the initial form data to compare changes against
  const initialFormData = {
    displayName: profile?.displayName || '',
    bio: profile?.bio || '',
  };
  const [formData, setFormData] = useState(initialFormData);
  // State to track if any changes have been made to enable the Save button
  const [isFormDirty, setIsFormDirty] = useState(false);

  useEffect(() => {
    // When the profile prop changes (e.g., initially fetched), update the form data and reset form dirty state
    setFormData({
      displayName: profile?.displayName || '',
      bio: profile?.bio || '',
    });
    setIsFormDirty(false);
  }, [profile]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => {
      const newData = { ...prevState, [name]: value };
      // Check if the form data is different from the initial data to update the form dirty state
      const formDirty = newData.displayName !== initialFormData.displayName || newData.bio !== initialFormData.bio;
      setIsFormDirty(formDirty);
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormDirty) return; // Only proceed if changes were made
    const profileData = await updateProfile(formData); // Uncomment and implement your update logic
    setEditMode(false);
    setIsFormDirty(false); // Reset form dirty state after submission
    setProfile(profileData)
  };

  return (
    <div className="text-center mb-6">
      {editMode ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-center md:space-x-4">
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 md:text-right md:w-1/4">Display Name</label>
            <input
              id="name"
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              className="mt-1 block w-full md:w-3/5 rounded-md border-2 border-gray-300 shadow-sm p-3 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 sm:text-sm"
            />
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-center md:space-x-4">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 md:text-right md:w-1/4">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="mt-1 block w-full md:w-3/5 rounded-md border-2 border-gray-300 shadow-sm p-3 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 sm:text-sm"
              placeholder="No bio yet"
            />
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            <button type="submit" disabled={!isFormDirty} className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md ${isFormDirty ? 'text-white bg-blue-500 hover:bg-blue-700' : 'text-gray-500 bg-gray-200'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}>
              Save
            </button>
            <button onClick={() => setEditMode(false)} className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <h1 className="text-2xl font-bold">{profile?.displayName || 'No display name yet, edit to add set yours!'}</h1>
          <p className="text-gray-700">{profile?.bio || 'No bio yet'}</p>
          <button onClick={() => setEditMode(true)} className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Edit Profile
          </button>
        </>
      )}
    </div>
  );
}
