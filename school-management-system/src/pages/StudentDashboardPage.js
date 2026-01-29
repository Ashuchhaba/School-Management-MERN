import React, { useState, useEffect } from 'react';
import StudentLayout from '../components/StudentLayout';
import StatCard from '../components/StatCard';
import NoticeBoardWidget from '../components/NoticeBoardWidget';
import api from '../api';

function StudentDashboardPage() {
  const [stats, setStats] = useState({
    attendancePercentage: 0,
    feeDue: 0,
    nextExam: 'None',
    class: '',
    section: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/api/students/dashboard-stats');
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
    <StudentLayout>
      <div className="container-fluid">
        <h2 className="mb-4">Dashboard</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="row g-4 mb-4">
              <div className="col-md-3">
                <StatCard
                  label="Class & Section"
                  value={`${stats.class} ${stats.section || ''}`}
                  icon="fa-chalkboard"
                  type="primary"
                />
              </div>
              <div className="col-md-3">
                <StatCard
                  label="Attendance"
                  value={`${stats.attendancePercentage}%`}
                  icon="fa-user-check"
                  type={stats.attendancePercentage >= 75 ? 'success' : 'warning'}
                />
              </div>
              <div className="col-md-3">
                <StatCard
                  label="Fees Due"
                  value={`₹${stats.feeDue}`}
                  icon="fa-money-bill-wave"
                  type={stats.feeDue > 0 ? 'danger' : 'success'}
                />
              </div>
              <div className="col-md-3">
                <StatCard
                  label="Next Exam"
                  value={stats.nextExam}
                  icon="fa-file-alt"
                  type="info"
                />
              </div>
            </div>

            <div className="row">
                <div className="col-lg-6">
                    <NoticeBoardWidget role="student" />
                </div>
                {/* Could add Upcoming Exams widget here */}
            </div>
          </>
        )}
      </div>
    </StudentLayout>
  );
}

export default StudentDashboardPage;
