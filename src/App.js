import React, { useState } from 'react';
import QACalculator from './components/QACalculator';
import SalaryCalculator from './components/SalaryCalculator';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('qa');

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <div className="brand-section">
            <div className="motive-logo">
              <div className="logo-circle"></div>
              <span className="brand-name">Motive</span>
            </div>
            <h1>Employee Performance & Salary Calculator</h1>
          </div>
          
          <nav className="tab-navigation">
            <button 
              className={`tab-button ${activeTab === 'qa' ? 'active' : ''}`}
              onClick={() => setActiveTab('qa')}
            >
              <span className="tab-icon">📊</span>
              QA Score Calculator
            </button>
            <button 
              className={`tab-button ${activeTab === 'salary' ? 'active' : ''}`}
              onClick={() => setActiveTab('salary')}
            >
              <span className="tab-icon">💰</span>
              Salary Calculator
            </button>
          </nav>
        </div>
      </header>
      
      <main className="main-content">
        {activeTab === 'qa' ? <QACalculator /> : <SalaryCalculator />}
      </main>

      <footer className="app-footer">
        <p>&copy; 2025 Motive Technologies. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
