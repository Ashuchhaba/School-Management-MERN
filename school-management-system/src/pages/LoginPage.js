import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePopup } from '../contexts/PopupContext';

function LoginPage() {
  const [role, setRole] = useState('Admin'); // Admin, Staff, Student
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, user } = useAuth(); // Get user from auth context
  const { showPopup } = usePopup();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const loggedInUser = await login(identifier, password, role);
      if (loggedInUser.role === 'admin') {
        navigate('/dashboard');
      } else if (loggedInUser.role === 'staff') {
        if (loggedInUser.isFirstLogin) {
            navigate('/staff/profile', { state: { changePassword: true } });
        } else {
            navigate('/staff/dashboard');
        }
      } else {
        // Handle other roles or default redirect
        navigate('/');
      }
    } catch (error) {
      showPopup('Invalid credentials. Please try again.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const renderIdentifierLabel = () => {
    switch (role) {
      case 'Staff':
        return 'Email';
      case 'Student':
        return 'GR No.';
      case 'Admin':
      default:
        return 'Username';
    }
  };

  return (
    <div className="login-body">
      <div className="login-container">
        <div className="container">
          <div className="row justify-content-center align-items-center min-vh-100">
            <div className="col-md-6 col-lg-5">
              <div className="login-card">
                <div className="login-header text-center mb-4">
                  <div className="school-logo mb-3">
                    <i className="fas fa-graduation-cap text-primary" style={{ fontSize: '3rem' }}></i>
                  </div>
                  <h2 className="text-primary fw-bold">SATYAM STARS</h2>
                  <p className="text-muted">International School</p>
                  <div className="btn-group my-3">
                    <button type="button" className={`btn ${role === 'Admin' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setRole('Admin')}>Admin</button>
                    <button type="button" className={`btn ${role === 'Staff' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setRole('Staff')}>Staff</button>
                    <button type="button" className={`btn ${role === 'Student' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setRole('Student')}>Student</button>
                  </div>
                  <h4 className="mt-3">{role} Portal</h4>
                </div>

                <form onSubmit={handleLogin} className="login-form">
                  <div className="mb-3">
                    <label htmlFor="identifier" className="form-label">
                      <i className="fas fa-user me-2"></i>{renderIdentifierLabel()}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="identifier"
                      name="identifier"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      <i className="fas fa-lock me-2"></i>Password
                    </label>
                    <div className="input-group">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button className="btn btn-outline-secondary" type="button" onClick={togglePasswordVisibility}>
                        <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                      </button>
                    </div>
                  </div>

                  <div className="mb-3 form-check">
                    <input type="checkbox" className="form-check-input" id="rememberMe" />
                    <label className="form-check-label" htmlFor="rememberMe">
                      Remember me
                    </label>
                  </div>

                  <button type="submit" className="btn btn-primary w-100 mb-3">
                    <i className="fas fa-sign-in-alt me-2"></i>Login as {role}
                  </button>

                  <div className="text-center">
                    <a href="/" className="text-muted">Forgot Password?</a>
                  </div>
                </form>

                <div className="login-footer text-center mt-4">
                  <small className="text-muted">
                    <Link to="/" className="text-decoration-none">
                      <i className="fas fa-arrow-left me-1"></i>Back to Website
                    </Link>
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;