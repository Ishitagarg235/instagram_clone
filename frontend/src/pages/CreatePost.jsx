import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

function CreatePost() {
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageUrl.trim()) {
      setError('Image URL is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axios.post('/posts', {
        imageUrl,
        caption
      });

      navigate('/');
    } catch (err) {
      console.error('Error creating post:', err);
      setError(err.response?.data?.detail || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-container">
      <h2>Create New Post</h2>

      <form className="create-post-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Image URL</label>
          <input
            type="text"
            placeholder="Paste image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
          />
        </div>

        {imageUrl && (
          <img
            src={imageUrl}
            alt="Preview"
            className="image-preview"
            onError={(e) => (e.target.style.display = 'none')}
          />
        )}

        <div className="form-group">
          <label>Caption</label>
          <textarea
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>

        {error && <div className="auth-error">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? 'Posting...' : 'Share Post'}
        </button>
      </form>
    </div>
  );
}

export default CreatePost;
