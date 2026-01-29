import React, { useState, useEffect } from 'react';
import StudentLayout from '../components/StudentLayout';
import api from '../api';
import { useLocation } from 'react-router-dom';

function StudentProfilePage() {
  const [student, setStudent] = useState(null);
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
        alert("Please change your password for the first login.");
    }
  }, [location.state]);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/api/students/profile');
      setStudent(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

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
      await api.put('/api/students/change-password', {
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
    <StudentLayout>
      <div className="container-fluid">
        <h2 className="text-primary mb-4">My Profile</h2>
        {loading ? (
          <p>Loading...</p>
        ) : student ? (
          <div className="row">
            <div className="col-md-8">
              <div className="card mb-4">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Personal Details</h5>
                  <button 
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                  >
                    {showPasswordForm ? 'Cancel' : 'Change Password'}
                  </button>
                </div>
                <div className="card-body">
                  {showPasswordForm && (
                    <div className="alert alert-light border mb-4">
                      <h6>Change Password</h6>
                      <form onSubmit={submitPasswordChange}>
                        <div className="mb-3">
                          <label className="form-label">Current Password</label>
                          <input type="password" className="form-control" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} required />
                        </div>
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="form-label">New Password</label>
                            <input type="password" className="form-control" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} required />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Confirm New Password</label>
                            <input type="password" className="form-control" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} required />
                          </div>
                        </div>
                        {passwordError && <div className="text-danger mb-3">{passwordError}</div>}
                        <button type="submit" className="btn btn-primary">Update Password</button>
                      </form>
                    </div>
                  )}

                  <div className="row mb-3">
                    <div className="col-md-6"><strong>Name:</strong> {student.name}</div>
                    <div className="col-md-6"><strong>Admission No (GR):</strong> {student.gr_no}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6"><strong>Class:</strong> {student.class}</div>
                    <div className="col-md-6"><strong>Roll No:</strong> {student.roll_no}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6"><strong>DOB:</strong> {new Date(student.dob).toLocaleDateString()}</div>
                    <div className="col-md-6"><strong>Gender:</strong> {student.gender}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6"><strong>Father's Name:</strong> {student.father_name}</div>
                    <div className="col-md-6"><strong>Mother's Name:</strong> {student.mother_name}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6"><strong>Mobile 1:</strong> {student.mobile_no1}</div>
                    <div className="col-md-6"><strong>Mobile 2:</strong> {student.mobile_no2 || 'N/A'}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-12"><strong>Address:</strong> {student.address}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
                {/* Could add quick stats or photo here */}
                <div className="card text-center p-4">
                    <div className="display-1 text-secondary mb-3">
                        <i className="fas fa-user-circle"></i>
                    </div>
                    <h4>{student.name}</h4>
                    <p className="text-muted">{student.class} | Roll: {student.roll_no}</p>
                </div>
            </div>
          </div>
        ) : (
          <p>Profile not found.</p>
        )}
      </div>
    </StudentLayout>
  );
}

export default StudentProfilePage;
