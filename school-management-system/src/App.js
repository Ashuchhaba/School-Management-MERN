import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PopupProvider } from './contexts/PopupContext';
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
import './styles/PopupModal.css';

function App() {
  return (
    <PopupProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admissions" element={<AdmissionsPage />} />
          <Route path="/students" element={<StudentDetailsPage />} />
          <Route path="/staff" element={<StaffDetailsPage />} />
          <Route path="/fees" element={<FeesManagementPage />} />
          <Route path="/staff-payment" element={<StaffPaymentPage />} />
        </Routes>
      </Router>
    </PopupProvider>
  );
}

export default App;