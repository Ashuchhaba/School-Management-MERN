import React from 'react';
import schoolBuilding from '../assets/Satyam School Building.jpg';

function Hero() {
  return (
    <section id="home" className="hero-section">
      <div className="hero-overlay">
        <div className="container">
          <div className="row align-items-center min-vh-100">
            <div className="col-lg-6">
              <div className="hero-content text-white">
                <h1 className="display-4 fw-bold mb-4 animate-fade-in">
                  Welcome to<br />
                  <span className="text-warning">Satyam Stars</span><br />
                  International School
                </h1>
                <p className="lead mb-4 animate-fade-in-delay">
                  Nurturing young minds with excellence in education, character building, and holistic development for a brighter future.
                </p>
                <div className="hero-buttons animate-fade-in-delay-2">
                  <a href="#about" className="btn btn-warning btn-lg me-3">
                    <i className="fas fa-info-circle me-2"></i>Learn More
                  </a>
                  <a href="#contact" className="btn btn-outline-light btn-lg">
                    <i className="fas fa-phone me-2"></i>Contact Us
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-image animate-slide-in">
                <img src={schoolBuilding} alt="School Building" className="img rounded shadow-lg" height="550px" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;