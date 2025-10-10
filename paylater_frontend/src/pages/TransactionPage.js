import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const TransactionPage = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // For new transaction
  const [newTransaction, setNewTransaction] = useState({
    merchant_id: '',
    amount: ''
  });
  const [creatingTransaction, setCreatingTransaction] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transactionsData, merchantsData] = await Promise.all([
          api.getAllTransactions(),
          api.getAllMerchants()
        ]);
        
        setTransactions(transactionsData);
        setMerchants(merchantsData);
      } catch (err) {
        setError('Failed to load transaction data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateTransaction = async (e) => {
    e.preventDefault();
    setCreatingTransaction(true);
    
    try {
      const transactionData = {
        customer_id: user.id,
        merchant_id: parseInt(newTransaction.merchant_id),
        amount: parseInt(newTransaction.amount)
      };

      await api.createTransaction(transactionData);
      
      // Refresh transactions
      const transactionsData = await api.getAllTransactions();
      setTransactions(transactionsData);
      
      setNewTransaction({ merchant_id: '', amount: '' });
    } catch (err) {
      setError('Failed to create transaction');
    } finally {
      setCreatingTransaction(false);
    }
  };

  const handleRepayTransaction = async (transactionId) => {
    try {
      await api.repayTransaction(transactionId);
      
      // Refresh transactions
      const transactionsData = await api.getAllTransactions();
      setTransactions(transactionsData);
    } catch (err) {
      setError('Failed to repay transaction: ' + (err.message || 'Unknown error'));
    }
  };

  // Early return if user is null (during logout)
  if (!user) {
    return <div className="loading">Redirecting...</div>;
  }

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  // Filter transactions based on user role
  const userTransactions = user.role === 'customer' 
    ? transactions.filter(t => t.customer_id === user.id)
    : transactions; // Merchants see all transactions

  return (
    <div>
      <h1>Transactions</h1>
      
      {user.role === 'customer' && (
        <div className="dashboard-card" style={{ marginBottom: '2rem' }}>
          <h3>Make a Purchase</h3>
          <form onSubmit={handleCreateTransaction}>
            <div className="form-group">
              <label>Select Merchant</label>
              <select
                name="merchant_id"
                value={newTransaction.merchant_id}
                onChange={(e) => setNewTransaction({
                  ...newTransaction,
                  merchant_id: e.target.value
                })}
                required
              >
                <option value="">Choose a merchant</option>
                {merchants.map(merchant => (
                  <option key={merchant.id} value={merchant.id}>
                    {merchant.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Amount</label>
              <input
                type="number"
                name="amount"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction({
                  ...newTransaction,
                  amount: e.target.value
                })}
                required
                min="1"
              />
            </div>

            <button 
              type="submit" 
              className="btn" 
              disabled={creatingTransaction}
            >
              {creatingTransaction ? 'Processing...' : 'Make Purchase'}
            </button>
          </form>
        </div>
      )}

      <div className="dashboard-card">
        <h3>Transaction History</h3>
        <div className="transaction-list">
          {userTransactions.length === 0 ? (
            <p>No transactions found</p>
          ) : (
            userTransactions.map(transaction => {
              const merchant = merchants.find(m => m.id === transaction.merchant_id);
              return (
                <div key={transaction.id} className="transaction-item">
                  <div className="transaction-details">
                    <div><strong>Transaction #{transaction.id}</strong></div>
                    {user.role === 'customer' ? (
                      <div>Merchant: {merchant?.name || 'Unknown'}</div>
                    ) : (
                      <div>Customer ID: {transaction.customer_id}</div>
                    )}
                    <div>Amount: ₹{transaction.amount}</div>
                    <div>Date: {new Date(transaction.timestamp).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className={`transaction-amount ${transaction.is_repaid ? 'repaid' : ''}`}>
                      {transaction.is_repaid ? 'Repaid' : 'Pending'}
                    </div>
                    {!transaction.is_repaid && user.role === 'customer' && (
                      <button
                        className="btn btn-success"
                        onClick={() => handleRepayTransaction(transaction.id)}
                        style={{ marginTop: '0.5rem' }}
                      >
                        Repay Now
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionPage;
