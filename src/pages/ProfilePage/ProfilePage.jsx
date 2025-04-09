import React, { useState } from 'react';
import { useAuth } from '../../hooks/auth-context';

import UserProfile from '../../components/Profile/UserProfile';
import GearSection from '../../components/Profile/GearSection';
import FollowersModal from '../../components/Profile/FollowersModal';
import FollowingModal from '../../components/Profile/FollowingModal';
import GearAdditionModal from '../../components/GearAddition/GearAdditionModal';
import CompactRecipeList from '../../components/Profile/CompactRecipeList';

const ProfileSkeleton = () => (
  <div className="animate-pulse space-y-4 p-4">
    <div className="h-32 md:h-40 bg-gray-200 rounded-lg w-full" />
    <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto" />
    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
    <div className="flex justify-center space-x-4">
      <div className="h-6 bg-gray-200 rounded w-24" />
      <div className="h-6 bg-gray-200 rounded w-24" />
    </div>
  </div>
);

export default function ProfilePage() {
  const { userProfile, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('recipes');
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [showGearModal, setShowGearModal] = useState(false);

  if (isLoading) return <ProfileSkeleton />;

  if (!userProfile) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-gray-500">Please log in to view your profile</p>
      </div>
    );
  }

  const tabs = [
    { id: 'recipes', label: 'My Recipes' },
    { id: 'saved', label: 'Saved Recipes' },
    { id: 'gear', label: 'Gear' },
    // Commented out for future implementation
    // { id: 'posts', label: 'Posts' }
  ];

  return (
    <div className="container max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
        <UserProfile profile={userProfile} />
        
        <div className="flex justify-center space-x-8 mt-6">
          <button 
            onClick={() => setShowFollowersModal(true)}
            className="text-sm md:text-base hover:text-blue-600 transition-colors group"
          >
            <span className="font-semibold group-hover:text-blue-600">{userProfile.followersCount}</span>
            <span className="ml-1 text-gray-600 group-hover:text-blue-600">Followers</span>
          </button>
          <button 
            onClick={() => setShowFollowingModal(true)}
            className="text-sm md:text-base hover:text-blue-600 transition-colors group"
          >
            <span className="font-semibold group-hover:text-blue-600">{userProfile.followingCount}</span>
            <span className="ml-1 text-gray-600 group-hover:text-blue-600">Following</span>
          </button>
        </div>
      </div>

      {/* Custom Tabs */}
      <div className="space-y-4">
        <div className="flex justify-center border-b border-gray-200">
          <div className="flex space-x-1 md:space-x-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm md:text-base font-medium whitespace-nowrap border-b-2 transition-colors duration-200 ease-in-out ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'recipes' && (
            <CompactRecipeList 
              type="user"
              emptyMessage="You haven't created any recipes yet"
            />
          )}
          
          {activeTab === 'saved' && (
            <CompactRecipeList 
              type="saved"
              emptyMessage="You haven't saved any recipes yet"
            />
          )}
          
          {activeTab === 'gear' && (
            <GearSection 
              gear={userProfile.gear} 
              onAddGear={() => setShowGearModal(true)} 
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <FollowersModal 
        isOpen={showFollowersModal} 
        onClose={() => setShowFollowersModal(false)} 
        profileId={userProfile._id} 
      />
      <FollowingModal 
        isOpen={showFollowingModal} 
        onClose={() => setShowFollowingModal(false)} 
        profileId={userProfile._id} 
      />
      <GearAdditionModal 
        isOpen={showGearModal} 
        onClose={() => setShowGearModal(false)} 
      />
    </div>
  );
}