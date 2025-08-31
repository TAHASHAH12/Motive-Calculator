import React, { useState, useCallback } from 'react';
import { useQACalculations } from '../hooks/useCalculations';
import './QACalculator.css';

const QACalculator = () => {
  const [calculationType, setCalculationType] = useState('weekly');
  
  // UPDATED: New Tags QA Data - Added FCW, Removed USP
  const [newTags, setNewTags] = useState({
    RRL: { qaCount: 0, correctCount: 0, qaError: 0 },
    LC: { qaCount: 0, correctCount: 0, qaError: 0 },
    CII: { qaCount: 0, correctCount: 0, qaError: 0 },
    DFCO: { qaCount: 0, correctCount: 0, qaError: 0 },
    RFCO: { qaCount: 0, correctCount: 0, qaError: 0 },
    FCW: { qaCount: 0, correctCount: 0, qaError: 0 }, // Added FCW
    Smoking: { qaCount: 0, correctCount: 0, qaError: 0 },
    AD: { qaCount: 0, correctCount: 0, qaError: 0 },
    SD: { qaCount: 0, correctCount: 0, qaError: 0 }
  });

  // Collision Tags QA Data (unchanged)
  const [collisionTags, setCollisionTags] = useState({
    'C/PC': { qaCount: 0, correctCount: 0, qaError: 0 },
    'NC': { qaCount: 0, correctCount: 0, qaError: 0 }
  });

  // UPDATED: Other Tags QA Data - Added USP
  const [otherTags, setOtherTags] = useState({
    USP: { qaCount: 0, correctCount: 0, qaError: 0 }, // Moved USP from New Tags
    Drowsiness: { qaCount: 0, correctCount: 0, qaError: 0 },
    SBV: { qaCount: 0, correctCount: 0, qaError: 0 },
    CP: { qaCount: 0, correctCount: 0, qaError: 0 },
    CF: { qaCount: 0, correctCount: 0, qaError: 0 },
    SSV: { qaCount: 0, correctCount: 0, qaError: 0 },
    Distraction: { qaCount: 0, correctCount: 0, qaError: 0 },
    ULC: { qaCount: 0, correctCount: 0, qaError: 0 }
  });

  const results = useQACalculations(newTags, collisionTags, otherTags);

  const handleInputChange = useCallback((category, tag, field, value) => {
    const numValue = Math.max(0, parseFloat(value) || 0);
    
    const updateState = (setState) => {
      setState(prev => ({
        ...prev,
        [tag]: { 
          ...prev[tag], 
          [field]: numValue 
        }
      }));
    };

    switch (category) {
      case 'newTags':
        updateState(setNewTags);
        break;
      case 'collisionTags':
        updateState(setCollisionTags);
        break;
      case 'otherTags':
        updateState(setOtherTags);
        break;
      default:
        break;
    }
  }, []);

  const resetForm = useCallback(() => {
    const emptyData = { qaCount: 0, correctCount: 0, qaError: 0 };
    
    setNewTags(Object.keys(newTags).reduce((acc, key) => {
      acc[key] = { ...emptyData };
      return acc;
    }, {}));
    
    setCollisionTags(Object.keys(collisionTags).reduce((acc, key) => {
      acc[key] = { ...emptyData };
      return acc;
    }, {}));
    
    setOtherTags(Object.keys(otherTags).reduce((acc, key) => {
      acc[key] = { ...emptyData };
      return acc;
    }, {}));
  }, [newTags, collisionTags, otherTags]);

  const getScoreGrade = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Average';
    if (score >= 60) return 'Below Average';
    return 'Needs Improvement';
  };

  const renderTagInputs = (tags, category, title, weightage) => (
    <div className="tag-section">
      <div className="section-header">
        <h3>{title}</h3>
        <span className="weightage-badge">{weightage} Weight</span>
      </div>
      <div className="tags-grid">
        {Object.entries(tags).map(([tag, data]) => (
          <div key={tag} className="tag-input-card">
            <div className="tag-header">
              <h4>{tag}</h4>
              <div className="accuracy-badge">
                {data.qaCount > 0 ? 
                  `${(((data.correctCount + data.qaError) / data.qaCount) * 100).toFixed(1)}%` 
                  : 'N/A'
                }
              </div>
            </div>
            
            <div className="input-grid">
              <div className="input-field">
                <label>QA Count</label>
                <input
                  type="number"
                  min="0"
                  value={data.qaCount}
                  onChange={(e) => handleInputChange(category, tag, 'qaCount', e.target.value)}
                />
              </div>
              <div className="input-field">
                <label>Correct</label>
                <input
                  type="number"
                  min="0"
                  max={data.qaCount}
                  value={data.correctCount}
                  onChange={(e) => handleInputChange(category, tag, 'correctCount', e.target.value)}
                />
              </div>
              <div className="input-field">
                <label>QA Error</label>
                <input
                  type="number"
                  min="0"
                  value={data.qaError}
                  onChange={(e) => handleInputChange(category, tag, 'qaError', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="qa-calculator">
      <div className="calculator-header">
        <div className="header-left">
          <h2>QA Score Calculator</h2>
          <p>Calculate your quality assurance performance score</p>
        </div>
        
        <div className="header-controls">
          <div className="calculation-type">
            <div className="radio-group">
              <label className={`radio-label ${calculationType === 'weekly' ? 'active' : ''}`}>
                <input
                  type="radio"
                  value="weekly"
                  checked={calculationType === 'weekly'}
                  onChange={(e) => setCalculationType(e.target.value)}
                />
                <span className="radio-custom"></span>
                Weekly
              </label>
              <label className={`radio-label ${calculationType === 'monthly' ? 'active' : ''}`}>
                <input
                  type="radio"
                  value="monthly"
                  checked={calculationType === 'monthly'}
                  onChange={(e) => setCalculationType(e.target.value)}
                />
                <span className="radio-custom"></span>
                Monthly
              </label>
            </div>
          </div>
          <button className="reset-btn" onClick={resetForm}>
            <span>🔄</span>
            Reset All
          </button>
        </div>
      </div>

      <div className="calculator-content">
        <div className="inputs-section">
          {renderTagInputs(newTags, 'newTags', 'New Tags QA', '20%')}
          {renderTagInputs(collisionTags, 'collisionTags', 'Collision Tags QA', '30%')}
          {renderTagInputs(otherTags, 'otherTags', 'Other Tags QA', '50%')}
        </div>

        <div className="results-section">
          <div className="results-card">
            <h3>Performance Summary</h3>
            
            <div className="score-overview">
              <div className="overall-score">
                <div className="score-circle">
                  <div className="score-value">{results.overallScore.toFixed(1)}%</div>
                  <div className="score-grade">{getScoreGrade(results.overallScore)}</div>
                </div>
              </div>
              
              <div className="score-breakdown">
                <div className="score-item">
                  <div className="score-label">New Tags</div>
                  <div className="score-bar">
                    <div 
                      className="score-fill new-tags" 
                      style={{width: `${Math.min((results.newTagsScore / 20) * 100, 100)}%`}}
                    ></div>
                  </div>
                  <div className="score-text">{results.newTagsScore.toFixed(1)}/20%</div>
                </div>
                
                <div className="score-item">
                  <div className="score-label">Collision Tags</div>
                  <div className="score-bar">
                    <div 
                      className="score-fill collision" 
                      style={{width: `${Math.min((results.collisionScore / 30) * 100, 100)}%`}}
                    ></div>
                  </div>
                  <div className="score-text">{results.collisionScore.toFixed(1)}/30%</div>
                </div>
                
                <div className="score-item">
                  <div className="score-label">Other Tags</div>
                  <div className="score-bar">
                    <div 
                      className="score-fill other-tags" 
                      style={{width: `${Math.min((results.otherTagsScore / 50) * 100, 100)}%`}}
                    ></div>
                  </div>
                  <div className="score-text">{results.otherTagsScore.toFixed(1)}/50%</div>
                </div>
              </div>
            </div>

            <div className="performance-insights">
              <h4>Performance Insights</h4>
              <div className="insights-list">
                {results.overallScore >= 90 && (
                  <div className="insight excellent">🎉 Excellent performance! Keep up the great work.</div>
                )}
                {results.overallScore >= 80 && results.overallScore < 90 && (
                  <div className="insight good">👍 Good performance! Small improvements can make a big difference.</div>
                )}
                {results.overallScore < 80 && (
                  <div className="insight needs-improvement">💡 Focus on areas that need improvement for better results.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QACalculator;
