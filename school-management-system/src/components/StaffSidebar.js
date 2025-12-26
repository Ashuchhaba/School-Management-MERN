import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function StaffSidebar() {
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
            <small>International School</small>
          </div>
        </div>
      </div>

      <div className="sidebar-menu">
        <NavLink to="/staff/dashboard" className="nav-link">
          <i className="fas fa-tachometer-alt"></i>
          Dashboard
        </NavLink>
        <NavLink to="/staff/profile" className="nav-link">
          <i className="fas fa-user"></i>
          Profile
        </NavLink>
        <NavLink to="/staff/students" className="nav-link">
          <i className="fas fa-user-graduate"></i>
          Students
        </NavLink>
        <NavLink to="/staff/attendance" className="nav-link">
          <i className="fas fa-calendar-check"></i>
          Attendance
        </NavLink>
        <NavLink to="/staff/homework" className="nav-link">
          <i className="fas fa-book"></i>
          Homework
        </NavLink>
        <NavLink to="/staff/exams" className="nav-link">
          <i className="fas fa-pen-alt"></i>
          Exams & Marks
        </NavLink>
        <NavLink to="/staff/leave" className="nav-link">
          <i className="fas fa-calendar-alt"></i>
          Leave
        </NavLink>
        <NavLink to="/staff/salary" className="nav-link">
          <i className="fas fa-money-bill-wave"></i>
          Salary
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

export default StaffSidebar;
