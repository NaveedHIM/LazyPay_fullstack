import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-container">
      <h1>Welcome to LazyPay</h1>
      <p>Your trusted PayLater service for seamless transactions</p>
      
      {user ? (
        <div className="home-buttons">
          <Link 
            to={user.role === 'customer' ? '/customer/dashboard' : '/merchant/dashboard'}
            className="btn"
          >
            Go to Dashboard
          </Link>
          <Link to="/transactions" className="btn btn-secondary">
            View Transactions
          </Link>
        </div>
      ) : (
        <div className="home-buttons">
          <Link to="/login" className="btn">
            Login
          </Link>
          <Link to="/signup" className="btn btn-secondary">
            Sign Up
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;

