import React, { useState } from 'react';
import api from '../api';
import { usePopup } from '../contexts/PopupContext';

function ViewStaffModal({ staff, onClose }) {
  const [newPassword, setNewPassword] = useState(null);
  const [resetting, setResetting] = useState(false);
  const { showPopup, showConfirm } = usePopup();

  if (!staff) {
    return null;
  }

  const handleResetPassword = async () => {
    showConfirm('Are you sure you want to reset the password for this staff member?', async () => {
        setResetting(true);
        try {
            const url = `/api/staff/reset-password/${staff._id}`;
            console.log('Calling Reset Password URL:', url);
            const res = await api.put(url);
            setNewPassword(res.data.newPassword);
            showPopup('Password reset successfully!');
        } catch (err) {
            console.error('Error resetting password full object:', err);
            console.error('Error response data:', err.response?.data);
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
            <h5 className="modal-title">Staff Details</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form>
              <h6 className="text-primary mb-3">Personal Information</h6>
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

              <hr className="my-4" />
              <h6 className="text-primary mb-3">Login Details</h6>
              <div className="row align-items-center">
                  <div className="col-md-6">
                      <div className="mb-3">
                          <label className="form-label">Username / Email</label>
                          <input type="text" className="form-control" value={staff.email} disabled />
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
                              Password reset successfully! Please copy and share this with the staff.
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

export default ViewStaffModal;
