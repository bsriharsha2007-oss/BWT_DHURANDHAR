import React, { useMemo } from 'react';
import { AlertCircle, Target, TrendingDown, Info, Sparkles } from 'lucide-react';

function formatINR(n) {
  const value = Number(n);
  if (!Number.isFinite(value)) return '₹—';
  return `₹${Math.round(value).toLocaleString('en-IN')}`;
}

export default function AISuggestions({ formData, projectionData, aiOpinion, aiRequestId }) {
  const suggestions = [];
  const { income = 0, expenses = 0, emi = 0, goal = 0, years = 0 } = formData ?? {};

  const safeIncome = Number(income);
  const safeExpenses = Number(expenses);
  const safeEmi = Number(emi);
  const safeGoal = Number(goal);
  const safeYears = Number(years);

  const savingsRate =
    safeIncome > 0 ? (safeIncome - safeExpenses) / safeIncome : 0;

  // If EMI > 30% income
  if (safeIncome > 0 && safeEmi > safeIncome * 0.3) {
    suggestions.push({
      tone: 'warning',
      icon: <AlertCircle className="w-5 h-5 text-red-500" />,
      title: 'High debt burden detected.',
      items: ['Your EMI is above 30% of your income. Consider reducing debt or refinancing.'],
    });
  }

  // If final projection < goal
  const series = projectionData?.balanced ?? projectionData?.aggressive ?? null;
  const finalProjection =
    Array.isArray(series) && series.length > 0 ? Number(series[series.length - 1]) : null;

  if (Number.isFinite(finalProjection) && Number.isFinite(safeGoal) && finalProjection < safeGoal) {
    suggestions.push({
      tone: 'risk',
      icon: <Target className="w-5 h-5 text-amber-600" />,
      title: 'Goal may be out of reach.',
      items: [
        'Your financial goal may not be achievable within selected years.',
        'Consider increasing monthly savings or extending your timeline.',
      ],
    });
  }

  // If savings rate < 20%
  if (safeIncome > 0 && savingsRate < 0.2) {
    suggestions.push({
      tone: 'info',
      icon: <TrendingDown className="w-5 h-5 text-blue-600" />,
      title: 'Low savings rate.',
      items: ['Consider reducing expenses to lift your savings rate above 20%.'],
    });
  }

  const baselineTips = useMemo(() => {
    const tips = [];
    const net = safeIncome - safeExpenses - safeEmi;
    const finalBalanced =
      Array.isArray(projectionData?.balanced) && projectionData.balanced.length
        ? Number(projectionData.balanced[projectionData.balanced.length - 1])
        : null;

    tips.push(
      `Your net monthly savings is about ${formatINR(net)}. Try to increase this by 5–10% over the next 2–3 months.`
    );

    if (safeIncome > 0) {
      tips.push(
        `Your savings rate is about ${Math.round(savingsRate * 100)}%. A good next target is 20–30% if feasible.`
      );
    }

    if (Number.isFinite(finalBalanced) && Number.isFinite(safeGoal)) {
      const gap = safeGoal - finalBalanced;
      if (gap > 0) {
        tips.push(
          `You’re short by ~${formatINR(gap)} (balanced scenario). Consider increasing monthly investment/SIP or extending the timeline.`
        );
      } else {
        tips.push(
          `You meet the goal in the balanced scenario. Focus on consistency, rebalancing yearly, and keeping EMIs under control.`
        );
      }
    }

    tips.push('Build an emergency fund covering 3–6 months of expenses.');
    tips.push('Automate investing (e.g. monthly SIP) right after salary credit.');

    return tips.slice(0, 6);
  }, [projectionData, safeExpenses, safeGoal, safeIncome, safeEmi, savingsRate]);

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl border border-zinc-100 h-full">
      <h2 className="text-2xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
        <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
        AI Suggestions
      </h2>
      
      <div className="space-y-4">
        {aiOpinion ? (
          <div className="p-5 rounded-2xl border bg-emerald-50 border-emerald-100">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <Sparkles className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-extrabold text-zinc-900">
                  Gemini’s view ({aiOpinion.riskLevel} risk)
                </div>
                {aiRequestId && (
                  <div className="mt-1 text-[11px] text-zinc-500">
                    Run id: <span className="font-mono">{aiRequestId}</span>
                  </div>
                )}
                <p className="mt-2 text-sm text-zinc-800 leading-relaxed">
                  {aiOpinion.summary}
                </p>
                {Array.isArray(aiOpinion.recommendations) && aiOpinion.recommendations.length > 0 && (
                  <ul className="mt-3 space-y-1 text-sm text-zinc-700 list-disc pl-5">
                    {aiOpinion.recommendations.map((item, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        ) : suggestions.length > 0 ? (
          suggestions.map((s, i) => {
          const box =
            s.tone === 'warning'
              ? 'bg-red-50 border-red-100'
              : s.tone === 'risk'
              ? 'bg-amber-50 border-amber-100'
              : 'bg-blue-50 border-blue-100';

          return (
            <div key={i} className={['p-5 rounded-2xl border', box].join(' ')}>
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{s.icon}</div>
                <div className="min-w-0">
                  <div className="text-sm font-extrabold text-zinc-900">{s.title}</div>
                  <ul className="mt-2 space-y-1 text-sm text-zinc-700 list-disc pl-5">
                    {s.items.map((item, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })) : (
          <div className="p-5 rounded-2xl border bg-blue-50 border-blue-100">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <Info className="w-5 h-5 text-blue-600" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-extrabold text-zinc-900">Suggestions</div>
                <ul className="mt-2 space-y-1 text-sm text-zinc-700 list-disc pl-5">
                  {baselineTips.map((tip, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {tip}
                    </li>
                  ))}
                </ul>
                <div className="mt-3 text-xs text-zinc-500">
                  Tip: set <span className="font-semibold">VITE_GEMINI_API_KEY</span> to get personalized Gemini advice.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
