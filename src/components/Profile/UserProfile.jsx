// UserProfile.jsx
export default function UserProfile({ user }) {
    // Placeholder for user data. Assume `user` prop is passed down or fetched here.
    return (
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <p className="text-gray-700">{user.bio}</p>
        {/* Followers/Following Links */}
        <div className="flex justify-center space-x-4 mt-4">
          <a href="/followers" className="text-blue-500">Followers: {user.followersCount}</a>
          <a href="/following" className="text-blue-500">Following: {user.followingCount}</a>
        </div>
      </div>
    );
  }
  