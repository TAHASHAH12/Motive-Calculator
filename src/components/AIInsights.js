import React, { useState, useEffect, useCallback } from 'react';
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react';
import './AIInsights.css';

const AIInsights = ({ data, userInfo }) => {
  const [insights, setInsights] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');

  const generateInsights = useCallback(() => {
    const { qaData, kpiData } = data;
    const generatedInsights = [];

    if (!qaData || qaData.length === 0) {
      generatedInsights.push({
        id: 1,
        type: 'info',
        category: 'system',
        title: 'Welcome to AI Insights',
        content: 'AI insights will appear here based on your performance data. Connect your data source to get personalized recommendations.',
        priority: 'medium',
        actionable: false
      });
      setInsights(generatedInsights);
      return;
    }

    const latestQA = qaData[qaData.length - 1];
    const latestKPI = kpiData && kpiData.length > 0 ? kpiData[kpiData.length - 1] : null;
    const previousQA = qaData.length > 1 ? qaData[qaData.length - 2] : null;

    // Overall Performance Insight
    if (latestQA.overallScore >= 95) {
      generatedInsights.push({
        id: generatedInsights.length + 1,
        type: 'success',
        category: 'performance',
        title: 'Outstanding QA Performance!',
        content: `Excellent work! Your QA score of ${latestQA.overallScore.toFixed(1)}% puts you in the top performance tier. Your consistency across all tag categories is commendable.`,
        priority: 'low',
        actionable: true,
        actions: ['Maintain current practices', 'Mentor team members', 'Document your success strategies']
      });
    } else if (latestQA.overallScore >= 85) {
      generatedInsights.push({
        id: generatedInsights.length + 1,
        type: 'info',
        category: 'performance',
        title: 'Strong QA Performance',
        content: `Good work! Your QA score of ${latestQA.overallScore.toFixed(1)}% shows solid performance. With some focused improvements, you can reach excellence.`,
        priority: 'medium',
        actionable: true,
        actions: ['Focus on consistency', 'Review challenging cases', 'Practice edge scenarios']
      });
    } else {
      generatedInsights.push({
        id: generatedInsights.length + 1,
        type: 'warning',
        category: 'performance',
        title: 'QA Performance Needs Attention',
        content: `Your QA score of ${latestQA.overallScore.toFixed(1)}% indicates room for improvement. Let's identify specific areas to focus on.`,
        priority: 'high',
        actionable: true,
        actions: ['Schedule additional training', 'Review documentation', 'Practice with examples']
      });
    }

    // Category-specific insights
    if (latestQA.newTagsScore < 16) {
      generatedInsights.push({
        id: generatedInsights.length + 1,
        type: 'warning',
        category: 'qa-analysis',
        title: 'New Tags Category Needs Focus',
        content: `Your New Tags performance (${latestQA.newTagsScore.toFixed(1)}/20) is below optimal. Focus on RRL, FCW, and Lane Cutoff accuracy.`,
        priority: 'high',
        actionable: true,
        actions: ['Study RRL guidelines', 'Practice FCW scenarios', 'Review Lane Cutoff examples']
      });
    }

    if (latestQA.collisionScore < 25) {
      generatedInsights.push({
        id: generatedInsights.length + 1,
        type: 'warning',
        category: 'qa-analysis',
        title: 'Collision Detection Improvement Needed',
        content: `Collision category performance (${latestQA.collisionScore.toFixed(1)}/30) needs attention. Focus on C/PC and NC differentiation.`,
        priority: 'high',
        actionable: true,
        actions: ['Review collision vs near-collision criteria', 'Practice severity assessment', 'Study impact analysis']
      });
    }

    if (latestQA.otherTagsScore < 40) {
      generatedInsights.push({
        id: generatedInsights.length + 1,
        type: 'warning',
        category: 'qa-analysis',
        title: 'Other Tags Performance Below Target',
        content: `Other Tags category (${latestQA.otherTagsScore.toFixed(1)}/50) represents the largest weight. Improvement here will significantly impact overall score.`,
        priority: 'high',
        actionable: true,
        actions: ['Focus on high-frequency tags', 'Review distraction criteria', 'Practice cellphone detection']
      });
    }

    // Trend Analysis
    if (previousQA) {
      const scoreTrend = latestQA.overallScore - previousQA.overallScore;
      if (scoreTrend > 5) {
        generatedInsights.push({
          id: generatedInsights.length + 1,
          type: 'success',
          category: 'trends',
          title: 'Positive Performance Trend',
          content: `Great improvement! Your score increased by ${scoreTrend.toFixed(1)}% from last week. Keep up the momentum!`,
          priority: 'low',
          actionable: true,
          actions: ['Continue current practices', 'Identify success factors', 'Share learnings with team']
        });
      } else if (scoreTrend < -5) {
        generatedInsights.push({
          id: generatedInsights.length + 1,
          type: 'warning',
          category: 'trends',
          title: 'Performance Decline Detected',
          content: `Your score decreased by ${Math.abs(scoreTrend).toFixed(1)}% from last week. Let's identify and address the root causes.`,
          priority: 'high',
          actionable: true,
          actions: ['Review recent challenging cases', 'Identify knowledge gaps', 'Schedule refresher training']
        });
      }
    }

    // KPI Insights
    if (latestKPI) {
      if (latestKPI.punctuality === 100) {
        generatedInsights.push({
          id: generatedInsights.length + 1,
          type: 'success',
          category: 'kpi',
          title: 'Perfect Punctuality Record',
          content: 'Outstanding! You\'ve maintained 100% punctuality. This reliability is crucial for team operations.',
          priority: 'low',
          actionable: false
        });
      }

      if (latestKPI.targetAchievement > 150) {
        generatedInsights.push({
          id: generatedInsights.length + 1,
          type: 'success',
          category: 'kpi',
          title: 'Exceptional Productivity',
          content: `Remarkable! ${latestKPI.targetAchievement.toFixed(1)}% target achievement shows exceptional productivity and efficiency.`,
          priority: 'low',
          actionable: true,
          actions: ['Maintain current pace', 'Share productivity tips', 'Consider quality vs speed balance']
        });
      }
    }

    // Specific Tag Insights
    if (latestQA.smokingAccuracy < 90) {
      generatedInsights.push({
        id: generatedInsights.length + 1,
        type: 'warning',
        category: 'qa-analysis',
        title: 'Smoking Detection Accuracy',
        content: `Smoking detection accuracy (${latestQA.smokingAccuracy.toFixed(1)}%) needs improvement. This is a common challenging tag.`,
        priority: 'medium',
        actionable: true,
        actions: ['Review smoking guidelines', 'Practice with varied lighting conditions', 'Focus on gesture recognition']
      });
    }

    if (latestQA.rrlAccuracy < 95) {
      generatedInsights.push({
        id: generatedInsights.length + 1,
        type: 'warning',
        category: 'qa-analysis',
        title: 'Red Light Running Analysis',
        content: `RRL accuracy (${latestQA.rrlAccuracy.toFixed(1)}%) has room for improvement. Focus on signal timing and stop line positioning.`,
        priority: 'medium',
        actionable: true,
        actions: ['Study signal timing guidelines', 'Practice stop line identification', 'Review intersection types']
      });
    }

    setInsights(generatedInsights);
  }, [data]);

  useEffect(() => {
    generateInsights();
  }, [generateInsights]);

  const categories = {
    all: { label: 'All Insights', icon: Brain },
    performance: { label: 'Performance', icon: TrendingUp },
    'qa-analysis': { label: 'QA Analysis', icon: CheckCircle },
    kpi: { label: 'KPI Metrics', icon: AlertTriangle },
    trends: { label: 'Trends', icon: TrendingUp }
  };

  const filteredInsights = activeCategory === 'all' 
    ? insights 
    : insights.filter(insight => insight.category === activeCategory);

  const getInsightIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="insight-icon success" />;
      case 'warning': return <AlertTriangle className="insight-icon warning" />;
      case 'info': return <Lightbulb className="insight-icon info" />;
      default: return <Brain className="insight-icon" />;
    }
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      high: { label: 'High Priority', className: 'priority-high' },
      medium: { label: 'Medium Priority', className: 'priority-medium' },
      low: { label: 'Low Priority', className: 'priority-low' }
    };
    return badges[priority] || badges.medium;
  };

  return (
    <div className="ai-insights">
      <div className="insights-header">
        <div className="header-content">
          <h2>🤖 AI Performance Insights</h2>
          <p>Intelligent analysis and personalized recommendations based on your performance data</p>
        </div>
      </div>

      {/* Category Filters */}
      <div className="insights-categories">
        {Object.entries(categories).map(([key, category]) => {
          const Icon = category.icon;
          const count = key === 'all' ? insights.length : insights.filter(i => i.category === key).length;
          
          return (
            <button
              key={key}
              className={`category-filter ${activeCategory === key ? 'active' : ''}`}
              onClick={() => setActiveCategory(key)}
            >
              <Icon size={20} />
              <span>{category.label}</span>
              <span className="count">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Insights List */}
      <div className="insights-content">
        {filteredInsights.length === 0 ? (
          <div className="no-insights">
            <Brain size={48} />
            <h3>No insights available</h3>
            <p>Insights will appear here based on your performance data and trends.</p>
          </div>
        ) : (
          <div className="insights-grid">
            {filteredInsights.map((insight) => (
              <div key={insight.id} className={`insight-card ${insight.type}`}>
                <div className="insight-header">
                  {getInsightIcon(insight.type)}
                  <div className="insight-title-area">
                    <h3>{insight.title}</h3>
                    <span className={`priority-badge ${getPriorityBadge(insight.priority).className}`}>
                      {getPriorityBadge(insight.priority).label}
                    </span>
                  </div>
                </div>
                
                <div className="insight-content">
                  <p>{insight.content}</p>
                  
                  {insight.actionable && insight.actions && (
                    <div className="insight-actions">
                      <h4>Recommended Actions:</h4>
                      <ul>
                        {insight.actions.map((action, index) => (
                          <li key={index}>{action}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Insights Summary */}
      {insights.length > 0 && (
        <div className="insights-summary">
          <h3>Summary</h3>
          <div className="summary-stats">
            <div className="summary-stat">
              <span className="stat-number">{insights.filter(i => i.priority === 'high').length}</span>
              <span className="stat-label">High Priority</span>
            </div>
            <div className="summary-stat">
              <span className="stat-number">{insights.filter(i => i.actionable).length}</span>
              <span className="stat-label">Actionable Items</span>
            </div>
            <div className="summary-stat">
              <span className="stat-number">{insights.filter(i => i.type === 'success').length}</span>
              <span className="stat-label">Achievements</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsights;
