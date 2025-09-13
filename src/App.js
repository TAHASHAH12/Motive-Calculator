import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('motive-user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setUserInfo(user);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (userData) => {
    setUserInfo(userData);
    setIsAuthenticated(true);
    localStorage.setItem('motive-user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserInfo(null);
    localStorage.removeItem('motive-user');
  };

  return (
    <ThemeProvider>
      <div className="App">
        {!isAuthenticated ? (
          <LoginScreen onLogin={handleLogin} />
        ) : (
          <Dashboard userInfo={userInfo} onLogout={handleLogout} />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
