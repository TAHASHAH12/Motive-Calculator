import React from 'react';
import useScrollDirection from '../hooks/useScrollDirection';
import ThemeToggle from './ThemeToggle';
import './Header.css';

const Header = ({ activeTab, setActiveTab }) => {
  const isVisible = useScrollDirection(80);

  return (
    <header className={`app-header ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="header-content">
        <div className="brand-section">
          <div className="motive-logo">
            <img 
              src="https://logowik.com/content/uploads/images/motive8791.logowik.com.webp" 
              alt="Motive Logo" 
              className="logo-image"
            />
            <span className="brand-name">Motive</span>
          </div>
          <h1>Employee Performance & Salary Calculator</h1>
        </div>
        
        <div className="header-controls">
          <nav className="tab-navigation">
            <button 
              className={`tab-button ${activeTab === 'qa' ? 'active' : ''}`}
              onClick={() => setActiveTab('qa')}
              aria-pressed={activeTab === 'qa'}
            >
              <span className="tab-icon">📊</span>
              <span>QA Calculator</span>
            </button>
            <button 
              className={`tab-button ${activeTab === 'salary' ? 'active' : ''}`}
              onClick={() => setActiveTab('salary')}
              aria-pressed={activeTab === 'salary'}
            >
              <span className="tab-icon">💰</span>
              <span>Salary Calculator</span>
            </button>
            <button 
              className={`tab-button ${activeTab === 'guidelines' ? 'active' : ''}`}
              onClick={() => setActiveTab('guidelines')}
              aria-pressed={activeTab === 'guidelines'}
            >
              <span className="tab-icon">📚</span>
              <span>Guidelines</span>
            </button>
          </nav>
          
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
