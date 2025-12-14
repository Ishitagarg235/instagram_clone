import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
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
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
          
          {error && <div className="auth-error">{error}</div>}
        </form>

        <div className="auth-divider">OR</div>

        <div style={{ 
          textAlign: 'center', 
          color: '#00376b',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          Log in with Facebook
        </div>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '16px',
          fontSize: '12px'
        }}>
          <a href="#" style={{ color: '#00376b', textDecoration: 'none' }}>
            Forgot password?
          </a>
        </div>
      </div>

      <div className="auth-switch">
        Don't have an account? <Link to="/signup">Sign up</Link>
      </div>
    </div>
  );
}

export default Login;