import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { HiOutlineSparkles, HiOutlineCreditCard, HiOutlineLogin, HiOutlineUserAdd, HiOutlineViewGrid, HiOutlineDocumentText } from 'react-icons/hi';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-container">
      <HiOutlineSparkles style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--primary)' }} />
      <h1>Welcome to LazyPay</h1>
      <p>Your trusted PayLater service for seamless transactions</p>
      
      {user ? (
        <div className="home-buttons">
          <Link 
            to={user.role === 'customer' ? '/customer/dashboard' : '/merchant/dashboard'}
            className="btn"
          >
            <HiOutlineViewGrid style={{ marginRight: '0.5rem' }} />
            Go to Dashboard
          </Link>
          <Link to="/transactions" className="btn btn-secondary">
            <HiOutlineDocumentText style={{ marginRight: '0.5rem' }} />
            View Transactions
          </Link>
        </div>
      ) : (
        <div className="home-buttons">
          <Link to="/login" className="btn">
            <HiOutlineLogin style={{ marginRight: '0.5rem' }} />
            Login
          </Link>
          <Link to="/signup" className="btn btn-secondary">
            <HiOutlineUserAdd style={{ marginRight: '0.5rem' }} />
            Sign Up
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;

