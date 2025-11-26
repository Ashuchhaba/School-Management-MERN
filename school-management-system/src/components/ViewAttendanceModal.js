import React, { useState, useEffect } from 'react';
import api from '../api';
import Portal from './Portal';
import '../styles/ViewAttendanceModal.css';

function ViewAttendanceModal({ staffId, staffName, month, onClose }) {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await api.get(`/api/salaries/attendance/${staffId}/${month}`);
        setAttendance(res.data);
      } catch (err) {
        console.error(err);
        // You might want to show a popup here
      } finally {
        setLoading(false);
      }
    };

    if (staffId && month) {
      fetchAttendance();
    }
  }, [staffId, month]);

  const renderCalendar = () => {
    if (loading) {
      return <p>Loading attendance...</p>;
    }

    const year = parseInt(month.split('-')[0]);
    const monthIndex = parseInt(month.split('-')[1]) - 1;
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const firstDay = new Date(year, monthIndex, 1).getDay();

    const calendarDays = [];

    // Add weekday headers
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    weekdays.forEach(day => {
        calendarDays.push(<div className="calendar-day weekday-header" key={day}><strong>{day}</strong></div>);
    });

    // Add empty cells for the days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(<div className="calendar-day empty" key={`empty-${i}`}></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, monthIndex, day);
      const attendanceRecord = attendance.find(
        (att) => new Date(att.attendance_date).setHours(0,0,0,0) === date.setHours(0,0,0,0)
      );

      let statusClass = 'not-recorded';
      let statusText = 'N/A';
      if (attendanceRecord) {
        statusText = attendanceRecord.status;
        switch (attendanceRecord.status) {
          case 'Present':
            statusClass = 'present';
            break;
          case 'Absent':
            statusClass = 'absent';
            break;
          case 'Leave':
            statusClass = 'leave';
            break;
          default:
            break;
        }
      }

      calendarDays.push(
        <div className="calendar-day" key={day}>
          <div className="day-number">{day}</div>
          <div className={`status ${statusClass}`}>{statusText}</div>
        </div>
      );
    }

    return <div className="calendar-grid">{calendarDays}</div>;
  };

  return (
    <Portal>
      <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                Attendance for {staffName} - {new Date(month + '-02').toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              {renderCalendar()}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}

export default ViewAttendanceModal;
