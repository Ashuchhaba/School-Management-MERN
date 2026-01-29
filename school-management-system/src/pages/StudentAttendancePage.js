import React, { useState, useEffect } from 'react';
import StudentLayout from '../components/StudentLayout';
import api from '../api';

function StudentAttendancePage() {
  const [attendance, setAttendance] = useState([]);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ present: 0, absent: 0, total: 0 });

  useEffect(() => {
    fetchAttendance();
  }, [month]);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/api/attendance/my-attendance?month=${month}`);
      setAttendance(data);
      
      const present = data.filter(r => r.status === 'Present').length;
      const absent = data.filter(r => r.status === 'Absent').length;
      setStats({ present, absent, total: data.length });

    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudentLayout>
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="text-primary mb-0">My Attendance</h2>
            <input 
                type="month" 
                className="form-control w-auto" 
                value={month} 
                onChange={(e) => setMonth(e.target.value)} 
            />
        </div>

        <div className="row mb-4">
            <div className="col-md-4">
                <div className="card bg-success text-white">
                    <div className="card-body text-center">
                        <h3>{stats.present}</h3>
                        <div>Days Present</div>
                    </div>
                </div>
            </div>
            <div className="col-md-4">
                <div className="card bg-danger text-white">
                    <div className="card-body text-center">
                        <h3>{stats.absent}</h3>
                        <div>Days Absent</div>
                    </div>
                </div>
            </div>
            <div className="col-md-4">
                <div className="card bg-info text-white">
                    <div className="card-body text-center">
                        <h3>{stats.total > 0 ? ((stats.present / stats.total) * 100).toFixed(1) : 0}%</h3>
                        <div>Attendance Percentage</div>
                    </div>
                </div>
            </div>
        </div>

        <div className="card">
            <div className="card-body">
                {loading ? (
                    <p className="text-center">Loading...</p>
                ) : attendance.length > 0 ? (
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendance.map(record => (
                                    <tr key={record._id}>
                                        <td>{new Date(record.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                        <td>
                                            <span className={`badge bg-${record.status === 'Present' ? 'success' : 'danger'}`}>
                                                {record.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-muted py-4">No attendance records found for this month.</p>
                )}
            </div>
        </div>
      </div>
    </StudentLayout>
  );
}

export default StudentAttendancePage;
