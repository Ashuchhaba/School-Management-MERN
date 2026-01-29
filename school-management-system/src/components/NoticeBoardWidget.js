import React, { useState, useEffect } from 'react';
import api from '../api';
import './RecentActivities.css'; // Reuse similar styles for list

const NoticeBoardWidget = ({ role }) => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await api.get('/api/notices');
        // Filter based on role if needed (though backend could do this, let's filter purely client side for widget simplicity or show all relevant)
        // If role is staff, show 'staff' and 'all'
        const filtered = res.data.filter(n => n.target_audience === 'all' || n.target_audience === (role || 'staff').toLowerCase());
        setNotices(filtered.slice(0, 3)); // Show latest 3
      } catch (err) {
        console.error('Error fetching notices:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices(); // Initial fetch

    // Set up polling interval (every 10 seconds)
    const intervalId = setInterval(fetchNotices, 10000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [role]);

  return (
    <div className="card h-100">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">
          <i className="fas fa-bullhorn text-warning me-2"></i>Notice Board
        </h5>
        {/* Optional: Link to see all */}
      </div>
      <div className="card-body p-0">
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : notices.length > 0 ? (
          <div className="list-group list-group-flush">
            {notices.map((notice) => (
              <div key={notice._id} className="list-group-item">
                <div className="d-flex w-100 justify-content-between">
                  <h6 className="mb-1 text-primary">{notice.title}</h6>
                  <small className="text-muted">{new Date(notice.date).toLocaleDateString()}</small>
                </div>
                <p className="mb-1 small text-secondary">{notice.content}</p>
                <small className="text-muted" style={{fontSize: '0.75rem'}}>Posted by: {notice.posted_by}</small>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted">
            No new notices.
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticeBoardWidget;
