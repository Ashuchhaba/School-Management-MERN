import React, { useState, useEffect } from 'react';
import api from '../api';
import StaffLayout from '../components/StaffLayout';

function StaffNoticeBoardPage() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await api.get('/api/notices');
        // Filter for 'staff' and 'all'
        const filtered = res.data.filter(n => n.target_audience === 'all' || n.target_audience === 'staff');
        setNotices(filtered);
      } catch (err) {
        console.error('Error fetching notices:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  return (
    <StaffLayout>
      <div className="container-fluid">
        <h2 className="mb-4 text-primary">Notice Board</h2>
        <div className="card">
          <div className="card-body">
            {loading ? (
              <p className="text-center py-4">Loading notices...</p>
            ) : notices.length > 0 ? (
              <div className="list-group list-group-flush">
                {notices.map((notice) => (
                  <div key={notice._id} className="list-group-item py-3">
                    <div className="d-flex w-100 justify-content-between align-items-center mb-2">
                      <h5 className="mb-1 text-primary">{notice.title}</h5>
                      <span className="badge bg-secondary rounded-pill">{new Date(notice.date).toLocaleDateString()}</span>
                    </div>
                    <p className="mb-2">{notice.content}</p>
                    <small className="text-muted">Posted by: {notice.posted_by}</small>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5">
                <i className="fas fa-clipboard-list text-muted mb-3" style={{ fontSize: '3rem' }}></i>
                <p className="text-muted">No notices posted yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </StaffLayout>
  );
}

export default StaffNoticeBoardPage;
