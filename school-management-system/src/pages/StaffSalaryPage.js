import React, { useState, useEffect } from 'react';
import StaffLayout from '../components/StaffLayout';
import api from '../api';

function StaffSalaryPage() {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSalaries();
  }, []);

  const fetchSalaries = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/salaries/mine'); // Assuming an API for staff's own salary
      setSalaries(data);
    } catch (error) {
      console.error('Error fetching salaries:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StaffLayout>
      <div className="container-fluid">
        <h2 className="text-primary mb-4">My Salary Details</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="card">
            <div className="card-body">
              <table className="table">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Total Days Present</th>
                    <th>Total Days in Month</th>
                    <th>Calculated Salary</th>
                    <th>Paid On</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {salaries.map(salary => (
                    <tr key={salary._id}>
                      <td>{new Date(salary.payment_month).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</td>
                      <td>{salary.total_days_present}</td>
                      <td>{salary.total_days_in_month}</td>
                      <td>${salary.calculated_salary.toFixed(2)}</td>
                      <td>{salary.paid_on ? new Date(salary.paid_on).toLocaleDateString() : 'N/A'}</td>
                      <td>{salary.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </StaffLayout>
  );
}

export default StaffSalaryPage;
