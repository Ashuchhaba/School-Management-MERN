import React from 'react';
import Sidebar from '../components/Sidebar';
import AdminHeader from '../components/AdminHeader';
import StaffReport from '../components/StaffReport';

const StaffReportPage = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="main-content">
        <AdminHeader />
        <div className="p-4">
          <StaffReport />
        </div>
      </div>
    </div>
  );
};

export default StaffReportPage;
