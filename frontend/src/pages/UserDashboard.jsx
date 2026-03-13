import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const UserDashboard = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  useEffect(() => {
    axios.get('/api/events')
      .then(r => setEvents(r.data.filter(e => e.status === 'Upcoming').slice(0, 6)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatDate = d => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A';

  const categoryColor = cat => ({
    Conference: { bg: '#ede9fe', text: '#5b21b6', border: '#7c3aed' },
    Workshop:   { bg: '#dbeafe', text: '#1d4ed8', border: '#3b82f6' },
    Seminar:    { bg: '#dcfce7', text: '#166534', border: '#22c55e' },
    Social:     { bg: '#fef9c3', text: '#854d0e', border: '#eab308' },
    Sports:     { bg: '#fee2e2', text: '#991b1b', border: '#ef4444' },
    Other:      { bg: '#f1f5f9', text: '#475569', border: '#94a3b8' },
  }[cat] || { bg: '#f1f5f9', text: '#475569', border: '#94a3b8' });

  const quickActions = [
    { label: 'Register for Event', to: '/transactions/register', icon: '🎫', color: '#e0f2fe', border: '#0ea5e9', text: '#0c4a6e' },
    { label: 'View Registrations', to: '/transactions/view',    icon: '📋', color: '#f0fdf4', border: '#16a34a', text: '#14532d' },
    { label: 'Member Report',      to: '/reports/members',      icon: '👥', color: '#fdf4ff', border: '#a855f7', text: '#6b21a8' },
    { label: 'Event Report',       to: '/reports/events',       icon: '📅', color: '#fff7ed', border: '#fb923c', text: '#7c2d12' },
    { label: 'Booking Report',     to: '/reports/bookings',     icon: '📊', color: '#ecfdf5', border: '#10b981', text: '#064e3b' },
  ];

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="dash-wrapper">

        {/* ── Hero ── */}
        <div className="dash-hero dash-hero-user">
          <div className="dash-hero-left">
            <p className="dash-greeting">{greeting()},</p>
            <h1 className="dash-username">{user?.name || user?.username} 👋</h1>
            <p className="dash-date">{today}</p>
            <span className="dash-role-tag dash-role-user">Member</span>
          </div>
          <div className="dash-hero-right">
            <svg width="110" height="110" viewBox="0 0 120 120" fill="none">
              <circle cx="60" cy="45" r="22" stroke="rgba(255,255,255,0.6)" strokeWidth="2" fill="rgba(255,255,255,0.1)"/>
              <circle cx="60" cy="45" r="13" fill="rgba(255,255,255,0.25)"/>
              <path d="M20 100 Q60 70 100 100" stroke="rgba(255,255,255,0.5)" strokeWidth="2" fill="none"/>
            </svg>
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div className="dash-section-title">Quick Actions</div>
        <div className="dash-actions-grid dash-actions-user">
          {quickActions.map((a, i) => (
            <Link key={i} to={a.to} className="dash-action-card" style={{ background: a.color, borderColor: a.border, color: a.text }}>
              <span className="dac-icon">{a.icon}</span>
              <span className="dac-label">{a.label}</span>
            </Link>
          ))}
        </div>

        {/* ── Upcoming Events ── */}
        <div className="dash-section-title">
          Upcoming Events
          <span className="dash-section-count">{events.length} available</span>
        </div>

        {loading ? (
          <div className="dash-loading">Loading events…</div>
        ) : events.length === 0 ? (
          <div className="dash-empty">
            <span style={{ fontSize: 48 }}>📭</span>
            <p>No upcoming events available right now.</p>
          </div>
        ) : (
          <div className="dash-events-grid">
            {events.map(ev => {
              const cc = categoryColor(ev.category);
              return (
                <div key={ev._id} className="dash-event-card">
                  <div className="dec-top">
                    <span className="dec-cat" style={{ background: cc.bg, color: cc.text, border: `1px solid ${cc.border}` }}>
                      {ev.category}
                    </span>
                    <span className="dec-status">● Upcoming</span>
                  </div>
                  <h4 className="dec-name">{ev.eventName}</h4>
                  <p className="dec-desc">{ev.description?.slice(0, 70)}{ev.description?.length > 70 ? '…' : ''}</p>
                  <div className="dec-info">
                    <div className="dec-info-row"><span>📅</span><span>{formatDate(ev.eventDate)}</span></div>
                    <div className="dec-info-row"><span>🕐</span><span>{ev.startTime} – {ev.endTime}</span></div>
                    <div className="dec-info-row"><span>👥</span><span>Max {ev.maxParticipants} participants</span></div>
                    <div className="dec-info-row"><span>💰</span><span>{ev.fee > 0 ? `₹${ev.fee}` : 'Free'}</span></div>
                  </div>
                  <Link to="/transactions/register" className="dec-btn">Register Now →</Link>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default UserDashboard;
