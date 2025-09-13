import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Award, Target, Calendar } from 'lucide-react';
import './PerformanceOverview.css';

const PerformanceOverview = ({ data, userInfo }) => {
  const { qaData, kpiData } = data;
  
  const currentWeekQA = qaData && qaData.length > 0 ? qaData[qaData.length - 1] : null;
  const currentWeekKPI = kpiData && kpiData.length > 0 ? kpiData[kpiData.length - 1] : null;
  const previousWeekQA = qaData && qaData.length > 1 ? qaData[qaData.length - 2] : null;

  const getScoreGrade = (score) => {
    if (score >= 95) return 'Excellent';
    if (score >= 85) return 'Good';
    if (score >= 75) return 'Average';
    return 'Needs Improvement';
  };

  const getGradeColor = (score) => {
    if (score >= 95) return '#22c55e';
    if (score >= 85) return '#3b82f6';
    if (score >= 75) return '#f59e0b';
    return '#ef4444';
  };

  // Calculate changes from previous week
  const getChangeIndicator = (current, previous) => {
    if (!previous) return { change: 0, direction: 'neutral' };
    
    const change = current - previous;
    return {
      change: change,
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
    };
  };

  const newTagsChange = previousWeekQA ? 
    getChangeIndicator(currentWeekQA?.newTagsScore || 0, previousWeekQA.newTagsScore) : 
    { change: 0, direction: 'neutral' };
  
  const collisionChange = previousWeekQA ? 
    getChangeIndicator(currentWeekQA?.collisionScore || 0, previousWeekQA.collisionScore) : 
    { change: 0, direction: 'neutral' };
  
  const otherTagsChange = previousWeekQA ? 
    getChangeIndicator(currentWeekQA?.otherTagsScore || 0, previousWeekQA.otherTagsScore) : 
    { change: 0, direction: 'neutral' };

  return (
    <div className="performance-overview">
      <div className="overview-header">
        <h2>Performance Overview</h2>
        <p>Your comprehensive performance dashboard</p>
      </div>

      {/* Key Metrics Cards */}
      <div className="metrics-grid">
        <div className="metric-card primary">
          <div className="metric-icon">
            <Award size={24} />
          </div>
          <div className="metric-content">
            <h3>Overall QA Score</h3>
            <div className="metric-value">
              {currentWeekQA ? `${currentWeekQA.overallScore.toFixed(1)}%` : 'N/A'}
            </div>
            <div className="metric-subtitle">
              {currentWeekQA ? getScoreGrade(currentWeekQA.overallScore) : ''}
            </div>
          </div>
        </div>

        <div className="metric-card success">
          <div className="metric-icon">
            <TrendingUp size={24} />
          </div>
          <div className="metric-content">
            <h3>Punctuality</h3>
            <div className="metric-value">
              {currentWeekKPI ? `${currentWeekKPI.punctuality}%` : 'N/A'}
            </div>
            <div className="metric-subtitle">
              {currentWeekKPI ? `Grade ${currentWeekKPI.punctualityGrade}/5` : ''}
            </div>
          </div>
        </div>

        <div className="metric-card warning">
          <div className="metric-icon">
            <Target size={24} />
          </div>
          <div className="metric-content">
            <h3>Target Achievement</h3>
            <div className="metric-value">
              {currentWeekKPI ? `${currentWeekKPI.targetAchievement.toFixed(1)}%` : 'N/A'}
            </div>
            <div className="metric-subtitle">
              Weekly Performance
            </div>
          </div>
        </div>

        <div className="metric-card info">
          <div className="metric-icon">
            <Calendar size={24} />
          </div>
          <div className="metric-content">
            <h3>Current Week</h3>
            <div className="metric-value">
              {currentWeekQA ? currentWeekQA.weekRange : 'N/A'}
            </div>
            <div className="metric-subtitle">
              Latest Data
            </div>
          </div>
        </div>
      </div>

      {/* CORRECTED: QA Score Breakdown with proper calculations */}
      <div className="qa-breakdown-section">
        <h3>QA Score Breakdown</h3>
        <div className="breakdown-cards">
          <div className="breakdown-card">
            <div className="breakdown-header">
              <h4>New Tags (20%)</h4>
              <div className={`change-indicator ${newTagsChange.direction}`}>
                {newTagsChange.direction === 'up' && '↗'}
                {newTagsChange.direction === 'down' && '↘'}
                {newTagsChange.direction === 'neutral' && '→'}
                {newTagsChange.change !== 0 ? `${newTagsChange.change > 0 ? '+' : ''}${newTagsChange.change.toFixed(1)}%` : ''}
              </div>
            </div>
            <div className="breakdown-score">
              {currentWeekQA ? currentWeekQA.newTagsScore.toFixed(1) : '0.0'}
            </div>
            <div className="breakdown-progress">
              <div 
                className="progress-bar"
                style={{width: `${currentWeekQA ? (currentWeekQA.newTagsScore / 20) * 100 : 0}%`}}
              ></div>
            </div>
          </div>

          <div className="breakdown-card">
            <div className="breakdown-header">
              <h4>Collisions (30%)</h4>
              <div className={`change-indicator ${collisionChange.direction}`}>
                {collisionChange.direction === 'up' && '↗'}
                {collisionChange.direction === 'down' && '↘'}
                {collisionChange.direction === 'neutral' && '→'}
                {collisionChange.change !== 0 ? `${collisionChange.change > 0 ? '+' : ''}${collisionChange.change.toFixed(1)}%` : ''}
              </div>
            </div>
            <div className="breakdown-score">
              {currentWeekQA ? currentWeekQA.collisionScore.toFixed(1) : '0.0'}
            </div>
            <div className="breakdown-progress">
              <div 
                className="progress-bar"
                style={{width: `${currentWeekQA ? (currentWeekQA.collisionScore / 30) * 100 : 0}%`}}
              ></div>
            </div>
          </div>

          <div className="breakdown-card">
            <div className="breakdown-header">
              <h4>Other Tags (50%)</h4>
              <div className={`change-indicator ${otherTagsChange.direction}`}>
                {otherTagsChange.direction === 'up' && '↗'}
                {otherTagsChange.direction === 'down' && '↘'}
                {otherTagsChange.direction === 'neutral' && '→'}
                {otherTagsChange.change !== 0 ? `${otherTagsChange.change > 0 ? '+' : ''}${otherTagsChange.change.toFixed(1)}%` : ''}
              </div>
            </div>
            <div className="breakdown-score">
              {currentWeekQA ? currentWeekQA.otherTagsScore.toFixed(1) : '0.0'}
            </div>
            <div className="breakdown-progress">
              <div 
                className="progress-bar"
                style={{width: `${currentWeekQA ? (currentWeekQA.otherTagsScore / 50) * 100 : 0}%`}}
              ></div>
            </div>
          </div>
        </div>

        {/* CORRECTED: Total calculation display */}
        <div className="total-calculation">
          <div className="calculation-formula">
            <span>Total QA Score = </span>
            <span className="new-tags">{currentWeekQA ? currentWeekQA.newTagsScore.toFixed(1) : '0.0'}</span>
            <span> + </span>
            <span className="collisions">{currentWeekQA ? currentWeekQA.collisionScore.toFixed(1) : '0.0'}</span>
            <span> + </span>
            <span className="other-tags">{currentWeekQA ? currentWeekQA.otherTagsScore.toFixed(1) : '0.0'}</span>
            <span> = </span>
            <span className="total-score">{currentWeekQA ? currentWeekQA.overallScore.toFixed(1) : '0.0'}%</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-container">
          <h3>QA Score Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={qaData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="weekRange" />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                formatter={(value) => [`${value.toFixed(1)}%`, 'QA Score']}
              />
              <Line 
                type="monotone" 
                dataKey="overallScore" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Category Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={qaData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="weekRange" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [value.toFixed(1), '']}
              />
              <Bar dataKey="newTagsScore" fill="#22c55e" name="New Tags" />
              <Bar dataKey="collisionScore" fill="#f59e0b" name="Collisions" />
              <Bar dataKey="otherTagsScore" fill="#3b82f6" name="Other Tags" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Performance */}
      <div className="recent-performance">
        <h3>Recent Performance Summary</h3>
        <div className="performance-cards">
          {qaData && qaData.slice(-3).reverse().map((week, index) => (
            <div key={index} className="performance-card">
              <div className="card-header">
                <span className="week-range">{week.weekRange}</span>
                <span 
                  className="score-badge"
                  style={{ backgroundColor: getGradeColor(week.overallScore) }}
                >
                  {week.overallScore.toFixed(1)}%
                </span>
              </div>
              <div className="card-content">
                <div className="score-breakdown">
                  <div className="breakdown-item">
                    <span>New Tags:</span>
                    <span>{week.newTagsScore.toFixed(1)}/20</span>
                  </div>
                  <div className="breakdown-item">
                    <span>Collisions:</span>
                    <span>{week.collisionScore.toFixed(1)}/30</span>
                  </div>
                  <div className="breakdown-item">
                    <span>Other Tags:</span>
                    <span>{week.otherTagsScore.toFixed(1)}/50</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PerformanceOverview;
