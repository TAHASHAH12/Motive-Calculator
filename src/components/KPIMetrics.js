import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Clock, Target, Award, TrendingUp } from 'lucide-react';
import './KPIMetrics.css';

const KPIMetrics = ({ data, userInfo }) => {
  if (!data || data.length === 0) {
    return (
      <div className="kpi-metrics">
        <div className="no-data">
          <h3>No KPI Data Available</h3>
          <p>KPI metrics will appear here once data is loaded.</p>
        </div>
      </div>
    );
  }

  const currentWeek = data[data.length - 1];
  
  const getGradeColor = (grade) => {
    if (grade >= 5) return '#22c55e';
    if (grade >= 4) return '#3b82f6';
    if (grade >= 3) return '#f59e0b';
    return '#ef4444';
  };

  const gradeDistribution = [
    { name: 'Grade 5', value: data.filter(d => d.punctualityGrade === 5).length, color: '#22c55e' },
    { name: 'Grade 4', value: data.filter(d => d.punctualityGrade === 4).length, color: '#3b82f6' },
    { name: 'Grade 3', value: data.filter(d => d.punctualityGrade === 3).length, color: '#f59e0b' },
    { name: 'Grade 2', value: data.filter(d => d.punctualityGrade === 2).length, color: '#f97316' },
    { name: 'Grade 1', value: data.filter(d => d.punctualityGrade === 1).length, color: '#ef4444' }
  ].filter(item => item.value > 0);

  return (
    <div className="kpi-metrics">
      <div className="kpi-header">
        <h2>KPI Performance Metrics</h2>
        <p>Your key performance indicators and operational efficiency</p>
      </div>

      {/* KPI Cards */}
      <div className="kpi-cards-grid">
        <div className="kpi-card">
          <div className="kpi-icon">
            <Clock size={24} />
          </div>
          <div className="kpi-content">
            <h3>Punctuality</h3>
            <div className="kpi-value">{currentWeek.punctuality}%</div>
            <div className="kpi-grade">
              <span 
                className="grade-badge"
                style={{ backgroundColor: getGradeColor(currentWeek.punctualityGrade) }}
              >
                Grade {currentWeek.punctualityGrade}/5
              </span>
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon">
            <TrendingUp size={24} />
          </div>
          <div className="kpi-content">
            <h3>Download Time</h3>
            <div className="kpi-value">{currentWeek.downloadTime}s</div>
            <div className="kpi-grade">
              <span 
                className="grade-badge"
                style={{ backgroundColor: getGradeColor(currentWeek.downloadTimeGrade) }}
              >
                Grade {currentWeek.downloadTimeGrade}/5
              </span>
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon">
            <Target size={24} />
          </div>
          <div className="kpi-content">
            <h3>Target Achievement</h3>
            <div className="kpi-value">{currentWeek.targetAchievement.toFixed(1)}%</div>
            <div className="kpi-subtitle">Weekly Performance</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon">
            <Award size={24} />
          </div>
          <div className="kpi-content">
            <h3>QA Category</h3>
            <div className="kpi-value">{currentWeek.qaScore}%</div>
            <div className="kpi-category">{currentWeek.qaCategory}</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-container">
          <h3>Punctuality Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="weekRange" />
              <YAxis domain={[80, 100]} />
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Punctuality']}
              />
              <Line 
                type="monotone" 
                dataKey="punctuality" 
                stroke="#22c55e" 
                strokeWidth={3}
                dot={{ fill: '#22c55e', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Grade Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={gradeDistribution}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {gradeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Timeline */}
      <div className="performance-timeline">
        <h3>Weekly Performance Timeline</h3>
        <div className="timeline-container">
          {data.slice(-5).reverse().map((week, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-marker">
                <div 
                  className="marker-dot"
                  style={{ backgroundColor: getGradeColor(week.qaGrade) }}
                ></div>
              </div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <h4>{week.weekRange}</h4>
                  <span className="qa-category">{week.qaCategory}</span>
                </div>
                <div className="timeline-metrics">
                  <div className="metric">
                    <span>Punctuality:</span>
                    <span>{week.punctuality}%</span>
                  </div>
                  <div className="metric">
                    <span>Target:</span>
                    <span>{week.targetAchievement.toFixed(1)}%</span>
                  </div>
                  <div className="metric">
                    <span>QA Score:</span>
                    <span>{week.qaScore}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KPI Summary */}
      <div className="kpi-summary">
        <h3>Performance Summary</h3>
        <div className="summary-stats">
          <div className="summary-stat">
            <h4>Average Punctuality</h4>
            <span className="stat-value">
              {(data.reduce((sum, week) => sum + week.punctuality, 0) / data.length).toFixed(1)}%
            </span>
          </div>
          <div className="summary-stat">
            <h4>Best Week</h4>
            <span className="stat-value">
              {data.reduce((best, current) => 
                current.qaScore > best.qaScore ? current : best
              ).weekRange}
            </span>
          </div>
          <div className="summary-stat">
            <h4>Consistency</h4>
            <span className="stat-value">
              {data.filter(week => week.qaGrade >= 4).length}/{data.length} weeks
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KPIMetrics;
