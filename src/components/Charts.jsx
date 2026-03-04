import { useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale } from 'chart.js'
ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale)

function Charts({ series }) {
  const data = useMemo(() => {
    const labels = series.map((p) => p.label)
    return {
      labels,
      datasets: [
        {
          label: 'Projected Savings',
          data: series.map((p) => p.value),
          borderColor: '#0ea5e9',
          backgroundColor: 'rgba(14,165,233,0.2)',
          tension: 0.25
        }
      ]
    }
  }, [series])
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true }, title: { display: true, text: 'Projection' } },
    scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(0,0,0,0.05)' } } }
  }
  return (
    <div className="h-64 bg-white border border-slate-200 rounded-lg p-4">
      <Line data={data} options={options} />
    </div>
  )
}

export default Charts
