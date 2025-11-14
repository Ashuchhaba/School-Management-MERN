import React, { useState, useEffect } from 'react';

function EditStudentModal({ student, onSave, onClose }) {
  const [formData, setFormData] = useState({ ...student });

  useEffect(() => {
    setFormData({ ...student });
  }, [student]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!student) {
    return null;
  }

  return (
    <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Student Details</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">GR No</label>
                    <input type="text" className="form-control" name="gr_no" value={formData.gr_no} onChange={handleChange} />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">UDISE No</label>
                    <input type="text" className="form-control" name="udise_no" value={formData.udise_no} onChange={handleChange} />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">PAN No</label>
                    <input type="text" className="form-control" name="pan_no" value={formData.pan_no} onChange={handleChange} />
                  </div>
                </div>
              </div>
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
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">Gender</label>
                    <select className="form-select" name="gender" value={formData.gender} onChange={handleChange}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">Religion</label>
                    <input type="text" className="form-control" name="religion" value={formData.religion} onChange={handleChange} />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">Caste</label>
                    <input type="text" className="form-control" name="caste" value={formData.caste} onChange={handleChange} />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">Class</label>
                    <input type="text" className="form-control" name="class" value={formData.class} onChange={handleChange} />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">Roll No</label>
                    <input type="text" className="form-control" name="roll_no" value={formData.roll_no} onChange={handleChange} />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">Date of Join</label>
                    <input type="date" className="form-control" name="date_of_join" value={formData.date_of_join ? new Date(formData.date_of_join).toISOString().split('T')[0] : ''} onChange={handleChange} />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Father's Name</label>
                    <input type="text" className="form-control" name="father_name" value={formData.father_name} onChange={handleChange} />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Mother's Name</label>
                    <input type="text" className="form-control" name="mother_name" value={formData.mother_name} onChange={handleChange} />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Mobile No 1</label>
                    <input type="text" className="form-control" name="mobile_no1" value={formData.mobile_no1} onChange={handleChange} />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Mobile No 2</label>
                    <input type="text" className="form-control" name="mobile_no2" value={formData.mobile_no2} onChange={handleChange} />
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Address</label>
                <textarea className="form-control" name="address" rows="3" value={formData.address} onChange={handleChange}></textarea>
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

export default EditStudentModal;
