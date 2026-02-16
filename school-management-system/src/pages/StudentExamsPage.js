import React, { useState, useEffect } from 'react';
import StudentLayout from '../components/StudentLayout';
import api from '../api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function StudentExamsPage() {
  const [marks, setMarks] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [studentProfile, setStudentProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('results'); // results or schedule

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'results') {
                const [marksRes, profileRes] = await Promise.all([
                    api.get('/api/exams/my-marks'),
                    api.get('/api/students/profile')
                ]);
                setMarks(marksRes.data);
                setStudentProfile(profileRes.data);
            } else {
                const scheduleRes = await api.get('/api/exams/my-schedule');
                setSchedules(scheduleRes.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, [activeTab]);

  const downloadReportCard = () => {
      const doc = new jsPDF();

      // Header
      doc.setFontSize(22);
      doc.setTextColor(40, 116, 240); // Primary Blue
      doc.text("SATYAM STARS INTERNATIONAL SCHOOL", 105, 20, null, null, "center");
      
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text("STUDENT REPORT CARD", 105, 30, null, null, "center");
      
      doc.setLineWidth(0.5);
      doc.line(20, 35, 190, 35);

      // Student Details
      doc.setFontSize(11);
      doc.text(`Student Name: ${studentProfile?.name || 'N/A'}`, 20, 45);
      doc.text(`Admission No: ${studentProfile?.gr_no || 'N/A'}`, 140, 45);
      
      doc.text(`Class: ${studentProfile?.class || 'N/A'}`, 20, 52);
      doc.text(`Roll No: ${studentProfile?.roll_no || 'N/A'}`, 140, 52);

      doc.text(`Father's Name: ${studentProfile?.father_name || 'N/A'}`, 20, 59);
      doc.text(`Date of Birth: ${studentProfile?.dob ? new Date(studentProfile.dob).toLocaleDateString() : 'N/A'}`, 140, 59);

      // Group marks by Exam Type
      const groupedMarks = marks.reduce((acc, mark) => {
          if (!acc[mark.exam_type]) acc[mark.exam_type] = [];
          acc[mark.exam_type].push(mark);
          return acc;
      }, {});

      let finalY = 70;

      Object.keys(groupedMarks).forEach((examType) => {
          doc.setFontSize(12);
          doc.setTextColor(40, 116, 240);
          doc.text(examType, 20, finalY);
          
          const examMarks = groupedMarks[examType];
          
          autoTable(doc, {
              startY: finalY + 5,
              head: [['Subject', 'Marks Obtained', 'Grade']], // Added Grade column placeholder
              body: examMarks.map(m => [
                  m.subject, 
                  m.marks,
                  // Simple grading logic
                  m.marks >= 90 ? 'A+' : m.marks >= 80 ? 'A' : m.marks >= 70 ? 'B' : m.marks >= 60 ? 'C' : 'D'
              ]),
              theme: 'grid',
              headStyles: { fillColor: [40, 116, 240] },
          });

          finalY = doc.lastAutoTable.finalY + 15;
      });

      // Footer
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text("This report card is computer generated.", 105, pageHeight - 20, null, null, "center");
      doc.text(`Date Generated: ${new Date().toLocaleDateString()}`, 20, pageHeight - 20);

      doc.save(`ReportCard_${studentProfile?.name || 'Student'}.pdf`);
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
                <div className="card-header bg-white">
                    <h5 className="mb-0">Upcoming Exam Schedule</h5>
                </div>
                <div className="card-body">
                    {loading ? (
                        <p className="text-center">Loading...</p>
                    ) : schedules.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Exam Type</th>
                                        <th>Subject</th>
                                        <th>Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {schedules.map(sch => (
                                        <tr key={sch._id}>
                                            <td>{new Date(sch.date).toLocaleDateString()}</td>
                                            <td>{sch.exam_type}</td>
                                            <td>{sch.subject}</td>
                                            <td>{sch.start_time} - {sch.end_time}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-5">
                            <i className="fas fa-calendar-alt text-muted mb-3" style={{ fontSize: '3rem' }}></i>
                            <p className="text-muted">No upcoming exams scheduled.</p>
                        </div>
                    )}
                </div>
            </div>
        )}
      </div>
    </StudentLayout>
  );
}

export default StudentExamsPage;
