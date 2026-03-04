import React from 'react';
import StudentSidebar from './StudentSidebar';
import { useAuth } from '../contexts/AuthContext';
import { useLayout } from '../contexts/LayoutContext';

function StudentLayout({ children }) {
  const { user } = useAuth();
  const { sidebarOpen, toggleSidebar, closeSidebar } = useLayout();

  return (
    <div className="admin-wrapper">
      <StudentSidebar />
      <div className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`} onClick={closeSidebar}></div>
      <div className={`main-content ${!sidebarOpen ? 'expanded' : ''}`}>
        <header className="top-header">
          <div className="d-flex justify-content-between align-items-center w-100">
            <div className="d-flex align-items-center">
              <button className="mobile-menu-toggle me-3" onClick={toggleSidebar}>
                <i className="fas fa-bars"></i>
              </button>
              <h1 className="page-title">Student Portal</h1>
            </div>
            <div className="header-actions">
              <div className="user-info">
                <div className="user-avatar bg-primary text-white d-flex align-items-center justify-content-center rounded-circle" style={{width: '40px', height: '40px'}}>
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
                </div>
                <div className="ms-2">
                  <div className="fw-semibold">{user?.name || 'Student'}</div>
                  <small className="text-muted">Student</small>
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className="content-area">
          {children}
        </div>
      </div>
    </div>
  );
}

export default StudentLayout;
