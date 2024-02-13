import React, { useState, useEffect } from 'react';
import * as profilesApi from "../../utilities/profiles-api"

import UserProfile from '../../components/Profile/UserProfile';
import GearSection from '../../components/Profile/GearSection';
import FollowersModal from '../../components/Profile/FollowersModal';
import FollowingModal from '../../components/Profile/FollowingModal';
import TabContent from '../../components/Profile/TabContent'; // Handles tab switching and content

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('posts');
  const [profile, setProfile] = useState({ displayName: '', bio: '', followersCount: 0, followingCount: 0, gear: [], savedRecipes: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  useEffect(() => {
      async function getApiProfile () {
          const apiProfile = await profilesApi.getProfile()
          // setProfile({...profile, ...apiProfile})
          setProfile(profile => ({ ...profile, ...apiProfile })) // Functionally very similar to just passing the spread objects, however, the functional update via arrow function provides the most current states at the time of update and ensures that any recent updates that could have been made before this setter function would be applied 
          setIsLoading(false);
      }
      getApiProfile()
      console.log(profile)
  }, [])

  return (
    <>
      { isLoading ? <h1>Loading profile...</h1> : 
        <div className="container mx-auto p-4">
          <UserProfile profile={profile} updateProfile={profilesApi.updateProfile} setProfile={setProfile}/>
          <div className="my-4 flex justify-around">
            <button onClick={() => setShowFollowersModal(true)} className="text-blue-500">
              Followers: {profile.followersCount}
            </button>
            <button onClick={() => setShowFollowingModal(true)} className="text-blue-500">
              Following: {profile.followingCount}
            </button>
          </div>
          <FollowersModal isOpen={showFollowersModal} onClose={() => setShowFollowersModal(false)} profileId={profile._id} />
          <FollowingModal isOpen={showFollowingModal} onClose={() => setShowFollowingModal(false)} profileId={profile._id} />
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
      }
    </>
  );
}
