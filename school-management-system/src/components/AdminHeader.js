import React from 'react';
import { useLayout } from '../contexts/LayoutContext';

function AdminHeader() {
  const { toggleSidebar } = useLayout();

  return (
    <header className="top-header">
      <div className="d-flex justify-content-between align-items-center w-100">
        <div className="d-flex align-items-center">
          <button className="mobile-menu-toggle me-3" onClick={toggleSidebar}>
            <i className="fas fa-bars"></i>
          </button>
          <h1 className="page-title">Dashboard</h1>
        </div>
        <div className="header-actions">
          <div className="user-info">
            <div className="user-avatar">A</div>
            <div className="ms-2">
              <div className="fw-semibold">Admin</div>
              <small className="text-muted">Administrator</small>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;