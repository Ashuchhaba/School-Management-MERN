import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function StudentSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="sidebar" id="sidebar">
      <div className="sidebar-header">
        <div className="d-flex align-items-center">
          <i className="fas fa-graduation-cap text-primary me-2" style={{ fontSize: '1.5rem' }}></i>
          <div>
            <h4 className="text-white">SATYAM STARS</h4>
            <small>Student Portal</small>
          </div>
        </div>
      </div>

      <div className="sidebar-menu">
        <NavLink to="/student/dashboard" className="nav-link">
          <i className="fas fa-tachometer-alt"></i>
          Dashboard
        </NavLink>
        <NavLink to="/student/profile" className="nav-link">
          <i className="fas fa-user"></i>
          Profile
        </NavLink>
        <NavLink to="/student/attendance" className="nav-link">
          <i className="fas fa-calendar-check"></i>
          Attendance
        </NavLink>
        <NavLink to="/student/fees" className="nav-link">
          <i className="fas fa-money-bill-wave"></i>
          Fees
        </NavLink>
        <NavLink to="/student/exams" className="nav-link">
          <i className="fas fa-file-alt"></i>
          Exams & Results
        </NavLink>
        <NavLink to="/student/notices" className="nav-link">
          <i className="fas fa-bullhorn"></i>
          Notices
        </NavLink>
        <div className="mt-4 pt-4" style={{ borderTop: '1px solid #374151' }}>
          <button onClick={handleLogout} className="nav-link text-danger" style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}>
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default StudentSidebar;
