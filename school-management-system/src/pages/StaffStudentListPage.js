import React, { useState, useEffect } from 'react';
import StaffLayout from '../components/StaffLayout';
import api from '../api';

function StaffStudentListPage() {
  const [students, setStudents] = useState([]);
  const [assignedClasses, setAssignedClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('');

  const allStandardClasses = [
    "Nursery", "LKG", "UKG", 
    "1st", "2nd", "3rd", "4th", "5th", 
    "6th", "7th", "8th", "9th", "10th"
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, profileRes] = await Promise.all([
          api.get('/api/students'), // Fetch ALL students
          api.get('/api/staff/profile')
        ]);
        setStudents(studentsRes.data);
        
        // Use all standard classes for the dropdown
        setAssignedClasses(allStandardClasses);

        // Set default filter to the class they are a teacher of
        if (profileRes.data.class_teacher_of) {
            setFilterClass(profileRes.data.class_teacher_of);
        } else {
            // Default to 'All Classes' (empty string) or the first class
            // setFilterClass(''); // This shows all students initially
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredStudents = students
    .filter(student =>
      (student.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (student.roll_no?.toString() || '').includes(search)
    )
    .filter(student =>
      filterClass ? student.class === filterClass : true
    );

  return (
    <StaffLayout>
      <div className="container-fluid">
        <h2 className="text-primary mb-4">My Students</h2>
        <div className="row mb-3">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name or roll number..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={filterClass}
              onChange={e => setFilterClass(e.target.value)}
            >
              <option value="">All Classes</option>
              {assignedClasses.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Roll No</th>
                      <th>Name</th>
                      <th>Class</th>
                      <th>Mobile</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map(student => (
                      <tr key={student._id}>
                        <td>{student.roll_no}</td>
                        <td>{student.name}</td>
                        <td>{student.class}</td>
                        <td>{student.mobile_no1}</td>
                      </tr>
                    ))}
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

export default StaffStudentListPage;
