import React from 'react';
import { Link } from 'react-router-dom';

function ReportCard({ icon, title, description, link }) {
  return (
    <div className="card h-100">
      <div className="card-body d-flex flex-column">
        <div className="d-flex align-items-start mb-3">
          <div className="stat-icon text-primary me-3">
            <i className={`fas ${icon}`}></i>
          </div>
          <div>
            <h5 className="card-title mb-1">{title}</h5>
            <p className="card-text text-muted">{description}</p>
          </div>
        </div>
        <div className="mt-auto">
          <Link to={link} className="btn btn-primary w-100">
            View Report
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ReportCard;
