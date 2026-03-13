import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalMembers: 0, totalEvents: 0, totalBookings: 0, activeMembers: 0, upcomingEvents: 0, confirmedBookings: 0 });
  const [loading, setLoading] = useState(true);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [mRes, eRes, bRes] = await Promise.all([
          axios.get('/api/members'),
          axios.get('/api/events'),
          axios.get('/api/bookings')
        ]);
        setStats({
          totalMembers: mRes.data.length,
          totalEvents: eRes.data.length,
          totalBookings: bRes.data.length,
          activeMembers: mRes.data.filter(m => m.status === 'Active').length,
          upcomingEvents: eRes.data.filter(e => e.status === 'Upcoming').length,
          confirmedBookings: bRes.data.filter(b => b.status === 'Confirmed').length
        });
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Members', value: stats.totalMembers, sub: `${stats.activeMembers} Active`, color: '#4f46e5', bg: 'linear-gradient(135deg,#4f46e5,#7c3aed)', icon: '👥' },
    { label: 'Total Events',  value: stats.totalEvents,  sub: `${stats.upcomingEvents} Upcoming`, color: '#0891b2', bg: 'linear-gradient(135deg,#0891b2,#0e7490)', icon: '📅' },
    { label: 'Total Bookings',value: stats.totalBookings,sub: `${stats.confirmedBookings} Confirmed`, color: '#059669', bg: 'linear-gradient(135deg,#059669,#047857)', icon: '🎟️' },
  ];

  const quickActions = [
    { label: 'Create User',       to: '/maintenance/add-user',          icon: '🔑', color: '#f0fdf4', border: '#16a34a', text: '#14532d' },
    { label: 'Add Membership',    to: '/maintenance/add-membership',    icon: '👤', color: '#ede9fe', border: '#7c3aed', text: '#5b21b6' },
    { label: 'Update Membership', to: '/maintenance/update-membership',  icon: '✏️', color: '#dbeafe', border: '#3b82f6', text: '#1d4ed8' },
    { label: 'Add Event',         to: '/maintenance/add-event',          icon: '📌', color: '#dcfce7', border: '#22c55e', text: '#166534' },
    { label: 'Update Event',      to: '/maintenance/update-event',       icon: '🗓️', color: '#fef9c3', border: '#eab308', text: '#854d0e' },
    { label: 'Add Venue',         to: '/maintenance/add-venue',          icon: '🏛️', color: '#fee2e2', border: '#ef4444', text: '#991b1b' },
    { label: 'Update Venue',      to: '/maintenance/update-venue',       icon: '📍', color: '#ffedd5', border: '#f97316', text: '#9a3412' },
    { label: 'Register for Event',to: '/transactions/register',          icon: '🎫', color: '#e0f2fe', border: '#0ea5e9', text: '#0c4a6e' },
    { label: 'View Registrations',to: '/transactions/view',              icon: '📋', color: '#f0fdf4', border: '#16a34a', text: '#14532d' },
    { label: 'Member Report',     to: '/reports/members',               icon: '📈', color: '#fdf4ff', border: '#a855f7', text: '#6b21a8' },
    { label: 'Event Report',      to: '/reports/events',                icon: '📊', color: '#fff7ed', border: '#fb923c', text: '#7c2d12' },
    { label: 'Booking Report',    to: '/reports/bookings',              icon: '💹', color: '#ecfdf5', border: '#10b981', text: '#064e3b' },
  ];

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="dash-wrapper">

        {/* ── Hero Banner ── */}
        <div className="dash-hero">
          <div className="dash-hero-left">
            <p className="dash-greeting">{greeting()},</p>
            <h1 className="dash-username">{user?.name || user?.username} 👋</h1>
            <p className="dash-date">{today}</p>
            <span className="dash-role-tag">Administrator</span>
          </div>
          <div className="dash-hero-right">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
              <circle cx="60" cy="60" r="55" fill="rgba(255,255,255,0.08)"/>
              <rect x="28" y="35" width="64" height="55" rx="7" stroke="rgba(255,255,255,0.5)" strokeWidth="2" fill="none"/>
              <rect x="28" y="35" width="64" height="18" rx="7" fill="rgba(255,255,255,0.2)"/>
              <line x1="42" y1="28" x2="42" y2="44" stroke="rgba(255,255,255,0.7)" strokeWidth="3" strokeLinecap="round"/>
              <line x1="78" y1="28" x2="78" y2="44" stroke="rgba(255,255,255,0.7)" strokeWidth="3" strokeLinecap="round"/>
              <circle cx="45" cy="63" r="4" fill="rgba(255,255,255,0.6)"/>
              <circle cx="60" cy="63" r="4" fill="rgba(255,255,255,0.6)"/>
              <circle cx="75" cy="63" r="4" fill="rgba(255,255,255,0.6)"/>
              <circle cx="45" cy="78" r="4" fill="rgba(255,255,255,0.4)"/>
              <circle cx="60" cy="78" r="4" fill="rgba(255,255,255,0.4)"/>
            </svg>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="dash-stats-row">
          {loading ? (
            <div className="dash-loading">Loading statistics…</div>
          ) : statCards.map((c, i) => (
            <div key={i} className="dash-stat-card" style={{ background: c.bg }}>
              <div className="dsc-icon">{c.icon}</div>
              <div className="dsc-body">
                <div className="dsc-value">{c.value}</div>
                <div className="dsc-label">{c.label}</div>
                <div className="dsc-sub">{c.sub}</div>
              </div>
              <div className="dsc-glow" />
            </div>
          ))}
        </div>

        {/* ── Quick Actions ── */}
        <div className="dash-section-title">Quick Actions</div>
        <div className="dash-actions-grid">
          {quickActions.map((a, i) => (
            <Link key={i} to={a.to} className="dash-action-card" style={{ background: a.color, borderColor: a.border, color: a.text }}>
              <span className="dac-icon">{a.icon}</span>
              <span className="dac-label">{a.label}</span>
            </Link>
          ))}
        </div>

        {/* ── Modules overview ── */}
        <div className="dash-section-title">Modules</div>
        <div className="dash-modules-row">
          <div className="dash-module-card">
            <div className="dmc-header" style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)' }}>
              <span className="dmc-icon">⚙️</span>
              <span>Maintenance</span>
              <span className="dmc-badge">Admin Only</span>
            </div>
            <div className="dmc-links">
              <Link to="/maintenance/add-user" className="dmc-link">🔑 Create User</Link>
              <Link to="/maintenance/add-membership" className="dmc-link">Add Membership</Link>
              <Link to="/maintenance/update-membership" className="dmc-link">Update Membership</Link>
              <Link to="/maintenance/add-event" className="dmc-link">Add Event</Link>
              <Link to="/maintenance/update-event" className="dmc-link">Update Event</Link>
              <Link to="/maintenance/add-venue" className="dmc-link">Add Venue</Link>
              <Link to="/maintenance/update-venue" className="dmc-link">Update Venue</Link>
            </div>
          </div>

          <div className="dash-module-card">
            <div className="dmc-header" style={{ background: 'linear-gradient(135deg,#0891b2,#0e7490)' }}>
              <span className="dmc-icon">💳</span>
              <span>Transactions</span>
            </div>
            <div className="dmc-links">
              <Link to="/transactions/register" className="dmc-link">Register for Event</Link>
              <Link to="/transactions/view" className="dmc-link">View Registrations</Link>
            </div>
          </div>

          <div className="dash-module-card">
            <div className="dmc-header" style={{ background: 'linear-gradient(135deg,#059669,#047857)' }}>
              <span className="dmc-icon">📊</span>
              <span>Reports</span>
            </div>
            <div className="dmc-links">
              <Link to="/reports/members" className="dmc-link">Member Report</Link>
              <Link to="/reports/events" className="dmc-link">Event Report</Link>
              <Link to="/reports/bookings" className="dmc-link">Booking Report</Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
