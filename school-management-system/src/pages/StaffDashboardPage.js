import React, { useState, useEffect } from 'react';
import StaffLayout from '../components/StaffLayout';
import StatCard from '../components/StatCard';
import NoticeBoardWidget from '../components/NoticeBoardWidget';
import api from '../api';

function StaffDashboardPage() {
  const [stats, setStats] = useState({
    assignedClasses: 0,
    totalStudents: 0,
    attendanceToday: 0,
    lastSalary: 0,
    classTeacherOf: '', // Explicitly initialize the field
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/api/staff/dashboard-stats');
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <StaffLayout>
      <div className="container-fluid">
        <h2 className="mb-4">Dashboard</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="row g-4 mb-4">
              <div className="col-lg-3 col-md-6">
                <StatCard
                  label={`Class Teacher Of (${stats.assignedClasses} Assigned)`}
                  value={stats.classTeacherOf || 'None'}
                  icon="fa-chalkboard-user"
                  type="primary"
                />
              </div>
              <div className="col-lg-3 col-md-6">
                <StatCard
                  label="Total Students"
                  value={stats.totalStudents}
                  icon="fa-user-graduate"
                  type="success"
                />
              </div>
              <div className="col-lg-3 col-md-6">
                <StatCard
                  label="Present Today"
                  value={stats.attendanceToday}
                  icon="fa-calendar-check"
                  type="info"
                />
              </div>
              <div className="col-lg-3 col-md-6">
                <StatCard
                  label="Last Salary"
                  value={`₹${stats.lastSalary || 0}`}
                  icon="fa-money-bill-wave"
                  type="warning"
                />
              </div>
            </div>

            <div className="row">
                <div className="col-lg-6">
                    <NoticeBoardWidget role="staff" />
                </div>
            </div>
          </>
        )}
      </div>
    </StaffLayout>
  );
}

export default StaffDashboardPage;
