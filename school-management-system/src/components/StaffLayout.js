import React from 'react';
import StaffHeader from './StaffHeader';
import StaffSidebar from './StaffSidebar';

function StaffLayout({ children }) {
  return (
    <div className="admin-layout">
      <StaffSidebar />
      <div className="main-content">
        <StaffHeader />
        <main className="content-body">
          {children}
        </main>
      </div>
    </div>
  );
}

export default StaffLayout;
