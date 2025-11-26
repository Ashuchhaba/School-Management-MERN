import React, { useState, useEffect } from 'react';
import api from '../api';
import Portal from './Portal';
import { usePopup } from '../contexts/PopupContext';

function ProcessSalaryModal({ salary, onClose }) {
  const [formData, setFormData] = useState({
    calculated_salary: '',
    paid_on: new Date().toISOString().slice(0, 7),
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const { showPopup } = usePopup();

  useEffect(() => {
    if (salary) {
      setFormData({
        calculated_salary: salary.calculated_salary || '',
        paid_on: salary.paid_on ? new Date(salary.paid_on).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
        notes: salary.notes || '',
      });
    }
  }, [salary]);

  if (!salary) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const paymentData = {
      ...formData,
      staff_id: salary.staff_id._id,
      payment_month: salary.payment_month,
    };

    try {
      if (salary._id) { // If it has an _id, we're updating
        await api.put(`/api/salaries/${salary._id}`, paymentData);
        showPopup('Salary payment updated successfully!');
      } else { // Otherwise, we're processing a new payment
        await api.post(`/api/salaries`, paymentData);
        showPopup('Salary payment processed successfully!');
      }
      onClose();
    } catch (err) {
      console.error('Error processing/updating salary:', err);
      showPopup('Operation failed. ' + (err.response?.data?.message || ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Portal>
      <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title"><i className="fas fa-calculator me-2"></i>Process Salary Payment</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Staff Member:</label>
                  <p className="form-control-static fw-bold">{salary.staff_id?.name}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label">Month:</label>
                  <p className="form-control-static fw-bold">{new Date(salary.payment_month).toLocaleString('en-US', { year: 'numeric', month: 'long' })}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label">Base Salary:</label>
                  <p className="form-control-static">₹{salary.staff_id?.salary?.toLocaleString('en-IN')}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label">Days Present:</label>
                  <p className="form-control-static">{`${salary.total_days_present} / ${salary.total_days_in_month}`}</p>
                </div>
                <div className="mb-3">
                  <label htmlFor="calculated_salary" className="form-label">Calculated Salary (₹):</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    id="calculated_salary"
                    name="calculated_salary"
                    value={formData.calculated_salary}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="paid_on" className="form-label">Paid On Date</label>
                  <input
                    type="date"
                    className="form-control"
                    id="paid_on"
                    name="paid_on"
                    value={formData.paid_on}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="notes" className="form-label">Notes</label>
                  <textarea
                    className="form-control"
                    id="notes"
                    name="notes"
                    rows="3"
                    value={formData.notes}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Processing...' : (salary.paid_on ? 'Update Payment' : 'Process Payment')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Portal>
  );
}

export default ProcessSalaryModal;
