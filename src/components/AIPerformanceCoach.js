import React, { useState, useEffect } from 'react';
import { useQACalculations } from '../hooks/useCalculations';
import './AIPerformanceCoach.css';

const AIPerformanceCoach = () => {
  const [activeInsight, setActiveInsight] = useState('all');
  const [expandedCards, setExpandedCards] = useState(new Set());
  const [qaData, setQaData] = useState({
    newTags: {},
    collisionTags: {},
    otherTags: {}
  });

  // Load QA data from localStorage
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('motive-qa-data');
      if (savedData) {
        setQaData(JSON.parse(savedData));
      }
    } catch (error) {
      console.error('Error loading QA data:', error);
    }
  }, []);

  const results = useQACalculations(qaData.newTags, qaData.collisionTags, qaData.otherTags);

  const documentationLinks = {
    RRL: 'https://docs.google.com/document/d/1qCMjFlso9fsXPkvXy_Z_FY6o_RK2OVvK_n3AKE4Y2mw/edit',
    LC: 'https://docs.google.com/document/d/1g0xayDpV9CRdw_mXgTJ-zH9cJ2p7l9fAQT937KDDuCQ/edit',
    CII: 'https://docs.google.com/document/d/1d80MGZgtSYf_SgcMgeMEftMGWDyjKADRgF9LzWRYUjA/edit',
    DFCO: 'https://docs.google.com/document/d/1yC-QEreUhH-ag-bGJzbFBqn4NCB3Gc6vUuxzq1MA9M8/edit#heading=h.9nlts9t1on0a',
    RFCO: 'https://docs.google.com/document/d/1yC-QEreUhH-ag-bGJzbFBqn4NCB3Gc6vUuxzq1MA9M8/edit#heading=h.9nlts9t1on0a',
    FCW: 'https://docs.google.com/document/d/1ZUj03wskvfrX-Kw-HLXBf49Q3VyWGgjF5oiCWjrfaNU/edit?pli=1#heading=h.w0gqyhyc8roy',
    Smoking: 'https://docs.google.com/document/d/1xvLo8PAsh2RVEnKGQPsAXsm_BNmwroWD4wHwiNw74-E/edit?tab=t.0',
    AD: 'https://docs.google.com/document/d/1kLxJ64XHmP9SOz5P_2dPT46jwRsC7LoSVkc3-OGQc_M/edit?tab=t.0#heading=h.yz6h9dvvgx74',
    SD: 'https://docs.google.com/document/d/1kLxJ64XHmP9SOz5P_2dPT46jwRsC7LoSVkc3-OGQc_M/edit?tab=t.0#heading=h.yz6h9dvvgx74',
    'C/PC': 'https://docs.google.com/document/d/1jb_q7nwT-Lradnk-yRZit4M7zP1wCB08/edit',
    'NC': 'https://docs.google.com/document/d/14vm7NXbF5iPN2celAhsWq2mNH2-dcdUE/edit',
    USP: 'https://docs.google.com/document/d/1f6PFmLnPn93FbulPaiM2yt1Omb4GF-S1_Uq_IAb4mP0/edit?tab=t.0',
    Drowsiness: 'https://docs.google.com/document/d/10fCC27rJEwglkX-6Qy8nbKRDCjVeJDyq0mRS03ECj_o/edit',
    SBV: 'https://docs.google.com/document/d/1Ykcx3k-COnOG68Id6nPe-C4py2YgO2VqHeobboGpD6E/edit',
    CP: 'https://docs.google.com/document/d/1o1QmRPf-1Al7BpkfGjgrYva2lNHqnegg8jwEgEE3P5A/edit',
    CF: 'https://docs.google.com/document/d/1d80MGZgtSYf_SgcMgeMEftMGWDyjKADRgF9LzWRYUjA/edit',
    SSV: 'https://docs.google.com/document/d/1bvoPlq355ssrIXzl-iNb6NwnVYr_enE6kPg002Sxt-s/edit',
    Distraction: 'https://docs.google.com/document/d/1VNIUsLEgVunRqwJPuVx-OgUJF4wVFopybf2b8zrTGG0/edit',
    ULC: 'https://docs.google.com/document/d/1QTLklxpsjHS5zcTEFC8xlCZONmLn-S6VGIHsXzjQY-U/edit'
  };

  const toggleCard = (index) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedCards(newExpanded);
  };

  const insightCategories = {
    all: { title: 'All Insights', icon: '🎯', color: '#3b82f6' },
    critical: { title: 'Critical Issues', icon: '🔴', color: '#ef4444' },
    warning: { title: 'Needs Improvement', icon: '🟡', color: '#f59e0b' },
    success: { title: 'Excellent Work', icon: '🟢', color: '#22c55e' },
    recommendations: { title: 'Smart Tips', icon: '💡', color: '#8b5cf6' }
  };

  const getDetailedInsights = () => {
    const detailedInsights = [];
    const { tagAnalysis } = results;

    if (!tagAnalysis || tagAnalysis.length === 0) {
      return [{
        type: 'info',
        priority: 'medium',
        title: 'Start Your QA Journey',
        message: 'No QA data found. Start by entering your evaluation data in the QA Calculator tab.',
        recommendation: 'Navigate to the QA Calculator and begin entering your tag evaluation data to receive personalized insights.',
        impact: 'Essential for getting AI-powered recommendations',
        timeToImprove: 'Immediate - just add your data',
        actionItems: [
          'Go to QA Calculator tab',
          'Select a tag category (New Tags, Collision Tags, or Other Tags)',
          'Enter your QA Count, Correct Count, and QA Error for each tag',
          'Return here to see your personalized insights'
        ]
      }];
    }

    // Critical performance issues (accuracy < 70%)
    const criticalTags = tagAnalysis.filter(tag => tag.accuracy < 70 && tag.qaCount > 0);
    criticalTags.forEach(tag => {
      detailedInsights.push({
        type: 'critical',
        priority: 'high',
        tag: tag.tag,
        title: `🚨 Critical: ${tag.tag} Performance Alert`,
        message: `Your ${tag.tag} accuracy is only ${tag.accuracy.toFixed(1)}%. This significantly impacts your overall score and requires immediate attention.`,
        recommendation: `Immediate action required. Review ${tag.tag} documentation thoroughly and practice with multiple examples.`,
        impact: `Costing you ${(85 - tag.accuracy).toFixed(1)} percentage points`,
        timeToImprove: '1-2 weeks with focused practice',
        actionItems: [
          `Study ${tag.tag} evaluation criteria in detail`,
          'Practice with sample events daily',
          'Focus on understanding common mistake patterns',
          'Review edge cases and exceptions',
          'Seek mentorship or additional training'
        ]
      });
    });

    // Performance improvement needed (70-85% accuracy)
    const improvementTags = tagAnalysis.filter(tag => tag.accuracy >= 70 && tag.accuracy < 85 && tag.qaCount > 0);
    improvementTags.forEach(tag => {
      detailedInsights.push({
        type: 'warning',
        priority: 'medium',
        tag: tag.tag,
        title: `⚠️ Improve ${tag.tag} Consistency`,
        message: `${tag.tag} accuracy is ${tag.accuracy.toFixed(1)}%. You're close to the target of 85%+ but need more consistency.`,
        recommendation: `Focus on edge cases and review documentation for subtle criteria differences. Practice with challenging examples.`,
        impact: `Potential gain of ${(90 - tag.accuracy).toFixed(1)} percentage points`,
        timeToImprove: '3-5 days of focused review',
        actionItems: [
          'Review missed cases from recent evaluations',
          'Study borderline examples and edge cases',
          'Practice with challenging scenarios',
          'Double-check evaluation criteria understanding',
          'Create personal notes for difficult cases'
        ]
      });
    });

    // Excellent performance recognition (95%+ accuracy)
    const excellentTags = tagAnalysis.filter(tag => tag.accuracy >= 95 && tag.qaCount > 0);
    if (excellentTags.length > 0) {
      detailedInsights.push({
        type: 'success',
        priority: 'low',
        title: '🎉 Outstanding Performance!',
        message: `Excellent work on ${excellentTags.map(t => t.tag).join(', ')}! Your accuracy is consistently above 95%.`,
        recommendation: 'Maintain your current approach and consider sharing your expertise with team members.',
        impact: 'Contributing significantly to overall score',
        timeToImprove: 'Already at target level',
        actionItems: [
          'Share knowledge with team members',
          'Document your evaluation approach',
          'Mentor others on these tag types',
          'Stay updated with guideline changes',
          'Consider becoming a subject matter expert'
        ]
      });
    }

    // Smart recommendations based on patterns
    const tagCounts = tagAnalysis.filter(tag => tag.qaCount > 0);
    if (tagCounts.length < 5) {
      detailedInsights.push({
        type: 'info',
        priority: 'medium',
        title: '💡 Diversify Your Evaluation Practice',
        message: `You've only evaluated ${tagCounts.length} different tag types. Diversifying your practice will build comprehensive skills.`,
        recommendation: 'Practice with different event types to build well-rounded evaluation capabilities.',
        impact: 'Improved overall evaluation capabilities',
        timeToImprove: '1-2 weeks',
        actionItems: [
          'Try evaluating different tag categories',
          'Focus on less familiar event types',
          'Build confidence across all areas',
          'Request varied practice materials',
          'Set goals for each tag category'
        ]
      });
    }

    // Overall performance pattern analysis
    const overallAccuracy = tagAnalysis.length > 0 ? 
      tagAnalysis.reduce((sum, tag) => sum + tag.accuracy, 0) / tagAnalysis.length : 0;
    
    if (overallAccuracy > 0 && overallAccuracy < 75) {
      detailedInsights.push({
        type: 'warning',
        priority: 'high',
        title: '📈 Systematic Improvement Plan Needed',
        message: `Your average accuracy across all tags is ${overallAccuracy.toFixed(1)}%. A structured approach will help you improve faster.`,
        recommendation: 'Create a comprehensive study plan focusing on your lowest-performing areas first.',
        impact: 'Significant potential for score improvement',
        timeToImprove: '2-4 weeks with consistent practice',
        actionItems: [
          'Identify and prioritize weakest areas',
          'Set daily practice goals (30-60 minutes)',
          'Track improvement progress weekly',
          'Seek mentorship or additional training',
          'Create a study schedule and stick to it'
        ]
      });
    }

    // Category-specific insights
    const categoryPerformance = {
      newTags: tagAnalysis.filter(t => Object.keys(qaData.newTags || {}).includes(t.tag)),
      collisionTags: tagAnalysis.filter(t => Object.keys(qaData.collisionTags || {}).includes(t.tag)),
      otherTags: tagAnalysis.filter(t => Object.keys(qaData.otherTags || {}).includes(t.tag))
    };

    Object.entries(categoryPerformance).forEach(([category, tags]) => {
      if (tags.length > 1) {
        const avgAccuracy = tags.reduce((sum, tag) => sum + tag.accuracy, 0) / tags.length;
        const categoryName = category === 'newTags' ? 'New Tags' : 
                           category === 'collisionTags' ? 'Collision Tags' : 'Other Tags';
        
        if (avgAccuracy < 80) {
          detailedInsights.push({
            type: 'warning',
            priority: 'medium',
            title: `📂 ${categoryName} Category Focus Needed`,
            message: `Your average accuracy in ${categoryName} is ${avgAccuracy.toFixed(1)}%. This category needs dedicated attention.`,
            recommendation: `Allocate extra study time specifically to ${categoryName} documentation and practice examples.`,
            impact: `Category-wide improvement potential`,
            timeToImprove: '1-2 weeks of focused study',
            actionItems: [
              `Review all ${categoryName} documentation`,
              'Practice with varied examples from this category',
              'Understand the common patterns and criteria',
              'Focus on the most challenging tags in this category',
              'Track progress for this category specifically'
            ]
          });
        }
      }
    });

    return detailedInsights;
  };

  const detailedInsights = getDetailedInsights();
  
  const filteredInsights = activeInsight === 'all' 
    ? detailedInsights 
    : detailedInsights.filter(insight => {
        if (activeInsight === 'recommendations') return insight.type === 'info';
        return insight.type === activeInsight;
      });

  const getInsightIcon = (type, priority) => {
    const icons = {
      critical: '🚨',
      warning: '⚠️',
      success: '🎉',
      info: '💡'
    };
    return icons[type] || '📋';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: '#ef4444',
      medium: '#f59e0b',
      low: '#22c55e'
    };
    return colors[priority] || '#6b7280';
  };

  const openDocumentation = (tag) => {
    const link = documentationLinks[tag];
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="ai-performance-coach">
      <div className="coach-header">
        <div className="header-content">
          <div className="header-left">
            <h2>🤖 AI Performance Coach</h2>
            <p>Personalized insights and recommendations based on your QA performance data</p>
          </div>
          
          <div className="performance-overview">
            <div className="overview-stat">
              <span className="stat-number">{results.overallScore?.toFixed(1) || 0}%</span>
              <span className="stat-label">Overall Score</span>
            </div>
            <div className="overview-stat">
              <span className="stat-number">{results.tagAnalysis?.length || 0}</span>
              <span className="stat-label">Tags Evaluated</span>
            </div>
            <div className="overview-stat">
              <span className="stat-number">{filteredInsights.length}</span>
              <span className="stat-label">Active Insights</span>
            </div>
          </div>
        </div>
      </div>

      <div className="coach-content">
        {/* Category Filters */}
        <div className="insight-categories">
          {Object.entries(insightCategories).map(([key, category]) => {
            const count = key === 'all' ? detailedInsights.length : 
              key === 'recommendations' ? detailedInsights.filter(i => i.type === 'info').length :
              detailedInsights.filter(i => i.type === key).length;
            
            return (
              <button
                key={key}
                className={`category-filter ${activeInsight === key ? 'active' : ''}`}
                onClick={() => setActiveInsight(key)}
                style={{ '--category-color': category.color }}
              >
                <span className="category-icon">{category.icon}</span>
                <div className="category-info">
                  <span className="category-title">{category.title}</span>
                  <span className="category-count">{count}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Insights Content */}
        <div className="insights-content">
          {filteredInsights.length === 0 ? (
            <div className="no-insights">
              <div className="no-insights-icon">🎯</div>
              <h3>No insights available for this category</h3>
              <p>Try selecting a different category or add more QA data to get personalized recommendations.</p>
            </div>
          ) : (
            <div className="insights-grid">
              {filteredInsights.map((insight, index) => (
                <div 
                  key={index} 
                  className={`insight-card enhanced ${insight.type} ${expandedCards.has(index) ? 'expanded' : ''}`}
                >
                  <div className="insight-card-header">
                    <div className="insight-meta">
                      <span className="insight-icon">
                        {getInsightIcon(insight.type, insight.priority)}
                      </span>
                      <div className="insight-title-area">
                        <h4>{insight.title}</h4>
                        <span 
                          className="priority-badge"
                          style={{ backgroundColor: getPriorityColor(insight.priority) }}
                        >
                          {insight.priority} priority
                        </span>
                      </div>
                    </div>
                    <button
                      className="expand-toggle"
                      onClick={() => toggleCard(index)}
                    >
                      {expandedCards.has(index) ? '⌃' : '⌄'}
                    </button>
                  </div>

                  <div className="insight-content">
                    <p className="insight-message">{insight.message}</p>
                    
                    {insight.impact && (
                      <div className="insight-impact">
                        <span className="impact-label">📊 Impact:</span>
                        <span className="impact-value">{insight.impact}</span>
                      </div>
                    )}

                    <div className={`insight-details ${expandedCards.has(index) ? 'visible' : ''}`}>
                      {insight.recommendation && (
                        <div className="recommendation-section">
                          <h5>💡 Recommendation:</h5>
                          <p>{insight.recommendation}</p>
                        </div>
                      )}

                      {insight.timeToImprove && (
                        <div className="timeline-section">
                          <span className="timeline-icon">⏱️</span>
                          <span className="timeline-text">Expected improvement time: {insight.timeToImprove}</span>
                        </div>
                      )}

                      {insight.actionItems && (
                        <div className="action-items-section">
                          <h5>✅ Action Items:</h5>
                          <ul className="action-items-list">
                            {insight.actionItems.map((item, itemIndex) => (
                              <li key={itemIndex}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="insight-actions">
                    {insight.tag && (
                      <button
                        className="action-button primary"
                        onClick={() => openDocumentation(insight.tag)}
                      >
                        📖 Study {insight.tag} Guide
                      </button>
                    )}
                    <button
                      className="action-button secondary"
                      onClick={() => toggleCard(index)}
                    >
                      {expandedCards.has(index) ? 'Show Less' : 'Show More'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Performance Summary */}
        {detailedInsights.length > 0 && results.tagAnalysis?.length > 0 && (
          <div className="performance-summary">
            <h3>📈 Performance Summary</h3>
            <div className="summary-grid">
              <div className="summary-card critical">
                <div className="summary-number">{detailedInsights.filter(i => i.type === 'critical').length}</div>
                <div className="summary-label">Critical Issues</div>
                <div className="summary-description">Require immediate attention</div>
              </div>
              <div className="summary-card warning">
                <div className="summary-number">{detailedInsights.filter(i => i.type === 'warning').length}</div>
                <div className="summary-label">Improvement Areas</div>
                <div className="summary-description">Focus for better results</div>
              </div>
              <div className="summary-card success">
                <div className="summary-number">{detailedInsights.filter(i => i.type === 'success').length}</div>
                <div className="summary-label">Excellent Areas</div>
                <div className="summary-description">Maintain current level</div>
              </div>
              <div className="summary-card info">
                <div className="summary-number">{detailedInsights.filter(i => i.type === 'info').length}</div>
                <div className="summary-label">Smart Tips</div>
                <div className="summary-description">General recommendations</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIPerformanceCoach;
