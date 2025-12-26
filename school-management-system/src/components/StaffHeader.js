import React from 'react';
import { useAuth } from '../contexts/AuthContext';

function StaffHeader() {
  const { user } = useAuth();

  return (
    <header className="top-header">
      <div className="d-flex justify-content-between align-items-center w-100">
        <div className="d-flex align-items-center">
          <button className="mobile-menu-toggle me-3" id="mobileMenuToggle">
            <i className="fas fa-bars"></i>
          </button>
          <h1 className="page-title">Dashboard</h1>
        </div>
        <div className="header-actions">
          <div className="user-info">
            <div className="user-avatar">{user?.name?.charAt(0).toUpperCase() || 'S'}</div>
            <div className="ms-2">
              <div className="fw-semibold">{user?.name || 'Staff'}</div>
              <small className="text-muted">Staff</small>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default StaffHeader;
