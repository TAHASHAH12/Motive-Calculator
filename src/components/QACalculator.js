import React, { useState, useCallback, useEffect } from 'react';
import { useQACalculations } from '../hooks/useCalculations';
import './QACalculator.css';

const QACalculator = () => {
  const [calculationType, setCalculationType] = useState('weekly');
  const [activeCategory, setActiveCategory] = useState('newTags');
  const [selectedTag, setSelectedTag] = useState(null);
  
  const tagDescriptions = {
    RRL: 'Running a Red Light',
    LC: 'Lane Cutoff',
    CII: 'Close Following/Tailgating',
    DFCO: 'Driver Facing Camera Obstruction',
    RFCO: 'Road Facing Camera Obstruction',
    FCW: 'Forward Collision Warning',
    Smoking: 'Smoking Detection',
    AD: 'Positive Driving Behavior (Acceleration)',
    SD: 'Positive Driving Behavior (Deceleration)',
    'C/PC': 'Collision/Possible Collision',
    'NC': 'Near Collision',
    USP: 'Unsafe Parking',
    Drowsiness: 'Driver Drowsiness Detection',
    SBV: 'Seat Belt Violation',
    CP: 'Cellphone Usage',
    CF: 'Close Following',
    SSV: 'Stop Sign Violation',
    Distraction: 'Driver Distraction',
    ULC: 'Unsafe Lane Change'
  };

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

  // Updated tag states with FCW in newTags and USP in otherTags
  const [newTags, setNewTags] = useState({
    RRL: { qaCount: 0, correctCount: 0, qaError: 0 },
    LC: { qaCount: 0, correctCount: 0, qaError: 0 },
    CII: { qaCount: 0, correctCount: 0, qaError: 0 },
    DFCO: { qaCount: 0, correctCount: 0, qaError: 0 },
    RFCO: { qaCount: 0, correctCount: 0, qaError: 0 },
    FCW: { qaCount: 0, correctCount: 0, qaError: 0 }, // FCW added to New Tags
    Smoking: { qaCount: 0, correctCount: 0, qaError: 0 },
    AD: { qaCount: 0, correctCount: 0, qaError: 0 },
    SD: { qaCount: 0, correctCount: 0, qaError: 0 }
  });

  const [collisionTags, setCollisionTags] = useState({
    'C/PC': { qaCount: 0, correctCount: 0, qaError: 0 },
    'NC': { qaCount: 0, correctCount: 0, qaError: 0 }
  });

  const [otherTags, setOtherTags] = useState({
    USP: { qaCount: 0, correctCount: 0, qaError: 0 }, // USP moved to Other Tags
    Drowsiness: { qaCount: 0, correctCount: 0, qaError: 0 },
    SBV: { qaCount: 0, correctCount: 0, qaError: 0 },
    CP: { qaCount: 0, correctCount: 0, qaError: 0 },
    CF: { qaCount: 0, correctCount: 0, qaError: 0 },
    SSV: { qaCount: 0, correctCount: 0, qaError: 0 },
    Distraction: { qaCount: 0, correctCount: 0, qaError: 0 },
    ULC: { qaCount: 0, correctCount: 0, qaError: 0 }
  });

  const results = useQACalculations(newTags, collisionTags, otherTags);

  const categories = {
    newTags: {
      title: 'New Tags QA',
      weightage: '20%',
      icon: '🏷️',
      data: newTags,
      setState: setNewTags
    },
    collisionTags: {
      title: 'Collision Tags QA',
      weightage: '30%',
      icon: '💥',
      data: collisionTags,
      setState: setCollisionTags
    },
    otherTags: {
      title: 'Other Tags QA',
      weightage: '50%',
      icon: '📋',
      data: otherTags,
      setState: setOtherTags
    }
  };

  // Save QA data to localStorage whenever it changes
  useEffect(() => {
    const qaData = {
      newTags,
      collisionTags,
      otherTags
    };
    localStorage.setItem('motive-qa-data', JSON.stringify(qaData));
  }, [newTags, collisionTags, otherTags]);

  // Load QA data from localStorage on component mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('motive-qa-data');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        if (parsedData.newTags) setNewTags(parsedData.newTags);
        if (parsedData.collisionTags) setCollisionTags(parsedData.collisionTags);
        if (parsedData.otherTags) setOtherTags(parsedData.otherTags);
      }
    } catch (error) {
      console.error('Error loading QA data:', error);
    }
  }, []);

  const handleInputChange = useCallback((category, tag, field, value) => {
    const numValue = Math.max(0, parseFloat(value) || 0);
    
    categories[category].setState(prev => ({
      ...prev,
      [tag]: { 
        ...prev[tag], 
        [field]: numValue 
      }
    }));
  }, [categories]);

  const resetForm = useCallback(() => {
    const emptyData = { qaCount: 0, correctCount: 0, qaError: 0 };
    
    Object.keys(categories).forEach(categoryKey => {
      const category = categories[categoryKey];
      category.setState(Object.keys(category.data).reduce((acc, key) => {
        acc[key] = { ...emptyData };
        return acc;
      }, {}));
    });
  }, [categories]);

  const getScoreGrade = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Average';
    if (score >= 60) return 'Below Average';
    return 'Needs Improvement';
  };

  const getPerformanceColor = (accuracy) => {
    if (accuracy >= 95) return '#22c55e';
    if (accuracy >= 85) return '#3b82f6';
    if (accuracy >= 70) return '#f59e0b';
    if (accuracy >= 60) return '#f97316';
    return '#ef4444';
  };

  const openDocumentation = (tag) => {
    const link = documentationLinks[tag];
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  const getCurrentCategoryData = () => {
    return categories[activeCategory].data;
  };

  const renderTagCard = (tag, data) => {
    const accuracy = data.qaCount > 0 ? ((data.correctCount + data.qaError) / data.qaCount) * 100 : 0;
    const hasData = data.qaCount > 0;
    
    return (
      <div key={tag} className={`tag-card ${selectedTag === tag ? 'selected' : ''} ${hasData ? 'has-data' : ''}`}>
        <div className="tag-card-header">
          <div className="tag-info">
            <h4>{tag}</h4>
            <p className="tag-description">{tagDescriptions[tag]}</p>
          </div>
          <div className="tag-status">
            {hasData ? (
              <div className="accuracy-display" style={{ color: getPerformanceColor(accuracy) }}>
                {accuracy.toFixed(1)}%
              </div>
            ) : (
              <div className="no-data">No Data</div>
            )}
          </div>
        </div>
        
        <div className="tag-card-body">
          <div className="input-row">
            <div className="input-group">
              <label>QA Count</label>
              <input
                type="number"
                min="0"
                value={data.qaCount}
                onChange={(e) => handleInputChange(activeCategory, tag, 'qaCount', e.target.value)}
                className="compact-input"
                placeholder="0"
              />
            </div>
            <div className="input-group">
              <label>Correct</label>
              <input
                type="number"
                min="0"
                max={data.qaCount}
                value={data.correctCount}
                onChange={(e) => handleInputChange(activeCategory, tag, 'correctCount', e.target.value)}
                className="compact-input"
                placeholder="0"
              />
            </div>
            <div className="input-group">
              <label>QA Error</label>
              <input
                type="number"
                min="0"
                value={data.qaError}
                onChange={(e) => handleInputChange(activeCategory, tag, 'qaError', e.target.value)}
                className="compact-input"
                placeholder="0"
              />
            </div>
          </div>
          
          <div className="tag-actions">
            <button 
              className="doc-button"
              onClick={() => openDocumentation(tag)}
              title="View Documentation"
            >
              📖 Guide
            </button>
            {hasData && accuracy < 80 && (
              <span className="improvement-badge">⚠️ Needs Focus</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="qa-calculator modern">
      <div className="calculator-header">
        <div className="header-left">
          <h2>🎯 QA Score Calculator</h2>
          <p>Smart performance tracking with intelligent insights</p>
        </div>
        
        <div className="header-controls">
          <div className="calculation-type">
            <div className="toggle-switch">
              <input
                type="radio"
                id="weekly"
                value="weekly"
                checked={calculationType === 'weekly'}
                onChange={(e) => setCalculationType(e.target.value)}
              />
              <label htmlFor="weekly">Weekly</label>
              <input
                type="radio"
                id="monthly"
                value="monthly"
                checked={calculationType === 'monthly'}
                onChange={(e) => setCalculationType(e.target.value)}
              />
              <label htmlFor="monthly">Monthly</label>
              <div className="toggle-slider"></div>
            </div>
          </div>
          <button className="action-button reset" onClick={resetForm}>
            🔄 Reset All
          </button>
        </div>
      </div>

      <div className="calculator-layout">
        <div className="main-panel">
          {/* Category Navigation */}
          <div className="category-nav">
            {Object.entries(categories).map(([key, category]) => (
              <button
                key={key}
                className={`category-tab ${activeCategory === key ? 'active' : ''}`}
                onClick={() => setActiveCategory(key)}
              >
                <span className="category-icon">{category.icon}</span>
                <div className="category-details">
                  <span className="category-title">{category.title}</span>
                  <span className="category-weight">{category.weightage}</span>
                </div>
                <div className="category-indicator"></div>
              </button>
            ))}
          </div>

          {/* Tag Cards Grid */}
          <div className="tags-container">
            <div className="container-header">
              <h3>{categories[activeCategory].title}</h3>
              <span className="tag-count">
                {Object.keys(getCurrentCategoryData()).length} tags
              </span>
            </div>
            
            <div className="tags-grid">
              {Object.entries(getCurrentCategoryData()).map(([tag, data]) => 
                renderTagCard(tag, data)
              )}
            </div>
          </div>
        </div>

        <div className="sidebar-panel">
          <div className="score-display">
            <div className="overall-score">
              <div className="score-circle">
                <div className="score-value">{results.overallScore.toFixed(1)}%</div>
                <div className="score-label">{getScoreGrade(results.overallScore)}</div>
              </div>
            </div>
            
            <div className="score-breakdown">
              <div className="breakdown-item">
                <span className="breakdown-label">🏷️ New Tags</span>
                <div className="breakdown-bar">
                  <div 
                    className="breakdown-fill" 
                    style={{width: `${Math.min((results.newTagsScore / 20) * 100, 100)}%`}}
                  ></div>
                </div>
                <span className="breakdown-value">{results.newTagsScore.toFixed(1)}/20</span>
              </div>
              
              <div className="breakdown-item">
                <span className="breakdown-label">💥 Collisions</span>
                <div className="breakdown-bar">
                  <div 
                    className="breakdown-fill" 
                    style={{width: `${Math.min((results.collisionScore / 30) * 100, 100)}%`}}
                  ></div>
                </div>
                <span className="breakdown-value">{results.collisionScore.toFixed(1)}/30</span>
              </div>
              
              <div className="breakdown-item">
                <span className="breakdown-label">📋 Other Tags</span>
                <div className="breakdown-bar">
                  <div 
                    className="breakdown-fill" 
                    style={{width: `${Math.min((results.otherTagsScore / 50) * 100, 100)}%`}}
                  ></div>
                </div>
                <span className="breakdown-value">{results.otherTagsScore.toFixed(1)}/50</span>
              </div>
            </div>
          </div>

          {/* AI Coach Prompt */}
          <div className="ai-coach-prompt">
            <div className="prompt-content">
              <h4>🤖 Want AI-Powered Insights?</h4>
              <p>Get personalized recommendations and improvement tips based on your performance data.</p>
              <button 
                className="coach-cta-button"
                onClick={() => {
                  // Navigate to AI Coach tab - you can replace this with your routing method
                  const event = new CustomEvent('navigateToAICoach');
                  window.dispatchEvent(event);
                }}
              >
                Open AI Coach
              </button>
            </div>
          </div>

          <div className="quick-stats">
            <div className="stat-item">
              <span className="stat-number">
                {Object.values({...newTags, ...collisionTags, ...otherTags})
                  .filter(tag => tag.qaCount > 0).length}
              </span>
              <span className="stat-label">Tags with Data</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {Object.values({...newTags, ...collisionTags, ...otherTags})
                  .reduce((sum, tag) => sum + tag.qaCount, 0)}
              </span>
              <span className="stat-label">Total QA Count</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QACalculator;
