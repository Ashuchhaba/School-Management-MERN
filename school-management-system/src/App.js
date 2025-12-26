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
import ReportsPage from './pages/ReportsPage';
import StudentReportPage from './pages/StudentReportPage';
import StaffReportPage from './pages/StaffReportPage';
import StudentFeesReportPage from './pages/StudentFeesReportPage';
import StaffSalaryReportPage from './pages/StaffSalaryReportPage';
import StudentAttendanceReportPage from './pages/StudentAttendanceReportPage';
import ProtectedRoute from './components/ProtectedRoute';
import StaffDashboardPage from './pages/StaffDashboardPage';
import StaffProfilePage from './pages/StaffProfilePage';
import StaffStudentListPage from './pages/StaffStudentListPage';
import StaffAttendancePage from './pages/StaffAttendancePage';
import StaffHomeworkPage from './pages/StaffHomeworkPage';
import StaffExamsPage from './pages/StaffExamsPage';
import StaffLeavePage from './pages/StaffLeavePage';
import StaffSalaryPage from './pages/StaffSalaryPage';
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
        
        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admissions" element={<AdmissionsPage />} />
          <Route path="/students" element={<StudentDetailsPage />} />
          <Route path="/staff" element={<StaffDetailsPage />} />
          <Route path="/fees" element={<FeesManagementPage />} />
          <Route path="/staff-payment" element={<StaffPaymentPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/admin/reports/students" element={<StudentReportPage />} />
          <Route path="/admin/reports/staff" element={<StaffReportPage />} />
          <Route path="/admin/reports/fees" element={<StudentFeesReportPage />} />
          <Route path="/admin/reports/salary" element={<StaffSalaryReportPage />} />
          <Route path="/admin/reports/attendance" element={<StudentAttendanceReportPage />} />
        </Route>

        {/* Staff Routes */}
        <Route element={<ProtectedRoute allowedRoles={['staff']} />}>
          <Route path="/staff/dashboard" element={<StaffDashboardPage />} />
          <Route path="/staff/profile" element={<StaffProfilePage />} />
          <Route path="/staff/students" element={<StaffStudentListPage />} />
          <Route path="/staff/attendance" element={<StaffAttendancePage />} />
          <Route path="/staff/homework" element={<StaffHomeworkPage />} />
          <Route path="/staff/exams" element={<StaffExamsPage />} />
          <Route path="/staff/leave" element={<StaffLeavePage />} />
          <Route path="/staff/salary" element={<StaffSalaryPage />} />
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