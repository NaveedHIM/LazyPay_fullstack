import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { HiOutlineLogin, HiOutlineUser, HiOutlineLockClosed, HiOutlineMail, HiOutlineCheckCircle } from 'react-icons/hi';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'customer'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user was redirected from signup
    if (location.state?.fromSignup) {
      setSuccessMessage('Account created successfully! Please login with your credentials.');
    }
  }, [location.state]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (formData.userType === 'customer') {
        const response = await api.customerLogin(formData.email, formData.password);
        
        // Store token in localStorage first
        localStorage.setItem('token', response.access_token);
        
        // Now fetch user profile with the token
        const userData = await api.getCustomerProfile();
        
        login({
          id: userData.id,
          name: userData.name,
          email: formData.email,
          role: 'customer'
        }, response.access_token);
        
        navigate('/customer/dashboard');
      } else {
        // For merchant login, we'll need to implement merchant authentication
        // For now, we'll create a simple merchant login flow
        setError('Merchant login not implemented yet. Please contact support.');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <HiOutlineLogin style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary)' }} />
      <h2>Login to LazyPay</h2>
      {successMessage && (
        <div className="success">
          <HiOutlineCheckCircle style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
          {successMessage}
        </div>
      )}
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
        <br />
        
          <label>
            <HiOutlineUser style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
            User Type
          </label>
          <select 
            name="userType" 
            value={formData.userType} 
            onChange={handleChange}
            required
          >
            <option value="customer">Customer</option>
            <option value="merchant">Merchant</option>
          </select>
        </div>

        <div className="form-group">
          <label>
            <HiOutlineMail style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>
            <HiOutlineLockClosed style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn" disabled={loading}>
          <HiOutlineLogin style={{ marginRight: '0.5rem' }} />
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-secondary)' }}>
        Don't have an account? <Link to="/signup">Sign up here</Link>
      </p>
    </div>
  );
};

export default Login;
