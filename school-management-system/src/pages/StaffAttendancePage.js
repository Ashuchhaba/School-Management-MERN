import React, { useState, useEffect } from 'react';
import StaffLayout from '../components/StaffLayout';
import api from '../api';

function StaffAttendancePage() {
  const [assignedClasses, setAssignedClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/api/staff/profile');
        const classes = data.assigned_classes || [];
        setAssignedClasses(classes);
        if (data.class_teacher_of) {
          setSelectedClass(data.class_teacher_of);
        } else if (classes.length > 0) {
          setSelectedClass(classes[0]);
        }
      } catch (error) {
        console.error('Error fetching assigned classes:', error);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchStudentsAndAttendance();
    } else {
        setLoading(false);
    }
  }, [selectedClass, date]);

  const fetchStudentsAndAttendance = async () => {
    setLoading(true);
    setStudents([]); // Clear previous students
    setAttendance({}); // Clear previous attendance
    try {
      // Fetch students for the selected class
      const { data: studentsData } = await api.get(`/api/students?class=${selectedClass}`);
      setStudents(studentsData);

      // Fetch attendance for that class on the selected date
      const { data: attendanceData } = await api.get(`/api/attendance/class/${selectedClass}?date=${date}`);
      const attendanceMap = attendanceData.reduce((acc, record) => {
        acc[record.student_id] = record.status;
        return acc;
      }, {});
      setAttendance(attendanceMap);

    } catch (error) {
      console.error('Error fetching students or attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSaveAttendance = async () => {
    try {
      await api.post('/api/attendance/save', {
        class: selectedClass,
        date,
        attendance,
      });
      alert('Attendance saved successfully!');
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Failed to save attendance.');
    }
  };

  const presentCount = Object.values(attendance).filter(status => status === 'Present').length;

  return (
    <StaffLayout>
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="text-primary mb-0">Mark Attendance</h2>
            <div className="d-flex align-items-center">
                <span className="badge bg-success me-3" style={{ fontSize: '1rem' }}>
                    Present: {presentCount} / {students.length}
                </span>
                <button className="btn btn-primary" onClick={handleSaveAttendance} disabled={loading}>
                    <i className="fas fa-save me-2"></i>Save Attendance
                </button>
            </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label">Select Class</label>
            <select
              className="form-select"
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
            >
              <option value="">Select a Class</option>
              {assignedClasses.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Select Date</label>
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : students.length > 0 ? (
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped align-middle">
                  <thead>
                    <tr>
                      <th>Roll No</th>
                      <th>Name</th>
                      <th className="text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(student => (
                      <tr key={student._id}>
                        <td>{student.roll_no}</td>
                        <td>{student.name}</td>
                        <td className="text-center">
                          <div className="btn-group">
                            <button
                              className={`btn btn-sm ${attendance[student._id] === 'Present' ? 'btn-success' : 'btn-outline-success'}`}
                              onClick={() => handleAttendanceChange(student._id, 'Present')}
                            >
                              Present
                            </button>
                            <button
                              className={`btn btn-sm ${attendance[student._id] === 'Absent' ? 'btn-danger' : 'btn-outline-danger'}`}
                              onClick={() => handleAttendanceChange(student._id, 'Absent')}
                            >
                              Absent
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
            <div className="text-center mt-5">
                <p className="text-muted">Please select a class to view students.</p>
            </div>
        )}
      </div>
    </StaffLayout>
  );
}


export default StaffAttendancePage;
