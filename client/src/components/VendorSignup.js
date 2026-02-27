import React, { useState } from 'react';
import './VendorSignup.css';

function VendorSignup({ onBack }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        category: 'Catering'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Vendor registered successfully!');
        onBack();
    };

    return (
        <div className="signup-container">
            <div className="signup-header">Event Management System</div>
            <form onSubmit={handleSubmit} className="signup-form">
                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Vendor"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Vendor"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Vendor"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Category</label>
                    <select name="category" value={formData.category} onChange={handleChange}>
                        <option value="Catering">* Catering</option>
                        <option value="Florist">* Florist</option>
                        <option value="Decoration">* Decoration</option>
                        <option value="Lighting">* Lighting</option>
                    </select>
                </div>
                <button type="submit" className="btn-signup">Sign Up</button>
            </form>
            <button onClick={onBack} className="btn-back">Back to Login</button>
        </div>
    );
}

export default VendorSignup;
