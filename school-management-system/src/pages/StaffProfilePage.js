import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import StaffLayout from '../components/StaffLayout';
import api from '../api';

function StaffProfilePage() {
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const location = useLocation();

  useEffect(() => {
    if (location.state?.changePassword) {
        setShowPasswordForm(true);
        // Optional: clear state or just let it be. 
        // Showing an alert might be good too.
        alert("Please change your password for the first login.");
    }
  }, [location.state]);

  useEffect(() => {
    const fetchStaffProfile = async () => {
      try {
        const { data } = await api.get('/api/staff/profile');
        setStaff(data);
      } catch (error) {
        console.error('Error fetching staff profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffProfile();
  }, []);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
    setPasswordError('');
  };

  const submitPasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
        setPasswordError('Password must be at least 6 characters long');
        return;
    }

    try {
      await api.put('/api/staff/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      alert('Password changed successfully');
      setShowPasswordForm(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordError(error.response?.data || 'Failed to change password');
    }
  };

  return (
    <StaffLayout>
      <div className="container-fluid" style={{ paddingTop: '15px', paddingBottom: '15px' }}>
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card shadow-sm">
              <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0 text-primary">
                  <i className="fas fa-user-circle me-2"></i>
                  My Profile
                </h5>
                <button 
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                >
                  <i className="fas fa-key me-2"></i>
                  {showPasswordForm ? 'Cancel Change Password' : 'Change Password'}
                </button>
              </div>
              <div className="card-body p-4">
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : staff ? (
                  <>
                    <div className="d-flex align-items-center mb-4 pb-4 border-bottom">
                      <div 
                        className="user-avatar bg-primary text-white d-flex align-items-center justify-content-center rounded-circle me-3" 
                        style={{ width: '80px', height: '80px', fontSize: '2rem' }}
                      >
                        {staff.name ? staff.name.charAt(0).toUpperCase() : 'S'}
                      </div>
                      <div>
                        <h3 className="mb-1">{staff.name}</h3>
                        <p className="text-muted mb-0">{staff.designation || 'Staff Member'}</p>
                        <span className="badge bg-success mt-1">Active</span>
                      </div>
                    </div>

                    {showPasswordForm && (
                      <div className="card mb-4 bg-light border-0">
                        <div className="card-body">
                          <h6 className="card-title mb-3">Change Password</h6>
                          <form onSubmit={submitPasswordChange}>
                            <div className="row">
                              <div className="col-md-4 mb-3">
                                <label className="form-label small">Current Password</label>
                                <input 
                                  type="password" 
                                  className="form-control" 
                                  name="currentPassword" 
                                  value={passwordData.currentPassword} 
                                  onChange={handlePasswordChange} 
                                  required 
                                />
                              </div>
                              <div className="col-md-4 mb-3">
                                <label className="form-label small">New Password</label>
                                <input 
                                  type="password" 
                                  className="form-control" 
                                  name="newPassword" 
                                  value={passwordData.newPassword} 
                                  onChange={handlePasswordChange} 
                                  required 
                                />
                              </div>
                              <div className="col-md-4 mb-3">
                                <label className="form-label small">Confirm New Password</label>
                                <input 
                                  type="password" 
                                  className="form-control" 
                                  name="confirmPassword" 
                                  value={passwordData.confirmPassword} 
                                  onChange={handlePasswordChange} 
                                  required 
                                />
                              </div>
                            </div>
                            {passwordError && <div className="text-danger small mb-3">{passwordError}</div>}
                            <div className="d-flex justify-content-end">
                              <button type="button" className="btn btn-secondary me-2" onClick={() => setShowPasswordForm(false)}>Cancel</button>
                              <button type="submit" className="btn btn-success">Save New Password</button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}

                    <form>
                      <h6 className="text-uppercase text-muted mb-3">Personal Information</h6>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label text-secondary small">Date of Birth</label>
                          <input type="text" className="form-control" value={new Date(staff.dob).toLocaleDateString()} disabled />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label text-secondary small">Gender</label>
                          <input type="text" className="form-control" value={staff.gender} disabled />
                        </div>
                      </div>

                      <h6 className="text-uppercase text-muted mb-3 mt-2">Contact Details</h6>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label text-secondary small">Email Address</label>
                          <input type="email" className="form-control" value={staff.email} disabled />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label text-secondary small">Mobile Number</label>
                          <input type="text" className="form-control" value={staff.mobile_no} disabled />
                        </div>
                        <div className="col-12 mb-3">
                          <label className="form-label text-secondary small">Address</label>
                          <textarea className="form-control" rows="2" value={staff.address} disabled></textarea>
                        </div>
                      </div>

                      <h6 className="text-uppercase text-muted mb-3 mt-2">Professional Details</h6>
                      <div className="row">
                        <div className="col-md-4 mb-3">
                          <label className="form-label text-secondary small">Qualification</label>
                          <input type="text" className="form-control" value={staff.qualification} disabled />
                        </div>
                        <div className="col-md-4 mb-3">
                          <label className="form-label text-secondary small">Experience</label>
                          <input type="text" className="form-control" value={staff.experience} disabled />
                        </div>
                        <div className="col-md-4 mb-3">
                          <label className="form-label text-secondary small">Date of Joining</label>
                          <input type="text" className="form-control" value={new Date(staff.date_of_join).toLocaleDateString()} disabled />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label text-secondary small">Assigned Classes</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            value={staff.assigned_classes && staff.assigned_classes.length > 0 ? staff.assigned_classes.join(', ') : 'None'} 
                            disabled 
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label text-secondary small">Subjects Taught</label>
                          <input type="text" className="form-control" value={staff.subjects_taught || 'N/A'} disabled />
                        </div>
                      </div>
                    </form>
                  </>
                ) : (
                  <div className="alert alert-danger" role="alert">
                    Could not load profile information.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </StaffLayout>
  );
}

export default StaffProfilePage;
