export function project({ income = 0, expenses = 0, savings = 0, goal = 0, years = 1, emi = 0 }) {
  const monthlySave = Math.max(0, income - expenses - emi)
  const months = Math.max(1, Math.round(years * 12))
  const series = []
  let balance = savings
  for (let m = 1; m <= months; m++) {
    balance += monthlySave
    series.push({ label: `M${m}`, value: balance })
  }
  const progressPct = goal > 0 ? (balance / goal) * 100 : 0
  return { series, progressPct }
}
