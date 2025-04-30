/**
 * Authentication service for handling user login, registration, and session management
 */

import api from './api';

// Local storage keys
const USER_KEY = 'finance_tracker_user';
const TOKEN_KEY = 'finance_tracker_token'; // For future JWT implementation

// Get the current user from local storage
const getCurrentUser = () => {
  const userJson = localStorage.getItem(USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
};

// Save user to local storage
const setCurrentUser = (user) => {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
};

// Login user
const login = async (email, password) => {
  try {
    const user = await api.users.login(email, password);
    setCurrentUser(user);
    return user;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

// Register new user
const register = async (userData) => {
  try {
    // Add creation date
    const newUser = {
      ...userData,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    const user = await api.users.create(newUser);
    // Don't automatically log in after registration
    return user;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};

// Logout user
const logout = () => {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
  // You could also redirect to login page here
};

// Check if user is authenticated
const isAuthenticated = () => {
  return !!getCurrentUser();
};

export default {
  getCurrentUser,
  login,
  register,
  logout,
  isAuthenticated
};