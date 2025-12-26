import React, { useState, useEffect } from 'react';
import StaffLayout from '../components/StaffLayout';
import api from '../api';

function StaffStudentListPage() {
  const [students, setStudents] = useState([]);
  const [assignedClasses, setAssignedClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, profileRes] = await Promise.all([
          api.get('/api/staff/students'),
          api.get('/api/staff/profile')
        ]);
        setStudents(studentsRes.data);
        setAssignedClasses(profileRes.data.assigned_classes);
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
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.roll_no.toString().includes(search)
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
        )}
      </div>
    </StaffLayout>
  );
}

export default StaffStudentListPage;
