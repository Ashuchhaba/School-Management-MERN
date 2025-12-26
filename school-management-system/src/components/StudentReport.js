import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import autoTable from 'jspdf-autotable';

const StudentReport = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [filters, setFilters] = useState({
    class: '',
    admissionYear: '',
  });

  // Fetch students from API
  useEffect(() => {
    // Replace with your API endpoint
    fetch('/api/reports/students')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setStudents(data);
          setFilteredStudents(data);
        } else {
          console.error('Data is not an array:', data);
        }
      });
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = students;
    if (filters.class) {
      filtered = filtered.filter((student) => student.class === filters.class);
    }
    if (filters.admissionYear) {
      filtered = filtered.filter(
        (student) => new Date(student.admissionDate).getFullYear() === parseInt(filters.admissionYear)
      );
    }
    setFilteredStudents(filtered);
  }, [filters, students]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['GR No', 'Name', 'Class', 'Gender', 'Mobile', 'Admission Date']],
      body: filteredStudents.map((student) => [
        student.gr_no,
        student.name,
        student.class,
        student.gender,
        student.mobile,
        new Date(student.admissionDate).toLocaleDateString(),
      ]),
    });
    doc.save('student-report.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredStudents.map(student => ({
      'GR No': student.gr_no,
      'Name': student.name,
      'Class': student.class,
      'Gender': student.gender,
      'Mobile': student.mobile,
      'Admission Date': new Date(student.admissionDate).toLocaleDateString(),
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
    XLSX.writeFile(workbook, 'student-report.xlsx');
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div>
      <h2 className="mb-4">Student Report</h2>
      <div className="card">
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Filter by Class"
                name="class"
                value={filters.class}
                onChange={handleFilterChange}
              />
            </div>
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Filter by Admission Year"
                name="admissionYear"
                value={filters.admissionYear}
                onChange={handleFilterChange}
              />
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
                <th>GR No</th>
                <th>Name</th>
                <th>Class</th>
                <th>Gender</th>
                <th>Mobile</th>
                <th>Admission Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student._id}>
                  <td>{student.gr_no}</td>
                  <td>{student.name}</td>
                  <td>{student.class}</td>
                  <td>{student.gender}</td>
                  <td>{student.mobile}</td>
                  <td>{new Date(student.admissionDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentReport;
