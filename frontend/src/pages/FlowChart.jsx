import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Navbar from '../components/Navbar.jsx';

const FlowChart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="content-wrapper">
        <div className="page-header">
          <h2>Application Flow Chart</h2>
          <p>Overview of the Event Management System navigation flow</p>
        </div>

        <div className="flowchart-container">

          {/* ── START ── */}
          <div className="fc-row">
            <div className="fc-box fc-start">START</div>
          </div>
          <div className="fc-arrow-down" />

          {/* ── LOGIN ── */}
          <div className="fc-row">
            <div className="fc-box fc-process">Login Page</div>
          </div>
          <div className="fc-arrow-down" />

          {/* ── DECISION: role ── */}
          <div className="fc-row">
            <div className="fc-box fc-decision">Who is logging in?</div>
          </div>

          {/* ── BRANCH LABELS ── */}
          <div className="fc-branch-labels">
            <span className="fc-label-left">Admin</span>
            <span className="fc-label-right">User</span>
          </div>

          {/* ── HORIZONTAL LINE ── */}
          <div className="fc-branch-line" />

          {/* ── TWO DASHBOARDS ── */}
          <div className="fc-two-col">

            {/* ══ ADMIN COLUMN ══ */}
            <div className="fc-column">
              <div className="fc-arrow-down" />
              <div className="fc-box fc-dashboard">Admin Dashboard</div>
              <div className="fc-arrow-down" />

              {/* Maintenance */}
              <div className="fc-box fc-module fc-admin-only">
                Maintenance Module
                <span className="fc-badge">Admin Only</span>
              </div>
              <div className="fc-sub-group">
                <div className="fc-arrow-down" />
                <div className="fc-sub-row">
                  <div className="fc-col-half">
                    <div className="fc-box fc-sub">Add Membership</div>
                    <div className="fc-arrow-down-sm" />
                    <div className="fc-box fc-detail">
                      <ul>
                        <li>All fields mandatory</li>
                        <li>Gender: Radio (M/F/Other)</li>
                        <li>Type: 6M ✓ / 1Y / 2Y</li>
                        <li>Auto-generates Membership No.</li>
                        <li>End Date auto-calculated</li>
                      </ul>
                    </div>
                  </div>
                  <div className="fc-col-half">
                    <div className="fc-box fc-sub">Update Membership</div>
                    <div className="fc-arrow-down-sm" />
                    <div className="fc-box fc-detail">
                      <ul>
                        <li>Search by Membership No.</li>
                        <li>Fields auto-populate</li>
                        <li>Extend: 6M ✓ / 1Y / 2Y</li>
                        <li>OR Cancel Membership</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="fc-arrow-down-sm" />
                <div className="fc-sub-row">
                  <div className="fc-col-half">
                    <div className="fc-box fc-sub">Add Event</div>
                    <div className="fc-arrow-down-sm" />
                    <div className="fc-box fc-detail">
                      <ul>
                        <li>Name, Description</li>
                        <li>Category, Venue</li>
                        <li>Date, Start/End Time</li>
                        <li>Max Participants, Fee</li>
                      </ul>
                    </div>
                  </div>
                  <div className="fc-col-half">
                    <div className="fc-box fc-sub">Update Event</div>
                    <div className="fc-arrow-down-sm" />
                    <div className="fc-box fc-detail">
                      <ul>
                        <li>Search by Event ID</li>
                        <li>Update any field</li>
                        <li>Change status</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="fc-arrow-down-sm" />
                <div className="fc-sub-row">
                  <div className="fc-col-half">
                    <div className="fc-box fc-sub">Add Venue</div>
                    <div className="fc-arrow-down-sm" />
                    <div className="fc-box fc-detail">
                      <ul>
                        <li>Name, Address</li>
                        <li>Capacity</li>
                        <li>Contact details</li>
                      </ul>
                    </div>
                  </div>
                  <div className="fc-col-half">
                    <div className="fc-box fc-sub">Update Venue</div>
                    <div className="fc-arrow-down-sm" />
                    <div className="fc-box fc-detail">
                      <ul>
                        <li>Search by Venue ID</li>
                        <li>Update fields</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="fc-arrow-down" />

              {/* Transactions */}
              <div className="fc-box fc-module fc-shared">Transactions Module</div>
              <div className="fc-sub-group">
                <div className="fc-arrow-down" />
                <div className="fc-sub-row">
                  <div className="fc-col-half">
                    <div className="fc-box fc-sub">Register for Event</div>
                    <div className="fc-arrow-down-sm" />
                    <div className="fc-box fc-detail">
                      <ul>
                        <li>Enter Membership No.</li>
                        <li>Select Event</li>
                        <li>Payment Status</li>
                        <li>Booking ID generated</li>
                      </ul>
                    </div>
                  </div>
                  <div className="fc-col-half">
                    <div className="fc-box fc-sub">View Registrations</div>
                    <div className="fc-arrow-down-sm" />
                    <div className="fc-box fc-detail">
                      <ul>
                        <li>All bookings table</li>
                        <li>Filter by member/event</li>
                        <li>Cancel booking</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="fc-arrow-down" />

              {/* Reports */}
              <div className="fc-box fc-module fc-shared">Reports Module</div>
              <div className="fc-sub-group">
                <div className="fc-arrow-down" />
                <div className="fc-sub-row fc-three-col">
                  <div className="fc-col-third">
                    <div className="fc-box fc-sub">Member Report</div>
                    <div className="fc-arrow-down-sm" />
                    <div className="fc-box fc-detail">
                      <ul>
                        <li>Filter by status</li>
                        <li>Filter by date range</li>
                        <li>Member count</li>
                      </ul>
                    </div>
                  </div>
                  <div className="fc-col-third">
                    <div className="fc-box fc-sub">Event Report</div>
                    <div className="fc-arrow-down-sm" />
                    <div className="fc-box fc-detail">
                      <ul>
                        <li>Filter by category</li>
                        <li>Filter by status</li>
                        <li>Event count</li>
                      </ul>
                    </div>
                  </div>
                  <div className="fc-col-third">
                    <div className="fc-box fc-sub">Booking Report</div>
                    <div className="fc-arrow-down-sm" />
                    <div className="fc-box fc-detail">
                      <ul>
                        <li>Filter by status</li>
                        <li>Total amount</li>
                        <li>Booking count</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ══ USER COLUMN ══ */}
            <div className="fc-column">
              <div className="fc-arrow-down" />
              <div className="fc-box fc-dashboard">User Dashboard</div>
              <div className="fc-arrow-down" />

              {/* Blocked */}
              <div className="fc-box fc-blocked">
                Maintenance Module
                <span className="fc-badge fc-badge-blocked">Access Denied</span>
              </div>

              <div className="fc-arrow-down" />

              {/* Transactions */}
              <div className="fc-box fc-module fc-shared">Transactions Module</div>
              <div className="fc-sub-group">
                <div className="fc-arrow-down" />
                <div className="fc-sub-row">
                  <div className="fc-col-half">
                    <div className="fc-box fc-sub">Register for Event</div>
                  </div>
                  <div className="fc-col-half">
                    <div className="fc-box fc-sub">View Registrations</div>
                  </div>
                </div>
              </div>

              <div className="fc-arrow-down" />

              {/* Reports */}
              <div className="fc-box fc-module fc-shared">Reports Module</div>
              <div className="fc-sub-group">
                <div className="fc-arrow-down" />
                <div className="fc-sub-row fc-three-col">
                  <div className="fc-col-third">
                    <div className="fc-box fc-sub">Member Report</div>
                  </div>
                  <div className="fc-col-third">
                    <div className="fc-box fc-sub">Event Report</div>
                  </div>
                  <div className="fc-col-third">
                    <div className="fc-box fc-sub">Booking Report</div>
                  </div>
                </div>
              </div>
            </div>

          </div>{/* end fc-two-col */}

          {/* ── LOGOUT ── */}
          <div className="fc-row fc-merge-row">
            <div className="fc-arrow-down" />
            <div className="fc-box fc-process">Logout</div>
            <div className="fc-arrow-down" />
            <div className="fc-box fc-end">END</div>
          </div>

          {/* ── LEGEND ── */}
          <div className="fc-legend">
            <h4>Legend</h4>
            <div className="fc-legend-items">
              <div className="fc-legend-item">
                <div className="fc-legend-box fc-start" />
                <span>Start / End</span>
              </div>
              <div className="fc-legend-item">
                <div className="fc-legend-box fc-decision" />
                <span>Decision</span>
              </div>
              <div className="fc-legend-item">
                <div className="fc-legend-box fc-dashboard" />
                <span>Dashboard</span>
              </div>
              <div className="fc-legend-item">
                <div className="fc-legend-box fc-admin-only" />
                <span>Admin Only Module</span>
              </div>
              <div className="fc-legend-item">
                <div className="fc-legend-box fc-shared" />
                <span>Shared Module (Admin + User)</span>
              </div>
              <div className="fc-legend-item">
                <div className="fc-legend-box fc-blocked" />
                <span>Blocked for User</span>
              </div>
              <div className="fc-legend-item">
                <div className="fc-legend-box fc-sub" />
                <span>Sub-page / Screen</span>
              </div>
            </div>
          </div>

        </div>{/* end flowchart-container */}
      </div>
    </div>
  );
};

export default FlowChart;
