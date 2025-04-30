/**
 * Dummy transactions data for the Transactions page
 */

export const transactionsData = [
  {
    id: 1,
    date: '2023-11-01',
    description: 'Monthly Salary',
    category: 'Income',
    amount: 5000,
    type: 'Credit'
  },
  {
    id: 2,
    date: '2023-11-02',
    description: 'Rent Payment',
    category: 'Housing',
    amount: 1500,
    type: 'Debit'
  },
  {
    id: 3,
    date: '2023-11-03',
    description: 'Grocery Shopping',
    category: 'Food',
    amount: 250,
    type: 'Debit'
  },
  {
    id: 4,
    date: '2023-11-05',
    description: 'Freelance Project',
    category: 'Income',
    amount: 1200,
    type: 'Credit'
  },
  {
    id: 5,
    date: '2023-11-07',
    description: 'Gas Station',
    category: 'Transportation',
    amount: 60,
    type: 'Debit'
  },
  {
    id: 6,
    date: '2023-11-10',
    description: 'Restaurant Dinner',
    category: 'Food',
    amount: 85,
    type: 'Debit'
  },
  {
    id: 7,
    date: '2023-11-12',
    description: 'Movie Tickets',
    category: 'Entertainment',
    amount: 30,
    type: 'Debit'
  },
  {
    id: 8,
    date: '2023-11-15',
    description: 'Electricity Bill',
    category: 'Utilities',
    amount: 120,
    type: 'Debit'
  },
  {
    id: 9,
    date: '2023-11-18',
    description: 'Online Course',
    category: 'Education',
    amount: 199,
    type: 'Debit'
  },
  {
    id: 10,
    date: '2023-11-20',
    description: 'Investment Dividend',
    category: 'Income',
    amount: 450,
    type: 'Credit'
  },
  {
    id: 11,
    date: '2023-11-22',
    description: 'Coffee Shop',
    category: 'Food',
    amount: 15,
    type: 'Debit'
  },
  {
    id: 12,
    date: '2023-11-25',
    description: 'Mobile Phone Bill',
    category: 'Utilities',
    amount: 75,
    type: 'Debit'
  },
  {
    id: 13,
    date: '2023-11-27',
    description: 'Gym Membership',
    category: 'Health',
    amount: 50,
    type: 'Debit'
  },
  {
    id: 14,
    date: '2023-11-28',
    description: 'Birthday Gift',
    category: 'Shopping',
    amount: 100,
    type: 'Debit'
  },
  {
    id: 15,
    date: '2023-11-30',
    description: 'Bonus Payment',
    category: 'Income',
    amount: 1000,
    type: 'Credit'
  }
];

// Helper function to format date
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-IN', options);
};

// Helper function to format currency (reusing from dummyData.js)
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Get all unique categories
export const getCategories = () => {
  const categories = new Set(transactionsData.map(transaction => transaction.category));
  return Array.from(categories);
};

// Filter transactions by various criteria
export const filterTransactions = (transactions, filters) => {
  let filtered = [...transactions];
  
  // Search filter - now searches in description, category, and also includes amount
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(transaction => 
      transaction.description.toLowerCase().includes(searchLower) ||
      transaction.category.toLowerCase().includes(searchLower) ||
      transaction.amount.toString().includes(searchLower)
    );
  }
  
  // Category filter - now supports multiple categories
  if (filters.category && filters.category !== 'all') {
    if (Array.isArray(filters.category)) {
      // Multiple categories selected
      if (filters.category.length > 0) {
        filtered = filtered.filter(transaction => 
          filters.category.includes(transaction.category)
        );
      }
    } else {
      // Single category selected
      filtered = filtered.filter(transaction => transaction.category === filters.category);
    }
  }
  
  // Transaction type filter
  if (filters.type && filters.type !== 'all') {
    filtered = filtered.filter(transaction => transaction.type === filters.type);
  }
  
  // Date range filter - enhanced with custom date range and more options
  if (filters.dateRange) {
    const today = new Date();
    let startDate;
    
    switch(filters.dateRange) {
      case '7days':
        startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
        break;
      case '30days':
        startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30);
        break;
      case '90days':
        startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 90);
        break;
      case 'thisMonth':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case 'lastMonth':
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        filtered = filtered.filter(transaction => {
          const transactionDate = new Date(transaction.date);
          return transactionDate >= startDate && transactionDate <= endOfLastMonth;
        });
        return filtered;
      case 'thisYear':
        startDate = new Date(today.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(0); // Beginning of time
    }
    
    filtered = filtered.filter(transaction => new Date(transaction.date) >= startDate);
  }
  
  // Custom date range filter
  if (filters.startDate && filters.endDate) {
    const start = new Date(filters.startDate);
    const end = new Date(filters.endDate);
    // Set end date to end of day
    end.setHours(23, 59, 59, 999);
    
    filtered = filtered.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= start && transactionDate <= end;
    });
  } else if (filters.startDate) {
    const start = new Date(filters.startDate);
    filtered = filtered.filter(transaction => new Date(transaction.date) >= start);
  } else if (filters.endDate) {
    const end = new Date(filters.endDate);
    end.setHours(23, 59, 59, 999);
    filtered = filtered.filter(transaction => new Date(transaction.date) <= end);
  }
  
  // Amount range filter
  if (filters.minAmount !== undefined) {
    filtered = filtered.filter(transaction => transaction.amount >= filters.minAmount);
  }
  
  if (filters.maxAmount !== undefined) {
    filtered = filtered.filter(transaction => transaction.amount <= filters.maxAmount);
  }
  
  return filtered;
};