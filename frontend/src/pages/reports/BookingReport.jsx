import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar.jsx';

const BookingReport = () => {
  const [bookings, setBookings] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: 'All',
    paymentStatus: 'All',
    startDate: '',
    endDate: ''
  });

  const fetchReport = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filters.status !== 'All') params.status = filters.status;
      if (filters.paymentStatus !== 'All') params.paymentStatus = filters.paymentStatus;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const response = await axios.get('/api/reports/bookings', { params });
      setBookings(response.data.bookings);
      setTotal(response.data.total);
      setTotalAmount(response.data.totalAmount);
    } catch (err) {
      setError('Error fetching booking report');
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
    setFilters({ status: 'All', paymentStatus: 'All', startDate: '', endDate: '' });
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
          <h2>Booking Report</h2>
          <p>View and filter booking/registration information</p>
        </div>

        <div className="filter-card">
          <h3>Filter Options</h3>
          <form onSubmit={handleApplyFilter}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="status">Booking Status</label>
                <select
                  id="status"
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="form-control"
                >
                  <option value="All">All Statuses</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="paymentStatus">Payment Status</label>
                <select
                  id="paymentStatus"
                  name="paymentStatus"
                  value={filters.paymentStatus}
                  onChange={handleFilterChange}
                  className="form-control"
                >
                  <option value="All">All Payment Statuses</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Refunded">Refunded</option>
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
            <h3>Bookings</h3>
            <div className="table-summary">
              <span className="badge badge-info">Total Records: {total}</span>
              <span className="badge badge-success">Total Amount: ${totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {loading ? (
            <div className="loading">Loading report...</div>
          ) : bookings.length === 0 ? (
            <p className="no-data">No bookings found for the selected filters.</p>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Booking ID</th>
                    <th>Member Name</th>
                    <th>Membership No.</th>
                    <th>Event Name</th>
                    <th>Booking Date</th>
                    <th>Status</th>
                    <th>Payment Status</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking, index) => (
                    <tr key={booking._id}>
                      <td>{index + 1}</td>
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
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="table-footer">
                    <td colSpan="8" style={{ textAlign: 'right', fontWeight: 'bold' }}>
                      Total Amount:
                    </td>
                    <td style={{ fontWeight: 'bold' }}>${totalAmount.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingReport;
