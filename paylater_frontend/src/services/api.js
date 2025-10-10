const API_BASE_URL = 'http://localhost:8000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        // Handle different error response formats
        let errorMessage = 'An error occurred';
        
        if (data.detail) {
          if (Array.isArray(data.detail)) {
            // Handle validation errors array
            errorMessage = data.detail.map(err => err.msg || err.message || err).join(', ');
          } else {
            errorMessage = data.detail;
          }
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.error) {
          errorMessage = data.error;
        }
        
        throw new Error(errorMessage);
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Authentication
  async customerSignup(userData) {
    return this.request('/customer/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async customerLogin(email, password) {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    
    return this.request('/customer/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });
  }

  // Customer
  async getCustomerProfile() {
    return this.request('/customer/protected');
  }

  async getAllCustomers() {
    return this.request('/customer/');
  }

  // Merchant
  async createMerchant(merchantData) {
    return this.request('/merchant/', {
      method: 'POST',
      body: JSON.stringify(merchantData),
    });
  }

  async getAllMerchants() {
    return this.request('/merchant/');
  }

  async updateMerchantCommission(merchantId, commission) {
    return this.request(`/merchant/${merchantId}/commision`, {
      method: 'PATCH',
      body: JSON.stringify({ commision: commission }),
    });
  }

  // Transactions
  async createTransaction(transactionData) {
    return this.request('/transaction/pay', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    });
  }

  async repayTransaction(transactionId) {
    return this.request('/transaction/repay', {
      method: 'POST',
      body: JSON.stringify({ transaction_id: transactionId }),
    });
  }

  async getAllTransactions() {
    return this.request('/transaction/');
  }
}

export default new ApiService();
