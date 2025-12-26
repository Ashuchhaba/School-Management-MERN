import React, { useState, useEffect } from 'react';
import StaffLayout from '../components/StaffLayout';
import api from '../api';

function StaffExamsPage() {
  const [assignedClasses, setAssignedClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [subject, setSubject] = useState('');
  const [examType, setExamType] = useState('');
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAssignedClasses = async () => {
      try {
        const { data } = await api.get('/api/staff/profile');
        setAssignedClasses(data.assigned_classes);
        if (data.assigned_classes.length > 0) {
          setSelectedClass(data.assigned_classes[0]);
        }
      } catch (error) {
        console.error('Error fetching assigned classes:', error);
      }
    };
    fetchAssignedClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents();
    }
  }, [selectedClass]);
  
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/api/students?class=${selectedClass}`);
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
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
        <h2 className="text-primary mb-4">Enter Exam Marks</h2>
        <div className="row mb-3">
          <div className="col-md-4">
            <select className="form-select" value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
              <option value="">Select Class</option>
              {assignedClasses.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <input type="text" className="form-control" placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} />
          </div>
          <div className="col-md-4">
            <input type="text" className="form-control" placeholder="Exam Type (e.g., Mid-term)" value={examType} onChange={e => setExamType(e.target.value)} />
          </div>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="card">
            <div className="card-body">
              <table className="table">
                <thead>
                  <tr>
                    <th>Roll No</th>
                    <th>Name</th>
                    <th>Marks</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(student => (
                    <tr key={student._id}>
                      <td>{student.roll_no}</td>
                      <td>{student.name}</td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          value={marks[student._id] || ''}
                          onChange={e => handleMarksChange(student._id, e.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className="btn btn-primary" onClick={handleSaveMarks} disabled={!selectedClass || !subject || !examType}>
                Save Marks
              </button>
            </div>
          </div>
        )}
      </div>
    </StaffLayout>
  );
}

export default StaffExamsPage;
