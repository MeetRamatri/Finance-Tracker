/**
 * Transactions service for handling transaction data
 */

import api from './api';

// Get all transactions for a user
const getUserTransactions = async (userId) => {
  try {
    return await api.transactions.getByUserId(userId);
  } catch (error) {
    console.error('Failed to fetch user transactions:', error);
    throw error;
  }
};

// Create a new transaction
const createTransaction = async (transaction) => {
  try {
    console.log('Sending transaction to server:', transaction);
    
    // Make sure transaction has all required fields
    const formattedTransaction = {
      ...transaction,
      // Add userId if not present
      userId: transaction.userId || 1,
      // Ensure date is in ISO format
      date: transaction.date || new Date().toISOString(),
      // Ensure amount is a number
      amount: parseFloat(transaction.amount) || 0,
      // Add id if not present (some JSON servers require this)
      id: transaction.id || Date.now()
    };
    
    console.log('Formatted transaction:', formattedTransaction);
    
    const response = await fetch('http://localhost:3001/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedTransaction),
    });
    
    console.log('Server response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server error response:', errorText);
      throw new Error(`Failed to create transaction: ${response.status} ${errorText}`);
    }
    
    const result = await response.json();
    console.log('Transaction created successfully:', result);
    return result;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
};

// Update an existing transaction
const updateTransaction = async (id, transactionData) => {
  try {
    return await api.transactions.update(id, transactionData);
  } catch (error) {
    console.error('Failed to update transaction:', error);
    throw error;
  }
};

// Delete a transaction
const deleteTransaction = async (id) => {
  try {
    return await api.transactions.delete(id);
  } catch (error) {
    console.error('Failed to delete transaction:', error);
    throw error;
  }
};

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
};

// Format date
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-IN', options);
};

// Filter transactions based on criteria
const filterTransactions = (transactions, filters) => {
  return transactions.filter(transaction => {
    // Search term filter
    if (filters.search && !transaction.description.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    // Category filter
    if (filters.category !== 'all') {
      if (Array.isArray(filters.category)) {
        if (!filters.category.includes(transaction.category)) {
          return false;
        }
      } else if (transaction.category !== filters.category) {
        return false;
      }
    }
    
    // Type filter
    if (filters.type !== 'all' && transaction.type !== filters.type) {
      return false;
    }
    
    // Date range filter
    if (filters.startDate && new Date(transaction.date) < new Date(filters.startDate)) {
      return false;
    }
    if (filters.endDate && new Date(transaction.date) > new Date(filters.endDate)) {
      return false;
    }
    
    // Amount range filter
    if (filters.minAmount && transaction.amount < parseFloat(filters.minAmount)) {
      return false;
    }
    if (filters.maxAmount && transaction.amount > parseFloat(filters.maxAmount)) {
      return false;
    }
    
    return true;
  });
};

// Get unique categories from transactions
const getCategories = async () => {
  try {
    const categories = await api.categories.getAll();
    return categories;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    throw error;
  }
};

// Calculate totals from transactions
const calculateTotals = (transactions) => {
  const income = transactions
    .filter(t => t.type === 'Credit')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const expenses = transactions
    .filter(t => t.type === 'Debit')
    .reduce((sum, t) => sum + t.amount, 0);
    
  return {
    income,
    expenses,
    balance: income - expenses,
    savingsRate: income > 0 ? ((income - expenses) / income * 100).toFixed(1) : 0
  };
};

export {
  getUserTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  formatCurrency,
  formatDate,
  filterTransactions,
  getCategories,
  calculateTotals
};