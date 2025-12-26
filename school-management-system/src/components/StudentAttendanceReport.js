import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import autoTable from 'jspdf-autotable';

const StudentAttendanceReport = () => {
  const [attendance, setAttendance] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [showPresentOnly, setShowPresentOnly] = useState(false);

  // Fetch attendance from API
  useEffect(() => {
    // Replace with your API endpoint
    fetch(`/api/reports/attendance?date=${date}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAttendance(data);
          setFilteredAttendance(data);
        } else {
          console.error('Data is not an array:', data);
        }
      });
  }, [date]);

  // Apply filters
  useEffect(() => {
    let filtered = attendance;
    if (showPresentOnly) {
      filtered = filtered.filter((record) => record.status === 'Present');
    }
    setFilteredAttendance(filtered);
  }, [showPresentOnly, attendance]);

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Student Name', 'Class', 'Section', 'Attendance Status']],
      body: filteredAttendance.map((record) => [
        record.studentName,
        record.class,
        record.section,
        record.status,
      ]),
    });
    doc.save('student-attendance-report.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredAttendance);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');
    XLSX.writeFile(workbook, 'student-attendance-report.xlsx');
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div>
      <h2 className="mb-4">Student Attendance Report</h2>
      <div className="card">
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-3">
              <input
                type="date"
                className="form-control"
                value={date}
                onChange={handleDateChange}
              />
            </div>
            <div className="col-md-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={showPresentOnly}
                  onChange={(e) => setShowPresentOnly(e.target.checked)}
                  id="showPresentOnly"
                />
                <label className="form-check-label" htmlFor="showPresentOnly">
                  Show Present Only
                </label>
              </div>
            </div>
          </div>
          <div className="mb-3">
            <button className="btn btn-primary me-2" onClick={exportToPDF}>
              Export to PDF
            </button>
            <button className="btn btn-success me-2" onClick={exportToExcel}>
              Export to Excel
            </button>
            <button className="btn btn-info" onClick={printReport}>
              Print
            </button>
          </div>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Class</th>
                <th>Section</th>
                <th>Attendance Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.map((record) => (
                <tr key={record._id}>
                  <td>{record.studentName}</td>
                  <td>{record.class}</td>
                  <td>{record.section}</td>
                  <td>{record.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendanceReport;
