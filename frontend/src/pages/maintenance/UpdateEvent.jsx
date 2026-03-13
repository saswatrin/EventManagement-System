import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar.jsx';

const UpdateEvent = () => {
  const [searchId, setSearchId] = useState('');
  const [searchError, setSearchError] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [event, setEvent] = useState(null);
  const [venues, setVenues] = useState([]);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axios.get('/api/venues');
        setVenues(response.data);
      } catch (error) {
        console.error('Error fetching venues:', error);
      }
    };
    fetchVenues();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchId.trim()) {
      setSearchError('Please enter an event ID');
      return;
    }
    setSearchError('');
    setEvent(null);
    setSuccess('');
    setSearchLoading(true);

    try {
      const response = await axios.get(`/api/events/${searchId.trim()}`);
      const ev = response.data;
      setEvent(ev);
      setFormData({
        eventName: ev.eventName || '',
        description: ev.description || '',
        category: ev.category || 'Conference',
        venueId: ev.venueId || '',
        eventDate: ev.eventDate ? ev.eventDate.split('T')[0] : '',
        startTime: ev.startTime || '',
        endTime: ev.endTime || '',
        maxParticipants: ev.maxParticipants?.toString() || '',
        fee: ev.fee?.toString() || '0',
        status: ev.status || 'Upcoming'
      });
    } catch (error) {
      setSearchError(error.response?.data?.message || 'Event not found');
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
    if (!formData.eventName?.trim()) newErrors.eventName = 'Event name is required';
    if (!formData.description?.trim()) newErrors.description = 'Description is required';
    if (!formData.eventDate) newErrors.eventDate = 'Event date is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';
    if (!formData.maxParticipants) {
      newErrors.maxParticipants = 'Max participants is required';
    } else if (isNaN(formData.maxParticipants) || Number(formData.maxParticipants) < 1) {
      newErrors.maxParticipants = 'Must be a positive number';
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
      const response = await axios.put(`/api/events/${event.eventId}`, formData);
      setSuccess('Event updated successfully!');
      setEvent(response.data.event);
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || 'Error updating event' });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="content-wrapper">
        <div className="page-header">
          <h2>Update Event</h2>
          <p>Search an event by ID to update its details</p>
        </div>

        <div className="form-card">
          <h3>Search Event</h3>
          <form onSubmit={handleSearch} className="search-form">
            <div className="form-group">
              <label htmlFor="searchId">Event ID *</label>
              <div className="input-with-button">
                <input
                  id="searchId"
                  type="text"
                  value={searchId}
                  onChange={(e) => { setSearchId(e.target.value); setSearchError(''); }}
                  placeholder="Enter event ID (e.g., EVT1234567890)"
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

        {event && (
          <div className="form-card">
            <h3>Update Event: {event.eventId}</h3>

            {success && <div className="alert alert-success">{success}</div>}
            {errors.submit && <div className="alert alert-error">{errors.submit}</div>}

            <form onSubmit={handleSubmit} noValidate>
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
                    className="form-control"
                  >
                    {['Conference', 'Workshop', 'Seminar', 'Social', 'Sports', 'Other'].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
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
                        {venue.venueName}
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
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={submitLoading}>
                  {submitLoading ? 'Updating...' : 'Update Event'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateEvent;
