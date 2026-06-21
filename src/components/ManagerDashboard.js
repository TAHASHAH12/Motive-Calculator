import React, { useMemo, useState } from 'react';
import {
  LogOut, Building2, Compass, Users, UserCheck, Award, TrendingUp, TrendingDown, Minus, Search
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';
import ThemeToggle from './ThemeToggle';
import './Dashboard.css';
import './ManagerDashboard.css';

// Org hierarchy: Manager -> Associate Manager -> Team Lead -> Coordinator -> Data Annotator
const ASSOCIATE_MANAGERS = [
  { id: 'farhan', name: 'Farhan Qureshi', region: 'North Region Operations', avgPunctuality: 96, trend: 'up' },
  { id: 'sadia', name: 'Sadia Yousaf', region: 'South Region Operations', avgPunctuality: 94, trend: 'stable' }
];

const TEAM_LEADS = [
  { id: 'imran', name: 'Imran Siddiqui', pod: 'Pod A - Road Safety', associateManagerId: 'farhan', avgPunctuality: 98, trend: 'up' },
  { id: 'sara', name: 'Sara Malik', pod: 'Pod B - Driver Behavior', associateManagerId: 'farhan', avgPunctuality: 95, trend: 'stable' },
  { id: 'bilal', name: 'Bilal Ahmed', pod: 'Pod C - Collision Review', associateManagerId: 'sadia', avgPunctuality: 92, trend: 'down' },
  { id: 'hina', name: 'Hina Tariq', pod: 'Pod D - Camera & Technical', associateManagerId: 'sadia', avgPunctuality: 97, trend: 'up' }
];

const COORDINATORS = [
  { id: 'zara', name: 'Zara Sheikh', teamLeadId: 'imran', avgPunctuality: 98, trend: 'up' },
  { id: 'bilquis', name: 'Bilquis Anwar', teamLeadId: 'sara', avgPunctuality: 94, trend: 'stable' },
  { id: 'faisal', name: 'Faisal Khan', teamLeadId: 'bilal', avgPunctuality: 90, trend: 'down' },
  { id: 'nadia', name: 'Nadia Chaudhry', teamLeadId: 'bilal', avgPunctuality: 93, trend: 'stable' },
  { id: 'rida', name: 'Rida Saeed', teamLeadId: 'hina', avgPunctuality: 97, trend: 'up' }
];

const WEEKS = ['25 Aug - 31 Aug', '01 Sep - 07 Sep', '08 Sep - 14 Sep', '15 Sep - 21 Sep'];

const ANNOTATORS = [
  { id: 'taha', name: 'Taha Shah', coordinatorId: 'zara', history: [95.4, 97.1, 98.0, 97.8] },
  { id: 'zainab', name: 'Zainab Ali', coordinatorId: 'zara', history: [92.0, 93.5, 95.2, 96.0] },
  { id: 'usman', name: 'Usman Tariq', coordinatorId: 'zara', history: [89.8, 91.2, 93.0, 94.5] },
  { id: 'fatima', name: 'Fatima Noor', coordinatorId: 'zara', history: [96.5, 96.0, 97.2, 96.8] },
  { id: 'hamza', name: 'Hamza Raza', coordinatorId: 'bilquis', history: [88.0, 90.5, 89.7, 91.0] },
  { id: 'ayesha', name: 'Ayesha Farooq', coordinatorId: 'bilquis', history: [93.2, 92.8, 94.0, 93.5] },
  { id: 'kashif', name: 'Kashif Iqbal', coordinatorId: 'bilquis', history: [86.5, 88.0, 90.1, 89.9] },
  { id: 'mariam', name: 'Mariam Yousuf', coordinatorId: 'faisal', history: [82.0, 80.5, 84.2, 86.0] },
  { id: 'ali', name: 'Ali Hassan', coordinatorId: 'faisal', history: [90.0, 88.5, 87.0, 89.2] },
  { id: 'noor', name: 'Noor Fatima', coordinatorId: 'nadia', history: [85.5, 86.0, 87.5, 88.0] },
  { id: 'asad', name: 'Asad Mehmood', coordinatorId: 'nadia', history: [78.0, 81.0, 80.5, 79.8] },
  { id: 'sana', name: 'Sana Riaz', coordinatorId: 'rida', history: [93.0, 94.5, 95.0, 95.5] },
  { id: 'omar', name: 'Omar Farooqi', coordinatorId: 'rida', history: [91.5, 92.0, 93.5, 94.0] },
  { id: 'laiba', name: 'Laiba Sheikh', coordinatorId: 'rida', history: [89.0, 91.0, 92.8, 93.0] }
];

const getGradeColor = (score) => {
  if (score >= 95) return '#22c55e';
  if (score >= 85) return '#3b82f6';
  if (score >= 75) return '#f59e0b';
  return '#ef4444';
};

const getCategory = (score) => {
  if (score >= 95) return 'Outstanding';
  if (score >= 85) return 'Good';
  if (score >= 75) return 'Average';
  return 'Needs Improvement';
};

const getTrendIcon = (trend) => {
  if (trend === 'up') return <TrendingUp size={16} className="trend-up" />;
  if (trend === 'down') return <TrendingDown size={16} className="trend-down" />;
  return <Minus size={16} className="trend-flat" />;
};

const avg = (nums) => nums.length ? +(nums.reduce((s, n) => s + n, 0) / nums.length).toFixed(1) : 0;

const ManagerDashboard = ({ userInfo, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [amFilterForTeamLeads, setAmFilterForTeamLeads] = useState('all');
  const [teamLeadFilterForCoordinators, setTeamLeadFilterForCoordinators] = useState('all');
  const [coordinatorFilterForAnnotators, setCoordinatorFilterForAnnotators] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAnnotatorId, setSelectedAnnotatorId] = useState(null);

  const enrichedAnnotators = useMemo(() => ANNOTATORS.map(a => {
    const latest = a.history[a.history.length - 1];
    const previous = a.history[a.history.length - 2];
    const coordinator = COORDINATORS.find(c => c.id === a.coordinatorId);
    const teamLead = coordinator ? TEAM_LEADS.find(t => t.id === coordinator.teamLeadId) : null;
    const associateManager = teamLead ? ASSOCIATE_MANAGERS.find(m => m.id === teamLead.associateManagerId) : null;
    return {
      ...a,
      latest,
      change: previous ? +(latest - previous).toFixed(1) : 0,
      coordinatorName: coordinator ? coordinator.name : 'Unassigned',
      teamLeadId: teamLead ? teamLead.id : null,
      teamLeadName: teamLead ? teamLead.name : 'Unassigned',
      associateManagerId: associateManager ? associateManager.id : null,
      associateManagerName: associateManager ? associateManager.name : 'Unassigned'
    };
  }), []);

  const enrichedCoordinators = useMemo(() => COORDINATORS.map(c => {
    const team = enrichedAnnotators.filter(a => a.coordinatorId === c.id);
    const teamLead = TEAM_LEADS.find(t => t.id === c.teamLeadId);
    return {
      ...c,
      teamLeadName: teamLead ? teamLead.name : 'Unassigned',
      teamSize: team.length,
      avgQA: avg(team.map(a => a.latest))
    };
  }), [enrichedAnnotators]);

  const enrichedTeamLeads = useMemo(() => TEAM_LEADS.map(t => {
    const coordinators = enrichedCoordinators.filter(c => c.teamLeadId === t.id);
    const team = enrichedAnnotators.filter(a => a.teamLeadId === t.id);
    const associateManager = ASSOCIATE_MANAGERS.find(m => m.id === t.associateManagerId);
    return {
      ...t,
      associateManagerName: associateManager ? associateManager.name : 'Unassigned',
      coordinatorCount: coordinators.length,
      teamSize: team.length,
      avgQA: avg(team.map(a => a.latest))
    };
  }), [enrichedCoordinators, enrichedAnnotators]);

  const enrichedAssociateManagers = useMemo(() => ASSOCIATE_MANAGERS.map(m => {
    const teamLeads = enrichedTeamLeads.filter(t => t.associateManagerId === m.id);
    const team = enrichedAnnotators.filter(a => a.associateManagerId === m.id);
    return {
      ...m,
      teamLeadCount: teamLeads.length,
      teamSize: team.length,
      avgQA: avg(team.map(a => a.latest))
    };
  }), [enrichedTeamLeads, enrichedAnnotators]);

  const orgAvgByWeek = WEEKS.map((week, idx) => {
    const total = ANNOTATORS.reduce((sum, a) => sum + a.history[idx], 0);
    return { week, avgQA: +(total / ANNOTATORS.length).toFixed(1) };
  });

  const teamLeadBarData = enrichedTeamLeads.map(t => ({ name: t.name.split(' ')[0], avgQA: t.avgQA }));

  const totalAnnotators = ANNOTATORS.length;
  const orgAvgQA = avg(enrichedAnnotators.map(a => a.latest));
  const orgAvgPunctuality = avg(TEAM_LEADS.map(t => t.avgPunctuality));
  const topAnnotator = [...enrichedAnnotators].sort((a, b) => b.latest - a.latest)[0];

  const filteredTeamLeads = amFilterForTeamLeads === 'all'
    ? enrichedTeamLeads
    : enrichedTeamLeads.filter(t => t.associateManagerId === amFilterForTeamLeads);

  const filteredCoordinators = teamLeadFilterForCoordinators === 'all'
    ? enrichedCoordinators
    : enrichedCoordinators.filter(c => c.teamLeadId === teamLeadFilterForCoordinators);

  const filteredAnnotators = enrichedAnnotators.filter(a => {
    const matchesCoordinator = coordinatorFilterForAnnotators === 'all' || a.coordinatorId === coordinatorFilterForAnnotators;
    const matchesSearch = searchTerm === '' || a.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCoordinator && matchesSearch;
  });

  const selectedAnnotator = enrichedAnnotators.find(a => a.id === selectedAnnotatorId);
  const selectedAnnotatorChart = selectedAnnotator
    ? WEEKS.map((week, idx) => ({ week, score: selectedAnnotator.history[idx] }))
    : [];

  const viewTeamLeadsForAM = (amId) => {
    setAmFilterForTeamLeads(amId);
    setActiveTab('team-leads');
  };

  const viewCoordinatorsForTeamLead = (teamLeadId) => {
    setTeamLeadFilterForCoordinators(teamLeadId);
    setActiveTab('coordinators');
  };

  const viewAnnotatorsForCoordinator = (coordinatorId) => {
    setCoordinatorFilterForAnnotators(coordinatorId);
    setSelectedAnnotatorId(null);
    setActiveTab('annotators');
  };

  const renderOverview = () => (
    <div className="mgr-overview">
      <div className="mgr-metrics-grid">
        <div className="mgr-metric-card">
          <div className="mgr-metric-icon"><Building2 size={24} /></div>
          <div className="mgr-metric-content">
            <h3>Associate Managers</h3>
            <div className="mgr-metric-value">{ASSOCIATE_MANAGERS.length}</div>
          </div>
        </div>
        <div className="mgr-metric-card">
          <div className="mgr-metric-icon"><Compass size={24} /></div>
          <div className="mgr-metric-content">
            <h3>Team Leads</h3>
            <div className="mgr-metric-value">{TEAM_LEADS.length}</div>
          </div>
        </div>
        <div className="mgr-metric-card">
          <div className="mgr-metric-icon"><Users size={24} /></div>
          <div className="mgr-metric-content">
            <h3>Coordinators</h3>
            <div className="mgr-metric-value">{COORDINATORS.length}</div>
          </div>
        </div>
        <div className="mgr-metric-card">
          <div className="mgr-metric-icon"><UserCheck size={24} /></div>
          <div className="mgr-metric-content">
            <h3>Data Annotators</h3>
            <div className="mgr-metric-value">{totalAnnotators}</div>
          </div>
        </div>
        <div className="mgr-metric-card">
          <div className="mgr-metric-icon"><Award size={24} /></div>
          <div className="mgr-metric-content">
            <h3>Org Avg QA Score</h3>
            <div className="mgr-metric-value">{orgAvgQA}%</div>
          </div>
        </div>
        <div className="mgr-metric-card">
          <div className="mgr-metric-icon"><TrendingUp size={24} /></div>
          <div className="mgr-metric-content">
            <h3>Top Performer</h3>
            <div className="mgr-metric-value mgr-metric-value-sm">{topAnnotator?.name}</div>
            <div className="mgr-metric-sub">{topAnnotator?.latest}% QA Score</div>
          </div>
        </div>
      </div>

      <div className="mgr-charts-grid">
        <div className="chart-container">
          <h3>Org-Wide QA Score Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={orgAvgByWeek}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis domain={[60, 100]} />
              <Tooltip formatter={(value) => [`${value}%`, 'Avg QA Score']} />
              <Line type="monotone" dataKey="avgQA" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Avg QA Score by Team Lead's Team</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={teamLeadBarData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value) => [`${value}%`, 'Avg QA Score']} />
              <Bar dataKey="avgQA" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mgr-summary-note">
        Org average punctuality across all teams: <strong>{orgAvgPunctuality}%</strong>
      </div>
    </div>
  );

  const renderAssociateManagers = () => (
    <div className="mgr-coordinators">
      <div className="mgr-cards-grid">
        {enrichedAssociateManagers.map(m => (
          <div key={m.id} className="mgr-coordinator-card">
            <div className="mgr-coordinator-top">
              <div className="mgr-avatar">{m.name.charAt(0)}</div>
              <div>
                <h4>{m.name}</h4>
                <span className="mgr-pod">{m.region}</span>
              </div>
            </div>

            <div className="mgr-coordinator-stats">
              <div className="mgr-stat">
                <span className="mgr-stat-label">Team Leads</span>
                <span className="mgr-stat-value">{m.teamLeadCount}</span>
              </div>
              <div className="mgr-stat">
                <span className="mgr-stat-label">Total Annotators</span>
                <span className="mgr-stat-value">{m.teamSize}</span>
              </div>
              <div className="mgr-stat">
                <span className="mgr-stat-label">Avg QA Score</span>
                <span className="mgr-stat-value" style={{ color: getGradeColor(m.avgQA) }}>{m.avgQA}%</span>
              </div>
              <div className="mgr-stat">
                <span className="mgr-stat-label">Avg Punctuality</span>
                <span className="mgr-stat-value">{m.avgPunctuality}%</span>
              </div>
              <div className="mgr-stat">
                <span className="mgr-stat-label">Trend</span>
                <span className="mgr-stat-value mgr-trend">{getTrendIcon(m.trend)}</span>
              </div>
            </div>

            <button className="mgr-view-team-btn" onClick={() => viewTeamLeadsForAM(m.id)}>
              View Team Leads
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTeamLeads = () => (
    <div className="mgr-leads">
      <div className="mgr-annotators-controls">
        <select value={amFilterForTeamLeads} onChange={(e) => setAmFilterForTeamLeads(e.target.value)}>
          <option value="all">All Associate Managers</option>
          {ASSOCIATE_MANAGERS.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>

      <div className="mgr-cards-grid">
        {filteredTeamLeads.map(t => (
          <div key={t.id} className="mgr-coordinator-card">
            <div className="mgr-coordinator-top">
              <div className="mgr-avatar">{t.name.charAt(0)}</div>
              <div>
                <h4>{t.name}</h4>
                <span className="mgr-pod">{t.pod} • Reports to {t.associateManagerName}</span>
              </div>
            </div>

            <div className="mgr-coordinator-stats">
              <div className="mgr-stat">
                <span className="mgr-stat-label">Coordinators</span>
                <span className="mgr-stat-value">{t.coordinatorCount}</span>
              </div>
              <div className="mgr-stat">
                <span className="mgr-stat-label">Total Annotators</span>
                <span className="mgr-stat-value">{t.teamSize}</span>
              </div>
              <div className="mgr-stat">
                <span className="mgr-stat-label">Avg QA Score</span>
                <span className="mgr-stat-value" style={{ color: getGradeColor(t.avgQA) }}>{t.avgQA}%</span>
              </div>
              <div className="mgr-stat">
                <span className="mgr-stat-label">Avg Punctuality</span>
                <span className="mgr-stat-value">{t.avgPunctuality}%</span>
              </div>
              <div className="mgr-stat">
                <span className="mgr-stat-label">Trend</span>
                <span className="mgr-stat-value mgr-trend">{getTrendIcon(t.trend)}</span>
              </div>
            </div>

            <button className="mgr-view-team-btn" onClick={() => viewCoordinatorsForTeamLead(t.id)}>
              View Coordinators
            </button>
          </div>
        ))}

        {filteredTeamLeads.length === 0 && (
          <div className="no-data"><p>No team leads under this associate manager.</p></div>
        )}
      </div>
    </div>
  );

  const renderCoordinators = () => (
    <div className="mgr-leads">
      <div className="mgr-annotators-controls">
        <select value={teamLeadFilterForCoordinators} onChange={(e) => setTeamLeadFilterForCoordinators(e.target.value)}>
          <option value="all">All Team Leads</option>
          {TEAM_LEADS.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      <div className="mgr-cards-grid">
        {filteredCoordinators.map(c => (
          <div key={c.id} className="mgr-coordinator-card">
            <div className="mgr-coordinator-top">
              <div className="mgr-avatar">{c.name.charAt(0)}</div>
              <div>
                <h4>{c.name}</h4>
                <span className="mgr-pod">Reports to {c.teamLeadName}</span>
              </div>
            </div>

            <div className="mgr-coordinator-stats">
              <div className="mgr-stat">
                <span className="mgr-stat-label">Team Size</span>
                <span className="mgr-stat-value">{c.teamSize}</span>
              </div>
              <div className="mgr-stat">
                <span className="mgr-stat-label">Avg QA Score</span>
                <span className="mgr-stat-value" style={{ color: getGradeColor(c.avgQA) }}>{c.avgQA}%</span>
              </div>
              <div className="mgr-stat">
                <span className="mgr-stat-label">Avg Punctuality</span>
                <span className="mgr-stat-value">{c.avgPunctuality}%</span>
              </div>
              <div className="mgr-stat">
                <span className="mgr-stat-label">Trend</span>
                <span className="mgr-stat-value mgr-trend">{getTrendIcon(c.trend)}</span>
              </div>
            </div>

            <button className="mgr-view-team-btn" onClick={() => viewAnnotatorsForCoordinator(c.id)}>
              View Team Annotators
            </button>
          </div>
        ))}

        {filteredCoordinators.length === 0 && (
          <div className="no-data"><p>No coordinators under this team lead.</p></div>
        )}
      </div>
    </div>
  );

  const renderAnnotators = () => (
    <div className="mgr-annotators">
      <div className="mgr-annotators-controls">
        <div className="mgr-search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search annotator..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select value={coordinatorFilterForAnnotators} onChange={(e) => setCoordinatorFilterForAnnotators(e.target.value)}>
          <option value="all">All Coordinators</option>
          {COORDINATORS.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="mgr-table-container">
        <table>
          <thead>
            <tr>
              <th>Annotator</th>
              <th>Coordinator</th>
              <th>Team Lead</th>
              <th>QA Score</th>
              <th>Change</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {filteredAnnotators.map(a => (
              <tr
                key={a.id}
                className={selectedAnnotatorId === a.id ? 'mgr-row-selected' : ''}
                onClick={() => setSelectedAnnotatorId(a.id === selectedAnnotatorId ? null : a.id)}
              >
                <td className="mgr-annotator-name">{a.name}</td>
                <td>{a.coordinatorName}</td>
                <td>{a.teamLeadName}</td>
                <td style={{ color: getGradeColor(a.latest), fontWeight: 700 }}>{a.latest}%</td>
                <td className={a.change >= 0 ? 'mgr-change-up' : 'mgr-change-down'}>
                  {a.change > 0 ? '+' : ''}{a.change}%
                </td>
                <td>
                  <span className="mgr-category-badge" style={{ backgroundColor: getGradeColor(a.latest) }}>
                    {getCategory(a.latest)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredAnnotators.length === 0 && (
          <div className="no-data"><p>No annotators match this filter.</p></div>
        )}
      </div>

      {selectedAnnotator && (
        <div className="mgr-detail-panel">
          <h3>{selectedAnnotator.name} — Weekly QA Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={selectedAnnotatorChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis domain={[60, 100]} />
              <Tooltip formatter={(value) => [`${value}%`, 'QA Score']} />
              <Legend />
              <Line type="monotone" dataKey="score" name="QA Score" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'associate-managers': return renderAssociateManagers();
      case 'team-leads': return renderTeamLeads();
      case 'coordinators': return renderCoordinators();
      case 'annotators': return renderAnnotators();
      default: return renderOverview();
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <div className="user-info">
            <div className="user-avatar">{userInfo.name.charAt(0)}</div>
            <div className="user-details">
              <h3>Welcome, {userInfo.name}</h3>
              <span className="user-role">{userInfo.title || 'Manager'} • Team Console</span>
            </div>
          </div>
        </div>

        <div className="header-center">
          <nav className="tab-navigation">
            <button
              className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <span className="tab-icon">📊</span>
              <span>Overview</span>
            </button>
            <button
              className={`tab-button ${activeTab === 'associate-managers' ? 'active' : ''}`}
              onClick={() => setActiveTab('associate-managers')}
            >
              <span className="tab-icon">🏢</span>
              <span>Associate Managers</span>
            </button>
            <button
              className={`tab-button ${activeTab === 'team-leads' ? 'active' : ''}`}
              onClick={() => setActiveTab('team-leads')}
            >
              <span className="tab-icon">🧭</span>
              <span>Team Leads</span>
            </button>
            <button
              className={`tab-button ${activeTab === 'coordinators' ? 'active' : ''}`}
              onClick={() => setActiveTab('coordinators')}
            >
              <span className="tab-icon">🗂️</span>
              <span>Coordinators</span>
            </button>
            <button
              className={`tab-button ${activeTab === 'annotators' ? 'active' : ''}`}
              onClick={() => setActiveTab('annotators')}
            >
              <span className="tab-icon">📝</span>
              <span>Annotators</span>
            </button>
          </nav>
        </div>

        <div className="header-right">
          <ThemeToggle />
          <button className="logout-button" onClick={onLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        {renderActiveTab()}
      </main>
    </div>
  );
};

export default ManagerDashboard;
