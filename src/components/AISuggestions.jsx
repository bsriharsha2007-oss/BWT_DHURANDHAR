function AISuggestions({ result }) {
  const suggestion = result.progressPct >= 100
    ? 'You are on track to reach your goal.'
    : 'Increase monthly savings or extend your timeline to improve progress.'
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6">
      <div className="text-lg font-semibold text-slate-900">AI Suggestions</div>
      <p className="mt-2 text-slate-600">{suggestion}</p>
    </div>
  )
}

export default AISuggestions
