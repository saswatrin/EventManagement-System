import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar.jsx';

const EventReport = () => {
  const [events, setEvents] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: 'All',
    status: 'All',
    startDate: '',
    endDate: ''
  });

  const fetchReport = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filters.category !== 'All') params.category = filters.category;
      if (filters.status !== 'All') params.status = filters.status;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const response = await axios.get('/api/reports/events', { params });
      setEvents(response.data.events);
      setTotal(response.data.total);
    } catch (err) {
      setError('Error fetching event report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleApplyFilter = (e) => {
    e.preventDefault();
    fetchReport();
  };

  const handleResetFilter = () => {
    setFilters({ category: 'All', status: 'All', startDate: '', endDate: '' });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const getStatusClass = (status) => {
    if (status === 'Upcoming') return 'badge badge-info';
    if (status === 'Ongoing') return 'badge badge-warning';
    if (status === 'Completed') return 'badge badge-success';
    if (status === 'Cancelled') return 'badge badge-danger';
    return 'badge';
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="content-wrapper">
        <div className="page-header">
          <h2>Event Report</h2>
          <p>View and filter event information</p>
        </div>

        <div className="filter-card">
          <h3>Filter Options</h3>
          <form onSubmit={handleApplyFilter}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="form-control"
                >
                  <option value="All">All Categories</option>
                  {['Conference', 'Workshop', 'Seminar', 'Social', 'Sports', 'Other'].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="form-control"
                >
                  <option value="All">All Statuses</option>
                  {['Upcoming', 'Ongoing', 'Completed', 'Cancelled'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startDate">From Date</label>
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="endDate">To Date</label>
                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  className="form-control"
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Loading...' : 'Apply Filter'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleResetFilter}>
                Reset
              </button>
            </div>
          </form>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="table-card">
          <div className="table-header">
            <h3>Events</h3>
            <span className="badge badge-info">Total: {total}</span>
          </div>

          {loading ? (
            <div className="loading">Loading report...</div>
          ) : events.length === 0 ? (
            <p className="no-data">No events found for the selected filters.</p>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Event ID</th>
                    <th>Event Name</th>
                    <th>Category</th>
                    <th>Venue</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Max Participants</th>
                    <th>Fee</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event, index) => (
                    <tr key={event._id}>
                      <td>{index + 1}</td>
                      <td>{event.eventId}</td>
                      <td>{event.eventName}</td>
                      <td>{event.category}</td>
                      <td>{event.venueName || 'N/A'}</td>
                      <td>{formatDate(event.eventDate)}</td>
                      <td>{event.startTime} - {event.endTime}</td>
                      <td>{event.maxParticipants}</td>
                      <td>{event.fee > 0 ? `$${event.fee}` : 'Free'}</td>
                      <td>
                        <span className={getStatusClass(event.status)}>
                          {event.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventReport;
