import React from 'react';
import studyImage from '../assets/Study.jpeg';
import sportsImage from '../assets/Sports.jpeg';
import computerLabImage from '../assets/Computer Lab.jpeg';
import culturalProgramImage from '../assets/Cultural Program.jpeg';

function Gallery() {
  return (
    <div className="col-lg-4">
      <section id="gallery" className="content-section">
        <div className="section-header">
          <h2 className="section-title">
            <i className="fas fa-images text-primary me-2"></i>
            Photo Gallery
          </h2>
        </div>
        <div className="photo-slider">
          <div id="photoCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-indicators">
              <button type="button" data-bs-target="#photoCarousel" data-bs-slide-to="0" className="active"></button>
              <button type="button" data-bs-target="#photoCarousel" data-bs-slide-to="1"></button>
              <button type="button" data-bs-target="#photoCarousel" data-bs-slide-to="2"></button>
              <button type="button" data-bs-target="#photoCarousel" data-bs-slide-to="3"></button>
            </div>
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img src={studyImage} className="d-block w-100 gallery-image" alt="Students in Classroom" />
                <div className="carousel-caption">
                  <h6>Interactive Learning</h6>
                </div>
              </div>
              <div className="carousel-item">
                <img src={sportsImage} className="d-block w-100 gallery-image" alt="Sports Activities" />
                <div className="carousel-caption">
                  <h6>Sports & Recreation</h6>
                </div>
              </div>
              <div className="carousel-item">
                <img src={computerLabImage} className="d-block w-100 gallery-image" alt="Science Laboratory" />
                <div className="carousel-caption">
                  <h6>Modern Laboratories</h6>
                </div>
              </div>
              <div className="carousel-item">
                <img src={culturalProgramImage} className="d-block w-100 gallery-image" alt="Cultural Program" />
                <div className="carousel-caption">
                  <h6>Cultural Program</h6>
                </div>
              </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#photoCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon"></span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#photoCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon"></span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Gallery;