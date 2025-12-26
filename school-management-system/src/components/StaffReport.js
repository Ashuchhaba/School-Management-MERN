import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import autoTable from 'jspdf-autotable';

const StaffReport = () => {
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [filters, setFilters] = useState({
    department: '',
    designation: '',
  });

  // Fetch staff from API
  useEffect(() => {
    // Replace with your API endpoint
    fetch('/api/reports/staff')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setStaff(data);
          setFilteredStaff(data);
        } else {
          console.error('Data is not an array:', data);
        }
      });
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = staff;
    if (filters.department) {
      filtered = filtered.filter((member) => member.department === filters.department);
    }
    if (filters.designation) {
      filtered = filtered.filter((member) => member.designation === filters.designation);
    }
    setFilteredStaff(filtered);
  }, [filters, staff]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Staff ID', 'Name', 'Designation', 'Department', 'Mobile', 'Joining Date']],
      body: filteredStaff.map((member) => [
        member.staffId,
        member.name,
        member.designation,
        member.department,
        member.mobile,
        new Date(member.joiningDate).toLocaleDateString(),
      ]),
    });
    doc.save('staff-report.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredStaff);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Staff');
    XLSX.writeFile(workbook, 'staff-report.xlsx');
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div>
      <h2 className="mb-4">Staff Report</h2>
      <div className="card">
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Filter by Department"
                name="department"
                value={filters.department}
                onChange={handleFilterChange}
              />
            </div>
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Filter by Designation"
                name="designation"
                value={filters.designation}
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
                <th>Staff ID</th>
                <th>Name</th>
                <th>Designation</th>
                <th>Department</th>
                <th>Mobile</th>
                <th>Joining Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((member) => (
                <tr key={member._id}>
                  <td>{member.staffId}</td>
                  <td>{member.name}</td>
                  <td>{member.designation}</td>
                  <td>{member.department}</td>
                  <td>{member.mobile}</td>
                  <td>{new Date(member.joiningDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffReport;
