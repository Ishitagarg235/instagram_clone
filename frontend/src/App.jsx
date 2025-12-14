import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import Feed from './pages/Feed';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import CreatePost from './pages/CreatePost';
import './styles/main.css';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="loading">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="loading">Loading...</div>;
  return !user ? children : <Navigate to="/" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />

          <Route path="/signup" element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          } />

          <Route path="/" element={
            <PrivateRoute>
              <>
                <Navbar />
                <div className="main-content">
                  <Feed />
                </div>
              </>
            </PrivateRoute>
          } />

          <Route path="/create" element={
            <PrivateRoute>
              <>
                <Navbar />
                <div className="main-content">
                  <CreatePost />
                </div>
              </>
            </PrivateRoute>
          } />

          <Route path="/profile/:username" element={
            <PrivateRoute>
              <>
                <Navbar />
                <div className="main-content container">
                  <Profile />
                </div>
              </>
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
