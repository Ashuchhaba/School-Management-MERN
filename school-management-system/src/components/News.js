import React, { useState, useEffect } from 'react';
import axios from 'axios';

function News() {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/public/news`);
        setNewsData(res.data);
      } catch (err) {
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const getDay = (dateString) => {
    const date = new Date(dateString);
    return date.getDate().toString().padStart(2, '0');
  };

  const getMonth = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('default', { month: 'short' });
  };

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
          {loading ? (
            <p>Loading news...</p>
          ) : newsData.length > 0 ? (
            newsData.map((item, index) => (
              <article className="news-item" key={item._id || index}>
                <div className="news-date">
                  <span className="day">{getDay(item.date)}</span>
                  <span className="month">{getMonth(item.date)}</span>
                </div>
                <div className="news-content">
                  <h5 className="news-title">{item.title}</h5>
                  <p className="news-excerpt">{item.content.substring(0, 100)}{item.content.length > 100 ? '...' : ''}</p>
                  <a href="/" className="news-link">Read More <i className="fas fa-arrow-right"></i></a>
                </div>
              </article>
            ))
          ) : (
            <p>No news items found.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default News;