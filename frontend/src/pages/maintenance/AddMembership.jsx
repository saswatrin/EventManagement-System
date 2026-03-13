import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar.jsx';

const AddMembership = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'Male',
    email: '',
    phone: '',
    address: '',
    membershipType: '6months',
    startDate: ''
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [generatedNumber, setGeneratedNumber] = useState('');
  const [calculatedEndDate, setCalculatedEndDate] = useState('');
  const [loading, setLoading] = useState(false);

  const calculateEndDate = (startDate, membershipType) => {
    if (!startDate) return '';
    const start = new Date(startDate);
    const end = new Date(start);
    if (membershipType === '6months') {
      end.setMonth(end.getMonth() + 6);
    } else if (membershipType === '1year') {
      end.setMonth(end.getMonth() + 12);
    } else if (membershipType === '2years') {
      end.setMonth(end.getMonth() + 24);
    }
    return end.toISOString().split('T')[0];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);

    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }

    if (name === 'startDate' || name === 'membershipType') {
      const sd = name === 'startDate' ? value : formData.startDate;
      const mt = name === 'membershipType' ? value : formData.membershipType;
      setCalculatedEndDate(calculateEndDate(sd, mt));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10,15}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
      newErrors.phone = 'Invalid phone number';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await axios.post('/api/members', formData);
      setGeneratedNumber(response.data.membershipNumber);
      setSuccess(`Member added successfully! Membership Number: ${response.data.membershipNumber}`);
      handleReset();
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || 'Error creating member' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: 'Male',
      email: '',
      phone: '',
      address: '',
      membershipType: '6months',
      startDate: ''
    });
    setErrors({});
    setCalculatedEndDate('');
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="content-wrapper">
        <div className="page-header">
          <h2>Add Membership</h2>
          <p>Register a new member in the system</p>
        </div>

        {success && (
          <div className="alert alert-success">
            {success}
            {generatedNumber && (
              <div className="generated-id">
                <strong>Membership Number: {generatedNumber}</strong>
              </div>
            )}
          </div>
        )}

        {errors.submit && <div className="alert alert-error">{errors.submit}</div>}

        <form onSubmit={handleSubmit} className="form-card" noValidate>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                className={`form-control ${errors.firstName ? 'error' : ''}`}
                placeholder="Enter first name"
              />
              {errors.firstName && <span className="error-message">{errors.firstName}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name *</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                className={`form-control ${errors.lastName ? 'error' : ''}`}
                placeholder="Enter last name"
              />
              {errors.lastName && <span className="error-message">{errors.lastName}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth *</label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className={`form-control ${errors.dateOfBirth ? 'error' : ''}`}
              />
              {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
            </div>
            <div className="form-group">
              <label>Gender *</label>
              <div className="radio-group">
                {['Male', 'Female', 'Other'].map(g => (
                  <label key={g} className="radio-label">
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={formData.gender === g}
                      onChange={handleChange}
                    />
                    <span>{g}</span>
                  </label>
                ))}
              </div>
              {errors.gender && <span className="error-message">{errors.gender}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-control ${errors.email ? 'error' : ''}`}
                placeholder="Enter email address"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone *</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className={`form-control ${errors.phone ? 'error' : ''}`}
                placeholder="Enter phone number"
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
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
              placeholder="Enter full address"
              rows="3"
            />
            {errors.address && <span className="error-message">{errors.address}</span>}
          </div>

          <div className="form-group">
            <label>Membership Type *</label>
            <div className="radio-group">
              {[
                { value: '6months', label: '6 Months' },
                { value: '1year', label: '1 Year' },
                { value: '2years', label: '2 Years' }
              ].map(type => (
                <label key={type.value} className="radio-label">
                  <input
                    type="radio"
                    name="membershipType"
                    value={type.value}
                    checked={formData.membershipType === type.value}
                    onChange={handleChange}
                  />
                  <span>{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Start Date *</label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                className={`form-control ${errors.startDate ? 'error' : ''}`}
              />
              {errors.startDate && <span className="error-message">{errors.startDate}</span>}
            </div>
            <div className="form-group">
              <label>End Date (Auto-calculated)</label>
              <input
                type="text"
                value={calculatedEndDate || 'Select start date first'}
                readOnly
                className="form-control readonly"
              />
              <span className="help-text">Calculated from start date + membership type</span>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Add Member'}
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

export default AddMembership;
