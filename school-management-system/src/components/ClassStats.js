import React, { useState, useEffect } from 'react';
import api from '../api';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function ClassStats() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetchClassDistribution();
  }, []);

  const fetchClassDistribution = async () => {
    try {
      const res = await api.get('/api/dashboard/class-distribution');
      const data = res.data;

      const chartLabels = data.map(item => item._id);
      const chartValues = data.map(item => item.count);

      setChartData({
        labels: chartLabels,
        datasets: [
          {
            label: 'Number of Students',
            data: chartValues,
            backgroundColor: '#3B82F6',
          },
        ],
      });
    } catch (err) {
      console.error('Error fetching class distribution:', err);
    }
  };

  return (
    <div className="card h-100">
      <div className="card-header">
        <h5 className="card-title">
          <i className="fas fa-chart-bar text-primary me-2"></i>
          Class-wise Student Distribution
        </h5>
      </div>
      <div className="card-body">
        {chartData ? (
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true } },
            }}
          />
        ) : (
          <p>Loading chart data...</p>
        )}
      </div>
    </div>
  );
}

export default ClassStats;