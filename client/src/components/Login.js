import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

function Login({ onLogin }) {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!userId || !password) {
            setError('All fields are required');
            return;
        }

        try {
            const response = await axios.post('/api/auth/login', { userId, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            onLogin(response.data.user);
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="login-container">
            <div className="login-header">Event Management System</div>
            <form onSubmit={handleSubmit} className="login-form">
                {error && <div className="error-message">{error}</div>}
                <div className="form-group">
                    <label>User Id</label>
                    <input
                        type="text"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        placeholder="Enter User ID"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter Password"
                        required
                    />
                </div>
                <div className="button-group">
                    <button type="button" className="btn-cancel" onClick={() => {
                        setUserId('');
                        setPassword('');
                        setError('');
                    }}>Cancel</button>
                    <button type="submit" className="btn-login">Login</button>
                </div>
            </form>
            <div className="login-hints">
                <p>Admin: admin / admin123</p>
                <p>User: user1 / admin123</p>
            </div>
        </div>
    );
}

export default Login;
