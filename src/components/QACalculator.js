import React, { useState, useCallback } from 'react';
import { useQACalculations } from '../hooks/useCalculations';
import './QACalculator.css';

const QACalculator = () => {
  const [calculationType, setCalculationType] = useState('weekly');
  const [selectedTag, setSelectedTag] = useState(null);
  const [showDetailedInsights, setShowDetailedInsights] = useState(false);
  
  // Documentation links and detailed recommendations for each tag
  const tagDocumentation = {
    // New Tags
    RRL: {
      link: 'https://docs.google.com/document/d/1qCMjFlso9fsXPkvXy_Z_FY6o_RK2OVvK_n3AKE4Y2mw/edit',
      commonMistakes: [
        'Missing the exact moment of signal change',
        'Confusing yellow light violations with red light',
        'Not considering traffic flow context'
      ],
      keyPoints: [
        'Vehicle must completely cross the stop line after signal turns red',
        'Check timestamp carefully against signal change',
        'Consider intersection type and visibility'
      ]
    },
    LC: {
      link: 'https://docs.google.com/document/d/1g0xayDpV9CRdw_mXgTJ-zH9cJ2p7l9fAQT937KDDuCQ/edit',
      commonMistakes: [
        'Not identifying the cutting vehicle correctly',
        'Missing the severity of the cutoff',
        'Confusing with normal lane changes'
      ],
      keyPoints: [
        'Focus on sudden, unsafe lane changes',
        'Check for adequate following distance',
        'Verify impact on host vehicle'
      ]
    },
    CII: {
      link: 'https://docs.google.com/document/d/1d80MGZgtSYf_SgcMgeMEftMGWDyjKADRgF9LzWRYUjA/edit',
      commonMistakes: [
        'Incorrect following distance measurement',
        'Not considering traffic conditions',
        'Missing temporal aspects of following'
      ],
      keyPoints: [
        'Measure exact following distance',
        'Consider speed and road conditions',
        'Duration of close following matters'
      ]
    },
    DFCO: {
      link: 'https://docs.google.com/document/d/1yC-QEreUhH-ag-bGJzbFBqn4NCB3Gc6vUuxzq1MA9M8/edit#heading=h.9nlts9t1on0a',
      commonMistakes: [
        'Confusing temporary obstructions with permanent ones',
        'Not checking obstruction percentage',
        'Missing partial obstructions'
      ],
      keyPoints: [
        'Check if obstruction affects driver monitoring',
        'Verify duration of obstruction',
        'Consider lighting conditions'
      ]
    },
    RFCO: {
      link: 'https://docs.google.com/document/d/1yC-QEreUhH-ag-bGJzbFBqn4NCB3Gc6vUuxzq1MA9M8/edit#heading=h.9nlts9t1on0a',
      commonMistakes: [
        'Missing road visibility impact',
        'Not considering weather effects',
        'Incorrect obstruction classification'
      ],
      keyPoints: [
        'Assess impact on road monitoring capability',
        'Check for debris, weather, or equipment issues',
        'Verify timing and duration'
      ]
    },
    FCW: {
      link: 'https://docs.google.com/document/d/1ZUj03wskvfrX-Kw-HLXBf49Q3VyWGgjF5oiCWjrfaNU/edit?pli=1#heading=h.w0gqyhyc8roy',
      commonMistakes: [
        'Not validating actual collision risk',
        'Missing context of traffic situation',
        'Incorrect timing assessment'
      ],
      keyPoints: [
        'Verify genuine collision threat exists',
        'Check vehicle closing speed',
        'Consider driver reaction time available'
      ]
    },
    Smoking: {
      link: 'https://docs.google.com/document/d/1xvLo8PAsh2RVEnKGQPsAXsm_BNmwroWD4wHwiNw74-E/edit?tab=t.0',
      commonMistakes: [
        'Confusing smoking with other activities',
        'Missing smoking gestures or paraphernalia',
        'Not considering lighting conditions'
      ],
      keyPoints: [
        'Look for cigarette, vaping device, or smoke',
        'Check for smoking gestures and posture',
        'Verify visibility and image quality'
      ]
    },
    AD: {
      link: 'https://docs.google.com/document/d/1kLxJ64XHmP9SOz5P_2dPT46jwRsC7LoSVkc3-OGQc_M/edit?tab=t.0#heading=h.yz6h9dvvgx74',
      commonMistakes: [
        'Not recognizing smooth acceleration patterns',
        'Missing context of driving situation',
        'Incorrect positive behavior identification'
      ],
      keyPoints: [
        'Identify gradual, appropriate acceleration',
        'Consider traffic flow and conditions',
        'Verify driving behavior is genuinely positive'
      ]
    },
    SD: {
      link: 'https://docs.google.com/document/d/1kLxJ64XHmP9SOz5P_2dPT46jwRsC7LoSVkc3-OGQc_M/edit?tab=t.0#heading=h.yz6h9dvvgx74',
      commonMistakes: [
        'Not recognizing smooth deceleration',
        'Missing anticipatory driving behaviors',
        'Confusing with emergency braking'
      ],
      keyPoints: [
        'Look for gradual, controlled deceleration',
        'Check for anticipatory driving skills',
        'Ensure behavior demonstrates good driving habits'
      ]
    },
    
    // Collision Tags
    'C/PC': {
      link: 'https://docs.google.com/document/d/1jb_q7nwT-Lradnk-yRZit4M7zP1wCB08/edit',
      commonMistakes: [
        'Incorrect severity classification',
        'Missing collision vs near-miss distinction',
        'Not assessing actual impact'
      ],
      keyPoints: [
        'Determine if actual contact occurred',
        'Assess severity level accurately',
        'Consider all vehicles involved'
      ]
    },
    'NC': {
      link: 'https://docs.google.com/document/d/14vm7NXbF5iPN2celAhsWq2mNH2-dcdUE/edit',
      commonMistakes: [
        'Confusing with actual collisions',
        'Not measuring proximity accurately',
        'Missing evasive actions'
      ],
      keyPoints: [
        'Verify no contact occurred',
        'Measure minimum distance achieved',
        'Check for evasive maneuvers'
      ]
    },
    
    // Other Tags
    USP: {
      link: 'https://docs.google.com/document/d/1f6PFmLnPn93FbulPaiM2yt1Omb4GF-S1_Uq_IAb4mP0/edit?tab=t.0',
      commonMistakes: [
        'Not considering parking location legality',
        'Missing safety implications',
        'Incorrect hazard assessment'
      ],
      keyPoints: [
        'Check if parking creates hazard',
        'Verify parking location regulations',
        'Assess impact on traffic flow'
      ]
    },
    Drowsiness: {
      link: 'https://docs.google.com/document/d/10fCC27rJEwglkX-6Qy8nbKRDCjVeJDyq0mRS03ECj_o/edit',
      commonMistakes: [
        'Confusing drowsiness with other distractions',
        'Not recognizing early drowsiness signs',
        'Missing eye closure patterns'
      ],
      keyPoints: [
        'Look for prolonged eye closures',
        'Check for head nodding or drooping',
        'Verify consistent drowsiness indicators'
      ]
    },
    SBV: {
      link: 'https://docs.google.com/document/d/1Ykcx3k-COnOG68Id6nPe-C4py2YgO2VqHeobboGpD6E/edit',
      commonMistakes: [
        'Not seeing seatbelt under clothing',
        'Missing seatbelt adjustments',
        'Incorrect visibility assessment'
      ],
      keyPoints: [
        'Check entire visible area for seatbelt',
        'Consider clothing and positioning',
        'Verify clear view of driver area'
      ]
    },
    CP: {
      link: 'https://docs.google.com/document/d/1o1QmRPf-1Al7BpkfGjgrYva2lNHqnegg8jwEgEE3P5A/edit',
      commonMistakes: [
        'Missing hands-free usage',
        'Not identifying phone vs other objects',
        'Incorrect interaction assessment'
      ],
      keyPoints: [
        'Identify phone clearly in hand',
        'Check for active interaction',
        'Distinguish from hands-free usage'
      ]
    },
    CF: {
      link: 'https://docs.google.com/document/d/1d80MGZgtSYf_SgcMgeMEftMGWDyjKADRgF9LzWRYUjA/edit',
      commonMistakes: [
        'Incorrect distance measurement',
        'Not considering speed factors',
        'Missing temporal aspects'
      ],
      keyPoints: [
        'Measure following distance accurately',
        'Consider vehicle speeds',
        'Check duration of close following'
      ]
    },
    SSV: {
      link: 'https://docs.google.com/document/d/1bvoPlq355ssrIXzl-iNb6NwnVYr_enE6kPg002Sxt-s/edit',
      commonMistakes: [
        'Not identifying complete stops',
        'Missing rolling stops',
        'Incorrect stop line reference'
      ],
      keyPoints: [
        'Vehicle must come to complete stop',
        'Check position relative to stop line',
        'Verify full stop duration'
      ]
    },
    Distraction: {
      link: 'https://docs.google.com/document/d/1VNIUsLEgVunRqwJPuVx-OgUJF4wVFopybf2b8zrTGG0/edit',
      commonMistakes: [
        'Not identifying distraction source',
        'Missing duration of distraction',
        'Confusing brief glances with distraction'
      ],
      keyPoints: [
        'Identify specific distraction activity',
        'Check duration and frequency',
        'Assess impact on driving attention'
      ]
    },
    ULC: {
      link: 'https://docs.google.com/document/d/1QTLklxpsjHS5zcTEFC8xlCZONmLn-S6VGIHsXzjQY-U/edit',
      commonMistakes: [
        'Not checking blind spots',
        'Missing signal usage',
        'Incorrect safety gap assessment'
      ],
      keyPoints: [
        'Verify adequate gap for lane change',
        'Check for proper signaling',
        'Assess impact on other vehicles'
      ]
    }
  };

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

  const [newTags, setNewTags] = useState({
    RRL: { qaCount: 0, correctCount: 0, qaError: 0 },
    LC: { qaCount: 0, correctCount: 0, qaError: 0 },
    CII: { qaCount: 0, correctCount: 0, qaError: 0 },
    DFCO: { qaCount: 0, correctCount: 0, qaError: 0 },
    RFCO: { qaCount: 0, correctCount: 0, qaError: 0 },
    FCW: { qaCount: 0, correctCount: 0, qaError: 0 },
    Smoking: { qaCount: 0, correctCount: 0, qaError: 0 },
    AD: { qaCount: 0, correctCount: 0, qaError: 0 },
    SD: { qaCount: 0, correctCount: 0, qaError: 0 }
  });

  const [collisionTags, setCollisionTags] = useState({
    'C/PC': { qaCount: 0, correctCount: 0, qaError: 0 },
    'NC': { qaCount: 0, correctCount: 0, qaError: 0 }
  });

  const [otherTags, setOtherTags] = useState({
    USP: { qaCount: 0, correctCount: 0, qaError: 0 },
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

  const getPerformanceColor = (accuracy) => {
    if (accuracy >= 95) return '#22c55e'; // Green
    if (accuracy >= 85) return '#3b82f6'; // Blue
    if (accuracy >= 70) return '#f59e0b'; // Amber
    if (accuracy >= 60) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  const openDocumentation = (tag) => {
    const link = tagDocumentation[tag]?.link;
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  const handleTagSelect = (tag, category) => {
    setSelectedTag({ tag, category });
  };

  const renderTagButtons = (tags, category, title, weightage) => (
    <div className="tag-section">
      <div className="section-header">
        <h3>{title}</h3>
        <span className="weightage-badge">{weightage} Weight</span>
      </div>
      <div className="tag-buttons-grid">
        {Object.entries(tags).map(([tag, data]) => {
          const accuracy = data.qaCount > 0 ? ((data.correctCount + data.qaError) / data.qaCount) * 100 : 0;
          const hasData = data.qaCount > 0;
          
          return (
            <div key={tag} className="tag-button-container">
              <button 
                className={`tag-button ${selectedTag?.tag === tag ? 'active' : ''} ${hasData ? 'has-data' : ''}`}
                onClick={() => handleTagSelect(tag, category)}
                style={hasData ? { borderColor: getPerformanceColor(accuracy) } : {}}
              >
                <div className="tag-info">
                  <h4>{tag}</h4>
                  <p className="tag-description">{tagDescriptions[tag]}</p>
                  <div className="tag-stats">
                    <span className="qa-count">QA: {data.qaCount}</span>
                    <span 
                      className="accuracy"
                      style={hasData ? { color: getPerformanceColor(accuracy) } : {}}
                    >
                      {hasData ? `${accuracy.toFixed(1)}%` : 'N/A'}
                    </span>
                  </div>
                  {hasData && accuracy < 80 && (
                    <div className="performance-warning">⚠️ Needs Attention</div>
                  )}
                </div>
                <div className="tag-actions">
                  <button 
                    className="doc-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openDocumentation(tag);
                    }}
                    title="View Documentation"
                  >
                    📖
                  </button>
                </div>
              </button>
            </div>
          );
        })}
      </div>
      
      {selectedTag && selectedTag.category === category && (
        <div className="tag-input-form">
          <h4>Enter data for: {selectedTag.tag} - {tagDescriptions[selectedTag.tag]}</h4>
          <div className="input-form-grid">
            <div className="input-field">
              <label>QA Count</label>
              <input
                type="number"
                min="0"
                value={tags[selectedTag.tag].qaCount}
                onChange={(e) => handleInputChange(category, selectedTag.tag, 'qaCount', e.target.value)}
              />
            </div>
            <div className="input-field">
              <label>Correct Count</label>
              <input
                type="number"
                min="0"
                max={tags[selectedTag.tag].qaCount}
                value={tags[selectedTag.tag].correctCount}
                onChange={(e) => handleInputChange(category, selectedTag.tag, 'correctCount', e.target.value)}
              />
            </div>
            <div className="input-field">
              <label>QA Error</label>
              <input
                type="number"
                min="0"
                value={tags[selectedTag.tag].qaError}
                onChange={(e) => handleInputChange(category, selectedTag.tag, 'qaError', e.target.value)}
              />
            </div>
          </div>
          
          {/* Smart Recommendations */}
          {tagDocumentation[selectedTag.tag] && (
            <div className="smart-recommendations">
              <h5>📋 Common Mistakes to Avoid:</h5>
              <ul>
                {tagDocumentation[selectedTag.tag].commonMistakes.map((mistake, index) => (
                  <li key={index}>{mistake}</li>
                ))}
              </ul>
              
              <h5>🎯 Key Points to Remember:</h5>
              <ul>
                {tagDocumentation[selectedTag.tag].keyPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="form-actions">
            <button 
              className="doc-link-button"
              onClick={() => openDocumentation(selectedTag.tag)}
            >
              📖 View Complete Documentation
            </button>
            <button 
              className="close-form-button"
              onClick={() => setSelectedTag(null)}
            >
              ✓ Done
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="qa-calculator">
      <div className="calculator-header">
        <div className="header-left">
          <h2>QA Score Calculator</h2>
          <p>AI-powered insights and recommendations based on your performance</p>
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
          {renderTagButtons(newTags, 'newTags', 'New Tags QA', '20%')}
          {renderTagButtons(collisionTags, 'collisionTags', 'Collision Tags QA', '30%')}
          {renderTagButtons(otherTags, 'otherTags', 'Other Tags QA', '50%')}
        </div>

        <div className="results-section">
          <div className="results-card">
            <h3>Performance Analysis</h3>
            
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

            {/* Intelligent Insights */}
            {results.insights && results.insights.length > 0 && (
              <div className="intelligent-insights">
                <h4>🤖 AI-Powered Insights</h4>
                <div className="insights-list">
                  {results.insights.slice(0, 3).map((insight, index) => (
                    <div key={index} className={`insight ${insight.type}`}>
                      <div className="insight-header">
                        <h5>{insight.title}</h5>
                        <span className={`priority-badge ${insight.priority}`}>
                          {insight.priority === 'high' ? '🔴' : insight.priority === 'medium' ? '🟡' : '🟢'}
                        </span>
                      </div>
                      <p className="insight-message">{insight.message}</p>
                      <p className="insight-recommendation">
                        <strong>💡 Recommendation:</strong> {insight.recommendation}
                      </p>
                      {insight.tag && (
                        <button
                          className="insight-action"
                          onClick={() => openDocumentation(insight.tag)}
                        >
                          📖 Study {insight.tag} Guidelines
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Performance Analysis Table */}
            {results.tagAnalysis && results.tagAnalysis.length > 0 && (
              <div className="performance-analysis">
                <div className="analysis-header">
                  <h4>📊 Detailed Performance Analysis</h4>
                  <button 
                    className="toggle-details"
                    onClick={() => setShowDetailedInsights(!showDetailedInsights)}
                  >
                    {showDetailedInsights ? '📄 Hide Details' : '📈 Show Details'}
                  </button>
                </div>
                
                {showDetailedInsights && (
                  <div className="analysis-table">
                    <div className="table-header">
                      <div>Tag</div>
                      <div>Accuracy</div>
                      <div>QA Count</div>
                      <div>Status</div>
                      <div>Action</div>
                    </div>
                    {results.tagAnalysis.map((tag, index) => (
                      <div key={index} className="table-row">
                        <div className="tag-name">{tag.tag}</div>
                        <div 
                          className="accuracy-cell"
                          style={{ color: getPerformanceColor(tag.accuracy) }}
                        >
                          {tag.accuracy.toFixed(1)}%
                        </div>
                        <div>{tag.qaCount}</div>
                        <div className={`status ${tag.performanceLevel}`}>
                          {tag.isLagging ? '🔴 Critical' : 
                           tag.needsImprovement ? '🟡 Improve' : '🟢 Good'}
                        </div>
                        <div>
                          <button
                            className="study-button"
                            onClick={() => openDocumentation(tag.tag)}
                          >
                            📚 Study
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="documentation-note">
              <p>💡 <strong>Pro Tip:</strong> Tags with accuracy below 80% are highlighted. Click 📖 for detailed guidelines and common mistake patterns.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QACalculator;
