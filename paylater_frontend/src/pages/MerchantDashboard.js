import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const MerchantDashboard = () => {
  const { user } = useAuth();
  const [merchants, setMerchants] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commission, setCommission] = useState('');
  const [updatingCommission, setUpdatingCommission] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [merchantsData, transactionsData] = await Promise.all([
          api.getAllMerchants(),
          api.getAllTransactions()
        ]);
        
        setMerchants(merchantsData);
        setTransactions(transactionsData);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCommissionUpdate = async (merchantId, newCommission) => {
    setUpdatingCommission(true);
    try {
      await api.updateMerchantCommission(merchantId, parseInt(newCommission));
      // Refresh merchants data
      const merchantsData = await api.getAllMerchants();
      setMerchants(merchantsData);
      setCommission('');
    } catch (err) {
      setError('Failed to update commission');
    } finally {
      setUpdatingCommission(false);
    }
  };

  // Early return if user is null (during logout)
  if (!user) {
    return <div className="loading">Redirecting...</div>;
  }

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  const merchantTransactions = transactions.filter(t => 
    merchants.some(m => m.id === t.merchant_id)
  );

  return (
    <div>
      <h1>Merchant Dashboard</h1>
      
      <div className="dashboard">
        <div className="dashboard-card">
          <h3>Merchants</h3>
          {merchants.map(merchant => (
            <div key={merchant.id} className="transaction-item">
              <div className="transaction-details">
                <div><strong>{merchant.name}</strong></div>
                <div>Phone: {merchant.phone}</div>
                <div>Commission: {merchant.commision}%</div>
                <div>Total Earnings: ₹{merchant.total_earning}</div>
              </div>
              <div>
                <input
                  type="number"
                  placeholder="New commission %"
                  value={commission}
                  onChange={(e) => setCommission(e.target.value)}
                  style={{ width: '120px', marginRight: '10px' }}
                />
                <button
                  className="btn btn-secondary"
                  onClick={() => handleCommissionUpdate(merchant.id, commission)}
                  disabled={updatingCommission || !commission}
                >
                  Update
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="dashboard-card">
          <h3>Recent Transactions</h3>
          <div className="transaction-list">
            {merchantTransactions.length === 0 ? (
              <p>No transactions yet</p>
            ) : (
              merchantTransactions.slice(0, 5).map(transaction => (
                <div key={transaction.id} className="transaction-item">
                  <div className="transaction-details">
                    <div>Transaction #{transaction.id}</div>
                    <div>Amount: ₹{transaction.amount}</div>
                    <div>Date: {new Date(transaction.timestamp).toLocaleDateString()}</div>
                  </div>
                  <div className={`transaction-amount ${transaction.is_repaid ? 'repaid' : ''}`}>
                    {transaction.is_repaid ? 'Repaid' : 'Pending'}
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

export default MerchantDashboard;

