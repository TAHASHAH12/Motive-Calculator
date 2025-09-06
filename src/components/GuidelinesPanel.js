import React, { useState } from 'react';
import './GuidelinesPanel.css';

const GuidelinesPanel = () => {
  const [selectedCategory, setSelectedCategory] = useState('road-facing');
  const [searchTerm, setSearchTerm] = useState('');

  const documentationData = {
    'road-facing': {
      title: 'Road Facing Events',
      description: 'Documentation for road-facing camera events and AI detections',
      icon: '🛣️',
      documents: [
        {
          id: 'cf-tailgating',
          title: 'Close Following/Tailgating',
          description: 'Guidelines for identifying and evaluating tailgating events',
          link: 'https://docs.google.com/document/d/1d80MGZgtSYf_SgcMgeMEftMGWDyjKADRgF9LzWRYUjA/edit',
          tags: ['CII', 'CF'],
          keyPoints: [
            'Measure exact following distance using reference points',
            'Consider vehicle speeds and road conditions',
            'Evaluate duration of close following behavior',
            'Check for traffic flow context'
          ],
          commonMistakes: [
            'Incorrect distance measurement techniques',
            'Not considering speed differential',
            'Missing temporal aspects of following',
            'Ignoring traffic conditions'
          ]
        },
        {
          id: 'lane-cutoff',
          title: 'Lane Cutoff',
          description: 'Identification and assessment of unsafe lane changes that cut off other vehicles',
          link: 'https://docs.google.com/document/d/1g0xayDpV9CRdw_mXgTJ-zH9cJ2p7l9fAQT937KDDuCQ/edit',
          tags: ['LC'],
          keyPoints: [
            'Focus on sudden, unsafe lane changes',
            'Check for adequate following distance after maneuver',
            'Verify impact on host vehicle behavior',
            'Assess severity of the cutoff action'
          ],
          commonMistakes: [
            'Not identifying the cutting vehicle correctly',
            'Missing the severity assessment',
            'Confusing with normal lane changes',
            'Incorrect timing evaluation'
          ]
        },
        {
          id: 'unsafe-lane-change',
          title: 'Unsafe Lane Change (ULC)',
          description: 'Guidelines for evaluating unsafe lane change maneuvers by the host vehicle',
          link: 'https://docs.google.com/document/d/1QTLklxpsjHS5zcTEFC8xlCZONmLn-S6VGIHsXzjQY-U/edit',
          tags: ['ULC'],
          keyPoints: [
            'Verify adequate gap for lane change',
            'Check for proper signaling usage',
            'Assess impact on other vehicles',
            'Consider blind spot checking'
          ],
          commonMistakes: [
            'Not checking blind spot verification',
            'Missing signal usage evaluation',
            'Incorrect safety gap assessment',
            'Not considering other vehicle reactions'
          ]
        },
        {
          id: 'stop-sign-violation',
          title: 'Stop Sign Violation (SSV)',
          description: 'Criteria for identifying violations at stop signs',
          link: 'https://docs.google.com/document/d/1bvoPlq355ssrIXzl-iNb6NwnVYr_enE6kPg002Sxt-s/edit',
          tags: ['SSV'],
          keyPoints: [
            'Vehicle must come to complete stop',
            'Check position relative to stop line',
            'Verify full stop duration (minimum 3 seconds)',
            'Assess intersection visibility'
          ],
          commonMistakes: [
            'Not identifying complete stops vs rolling stops',
            'Missing stop line reference points',
            'Incorrect stop duration measurement',
            'Not considering visibility factors'
          ]
        },
        {
          id: 'red-light-running',
          title: 'Running a Red Light (RRL)',
          description: 'Guidelines for red light violation detection and evaluation',
          link: 'https://docs.google.com/document/d/1qCMjFlso9fsXPkvXy_Z_FY6o_RK2OVvK_n3AKE4Y2mw/edit',
          tags: ['RRL'],
          keyPoints: [
            'Vehicle must completely cross stop line after signal turns red',
            'Check timestamp carefully against signal change',
            'Consider intersection type and visibility conditions',
            'Evaluate traffic flow context'
          ],
          commonMistakes: [
            'Missing exact moment of signal change',
            'Confusing yellow light violations',
            'Not considering traffic flow context',
            'Incorrect timing assessment'
          ]
        },
        {
          id: 'forward-collision-warning',
          title: 'Forward Collision Warning (FCW)',
          description: 'FCW event validation and assessment criteria',
          link: 'https://docs.google.com/document/d/1ZUj03wskvfrX-Kw-HLXBf49Q3VyWGgjF5oiCWjrfaNU/edit?pli=1#heading=h.w0gqyhyc8roy',
          tags: ['FCW'],
          keyPoints: [
            'Verify genuine collision threat exists',
            'Check vehicle closing speed and distance',
            'Consider driver reaction time available',
            'Assess road and weather conditions'
          ],
          commonMistakes: [
            'Not validating actual collision risk',
            'Missing context of traffic situation',
            'Incorrect timing assessment',
            'Not considering system sensitivity'
          ]
        },
        {
          id: 'near-collision',
          title: 'Near Collision (NC)',
          description: 'Near collision event identification and severity assessment',
          link: 'https://docs.google.com/document/d/14vm7NXbF5iPN2celAhsWq2mNH2-dcdUE/edit',
          tags: ['NC'],
          keyPoints: [
            'Verify no contact occurred',
            'Measure minimum distance achieved',
            'Check for evasive maneuvers by any party',
            'Assess potential for collision without intervention'
          ],
          commonMistakes: [
            'Confusing with actual collisions',
            'Not measuring proximity accurately',
            'Missing evasive actions',
            'Incorrect severity classification'
          ]
        },
        {
          id: 'near-collision-support',
          title: 'Near Collision | Support Documentation',
          description: 'Additional support materials for near collision evaluation',
          link: 'https://docs.google.com/document/d/1joK06daF2RuEM2u_MehoI8cjtpMlkQYozU0oiPwi7F0/edit#',
          tags: ['NC'],
          keyPoints: [
            'Use multiple camera angles when available',
            'Cross-reference with other sensor data',
            'Document all parties involved',
            'Consider environmental factors'
          ]
        },
        {
          id: 'unsafe-parking',
          title: 'Unsafe Parking (USP)',
          description: 'Guidelines for identifying unsafe parking situations',
          link: 'https://docs.google.com/document/d/1f6PFmLnPn93FbulPaiM2yt1Omb4GF-S1_Uq_IAb4mP0/edit?tab=t.0',
          tags: ['USP'],
          keyPoints: [
            'Check if parking creates hazard for other vehicles',
            'Verify parking location against regulations',
            'Assess impact on traffic flow',
            'Consider visibility and safety factors'
          ],
          commonMistakes: [
            'Not considering parking location legality',
            'Missing safety implications',
            'Incorrect hazard assessment',
            'Not evaluating traffic impact'
          ]
        },
        {
          id: 'positive-driving',
          title: 'Positive Driving Behavior (AD + SD)',
          description: 'Recognition criteria for positive driving behaviors',
          link: 'https://docs.google.com/document/d/1kLxJ64XHmP9SOz5P_2dPT46jwRsC7LoSVkc3-OGQc_M/edit?tab=t.0#heading=h.yz6h9dvvgx74',
          tags: ['AD', 'SD'],
          keyPoints: [
            'Identify smooth acceleration/deceleration patterns',
            'Consider traffic flow and conditions',
            'Verify behavior is genuinely positive',
            'Look for anticipatory driving skills'
          ]
        }
      ]
    },
    'driver-facing': {
      title: 'Driver Facing Events',
      description: 'Documentation for driver-facing camera events and behavior monitoring',
      icon: '👤',
      documents: [
        {
          id: 'distraction',
          title: 'Driver Distraction',
          description: 'Guidelines for identifying and categorizing driver distraction events',
          link: 'https://docs.google.com/document/d/1VNIUsLEgVunRqwJPuVx-OgUJF4wVFopybf2b8zrTGG0/edit',
          tags: ['Distraction'],
          keyPoints: [
            'Identify specific distraction activity',
            'Check duration and frequency of distraction',
            'Assess impact on driving attention',
            'Consider severity of distraction type'
          ],
          commonMistakes: [
            'Not identifying distraction source clearly',
            'Missing duration assessment',
            'Confusing brief glances with sustained distraction',
            'Not considering distraction severity'
          ]
        },
        {
          id: 'cellphone-usage',
          title: 'Cellphone Usage Definition',
          description: 'Product guidelines for cellphone usage detection and classification',
          link: 'https://docs.google.com/document/d/1o1QmRPf-1Al7BpkfGjgrYva2lNHqnegg8jwEgEE3P5A/edit',
          tags: ['CP'],
          keyPoints: [
            'Identify phone clearly in driver\'s hand',
            'Check for active interaction with device',
            'Distinguish from hands-free usage',
            'Assess driver attention impact'
          ],
          commonMistakes: [
            'Missing hands-free vs handheld distinction',
            'Not identifying phone vs other objects',
            'Incorrect interaction assessment',
            'Not considering mounting/holder usage'
          ]
        },
        {
          id: 'drowsiness',
          title: 'Drowsiness Detection (Work In Progress)',
          description: 'Criteria for identifying driver drowsiness indicators',
          link: 'https://docs.google.com/document/d/10fCC27rJEwglkX-6Qy8nbKRDCjVeJDyq0mRS03ECj_o/edit',
          tags: ['Drowsiness'],
          keyPoints: [
            'Look for prolonged eye closures (PERCLOS)',
            'Check for head nodding or drooping',
            'Verify consistent drowsiness indicators',
            'Consider lighting and image quality'
          ],
          commonMistakes: [
            'Confusing drowsiness with other distractions',
            'Not recognizing early drowsiness signs',
            'Missing eye closure duration patterns',
            'Not considering lighting conditions'
          ]
        },
        {
          id: 'seatbelt-violation',
          title: 'Seat Belt Violation Definition',
          description: 'Guidelines for seat belt violation detection',
          link: 'https://docs.google.com/document/d/1Ykcx3k-COnOG68Id6nPe-C4py2YgO2VqHeobboGpD6E/edit',
          tags: ['SBV'],
          keyPoints: [
            'Check entire visible driver area for seatbelt',
            'Consider clothing and positioning factors',
            'Verify clear view of driver torso area',
            'Look for seatbelt across chest and lap'
          ],
          commonMistakes: [
            'Not seeing seatbelt under clothing',
            'Missing seatbelt behind driver',
            'Incorrect visibility assessment',
            'Not checking for proper positioning'
          ]
        },
        {
          id: 'smoking-detection',
          title: 'Smoking - AI Event',
          description: 'AI-based smoking detection criteria and validation',
          link: 'https://docs.google.com/document/d/1xvLo8PAsh2RVEnKGQPsAXsm_BNmwroWD4wHwiNw74-E/edit?tab=t.0',
          tags: ['Smoking'],
          keyPoints: [
            'Look for cigarette, vaping device, or visible smoke',
            'Check for smoking gestures and posture',
            'Verify visibility and image quality',
            'Consider lighting conditions'
          ],
          commonMistakes: [
            'Confusing smoking with other hand-to-mouth activities',
            'Missing smoking paraphernalia',
            'Not considering lighting effects',
            'Misidentifying vapor vs smoke'
          ]
        }
      ]
    },
    'camera-issues': {
      title: 'Camera & Technical Issues',
      description: 'Documentation for camera obstruction and technical problems',
      icon: '📷',
      documents: [
        {
          id: 'camera-obstruction',
          title: 'Camera Obstruction - AI Event',
          description: 'Guidelines for camera obstruction detection (both driver and road facing)',
          link: 'https://docs.google.com/document/d/1yC-QEreUhH-ag-bGJzbFBqn4NCB3Gc6vUuxzq1MA9M8/edit#heading=h.9nlts9t1on0a',
          tags: ['DFCO', 'RFCO'],
          keyPoints: [
            'Check if obstruction affects monitoring capability',
            'Verify duration and percentage of obstruction',
            'Consider lighting and weather conditions',
            'Assess impact on event detection'
          ],
          commonMistakes: [
            'Confusing temporary with permanent obstructions',
            'Not checking obstruction percentage',
            'Missing partial obstructions',
            'Not considering impact on functionality'
          ]
        },
        {
          id: 'camera-obstruction-examples',
          title: 'Camera Obstruction - Examples',
          description: 'Visual examples and case studies of camera obstruction events',
          link: 'https://docs.google.com/document/d/1WfAHoHbi281jE9BongPSpF-n0uAoRgQC7aAoFHSMaXk/edit',
          tags: ['DFCO', 'RFCO'],
          keyPoints: [
            'Study various obstruction types and patterns',
            'Learn from real-world examples',
            'Understand edge cases and exceptions',
            'Practice identification techniques'
          ]
        },
        {
          id: 'invalid-events',
          title: 'Invalid Event - All Types',
          description: 'Comprehensive guide for identifying invalid events across all categories',
          link: 'https://docs.google.com/document/d/1zZ9qIQUsszWibazTKFiZrbHT30F8OcAn17vtgUINQ4o/edit#heading=h.vtl1asmmsqdp',
          tags: ['General'],
          keyPoints: [
            'Understand criteria for event validity',
            'Learn common invalid event patterns',
            'Apply consistent validation standards',
            'Document invalidation reasoning clearly'
          ]
        }
      ]
    },
    'collision-analysis': {
      title: 'Collision Analysis',
      description: 'Specialized documentation for collision and severity assessment',
      icon: '💥',
      documents: [
        {
          id: 'collision-vs-possible',
          title: 'Collision vs Possible Collision (Severity)',
          description: 'Guidelines for distinguishing collision types and severity levels',
          link: 'https://docs.google.com/document/d/1jb_q7nwT-Lradnk-yRZit4M7zP1wCB08/edit',
          tags: ['C/PC'],
          keyPoints: [
            'Determine if actual contact occurred',
            'Assess severity level accurately using defined criteria',
            'Consider all vehicles and objects involved',
            'Document evidence of impact or near-miss'
          ],
          commonMistakes: [
            'Incorrect severity classification',
            'Missing collision vs near-miss distinction',
            'Not assessing actual impact evidence',
            'Incomplete damage assessment'
          ]
        }
      ]
    }
  };

  const allDocuments = Object.values(documentationData)
    .flatMap(category => category.documents)
    .filter(doc => 
      searchTerm === '' || 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  const openDocument = (link) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const renderDocumentCard = (doc, index) => (
    <div key={doc.id} className="document-card" style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="document-header">
        <h3>{doc.title}</h3>
        <div className="document-tags">
          {doc.tags.map(tag => (
            <span key={tag} className="tag-badge">{tag}</span>
          ))}
        </div>
      </div>
      
      <p className="document-description">{doc.description}</p>
      
      {doc.keyPoints && (
        <div className="document-section">
          <h4>🎯 Key Points:</h4>
          <ul>
            {doc.keyPoints.slice(0, 3).map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        </div>
      )}
      
      {doc.commonMistakes && (
        <div className="document-section">
          <h4>⚠️ Common Mistakes:</h4>
          <ul>
            {doc.commonMistakes.slice(0, 2).map((mistake, idx) => (
              <li key={idx}>{mistake}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="document-actions">
        <button 
          className="primary-action"
          onClick={() => openDocument(doc.link)}
        >
          📖 Open Documentation
        </button>
      </div>
    </div>
  );

  return (
    <div className="guidelines-panel">
      <div className="guidelines-header">
        <div className="header-left">
          <h2>📚 QA Guidelines & Documentation</h2>
          <p>Comprehensive documentation for all QA tag types with examples and best practices</p>
        </div>
        
        <div className="header-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>
      </div>

      <div className="guidelines-content">
        <div className="categories-sidebar">
          <h3>Categories</h3>
          {Object.entries(documentationData).map(([key, category]) => (
            <button
              key={key}
              className={`category-button ${selectedCategory === key ? 'active' : ''}`}
              onClick={() => setSelectedCategory(key)}
            >
              <span className="category-icon">{category.icon}</span>
              <div className="category-info">
                <div className="category-title">{category.title}</div>
                <div className="category-count">{category.documents.length} docs</div>
              </div>
            </button>
          ))}
          
          <button
            className={`category-button ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            <span className="category-icon">📋</span>
            <div className="category-info">
              <div className="category-title">All Documents</div>
              <div className="category-count">{allDocuments.length} docs</div>
            </div>
          </button>
        </div>

        <div className="documents-main">
          {selectedCategory === 'all' ? (
            <div className="category-section">
              <div className="section-header">
                <h3>All Documentation</h3>
                <span className="document-count">{allDocuments.length} documents</span>
              </div>
              <div className="documents-grid">
                {(searchTerm ? allDocuments : allDocuments).map((doc, index) => 
                  renderDocumentCard(doc, index)
                )}
              </div>
            </div>
          ) : (
            <div className="category-section">
              <div className="section-header">
                <h3>
                  {documentationData[selectedCategory].icon} {documentationData[selectedCategory].title}
                </h3>
                <span className="document-count">{documentationData[selectedCategory].documents.length} documents</span>
              </div>
              <p className="category-description">{documentationData[selectedCategory].description}</p>
              
              <div className="documents-grid">
                {documentationData[selectedCategory].documents
                  .filter(doc => 
                    searchTerm === '' || 
                    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
                  )
                  .map((doc, index) => renderDocumentCard(doc, index))
                }
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="guidelines-footer">
        <div className="footer-stats">
          <div className="stat-item">
            <span className="stat-number">{Object.values(documentationData).reduce((sum, cat) => sum + cat.documents.length, 0)}</span>
            <span className="stat-label">Total Documents</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{Object.keys(documentationData).length}</span>
            <span className="stat-label">Categories</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Available</span>
          </div>
        </div>
        
        <div className="footer-note">
          <p>💡 <strong>Tip:</strong> Use the search function to quickly find specific tags or topics. All documents open in new tabs for easy reference.</p>
        </div>
      </div>
    </div>
  );
};

export default GuidelinesPanel;
