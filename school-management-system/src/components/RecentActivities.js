import React, { useState, useEffect } from 'react';
import api from '../api';
import './RecentActivities.css';

function RecentActivities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentActivities();
  }, []);

  const fetchRecentActivities = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/dashboard/recent-activities');
      setActivities(res.data);
    } catch (err) {
      console.error('Error fetching recent activities:', err);
    } finally {
      setLoading(false);
    }
  };

  const iconMap = {
    student: { icon: 'fa-user-plus', color: 'bg-success' },
    fee: { icon: 'fa-money-bill', color: 'bg-warning' },
    staff: { icon: 'fa-user-tie', color: 'bg-info' },
  };

  const timeSince = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) {
      return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
  };

  return (
    <div className="card h-100">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">
          <i className="fas fa-clock text-info me-2"></i>
          Recent Activities
        </h5>
        <button className="btn btn-sm btn-outline-secondary" onClick={fetchRecentActivities}>
          <i className="fas fa-sync-alt"></i>
        </button>
      </div>
      <div className="card-body">
        {loading ? (
          <p>Loading activities...</p>
        ) : activities.length > 0 ? (
          activities.map(activity => (
            <div className="activity-item mb-3" key={activity._id}>
              <div className={`activity-icon ${iconMap[activity.category]?.color}`}>
                <i className={`fas ${iconMap[activity.category]?.icon}`}></i>
              </div>
              <div className="activity-content">
                <p className="mb-1"><strong>{activity.title}</strong></p>
                <small className="text-muted">{activity.description}</small>
                <br />
                <small className="text-muted">{timeSince(activity.timestamp)}</small>
              </div>
            </div>
          ))
        ) : (
          <p>No recent activities.</p>
        )}
      </div>
    </div>
  );
}

export default RecentActivities;