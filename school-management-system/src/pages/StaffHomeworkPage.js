import React, { useState, useEffect } from 'react';
import StaffLayout from '../components/StaffLayout';
import api from '../api';

function StaffHomeworkPage() {
  const [homeworks, setHomeworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newHomework, setNewHomework] = useState({
    class: '',
    subject: '',
    description: '',
    dueDate: '',
  });

  useEffect(() => {
    fetchHomeworks();
  }, []);

  const fetchHomeworks = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/homework');
      setHomeworks(data);
    } catch (error) {
      console.error('Error fetching homework:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewHomework(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateHomework = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/homework', newHomework);
      setNewHomework({ class: '', subject: '', description: '', dueDate: '' });
      setShowCreateForm(false);
      fetchHomeworks();
    } catch (error) {
      console.error('Error creating homework:', error);
    }
  };

  return (
    <StaffLayout>
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-primary">Homework</h2>
          <button className="btn btn-primary" onClick={() => setShowCreateForm(!showCreateForm)}>
            {showCreateForm ? 'Cancel' : 'Create New Homework'}
          </button>
        </div>

        {showCreateForm && (
          <div className="card mb-4">
            <div className="card-body">
              <form onSubmit={handleCreateHomework}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Class</label>
                    <input type="text" name="class" value={newHomework.class} onChange={handleInputChange} className="form-control" required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Subject</label>
                    <input type="text" name="subject" value={newHomework.subject} onChange={handleInputChange} className="form-control" required />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea name="description" value={newHomework.description} onChange={handleInputChange} className="form-control" rows="3" required></textarea>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Due Date</label>
                    <input type="date" name="dueDate" value={newHomework.dueDate} onChange={handleInputChange} className="form-control" required />
                  </div>
                </div>
                <button type="submit" className="btn btn-success">Save Homework</button>
              </form>
            </div>
          </div>
        )}

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="card">
            <div className="card-body">
              <table className="table">
                <thead>
                  <tr>
                    <th>Class</th>
                    <th>Subject</th>
                    <th>Due Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {homeworks.map(hw => (
                    <tr key={hw._id}>
                      <td>{hw.class}</td>
                      <td>{hw.subject}</td>
                      <td>{new Date(hw.dueDate).toLocaleDateString()}</td>
                      <td>
                        <button className="btn btn-sm btn-info">View</button>
                      </td>
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

export default StaffHomeworkPage;
