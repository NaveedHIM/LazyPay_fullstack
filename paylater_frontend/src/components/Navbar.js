import React, { useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { HiOutlineViewGrid, HiOutlineDocumentText, HiOutlineLogin, HiOutlineUserAdd, HiOutlineLogout, HiOutlineUser } from 'react-icons/hi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    try {
      // Clear state first
      logout();
      
      // Use requestAnimationFrame to ensure state updates are processed
      requestAnimationFrame(() => {
        navigate('/', { replace: true });
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback: clear localStorage manually and navigate
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/', { replace: true });
    }
  }, [logout, navigate]);

  return (
    <nav className="navbar">
      <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
        <h1>LazyPay</h1>
      </Link>
      
      <div className="nav-links">
        <button 
          onClick={toggleTheme} 
          className="theme-toggle"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
        
        {user ? (
          <>
            <Link to={user.role === 'customer' ? '/customer/dashboard' : '/merchant/dashboard'}>
              <HiOutlineViewGrid style={{ marginRight: '0.25rem', verticalAlign: 'middle' }} />
              Dashboard
            </Link>
            <Link to="/transactions">
              <HiOutlineDocumentText style={{ marginRight: '0.25rem', verticalAlign: 'middle' }} />
              Transactions
            </Link>
            <span>
              <HiOutlineUser style={{ marginRight: '0.25rem', verticalAlign: 'middle' }} />
              Welcome, {user.name}
            </span>
            <button onClick={handleLogout}>
              <HiOutlineLogout style={{ marginRight: '0.25rem', verticalAlign: 'middle' }} />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              <HiOutlineLogin style={{ marginRight: '0.25rem', verticalAlign: 'middle' }} />
              Login
            </Link>
            <Link to="/signup">
              <HiOutlineUserAdd style={{ marginRight: '0.25rem', verticalAlign: 'middle' }} />
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

