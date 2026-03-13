import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar.jsx';

const AddEvent = () => {
  const [formData, setFormData] = useState({
    eventName: '',
    description: '',
    category: 'Conference',
    venueId: '',
    eventDate: '',
    startTime: '',
    endTime: '',
    maxParticipants: '',
    fee: '0',
    status: 'Upcoming'
  });
  const [venues, setVenues] = useState([]);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [generatedId, setGeneratedId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axios.get('/api/venues');
        setVenues(response.data.filter(v => v.status === 'Active'));
      } catch (error) {
        console.error('Error fetching venues:', error);
      }
    };
    fetchVenues();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.eventName.trim()) newErrors.eventName = 'Event name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.eventDate) newErrors.eventDate = 'Event date is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';
    if (!formData.maxParticipants) {
      newErrors.maxParticipants = 'Max participants is required';
    } else if (isNaN(formData.maxParticipants) || Number(formData.maxParticipants) < 1) {
      newErrors.maxParticipants = 'Must be a positive number';
    }
    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.endTime = 'End time must be after start time';
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
      const response = await axios.post('/api/events', formData);
      setGeneratedId(response.data.eventId);
      setSuccess(`Event created successfully! Event ID: ${response.data.eventId}`);
      handleReset();
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || 'Error creating event' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      eventName: '',
      description: '',
      category: 'Conference',
      venueId: '',
      eventDate: '',
      startTime: '',
      endTime: '',
      maxParticipants: '',
      fee: '0',
      status: 'Upcoming'
    });
    setErrors({});
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="content-wrapper">
        <div className="page-header">
          <h2>Add Event</h2>
          <p>Create a new event in the system</p>
        </div>

        {success && (
          <div className="alert alert-success">
            {success}
            {generatedId && (
              <div className="generated-id">
                <strong>Event ID: {generatedId}</strong>
              </div>
            )}
          </div>
        )}
        {errors.submit && <div className="alert alert-error">{errors.submit}</div>}

        <form onSubmit={handleSubmit} className="form-card" noValidate>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="eventName">Event Name *</label>
              <input
                id="eventName"
                name="eventName"
                type="text"
                value={formData.eventName}
                onChange={handleChange}
                className={`form-control ${errors.eventName ? 'error' : ''}`}
                placeholder="Enter event name"
              />
              {errors.eventName && <span className="error-message">{errors.eventName}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`form-control ${errors.category ? 'error' : ''}`}
              >
                {['Conference', 'Workshop', 'Seminar', 'Social', 'Sports', 'Other'].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <span className="error-message">{errors.category}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`form-control ${errors.description ? 'error' : ''}`}
              placeholder="Enter event description"
              rows="3"
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="venueId">Venue</label>
              <select
                id="venueId"
                name="venueId"
                value={formData.venueId}
                onChange={handleChange}
                className="form-control"
              >
                <option value="">-- Select Venue --</option>
                {venues.map(venue => (
                  <option key={venue._id} value={venue.venueId}>
                    {venue.venueName} (Capacity: {venue.capacity})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="status">Status *</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-control"
              >
                {['Upcoming', 'Ongoing', 'Completed', 'Cancelled'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="eventDate">Event Date *</label>
              <input
                id="eventDate"
                name="eventDate"
                type="date"
                value={formData.eventDate}
                onChange={handleChange}
                className={`form-control ${errors.eventDate ? 'error' : ''}`}
              />
              {errors.eventDate && <span className="error-message">{errors.eventDate}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="startTime">Start Time *</label>
              <input
                id="startTime"
                name="startTime"
                type="time"
                value={formData.startTime}
                onChange={handleChange}
                className={`form-control ${errors.startTime ? 'error' : ''}`}
              />
              {errors.startTime && <span className="error-message">{errors.startTime}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="endTime">End Time *</label>
              <input
                id="endTime"
                name="endTime"
                type="time"
                value={formData.endTime}
                onChange={handleChange}
                className={`form-control ${errors.endTime ? 'error' : ''}`}
              />
              {errors.endTime && <span className="error-message">{errors.endTime}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="maxParticipants">Max Participants *</label>
              <input
                id="maxParticipants"
                name="maxParticipants"
                type="number"
                min="1"
                value={formData.maxParticipants}
                onChange={handleChange}
                className={`form-control ${errors.maxParticipants ? 'error' : ''}`}
                placeholder="Enter max participants"
              />
              {errors.maxParticipants && <span className="error-message">{errors.maxParticipants}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fee">Fee ($)</label>
              <input
                id="fee"
                name="fee"
                type="number"
                min="0"
                step="0.01"
                value={formData.fee}
                onChange={handleChange}
                className="form-control"
                placeholder="0"
              />
              <span className="help-text">Leave as 0 for free events</span>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Add Event'}
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

export default AddEvent;
