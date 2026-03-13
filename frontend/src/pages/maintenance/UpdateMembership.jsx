import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar.jsx';

const UpdateMembership = () => {
  const [searchNumber, setSearchNumber] = useState('');
  const [member, setMember] = useState(null);
  const [searchError, setSearchError] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [action, setAction] = useState('extend');
  const [extensionType, setExtensionType] = useState('6months');
  const [success, setSuccess] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchNumber.trim()) {
      setSearchError('Please enter a membership number');
      return;
    }
    setSearchError('');
    setMember(null);
    setSuccess('');
    setSubmitError('');
    setSearchLoading(true);

    try {
      const response = await axios.get(`/api/members/${searchNumber.trim()}`);
      setMember(response.data);
      setAction('extend');
      setExtensionType('6months');
    } catch (error) {
      setSearchError(error.response?.data?.message || 'Member not found');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setSubmitError('');
    setSubmitLoading(true);

    try {
      const payload = { action };
      if (action === 'extend') {
        payload.extensionType = extensionType;
      }

      const response = await axios.put(`/api/members/${member.membershipNumber}`, payload);
      setSuccess(
        action === 'cancel'
          ? `Membership ${member.membershipNumber} has been cancelled successfully.`
          : `Membership ${member.membershipNumber} has been extended successfully. New end date: ${formatDate(response.data.member.endDate)}`
      );
      setMember(response.data.member);
    } catch (error) {
      setSubmitError(error.response?.data?.message || 'Error updating membership');
    } finally {
      setSubmitLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    if (status === 'Active') return 'badge badge-success';
    if (status === 'Cancelled') return 'badge badge-danger';
    return 'badge badge-warning';
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="content-wrapper">
        <div className="page-header">
          <h2>Update Membership</h2>
          <p>Search a member to extend or cancel their membership</p>
        </div>

        {/* Search Section */}
        <div className="form-card">
          <h3>Search Member</h3>
          <form onSubmit={handleSearch} className="search-form">
            <div className="form-group">
              <label htmlFor="searchNumber">Membership Number *</label>
              <div className="input-with-button">
                <input
                  id="searchNumber"
                  type="text"
                  value={searchNumber}
                  onChange={(e) => {
                    setSearchNumber(e.target.value);
                    setSearchError('');
                  }}
                  placeholder="Enter membership number (e.g., MEM1234567890)"
                  className={`form-control ${searchError ? 'error' : ''}`}
                />
                <button type="submit" className="btn btn-primary" disabled={searchLoading}>
                  {searchLoading ? 'Searching...' : 'Search'}
                </button>
              </div>
              {searchError && <span className="error-message">{searchError}</span>}
            </div>
          </form>
        </div>

        {/* Member Details */}
        {member && (
          <div className="form-card">
            <h3>Member Details</h3>

            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Membership Number</span>
                <span className="detail-value">{member.membershipNumber}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Full Name</span>
                <span className="detail-value">{member.firstName} {member.lastName}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email</span>
                <span className="detail-value">{member.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Phone</span>
                <span className="detail-value">{member.phone}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Membership Type</span>
                <span className="detail-value">{member.membershipType}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Start Date</span>
                <span className="detail-value">{formatDate(member.startDate)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">End Date</span>
                <span className="detail-value">{formatDate(member.endDate)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Status</span>
                <span className={getStatusBadgeClass(member.status)}>{member.status}</span>
              </div>
            </div>

            {/* Success / Error Messages */}
            {success && <div className="alert alert-success">{success}</div>}
            {submitError && <div className="alert alert-error">{submitError}</div>}

            {/* Update Options */}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Action *</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="action"
                      value="extend"
                      checked={action === 'extend'}
                      onChange={(e) => setAction(e.target.value)}
                    />
                    <span>Extend Membership</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="action"
                      value="cancel"
                      checked={action === 'cancel'}
                      onChange={(e) => setAction(e.target.value)}
                    />
                    <span>Cancel Membership</span>
                  </label>
                </div>
              </div>

              {action === 'extend' && (
                <div className="form-group">
                  <label>Extension Period *</label>
                  <div className="radio-group">
                    {[
                      { value: '6months', label: '6 Months' },
                      { value: '1year', label: '1 Year' },
                      { value: '2years', label: '2 Years' }
                    ].map(type => (
                      <label key={type.value} className="radio-label">
                        <input
                          type="radio"
                          name="extensionType"
                          value={type.value}
                          checked={extensionType === type.value}
                          onChange={(e) => setExtensionType(e.target.value)}
                        />
                        <span>{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {action === 'cancel' && (
                <div className="alert alert-warning">
                  <strong>Warning:</strong> You are about to cancel membership for <strong>{member.firstName} {member.lastName}</strong>. This action will mark the membership as Cancelled.
                </div>
              )}

              <div className="form-actions">
                <button
                  type="submit"
                  className={`btn ${action === 'cancel' ? 'btn-danger' : 'btn-primary'}`}
                  disabled={submitLoading}
                >
                  {submitLoading ? 'Processing...' : action === 'cancel' ? 'Cancel Membership' : 'Extend Membership'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateMembership;
