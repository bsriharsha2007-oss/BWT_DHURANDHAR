import Charts from './Charts.jsx'
import AISuggestions from './AISuggestions.jsx'
import { project } from '../utils/simulation.js'

function Dashboard({ params }) {
  const result = project(params)
  const score = Math.max(0, Math.min(100, Math.round(result.progressPct || 0)))
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold text-slate-900">Dashboard</div>
        <div className="text-sm text-slate-600">Financial Score</div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Charts series={result.series} />
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
          <div className="text-4xl font-bold text-slate-900">{score}</div>
          <div className="text-slate-600 mt-2">out of 100</div>
        </div>
      </div>
      <AISuggestions result={result} />
    </div>
  )
}

export default Dashboard
