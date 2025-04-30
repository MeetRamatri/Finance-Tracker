import React, { useState } from 'react';

const TransactionModal = ({ isOpen, onClose, onAddTransaction }) => {
  // If modal is not open, don't render anything
  if (!isOpen) return null;
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    category: '',
    amount: '',
    type: 'Debit'
  });
  
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Convert amount to number and format date
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date).toISOString()
      };
      
      // Log the transaction data before sending
      console.log('Submitting transaction:', transactionData);
      
      // Call the onAddTransaction function passed from parent
      onAddTransaction(transactionData);
      onClose();
      
      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        description: '',
        category: '',
        amount: '',
        type: 'Debit'
      });
    }
  };
  
  return (
    <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="modal-content bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="modal-header bg-slate-700 text-white p-4 rounded-t-lg">
          <h2 className="text-xl font-semibold">Add New Transaction</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-slate-700 font-medium mb-2" htmlFor="date">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 ${errors.date ? 'border-red-500' : 'border-slate-300'}`}
            />
            {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
          </div>
          
          <div className="mb-4">
            <label className="block text-slate-700 font-medium mb-2" htmlFor="description">
              Description
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g., Grocery shopping"
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 ${errors.description ? 'border-red-500' : 'border-slate-300'}`}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>
          
          <div className="mb-4">
            <label className="block text-slate-700 font-medium mb-2" htmlFor="category">
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g., Food, Transportation"
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 ${errors.category ? 'border-red-500' : 'border-slate-300'}`}
            />
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>
          
          <div className="mb-4">
            <label className="block text-slate-700 font-medium mb-2" htmlFor="amount">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 ${errors.amount ? 'border-red-500' : 'border-slate-300'}`}
            />
            {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
          </div>
          
          <div className="mb-6">
            <label className="block text-slate-700 font-medium mb-2">
              Transaction Type
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="Debit"
                  checked={formData.type === 'Debit'}
                  onChange={handleChange}
                  className="form-radio text-slate-700"
                />
                <span className="ml-2 text-slate-700">Expense (Debit)</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="Credit"
                  checked={formData.type === 'Credit'}
                  onChange={handleChange}
                  className="form-radio text-slate-700"
                />
                <span className="ml-2 text-slate-700">Income (Credit)</span>
              </label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-600 transition-colors"
            >
              Add Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;