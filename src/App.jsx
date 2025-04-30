import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import Transactions from './pages/Transactions'
import Budget from './pages/Budget'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Landing from './pages/Landing'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import './App.css'
import './assets/styles/Common.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected routes - only accessible when logged in */}
            <Route path="/home" element={
              <ProtectedRoute>
                <div className="app-container">
                  <Navigation />
                  <main className="main-content">
                    <Home />
                  </main>
                </div>
              </ProtectedRoute>
            } />
            <Route path="/transactions" element={
              <ProtectedRoute>
                <div className="app-container">
                  <Navigation />
                  <main className="main-content">
                    <Transactions />
                  </main>
                </div>
              </ProtectedRoute>
            } />
            <Route path="/budget" element={
              <ProtectedRoute>
                <div className="app-container">
                  <Navigation />
                  <main className="main-content">
                    <Budget />
                  </main>
                </div>
              </ProtectedRoute>
            } />

          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
