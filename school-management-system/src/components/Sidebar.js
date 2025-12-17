import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Sidebar() {
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
          <button onClick={handleLogout} className="nav-link text-danger" style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}>
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Sidebar;