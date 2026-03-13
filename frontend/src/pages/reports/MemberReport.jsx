import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar.jsx';

const MemberReport = () => {
  const [members, setMembers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: 'All',
    startDate: '',
    endDate: ''
  });

  const fetchReport = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filters.status !== 'All') params.status = filters.status;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const response = await axios.get('/api/reports/members', { params });
      setMembers(response.data.members);
      setTotal(response.data.total);
    } catch (err) {
      setError('Error fetching member report');
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
    setFilters({ status: 'All', startDate: '', endDate: '' });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const getMembershipTypeLabel = (type) => {
    const labels = { '6months': '6 Months', '1year': '1 Year', '2years': '2 Years' };
    return labels[type] || type;
  };

  const getStatusClass = (status) => {
    if (status === 'Active') return 'badge badge-success';
    if (status === 'Cancelled') return 'badge badge-danger';
    return 'badge badge-warning';
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="content-wrapper">
        <div className="page-header">
          <h2>Member Report</h2>
          <p>View and filter member information</p>
        </div>

        <div className="filter-card">
          <h3>Filter Options</h3>
          <form onSubmit={handleApplyFilter}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="status">Membership Status</label>
                <select
                  id="status"
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="form-control"
                >
                  <option value="All">All</option>
                  <option value="Active">Active</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>
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
            <h3>Members</h3>
            <span className="badge badge-info">Total: {total}</span>
          </div>

          {loading ? (
            <div className="loading">Loading report...</div>
          ) : members.length === 0 ? (
            <p className="no-data">No members found for the selected filters.</p>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Membership No.</th>
                    <th>Name</th>
                    <th>Gender</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Membership Type</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member, index) => (
                    <tr key={member._id}>
                      <td>{index + 1}</td>
                      <td>{member.membershipNumber}</td>
                      <td>{member.firstName} {member.lastName}</td>
                      <td>{member.gender}</td>
                      <td>{member.email}</td>
                      <td>{member.phone}</td>
                      <td>{getMembershipTypeLabel(member.membershipType)}</td>
                      <td>{formatDate(member.startDate)}</td>
                      <td>{formatDate(member.endDate)}</td>
                      <td>
                        <span className={getStatusClass(member.status)}>
                          {member.status}
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

export default MemberReport;
