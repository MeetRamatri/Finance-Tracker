import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/Landing.css';
import LandingPageSvg from '../assets/LandingPage.svg';

const Landing = () => {
  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Take Control of Your Finances</h1>
          <p className="hero-subtitle">Track expenses, manage budgets, and achieve your financial goals with our easy-to-use finance tracker.</p>
          <div className="hero-buttons">
            <Link to="/login" className="btn btn-primary">Login</Link>
            <Link to="/signup" className="btn btn-secondary">Sign Up</Link>
          </div>
        </div>
        <div className="hero-image">
          {/* Placeholder for a hero image */}
          <div className="image-placeholder">
          <img src={LandingPageSvg} alt="Landing Page" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1v22"></path>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
            <h3>Expense Tracking</h3>
            <p>Easily record and categorize your expenses to understand your spending habits.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
            </div>
            <h3>Budget Planning</h3>
            <p>Create and manage budgets for different categories to keep your finances on track.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
                <line x1="2" y1="20" x2="22" y2="20"></line>
              </svg>
            </div>
            <h3>Financial Reports</h3>
            <p>Visualize your financial data with intuitive charts and reports.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <h2>How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Create an Account</h3>
            <p>Sign up for free and set up your profile in minutes.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Track Your Expenses</h3>
            <p>Record your income and expenses with our easy-to-use interface.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Analyze Your Finances</h3>
            <p>Get insights into your spending habits and financial health.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <h2>Ready to Take Control of Your Finances?</h2>
        <p>Join thousands of users who have improved their financial well-being with our platform.</p>
        <div className="cta-buttons">
          <Link to="/signup" className="btn btn-primary">Get Started for Free</Link>
          <Link to="/login" className="btn btn-outline">Login to Your Account</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>© 2025 Finance Manager. All rights reserved.</p>
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact Us</a>
        </div>
      </footer>
    </div>
  );
};

export default Landing;