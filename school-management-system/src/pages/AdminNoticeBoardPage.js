import React, { useState, useEffect } from 'react';
import api from '../api';
import AdminLayout from '../components/AdminLayout';
import { usePopup } from '../contexts/PopupContext';
import Portal from '../components/Portal';

function AdminNoticeBoardPage() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNotice, setCurrentNotice] = useState(null); // For edit
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showPopup, showConfirm } = usePopup();

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    target_audience: 'all',
    type: 'notice'
  });

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/notices');
      setNotices(res.data);
    } catch (err) {
      console.error(err);
      showPopup('Failed to fetch notices.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = (type = 'notice') => {
    setCurrentNotice(null);
    setFormData({ title: '', content: '', target_audience: 'all', type });
    setIsModalOpen(true);
  };

  const openEditModal = (notice) => {
    setCurrentNotice(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      target_audience: notice.target_audience || 'all',
      type: notice.type || 'notice'
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentNotice(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      if (currentNotice) {
        // Edit
        await api.put(`/api/notices/${currentNotice._id}`, formData);
        showPopup(`${formData.type === 'news' ? 'News' : 'Notice'} updated successfully!`);
      } else {
        // Create
        await api.post('/api/notices', formData);
        showPopup(`${formData.type === 'news' ? 'News' : 'Notice'} posted successfully!`);
      }
      closeModal();
      fetchNotices();
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        showPopup('Session expired or unauthorized. Please refresh the page or login again.');
      } else {
        showPopup('Operation failed. ' + (err.response?.data?.message || err.message));
      }
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    showConfirm('Are you sure you want to delete this notice/news?', async () => {
      try {
        await api.delete(`/api/notices/${id}`);
        showPopup('Deleted successfully!');
        fetchNotices();
      } catch (err) {
        console.error(err);
        showPopup('Failed to delete.');
      }
    });
  };

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="page-title"><i className="fas fa-bullhorn me-2"></i>Notice Board</h1>
        <div className="d-flex gap-2">
            <button className="btn btn-primary" onClick={() => openAddModal('notice')}>
                <i className="fas fa-plus me-2"></i>Post New Notice
            </button>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          {loading ? (
            <p>Loading notices...</p>
          ) : notices.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Title</th>
                    <th>Content</th>
                    <th>Audience</th>
                    <th>Posted By</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {notices.map((notice) => (
                    <tr key={notice._id}>
                      <td>
                        <span className={`badge bg-${notice.type === 'news' ? 'success' : 'secondary'}`}>
                          {notice.type ? notice.type.toUpperCase() : 'NOTICE'}
                        </span>
                      </td>
                      <td style={{ fontWeight: '500' }}>{notice.title}</td>
                      <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {notice.content}
                      </td>
                      <td>
                        <span className={`badge bg-${notice.target_audience === 'all' ? 'info' : notice.target_audience === 'staff' ? 'warning' : 'success'}`}>
                          {notice.target_audience ? notice.target_audience.toUpperCase() : 'ALL'}
                        </span>
                      </td>
                      <td>{notice.posted_by}</td>
                      <td>{new Date(notice.date).toLocaleDateString()}</td>
                      <td>
                        <button className="btn btn-warning action-btn" onClick={() => openEditModal(notice)} title="Edit">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="btn btn-danger action-btn" onClick={() => handleDelete(notice._id)} title="Delete">
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="fas fa-clipboard-list text-muted mb-3" style={{ fontSize: '3rem' }}></i>
              <p className="text-muted">No notices or news posted yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <Portal>
          <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{currentNotice ? 'Edit' : 'Post New'} {formData.type === 'news' ? 'News' : 'Notice'}</h5>
                  <button type="button" className="btn-close" onClick={closeModal}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Type</label>
                      <select
                        className="form-select"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        disabled={!!currentNotice}
                      >
                        <option value="notice">Notice</option>
                        <option value="news">News</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Title</label>
                      <input
                        type="text"
                        className="form-control"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    {formData.type === 'notice' && (
                        <div className="mb-3">
                        <label className="form-label">Target Audience</label>
                        <select
                            className="form-select"
                            name="target_audience"
                            value={formData.target_audience}
                            onChange={handleInputChange}
                        >
                            <option value="all">All</option>
                            <option value="staff">Staff Only</option>
                            <option value="student">Students Only</option>
                        </select>
                        </div>
                    )}
                    <div className="mb-3">
                      <label className="form-label">Content</label>
                      <textarea
                        className="form-control"
                        name="content"
                        rows="5"
                        value={formData.content}
                        onChange={handleInputChange}
                        required
                      ></textarea>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={closeModal} disabled={isSubmitting}>Cancel</button>
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                      {isSubmitting ? 'Saving...' : (currentNotice ? 'Update' : 'Post')} {formData.type === 'news' ? 'News' : 'Notice'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </AdminLayout>
  );
}

export default AdminNoticeBoardPage;
