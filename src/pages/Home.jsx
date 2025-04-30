import React from 'react';
import { Link } from 'react-router-dom';
import ExpenseChart from '../components/ExpenseChart';
import { calculateTotals, formatCurrency, budgetData, getExpenseChartData } from '../utils/dummyData';
import '../assets/styles/Home.css';
import '../assets/styles/Dashboard.css';

const Home = () => {
  // Get financial data from our dummy data utility
  const { totalIncome, totalExpenses, balance, savingsRate } = calculateTotals();
  const expenseChartData = getExpenseChartData();

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Financial Dashboard</h1>
        <p>Your financial overview at a glance</p>
      </header>
      
      {/* Financial Summary Section */}
      <section className="financial-summary">
        <div className="summary-card">
          <h2>Total Income</h2>
          <div className="amount" style={{ color: '#2ecc71' }}>{formatCurrency(totalIncome)}</div>
          <div className="change positive-change">↑ 5% from last month</div>
        </div>
        
        <div className="summary-card">
          <h2>Total Expenses</h2>
          <div className="amount" style={{ color: '#e74c3c' }}>{formatCurrency(totalExpenses)}</div>
          <div className="change negative-change">↑ 3% from last month</div>
        </div>
        
        <div className="summary-card">
          <h2>Balance</h2>
          <div className="amount" style={{ color: '#3498db' }}>{formatCurrency(balance)}</div>
          <div className="change positive-change">Saving {savingsRate}% of income</div>
        </div>
      </section>
      
      {/* Dashboard Grid - Budget Summary and Expense Chart */}
      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Budget Summary Section */}
        <section className="budget-summary">
          <h2>Monthly Budget Summary</h2>
          
          {budgetData.map((category, index) => {
            const percentSpent = Math.round((category.spent / category.budgeted) * 100);
            let progressBarClass = 'progress-bar-safe';
            
            if (percentSpent >= 90) {
              progressBarClass = 'progress-bar-danger';
            } else if (percentSpent >= 75) {
              progressBarClass = 'progress-bar-warning';
            }
            
            return (
              <div className="budget-category" key={index}>
                <div className="budget-category-header">
                  <div className="budget-category-name">{category.category}</div>
                  <div className="budget-category-values">
                    {formatCurrency(category.spent)} of {formatCurrency(category.budgeted)}
                  </div>
                </div>
                <div className="progress-bar-container">
                  <div 
                    className={`progress-bar ${progressBarClass}`} 
                    style={{ width: `${percentSpent}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
          
          <div style={{ marginTop: '1rem' }}>
            <Link to="/budget" className="secondary-button">View Full Budget</Link>
          </div>
        </section>
        
        {/* Expense Chart Section */}
        <section className="expense-chart">
          <h2>Expense Breakdown</h2>
          <ExpenseChart data={expenseChartData} />
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <Link to="/transactions" className="secondary-button">View Transactions</Link>
          </div>
        </section>
      </div>
      
      <footer className="home-footer">
        <p>© 2025 Finance Manager. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;