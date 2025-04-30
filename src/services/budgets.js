/**
 * Budgets service for handling budget data
 */

import api from './api';

// Get all budgets for a user
const getUserBudgets = async (userId) => {
  try {
    return await api.budgets.getByUserId(userId);
  } catch (error) {
    console.error('Failed to fetch user budgets:', error);
    throw error;
  }
};

// Create a new budget
const createBudget = async (budgetData) => {
  try {
    return await api.budgets.create(budgetData);
  } catch (error) {
    console.error('Failed to create budget:', error);
    throw error;
  }
};

// Update an existing budget
const updateBudget = async (id, budgetData) => {
  try {
    return await api.budgets.update(id, budgetData);
  } catch (error) {
    console.error('Failed to update budget:', error);
    throw error;
  }
};

// Delete a budget
const deleteBudget = async (id) => {
  try {
    return await api.budgets.delete(id);
  } catch (error) {
    console.error('Failed to delete budget:', error);
    throw error;
  }
};

// Calculate budget progress
const calculateBudgetProgress = (budgets, transactions) => {
  return budgets.map(budget => {
    // Filter transactions for the current budget's category and month/year
    const relevantTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const transactionMonth = transactionDate.getMonth() + 1; // JavaScript months are 0-indexed
      const transactionYear = transactionDate.getFullYear();
      
      return (
        transaction.category === budget.category &&
        transaction.type === 'Debit' &&
        transactionMonth === budget.month &&
        transactionYear === budget.year
      );
    });
    
    // Calculate total spent
    const spent = relevantTransactions.reduce((total, transaction) => total + transaction.amount, 0);
    
    // Calculate percentage
    const percentage = budget.budgeted > 0 ? Math.round((spent / budget.budgeted) * 100) : 0;
    
    return {
      ...budget,
      spent,
      percentage,
      remaining: budget.budgeted - spent
    };
  });
};

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
};

export {
  getUserBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
  calculateBudgetProgress,
  formatCurrency
};