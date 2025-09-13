import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, Building } from 'lucide-react';
import './LoginScreen.css';

const LoginScreen = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call delay
    setTimeout(() => {
      if (credentials.username === 'taha.shah' && credentials.password === '12345') {
        const userData = {
          username: 'taha.shah',
          name: 'Taha Shah',
          email: 'taha.shah@keeptruckin.com',
          annCode: '698',
          pod: 'Pod_AliFaizan',
          loginTime: new Date().toISOString()
        };
        onLogin(userData);
      } else {
        setError('Invalid username or password');
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleInputChange = (field, value) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError('');
  };

  return (
    <div className="login-screen">
      <div className="login-background">
        <div className="login-container">
          <div className="login-header">
            <div className="company-logo">
              <Building className="logo-icon" />
              <h1>Annotations</h1>
            </div>
            <h2>Performance Dashboard</h2>
            <p>Sign in to access your QA insights and performance metrics</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <User className="input-icon" />
              <input
                type="text"
                placeholder="Username"
                value={credentials.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className={error ? 'error' : ''}
                required
              />
            </div>

            <div className="input-group">
              <Lock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={credentials.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={error ? 'error' : ''}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {error && (
              <div className="error-message">
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className={`login-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="loading-spinner"></div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>&copy; 2025 Motive Technologies. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
