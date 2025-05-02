/**
 * API service for interacting with the JSON server
 */

const API_URL = 'https://finance-manager-00us.onrender.com';

// Generic API request function with error handling
async function apiRequest(endpoint, method = 'GET', data = null) {
  const url = `${API_URL}/${endpoint}`;
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  };

  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        url: url
      });
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    // For DELETE requests, we might not have a response body
    if (method === 'DELETE') {
      return { success: true };
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

export default {
  // User related API calls
  users: {
    getAll: () => apiRequest('users'),
    getById: (id) => apiRequest(`users/${id}`),
    login: (email, password) => {
      // In a real app, this would be a POST to an auth endpoint
      // For our JSON server, we'll simulate by fetching users and filtering
      return apiRequest(`users?email=${email}`).then(users => {
        const user = users[0];
        if (user && user.password === password) {
          // Remove password before returning user data
          const { password, ...userWithoutPassword } = user;
          return userWithoutPassword;
        }
        throw new Error('Invalid credentials');
      });
    },
    create: (userData) => apiRequest('users', 'POST', userData),
    update: (id, userData) => apiRequest(`users/${id}`, 'PUT', userData),
    delete: (id) => apiRequest(`users/${id}`, 'DELETE')
  },
  
  // Transaction related API calls
  transactions: {
    getAll: () => apiRequest('transactions'),
    getByUserId: (userId) => apiRequest(`transactions?userId=${userId}`),
    getById: (id) => apiRequest(`transactions/${id}`),
    create: (transactionData) => apiRequest('transactions', 'POST', transactionData),
    update: (id, transactionData) => apiRequest(`transactions/${id}`, 'PUT', transactionData),
    delete: (id) => apiRequest(`transactions/${id}`, 'DELETE')
  },
  
  // Budget related API calls
  budgets: {
    getAll: () => apiRequest('budgets'),
    getByUserId: (userId) => apiRequest(`budgets?userId=${userId}`),
    getById: (id) => apiRequest(`budgets/${id}`),
    create: (budgetData) => apiRequest('budgets', 'POST', budgetData),
    update: (id, budgetData) => apiRequest(`budgets/${id}`, 'PUT', budgetData),
    delete: (id) => apiRequest(`budgets/${id}`, 'DELETE')
  },
  
  // Category related API calls
  categories: {
    getAll: () => apiRequest('categories'),
    getById: (id) => apiRequest(`categories/${id}`),
  }
};