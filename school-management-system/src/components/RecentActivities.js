import React, { useState, useEffect } from 'react';
import axios from 'axios';

function RecentActivities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentActivities();
  }, []);

  const fetchRecentActivities = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/dashboard/recent-activities');
      setActivities(res.data);
    } catch (err) {
      console.error('Error fetching recent activities:', err);
    } finally {
      setLoading(false);
    }
  };

  const iconMap = {
    'New Admission': { icon: 'fa-user-plus', color: 'bg-success' },
    'Fee Payment': { icon: 'fa-money-bill', color: 'bg-warning' },
    'Staff Salary': { icon: 'fa-user-tie', color: 'bg-info' },
    'New Event': { icon: 'fa-calendar', color: 'bg-primary' },
    default: { icon: 'fa-info-circle', color: 'bg-secondary' },
  };

  return (
    <div className="card h-100">
      <div className="card-header">
        <h5 className="card-title">
          <i className="fas fa-clock text-info me-2"></i>
          Recent Activities
        </h5>
      </div>
      <div className="card-body">
        {loading ? (
          <p>Loading activities...</p>
        ) : activities.length > 0 ? (
          activities.map(activity => (
            <div className="activity-item mb-3" key={activity._id}>
              <div className={`activity-icon ${iconMap[activity.type]?.color || iconMap.default.color}`}>
                <i className={`fas ${iconMap[activity.type]?.icon || iconMap.default.icon}`}></i>
              </div>
              <div className="activity-content">
                <p className="mb-1"><strong>{activity.type}</strong></p>
                <small className="text-muted">{activity.description}</small>
                <br />
                <small className="text-muted">{new Date(activity.createdAt).toLocaleString()}</small>
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