import { useState } from 'react';

function CommentBox({ onSubmit }) {
  const [text, setText] = useState('');

  const handleSubmit = async () => {
    if (text.trim()) {
      await onSubmit(text);
      setText('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="comment-input-wrapper">
      <input
        type="text"
        placeholder="Add a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button 
        onClick={handleSubmit}
        disabled={!text.trim()}
      >
        Post
      </button>
    </div>
  );
}

export default CommentBox;