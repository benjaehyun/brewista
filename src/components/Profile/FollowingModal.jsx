import React, { useState, useEffect } from 'react';

export default function FollowingModal({ isOpen, onClose, userId }) {
  const [following, setFollowing] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchFollowing = async () => {
        setIsLoading(true);
        try {
        //   const response = await fetch(`/api/following/${userId}`);
        //   const data = await response.json();
        //   setFollowing(data.following);
        } catch (error) {
          console.error("Failed to fetch following", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchFollowing();
    }
  }, [isOpen, userId]);

  return (
    <div className={`fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center ${isOpen ? '' : 'hidden'}`}>
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
        <button onClick={onClose} className="float-right font-bold">X</button>
        <h2 className="text-lg font-semibold">Following</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {following.map(following => (
              <li key={following.id} className="border-b border-gray-200 p-2">
                {following.displayName}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
