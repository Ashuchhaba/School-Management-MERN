import React, { useState, useEffect } from 'react';
import StaffLayout from '../components/StaffLayout';
import api from '../api';

function StaffAttendancePage() {
  const [assignedClasses, setAssignedClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAssignedClasses = async () => {
      try {
        const { data } = await api.get('/api/staff/profile');
        setAssignedClasses(data.assigned_classes);
        if (data.assigned_classes.length > 0) {
          setSelectedClass(data.assigned_classes[0]);
        }
      } catch (error) {
        console.error('Error fetching assigned classes:', error);
      }
    };
    fetchAssignedClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchStudentsAndAttendance();
    }
  }, [selectedClass, date]);

  const fetchStudentsAndAttendance = async () => {
    setLoading(true);
    try {
      const { data: studentsData } = await api.get(`/api/students?class=${selectedClass}`);
      setStudents(studentsData);

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

  return (
    <StaffLayout>
      <div className="container-fluid">
        <h2 className="text-primary mb-4">Mark Attendance</h2>
        <div className="row mb-3">
          <div className="col-md-4">
            <select
              className="form-select"
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
            >
              <option value="">Select Class</option>
              {assignedClasses.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
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
        ) : (
          <div className="card">
            <div className="card-body">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Roll No</th>
                    <th>Name</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(student => (
                    <tr key={student._id}>
                      <td>{student.roll_no}</td>
                      <td>{student.name}</td>
                      <td>
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
              <button className="btn btn-primary" onClick={handleSaveAttendance}>Save Attendance</button>
            </div>
          </div>
        )}
      </div>
    </StaffLayout>
  );
}

export default StaffAttendancePage;
