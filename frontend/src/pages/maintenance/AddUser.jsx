import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar.jsx';

const AddUser = () => {
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', confirmPassword: '', role: 'user' });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim())     errs.name     = 'Full name is required';
    if (!form.username.trim()) errs.username  = 'Username is required';
    else if (form.username.length < 3) errs.username = 'Username must be at least 3 characters';
    if (!form.email.trim())    errs.email    = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Invalid email format';
    if (!form.password)        errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm password';
    else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSuccess('');
    if (!validate()) return;
    setLoading(true);
    try {
      await axios.post('/api/auth/register', {
        name: form.name, username: form.username,
        email: form.email, password: form.password, role: form.role
      });
      setSuccess(`User "${form.username}" created successfully with role: ${form.role}`);
      setForm({ name: '', username: '', email: '', password: '', confirmPassword: '', role: 'user' });
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Error creating user' });
    } finally { setLoading(false); }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="content-wrapper">
        <div className="page-header">
          <h2>Create User Account</h2>
          <p>Add a new admin or user to the system</p>
        </div>

        {success && <div className="alert alert-success">{success}</div>}
        {errors.submit && <div className="alert alert-error">{errors.submit}</div>}

        <form onSubmit={handleSubmit} className="form-card" noValidate>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input name="name" value={form.name} onChange={handleChange}
                className={`form-control ${errors.name ? 'error' : ''}`} placeholder="Enter full name" />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label>Username *</label>
              <input name="username" value={form.username} onChange={handleChange}
                className={`form-control ${errors.username ? 'error' : ''}`} placeholder="Enter username" />
              {errors.username && <span className="error-message">{errors.username}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input name="email" type="email" value={form.email} onChange={handleChange}
              className={`form-control ${errors.email ? 'error' : ''}`} placeholder="Enter email address" />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Password *</label>
              <input name="password" type="password" value={form.password} onChange={handleChange}
                className={`form-control ${errors.password ? 'error' : ''}`} placeholder="Min 6 characters" />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
            <div className="form-group">
              <label>Confirm Password *</label>
              <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange}
                className={`form-control ${errors.confirmPassword ? 'error' : ''}`} placeholder="Re-enter password" />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Role *</label>
            <div className="radio-group">
              <label className="radio-label">
                <input type="radio" name="role" value="user" checked={form.role === 'user'} onChange={handleChange} />
                <span>User — Transactions &amp; Reports only</span>
              </label>
              <label className="radio-label">
                <input type="radio" name="role" value="admin" checked={form.role === 'admin'} onChange={handleChange} />
                <span>Admin — Full access (Maintenance, Transactions, Reports)</span>
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create User'}
            </button>
            <button type="button" className="btn btn-secondary"
              onClick={() => { setForm({ name:'', username:'', email:'', password:'', confirmPassword:'', role:'user' }); setErrors({}); setSuccess(''); }}>
              Reset
            </button>
          </div>
        </form>

        <div className="info-box" style={{marginTop:24,background:'#eff6ff',border:'1px solid #bfdbfe',borderRadius:10,padding:'16px 20px'}}>
          <strong style={{color:'#1d4ed8'}}>ℹ️ Role Permissions</strong>
          <div style={{marginTop:8,fontSize:13,color:'#374151',display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
            <div><strong>Admin:</strong> Maintenance + Transactions + Reports</div>
            <div><strong>User:</strong> Transactions + Reports only (no Maintenance)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
