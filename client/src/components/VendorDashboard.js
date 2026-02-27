import React, { useState } from 'react';
import './VendorDashboard.css';
import YourItems from './YourItems';
import AddNewItem from './AddNewItem';
import Transaction from './Transaction';

function VendorDashboard({ user, onLogout }) {
    const [activeView, setActiveView] = useState('home');

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div className="welcome-text">Welcome<br />Vendor</div>
            </div>
            <div className="dashboard-nav">
                <button className="nav-btn" onClick={() => setActiveView('items')}>Your Item</button>
                <button className="nav-btn" onClick={() => setActiveView('addItem')}>Add New Item</button>
                <button className="nav-btn" onClick={() => setActiveView('transactions')}>Transaction</button>
                <button className="nav-btn" onClick={onLogout}>LogOut</button>
            </div>
            <div className="dashboard-content">
                {activeView === 'home' && (
                    <div className="welcome-message">
                        <h2>Welcome to Event Management System</h2>
                        <p>Select an option from the menu above to get started</p>
                    </div>
                )}
                {activeView === 'items' && <YourItems />}
                {activeView === 'addItem' && <AddNewItem />}
                {activeView === 'transactions' && <Transaction />}
            </div>
        </div>
    );
}

export default VendorDashboard;
