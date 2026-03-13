import React, { useState } from 'react';
import './Dashboard.css';
import Maintenance from './Maintenance';
import Reports from './Reports';
import Transactions from './Transactions';

function Dashboard({ user, onLogout }) {
    const [activeView, setActiveView] = useState('home');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        onLogout();
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div className="welcome-text">
                    Welcome<br />{user.name}<br />
                    <span className="role-badge">{user.role.toUpperCase()}</span>
                </div>
            </div>
            <div className="dashboard-nav">
                {user.role === 'admin' && (
                    <button className="nav-btn" onClick={() => setActiveView('maintenance')}>
                        Maintenance
                    </button>
                )}
                <button className="nav-btn" onClick={() => setActiveView('reports')}>
                    Reports
                </button>
                <button className="nav-btn" onClick={() => setActiveView('transactions')}>
                    Transactions
                </button>
                <button className="nav-btn" onClick={handleLogout}>
                    LogOut
                </button>
            </div>
            <div className="dashboard-content">
                {activeView === 'home' && (
                    <div className="welcome-message">
                        <h2>Welcome to Event Management System</h2>
                        <p>Role: {user.role === 'admin' ? 'Administrator' : 'User'}</p>
                        {user.role === 'admin' && (
                            <p className="access-info">✓ Full access to Maintenance, Reports, and Transactions</p>
                        )}
                        {user.role === 'user' && (
                            <p className="access-info">✓ Access to Reports and Transactions</p>
                        )}
                    </div>
                )}
                {activeView === 'maintenance' && user.role === 'admin' && <Maintenance />}
                {activeView === 'reports' && <Reports user={user} />}
                {activeView === 'transactions' && <Transactions user={user} />}
            </div>
        </div>
    );
}

export default Dashboard;
