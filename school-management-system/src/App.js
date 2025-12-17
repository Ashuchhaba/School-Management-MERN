import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PopupProvider } from './contexts/PopupContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import StudentDetailsPage from './pages/StudentDetailsPage';
import StaffDetailsPage from './pages/StaffDetailsPage';
import FeesManagementPage from './pages/FeesManagementPage';
import AdmissionsPage from './pages/AdmissionsPage';
import StaffPaymentPage from './pages/StaffPaymentPage';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/style-blue.css';
import './styles/admin-style.css';
import './styles/PopupModal.css';

const AppContent = () => {
  const { revalidateUser } = useAuth();

  useEffect(() => {
    const handlePageShow = (event) => {
      // The persisted property is true if the page is from the bfcache
      if (event.persisted) {
        revalidateUser();
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    return () => {
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, [revalidateUser]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admissions" element={<AdmissionsPage />} />
          <Route path="/students" element={<StudentDetailsPage />} />
          <Route path="/staff" element={<StaffDetailsPage />} />
          <Route path="/fees" element={<FeesManagementPage />} />
          <Route path="/staff-payment" element={<StaffPaymentPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <PopupProvider>
        <AppContent />
      </PopupProvider>
    </AuthProvider>
  );
}

export default App;