import React from 'react';
import AdminHeader from './AdminHeader';
import Sidebar from './Sidebar';
import { useLayout } from '../contexts/LayoutContext';

function AdminLayout({ children }) {
  const { sidebarOpen, closeSidebar } = useLayout();

  return (
    <div className="admin-wrapper">
      <Sidebar />
      <div className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`} onClick={closeSidebar}></div>
      <div className={`main-content ${!sidebarOpen ? 'expanded' : ''}`}>
        <AdminHeader />
        <main className="content-area">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
