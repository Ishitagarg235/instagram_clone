import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../hooks/useAuth';

function Profile() {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  const isOwnProfile = currentUser?.username === username;

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/users/${username}`);
      setProfile(response.data.user);
      setPosts(response.data.posts || []);
      setIsFollowing(response.data.user.isFollowing || false);
      setError(null);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await axios.delete(`/users/${profile._id}/follow`);
        setIsFollowing(false);
      } else {
        await axios.post(`/users/${profile._id}/follow`);
        setIsFollowing(true);
      }
      fetchProfile();
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  if (loading) return <div className="loading">Loading profile...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!profile) return <div className="error">Profile not found</div>;

  return (
    <div>
      <div className="profile-header">
        <img 
          src={profile.profilePicture || 'https://via.placeholder.com/150'} 
          alt={profile.username}
          className="profile-avatar"
        />
        
        <div className="profile-info">
          <div className="profile-username-row">
            <h2>{profile.username}</h2>
            {isOwnProfile ? (
              <button className="edit-profile-btn">Edit Profile</button>
            ) : (
              <button 
                className="edit-profile-btn"
                onClick={handleFollow}
                style={{
                  backgroundColor: isFollowing ? '#fff' : '#0095f6',
                  color: isFollowing ? '#000' : '#fff'
                }}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
          </div>

          <div className="profile-stats">
            <div className="profile-stat">
              <span>{posts.length}</span> posts
            </div>
            <div className="profile-stat">
              <span>{profile.followersCount || 0}</span> followers
            </div>
            <div className="profile-stat">
              <span>{profile.followingCount || 0}</span> following
            </div>
          </div>

          <div className="profile-bio">
            <strong>{profile.fullName}</strong>
            {profile.bio && <p>{profile.bio}</p>}
          </div>
        </div>
      </div>

      <div className="profile-posts">
        {posts.length === 0 ? (
          <div style={{ 
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '40px',
            color: '#8e8e8e'
          }}>
            No posts yet
          </div>
        ) : (
          posts.map(post => (
            <div key={post._id} className="profile-post">
              <img src={post.imageUrl} alt="Post" />
              <div className="post-overlay">
                <span>❤ {post.likesCount || 0}</span>
                <span>&#128172; {post.commentsCount || 0}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Profile;
