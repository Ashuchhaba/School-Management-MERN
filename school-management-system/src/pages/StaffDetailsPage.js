import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import AdminHeader from '../components/AdminHeader';
import ViewStaffModal from '../components/ViewStaffModal';
import EditStaffModal from '../components/EditStaffModal';

function StaffDetailsPage() {
  const [staff, setStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDesignation, setFilterDesignation] = useState('');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [newStaffData, setNewStaffData] = useState({
    name: '',
    dob: '',
    gender: '',
    qualification: '',
    experience: '',
    date_of_join: '',
    mobile_no: '',
    email: '',
    address: '',
    designation: '',
    class_teacher_of: '',
    subjects_taught: '',
    salary: '',
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/staff');
      setStaff(res.data);
    } catch (err) {
      console.error(err);
      alert('Error fetching staff. Please check the console for details.');
    }
  };

  const handleNewStaffChange = (e) => {
    setNewStaffData({ ...newStaffData, [e.target.name]: e.target.value });
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/staff', newStaffData);
      console.log(res.data);
      alert('Staff member added successfully!');
      fetchStaff(); // Refresh the list
      // Close modal - Bootstrap modals can be closed programmatically
      // For now, we'll just reset the form
      setNewStaffData({
        name: '',
        dob: '',
        gender: '',
        qualification: '',
        experience: '',
        date_of_join: '',
        mobile_no: '',
        email: '',
        address: '',
        designation: '',
        class_teacher_of: '',
        subjects_taught: '',
        salary: '',
      });
    } catch (err) {
      console.error(err.response.data);
      alert('Error adding staff member. Please check the console for details.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        await axios.delete(`http://localhost:5000/api/staff/${id}`);
        alert('Staff member deleted successfully!');
        fetchStaff(); // Refresh the list
      } catch (err) {
        console.error(err);
        alert('Error deleting staff member. Please check the console for details.');
      }
    }
  };

  const handleViewDetails = (staffMember) => {
    setSelectedStaff(staffMember);
    setIsViewModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsViewModalOpen(false);
    setSelectedStaff(null);
  };

  const handleEdit = (staffMember) => {
    setSelectedStaff(staffMember);
    setIsEditModalOpen(true);
  };

  const handleUpdateStaff = async (updatedStaff) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/staff/${updatedStaff._id}`, updatedStaff);
      console.log(res.data);
      alert('Staff member updated successfully!');
      fetchStaff(); // Refresh the list
      setIsEditModalOpen(false);
      setSelectedStaff(null);
    } catch (err) {
      console.error(err.response.data);
      alert('Error updating staff member. Please check the console for details.');
    }
  };

  const filteredStaff = staff.filter((member) => {
    const name = member.name || '';
    const email = member.email || '';
    return (
      (name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterDesignation === '' || member.designation === filterDesignation)
    );
  });

  return (
    <div className="admin-wrapper">
      <Sidebar />
      <div className="main-content">
        <AdminHeader />
        <div className="content-area">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">
                <i className="fas fa-users text-primary me-2"></i>
                All Staff
              </h5>
              <button className="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#addStaffModal">
                <i className="fas fa-plus me-2"></i>Add New Staff
              </button>
            </div>
            <div className="card-body">
              <div className="search-filter-bar mb-3">
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-search"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control search-input"
                        placeholder="Search staff..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <select
                      className="form-select"
                      value={filterDesignation}
                      onChange={(e) => setFilterDesignation(e.target.value)}
                    >
                      <option value="">All designations</option>
                      <option value="Principal">Principal</option>
                      <option value="Senior Teacher">Senior Teacher</option>
                      <option value="Head Teacher">Head Teacher</option>
                      <option value="Teacher">Teacher</option>
                    </select>
                  </div>
                  <div className="col-md-2">
                    <button className="btn btn-outline-primary w-100" onClick={fetchStaff}>
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-hover" id="staffTable">
                  <thead>
                    <tr>
                      <th>Staff Name</th>
                      <th>Designation</th>
                      <th>Join Date</th>
                      <th>Contact</th>
                      <th>Email</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStaff.map((member) => (
                      <tr key={member._id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="user-avatar bg-primary me-2" style={{ width: '35px', height: '35px', fontSize: '0.8rem' }}>
                              {member.name ? member.name.charAt(0) : ''}
                            </div>
                            <div>
                              <div className="fw-semibold">{member.name}</div>
                              <small className="text-muted">{member.designation}</small>
                            </div>
                          </div>
                        </td>
                        <td>{member.designation}</td>
                        <td>{new Date(member.date_of_join).toLocaleDateString()}</td>
                        <td>{member.mobile_no}</td>
                        <td>{member.email}</td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button className="btn btn-outline-primary" onClick={() => handleViewDetails(member)}>
                              <i className="fas fa-eye"></i>
                            </button>
                            <button className="btn btn-outline-warning" onClick={() => handleEdit(member)}>
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => handleDelete(member._id)}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
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

      {/* Add Staff Modal */}
      <div className="modal fade" id="addStaffModal" tabIndex="-1" aria-labelledby="addStaffModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addStaffModalLabel">Add New Staff Member</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddStaff}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Name *</label>
                      <input type="text" className="form-control" name="name" value={newStaffData.name} onChange={handleNewStaffChange} required />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Date of Birth *</label>
                      <input type="date" className="form-control" name="dob" value={newStaffData.dob} onChange={handleNewStaffChange} required />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Gender *</label>
                      <select className="form-select" name="gender" value={newStaffData.gender} onChange={handleNewStaffChange} required>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Qualification *</label>
                      <input type="text" className="form-control" name="qualification" value={newStaffData.qualification} onChange={handleNewStaffChange} required />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Experience</label>
                      <input type="text" className="form-control" name="experience" value={newStaffData.experience} onChange={handleNewStaffChange} />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Date of Join *</label>
                      <input type="date" className="form-control" name="date_of_join" value={newStaffData.date_of_join} onChange={handleNewStaffChange} required />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Mobile No *</label>
                      <input type="tel" className="form-control" name="mobile_no" value={newStaffData.mobile_no} onChange={handleNewStaffChange} required />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Email Address *</label>
                      <input type="email" className="form-control" name="email" value={newStaffData.email} onChange={handleNewStaffChange} required />
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Address *</label>
                  <textarea className="form-control" rows="3" name="address" value={newStaffData.address} onChange={handleNewStaffChange} required></textarea>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Designation</label>
                      <input type="text" className="form-control" name="designation" value={newStaffData.designation} onChange={handleNewStaffChange} />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Class Teacher Of</label>
                      <input type="text" className="form-control" name="class_teacher_of" value={newStaffData.class_teacher_of} onChange={handleNewStaffChange} />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Subjects Taught</label>
                      <input type="text" className="form-control" name="subjects_taught" value={newStaffData.subjects_taught} onChange={handleNewStaffChange} />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Salary</label>
                      <input type="number" className="form-control" name="salary" value={newStaffData.salary} onChange={handleNewStaffChange} />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                  <button type="submit" className="btn btn-primary">Add Staff Member</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {isViewModalOpen && (
        <ViewStaffModal staff={selectedStaff} onClose={handleCloseModal} />
      )}

      {isEditModalOpen && (
        <EditStaffModal staff={selectedStaff} onSave={handleUpdateStaff} onClose={() => setIsEditModalOpen(false)} />
      )}
    </div>
  );
}

export default StaffDetailsPage;