import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import AddMembership from './pages/maintenance/AddMembership.jsx';
import UpdateMembership from './pages/maintenance/UpdateMembership.jsx';
import AddEvent from './pages/maintenance/AddEvent.jsx';
import UpdateEvent from './pages/maintenance/UpdateEvent.jsx';
import AddVenue from './pages/maintenance/AddVenue.jsx';
import UpdateVenue from './pages/maintenance/UpdateVenue.jsx';
import EventRegistration from './pages/transactions/EventRegistration.jsx';
import ViewRegistrations from './pages/transactions/ViewRegistrations.jsx';
import MemberReport from './pages/reports/MemberReport.jsx';
import EventReport from './pages/reports/EventReport.jsx';
import BookingReport from './pages/reports/BookingReport.jsx';
import FlowChart from './pages/FlowChart.jsx';
import AddUser from './pages/maintenance/AddUser.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      {/* Admin only routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/maintenance/add-membership"
        element={
          <ProtectedRoute requiredRole="admin">
            <AddMembership />
          </ProtectedRoute>
        }
      />
      <Route
        path="/maintenance/update-membership"
        element={
          <ProtectedRoute requiredRole="admin">
            <UpdateMembership />
          </ProtectedRoute>
        }
      />
      <Route
        path="/maintenance/add-event"
        element={
          <ProtectedRoute requiredRole="admin">
            <AddEvent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/maintenance/update-event"
        element={
          <ProtectedRoute requiredRole="admin">
            <UpdateEvent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/maintenance/add-venue"
        element={
          <ProtectedRoute requiredRole="admin">
            <AddVenue />
          </ProtectedRoute>
        }
      />
      <Route
        path="/maintenance/update-venue"
        element={
          <ProtectedRoute requiredRole="admin">
            <UpdateVenue />
          </ProtectedRoute>
        }
      />

      {/* User only routes */}
      <Route
        path="/user/dashboard"
        element={
          <ProtectedRoute requiredRole="user">
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      {/* Shared routes (admin + user) */}
      <Route
        path="/transactions/register"
        element={
          <ProtectedRoute>
            <EventRegistration />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions/view"
        element={
          <ProtectedRoute>
            <ViewRegistrations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports/members"
        element={
          <ProtectedRoute>
            <MemberReport />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports/events"
        element={
          <ProtectedRoute>
            <EventReport />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports/bookings"
        element={
          <ProtectedRoute>
            <BookingReport />
          </ProtectedRoute>
        }
      />

      {/* Add User - admin only */}
      <Route
        path="/maintenance/add-user"
        element={
          <ProtectedRoute requiredRole="admin">
            <AddUser />
          </ProtectedRoute>
        }
      />

      {/* Flow Chart - accessible to all logged in users */}
      <Route
        path="/flowchart"
        element={
          <ProtectedRoute>
            <FlowChart />
          </ProtectedRoute>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
