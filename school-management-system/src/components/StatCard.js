import React from 'react';

function StatCard({ icon, label, value, type }) {
  const typeClasses = {
    primary: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    info: 'text-info',
  };

  return (
    <div className="col-lg-3 col-md-6 mb-3">
      <div className="stat-card card h-100">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <div className={`stat-number ${typeClasses[type]}`}>{value}</div>
              <p className="stat-label text-muted">{label}</p>
            </div>
            <div className={`stat-icon ${typeClasses[type]}`}>
              <i className={`fas ${icon}`}></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatCard;
