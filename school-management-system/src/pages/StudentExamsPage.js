import React, { useState, useEffect } from 'react';
import StudentLayout from '../components/StudentLayout';
import api from '../api';

function StudentExamsPage() {
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('results'); // results or schedule

  useEffect(() => {
    fetchMarks();
  }, []);

  const fetchMarks = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/exams/my-marks');
      setMarks(data);
    } catch (error) {
      console.error('Error fetching marks:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadReportCard = () => {
      alert('Report Card download coming soon!');
  };

  return (
    <StudentLayout>
      <div className="container-fluid">
        <h2 className="text-primary mb-4">Exams & Results</h2>

        <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
                <button 
                    className={`nav-link ${activeTab === 'results' ? 'active' : ''}`}
                    onClick={() => setActiveTab('results')}
                >
                    Results
                </button>
            </li>
            <li className="nav-item">
                <button 
                    className={`nav-link ${activeTab === 'schedule' ? 'active' : ''}`}
                    onClick={() => setActiveTab('schedule')}
                >
                    Exam Schedule
                </button>
            </li>
        </ul>

        {activeTab === 'results' && (
            <div className="card">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">My Marks</h5>
                    <button className="btn btn-outline-primary btn-sm" onClick={downloadReportCard}>
                        <i className="fas fa-download me-2"></i>Download Report Card
                    </button>
                </div>
                <div className="card-body">
                    {loading ? (
                        <p className="text-center">Loading...</p>
                    ) : marks.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Exam Type</th>
                                        <th>Subject</th>
                                        <th>Marks Obtained</th>
                                        {/* Max marks could be part of exam setup, assuming 100 for now or missing */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {marks.map(mark => (
                                        <tr key={mark._id}>
                                            <td>{mark.exam_type}</td>
                                            <td>{mark.subject}</td>
                                            <td>{mark.marks}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-center text-muted py-4">No exam results available.</p>
                    )}
                </div>
            </div>
        )}

        {activeTab === 'schedule' && (
            <div className="card">
                <div className="card-body text-center py-5">
                    <i className="fas fa-calendar-alt text-muted mb-3" style={{ fontSize: '3rem' }}></i>
                    <p className="text-muted">No upcoming exams scheduled.</p>
                </div>
            </div>
        )}
      </div>
    </StudentLayout>
  );
}

export default StudentExamsPage;
