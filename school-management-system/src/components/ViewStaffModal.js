import React from 'react';

function ViewStaffModal({ staff, onClose }) {
  if (!staff) {
    return null;
  }

  return (
    <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Staff Details</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input type="text" className="form-control" value={staff.name} disabled />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Date of Birth</label>
                    <input type="text" className="form-control" value={new Date(staff.dob).toLocaleDateString()} disabled />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Gender</label>
                    <input type="text" className="form-control" value={staff.gender} disabled />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Qualification</label>
                    <input type="text" className="form-control" value={staff.qualification} disabled />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Experience</label>
                    <input type="text" className="form-control" value={staff.experience} disabled />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Date of Join</label>
                    <input type="text" className="form-control" value={new Date(staff.date_of_join).toLocaleDateString()} disabled />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Mobile No</label>
                    <input type="text" className="form-control" value={staff.mobile_no} disabled />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" value={staff.email} disabled />
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Address</label>
                <textarea className="form-control" rows="3" value={staff.address} disabled></textarea>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Designation</label>
                    <input type="text" className="form-control" value={staff.designation} disabled />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Class Teacher Of</label>
                    <input type="text" className="form-control" value={staff.class_teacher_of} disabled />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Subjects Taught</label>
                    <input type="text" className="form-control" value={staff.subjects_taught} disabled />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Salary</label>
                    <input type="text" className="form-control" value={staff.salary} disabled />
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewStaffModal;
