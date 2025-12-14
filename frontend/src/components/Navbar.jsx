import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-logo">
          Instagram
        </Link>

        <div className="navbar-search">
          <input type="text" placeholder="Search" />
        </div>

        <div className="navbar-links">
          <Link to="/" title="Home">
            &#8962;
          </Link>
          <Link to="/create" title="Create Post">
            &#10010;
          </Link>
          {user && (
          <Link to={`/profile/${user?.username}`} title="Profile">
            &#128100;
          </Link>
          )}
          <button onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;