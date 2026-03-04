import { useState } from 'react'
import InputForm from '../components/InputForm.jsx'
import Dashboard from '../components/Dashboard.jsx'

function Simulation() {
  const [params, setParams] = useState({
    income: 0,
    expenses: 0,
    savings: 0,
    goal: 0,
    years: 1,
    emi: 0
  })

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white shadow-sm rounded-lg p-6 border border-slate-200">
        <InputForm onSubmit={setParams} />
      </div>
      <div className="bg-white shadow-sm rounded-lg p-6 border border-slate-200">
        <Dashboard params={params} />
      </div>
    </div>
  )
}

export default Simulation
