import React, { useState } from 'react';
import axios from 'axios';
import './Maintenance.css';

function Maintenance() {
    const [activeTab, setActiveTab] = useState('add');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        membershipType: '6months'
    });
    const [updateData, setUpdateData] = useState({
        membershipNumber: '',
        action: 'extend',
        extensionType: '6months'
    });
    const [membershipDetails, setMembershipDetails] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleAddChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdateChange = (e) => {
        setUpdateData({ ...updateData, [e.target.name]: e.target.value });
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!formData.name || !formData.email || !formData.phone || !formData.address) {
            setError('All fields are mandatory');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('/api/memberships', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage(`Membership created successfully! Number: ${response.data.membership.membershipNumber}`);
            setFormData({ name: '', email: '', phone: '', address: '', membershipType: '6months' });
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to create membership');
        }
    };

    const fetchMembership = async () => {
        if (!updateData.membershipNumber) {
            setError('Membership Number is mandatory');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/api/memberships/${updateData.membershipNumber}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMembershipDetails(response.data);
            setError('');
        } catch (error) {
            setError('Membership not found');
            setMembershipDetails(null);
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/memberships/${updateData.membershipNumber}`, {
                action: updateData.action,
                extensionType: updateData.extensionType
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('Membership updated successfully!');
            fetchMembership();
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to update membership');
        }
    };

    return (
        <div className="maintenance">
            <h2>Maintenance Module (Admin Only)</h2>
            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'add' ? 'active' : ''}`}
                    onClick={() => setActiveTab('add')}
                >
                    Add Membership
                </button>
                <button
                    className={`tab ${activeTab === 'update' ? 'active' : ''}`}
                    onClick={() => setActiveTab('update')}
                >
                    Update Membership
                </button>
            </div>

            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}

            {activeTab === 'add' && (
                <form onSubmit={handleAddSubmit} className="maintenance-form">
                    <h3>Add New Membership</h3>
                    <p className="info-text">All fields are mandatory</p>

                    <div className="form-row">
                        <label>Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleAddChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <label>Email *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleAddChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <label>Phone *</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleAddChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <label>Address *</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleAddChange}
                            rows="3"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <label>Membership Type *</label>
                        <div className="radio-group">
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="membershipType"
                                    value="6months"
                                    checked={formData.membershipType === '6months'}
                                    onChange={handleAddChange}
                                />
                                6 Months (Default)
                            </label>
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="membershipType"
                                    value="1year"
                                    checked={formData.membershipType === '1year'}
                                    onChange={handleAddChange}
                                />
                                1 Year
                            </label>
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="membershipType"
                                    value="2years"
                                    checked={formData.membershipType === '2years'}
                                    onChange={handleAddChange}
                                />
                                2 Years
                            </label>
                        </div>
                    </div>

                    <button type="submit" className="btn-submit">Add Membership</button>
                </form>
            )}

            {activeTab === 'update' && (
                <div className="update-section">
                    <h3>Update Membership</h3>
                    <div className="search-section">
                        <div className="form-row">
                            <label>Membership Number *</label>
                            <div className="search-group">
                                <input
                                    type="text"
                                    name="membershipNumber"
                                    value={updateData.membershipNumber}
                                    onChange={handleUpdateChange}
                                    placeholder="Enter membership number"
                                />
                                <button type="button" onClick={fetchMembership} className="btn-search">
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>

                    {membershipDetails && (
                        <div className="membership-details">
                            <h4>Membership Details</h4>
                            <div className="details-grid">
                                <div><strong>Number:</strong> {membershipDetails.membershipNumber}</div>
                                <div><strong>Name:</strong> {membershipDetails.name}</div>
                                <div><strong>Email:</strong> {membershipDetails.email}</div>
                                <div><strong>Phone:</strong> {membershipDetails.phone}</div>
                                <div><strong>Status:</strong> {membershipDetails.status}</div>
                                <div><strong>End Date:</strong> {new Date(membershipDetails.endDate).toLocaleDateString()}</div>
                            </div>

                            <form onSubmit={handleUpdateSubmit} className="update-form">
                                <div className="form-row">
                                    <label>Action</label>
                                    <div className="radio-group">
                                        <label className="radio-label">
                                            <input
                                                type="radio"
                                                name="action"
                                                value="extend"
                                                checked={updateData.action === 'extend'}
                                                onChange={handleUpdateChange}
                                            />
                                            Extend Membership
                                        </label>
                                        <label className="radio-label">
                                            <input
                                                type="radio"
                                                name="action"
                                                value="cancel"
                                                checked={updateData.action === 'cancel'}
                                                onChange={handleUpdateChange}
                                            />
                                            Cancel Membership
                                        </label>
                                    </div>
                                </div>

                                {updateData.action === 'extend' && (
                                    <div className="form-row">
                                        <label>Extension Period</label>
                                        <div className="radio-group">
                                            <label className="radio-label">
                                                <input
                                                    type="radio"
                                                    name="extensionType"
                                                    value="6months"
                                                    checked={updateData.extensionType === '6months'}
                                                    onChange={handleUpdateChange}
                                                />
                                                6 Months (Default)
                                            </label>
                                            <label className="radio-label">
                                                <input
                                                    type="radio"
                                                    name="extensionType"
                                                    value="1year"
                                                    checked={updateData.extensionType === '1year'}
                                                    onChange={handleUpdateChange}
                                                />
                                                1 Year
                                            </label>
                                            <label className="radio-label">
                                                <input
                                                    type="radio"
                                                    name="extensionType"
                                                    value="2years"
                                                    checked={updateData.extensionType === '2years'}
                                                    onChange={handleUpdateChange}
                                                />
                                                2 Years
                                            </label>
                                        </div>
                                    </div>
                                )}

                                <button type="submit" className="btn-submit">Update Membership</button>
                            </form>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Maintenance;
