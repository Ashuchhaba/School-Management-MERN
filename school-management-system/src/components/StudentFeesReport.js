import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import autoTable from 'jspdf-autotable';

const StudentFeesReport = () => {
  const [fees, setFees] = useState([]);
  const [filteredFees, setFilteredFees] = useState([]);
  const [filters, setFilters] = useState({
    class: '',
    feeStatus: '',
    startDate: '',
    endDate: '',
  });

  // Fetch fees from API
  useEffect(() => {
    // Replace with your API endpoint
    fetch('/api/reports/fees')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setFees(data);
          setFilteredFees(data);
        } else {
          console.error('Data is not an array:', data);
        }
      });
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = fees;
    if (filters.class) {
      filtered = filtered.filter((fee) => fee.class === filters.class);
    }
    if (filters.feeStatus) {
      filtered = filtered.filter((fee) => fee.paymentStatus === filters.feeStatus);
    }
    if (filters.startDate) {
      filtered = filtered.filter(
        (fee) => new Date(fee.paymentDate) >= new Date(filters.startDate)
      );
    }
    if (filters.endDate) {
      filtered = filtered.filter(
        (fee) => new Date(fee.paymentDate) <= new Date(filters.endDate)
      );
    }
    setFilteredFees(filtered);
  }, [filters, fees]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Student Name', 'Class', 'Total Fees', 'Paid Amount', 'Pending Amount', 'Payment Status', 'Payment Date']],
      body: filteredFees.map((fee) => [
        fee.studentName,
        fee.class,
        fee.totalFees,
        fee.paidAmount,
        fee.pendingAmount,
        fee.paymentStatus,
        new Date(fee.paymentDate).toLocaleDateString(),
      ]),
    });
    doc.save('student-fees-report.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredFees);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Fees');
    XLSX.writeFile(workbook, 'student-fees-report.xlsx');
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div>
      <h2 className="mb-4">Student Fees Report</h2>
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
              <select
                className="form-control"
                name="feeStatus"
                value={filters.feeStatus}
                onChange={handleFilterChange}
              >
                <option value="">All Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <div className="col-md-3">
              <input
                type="date"
                className="form-control"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
              />
            </div>
            <div className="col-md-3">
              <input
                type="date"
                className="form-control"
                name="endDate"
                value={filters.endDate}
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
                <th>Student Name</th>
                <th>Class</th>
                <th>Total Fees</th>
                <th>Paid Amount</th>
                <th>Pending Amount</th>
                <th>Payment Status</th>
                <th>Payment Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredFees.map((fee) => (
                <tr key={fee._id}>
                  <td>{fee.studentName}</td>
                  <td>{fee.class}</td>
                  <td>{fee.totalFees}</td>
                  <td>{fee.paidAmount}</td>
                  <td>{fee.pendingAmount}</td>
                  <td>{fee.paymentStatus}</td>
                  <td>{new Date(fee.paymentDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentFeesReport;
