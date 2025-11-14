import React from 'react';

function News() {
  const newsData = [
    {
      day: '15',
      month: 'Dec',
      title: 'Annual Sports Day 2024',
      excerpt: 'Join us for our annual sports day celebration with exciting competitions and activities for all students.',
    },
    {
      day: '12',
      month: 'Dec',
      title: 'Science Exhibition Success',
      excerpt: 'Our students showcased innovative science projects at the inter-school exhibition and won multiple awards.',
    },
    {
      day: '08',
      month: 'Dec',
      title: 'New Computer Lab Inauguration',
      excerpt: 'State-of-the-art computer laboratory with latest technology has been inaugurated for enhanced learning.',
    },
  ];

  return (
    <div className="col-lg-4">
      <section id="news" className="content-section">
        <div className="section-header">
          <h2 className="section-title">
            <i className="fas fa-newspaper text-primary me-2"></i>
            Latest News
          </h2>
        </div>
        <div className="news-container">
          {newsData.map((item, index) => (
            <article className="news-item" key={index}>
              <div className="news-date">
                <span className="day">{item.day}</span>
                <span className="month">{item.month}</span>
              </div>
              <div className="news-content">
                <h5 className="news-title">{item.title}</h5>
                <p className="news-excerpt">{item.excerpt}</p>
                <a href="/" className="news-link">Read More <i className="fas fa-arrow-right"></i></a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default News;