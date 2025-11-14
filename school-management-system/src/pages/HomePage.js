import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import News from '../components/News';
import Gallery from '../components/Gallery';
import About from '../components/About';
import Footer from '../components/Footer';

function HomePage() {
  return (
    <div>
      <Header />
      <Hero />
      <main className="main-content">
        <div className="container">
          <div className="row g-4">
            <News />
            <Gallery />
            <About />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;