import React from 'react';
import Sidebar from '../components/Sidebar';
import AdminHeader from '../components/AdminHeader';
import StudentFeesReport from '../components/StudentFeesReport';

const StudentFeesReportPage = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="main-content">
        <AdminHeader />
        <div className="p-4">
          <StudentFeesReport />
        </div>
      </div>
    </div>
  );
};

export default StudentFeesReportPage;
