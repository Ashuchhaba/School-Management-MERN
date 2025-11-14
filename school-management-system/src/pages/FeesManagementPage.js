import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import AdminHeader from '../components/AdminHeader';

function FeesManagementPage() {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [feeStructures, setFeeStructures] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // State for the new cascading dropdowns
  const [selectedClass, setSelectedClass] = useState('');

  const [paymentData, setPaymentData] = useState({
    student_id: '',
    fee_structure_id: '',
    payment_date: new Date().toISOString().split('T')[0],
    paid_amount: '',
    notes: '',
  });

  const [feeStructureData, setFeeStructureData] = useState({
    class: '',
    term: 'Full',
    total_amount: '',
    installment_count: 1,
    description: '',
  });

  useEffect(() => {
    fetchFees();
    fetchStudents();
    fetchFeeStructures();
  }, []);

  const fetchFees = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/fees`);
      setFees(res.data);
    } catch (err) {
      console.error(err);
      alert('Error fetching fees. Please check the console for details.');
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/students`);
      setStudents(res.data);
    } catch (err) {
      console.error(err);
      alert('Error fetching students. Please check the console for details.');
    }
  };

  const fetchFeeStructures = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/fees/structure`);
      setFeeStructures(res.data);
    } catch (err) {
      console.error(err);
      alert('Error fetching fee structures. Please check the console for details.');
    }
  };

  const handlePaymentChange = (e) => {
    setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
  };

  const handleFeeStructureChange = (e) => {
    setFeeStructureData({ ...feeStructureData, [e.target.name]: e.target.value });
  };

  // Handler for the new Class dropdown
  const handleClassChange = (e) => {
    const newClass = e.target.value;
    setSelectedClass(newClass);
    // Reset student and fee structure when class changes
    setPaymentData({
      ...paymentData,
      student_id: '',
      fee_structure_id: '',
    });
  };

  const handleUpdatePayment = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/fees`, paymentData);
      console.log(res.data);
      alert('Payment updated successfully!');
      fetchFees(); // Refresh the list
      // Reset form state
      setPaymentData({
        student_id: '',
        fee_structure_id: '',
        payment_date: new Date().toISOString().split('T')[0],
        paid_amount: '',
        notes: '',
      });
      setSelectedClass(''); // Reset class dropdown as well
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      alert(`Error updating payment: ${err.response ? err.response.data.msg : err.message}`);
    }
  };

  const handleAddFeeStructure = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/fees/structure`, feeStructureData);
      console.log(res.data);
      alert('Fee structure added successfully!');
      fetchFeeStructures(); // Refresh the list
      setFeeStructureData({
        class: '',
        term: 'Full',
        total_amount: '',
        installment_count: 1,
        description: '',
      });
    } catch (err) {
      console.error(err.response.data);
      alert('Error adding fee structure. Please check the console for details.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this fee record?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/fees/${id}`);
        alert('Fee record deleted successfully!');
        fetchFees(); // Refresh the list
      } catch (err) {
        console.error(err);
        alert('Error deleting fee record. Please check the console for details.');
      }
    }
  };

  const filteredFees = fees.filter((fee) => {
    if (!fee.student_id) {
      return false;
    }
    const studentName = fee.student_id.name;
    return (
      studentName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterClass === '' || fee.student_id.class === filterClass) &&
      (filterStatus === '' || fee.status === filterStatus)
    );
  });

  // --- Derived data for cascading dropdowns ---
  const classList = [...new Set(students.map(s => s.class))].sort();
  const filteredStudents = selectedClass ? students.filter(s => s.class === selectedClass) : [];
  const filteredFeeStructures = selectedClass ? feeStructures.filter(fs => fs.class === selectedClass) : [];

  return (
    <>
      <div className="admin-wrapper">
        <Sidebar />
        <div className="main-content">
          <AdminHeader />
          <div className="content-area">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">
                  <i className="fas fa-money-bill-wave text-primary me-2"></i>
                  All Fees
                </h5>
                <div>
                  <button className="btn btn-primary btn-sm me-2" data-bs-toggle="modal" data-bs-target="#updatePaymentModal">
                    <i className="fas fa-plus me-2"></i>Update Payment
                  </button>
                  <button className="btn btn-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#feeStructureModal">
                    <i className="fas fa-cogs me-2"></i>Manage Fee Structure
                  </button>
                </div>
              </div>
              <div className="card-body">
                <div className="search-filter-bar mb-3">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="col-md-3">
                      <select
                        className="form-select"
                        value={filterClass}
                        onChange={(e) => setFilterClass(e.target.value)}
                      >
                        <option value="">All Classes</option>
                        {classList.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <select
                        className="form-select"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                      >
                        <option value="">All Status</option>
                        <option value="Paid">Paid</option>
                        <option value="Partially Paid">Partially Paid</option>
                        <option value="Due">Due</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table table-hover" id="feesTable">
                    <thead>
                      <tr>
                        <th>Student Name</th>
                        <th>Class</th>
                        <th>Paid Amount</th>
                        <th>Due Amount</th>
                        <th>Payment Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFees.map((fee) => (
                        fee.student_id && (
                          <tr key={fee._id}>
                            <td>{fee.student_id.name}</td>
                            <td>{fee.student_id.class}</td>
                            <td>₹{fee.paid_amount}</td>
                            <td>₹{fee.due_amount}</td>
                            <td>{new Date(fee.payment_date).toLocaleDateString()}</td>
                            <td>
                              <span className={`badge ${fee.status === 'Paid' ? 'bg-success' : fee.status === 'Partially Paid' ? 'bg-warning' : 'bg-danger'}`}>
                                {fee.status}
                              </span>
                            </td>
                            <td>
                              <div className="btn-group btn-group-sm">
                                <button className="btn btn-outline-danger" onClick={() => handleDelete(fee._id)}>
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Update Payment Modal */}
      <div className="modal fade" id="updatePaymentModal" tabIndex="-1" aria-labelledby="updatePaymentModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="updatePaymentModalLabel">Update Payment</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleUpdatePayment}>
                <div className="mb-3">
                  <label className="form-label">Class</label>
                  <select className="form-select" name="class" value={selectedClass} onChange={handleClassChange} required>
                    <option value="">Select Class</option>
                    {classList.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Student</label>
                  <select className="form-select" name="student_id" value={paymentData.student_id} onChange={handlePaymentChange} required disabled={!selectedClass}>
                    <option value="">Select Student</option>
                    {filteredStudents.map((student) => (
                      <option key={student._id} value={student._id}>
                        {student.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Fee Structure</label>
                  <select className="form-select" name="fee_structure_id" value={paymentData.fee_structure_id} onChange={handlePaymentChange} required disabled={!selectedClass}>
                    <option value="">Select Fee Structure</option>
                    {filteredFeeStructures.map((fs) => (
                      <option key={fs._id} value={fs._id}>
                        {fs.class} - {fs.term} (₹{fs.total_amount})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Payment Date</label>
                      <input type="date" className="form-control" name="payment_date" value={paymentData.payment_date} onChange={handlePaymentChange} required />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Paid Amount</label>
                      <input type="number" className="form-control" name="paid_amount" value={paymentData.paid_amount} onChange={handlePaymentChange} required />
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Notes</label>
                  <textarea className="form-control" name="notes" value={paymentData.notes} onChange={handlePaymentChange}></textarea>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                  <button type="submit" className="btn btn-primary">Update Payment</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Fee Structure Modal */}
      <div className="modal fade" id="feeStructureModal" tabIndex="-1" aria-labelledby="feeStructureModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="feeStructureModalLabel">Manage Fee Structure</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddFeeStructure}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Class</label>
                      <input type="text" className="form-control" name="class" value={feeStructureData.class} onChange={handleFeeStructureChange} required />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Term</label>
                      <select className="form-select" name="term" value={feeStructureData.term} onChange={handleFeeStructureChange} required>
                        <option value="Full">Full</option>
                        <option value="Term 1">Term 1</option>
                        <option value="Term 2">Term 2</option>
                        <option value="Term 3">Term 3</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Total Amount</label>
                      <input type="number" className="form-control" name="total_amount" value={feeStructureData.total_amount} onChange={handleFeeStructureChange} required />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Installment Count</label>
                      <input type="number" className="form-control" name="installment_count" value={feeStructureData.installment_count} onChange={handleFeeStructureChange} />
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" name="description" value={feeStructureData.description} onChange={handleFeeStructureChange}></textarea>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                  <button type="submit" className="btn btn-primary">Add Fee Structure</button>
                </div>
              </form>
              <hr />
              <h5>Existing Fee Structures</h5>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Class</th>
                      <th>Term</th>
                      <th>Total Amount</th>
                      <th>Installments</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feeStructures.map((fs) => (
                      <tr key={fs._id}>
                        <td>{fs.class}</td>
                        <td>{fs.term}</td>
                        <td>₹{fs.total_amount}</td>
                        <td>{fs.installment_count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FeesManagementPage;
