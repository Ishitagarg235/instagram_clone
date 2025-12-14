import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import CommentBox from './CommentBox';

function PostCard({ post }) {
  const [liked, setLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.comments || []);

  const handleLike = async () => {
    try {
      if (liked) {
        await axios.post(`/posts/${post._id}/unlike`);
        setLiked(false);
        setLikesCount(prev => Math.max(prev - 1, 0));
      } else {
        await axios.post(`/posts/${post._id}/like`);
        setLiked(true);
        setLikesCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleComment = async (text) => {
    try {
      await axios.post(`/posts/${post._id}/comment`, { text });

      // Optimistically update UI
      setComments(prev => [
        {
          user: { username: 'You' },
          text
        },
        ...prev
      ]);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const formatTimestamp = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diff = Math.floor((now - postDate) / 1000);

    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  return (
    <div className="post-card">
      {/* Header */}
      <div className="post-header">
        <div className="post-user-info">
          <img
            src={post.user?.profilePicture || 'https://via.placeholder.com/32'}
            alt={post.user?.username}
            className="post-avatar"
          />
          <Link to={`/profile/${post.user?.username}`} className="post-username">
            {post.user?.username}
          </Link>
        </div>
        <button className="post-options">⋯</button>
      </div>

      {/* Image */}
      <img src={post.imageUrl} alt="Post" className="post-image" />

      {/* Actions */}
      <div className="post-actions">
        <button
          onClick={handleLike}
          className={liked ? 'liked' : ''}
        >
          {liked ? '❤' : '♡'}
        </button>

        <button onClick={() => setShowComments(!showComments)}>
          💬
        </button>

        <button>➤</button>
      </div>

      {/* Likes */}
      <div className="post-likes">
        {likesCount} {likesCount === 1 ? 'like' : 'likes'}
      </div>

      {/* Caption */}
      {post.caption && (
        <div className="post-caption">
          <strong>{post.user?.username}</strong> {post.caption}
        </div>
      )}

      {/* Comments */}
      <div className="post-comments">
        {comments.length > 2 && !showComments && (
          <button
            className="view-comments"
            onClick={() => setShowComments(true)}
          >
            View all {comments.length} comments
          </button>
        )}

        {(showComments ? comments : comments.slice(0, 2)).map((comment, index) => (
          <div key={index} className="comment">
            <strong>{comment.user?.username}</strong> {comment.text}
          </div>
        ))}
      </div>

      {/* Timestamp */}
      <div className="post-timestamp">
        {formatTimestamp(post.createdAt)}
      </div>

      {/* Comment input */}
      <CommentBox onSubmit={handleComment} />
    </div>
  );
}

export default PostCard;
