import { useState } from 'react'

function InputForm({ onSubmit }) {
  const [income, setIncome] = useState('')
  const [expenses, setExpenses] = useState('')
  const [savings, setSavings] = useState('')
  const [goal, setGoal] = useState('')
  const [years, setYears] = useState('')
  const [emi, setEmi] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({
      income: Number(income) || 0,
      expenses: Number(expenses) || 0,
      savings: Number(savings) || 0,
      goal: Number(goal) || 0,
      years: Number(years) || 1,
      emi: Number(emi) || 0
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="input" placeholder="Monthly Income" type="number" value={income} onChange={(e) => setIncome(e.target.value)} />
        <input className="input" placeholder="Monthly Expenses" type="number" value={expenses} onChange={(e) => setExpenses(e.target.value)} />
        <input className="input" placeholder="Current Savings" type="number" value={savings} onChange={(e) => setSavings(e.target.value)} />
        <input className="input" placeholder="Goal Amount" type="number" value={goal} onChange={(e) => setGoal(e.target.value)} />
        <input className="input" placeholder="Years to Goal" type="number" value={years} onChange={(e) => setYears(e.target.value)} />
        <input className="input" placeholder="EMI (optional)" type="number" value={emi} onChange={(e) => setEmi(e.target.value)} />
      </div>
      <button className="bg-primary text-white px-4 py-2 rounded-lg" type="submit">Update</button>
    </form>
  )
}

export default InputForm
