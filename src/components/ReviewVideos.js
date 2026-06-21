import React, { useState } from 'react';
import { Film, PlayCircle, Clock, CheckCircle2, XCircle, AlertCircle, Flag, ExternalLink } from 'lucide-react';
import './ReviewVideos.css';

const DEMO_VIDEO_URL = 'https://www.w3schools.com/html/mov_bbb.mp4';
// Placeholder Jira site for this prototype — swap in your real Jira base URL when wiring up the integration.
const JIRA_BASE_URL = 'https://motive-qa.atlassian.net/browse/';

const VIDEO_CLIPS = [
  {
    id: 'clip-1042',
    weekRange: '08 Sep - 14 Sep',
    tag: 'RRL',
    eventTitle: 'Running Red Light — Intersection Cam',
    outcome: 'flagged',
    duration: '0:18',
    reviewerComment: 'Re-check exact stop-line crossing frame vs signal change.',
    link: DEMO_VIDEO_URL
  },
  {
    id: 'clip-1041',
    weekRange: '08 Sep - 14 Sep',
    tag: 'Smoking',
    eventTitle: 'Driver Facing — Smoking Detection',
    outcome: 'flagged',
    duration: '0:12',
    reviewerComment: 'No cigarette visible — likely cold breath, not smoke.',
    link: DEMO_VIDEO_URL
  },
  {
    id: 'clip-1038',
    weekRange: '01 Sep - 07 Sep',
    tag: 'LC',
    eventTitle: 'Lane Cutoff — Highway Merge',
    outcome: 'correct',
    duration: '0:22',
    reviewerComment: 'Correctly identified and rated severity.',
    link: DEMO_VIDEO_URL
  },
  {
    id: 'clip-1033',
    weekRange: '01 Sep - 07 Sep',
    tag: 'FCW',
    eventTitle: 'Forward Collision Warning — City Traffic',
    outcome: 'incorrect',
    duration: '0:09',
    reviewerComment: 'Closing speed under 5mph — should have been rejected.',
    link: DEMO_VIDEO_URL
  },
  {
    id: 'clip-1027',
    weekRange: '25 Aug - 31 Aug',
    tag: 'C/PC',
    eventTitle: 'Collision Analysis — Rear-End Contact',
    outcome: 'correct',
    duration: '0:15',
    reviewerComment: 'Severity classification matched evidence.',
    link: DEMO_VIDEO_URL
  },
  {
    id: 'clip-1019',
    weekRange: '25 Aug - 31 Aug',
    tag: 'NC',
    eventTitle: 'Near Collision — Pedestrian Crossing',
    outcome: 'correct',
    duration: '0:20',
    reviewerComment: 'Minimum distance estimate was accurate.',
    link: DEMO_VIDEO_URL
  }
];

const OUTCOME_META = {
  correct: { label: 'Correct', color: '#22c55e', icon: CheckCircle2 },
  incorrect: { label: 'Incorrect', color: '#ef4444', icon: XCircle },
  flagged: { label: 'Needs Re-review', color: '#f59e0b', icon: AlertCircle }
};

const getTicketKey = (clipId) => `QA-${clipId.split('-')[1]}`;

const ReviewVideos = () => {
  const [outcomeFilter, setOutcomeFilter] = useState('all');
  const [appeals, setAppeals] = useState({});

  const filteredClips = outcomeFilter === 'all'
    ? VIDEO_CLIPS
    : VIDEO_CLIPS.filter(c => c.outcome === outcomeFilter);

  const flaggedCount = VIDEO_CLIPS.filter(c => c.outcome === 'flagged').length;
  const correctCount = VIDEO_CLIPS.filter(c => c.outcome === 'correct').length;

  const openClip = (link) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const appealReview = (clip) => {
    const ticketKey = getTicketKey(clip.id);
    setAppeals(prev => ({ ...prev, [clip.id]: ticketKey }));
    window.open(`${JIRA_BASE_URL}${ticketKey}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="review-videos">
      <div className="rv-header">
        <div className="header-left">
          <h2><Film size={24} className="header-icon" /> Review Your Videos</h2>
          <p>Watch the annotation clips behind your recent QA reviews (demo data)</p>
        </div>
        <div className="rv-filter">
          <label>Outcome:</label>
          <select value={outcomeFilter} onChange={(e) => setOutcomeFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="correct">Correct</option>
            <option value="incorrect">Incorrect</option>
            <option value="flagged">Needs Re-review</option>
          </select>
        </div>
      </div>

      <div className="rv-summary-grid">
        <div className="rv-summary-card">
          <span className="rv-summary-value">{VIDEO_CLIPS.length}</span>
          <span className="rv-summary-label">Clips Reviewed</span>
        </div>
        <div className="rv-summary-card success">
          <span className="rv-summary-value">{correctCount}</span>
          <span className="rv-summary-label">Marked Correct</span>
        </div>
        <div className="rv-summary-card warning">
          <span className="rv-summary-value">{flaggedCount}</span>
          <span className="rv-summary-label">Needs Re-review</span>
        </div>
      </div>

      <div className="rv-grid">
        {filteredClips.map(clip => {
          const meta = OUTCOME_META[clip.outcome];
          const OutcomeIcon = meta.icon;
          return (
            <div key={clip.id} className="rv-card">
              <button className="rv-thumb" onClick={() => openClip(clip.link)} aria-label={`Play ${clip.eventTitle}`}>
                <PlayCircle size={40} />
                <span className="rv-duration">{clip.duration}</span>
              </button>

              <div className="rv-card-body">
                <div className="rv-card-top">
                  <span className="rv-tag-badge">{clip.tag}</span>
                  <span className="rv-outcome-badge" style={{ color: meta.color, borderColor: meta.color }}>
                    <OutcomeIcon size={14} /> {meta.label}
                  </span>
                </div>

                <h4>{clip.eventTitle}</h4>
                <span className="rv-week">{clip.weekRange} • {clip.id}</span>
                <p className="rv-comment">{clip.reviewerComment}</p>

                <div className="rv-card-actions">
                  <button className="rv-watch-btn" onClick={() => openClip(clip.link)}>
                    <PlayCircle size={16} /> Watch Clip
                  </button>

                  {clip.outcome !== 'correct' && (
                    appeals[clip.id] ? (
                      <button className="rv-appeal-btn appealed" onClick={() => appealReview(clip)}>
                        <ExternalLink size={16} /> View {appeals[clip.id]} in Jira
                      </button>
                    ) : (
                      <button className="rv-appeal-btn" onClick={() => appealReview(clip)}>
                        <Flag size={16} /> Appeal Review
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredClips.length === 0 && (
          <div className="no-data">
            <h3>No clips at this filter</h3>
            <p>Try a different outcome filter.</p>
          </div>
        )}
      </div>

      <div className="rv-footnote">
        <Clock size={14} /> Demo clips link to a sample video, and appeals open a placeholder Jira site — both will point to real footage and your Jira project once wired up.
      </div>
    </div>
  );
};

export default ReviewVideos;
