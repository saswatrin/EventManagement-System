import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar.jsx';

const UpdateVenue = () => {
  const [searchId, setSearchId] = useState('');
  const [searchError, setSearchError] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [venue, setVenue] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchId.trim()) {
      setSearchError('Please enter a venue ID');
      return;
    }
    setSearchError('');
    setVenue(null);
    setSuccess('');
    setSearchLoading(true);

    try {
      const response = await axios.get(`/api/venues/${searchId.trim()}`);
      const v = response.data;
      setVenue(v);
      setFormData({
        venueName: v.venueName || '',
        address: v.address || '',
        capacity: v.capacity?.toString() || '',
        contactPerson: v.contactPerson || '',
        contactPhone: v.contactPhone || '',
        status: v.status || 'Active'
      });
    } catch (error) {
      setSearchError(error.response?.data?.message || 'Venue not found');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.venueName?.trim()) newErrors.venueName = 'Venue name is required';
    if (!formData.address?.trim()) newErrors.address = 'Address is required';
    if (!formData.capacity) {
      newErrors.capacity = 'Capacity is required';
    } else if (isNaN(formData.capacity) || Number(formData.capacity) < 1) {
      newErrors.capacity = 'Must be a positive number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    if (!validate()) return;

    setSubmitLoading(true);
    try {
      const response = await axios.put(`/api/venues/${venue.venueId}`, formData);
      setSuccess('Venue updated successfully!');
      setVenue(response.data.venue);
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || 'Error updating venue' });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="content-wrapper">
        <div className="page-header">
          <h2>Update Venue</h2>
          <p>Search a venue by ID to update its details</p>
        </div>

        <div className="form-card">
          <h3>Search Venue</h3>
          <form onSubmit={handleSearch} className="search-form">
            <div className="form-group">
              <label htmlFor="searchId">Venue ID *</label>
              <div className="input-with-button">
                <input
                  id="searchId"
                  type="text"
                  value={searchId}
                  onChange={(e) => { setSearchId(e.target.value); setSearchError(''); }}
                  placeholder="Enter venue ID (e.g., VEN1234567890)"
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

        {venue && (
          <div className="form-card">
            <h3>Update Venue: {venue.venueId}</h3>

            {success && <div className="alert alert-success">{success}</div>}
            {errors.submit && <div className="alert alert-error">{errors.submit}</div>}

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="venueName">Venue Name *</label>
                  <input
                    id="venueName"
                    name="venueName"
                    type="text"
                    value={formData.venueName}
                    onChange={handleChange}
                    className={`form-control ${errors.venueName ? 'error' : ''}`}
                  />
                  {errors.venueName && <span className="error-message">{errors.venueName}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="capacity">Capacity *</label>
                  <input
                    id="capacity"
                    name="capacity"
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={handleChange}
                    className={`form-control ${errors.capacity ? 'error' : ''}`}
                  />
                  {errors.capacity && <span className="error-message">{errors.capacity}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="address">Address *</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`form-control ${errors.address ? 'error' : ''}`}
                  rows="3"
                />
                {errors.address && <span className="error-message">{errors.address}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="contactPerson">Contact Person</label>
                  <input
                    id="contactPerson"
                    name="contactPerson"
                    type="text"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contactPhone">Contact Phone</label>
                  <input
                    id="contactPhone"
                    name="contactPhone"
                    type="tel"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={submitLoading}>
                  {submitLoading ? 'Updating...' : 'Update Venue'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateVenue;
