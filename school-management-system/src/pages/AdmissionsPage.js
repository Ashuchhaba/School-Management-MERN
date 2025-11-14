import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import AdminHeader from '../components/AdminHeader';
import { useLocation } from 'react-router-dom';

function AdmissionsPage() {
  const [admissions, setAdmissions] = useState([]);
  const [filteredAdmissions, setFilteredAdmissions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({});
  const [approveFormData, setApproveFormData] = useState({});
  const [filters, setFilters] = useState({
    search: '',
    class: '',
    status: '',
  });

  const location = useLocation();

  useEffect(() => {
    if (location.state?.openModal) {
      handleShowModal();
    }
  }, [location.state]);

  useEffect(() => {
    fetchAdmissions();
  }, []);

  useEffect(() => {
    let filtered = admissions;
    if (filters.search) {
      filtered = filtered.filter(
        (admission) =>
          admission.applicant_name.toLowerCase().includes(filters.search.toLowerCase()) ||
          admission.father_name.toLowerCase().includes(filters.search.toLowerCase()) ||
          admission.contact_no1.includes(filters.search)
      );
    }
    if (filters.class) {
      filtered = filtered.filter((admission) => admission.applying_for_class === filters.class);
    }
    if (filters.status) {
      filtered = filtered.filter((admission) => admission.status === filters.status);
    }
    setFilteredAdmissions(filtered);
  }, [filters, admissions]);

  const fetchAdmissions = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admissions`);
      setAdmissions(res.data);
    } catch (err) {
      console.error(err);
      alert('Error fetching admissions. Please check the console for details.');
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      class: '',
      status: '',
    });
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApproveFormChange = (e) => {
    setApproveFormData({ ...approveFormData, [e.target.name]: e.target.value });
  };

  const handleShowModal = (admission = {}) => {
    setIsEdit(!!admission._id);
    setFormData(admission);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({});
  };

  const handleShowApproveModal = (admission) => {
    setApproveFormData({
      admission_id: admission._id,
      applicant_name: admission.applicant_name,
      applying_for_class: admission.applying_for_class,
      father_name: admission.father_name,
      contact_no1: admission.contact_no1,
      date_of_join: new Date().toISOString().split('T')[0],
    });
    setShowApproveModal(true);
  };

  const handleCloseApproveModal = () => {
    setShowApproveModal(false);
    setApproveFormData({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/admissions/${formData._id}`, formData);
        alert('Admission application updated successfully!');
      } else {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/admissions`, { ...formData, status: 'Pending' });
        alert('Admission application submitted successfully!');
      }
      fetchAdmissions();
      handleCloseModal();
    } catch (err) {
      console.error(err);
      alert('Error submitting admission application. Please check the console for details.');
    }
  };

  const handleApprove = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/students/approve`, approveFormData);
      alert('Admission approved and student created successfully!');
      fetchAdmissions();
      handleCloseApproveModal();
    } catch (err) {
      console.error(err);
      alert('Error approving admission. Please check the console for details.');
    }
  };

  const handleReject = async (id) => {
    if (window.confirm('Are you sure you want to reject this admission application?')) {
      try {
        await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/admissions/${id}`, { status: 'Rejected' });
        alert('Admission rejected successfully!');
        fetchAdmissions();
      } catch (err) {
        console.error(err);
        alert('Error rejecting admission. Please check the console for details.');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this admission application? This action cannot be undone.')) {
      try {
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/admissions/${id}`);
        alert('Admission application deleted successfully!');
        fetchAdmissions();
      } catch (err) {
        console.error(err);
        alert('Error deleting admission. Please check the console for details.');
      }
    }
  };

  return (
    <div className="admin-wrapper">
      <Sidebar />
      <div className="main-content">
        <AdminHeader />
        <div className="content-area">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="page-title">New Student Admission</h1>
            <button className="btn btn-success" onClick={() => handleShowModal()}>
              <i className="fas fa-plus me-2"></i>Add New Application
            </button>
          </div>

          <div className="card mb-4">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      name="search"
                      placeholder="Search applicant name or contact..."
                      value={filters.search}
                      onChange={handleFilterChange}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <select
                    className="form-select"
                    name="class"
                    value={filters.class}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Classes</option>
                    <option value="Nursery">Nursery</option>
                    <option value="LKG">LKG</option>
                    <option value="UKG">UKG</option>
                    <option value="1st">1st</option>
                    <option value="2nd">2nd</option>
                    <option value="3rd">3rd</option>
                    <option value="4th">4th</option>
                    <option value="5th">5th</option>
                    <option value="6th">6th</option>
                    <option value="7th">7th</option>
                    <option value="8th">8th</option>
                    <option value="9th">9th</option>
                    <option value="10th">10th</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <select
                    className="form-select"
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <button className="btn btn-outline-secondary w-100" onClick={clearFilters}>
                    <i className="fas fa-times me-2"></i>Clear
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="fas fa-list me-2"></i>Admission Applications
              </h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Applicant Name</th>
                      <th>Applying For</th>
                      <th>Father's Name</th>
                      <th>Contact No</th>
                      <th>Submission Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAdmissions.map((admission) => (
                      <tr key={admission._id}>
                        <td>{admission.applicant_name}</td>
                        <td>{admission.applying_for_class}</td>
                        <td>{admission.father_name}</td>
                        <td>{admission.contact_no1}</td>
                        <td>{new Date(admission.submission_date).toLocaleDateString()}</td>
                        <td>
                          <span
                            className={`badge ${
                              admission.status === 'Approved'
                                ? 'bg-success'
                                : admission.status === 'Rejected'
                                ? 'bg-danger'
                                : 'bg-warning text-dark'
                            }`}
                          >
                            {admission.status}
                          </span>
                        </td>
                        <td>
                          {admission.status === 'Pending' && (
                            <>
                              <button
                                className="btn btn-sm btn-success me-1"
                                onClick={() => handleShowApproveModal(admission)}
                              >
                                <i className="fas fa-check"></i> Approve
                              </button>
                              <button
                                className="btn btn-sm btn-danger me-1"
                                onClick={() => handleReject(admission._id)}
                              >
                                <i className="fas fa-times"></i> Reject
                              </button>
                            </>
                          )}
                          <button
                            className="btn btn-sm btn-warning me-1"
                            onClick={() => handleShowModal(admission)}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => handleDelete(admission._id)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-user-plus me-2"></i>
                  {isEdit ? 'Edit Admission Application' : 'Add New Application'}
                </h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <h6 className="text-primary">Applicant Details</h6>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          id="applicantName"
                          name="applicant_name"
                          placeholder="Applicant Name"
                          value={formData.applicant_name || ''}
                          onChange={handleFormChange}
                          required
                        />
                        <label htmlFor="applicantName">Applicant Name *</label>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-floating">
                        <input
                          type="date"
                          className="form-control"
                          id="applicantDob"
                          name="applicant_dob"
                          value={formData.applicant_dob ? formData.applicant_dob.split('T')[0] : ''}
                          onChange={handleFormChange}
                          required
                        />
                        <label htmlFor="applicantDob">Date of Birth *</label>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-floating">
                        <select
                          className="form-select"
                          id="applicantGender"
                          name="applicant_gender"
                          value={formData.applicant_gender || ''}
                          onChange={handleFormChange}
                          required
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        <label htmlFor="applicantGender">Gender *</label>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          id="fatherName"
                          name="father_name"
                          placeholder="Father's Name"
                          value={formData.father_name || ''}
                          onChange={handleFormChange}
                          required
                        />
                        <label htmlFor="fatherName">Father's Name *</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          id="motherName"
                          name="mother_name"
                          placeholder="Mother's Name"
                          value={formData.mother_name || ''}
                          onChange={handleFormChange}
                          required
                        />
                        <label htmlFor="motherName">Mother's Name *</label>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="form-floating">
                        <input
                          type="tel"
                          className="form-control"
                          id="contactNo1"
                          name="contact_no1"
                          placeholder="Contact Number 1"
                          value={formData.contact_no1 || ''}
                          onChange={handleFormChange}
                          required
                        />
                        <label htmlFor="contactNo1">Contact Number 1 *</label>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-floating">
                        <input
                          type="tel"
                          className="form-control"
                          id="contactNo2"
                          name="contact_no2"
                          placeholder="Contact Number 2"
                          value={formData.contact_no2 || ''}
                          onChange={handleFormChange}
                        />
                        <label htmlFor="contactNo2">Contact Number 2</label>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-floating">
                        <select
                          className="form-select"
                          id="applyingForClass"
                          name="applying_for_class"
                          value={formData.applying_for_class || ''}
                          onChange={handleFormChange}
                          required
                        >
                          <option value="">Select Class</option>
                          <option value="Nursery">Nursery</option>
                          <option value="LKG">LKG</option>
                          <option value="UKG">UKG</option>
                          <option value="1st">1st</option>
                          <option value="2nd">2nd</option>
                          <option value="3rd">3rd</option>
                          <option value="4th">4th</option>
                          <option value="5th">5th</option>
                          <option value="6th">6th</option>
                          <option value="7th">7th</option>
                          <option value="8th">8th</option>
                          <option value="9th">9th</option>
                          <option value="10th">10th</option>
                        </select>
                        <label htmlFor="applyingForClass">Applying For Class *</label>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-floating">
                        <textarea
                          className="form-control"
                          id="address"
                          name="address"
                          placeholder="Address"
                          style={{ height: '100px' }}
                          value={formData.address || ''}
                          onChange={handleFormChange}
                          required
                        ></textarea>
                        <label htmlFor="address">Address *</label>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-floating">
                        <textarea
                          className="form-control"
                          id="notes"
                          name="notes"
                          placeholder="Notes"
                          style={{ height: '100px' }}
                          value={formData.notes || ''}
                          onChange={handleFormChange}
                        ></textarea>
                        <label htmlFor="notes">Notes</label>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      <i className="fas fa-save me-2"></i>
                      {isEdit ? 'Update Application' : 'Save Application'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {showApproveModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-check-circle me-2"></i>
                  Approve Admission & Create Student Record
                </h5>
                <button type="button" className="btn-close" onClick={handleCloseApproveModal}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleApprove}>
                  <p>Review the details below and provide the required student identifiers to finalize the admission.</p>

                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <strong>Applicant Name:</strong> {approveFormData.applicant_name}
                    </div>
                    <div className="col-md-6">
                      <strong>Applying For Class:</strong> {approveFormData.applying_for_class}
                    </div>
                    <div className="col-md-6">
                      <strong>Father's Name:</strong> {approveFormData.father_name}
                    </div>
                    <div className="col-md-6">
                      <strong>Contact No:</strong> {approveFormData.contact_no1}
                    </div>
                  </div>

                  <h6 className="text-success">Student Record Details</h6>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          id="approveGrNo"
                          name="gr_no"
                          placeholder="GR Number"
                          value={approveFormData.gr_no || ''}
                          onChange={handleApproveFormChange}
                        />
                        <label htmlFor="approveGrNo">GR Number</label>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          id="approveUdiseNo"
                          name="udise_no"
                          placeholder="UDISE Number"
                          value={approveFormData.udise_no || ''}
                          onChange={handleApproveFormChange}
                        />
                        <label htmlFor="approveUdiseNo">UDISE Number</label>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          id="approvePanNo"
                          name="pan_no"
                          placeholder="PAN Number"
                          value={approveFormData.pan_no || ''}
                          onChange={handleApproveFormChange}
                        />
                        <label htmlFor="approvePanNo">PAN Number</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          id="approveRollNo"
                          name="roll_no"
                          placeholder="Roll Number"
                          value={approveFormData.roll_no || ''}
                          onChange={handleApproveFormChange}
                          required
                        />
                        <label htmlFor="approveRollNo">Roll Number *</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="date"
                          className="form-control"
                          id="approveDateOfJoin"
                          name="date_of_join"
                          value={approveFormData.date_of_join || ''}
                          onChange={handleApproveFormChange}
                          required
                        />
                        <label htmlFor="approveDateOfJoin">Date of Join *</label>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={handleCloseApproveModal}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-success">
                      <i className="fas fa-check me-2"></i>Confirm Approval
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdmissionsPage;
