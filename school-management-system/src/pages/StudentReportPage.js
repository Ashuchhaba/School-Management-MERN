import React from 'react';
import Sidebar from '../components/Sidebar';
import AdminHeader from '../components/AdminHeader';
import StudentReport from '../components/StudentReport';

const StudentReportPage = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="main-content">
        <AdminHeader />
        <div className="p-4">
          <StudentReport />
        </div>
      </div>
    </div>
  );
};

export default StudentReportPage;