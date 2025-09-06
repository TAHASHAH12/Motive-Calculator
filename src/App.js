import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import QACalculator from './components/QACalculator';
import SalaryCalculator from './components/SalaryCalculator';
import GuidelinesPanel from './components/GuidelinesPanel';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('qa');

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'qa':
        return <QACalculator />;
      case 'salary':
        return <SalaryCalculator />;
      case 'guidelines':
        return <GuidelinesPanel />;
      default:
        return <QACalculator />;
    }
  };

  return (
    <ThemeProvider>
      <div className="App">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="main-content" id="main-content">
          {renderActiveComponent()}
        </main>

        <footer className="app-footer">
          <p>&copy; 2025 Motive Technologies. All rights reserved.</p>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;
