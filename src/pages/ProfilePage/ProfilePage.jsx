import React, { useState } from 'react';

// Assuming components for sections are imported or defined elsewhere
import UserProfile from '../../components/Profile/UserProfile';
import GearSection from '../../components/Profile/GearSection';
import FollowersModal from '../../components/Profile/FollowersModal';
import FollowingModal from '../../components/Profile/FollowingModal';
import TabContent from '../../components/Profile/TabContent'; // Handles tab switching and content

export default function ProfilePage() {
  // State to manage active tab
  const [activeTab, setActiveTab] = useState('posts');

  return (
    <div className="container mx-auto p-4">
      <UserProfile />
      <div className="my-4">
        <FollowersModal />
        <FollowingModal />
      </div>
      <GearSection />
      <div className="my-4">
        <div className="flex justify-center space-x-4">
          <button onClick={() => setActiveTab('posts')} className={`px-4 py-2 ${activeTab === 'posts' ? 'text-blue-500' : 'text-gray-500'}`}>Posts</button>
          <button onClick={() => setActiveTab('recipes')} className={`px-4 py-2 ${activeTab === 'recipes' ? 'text-blue-500' : 'text-gray-500'}`}>Recipes</button>
          <button onClick={() => setActiveTab('saved')} className={`px-4 py-2 ${activeTab === 'saved' ? 'text-blue-500' : 'text-gray-500'}`}>Saved</button>
        </div>
        <TabContent activeTab={activeTab} />
      </div>
    </div>
  );
}
