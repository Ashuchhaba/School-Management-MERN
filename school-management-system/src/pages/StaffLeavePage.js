import React, { useState, useEffect } from 'react';
import StaffLayout from '../components/StaffLayout';
import api from '../api';

function StaffLeavePage() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [newLeave, setNewLeave] = useState({
    reason: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/leave');
      setLeaves(data);
    } catch (error) {
      console.error('Error fetching leaves:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLeave(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/leave/apply', newLeave);
      setNewLeave({ reason: '', startDate: '', endDate: '' });
      setShowApplyForm(false);
      fetchLeaves();
    } catch (error) {
      console.error('Error applying for leave:', error);
    }
  };

  return (
    <StaffLayout>
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-primary">Leave Management</h2>
          <button className="btn btn-primary" onClick={() => setShowApplyForm(!showApplyForm)}>
            {showApplyForm ? 'Cancel' : 'Apply for Leave'}
          </button>
        </div>

        {showApplyForm && (
          <div className="card mb-4">
            <div className="card-body">
              <form onSubmit={handleApplyLeave}>
                <div className="mb-3">
                  <label className="form-label">Reason</label>
                  <textarea name="reason" value={newLeave.reason} onChange={handleInputChange} className="form-control" rows="3" required></textarea>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Start Date</label>
                    <input type="date" name="startDate" value={newLeave.startDate} onChange={handleInputChange} className="form-control" required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">End Date</label>
                    <input type="date" name="endDate" value={newLeave.endDate} onChange={handleInputChange} className="form-control" required />
                  </div>
                </div>
                <button type="submit" className="btn btn-success">Submit Application</button>
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
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Reason</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.map(leave => (
                    <tr key={leave._id}>
                      <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                      <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                      <td>{leave.reason}</td>
                      <td>
                        <span className={`badge bg-${leave.status === 'Approved' ? 'success' : leave.status === 'Rejected' ? 'danger' : 'warning'}`}>
                          {leave.status}
                        </span>
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

export default StaffLeavePage;
