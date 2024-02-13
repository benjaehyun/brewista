import React, { useState, useEffect } from 'react';
import * as profilesApi from "../../utilities/profiles-api"

export default function FollowersModal({ isOpen, onClose, profileId }) {
  const [followers, setFollowers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchFollowers = async () => {
        setIsLoading(true);
        try {
            const data = await profilesApi.getFollowers(profileId)
            setFollowers(data.followers);
        } catch (error) {
            console.error("Failed to fetch followers", error);
        } finally {
            setIsLoading(false);
        }
      };

      fetchFollowers();
    }
  }, [isOpen, userId]);

  return (
    <div className={`fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center ${isOpen ? '' : 'hidden'}`}>
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
        <button onClick={onClose} className="float-right font-bold">X</button>
        <h2 className="text-lg font-semibold">Followers</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {followers.map(follower => (
              <li key={follower.id} className="border-b border-gray-200 p-2">
                {follower.displayName}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
