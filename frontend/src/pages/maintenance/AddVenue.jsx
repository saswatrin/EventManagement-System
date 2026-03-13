import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar.jsx';

const AddVenue = () => {
  const [formData, setFormData] = useState({
    venueName: '',
    address: '',
    capacity: '',
    contactPerson: '',
    contactPhone: ''
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [generatedId, setGeneratedId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.venueName.trim()) newErrors.venueName = 'Venue name is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.capacity) {
      newErrors.capacity = 'Capacity is required';
    } else if (isNaN(formData.capacity) || Number(formData.capacity) < 1) {
      newErrors.capacity = 'Capacity must be a positive number';
    }
    if (formData.contactPhone && !/^\d{10,15}$/.test(formData.contactPhone.replace(/[^0-9]/g, ''))) {
      newErrors.contactPhone = 'Invalid phone number format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await axios.post('/api/venues', formData);
      setGeneratedId(response.data.venueId);
      setSuccess(`Venue created successfully! Venue ID: ${response.data.venueId}`);
      handleReset();
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || 'Error creating venue' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      venueName: '',
      address: '',
      capacity: '',
      contactPerson: '',
      contactPhone: ''
    });
    setErrors({});
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="content-wrapper">
        <div className="page-header">
          <h2>Add Venue</h2>
          <p>Register a new venue in the system</p>
        </div>

        {success && (
          <div className="alert alert-success">
            {success}
            {generatedId && (
              <div className="generated-id">
                <strong>Venue ID: {generatedId}</strong>
              </div>
            )}
          </div>
        )}
        {errors.submit && <div className="alert alert-error">{errors.submit}</div>}

        <form onSubmit={handleSubmit} className="form-card" noValidate>
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
                placeholder="Enter venue name"
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
                placeholder="Enter venue capacity"
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
              placeholder="Enter venue address"
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
                placeholder="Enter contact person name"
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
                className={`form-control ${errors.contactPhone ? 'error' : ''}`}
                placeholder="Enter contact phone number"
              />
              {errors.contactPhone && <span className="error-message">{errors.contactPhone}</span>}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Add Venue'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleReset}>
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVenue;
