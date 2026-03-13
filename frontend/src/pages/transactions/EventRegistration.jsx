import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar.jsx';

const EventRegistration = () => {
  const [formData, setFormData] = useState({
    membershipNumber: '',
    eventId: '',
    paymentStatus: 'Pending'
  });
  const [memberName, setMemberName] = useState('');
  const [memberError, setMemberError] = useState('');
  const [events, setEvents] = useState([]);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [bookingId, setBookingId] = useState('');
  const [loading, setLoading] = useState(false);
  const [memberLookupLoading, setMemberLookupLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/events');
        const upcoming = response.data.filter(e => e.status === 'Upcoming' || e.status === 'Ongoing');
        setEvents(upcoming);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, []);

  const lookupMember = async (membershipNumber) => {
    if (!membershipNumber.trim()) {
      setMemberName('');
      setMemberError('');
      return;
    }
    setMemberLookupLoading(true);
    setMemberError('');
    setMemberName('');

    try {
      const response = await axios.get(`/api/members/${membershipNumber.trim()}`);
      const member = response.data;
      if (member.status !== 'Active') {
        setMemberError(`Member status is ${member.status}. Only active members can register.`);
      } else {
        setMemberName(`${member.firstName} ${member.lastName}`);
      }
    } catch {
      setMemberError('Member not found. Please check the membership number.');
    } finally {
      setMemberLookupLoading(false);
    }
  };

  const handleMembershipBlur = () => {
    lookupMember(formData.membershipNumber);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });

    if (name === 'membershipNumber') {
      setMemberName('');
      setMemberError('');
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.membershipNumber.trim()) newErrors.membershipNumber = 'Membership number is required';
    if (!formData.eventId) newErrors.eventId = 'Please select an event';
    if (memberError) newErrors.membershipNumber = memberError;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setBookingId('');

    if (!memberName && !memberError) {
      await lookupMember(formData.membershipNumber);
    }

    if (!validate()) return;
    if (!memberName) {
      setErrors({ membershipNumber: 'Please verify the membership number first' });
      return;
    }

    setLoading(true);
    try {
      const selectedEvent = events.find(ev => ev.eventId === formData.eventId);
      const response = await axios.post('/api/bookings', {
        membershipNumber: formData.membershipNumber,
        eventId: formData.eventId,
        paymentStatus: formData.paymentStatus
      });
      setBookingId(response.data.bookingId);
      setSuccess(`Registration successful! Booking ID: ${response.data.bookingId}`);
      setFormData({ membershipNumber: '', eventId: '', paymentStatus: 'Pending' });
      setMemberName('');
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || 'Error creating booking' });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="content-wrapper">
        <div className="page-header">
          <h2>Event Registration</h2>
          <p>Register a member for an upcoming event</p>
        </div>

        {success && (
          <div className="alert alert-success">
            {success}
            {bookingId && (
              <div className="generated-id">
                <strong>Booking ID: {bookingId}</strong>
              </div>
            )}
          </div>
        )}
        {errors.submit && <div className="alert alert-error">{errors.submit}</div>}

        <form onSubmit={handleSubmit} className="form-card" noValidate>
          <div className="form-group">
            <label htmlFor="membershipNumber">Membership Number *</label>
            <input
              id="membershipNumber"
              name="membershipNumber"
              type="text"
              value={formData.membershipNumber}
              onChange={handleChange}
              onBlur={handleMembershipBlur}
              className={`form-control ${errors.membershipNumber || memberError ? 'error' : ''}`}
              placeholder="Enter membership number"
            />
            {memberLookupLoading && <span className="help-text">Looking up member...</span>}
            {memberName && (
              <span className="success-text">Member: <strong>{memberName}</strong></span>
            )}
            {(errors.membershipNumber || memberError) && (
              <span className="error-message">{errors.membershipNumber || memberError}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="eventId">Select Event *</label>
            <select
              id="eventId"
              name="eventId"
              value={formData.eventId}
              onChange={handleChange}
              className={`form-control ${errors.eventId ? 'error' : ''}`}
            >
              <option value="">-- Select an Event --</option>
              {events.map(event => (
                <option key={event._id} value={event.eventId}>
                  {event.eventName} | {formatDate(event.eventDate)} | {event.status} | Fee: {event.fee > 0 ? `$${event.fee}` : 'Free'}
                </option>
              ))}
            </select>
            {errors.eventId && <span className="error-message">{errors.eventId}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="paymentStatus">Payment Status</label>
            <select
              id="paymentStatus"
              name="paymentStatus"
              value={formData.paymentStatus}
              onChange={handleChange}
              className="form-control"
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Registering...' : 'Register for Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventRegistration;
