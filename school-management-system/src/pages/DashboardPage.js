import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import AdminHeader from '../components/AdminHeader';
import StatCard from '../components/StatCard';
import ClassStats from '../components/ClassStats';
import RecentActivities from '../components/RecentActivities';
import { Link } from 'react-router-dom';

function DashboardPage() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalStaff: 0,
    monthlyFees: 0,
    monthlyExpenses: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/dashboard/stats`);
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-wrapper">
      <Sidebar />
      <div className="main-content">
        <AdminHeader />
        <div className="content-area">
          <h1 className="page-title mb-4">Dashboard</h1>

          {/* Statistics Cards */}
          <div className="row mb-4">
            {loading ? (
              <p>Loading stats...</p>
            ) : (
              <>
                <StatCard icon="fa-user-graduate" label="Total Students" value={stats.totalStudents} type="primary" />
                <StatCard icon="fa-users" label="Total Staff" value={stats.totalStaff} type="success" />
                <StatCard icon="fa-money-bill-wave" label="Monthly Fees" value={`₹${stats.monthlyFees.toLocaleString('en-IN')}`} type="warning" />
                <StatCard icon="fa-chart-line" label="Monthly Expenses" value={`₹${stats.monthlyExpenses.toLocaleString('en-IN')}`} type="info" />
              </>
            )}
          </div>

          {/* Charts and Recent Activities */}
          <div className="row">
            <div className="col-lg-8 mb-4">
              <ClassStats />
            </div>
            <div className="col-lg-4 mb-4">
              <RecentActivities />
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="row">
              <div className="col-12">
                  <div className="card">
                      <div className="card-header">
                          <h5 className="card-title">
                              <i className="fas fa-bolt text-warning me-2"></i>
                              Quick Actions
                          </h5>
                      </div>
                      <div className="card-body">
                          <div className="row">
                              <div className="col-md-3 mb-3">
                                  <Link to="/student-details" className="btn btn-outline-primary w-100">
                                      <i className="fas fa-user-graduate me-2"></i>
                                      Add New Student
                                  </Link>
                              </div>
                              <div className="col-md-3 mb-3">
                                  <Link to="/staff-details" className="btn btn-outline-success w-100">
                                      <i className="fas fa-users me-2"></i>
                                      Add New Staff
                                  </Link>
                              </div>
                              <div className="col-md-3 mb-3">
                                  <Link to="/fees-management" className="btn btn-outline-warning w-100">
                                      <i className="fas fa-money-bill-wave me-2"></i>
                                      Record Payment
                                  </Link>
                              </div>
                              <div className="col-md-3 mb-3">
                                  <Link to="/admissions" className="btn btn-outline-info w-100">
                                      <i className="fas fa-user-plus me-2"></i>
                                      View Admissions
                                  </Link>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
