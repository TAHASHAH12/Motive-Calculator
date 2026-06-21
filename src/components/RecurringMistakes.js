import React, { useState } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Repeat, TrendingUp, TrendingDown, Minus, AlertTriangle, BookOpen } from 'lucide-react';
import './RecurringMistakes.css';

const MISTAKE_PATTERNS = [
  {
    id: 'rrl-stopline',
    tag: 'RRL',
    category: 'Road Facing',
    title: 'Missing exact stop-line crossing moment',
    description: 'Marking RRL based on approximate signal timing instead of verifying the precise frame where the vehicle crosses the stop line after the light turns red.',
    occurrences: 14,
    weeksAffected: 4,
    trend: 'increasing',
    severity: 'high',
    lastOccurred: '08 Sep - 14 Sep',
    reviewerNote: '"Vehicle crossed 1s before signal change — re-check frame timing next time."',
    guideline: 'Running a Red Light (RRL)'
  },
  {
    id: 'smoking-vapor',
    tag: 'Smoking',
    category: 'Driver Facing',
    title: 'Confusing vapor/breath fog with smoke',
    description: 'Tagging cold-weather breath condensation or vape exhale as a smoking event without confirming a visible cigarette or device.',
    occurrences: 11,
    weeksAffected: 3,
    trend: 'increasing',
    severity: 'high',
    lastOccurred: '08 Sep - 14 Sep',
    reviewerNote: '"No cigarette visible in any frame — likely cold breath, not smoke."',
    guideline: 'Smoking - AI Event'
  },
  {
    id: 'lane-severity',
    tag: 'LC',
    category: 'Road Facing',
    title: 'Under-rating lane cutoff severity',
    description: 'Identifying the cutoff correctly but rating severity too low when the following vehicle had to brake hard to avoid contact.',
    occurrences: 9,
    weeksAffected: 3,
    trend: 'stable',
    severity: 'medium',
    lastOccurred: '01 Sep - 07 Sep',
    reviewerNote: '"Hard braking visible in dashcam — this should be Severe, not Moderate."',
    guideline: 'Lane Cutoff'
  },
  {
    id: 'fcw-context',
    tag: 'FCW',
    category: 'Road Facing',
    title: 'Validating FCW without checking closing speed',
    description: 'Marking FCW events as genuine threats without cross-checking the closing speed and distance shown in telemetry overlay.',
    occurrences: 7,
    weeksAffected: 2,
    trend: 'decreasing',
    severity: 'medium',
    lastOccurred: '25 Aug - 31 Aug',
    reviewerNote: '"Closing speed was under 5mph — not a genuine threat, should be rejected."',
    guideline: 'Forward Collision Warning (FCW)'
  },
  {
    id: 'collision-severity',
    tag: 'C/PC',
    category: 'Collision Analysis',
    title: 'Mixing up Collision vs Possible Collision severity',
    description: 'Classifying near-contact events as actual Collisions without clear visual evidence of impact (no damage, no jolt in telemetry).',
    occurrences: 5,
    weeksAffected: 2,
    trend: 'decreasing',
    severity: 'low',
    lastOccurred: '25 Aug - 31 Aug',
    reviewerNote: '"No impact evidence in footage or g-force spike — this is Possible Collision."',
    guideline: 'Collision vs Possible Collision (Severity)'
  },
  {
    id: 'nc-distance',
    tag: 'NC',
    category: 'Collision Analysis',
    title: 'Inconsistent minimum-distance estimation',
    description: 'Estimating the minimum distance achieved in Near Collision events inconsistently across similar scenarios, affecting severity grading.',
    occurrences: 4,
    weeksAffected: 1,
    trend: 'stable',
    severity: 'low',
    lastOccurred: '18 Aug - 24 Aug',
    reviewerNote: '"Reference object distance suggests <1ft, not the ~3ft logged."',
    guideline: 'Near Collision (NC)'
  }
];

const WEEKLY_TREND = [
  { week: '18 Aug - 24 Aug', RRL: 2, Smoking: 1, LC: 3 },
  { week: '25 Aug - 31 Aug', RRL: 4, Smoking: 3, LC: 2 },
  { week: '01 Sep - 07 Sep', RRL: 4, Smoking: 3, LC: 4 },
  { week: '08 Sep - 14 Sep', RRL: 4, Smoking: 4, LC: 0 }
];

const getSeverityColor = (severity) => {
  if (severity === 'high') return '#ef4444';
  if (severity === 'medium') return '#f59e0b';
  return '#22c55e';
};

const getTrendIcon = (trend) => {
  if (trend === 'increasing') return <TrendingUp size={16} className="trend-up" />;
  if (trend === 'decreasing') return <TrendingDown size={16} className="trend-down" />;
  return <Minus size={16} className="trend-flat" />;
};

const RecurringMistakes = () => {
  const [severityFilter, setSeverityFilter] = useState('all');

  const filteredPatterns = severityFilter === 'all'
    ? MISTAKE_PATTERNS
    : MISTAKE_PATTERNS.filter(p => p.severity === severityFilter);

  const chartData = [...MISTAKE_PATTERNS]
    .sort((a, b) => b.occurrences - a.occurrences)
    .map(p => ({ tag: p.tag, occurrences: p.occurrences, severity: p.severity }));

  const totalOccurrences = MISTAKE_PATTERNS.reduce((sum, p) => sum + p.occurrences, 0);
  const increasingCount = MISTAKE_PATTERNS.filter(p => p.trend === 'increasing').length;
  const topPattern = [...MISTAKE_PATTERNS].sort((a, b) => b.occurrences - a.occurrences)[0];

  const openGuideline = () => {
    window.open('https://gomotive.com/', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="recurring-mistakes">
      <div className="rm-header">
        <div className="header-left">
          <h2><Repeat size={24} className="header-icon" /> Recurring Mistakes</h2>
          <p>Patterns flagged repeatedly in your annotation reviews — fix these to lift your QA score fastest</p>
        </div>
        <div className="severity-filter">
          <label>Severity:</label>
          <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <div className="rm-summary-grid">
        <div className="rm-summary-card">
          <span className="rm-summary-value">{MISTAKE_PATTERNS.length}</span>
          <span className="rm-summary-label">Recurring Patterns</span>
        </div>
        <div className="rm-summary-card">
          <span className="rm-summary-value">{totalOccurrences}</span>
          <span className="rm-summary-label">Total Flags (4 weeks)</span>
        </div>
        <div className="rm-summary-card warning">
          <span className="rm-summary-value">{increasingCount}</span>
          <span className="rm-summary-label">Trending Up</span>
        </div>
        <div className="rm-summary-card">
          <span className="rm-summary-value">{topPattern.tag}</span>
          <span className="rm-summary-label">Most Frequent Tag</span>
        </div>
      </div>

      <div className="rm-charts-grid">
        <div className="chart-container">
          <h3>Flags by Tag</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tag" />
              <YAxis allowDecimals={false} />
              <Tooltip formatter={(value) => [value, 'Occurrences']} />
              <Bar dataKey="occurrences" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={getSeverityColor(entry.severity)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Weekly Trend — Top 3 Patterns</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={WEEKLY_TREND} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="RRL" stroke="#ef4444" strokeWidth={2} />
              <Line type="monotone" dataKey="Smoking" stroke="#f59e0b" strokeWidth={2} />
              <Line type="monotone" dataKey="LC" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rm-list">
        <h3>Detailed Breakdown</h3>
        {filteredPatterns.map(pattern => (
          <div key={pattern.id} className="rm-card">
            <div className="rm-card-top">
              <div className="rm-card-title">
                <span className="rm-tag-badge">{pattern.tag}</span>
                <h4>{pattern.title}</h4>
              </div>
              <span
                className="rm-severity-badge"
                style={{ backgroundColor: getSeverityColor(pattern.severity) }}
              >
                {pattern.severity.toUpperCase()}
              </span>
            </div>

            <p className="rm-description">{pattern.description}</p>

            <div className="rm-meta-row">
              <div className="rm-meta-item">
                <span className="rm-meta-label">Category</span>
                <span className="rm-meta-value">{pattern.category}</span>
              </div>
              <div className="rm-meta-item">
                <span className="rm-meta-label">Occurrences</span>
                <span className="rm-meta-value">{pattern.occurrences}</span>
              </div>
              <div className="rm-meta-item">
                <span className="rm-meta-label">Weeks Affected</span>
                <span className="rm-meta-value">{pattern.weeksAffected}</span>
              </div>
              <div className="rm-meta-item">
                <span className="rm-meta-label">Trend</span>
                <span className="rm-meta-value rm-trend">
                  {getTrendIcon(pattern.trend)} {pattern.trend}
                </span>
              </div>
              <div className="rm-meta-item">
                <span className="rm-meta-label">Last Occurred</span>
                <span className="rm-meta-value">{pattern.lastOccurred}</span>
              </div>
            </div>

            <div className="rm-reviewer-note">
              <AlertTriangle size={16} />
              <span>Reviewer note: {pattern.reviewerNote}</span>
            </div>

            <button className="rm-guideline-link" onClick={openGuideline}>
              <BookOpen size={16} />
              Review guideline: {pattern.guideline}
            </button>
          </div>
        ))}

        {filteredPatterns.length === 0 && (
          <div className="no-data">
            <h3>No patterns at this severity</h3>
            <p>Try a different severity filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecurringMistakes;
