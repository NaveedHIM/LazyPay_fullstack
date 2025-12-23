import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { HiOutlineUserCircle, HiOutlineMail, HiOutlinePhone, HiOutlineCreditCard, HiOutlineDocumentText, HiOutlineCheckCircle, HiOutlineClock } from 'react-icons/hi';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, transactionsData] = await Promise.all([
          api.getCustomerProfile(),
          api.getAllTransactions()
        ]);
        
        setProfile(profileData);
        setTransactions(transactionsData.filter(t => t.customer_id === user.id));
      } catch (err) {
        console.error('Dashboard error:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchData();
    } else {
      setError('User not authenticated. Please login again.');
      setLoading(false);
    }
  }, [user?.id]);

  // Early return if user is null (during logout)
  if (!user) {
    return <div className="loading">Redirecting...</div>;
  }

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <h1>
        <HiOutlineUserCircle style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
        Customer Dashboard
      </h1>
      
      <div className="dashboard">
        <div className="dashboard-card">
          <h3>
            <HiOutlineUserCircle style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
            Profile Information
          </h3>
          <div className="profile-info">
            <div>
              <HiOutlineUserCircle style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
              <strong>Name:</strong> {profile?.name}
            </div>
            <div>
              <HiOutlineMail style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
              <strong>Email:</strong> {user?.email || 'N/A'}
            </div>
            <div>
              <HiOutlinePhone style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
              <strong>Phone:</strong> {profile?.phone}
            </div>
            <div>
              <HiOutlineCreditCard style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
              <strong>Credit Limit:</strong> ₹{profile?.limit}
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>
            <HiOutlineDocumentText style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
            Recent Transactions
          </h3>
          <div className="transaction-list">
            {transactions.length === 0 ? (
              <p>No transactions yet</p>
            ) : (
              transactions.slice(0, 5).map(transaction => (
                <div key={transaction.id} className="transaction-item">
                  <div className="transaction-details">
                    <div>
                      <HiOutlineDocumentText style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                      Transaction #{transaction.id}
                    </div>
                    <div>Amount: ₹{transaction.amount}</div>
                    <div>Date: {new Date(transaction.timestamp).toLocaleDateString()}</div>
                  </div>
                  <div className={`transaction-amount ${transaction.is_repaid ? 'repaid' : ''}`}>
                    {transaction.is_repaid ? (
                      <>
                        <HiOutlineCheckCircle style={{ marginRight: '0.25rem', verticalAlign: 'middle' }} />
                        Repaid
                      </>
                    ) : (
                      <>
                        <HiOutlineClock style={{ marginRight: '0.25rem', verticalAlign: 'middle' }} />
                        Pending
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;

