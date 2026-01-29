import React, { useState } from 'react';
import StudentSidebar from './StudentSidebar';
import { useAuth } from '../contexts/AuthContext';

function StudentLayout({ children }) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.classList.toggle('active');
    }
  };

  return (
    <div className="admin-wrapper">
      <StudentSidebar />
      <div className="main-content">
        <header className="header d-flex justify-content-between align-items-center p-3 bg-white shadow-sm mb-4">
          <div className="d-flex align-items-center">
            <button className="btn btn-light d-md-none me-3" onClick={toggleSidebar}>
              <i className="fas fa-bars"></i>
            </button>
            <h5 className="mb-0 text-primary">Student Portal</h5>
          </div>
          <div className="d-flex align-items-center">
            <div className="d-flex align-items-center">
              <div className="text-end me-3 d-none d-md-block">
                <div className="fw-bold">{user?.name || 'Student'}</div>
                <small className="text-muted">Student</small>
              </div>
              <div className="user-avatar bg-primary text-white d-flex align-items-center justify-content-center rounded-circle" style={{width: '40px', height: '40px'}}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
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
