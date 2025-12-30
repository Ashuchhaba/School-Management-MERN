import React, { useState, useEffect } from 'react';

function EditStaffModal({ staff, onSave, onClose }) {
  const [formData, setFormData] = useState({ ...staff });

  useEffect(() => {
    setFormData({ ...staff });
  }, [staff]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!staff) {
    return null;
  }

  return (
    <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Staff Details</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Date of Birth</label>
                    <input type="date" className="form-control" name="dob" value={formData.dob ? new Date(formData.dob).toISOString().split('T')[0] : ''} onChange={handleChange} />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Gender</label>
                    <select className="form-select" name="gender" value={formData.gender} onChange={handleChange}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Qualification</label>
                    <input type="text" className="form-control" name="qualification" value={formData.qualification} onChange={handleChange} />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Experience</label>
                    <input type="text" className="form-control" name="experience" value={formData.experience} onChange={handleChange} />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Date of Join</label>
                    <input type="date" className="form-control" name="date_of_join" value={formData.date_of_join ? new Date(formData.date_of_join).toISOString().split('T')[0] : ''} onChange={handleChange} />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Mobile No</label>
                    <input type="text" className="form-control" name="mobile_no" value={formData.mobile_no} onChange={handleChange} />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} />
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Address</label>
                <textarea className="form-control" name="address" rows="3" value={formData.address} onChange={handleChange}></textarea>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Designation</label>
                    <input type="text" className="form-control" name="designation" value={formData.designation} onChange={handleChange} />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Class Teacher Of</label>
                    <input type="text" className="form-control" name="class_teacher_of" value={formData.class_teacher_of} onChange={handleChange} />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Subjects Taught</label>
                    <input type="text" className="form-control" name="subjects_taught" value={formData.subjects_taught} onChange={handleChange} />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Salary</label>
                    <input type="number" className="form-control" name="salary" value={formData.salary} onChange={handleChange} />
                  </div>
                </div>
              </div>
              <div className="row">
                 <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select 
                        className="form-select" 
                        name="is_active" 
                        value={formData.is_active} 
                        onChange={(e) => setFormData({...formData, is_active: e.target.value === 'true'})}
                    >
                      <option value={true}>Active</option>
                      <option value={false}>Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditStaffModal;
