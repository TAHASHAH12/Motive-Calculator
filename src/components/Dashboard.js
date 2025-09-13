import React, { useState, useEffect, useCallback } from 'react';
import { LogOut, RefreshCw, MessageCircle } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import PerformanceOverview from './PerformanceOverview';
import QAAnalysis from './QAAnalysis';
import KPIMetrics from './KPIMetrics';
import AIInsights from './AIInsights';
import GuidelinesPanel from './GuidelinesPanel';
import AIChatBot from './AIChatBot';
import { fetchGoogleSheetsData } from '../services/googleSheets';
import './Dashboard.css';

const Dashboard = ({ userInfo, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showChatbot, setShowChatbot] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    qaData: [],
    kpiData: [],
    lastUpdated: null
  });
  const [error, setError] = useState('');

  const loadDemoData = useCallback(() => {
    // Demo data based on the Excel structure
    const demoQAData = [
      {
        weekRange: '25 Aug - 31 Aug',
        name: 'Taha Shah',
        overallScore: 95.4, // 19.5 + 25.9 + 50.0
        newTagsScore: 19.5,
        collisionScore: 25.9,
        otherTagsScore: 50.0,
        rrlAccuracy: 94.74,
        laneAccuracy: 100,
        fcwAccuracy: 100,
        smokingAccuracy: 91.67,
        collisionAccuracy: 100,
        nearCollisionAccuracy: 100
      },
      {
        weekRange: '01 Sep - 07 Sep',
        name: 'Taha Shah',
        overallScore: 100, // 20.0 + 30.0 + 50.0
        newTagsScore: 20.0,
        collisionScore: 30.0,
        otherTagsScore: 50.0,
        rrlAccuracy: 100,
        laneAccuracy: 100,
        fcwAccuracy: 100,
        smokingAccuracy: 100,
        collisionAccuracy: 100,
        nearCollisionAccuracy: 100
      }
    ];

    const demoKPIData = [
      {
        weekRange: '25 Aug - 31 Aug',
        punctuality: 100,
        punctualityGrade: 5,
        downloadTime: 3.95,
        downloadTimeGrade: 1,
        timeOnVA: 96.08,
        targetAchievement: 134.19,
        qaScore: 100,
        qaGrade: 5,
        qaCategory: 'Outstanding'
      },
      {
        weekRange: '01 Sep - 07 Sep',
        punctuality: 100,
        punctualityGrade: 5,
        downloadTime: 3.42,
        downloadTimeGrade: 1,
        timeOnVA: 87.53,
        targetAchievement: 147.54,
        qaScore: 100,
        qaGrade: 5,
        qaCategory: 'Outstanding'
      }
    ];

    setData({
      qaData: demoQAData,
      kpiData: demoKPIData,
      lastUpdated: new Date().toISOString()
    });
  }, []);

  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const sheetsData = await fetchGoogleSheetsData();
      setData({
        qaData: sheetsData.qaData || [],
        kpiData: sheetsData.kpiData || [],
        lastUpdated: new Date().toISOString()
      });
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data from Google Sheets');
      
      // Load demo data as fallback
      loadDemoData();
    } finally {
      setIsLoading(false);
    }
  }, [loadDemoData]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const refreshData = () => {
    loadDashboardData();
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <PerformanceOverview data={data} userInfo={userInfo} />;
      case 'qa-analysis':
        return <QAAnalysis data={data.qaData} userInfo={userInfo} />;
      case 'kpi-metrics':
        return <KPIMetrics data={data.kpiData} userInfo={userInfo} />;
      case 'ai-insights':
        return <AIInsights data={data} userInfo={userInfo} />;
      case 'guidelines':
        return <GuidelinesPanel data={data} userInfo={userInfo} />;
      default:
        return <PerformanceOverview data={data} userInfo={userInfo} />;
    }
  };

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner large"></div>
        <p>Loading your performance data...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <div className="user-info">
            <div className="user-avatar">
              {userInfo.name.charAt(0)}
            </div>
            <div className="user-details">
              <h3>Welcome, {userInfo.name}</h3>
              <span className="user-role">QA Analyst • {userInfo.pod}</span>
            </div>
          </div>
        </div>

        <div className="header-center">
          <nav className="tab-navigation">
            <button
              className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <span className="tab-icon">📊</span>
              <span>Overview</span>
            </button>
            <button
              className={`tab-button ${activeTab === 'qa-analysis' ? 'active' : ''}`}
              onClick={() => setActiveTab('qa-analysis')}
            >
              <span className="tab-icon">🎯</span>
              <span>QA Analysis</span>
            </button>
            <button
              className={`tab-button ${activeTab === 'kpi-metrics' ? 'active' : ''}`}
              onClick={() => setActiveTab('kpi-metrics')}
            >
              <span className="tab-icon">📈</span>
              <span>KPI Metrics</span>
            </button>
            <button
              className={`tab-button ${activeTab === 'ai-insights' ? 'active' : ''}`}
              onClick={() => setActiveTab('ai-insights')}
            >
              <span className="tab-icon">🤖</span>
              <span>AI Insights</span>
            </button>
            <button
              className={`tab-button ${activeTab === 'guidelines' ? 'active' : ''}`}
              onClick={() => setActiveTab('guidelines')}
            >
              <span className="tab-icon">📚</span>
              <span>Guidelines</span>
            </button>
          </nav>
        </div>

        <div className="header-right">
          <button className="header-action" onClick={refreshData} title="Refresh Data">
            <RefreshCw size={20} />
          </button>
          <button 
            className="header-action"
            onClick={() => setShowChatbot(true)}
            title="AI Assistant"
          >
            <MessageCircle size={20} />
          </button>
          <ThemeToggle />
          <button className="logout-button" onClick={onLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
          <button onClick={refreshData}>Retry</button>
        </div>
      )}

      <main className="dashboard-content">
        {renderActiveTab()}
      </main>

      {data.lastUpdated && (
        <div className="data-timestamp">
          Last updated: {new Date(data.lastUpdated).toLocaleString()}
        </div>
      )}

      <AIChatBot 
        isOpen={showChatbot}
        onClose={() => setShowChatbot(false)}
        userData={data}
        userInfo={userInfo}
      />
    </div>
  );
};

export default Dashboard;
