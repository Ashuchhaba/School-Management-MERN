import React from 'react';
import { NavLink } from 'react-router-dom';

function Sidebar() {
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
        <NavLink to="/dashboard" className="nav-link">
          <i className="fas fa-tachometer-alt"></i>
          Dashboard
        </NavLink>
        <NavLink to="/fees" className="nav-link">
          <i className="fas fa-money-bill-wave"></i>
          Fees Management
        </NavLink>
        <NavLink to="/staff" className="nav-link">
          <i className="fas fa-users"></i>
          Staff Details
        </NavLink>
        <NavLink to="/students" className="nav-link">
          <i className="fas fa-user-graduate"></i>
          Student Details
        </NavLink>
        <NavLink to="/staff-payment" className="nav-link">
          <i className="fas fa-credit-card"></i>
          Staff Payment
        </NavLink>
        <NavLink to="/admissions" className="nav-link">
          <i className="fas fa-user-plus"></i>
          Admissions
        </NavLink>
        <div className="mt-4 pt-4" style={{ borderTop: '1px solid #374151' }}>
          <NavLink to="/login" className="nav-link text-danger">
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Sidebar;