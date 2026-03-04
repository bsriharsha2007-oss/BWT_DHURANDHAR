import { Link } from 'react-router-dom'

function Home() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-16">
      <div className="bg-white shadow-sm rounded-lg p-10 border border-slate-200 text-center">
        <h1 className="text-3xl font-bold text-slate-900">FutureMe – AI Financial Digital Twin</h1>
        <p className="mt-4 text-slate-600">Simulate your financial trajectory with an AI-driven digital twin.</p>
        <Link to="/simulation" className="mt-8 inline-block bg-primary text-white px-6 py-3 rounded-lg">Start Simulation</Link>
      </div>
    </main>
  )
}

export default Home
