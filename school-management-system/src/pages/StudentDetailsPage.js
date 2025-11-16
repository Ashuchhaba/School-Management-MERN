import React, { useState, useEffect } from 'react';
import api from '../api';
import Sidebar from '../components/Sidebar';
import AdminHeader from '../components/AdminHeader';
import ViewStudentModal from '../components/ViewStudentModal';
import EditStudentModal from '../components/EditStudentModal';

function StudentDetailsPage() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [newStudentData, setNewStudentData] = useState({
    gr_no: '',
    udise_no: '',
    pan_no: '',
    name: '',
    dob: '',
    gender: '',
    religion: '',
    caste: '',
    date_of_join: '',
    class: '',
    roll_no: '',
    father_name: '',
    mother_name: '',
    mobile_no1: '',
    mobile_no2: '',
    address: '',
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get('/api/students');
      setStudents(res.data);
    } catch (err) {
      console.error(err);
      alert('Error fetching students. Please check the console for details.');
    }
  };

  const handleNewStudentChange = (e) => {
    setNewStudentData({ ...newStudentData, [e.target.name]: e.target.value });
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/students', newStudentData);
      console.log(res.data);
      alert('Student added successfully!');
      fetchStudents(); // Refresh the list
      // Close modal - Bootstrap modals can be closed programmatically
      // For now, we'll just reset the form
      setNewStudentData({
        gr_no: '',
        udise_no: '',
        pan_no: '',
        name: '',
        dob: '',
        gender: '',
        religion: '',
        caste: '',
        date_of_join: '',
        class: '',
        roll_no: '',
        father_name: '',
        mother_name: '',
        mobile_no1: '',
        mobile_no2: '',
        address: '',
      });
      const modal = document.getElementById('addStudentModal');
      const modalInstance = window.bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
    } catch (err) {
      console.error(err.response.data);
      alert('Error adding student. Please check the console for details.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await api.delete(`/api/students/${id}`);
        alert('Student deleted successfully!');
        fetchStudents(); // Refresh the list
      } catch (err) {
        console.error(err);
        alert('Error deleting student. Please check the console for details.');
      }
    }
  };

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setIsViewModalOpen(true);
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };

  const handleUpdateStudent = async (updatedStudent) => {
    try {
      const res = await api.put(`/api/students/${updatedStudent._id}`, updatedStudent);
      console.log(res.data);
      alert('Student updated successfully!');
      fetchStudents(); // Refresh the list
      setIsEditModalOpen(false);
      setSelectedStudent(null);
    } catch (err) {
      console.error(err.response.data);
      alert('Error updating student. Please check the console for details.');
    }
  };

  const handleCloseModal = () => {
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedStudent(null);
  };

  const filteredStudents = students.filter((student) => {
    const name = student.name || '';
    const roll_no = student.roll_no || '';
    return (
      (name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        roll_no.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterClass === '' || student.class === filterClass) &&
      (filterGender === '' || student.gender === filterGender)
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
                <i className="fas fa-user-graduate text-primary me-2"></i>
                All Students
              </h5>
              <button className="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#addStudentModal">
                <i className="fas fa-plus me-2"></i>Add New Student
              </button>
            </div>
            <div className="card-body">
              <div className="search-filter-bar mb-3">
                <div className="row g-3">
                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by Name or Roll No"
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
                      <option value="">Filter by Class</option>
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
                      value={filterGender}
                      onChange={(e) => setFilterGender(e.target.value)}
                    >
                      <option value="">Filter by Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="col-md-2">
                    <button className="btn btn-outline-primary w-100" onClick={fetchStudents}>
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-hover table-striped">
                  <thead>
                    <tr>
                      <th>GR No</th>
                      <th>Roll No</th>
                      <th>Name</th>
                      <th>Class</th>
                      <th>Gender</th>
                      <th>DOB</th>
                      <th>Father Name</th>
                      <th>Contact</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr key={student._id}>
                        <td>{student.gr_no}</td>
                        <td>{student.roll_no}</td>
                        <td>{student.name}</td>
                        <td>{student.class}</td>
                        <td>{student.gender}</td>
                        <td>{new Date(student.dob).toLocaleDateString()}</td>
                        <td>{student.father_name}</td>
                        <td>{student.mobile_no1}</td>
                        <td>
                          <button className="btn btn-info btn-sm me-2" onClick={() => handleViewDetails(student)}>
                            <i className="fas fa-eye"></i>
                          </button>
                          <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(student)}>
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(student._id)}
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

      {/* Add Student Modal */}
      <div className="modal fade" id="addStudentModal" tabIndex="-1" aria-labelledby="addStudentModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addStudentModalLabel">Add New Student</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddStudent}>
                <div className="row">
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">GR Number</label>
                      <input type="text" className="form-control" name="gr_no" value={newStudentData.gr_no} onChange={handleNewStudentChange} />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">UDISE Number</label>
                      <input type="text" className="form-control" name="udise_no" value={newStudentData.udise_no} onChange={handleNewStudentChange} />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">PAN Number</label>
                      <input type="text" className="form-control" name="pan_no" value={newStudentData.pan_no} onChange={handleNewStudentChange} />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">Student Name *</label>
                      <input type="text" className="form-control" name="name" value={newStudentData.name} onChange={handleNewStudentChange} required />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">Date of Birth *</label>
                      <input type="date" className="form-control" name="dob" value={newStudentData.dob} onChange={handleNewStudentChange} required />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">Gender *</label>
                      <select className="form-select" name="gender" value={newStudentData.gender} onChange={handleNewStudentChange} required>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">Religion</label>
                      <input type="text" className="form-control" name="religion" value={newStudentData.religion} onChange={handleNewStudentChange} />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">Caste</label>
                      <input type="text" className="form-control" name="caste" value={newStudentData.caste} onChange={handleNewStudentChange} />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">Date of Join *</label>
                      <input type="date" className="form-control" name="date_of_join" value={newStudentData.date_of_join} onChange={handleNewStudentChange} required />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Class *</label>
                      <select className="form-select" name="class" value={newStudentData.class} onChange={handleNewStudentChange} required>
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
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Roll Number *</label>
                      <input type="text" className="form-control" name="roll_no" value={newStudentData.roll_no} onChange={handleNewStudentChange} required />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Father's Name *</label>
                      <input type="text" className="form-control" name="father_name" value={newStudentData.father_name} onChange={handleNewStudentChange} required />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Mother's Name *</label>
                      <input type="text" className="form-control" name="mother_name" value={newStudentData.mother_name} onChange={handleNewStudentChange} required />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Mobile Number 1 *</label>
                      <input type="text" className="form-control" name="mobile_no1" value={newStudentData.mobile_no1} onChange={handleNewStudentChange} required />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Mobile Number 2</label>
                      <input type="text" className="form-control" name="mobile_no2" value={newStudentData.mobile_no2} onChange={handleNewStudentChange} />
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Address *</label>
                  <textarea className="form-control" rows="3" name="address" value={newStudentData.address} onChange={handleNewStudentChange} required></textarea>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Student</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {isViewModalOpen && (
        <ViewStudentModal student={selectedStudent} onClose={handleCloseModal} />
      )}

      {isEditModalOpen && (
        <EditStudentModal student={selectedStudent} onSave={handleUpdateStudent} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default StudentDetailsPage;