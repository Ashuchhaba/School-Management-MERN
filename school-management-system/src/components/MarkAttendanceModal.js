import React, { useState, useEffect } from 'react';
import api from '../api';
import Portal from './Portal';

function MarkAttendanceModal({ onClose }) {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().slice(0, 10));
  const [attendanceData, setAttendanceData] = useState({});
  const [isSavingAttendance, setIsSavingAttendance] = useState(false);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/staff');
      setStaffList(res.data);
      // Initialize attendance data
      const initialData = {};
      res.data.forEach(staff => {
        initialData[staff._id] = 'Present'; // Default to 'Present'
      });
      setAttendanceData(initialData);
    } catch (err) {
      console.error('Error fetching staff:', err);
      alert('Failed to load staff list.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (staffId, status) => {
    setAttendanceData(prev => ({ ...prev, [staffId]: status }));
  };

  const handleBulkChange = (e) => {
    const newStatus = e.target.value;
    const updatedData = {};
    staffList.forEach(staff => {
      updatedData[staff._id] = newStatus;
    });
    setAttendanceData(updatedData);
  };

  const handleSaveAttendance = async () => {
    const records = Object.keys(attendanceData).map(staff_id => ({
      staff_id,
      status: attendanceData[staff_id],
    }));

    if (!attendanceDate || records.length === 0) {
      alert('Please select a date and ensure staff are loaded.');
      return;
    }

    setIsSavingAttendance(true); // Set saving state to true
    try {
      await api.post('/api/salaries/bulk-attendance', {
        attendance_date: attendanceDate,
        records,
      });
      alert('Attendance recorded successfully!');
      onClose();
    } catch (err) {
      console.error('Error saving attendance:', err);
      alert('Failed to save attendance. ' + (err.response?.data?.message || ''));
    } finally {
      setIsSavingAttendance(false); // Reset saving state to false
    }
  };

  return (
    <Portal>
      <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title"><i className="fas fa-calendar-check me-2"></i>Mark Daily Attendance</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label htmlFor="attendanceDate" className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-control"
                    id="attendanceDate"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="bulkStatus" className="form-label">Set All To</label>
                  <select id="bulkStatus" className="form-select" onChange={handleBulkChange}>
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Leave">Leave</option>
                  </select>
                </div>
              </div>
              <div className="table-responsive" style={{ maxHeight: '400px' }}>
                <table className="table table-sm table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>Staff Name</th>
                      <th>Designation</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="3" className="text-center">Loading staff...</td></tr>
                    ) : staffList.length > 0 ? (
                      staffList.map(staff => (
                        <tr key={staff._id}>
                          <td>{staff.name}</td>
                          <td>{staff.designation}</td>
                          <td>
                            <select
                              className="form-select form-select-sm"
                              value={attendanceData[staff._id] || 'Present'}
                              onChange={(e) => handleStatusChange(staff._id, e.target.value)}
                            >
                              <option value="Present">Present</option>
                              <option value="Absent">Absent</option>
                              <option value="Leave">Leave</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="3" className="text-center">No staff found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={handleSaveAttendance} disabled={loading || isSavingAttendance}>
                {isSavingAttendance ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save me-2"></i>Save Attendance
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}

export default MarkAttendanceModal;
