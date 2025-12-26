import React from 'react';
import Sidebar from '../components/Sidebar';
import AdminHeader from '../components/AdminHeader';
import StudentAttendanceReport from '../components/StudentAttendanceReport';

const StudentAttendanceReportPage = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="main-content">
        <AdminHeader />
        <div className="p-4">
          <StudentAttendanceReport />
        </div>
      </div>
    </div>
  );
};

export default StudentAttendanceReportPage;
