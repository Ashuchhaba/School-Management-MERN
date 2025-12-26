import React from 'react';
import Sidebar from '../components/Sidebar';
import AdminHeader from '../components/AdminHeader';
import StaffSalaryReport from '../components/StaffSalaryReport';

const StaffSalaryReportPage = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="main-content">
        <AdminHeader />
        <div className="p-4">
          <StaffSalaryReport />
        </div>
      </div>
    </div>
  );
};

export default StaffSalaryReportPage;
