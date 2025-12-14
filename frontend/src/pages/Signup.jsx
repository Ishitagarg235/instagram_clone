import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signup(
      formData.username,
      formData.email,
      formData.password,
      formData.fullName
    );
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="auth-logo">Instagram</h1>
        <p className="auth-subtitle">
          Sign up to see photos and videos from your friends.
        </p>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
          
          {error && <div className="auth-error">{error}</div>}
        </form>

        <p style={{ 
          fontSize: '12px', 
          color: '#8e8e8e',
          textAlign: 'center',
          marginTop: '16px',
          lineHeight: '1.4'
        }}>
          By signing up, you agree to our Terms, Privacy Policy and Cookies Policy.
        </p>
      </div>

      <div className="auth-switch">
        Have an account? <Link to="/login">Log in</Link>
      </div>
    </div>
  );
}

export default Signup;