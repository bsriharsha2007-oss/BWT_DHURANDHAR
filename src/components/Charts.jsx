import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Charts({ data }) {
  const chartData = useMemo(() => {
    const years = Array.isArray(data?.years) ? data.years : [];
    const labels = years.map((y) => `Year ${y}`);
    const safe = Array.isArray(data?.safe) ? data.safe : [];
    const balanced = Array.isArray(data?.balanced) ? data.balanced : [];
    const aggressive = Array.isArray(data?.aggressive) ? data.aggressive : [];

    // Horizontal dashed goal line (one value repeated across all years).
    const goalLine =
      Array.isArray(data?.goalLine) && data.goalLine.length === labels.length
        ? data.goalLine
        : [];

    return {
      labels,
      datasets: [
        {
          label: 'Safe projection (5%)',
          data: safe,
          borderColor: '#10b981', // emerald-500
          backgroundColor: 'rgba(16, 185, 129, 0.12)',
          tension: 0.35,
          fill: true,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHitRadius: 12,
          borderWidth: 2,
        },
        {
          label: 'Balanced projection (10%)',
          data: balanced,
          borderColor: '#f59e0b', // amber-500
          backgroundColor: 'rgba(245, 158, 11, 0.10)',
          tension: 0.35,
          fill: true,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHitRadius: 12,
          borderWidth: 2,
        },
        {
          label: 'Aggressive projection (18%)',
          data: aggressive,
          borderColor: '#ef4444', // red-500
          backgroundColor: 'rgba(239, 68, 68, 0.10)',
          tension: 0.35,
          fill: true,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHitRadius: 12,
          borderWidth: 2,
        },
        {
          label: 'Goal',
          data: goalLine,
          borderColor: '#6366f1', // indigo-500
          borderDash: [8, 6],
          pointRadius: 0,
          fill: false,
          borderWidth: 2,
        },
      ],
    };
  }, [data]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'nearest',
      intersect: false,
      axis: 'x',
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            family: "'Inter', sans-serif",
            size: 12,
            weight: '500'
          }
        }
      },
      tooltip: {
        backgroundColor: '#18181b',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Projected savings',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          callback: function(value) {
            return '₹' + value.toLocaleString('en-IN');
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Years',
        },
        grid: {
          display: false
        }
      }
    }
  }), []);

  return (
    <div className="h-[400px] w-full">
      <Line data={chartData} options={options} />
    </div>
  );
}
