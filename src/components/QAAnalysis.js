import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import './QAAnalysis.css';

const QAAnalysis = ({ data, userInfo }) => {
  const [selectedWeek, setSelectedWeek] = useState(data.length > 0 ? data.length - 1 : 0);
  
  if (!data || data.length === 0) {
    return (
      <div className="qa-analysis">
        <div className="no-data">
          <h3>No QA Data Available</h3>
          <p>QA analysis will appear here once data is loaded.</p>
        </div>
      </div>
    );
  }

  const currentWeek = data[selectedWeek];
  const previousWeek = selectedWeek > 0 ? data[selectedWeek - 1] : null;

  const getChangeIcon = (current, previous) => {
    if (!previous) return <Minus size={16} />;
    const change = current - previous;
    if (change > 0) return <TrendingUp size={16} className="positive" />;
    if (change < 0) return <TrendingDown size={16} className="negative" />;
    return <Minus size={16} className="neutral" />;
  };

  const getChangeValue = (current, previous) => {
    if (!previous) return 'N/A';
    const change = current - previous;
    return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  const tagAccuracyData = [
    { tag: 'RRL', accuracy: currentWeek.rrlAccuracy, fullName: 'Running Red Light' },
    { tag: 'Lane', accuracy: currentWeek.laneAccuracy, fullName: 'Lane Cutoff' },
    { tag: 'FCW', accuracy: currentWeek.fcwAccuracy, fullName: 'Forward Collision Warning' },
    { tag: 'Smoking', accuracy: currentWeek.smokingAccuracy, fullName: 'Smoking Detection' },
    { tag: 'Collision', accuracy: currentWeek.collisionAccuracy, fullName: 'Collision/Possible Collision' },
    { tag: 'Near Collision', accuracy: currentWeek.nearCollisionAccuracy, fullName: 'Near Collision' }
  ];

  const radarData = [
    { subject: 'New Tags', A: currentWeek.newTagsScore, fullMark: 20 },
    { subject: 'Collisions', A: currentWeek.collisionScore, fullMark: 30 },
    { subject: 'Other Tags', A: currentWeek.otherTagsScore, fullMark: 50 }
  ];

  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 95) return '#22c55e';
    if (accuracy >= 85) return '#3b82f6';
    if (accuracy >= 75) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreGrade = (score) => {
    if (score >= 95) return { grade: 'Excellent', color: '#22c55e' };
    if (score >= 85) return { grade: 'Good', color: '#3b82f6' };
    if (score >= 75) return { grade: 'Average', color: '#f59e0b' };
    return { grade: 'Needs Improvement', color: '#ef4444' };
  };

  return (
    <div className="qa-analysis">
      <div className="analysis-header">
        <div className="header-left">
          <h2>QA Performance Analysis</h2>
          <p>Detailed breakdown of your quality assurance performance</p>
        </div>
        
        <div className="week-selector">
          <label>Select Week:</label>
          <select 
            value={selectedWeek} 
            onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
          >
            {data.map((week, index) => (
              <option key={index} value={index}>
                {week.weekRange}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Overall Score Card */}
      <div className="score-overview-card">
        <div className="score-main">
          <div className="score-circle large">
            <span className="score-value">{currentWeek.overallScore.toFixed(1)}%</span>
            <span className="score-label">{getScoreGrade(currentWeek.overallScore).grade}</span>
          </div>
          <div className="score-details">
            <h3>Overall QA Score</h3>
            <div className="score-change">
              {getChangeIcon(currentWeek.overallScore, previousWeek?.overallScore)}
              <span>{getChangeValue(currentWeek.overallScore, previousWeek?.overallScore)}</span>
              {previousWeek && <span className="vs-previous">vs previous week</span>}
            </div>
          </div>
        </div>

        <div className="score-breakdown-cards">
          <div className="breakdown-card">
            <h4>New Tags (20%)</h4>
            <div className="breakdown-score">{currentWeek.newTagsScore.toFixed(1)}</div>
            <div className="breakdown-change">
              {getChangeIcon(currentWeek.newTagsScore, previousWeek?.newTagsScore)}
              {getChangeValue(currentWeek.newTagsScore, previousWeek?.newTagsScore)}
            </div>
          </div>
          
          <div className="breakdown-card">
            <h4>Collisions (30%)</h4>
            <div className="breakdown-score">{currentWeek.collisionScore.toFixed(1)}</div>
            <div className="breakdown-change">
              {getChangeIcon(currentWeek.collisionScore, previousWeek?.collisionScore)}
              {getChangeValue(currentWeek.collisionScore, previousWeek?.collisionScore)}
            </div>
          </div>
          
          <div className="breakdown-card">
            <h4>Other Tags (50%)</h4>
            <div className="breakdown-score">{currentWeek.otherTagsScore.toFixed(1)}</div>
            <div className="breakdown-change">
              {getChangeIcon(currentWeek.otherTagsScore, previousWeek?.otherTagsScore)}
              {getChangeValue(currentWeek.otherTagsScore, previousWeek?.otherTagsScore)}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        <div className="chart-container">
          <h3>Tag Accuracy Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tagAccuracyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tag" />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                formatter={(value, name) => [`${value.toFixed(1)}%`, 'Accuracy']}
                labelFormatter={(label) => tagAccuracyData.find(item => item.tag === label)?.fullName || label}
              />
              <Bar 
                dataKey="accuracy" 
                fill={(entry) => getAccuracyColor(entry.accuracy)}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Category Performance Radar</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis domain={[0, 50]} />
              <Radar
                name="Score"
                dataKey="A"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tag Performance Table */}
      <div className="tag-performance-table">
        <h3>Detailed Tag Performance</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Tag</th>
                <th>Full Name</th>
                <th>Accuracy</th>
                <th>Grade</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {tagAccuracyData.map((tag, index) => {
                const grade = getScoreGrade(tag.accuracy);
                return (
                  <tr key={index}>
                    <td className="tag-code">{tag.tag}</td>
                    <td>{tag.fullName}</td>
                    <td className="accuracy-cell">
                      <span style={{ color: getAccuracyColor(tag.accuracy) }}>
                        {tag.accuracy.toFixed(1)}%
                      </span>
                    </td>
                    <td>
                      <span className="grade-badge" style={{ backgroundColor: grade.color }}>
                        {grade.grade}
                      </span>
                    </td>
                    <td>
                      <div className="status-indicator">
                        {tag.accuracy >= 95 ? (
                          <span className="status excellent">🎉 Excellent</span>
                        ) : tag.accuracy >= 85 ? (
                          <span className="status good">✅ Good</span>
                        ) : tag.accuracy >= 75 ? (
                          <span className="status average">⚠️ Average</span>
                        ) : (
                          <span className="status poor">🔴 Needs Focus</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="performance-insights">
        <h3>Week Performance Insights</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <h4>🎯 Best Performing</h4>
            <p>
              {tagAccuracyData.reduce((best, current) => 
                current.accuracy > best.accuracy ? current : best
              ).fullName} - {tagAccuracyData.reduce((best, current) => 
                current.accuracy > best.accuracy ? current : best
              ).accuracy.toFixed(1)}%
            </p>
          </div>
          
          <div className="insight-card">
            <h4>📈 Improvement Needed</h4>
            <p>
              {tagAccuracyData.reduce((worst, current) => 
                current.accuracy < worst.accuracy ? current : worst
              ).fullName} - {tagAccuracyData.reduce((worst, current) => 
                current.accuracy < worst.accuracy ? current : worst
              ).accuracy.toFixed(1)}%
            </p>
          </div>
          
          <div className="insight-card">
            <h4>📊 Category Leader</h4>
            <p>
              {currentWeek.otherTagsScore >= Math.max(currentWeek.newTagsScore * 2.5, currentWeek.collisionScore * 1.67) ? 
                'Other Tags' : 
                currentWeek.collisionScore >= currentWeek.newTagsScore * 1.5 ? 
                'Collision Tags' : 'New Tags'} category performing best
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QAAnalysis;
