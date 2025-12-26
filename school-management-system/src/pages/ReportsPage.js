import React from 'react';
import Reports from '../components/Reports';
import Sidebar from '../components/Sidebar';
import AdminHeader from '../components/AdminHeader';

const ReportsPage = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="main-content">
        <AdminHeader />
        <div className="p-4">
          <Reports />
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;