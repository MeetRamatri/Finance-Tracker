import React, { useState, useEffect, useRef } from 'react';
import '../assets/styles/Transactions.css';
import { transactionsData, formatDate, formatCurrency, getCategories, filterTransactions } from '../utils/transactionsData';
import { createTransaction } from '../services/transactions';
import TransactionModal from '../components/TransactionModal';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const filterPanelRef = useRef(null);
  
  // Add these new state variables for the form
  const [showForm, setShowForm] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    category: '',
    amount: '',
    type: 'Debit'
  });

  // Initialize data
  useEffect(() => {
    setTransactions(transactionsData);
    setCategories(getCategories());
  }, []);
  
  // Handle adding a new transaction
  const handleAddTransaction = async (newTransaction) => {
    try {
      // Add userId to the transaction (using 1 as default since we don't have auth context here)
      const transactionWithUserId = { ...newTransaction, userId: 1 };
      
      // Save to database
      const savedTransaction = await createTransaction(transactionWithUserId);
      
      // Update local state with the saved transaction
      setTransactions([savedTransaction, ...transactions]);
    } catch (error) {
      console.error('Failed to add transaction:', error);
      alert('Failed to add transaction. Please try again.');
    }
  };
  
  // Toggle modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle filter changes
  const applyFilters = () => {
    const filters = {
      search: searchTerm,
      category: categoryFilter === 'all' ? 'all' : 
               (selectedCategories.length > 0 ? selectedCategories : categoryFilter),
      type: typeFilter,
      dateRange: dateRange !== 'all' && dateRange !== 'custom' ? dateRange : null,
      startDate: dateRange === 'custom' ? startDate : null,
      endDate: dateRange === 'custom' ? endDate : null,
      minAmount: minAmount ? parseFloat(minAmount) : undefined,
      maxAmount: maxAmount ? parseFloat(maxAmount) : undefined
    };
    return filterTransactions(transactions, filters);
  };
  
  // Toggle advanced filters
  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
  };
  
  // Handle category selection in multi-select mode
  const handleCategorySelection = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(cat => cat !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setSelectedCategories([]);
    setTypeFilter('all');
    setDateRange('all');
    setStartDate('');
    setEndDate('');
    setMinAmount('');
    setMaxAmount('');
  };

  // Sort transactions
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Get sorted and filtered transactions
  const getSortedTransactions = () => {
    const filteredTransactions = applyFilters();
    return [...filteredTransactions].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  // Get sort indicator
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  const sortedTransactions = getSortedTransactions();

  return (
    <div className="transactions-container">
      <header className="page-header bg-slate-50 p-6 rounded-lg shadow-sm mb-6">
        <h1 className="text-slate-800 font-bold">Transactions</h1>
        <p className="text-slate-600">View and manage your financial transactions</p>
      </header>
      
      <section className="transactions-controls">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-slate-700">Transaction List</h2>
        </div>
        
        {/* Replace the old Add Transaction button with this */}
        <div className="flex justify-end mb-2">  
          <button 
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-md flex items-center transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            {showForm ? 'Cancel' : 'Add Transaction'}
          </button>
        </div>
        
        {/* Add the form */}
        {showForm && (
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-medium mb-3">Add New Transaction</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleAddTransaction(newTransaction);
              setShowForm(false);
              setNewTransaction({
                date: new Date().toISOString().split('T')[0],
                description: '',
                category: '',
                amount: '',
                type: 'Debit'
              });
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={newTransaction.date}
                    onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                    className="w-full p-2 border border-slate-300 rounded"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                    className="w-full p-2 border border-slate-300 rounded"
                    placeholder="e.g., Grocery shopping"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={newTransaction.category}
                    onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                    className="w-full p-2 border border-slate-300 rounded"
                    placeholder="e.g., Food, Transportation"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                  <input
                    type="number"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                    className="w-full p-2 border border-slate-300 rounded"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Transaction Type</label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="type"
                        value="Debit"
                        checked={newTransaction.type === 'Debit'}
                        onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value})}
                        className="form-radio text-slate-700"
                      />
                      <span className="ml-2 text-slate-700">Expense (Debit)</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="type"
                        value="Credit"
                        checked={newTransaction.type === 'Credit'}
                        onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value})}
                        className="form-radio text-slate-700"
                      />
                      <span className="ml-2 text-slate-700">Income (Credit)</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded"
                >
                  Add Transaction
                </button>
              </div>
            </form>
          </div>
        )}
        
        <div className="search-filter-container">
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search by description, category, amount..." 
              className="search-input focus:ring-2 focus:ring-slate-500 focus:outline-none w-full" 
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button 
              className="filter-toggle-btn bg-slate-700 text-white px-3 py-2 rounded-md hover:bg-slate-600 transition-colors ml-2"
              onClick={toggleAdvancedFilters}
            >
              <span>{showAdvancedFilters ? 'Hide Filters' : 'Show Filters'}</span>
            </button>
            <button 
              className="clear-filters-btn bg-slate-200 text-slate-800 px-3 py-2 rounded-md hover:bg-slate-300 transition-colors ml-2"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
          
          {showAdvancedFilters && (
            <div className="advanced-filters bg-white p-4 rounded-lg shadow-md mt-3" ref={filterPanelRef}>
              <div className="filter-section">
                <h3 className="text-slate-700 font-medium mb-2">Filter By Category</h3>
                <div className="category-options" style={{color:'black'}}>
                  <div className="mb-2">
                    <select 
                      className="filter-select border border-slate-300 focus:ring-2 focus:ring-slate-500 focus:outline-none text-black w-full"
                      style={{color:'black'}}
                      value={categoryFilter}
                      onChange={(e) => {
                        setCategoryFilter(e.target.value);
                        setSelectedCategories([]);
                      }}
                    >
                      <option value="all">All Categories</option>
                      <option value="multi">Multiple Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category} >{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  {categoryFilter === 'multi' && (
                    <div className="multi-select-categories">
                      <div className="category-checkboxes grid grid-cols-2 gap-2">
                        {categories.map(category => (
                          <div key={category} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`category-${category}`}
                              checked={selectedCategories.includes(category)}
                              onChange={() => handleCategorySelection(category)}
                              className="mr-2"
                            />
                            <label htmlFor={`category-${category}`} className="text-sm text-slate-700">
                              {category}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="filter-section mt-4">
                <h3 className="text-slate-700 font-medium mb-2">Filter By Type</h3>
                <select 
                  className="filter-select border border-slate-300 focus:ring-2 focus:ring-slate-500 focus:outline-none text-black w-full"
                  style={{color:'black'}}
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="Credit">Credit</option>
                  <option value="Debit">Debit</option>
                </select>
              </div>
              
              <div className="filter-section mt-4">
                <h3 className="text-slate-700 font-medium mb-2">Filter By Date</h3>
                <select 
                  className="date-select border border-slate-300 focus:ring-2 focus:ring-slate-500 focus:outline-none text-black w-full mb-2"
                  style={{color:'black'}}
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option value="all">All Time</option>
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="90days">Last 90 Days</option>
                  <option value="thisMonth">This Month</option>
                  <option value="lastMonth">Last Month</option>
                  <option value="thisYear">This Year</option>
                  <option value="custom">Custom Range</option>
                </select>
                
                {dateRange === 'custom' && (
                  <div className="custom-date-range flex flex-col sm:flex-row gap-2">
                    <div className="flex-1">
                      <label className="text-sm text-slate-600 block mb-1">Start Date</label>
                      <input 
                        type="date" 
                        className="border border-slate-300 rounded-md p-2 w-full focus:ring-2 focus:ring-slate-500 focus:outline-none"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm text-slate-600 block mb-1">End Date</label>
                      <input 
                        type="date" 
                        className="border border-slate-300 rounded-md p-2 w-full focus:ring-2 focus:ring-slate-500 focus:outline-none"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="filter-section mt-4">
                <h3 className="text-slate-700 font-medium mb-2">Filter By Amount</h3>
                <div className="amount-range flex flex-col sm:flex-row gap-2">
                  <div className="flex-1">
                    <label className="text-sm text-slate-600 block mb-1">Min Amount</label>
                    <input 
                      type="number" 
                      placeholder="0" 
                      className="border border-slate-300 rounded-md p-2 w-full focus:ring-2 focus:ring-slate-500 focus:outline-none"
                      value={minAmount}
                      onChange={(e) => setMinAmount(e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm text-slate-600 block mb-1">Max Amount</label>
                    <input 
                      type="number" 
                      placeholder="9999" 
                      className="border border-slate-300 rounded-md p-2 w-full focus:ring-2 focus:ring-slate-500 focus:outline-none"
                      value={maxAmount}
                      onChange={(e) => setMaxAmount(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      
      <section className="transactions-list">
        <div className="transactions-table bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full border-collapse">
            <thead style={{color: 'black'}}>
              <tr className="bg-slate-700 text-white text-left">
                <th 
                  className="p-3 cursor-pointer hover:bg-slate-600 rounded-tl-lg"
                  onClick={() => requestSort('date')}
                >
                  Date{getSortIndicator('date')}
                </th>
                <th 
                  className="p-3 cursor-pointer hover:bg-slate-600"
                  onClick={() => requestSort('description')}
                >
                  Description{getSortIndicator('description')}
                </th>
                <th 
                  className="p-3 cursor-pointer hover:bg-slate-600"
                  onClick={() => requestSort('category')}
                >
                  Category{getSortIndicator('category')}
                </th>
                <th 
                  className="p-3 cursor-pointer hover:bg-slate-600"
                  onClick={() => requestSort('amount')}
                >
                  Amount{getSortIndicator('amount')}
                </th>
                <th 
                  className="p-3 cursor-pointer hover:bg-slate-600 rounded-tr-lg"
                  onClick={() => requestSort('type')}
                >
                  Type{getSortIndicator('type')}
                </th>
              </tr>
            </thead>
            <tbody style={{color: 'black'}}>
              {sortedTransactions.length > 0 ? (
                sortedTransactions.map((transaction, index) => (
                  <tr key={transaction.id} className={`border-b hover:bg-slate-100 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                    <td className="p-3 text-black">{formatDate(transaction.date)}</td>
                    <td className="p-3 font-medium text-black">{transaction.description}</td>
                    <td className="p-3 text-black">
                      <span className="px-2 py-1 rounded-full text-xs bg-slate-200 text-black">
                        {transaction.category}
                      </span>
                    </td>
                    <td className="p-3 font-semibold" style={{ color: transaction.type === 'Credit' ? '#10b981' : '#ef4444' }}>
                      {transaction.type === 'Credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </td>
                    <td className="p-3 text-black">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${transaction.type === 'Credit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {transaction.type}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-black bg-slate-50">
                    No transactions found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      
      <footer className="page-footer mt-8 pt-6 border-t border-slate-200">
        <p className="text-slate-500 text-sm">© 2025 Finance Manager. All rights reserved.</p>
      </footer>
      
      {/* Transaction Modal */}
      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={toggleModal} 
        onAddTransaction={handleAddTransaction} 
      />
    </div>
  );
};

export default Transactions;