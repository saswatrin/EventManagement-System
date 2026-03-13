import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar.jsx';

const ViewRegistrations = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterMember, setFilterMember] = useState('');
  const [filterEvent, setFilterEvent] = useState('');
  const [cancelLoading, setCancelLoading] = useState('');
  const [cancelSuccess, setCancelSuccess] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/bookings');
      setBookings(response.data);
      setFilteredBookings(response.data);
    } catch (err) {
      setError('Error fetching bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    let filtered = [...bookings];
    if (filterMember.trim()) {
      filtered = filtered.filter(b =>
        b.membershipNumber?.toLowerCase().includes(filterMember.toLowerCase()) ||
        b.memberName?.toLowerCase().includes(filterMember.toLowerCase())
      );
    }
    if (filterEvent.trim()) {
      filtered = filtered.filter(b =>
        b.eventName?.toLowerCase().includes(filterEvent.toLowerCase())
      );
    }
    setFilteredBookings(filtered);
  }, [filterMember, filterEvent, bookings]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setCancelLoading(bookingId);
    setCancelSuccess('');

    try {
      await axios.put(`/api/bookings/${bookingId}`, { status: 'Cancelled' });
      setCancelSuccess(`Booking ${bookingId} cancelled successfully`);
      fetchBookings();
    } catch (err) {
      setError('Error cancelling booking');
    } finally {
      setCancelLoading('');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const getStatusClass = (status) => {
    if (status === 'Confirmed') return 'badge badge-success';
    if (status === 'Cancelled') return 'badge badge-danger';
    return 'badge';
  };

  const getPaymentClass = (status) => {
    if (status === 'Paid') return 'badge badge-success';
    if (status === 'Pending') return 'badge badge-warning';
    if (status === 'Refunded') return 'badge badge-info';
    return 'badge';
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="content-wrapper">
        <div className="page-header">
          <h2>View Registrations</h2>
          <p>All event registrations/bookings</p>
        </div>

        {cancelSuccess && <div className="alert alert-success">{cancelSuccess}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <div className="filter-card">
          <h3>Filter Bookings</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="filterMember">Filter by Member (Name or Membership No.)</label>
              <input
                id="filterMember"
                type="text"
                value={filterMember}
                onChange={(e) => setFilterMember(e.target.value)}
                className="form-control"
                placeholder="Search by member name or number"
              />
            </div>
            <div className="form-group">
              <label htmlFor="filterEvent">Filter by Event Name</label>
              <input
                id="filterEvent"
                type="text"
                value={filterEvent}
                onChange={(e) => setFilterEvent(e.target.value)}
                className="form-control"
                placeholder="Search by event name"
              />
            </div>
          </div>
        </div>

        <div className="table-card">
          <div className="table-header">
            <h3>Registrations ({filteredBookings.length})</h3>
          </div>

          {loading ? (
            <div className="loading">Loading bookings...</div>
          ) : filteredBookings.length === 0 ? (
            <p className="no-data">No bookings found.</p>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Member Name</th>
                    <th>Membership No.</th>
                    <th>Event Name</th>
                    <th>Booking Date</th>
                    <th>Status</th>
                    <th>Payment Status</th>
                    <th>Amount</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map(booking => (
                    <tr key={booking._id}>
                      <td>{booking.bookingId}</td>
                      <td>{booking.memberName}</td>
                      <td>{booking.membershipNumber}</td>
                      <td>{booking.eventName}</td>
                      <td>{formatDate(booking.bookingDate)}</td>
                      <td>
                        <span className={getStatusClass(booking.status)}>
                          {booking.status}
                        </span>
                      </td>
                      <td>
                        <span className={getPaymentClass(booking.paymentStatus)}>
                          {booking.paymentStatus}
                        </span>
                      </td>
                      <td>{booking.amount > 0 ? `$${booking.amount}` : 'Free'}</td>
                      <td>
                        {booking.status === 'Confirmed' && (
                          <button
                            onClick={() => handleCancel(booking.bookingId)}
                            className="btn btn-danger btn-sm"
                            disabled={cancelLoading === booking.bookingId}
                          >
                            {cancelLoading === booking.bookingId ? 'Cancelling...' : 'Cancel'}
                          </button>
                        )}
                        {booking.status === 'Cancelled' && (
                          <span className="text-muted">Cancelled</span>
                        )}
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

export default ViewRegistrations;
