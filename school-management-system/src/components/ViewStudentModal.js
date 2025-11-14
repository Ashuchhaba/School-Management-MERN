import React from 'react';

function ViewStudentModal({ student, onClose }) {
  if (!student) {
    return null;
  }

  return (
    <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Student Details</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="row">
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">GR No</label>
                    <input type="text" className="form-control" value={student.gr_no} disabled />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">UDISE No</label>
                    <input type="text" className="form-control" value={student.udise_no} disabled />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">PAN No</label>
                    <input type="text" className="form-control" value={student.pan_no} disabled />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input type="text" className="form-control" value={student.name} disabled />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Date of Birth</label>
                    <input type="text" className="form-control" value={new Date(student.dob).toLocaleDateString()} disabled />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">Gender</label>
                    <input type="text" className="form-control" value={student.gender} disabled />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">Religion</label>
                    <input type="text" className="form-control" value={student.religion} disabled />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">Caste</label>
                    <input type="text" className="form-control" value={student.caste} disabled />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">Class</label>
                    <input type="text" className="form-control" value={student.class} disabled />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">Roll No</label>
                    <input type="text" className="form-control" value={student.roll_no} disabled />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">Date of Join</label>
                    <input type="text" className="form-control" value={new Date(student.date_of_join).toLocaleDateString()} disabled />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Father's Name</label>
                    <input type="text" className="form-control" value={student.father_name} disabled />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Mother's Name</label>
                    <input type="text" className="form-control" value={student.mother_name} disabled />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Mobile No 1</label>
                    <input type="text" className="form-control" value={student.mobile_no1} disabled />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Mobile No 2</label>
                    <input type="text" className="form-control" value={student.mobile_no2} disabled />
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Address</label>
                <textarea className="form-control" rows="3" value={student.address} disabled></textarea>
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

export default ViewStudentModal;
