import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import autoTable from 'jspdf-autotable';

const StaffSalaryReport = () => {
  const [salaries, setSalaries] = useState([]);
  const [filteredSalaries, setFilteredSalaries] = useState([]);
  const [filters, setFilters] = useState({
    month: '',
    paymentStatus: '',
  });

  // Fetch salaries from API
  useEffect(() => {
    // Replace with your API endpoint
    fetch('/api/reports/salaries')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSalaries(data);
          setFilteredSalaries(data);
        } else {
          console.error('Data is not an array:', data);
        }
      });
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = salaries;
    if (filters.month) {
      filtered = filtered.filter((salary) => {
          if (!salary.rawDate) return false;
          // Direct string comparison of YYYY-MM
          const salaryMonth = salary.rawDate.substring(0, 7); 
          return salaryMonth === filters.month;
      });
    }
    if (filters.paymentStatus) {
      filtered = filtered.filter(
        (salary) => salary.paymentStatus === filters.paymentStatus
      );
    }
    setFilteredSalaries(filtered);
  }, [filters, salaries]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Staff Name', 'Designation', 'Month', 'Salary Amount', 'Payment Status', 'Payment Date']],
      body: filteredSalaries.map((salary) => [
        salary.staffName,
        salary.designation,
        salary.month,
        salary.salaryAmount,
        salary.paymentStatus,
        salary.paymentDate ? new Date(salary.paymentDate).toLocaleDateString() : 'N/A',
      ]),
    });
    doc.save('staff-salary-report.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredSalaries);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Salaries');
    XLSX.writeFile(workbook, 'staff-salary-report.xlsx');
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div>
      <h2 className="mb-4">Staff Salary Report</h2>
      <div className="card">
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-3">
              <input
                type="month"
                className="form-control"
                placeholder="Filter by Month"
                name="month"
                value={filters.month}
                onChange={handleFilterChange}
              />
            </div>
            <div className="col-md-3">
              <select
                className="form-control"
                name="paymentStatus"
                value={filters.paymentStatus}
                onChange={handleFilterChange}
              >
                <option value="">All Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
              </select>
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
                <th>Staff Name</th>
                <th>Designation</th>
                <th>Month</th>
                <th>Salary Amount</th>
                <th>Payment Status</th>
                <th>Payment Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredSalaries.map((salary) => (
                <tr key={salary._id}>
                  <td>{salary.staffName}</td>
                  <td>{salary.designation}</td>
                  <td>{salary.month}</td>
                  <td>{salary.salaryAmount}</td>
                  <td>{salary.paymentStatus}</td>
                  <td>{new Date(salary.paymentDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffSalaryReport;
