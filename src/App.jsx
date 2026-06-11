import React from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#111820',
              color: '#fff',
              border: '1px solid #2A313C',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '12px',
            },
            success: {
              iconTheme: {
                primary: '#00E676',
                secondary: '#111820',
              },
              style: {
                border: '1px solid rgba(0, 230, 118, 0.3)',
              }
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#111820',
              },
              style: {
                border: '1px solid rgba(239, 68, 68, 0.3)',
              }
            }
          }}
        />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
