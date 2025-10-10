import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    limit: '',
    userType: 'customer'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

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

    // Basic validation
    if (!formData.name || !formData.email || !formData.password || !formData.phone) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (formData.userType === 'customer' && (!formData.limit || parseInt(formData.limit) < 100)) {
      setError('Credit limit must be at least 100');
      setLoading(false);
      return;
    }

    try {
      if (formData.userType === 'customer') {
        const customerData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: parseInt(formData.phone),
          limit: parseInt(formData.limit)
        };

        // Create customer account
        const signupResponse = await api.customerSignup(customerData);
        console.log('Signup successful:', signupResponse);
        
        // Show success message and redirect to login
        setError('Account created successfully! Please login with your credentials.');
        
        // Redirect to login page after a short delay
        setTimeout(() => {
          navigate('/login', { state: { fromSignup: true } });
        }, 2000);
        
      } else {
        // For merchant signup
        const merchantData = {
          name: formData.name,
          phone: parseInt(formData.phone),
          commision: 5, // Default commission
          total_earning: 0
        };

        await api.createMerchant(merchantData);
        setError('Merchant account created. Please contact support for login credentials.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Sign up for LazyPay</h2>
      {error && (
        <div className={error.includes('successfully') ? 'success' : 'error'}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>User Type</label>
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
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        {formData.userType === 'customer' && (
          <div className="form-group">
            <label>Credit Limit</label>
            <input
              type="number"
              name="limit"
              value={formData.limit}
              onChange={handleChange}
              required
              min="100"
            />
          </div>
        )}

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
          />
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-secondary)' }}>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default Signup;
