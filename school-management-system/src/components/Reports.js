import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserGraduate, FaUserTie, FaFileInvoiceDollar, FaMoneyBillWave, FaCalendarAlt } from 'react-icons/fa';

const ReportCard = ({ icon, title, description, link }) => {
  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100">
        <div className="card-body">
          <div className="d-flex align-items-center mb-3">
            <div className="fs-3 me-3">{icon}</div>
            <h5 className="card-title">{title}</h5>
          </div>
          <p className="card-text">{description}</p>
          <Link to={link} className="btn btn-primary">
            View Report
          </Link>
        </div>
      </div>
    </div>
  );
};

const Reports = () => {
  const reports = [
    {
      icon: <FaUserGraduate />,
      title: 'Student Report',
      description: 'View a comprehensive report of all students.',
      link: '/admin/reports/students',
    },
    {
      icon: <FaUserTie />,
      title: 'Staff Report',
      description: 'View a comprehensive report of all staff members.',
      link: '/admin/reports/staff',
    },
    {
      icon: <FaFileInvoiceDollar />,
      title: 'Student Fees Report',
      description: 'Track student fee payments and pending dues.',
      link: '/admin/reports/fees',
    },
    {
      icon: <FaMoneyBillWave />,
      title: 'Staff Salary Report',
      description: 'Track staff salary payments and status.',
      link: '/admin/reports/salary',
    },
    {
      icon: <FaCalendarAlt />,
      title: 'Student Attendance Report',
      description: 'View student attendance for a specific date.',
      link: '/admin/reports/attendance',
    },
  ];

  return (
    <div>
      <h2 className="mb-4">Reports Dashboard</h2>
      <div className="row">
        {reports.map((report, index) => (
          <ReportCard key={index} {...report} />
        ))}
      </div>
    </div>
  );
};

export default Reports;
