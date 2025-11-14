import React from 'react';

function About() {
  return (
    <div className="col-lg-4">
      <section id="about" className="content-section">
        <div className="section-header">
          <h2 className="section-title">
            <i className="fas fa-school text-primary me-2"></i>
            About School
          </h2>
        </div>
        <div className="about-content">
          <p className="about-text">
            Satyam Stars International School is committed to providing quality education that nurtures intellectual curiosity, creativity, and character development in our students.
          </p>
          <div className="about-features">
            <div className="feature-item">
              <i className="fas fa-check-circle text-success me-2"></i>
              <span>CBSE Affiliated</span>
            </div>
            <div className="feature-item">
              <i className="fas fa-check-circle text-success me-2"></i>
              <span>Experienced Faculty</span>
            </div>
            <div className="feature-item">
              <i className="fas fa-check-circle text-success me-2"></i>
              <span>Modern Infrastructure</span>
            </div>
            <div className="feature-item">
              <i className="fas fa-check-circle text-success me-2"></i>
              <span>Holistic Development</span>
            </div>
            <div className="feature-item">
              <i className="fas fa-check-circle text-success me-2"></i>
              <span>Sports & Arts</span>
            </div>
            <div className="feature-item">
              <i className="fas fa-check-circle text-success me-2"></i>
              <span>Digital Learning</span>
            </div>
          </div>
          <div className="about-stats mt-4">
            <div className="row text-center">
              <div className="col-6">
                <div className="stat-item">
                  <h4 className="stat-number text-primary">1200+</h4>
                  <p className="stat-label">Students</p>
                </div>
              </div>
              <div className="col-6">
                <div className="stat-item">
                  <h4 className="stat-number text-primary">50+</h4>
                  <p className="stat-label">Teachers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;