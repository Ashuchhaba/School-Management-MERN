import React, { useState, useEffect } from 'react';
import StaffLayout from '../components/StaffLayout';
import api from '../api';

function StaffExamsPage() {
  const [assignedClasses, setAssignedClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [subject, setSubject] = useState('English'); // Default subject
  const [examType, setExamType] = useState('Mid-term');
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(false);

  const allClasses = [
    "Nursery", "LKG", "UKG", 
    "1st", "2nd", "3rd", "4th", "5th", 
    "6th", "7th", "8th", "9th", "10th"
  ];

  const allSubjects = [
    "English", "Hindi", "Mathematics", "Science", 
    "Social Science", "Physics", "Chemistry", "Biology",
    "History", "Geography", "Computer Science", "Physical Education",
    "Art", "Music", "Sanskrit", "Gujarati"
  ];

  useEffect(() => {
    // Set static lists
    setAssignedClasses(allClasses);
    setSubjects(allSubjects);

    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/api/staff/profile');
        
        // Set default class if they are a class teacher
        if (data.class_teacher_of) {
            setSelectedClass(data.class_teacher_of);
        } else {
            // Default to first class if not set
            // setSelectedClass(allClasses[0]); 
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchStudentsAndMarks();
    }
  }, [selectedClass, subject, examType]);
  
  const fetchStudentsAndMarks = async () => {
    setLoading(true);
    setMarks({}); // Clear marks temporarily while fetching
    try {
      // 1. Fetch Students for the class
      const { data: studentsData } = await api.get(`/api/students?class=${selectedClass}`);
      setStudents(studentsData);

      // 2. Fetch Existing Marks if subject and exam type are selected
      if (subject && examType) {
          const { data: marksData } = await api.get(`/api/exams/marks`, {
              params: {
                  class: selectedClass,
                  subject,
                  examType
              }
          });
          
          // Map existing marks to state
          const marksMap = {};
          marksData.forEach(m => {
              marksMap[m.student_id] = m.marks;
          });
          setMarks(marksMap);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarksChange = (studentId, value) => {
    setMarks(prev => ({ ...prev, [studentId]: value }));
  };

  const handleSaveMarks = async () => {
    try {
      await api.post('/api/exams/marks/save', {
        class: selectedClass,
        subject,
        examType,
        marks,
      });
      alert('Marks saved successfully!');
    } catch (error) {
      console.error('Error saving marks:', error);
      alert('Failed to save marks.');
    }
  };

  return (
    <StaffLayout>
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="text-primary mb-0">Enter Exam Marks</h2>
            <button 
                className="btn btn-primary" 
                onClick={handleSaveMarks} 
                disabled={!selectedClass || !subject || !examType || loading}
            >
                <i className="fas fa-save me-2"></i>Save Marks
            </button>
        </div>

        <div className="card mb-4">
            <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label">Class</label>
                    <select className="form-select" value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
                      <option value="">Select Class</option>
                      {assignedClasses.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Subject</label>
                    {subjects.length > 0 ? (
                        <select className="form-select" value={subject} onChange={e => setSubject(e.target.value)}>
                            <option value="">Select Subject</option>
                            {subjects.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    ) : (
                        <input type="text" className="form-control" placeholder="Enter Subject" value={subject} onChange={e => setSubject(e.target.value)} />
                    )}
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Exam Type</label>
                    <select className="form-select" value={examType} onChange={e => setExamType(e.target.value)}>
                        <option value="Unit Test 1">Unit Test 1</option>
                        <option value="Unit Test 2">Unit Test 2</option>
                        <option value="Mid-term">Mid-term</option>
                        <option value="Final">Final</option>
                    </select>
                  </div>
                </div>
            </div>
        </div>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                  <table className="table table-striped align-middle">
                    <thead>
                      <tr>
                        <th>Roll No</th>
                        <th>Name</th>
                        <th style={{width: '200px'}}>Marks Obtained</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.length > 0 ? students.map(student => (
                        <tr key={student._id}>
                          <td>{student.roll_no}</td>
                          <td>{student.name}</td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              placeholder="Enter marks"
                              value={marks[student._id] || ''}
                              onChange={e => handleMarksChange(student._id, e.target.value)}
                            />
                          </td>
                        </tr>
                      )) : (
                          <tr><td colSpan="3" className="text-center py-4">No students found for this class.</td></tr>
                      )}
                    </tbody>
                  </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </StaffLayout>
  );
}

export default StaffExamsPage;
