import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register the required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseChart = ({ data }) => {
  // Default data if none is provided
  const defaultData = {
    labels: ['Housing', 'Food', 'Transportation', 'Entertainment', 'Utilities'],
    datasets: [
      {
        data: [35, 25, 15, 15, 10],
        backgroundColor: [
          '#3498db', // Blue
          '#2ecc71', // Green
          '#e74c3c', // Red
          '#f39c12', // Yellow
          '#9b59b6', // Purple
        ],
        borderColor: [
          '#2980b9',
          '#27ae60',
          '#c0392b',
          '#d35400',
          '#8e44ad',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Use provided data or default data
  const chartData = data || defaultData;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 15,
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}%`;
          },
        },
      },
    },
  };

  return (
    <div className="expense-chart-container" style={{ height: '240px', position: 'relative' }}>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default ExpenseChart;