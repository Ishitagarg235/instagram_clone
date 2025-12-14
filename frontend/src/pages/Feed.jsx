import { useState, useEffect } from 'react';
import axios from '../api/axios';
import PostCard from '../components/PostCard';

function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/feed');
      setPosts(response.data.posts || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        Loading posts...
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        {error}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="feed">
        <div
          style={{
            textAlign: 'center',
            padding: '40px',
            color: '#8e8e8e'
          }}
        >
          <p>No posts yet. Follow some users to see their posts!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="feed">
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
        />
      ))}
    </div>
  );
}

export default Feed;
