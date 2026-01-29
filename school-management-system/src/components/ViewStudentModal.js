import React, { useState } from 'react';
import api from '../api';
import { usePopup } from '../contexts/PopupContext';

function ViewStudentModal({ student, onClose }) {
  const [newPassword, setNewPassword] = useState(null);
  const [resetting, setResetting] = useState(false);
  const { showPopup, showConfirm } = usePopup();

  if (!student) {
    return null;
  }

  const handleResetPassword = async () => {
    showConfirm('Are you sure you want to reset the password for this student?', async () => {
        setResetting(true);
        try {
            const res = await api.put(`/api/students/reset-password/${student._id}`);
            setNewPassword(res.data.newPassword);
            showPopup('Password reset successfully!');
        } catch (err) {
            console.error('Error resetting password:', err);
            showPopup('Failed to reset password. ' + (err.response?.data?.message || err.message));
        } finally {
            setResetting(false);
        }
    });
  };

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
              <h6 className="text-primary mb-3">Personal Information</h6>
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

              <hr className="my-4" />
              <h6 className="text-primary mb-3">Login Details</h6>
              <div className="row align-items-center">
                  <div className="col-md-6">
                      <div className="mb-3">
                          <label className="form-label">Username (Admission No)</label>
                          <input type="text" className="form-control" value={student.gr_no} disabled />
                      </div>
                  </div>
                  <div className="col-md-6">
                      <label className="form-label">Password</label>
                      <div className="input-group">
                          <input 
                            type="text" 
                            className="form-control" 
                            value={newPassword || "********"} 
                            disabled={!newPassword} 
                            readOnly 
                          />
                          <button 
                            className="btn btn-outline-danger" 
                            type="button" 
                            onClick={handleResetPassword}
                            disabled={resetting}
                          >
                            {resetting ? 'Resetting...' : 'Reset Password'}
                          </button>
                      </div>
                      {newPassword && (
                          <small className="text-success mt-1 d-block">
                              <i className="fas fa-check-circle me-1"></i> 
                              Password reset successfully! Please copy and share this with the student.
                          </small>
                      )}
                      {!newPassword && <small className="text-muted">Password is hidden for security.</small>}
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

export default ViewStudentModal;
