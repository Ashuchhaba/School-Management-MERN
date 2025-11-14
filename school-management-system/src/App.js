import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import StudentDetailsPage from './pages/StudentDetailsPage';
import StaffDetailsPage from './pages/StaffDetailsPage';
import FeesManagementPage from './pages/FeesManagementPage';
import AdmissionsPage from './pages/AdmissionsPage';
import StaffPaymentPage from './pages/StaffPaymentPage';
import './styles/style-blue.css';
import './styles/admin-style.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/admissions" element={<AdmissionsPage />} />
        <Route path="/student-details" element={<StudentDetailsPage />} />
        <Route path="/staff-details" element={<StaffDetailsPage />} />
        <Route path="/fees-management" element={<FeesManagementPage />} />
        <Route path="/staff-payment" element={<StaffPaymentPage />} />
      </Routes>
    </Router>
  );
}

export default App;