import React, { useState } from 'react';
import './App.css';
import Login from './components/Login';
import VendorDashboard from './components/VendorDashboard';
import VendorSignup from './components/VendorSignup';

function App() {
  const [currentView, setCurrentView] = useState('login');
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('login');
  };

  return (
    <div className="App">
      {currentView === 'login' && (
        <Login onLogin={handleLogin} onSignup={() => setCurrentView('signup')} />
      )}
      {currentView === 'signup' && (
        <VendorSignup onBack={() => setCurrentView('login')} />
      )}
      {currentView === 'dashboard' && (
        <VendorDashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
