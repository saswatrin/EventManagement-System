import React, { useState } from 'react';
import './Login.css';

function Login({ onLogin, onSignup }) {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (userId && password) {
            onLogin({ userId, role: 'vendor' });
        } else {
            alert('Please enter User ID and Password');
        }
    };

    return (
        <div className="login-container">
            <div className="login-header">Event Management System</div>
            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <label>User Id</label>
                    <input
                        type="text"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        placeholder="User"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="User"
                        required
                    />
                </div>
                <div className="button-group">
                    <button type="button" className="btn-cancel" onClick={() => {
                        setUserId('');
                        setPassword('');
                    }}>Cancel</button>
                    <button type="submit" className="btn-login">Login</button>
                </div>
            </form>
            <button onClick={onSignup} className="btn-signup-link">Sign Up as Vendor</button>
        </div>
    );
}

export default Login;
