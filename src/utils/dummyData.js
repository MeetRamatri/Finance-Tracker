/**
 * Dummy financial data for the dashboard
 */

// Dummy income data
export const incomeData = [
  { source: 'Salary', amount: 5000 },
  { source: 'Freelance', amount: 1200 },
  { source: 'Investments', amount: 450 },
  { source: 'Other', amount: 300 }
];

// Dummy expense data
export const expenseData = [
  { category: 'Housing', amount: 1500 },
  { category: 'Food', amount: 800 },
  { category: 'Transportation', amount: 400 },
  { category: 'Entertainment', amount: 300 },
  { category: 'Utilities', amount: 250 }
];

// Dummy budget data
export const budgetData = [
  { category: 'Housing', budgeted: 1600, spent: 1500 },
  { category: 'Food', budgeted: 900, spent: 800 },
  { category: 'Transportation', budgeted: 500, spent: 400 },
  { category: 'Entertainment', budgeted: 300, spent: 300 },
  { category: 'Utilities', budgeted: 300, spent: 250 }
];

// Calculate totals
export const calculateTotals = () => {
  const totalIncome = incomeData.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = expenseData.reduce((sum, item) => sum + item.amount, 0);
  const totalBudgeted = budgetData.reduce((sum, item) => sum + item.budgeted, 0);
  const totalSpent = budgetData.reduce((sum, item) => sum + item.spent, 0);
  
  return {
    totalIncome,
    totalExpenses,
    totalBudgeted,
    totalSpent,
    balance: totalIncome - totalExpenses,
    savingsRate: ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1)
  };
};

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Get expense data for chart
export const getExpenseChartData = () => {
  const total = expenseData.reduce((sum, item) => sum + item.amount, 0);
  
  return {
    labels: expenseData.map(item => item.category),
    datasets: [
      {
        data: expenseData.map(item => Math.round(item.amount / total * 100)),
        backgroundColor: [
          '#3498db', // Blue
          '#2ecc71', // Green
          '#e74c3c', // Red
          '#f39c12', // Yellow
          '#9b59b6', // Purple
        ],
        borderColor: [
          '#2980b9',
          '#27ae60',
          '#c0392b',
          '#d35400',
          '#8e44ad',
        ],
        borderWidth: 1,
      },
    ],
  };
};