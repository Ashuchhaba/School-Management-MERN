import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';
import Sidebar from '../components/Sidebar';
import AdminHeader from '../components/AdminHeader';
import StatCard from '../components/StatCard';
import MarkAttendanceModal from '../components/MarkAttendanceModal';
import ProcessSalaryModal from '../components/ProcessSalaryModal';
import ViewAttendanceModal from '../components/ViewAttendanceModal';
import { debounce } from 'lodash';
import { usePopup } from '../contexts/PopupContext';

function StaffPaymentPage() {
  const [stats, setStats] = useState({
    total_salary_due: 0,
    total_paid: 0,
    staff_paid: 0,
    total_staff: 0,
    avg_attendance_percentage: 0,
  });
  const [salaries, setSalaries] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingSalaries, setLoadingSalaries] = useState(true);
  const [filters, setFilters] = useState({
    month: new Date().toISOString().slice(0, 7),
    search: '',
  });
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showProcessSalaryModal, setShowProcessSalaryModal] = useState(false);
  const [showViewAttendanceModal, setShowViewAttendanceModal] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState(null);
  const { showPopup, showConfirm } = usePopup();

  const fetchSalaryData = useCallback(async () => {
    setLoadingStats(true);
    setLoadingSalaries(true);
    try {
      const statsPromise = api.get(`/api/salaries/stats?month=${filters.month}`);
      const salariesPromise = api.get(`/api/salaries?month=${filters.month}&search=${filters.search}`);
      
      const [statsRes, salariesRes] = await Promise.all([statsPromise, salariesPromise]);
      
      setStats(statsRes.data);
      setSalaries(salariesRes.data);
    } catch (err) {
      console.error('Error fetching salary data:', err);
      showPopup('Error fetching salary data.');
    } finally {
      setLoadingStats(false);
      setLoadingSalaries(false);
    }
  }, [filters.month, filters.search, showPopup]);

  useEffect(() => {
    fetchSalaryData();
  }, [fetchSalaryData]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const debouncedSearch = useCallback(
    debounce((value) => {
      setFilters((prev) => ({ ...prev, search: value }));
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const handleClearFilters = () => {
    setFilters({
      month: new Date().toISOString().slice(0, 7),
      search: '',
    });
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.value = '';
    }
  };

  const handleCalculateSalaries = () => {
    showConfirm(`Are you sure you want to calculate salaries for all staff for ${filters.month}?`, async () => {
      try {
        const res = await api.post('/api/salaries/calculate-all', { month: filters.month });
        showPopup(`Salaries calculated successfully for ${res.data.count} staff members.`);
        fetchSalaryData(); // Refetch all data
      } catch (err) {
        console.error('Error calculating salaries:', err);
        showPopup('Error calculating salaries. ' + (err.response?.data?.message || ''));
      }
    });
  };

  const handleEditSalary = (salary) => {
    setSelectedSalary(salary);
    setShowProcessSalaryModal(true);
  };

  const handleDeleteSalary = (id) => {
    showConfirm('Are you sure you want to delete this salary payment record?', async () => {
      try {
        await api.delete(`/api/salaries/${id}`);
        showPopup('Salary record deleted successfully!');
        fetchSalaryData(); // Refetch all data
      } catch (err) {
        console.error(err);
        showPopup('Error deleting salary record.');
      }
    });
  };

  const handleViewAttendance = (salary) => {
    setSelectedSalary(salary);
    setShowViewAttendanceModal(true);
  };
  
  const handleModalClose = () => {
    setShowAttendanceModal(false);
    setShowProcessSalaryModal(false);
    setShowViewAttendanceModal(false);
    setSelectedSalary(null);
    fetchSalaryData(); // Refetch all data
  };

  return (
    <div className="admin-wrapper">
      <Sidebar />
      <div className="main-content">
        <AdminHeader />
        <div className="content-area">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="page-title">Staff Payment & Attendance</h1>
            <button className="btn btn-primary" onClick={() => setShowAttendanceModal(true)}>
              <i className="fas fa-calendar-check me-2"></i>Mark Attendance
            </button>
          </div>

          {/* Payment Overview Cards */}
          <div className="row mb-4">
            {loadingStats ? (
              <p>Loading statistics...</p>
            ) : (
              <>
                <div className="col-lg-3 col-md-6 mb-3">
                  <StatCard icon="fa-money-bill-wave" label={`Total Salary Due (${filters.month})`} value={`₹${stats.total_salary_due?.toLocaleString('en-IN')}`} type="primary" />
                </div>
                <div className="col-lg-3 col-md-6 mb-3">
                  <StatCard icon="fa-check-circle" label={`Total Paid (${filters.month})`} value={`₹${stats.total_paid?.toLocaleString('en-IN')}`} type="success" />
                </div>
                <div className="col-lg-3 col-md-6 mb-3">
                  <StatCard icon="fa-users" label="Staff Paid" value={`${stats.staff_paid} / ${stats.total_staff}`} type="warning" />
                </div>
                <div className="col-lg-3 col-md-6 mb-3">
                  <StatCard icon="fa-percentage" label={`Avg Attendance (${filters.month})`} value={`${stats.avg_attendance_percentage}%`} type="info" />
                </div>
              </>
            )}
          </div>

          {/* Filter Bar */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="row g-3 align-items-center">
                <div className="col-md-3">
                  <div className="input-group">
                    <span className="input-group-text"><i className="fas fa-calendar"></i></span>
                    <input type="month" className="form-control" name="month" value={filters.month} onChange={handleFilterChange} />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="input-group">
                    <span className="input-group-text"><i className="fas fa-search"></i></span>
                    <input type="text" className="form-control" id="searchInput" placeholder="Search staff name or ID..." onChange={handleSearchChange} />
                  </div>
                </div>
                <div className="col-md-3">
                  <button className="btn btn-success w-100" onClick={handleCalculateSalaries}>
                    <i className="fas fa-calculator me-2"></i>Calculate Salaries
                  </button>
                </div>
                <div className="col-md-2">
                  <button className="btn btn-outline-secondary w-100" onClick={handleClearFilters}>
                    <i className="fas fa-times me-2"></i>Clear
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Staff Payment Table */}
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0"><i className="fas fa-table me-2"></i>Staff Salary Payments</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Staff Name</th>
                      <th>Designation</th>
                      <th>Payment Month</th>
                      <th>Base Salary</th>
                      <th>Days Present</th>
                      <th>Calculated Salary</th>
                      <th>Paid On</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingSalaries ? (
                      <tr><td colSpan="8" className="text-center py-4">Loading salary payments...</td></tr>
                    ) : salaries.length > 0 ? (
                      salaries.map((salary) => (
                        <tr key={salary._id}>
                          <td>{salary.staff_id?.name || 'N/A'}</td>
                          <td>{salary.staff_id?.designation || 'N/A'}</td>
                          <td>{new Date(salary.payment_month).toLocaleString('en-US', { year: 'numeric', month: 'long' })}</td>
                          <td>₹{salary.staff_id?.salary?.toLocaleString('en-IN') || 'N/A'}</td>
                          <td>{`${salary.total_days_present} / ${salary.total_days_in_month}`}</td>
                          <td>₹{salary.calculated_salary?.toLocaleString('en-IN')}</td>
                          <td>{salary.paid_on ? new Date(salary.paid_on).toLocaleDateString() : 'Pending'}</td>
                          <td>
                            <button className="btn btn-sm btn-info me-1" title="View Attendance" onClick={() => handleViewAttendance(salary)}>
                              <i className="fas fa-calendar-alt"></i>
                            </button>
                            <button className="btn btn-sm btn-warning me-1" title="Edit/Process Payment" onClick={() => handleEditSalary(salary)}>
                              <i className="fas fa-edit"></i>
                            </button>
                            <button className="btn btn-sm btn-danger" title="Delete" onClick={() => handleDeleteSalary(salary._id)}>
                              <i className="fas fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="8" className="text-center py-4">No salary payments found for the selected filters.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAttendanceModal && <MarkAttendanceModal onClose={handleModalClose} />}
      {showProcessSalaryModal && <ProcessSalaryModal salary={selectedSalary} onClose={handleModalClose} />}
      {showViewAttendanceModal && <ViewAttendanceModal staffId={selectedSalary.staff_id._id} staffName={selectedSalary.staff_id.name} month={filters.month} onClose={handleModalClose} />}
    </div>
  );
}

export default StaffPaymentPage;