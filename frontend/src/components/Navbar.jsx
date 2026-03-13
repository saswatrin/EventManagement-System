import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [maintenanceOpen, setMaintenanceOpen] = useState(false);
  const [transactionsOpen, setTransactionsOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };
  const closeAll = () => { setMaintenanceOpen(false); setTransactionsOpen(false); setReportsOpen(false); };

  return (
    <nav className="navbar">
      {/* Brand */}
      <div className="navbar-brand">
        <Link to={user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'} className="brand-link">
          <span className="brand-logo-wrap">
            <svg width="34" height="34" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="10" fill="rgba(255,255,255,0.15)"/>
              <rect x="7" y="12" width="26" height="21" rx="3" stroke="white" strokeWidth="1.8" fill="none"/>
              <rect x="7" y="12" width="26" height="7" rx="3" fill="rgba(255,255,255,0.3)"/>
              <line x1="13" y1="9" x2="13" y2="15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <line x1="27" y1="9" x2="27" y2="15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="14" cy="25" r="1.8" fill="white"/>
              <circle cx="20" cy="25" r="1.8" fill="white"/>
              <circle cx="26" cy="25" r="1.8" fill="white"/>
              <circle cx="14" cy="31" r="1.8" fill="white"/>
              <circle cx="20" cy="31" r="1.8" fill="white"/>
            </svg>
          </span>
          <span className="brand-text-wrap">
            <span className="brand-name">EventSphere</span>
            <span className="brand-sub">Management Portal</span>
          </span>
        </Link>
      </div>

      {/* Links */}
      <div className="navbar-menu">
        <Link to={user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'} className="nav-link" onClick={closeAll}>
          Dashboard
        </Link>

        {user?.role === 'admin' && (
          <div className="nav-dropdown">
            <button className="nav-link dropdown-toggle" onClick={() => { setMaintenanceOpen(!maintenanceOpen); setTransactionsOpen(false); setReportsOpen(false); }}>
              Maintenance
            </button>
            {maintenanceOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-section-label">Members</div>
                <Link to="/maintenance/add-membership" className="dropdown-item" onClick={closeAll}><span className="di-icon">➕</span>Add Membership</Link>
                <Link to="/maintenance/update-membership" className="dropdown-item" onClick={closeAll}><span className="di-icon">✏️</span>Update Membership</Link>
                <div className="dropdown-divider"/>
                <div className="dropdown-section-label">Users</div>
                <Link to="/maintenance/add-user" className="dropdown-item" onClick={closeAll}><span className="di-icon">👤</span>Create User</Link>
                <div className="dropdown-divider"/>
                <div className="dropdown-section-label">Events</div>
                <Link to="/maintenance/add-event" className="dropdown-item" onClick={closeAll}><span className="di-icon">➕</span>Add Event</Link>
                <Link to="/maintenance/update-event" className="dropdown-item" onClick={closeAll}><span className="di-icon">✏️</span>Update Event</Link>
                <div className="dropdown-divider"/>
                <div className="dropdown-section-label">Venues</div>
                <Link to="/maintenance/add-venue" className="dropdown-item" onClick={closeAll}><span className="di-icon">➕</span>Add Venue</Link>
                <Link to="/maintenance/update-venue" className="dropdown-item" onClick={closeAll}><span className="di-icon">✏️</span>Update Venue</Link>
              </div>
            )}
          </div>
        )}

        <div className="nav-dropdown">
          <button className="nav-link dropdown-toggle" onClick={() => { setTransactionsOpen(!transactionsOpen); setMaintenanceOpen(false); setReportsOpen(false); }}>
            Transactions
          </button>
          {transactionsOpen && (
            <div className="dropdown-menu">
              <Link to="/transactions/register" className="dropdown-item" onClick={closeAll}><span className="di-icon">🎟️</span>Register for Event</Link>
              <Link to="/transactions/view" className="dropdown-item" onClick={closeAll}><span className="di-icon">📋</span>View Registrations</Link>
            </div>
          )}
        </div>

        <div className="nav-dropdown">
          <button className="nav-link dropdown-toggle" onClick={() => { setReportsOpen(!reportsOpen); setMaintenanceOpen(false); setTransactionsOpen(false); }}>
            Reports
          </button>
          {reportsOpen && (
            <div className="dropdown-menu">
              <Link to="/reports/members" className="dropdown-item" onClick={closeAll}><span className="di-icon">👥</span>Member Report</Link>
              <Link to="/reports/events" className="dropdown-item" onClick={closeAll}><span className="di-icon">📅</span>Event Report</Link>
              <Link to="/reports/bookings" className="dropdown-item" onClick={closeAll}><span className="di-icon">📊</span>Booking Report</Link>
            </div>
          )}
        </div>

        <Link to="/flowchart" className="nav-link" onClick={closeAll}>Flow Chart</Link>
      </div>

      {/* User */}
      <div className="navbar-user">
        <div className="user-avatar-circle">{(user?.name || user?.username || 'U')[0].toUpperCase()}</div>
        <div className="user-meta">
          <span className="user-display-name">{user?.name || user?.username}</span>
          <span className="user-role-pill">{user?.role === 'admin' ? 'Admin' : 'User'}</span>
        </div>
        <button onClick={handleLogout} className="logout-btn" title="Logout">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
