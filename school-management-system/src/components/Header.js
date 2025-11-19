import React from 'react';
import { Link } from 'react-router-dom';
import schoolLogo from '../assets/school-logo.png';

function Header() {
  return (
    <header className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
      <div className="container">
        <a className="navbar-brand d-flex align-items-center" href="/">
          <div className="school-logo me-3">
            <img src={schoolLogo} width="58px" height="64px" alt="School Logo" />
          </div>
          <div>
            <h4 className="mb-0 text-primary fw-bold">SATYAM STARS</h4>
            <small className="text-muted">INTERNATIONAL SCHOOL</small>
          </div>
        </a>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto me-4">
            <li className="nav-item">
              <a className="nav-link active" href="#home">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#about">About</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#news">News</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#gallery">Gallery</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#contact">Contact</a>
            </li>
          </ul>
          <Link to="/login" className="btn btn-primary">
            <i className="fas fa-user-shield me-2"></i>Admin Login
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;