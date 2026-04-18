import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import autoTable from 'jspdf-autotable';
import api from '../api';

const StudentFeesReport = () => {
  const [fees, setFees] = useState([]);
  const [filteredFees, setFilteredFees] = useState([]);
  const [classes, setClasses] = useState([]);
  const [filters, setFilters] = useState({
    class: '',
    feeStatus: '',
    startDate: '',
    endDate: '',
  });

  // Fetch fees from API
  useEffect(() => {
    fetchFees();
    fetchClasses();
  }, []);

  const fetchFees = async () => {
    try {
      const res = await api.get('/api/reports/fees');
      const data = res.data;
      if (Array.isArray(data)) {
        setFees(data);
        setFilteredFees(data);
      }
    } catch (err) {
      console.error('Error fetching fee report:', err);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await api.get('/api/students/count-by-class');
      setClasses(res.data.map(c => c._id));
    } catch (err) {
      console.error('Failed to fetch classes:', err);
    }
  };

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
      filtered = filtered.filter((fee) => {
        if (!fee.paymentDate) return false;
        const feeDate = new Date(fee.paymentDate);
        feeDate.setHours(0, 0, 0, 0);
        const filterStartDate = new Date(filters.startDate);
        filterStartDate.setHours(0, 0, 0, 0);
        return feeDate >= filterStartDate;
      });
    }
    if (filters.endDate) {
      filtered = filtered.filter((fee) => {
        if (!fee.paymentDate) return false;
        const feeDate = new Date(fee.paymentDate);
        feeDate.setHours(0, 0, 0, 0);
        const filterEndDate = new Date(filters.endDate);
        filterEndDate.setHours(0, 0, 0, 0);
        return feeDate <= filterEndDate;
      });
    }
    setFilteredFees(filtered);
  }, [filters, fees]);

  const feesByClass = filteredFees.reduce((acc, fee) => {
    const className = fee.class || 'Unknown';
    if (!acc[className]) {
      acc[className] = {
        totalFees: 0,
        paidAmount: 0,
        pendingAmount: 0,
        studentCount: new Set()
      };
    }
    acc[className].totalFees += fee.totalFees || 0;
    acc[className].paidAmount += fee.paidAmount || 0;
    acc[className].pendingAmount += fee.pendingAmount || 0;
    acc[className].studentCount.add(fee.studentId);
    return acc;
  }, {});

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setFilters({
      class: '',
      feeStatus: '',
      startDate: '',
      endDate: '',
    });
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add summary section
    doc.text('Fees by Class Summary', 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [['Class', 'Total Fees', 'Collected Fees', 'Pending Amount', 'Students Count']],
      body: Object.entries(feesByClass).map(([className, data]) => [
        className,
        data.totalFees,
        data.paidAmount,
        data.pendingAmount,
        data.studentCount.size
      ]),
    });

    // Add detailed section
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text('Detailed Fees Report', 14, finalY);
    autoTable(doc, {
      startY: finalY + 5,
      head: [['Student Name', 'Class', 'Total Fees', 'Paid Amount', 'Due Amount', 'Payment Status', 'Payment Date']],
      body: filteredFees.map((fee) => [
        fee.studentName,
        fee.class,
        fee.totalFees,
        fee.paidAmount,
        fee.pendingAmount,
        fee.paymentStatus,
        fee.paymentDate ? new Date(fee.paymentDate).toLocaleDateString() : 'N/A',
      ]),
    });
    doc.save('student-fees-report.pdf');
  };

  const exportToExcel = () => {
    const summaryData = Object.entries(feesByClass).map(([className, data]) => ({
      Class: className,
      'Total Fees': data.totalFees,
      'Collected Fees': data.paidAmount,
      'Pending Amount': data.pendingAmount,
      'Students Count': data.studentCount.size
    }));

    const workbook = XLSX.utils.book_new();
    const worksheetSummary = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, worksheetSummary, 'Summary By Class');
    
    const worksheetDetails = XLSX.utils.json_to_sheet(filteredFees);
    XLSX.utils.book_append_sheet(workbook, worksheetDetails, 'Details');
    
    XLSX.writeFile(workbook, 'student-fees-report.xlsx');
  };

  const printReport = () => {
    window.print();
  };

  const totalPaidAllClasses = Object.values(feesByClass).reduce((sum, d) => sum + d.paidAmount, 0);
  const totalPendingAllClasses = Object.values(feesByClass).reduce((sum, d) => sum + d.pendingAmount, 0);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Student Fees Report</h2>
        <div className="text-end">
          <h5 className="text-success mb-0">Total Collection: ₹{totalPaidAllClasses.toLocaleString()}</h5>
          <small className="text-muted">Across all classes</small>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h6>Total Collected</h6>
              <h3>₹{totalPaidAllClasses.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <h6>Total Pending</h6>
              <h3>₹{totalPendingAllClasses.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h6>Total Students</h6>
              <h3>{filteredFees.length}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="row mb-3 align-items-end">
            <div className="col-md-2">
              <label className="form-label small">Class</label>
              <select
                className="form-select"
                name="class"
                value={filters.class}
                onChange={handleFilterChange}
              >
                <option value="">All Classes</option>
                {classes.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label small">Payment Status</label>
              <select
                className="form-select"
                name="feeStatus"
                value={filters.feeStatus}
                onChange={handleFilterChange}
              >
                <option value="">All Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Partially Paid">Partially Paid</option>
                <option value="Due">Due</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label small">Start Date</label>
              <input
                type="date"
                className="form-control"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label small">End Date</label>
              <input
                type="date"
                className="form-control"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
              />
            </div>
            <div className="col-md-2">
                <button className="btn btn-outline-secondary w-100" onClick={clearFilters}>
                    <i className="fas fa-undo me-2"></i>Clear
                </button>
            </div>
          </div>
          <div className="mb-3 d-flex gap-2">
            <button className="btn btn-primary" onClick={exportToPDF}>
              <i className="fas fa-file-pdf me-2"></i>Export to PDF
            </button>
            <button className="btn btn-success" onClick={exportToExcel}>
              <i className="fas fa-file-excel me-2"></i>Export to Excel
            </button>
            <button className="btn btn-info" onClick={printReport}>
              <i className="fas fa-print me-2"></i>Print
            </button>
          </div>

          <div className="mb-5 mt-4">
            <h4>Fees by Class Summary</h4>
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Class</th>
                    <th>Total Fees</th>
                    <th>Collected Fees</th>
                    <th>Pending Amount</th>
                    <th>Students Count</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(feesByClass).map(([className, data]) => (
                    <tr key={className}>
                      <td>{className}</td>
                      <td>{data.totalFees}</td>
                      <td>{data.paidAmount}</td>
                      <td>{data.pendingAmount}</td>
                      <td>{data.studentCount.size}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="table-light">
                  <tr>
                    <th>Total</th>
                    <th>{Object.values(feesByClass).reduce((sum, d) => sum + d.totalFees, 0)}</th>
                    <th>{Object.values(feesByClass).reduce((sum, d) => sum + d.paidAmount, 0)}</th>
                    <th>{Object.values(feesByClass).reduce((sum, d) => sum + d.pendingAmount, 0)}</th>
                    <th>{Object.values(feesByClass).reduce((sum, d) => sum + d.studentCount.size, 0)}</th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="mb-3 mt-4">
             <h4>Detailed Fees Report</h4>
          </div>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Class</th>
                <th>Total Fees</th>
                <th>Paid Amount</th>
                <th>Due Amount</th>
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
                  <td>{fee.paymentDate ? new Date(fee.paymentDate).toLocaleDateString() : 'N/A'}</td>
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
