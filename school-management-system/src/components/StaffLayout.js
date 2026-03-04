import React from 'react';
import StaffHeader from './StaffHeader';
import StaffSidebar from './StaffSidebar';
import { useLayout } from '../contexts/LayoutContext';

function StaffLayout({ children }) {
  const { sidebarOpen, closeSidebar } = useLayout();

  return (
    <div className="admin-wrapper">
      <StaffSidebar />
      <div className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`} onClick={closeSidebar}></div>
      <div className={`main-content ${!sidebarOpen ? 'expanded' : ''}`}>
        <StaffHeader />
        <main className="content-area">
          {children}
        </main>
      </div>
    </div>
  );
}

export default StaffLayout;
