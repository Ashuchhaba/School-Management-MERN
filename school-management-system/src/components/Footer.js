import React from 'react';

function Footer() {
  return (
    <footer id="contact" className="footer bg-dark text-light py-5 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-4">
            <div className="footer-section">
              <h5 className="footer-title">Contact Information</h5>
              <div className="contact-item">
                <i className="fas fa-map-marker-alt me-2"></i>
                <span>Swaminarayan Nagar-Bhidbhanjan Society, Udhna, Surat - 394221</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-phone me-2"></i>
                <span>+91 82000 69671</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-envelope me-2"></i>
                <span>satyamstarsinternational@gmail.com</span>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="footer-section">
              <h5 className="footer-title">Quick Links</h5>
              <ul className="footer-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About Us</a></li>
                <li><a href="#news">News & Events</a></li>
                <li><a href="#gallery">Gallery</a></li>
                <li><a href="/login">Admin Portal</a></li>
              </ul>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="footer-section">
              <h5 className="footer-title">Follow Us</h5>
              <div className="social-links">
                <a href="https://www.facebook.com/p/Satyam-Stars-International-School-100063911687804/" className="social-link"><i className="fab fa-facebook"></i></a>
                <a href="https://www.instagram.com/satyam_stars_international?igsh=MzJpZ21tZXF3amp1" className="social-link"><i className="fab fa-instagram"></i></a>
                <a href="https://youtube.com/@satyameducationfoundation?si=SUEiHeJn5vjaEWpN" className="social-link"><i className="fab fa-youtube"></i></a>
              </div>
            </div>
          </div>
        </div>
        <hr className="my-4" />
        <div className="row">
          <div className="col-12 text-center">
            <p className="mb-0">© 2024 Satyam Stars International School. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;