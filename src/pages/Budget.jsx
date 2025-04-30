import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserBudgets, createBudget, updateBudget, deleteBudget, calculateBudgetProgress, formatCurrency } from '../services/budgets';
import { getUserTransactions } from '../services/transactions';
import '../assets/styles/budget.css';

const Budget = () => {
  const { currentUser } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [budgetProgress, setBudgetProgress] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newBudget, setNewBudget] = useState({
    category: '',
    budgeted: '',
    month: new Date().getMonth() + 1, // Current month (1-12)
    year: new Date().getFullYear()
  });
  const [editingBudget, setEditingBudget] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch budgets, transactions, and categories when component mounts
  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch user's budgets
        const userBudgets = await getUserBudgets(currentUser.id);
        setBudgets(userBudgets);
        
        // Fetch user's transactions
        const userTransactions = await getUserTransactions(currentUser.id);
        setTransactions(userTransactions);
        
        // Extract unique categories from transactions
        const uniqueCategories = [...new Set(userTransactions
          .filter(t => t.type === 'Debit') // Only expense categories
          .map(t => t.category))];
        setCategories(uniqueCategories);
        
        // Calculate budget progress
        const progress = calculateBudgetProgress(userBudgets, userTransactions);
        setBudgetProgress(progress);
      } catch (err) {
        console.error('Error fetching budget data:', err);
        setError('Failed to load budget data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [currentUser]);

  // Handle input change for new budget form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBudget({
      ...newBudget,
      [name]: name === 'budgeted' ? parseFloat(value) || '' : value
    });
  };

  // Handle form submission for creating/updating budget
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newBudget.category || !newBudget.budgeted) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const budgetData = {
        ...newBudget,
        userId: currentUser.id
      };
      
      let updatedBudget;
      
      if (editingBudget) {
        // Update existing budget
        updatedBudget = await updateBudget(editingBudget.id, budgetData);
        
        // Update budgets state
        setBudgets(budgets.map(budget => 
          budget.id === editingBudget.id ? updatedBudget : budget
        ));
      } else {
        // Create new budget
        updatedBudget = await createBudget(budgetData);
        
        // Add to budgets state
        setBudgets([...budgets, updatedBudget]);
      }
      
      // Reset form
      setNewBudget({
        category: '',
        budgeted: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
      });
      setEditingBudget(null);
      setShowForm(false);
      
      // Recalculate budget progress
      const progress = calculateBudgetProgress(
        editingBudget 
          ? budgets.map(budget => budget.id === editingBudget.id ? updatedBudget : budget)
          : [...budgets, updatedBudget], 
        transactions
      );
      setBudgetProgress(progress);
    } catch (err) {
      console.error('Error saving budget:', err);
      setError('Failed to save budget. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle editing a budget
  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setNewBudget({
      category: budget.category,
      budgeted: budget.budgeted,
      month: budget.month,
      year: budget.year
    });
    setShowForm(true);
  };

  // Handle deleting a budget
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this budget?')) return;
    
    try {
      setLoading(true);
      await deleteBudget(id);
      
      // Remove from state
      const updatedBudgets = budgets.filter(budget => budget.id !== id);
      setBudgets(updatedBudgets);
      
      // Recalculate budget progress
      const progress = calculateBudgetProgress(updatedBudgets, transactions);
      setBudgetProgress(progress);
    } catch (err) {
      console.error('Error deleting budget:', err);
      setError('Failed to delete budget. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get progress bar color based on percentage
  const getProgressColor = (percentage) => {
    if (percentage <= 50) return 'progress-bar-safe';
    if (percentage <= 85) return 'progress-bar-warning';
    return 'progress-bar-danger';
  };

  if (!currentUser) {
    return (
      <div className="budget-container">
        <div className="placeholder-message">
          <h2>Please log in to view your budgets</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="budget-container p-4">
      <header className="page-header mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Budget Planner</h1>
        <p className="text-gray-600">Set monthly limits and track your spending</p>
      </header>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Monthly Budgets</h2>
        <button 
          onClick={() => {
            setEditingBudget(null);
            setNewBudget({
              category: '',
              budgeted: '',
              month: new Date().getMonth() + 1,
              year: new Date().getFullYear()
            });
            setShowForm(!showForm);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          {showForm ? 'Cancel' : 'Add Budget'}
        </button>
      </div>
      
      {showForm && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6 shadow-sm">
          <h3 className="text-lg font-medium mb-3">
            {editingBudget ? 'Edit Budget' : 'Create New Budget'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={newBudget.category}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Budget Amount</label>
                <input
                  type="number"
                  name="budgeted"
                  value={newBudget.budgeted}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                <select
                  name="month"
                  value={newBudget.month}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(0, i).toLocaleString('default', { month: 'long' })}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <select
                  name="year"
                  value={newBudget.year}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                >
                  {Array.from({ length: 5 }, (_, i) => {
                    const year = new Date().getFullYear() - 2 + i;
                    return <option key={year} value={year}>{year}</option>;
                  })}
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                disabled={loading}
              >
                {loading ? 'Saving...' : (editingBudget ? 'Update Budget' : 'Create Budget')}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {loading && !budgetProgress.length ? (
        <div className="text-center py-8">
          <p>Loading budgets...</p>
        </div>
      ) : budgetProgress.length === 0 ? (
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <p className="text-gray-600">You haven't set up any budgets yet.</p>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Create Your First Budget
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {budgetProgress.map(budget => (
            <div key={budget.id} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-800">{budget.category}</h3>
                <div className="text-sm text-gray-500">
                  {new Date(0, budget.month - 1).toLocaleString('default', { month: 'long' })} {budget.year}
                </div>
              </div>
              
              <div className="flex justify-between text-sm mb-1">
                <div>
                  <span className="font-medium">{formatCurrency(budget.spent)}</span>
                  <span className="text-gray-500"> spent of </span>
                  <span className="font-medium">{formatCurrency(budget.budgeted)}</span>
                </div>
                <div className="font-medium">
                  {budget.percentage}%
                </div>
              </div>
              
              <div className="progress-bar-container mb-2">
                <div 
                  className={`progress-bar ${getProgressColor(budget.percentage)}`} 
                  style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-sm">
                <div className="text-gray-500">
                  {formatCurrency(budget.remaining)} remaining
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEdit(budget)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(budget.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Budget;