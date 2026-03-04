import React, { useMemo } from 'react';
import { Activity } from 'lucide-react';

function formatPercent(value) {
  if (!Number.isFinite(value)) return '—';
  return `${Math.round(value * 100)}%`;
}

function getHealthScore(income, expenses) {
  if (!Number.isFinite(income) || income <= 0) {
    return { score: 0, label: 'Unavailable', tone: 'zinc' };
  }

  if (Number.isFinite(expenses) && expenses > income) {
    return { score: 30, label: 'Risky', tone: 'red' };
  }

  const savingsRate = (income - expenses) / income;

  if (savingsRate > 0.4) return { score: 90, label: 'Excellent', tone: 'emerald' };
  if (savingsRate >= 0.2) return { score: 70, label: 'Good', tone: 'amber' };
  return { score: 50, label: 'Average', tone: 'blue' };
}

export default function FinancialHealthCard({ income, expenses }) {
  const { score, label, tone } = useMemo(
    () => getHealthScore(Number(income), Number(expenses)),
    [income, expenses]
  );

  const savingsRate = useMemo(() => {
    const inc = Number(income);
    const exp = Number(expenses);
    if (!Number.isFinite(inc) || inc <= 0 || !Number.isFinite(exp)) return null;
    return (inc - exp) / inc;
  }, [income, expenses]);

  const toneStyles =
    tone === 'emerald'
      ? { ring: 'ring-emerald-100', bg: 'bg-emerald-50', text: 'text-emerald-600' }
      : tone === 'amber'
      ? { ring: 'ring-amber-100', bg: 'bg-amber-50', text: 'text-amber-600' }
      : tone === 'red'
      ? { ring: 'ring-red-100', bg: 'bg-red-50', text: 'text-red-600' }
      : tone === 'blue'
      ? { ring: 'ring-blue-100', bg: 'bg-blue-50', text: 'text-blue-600' }
      : { ring: 'ring-zinc-100', bg: 'bg-zinc-50', text: 'text-zinc-600' };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-lg border border-zinc-100 flex flex-col items-center text-center">
      <div
        className={[
          'w-16 h-16 rounded-full flex items-center justify-center mb-4 ring-1',
          toneStyles.bg,
          toneStyles.ring,
        ].join(' ')}
      >
        <Activity className={['w-8 h-8', toneStyles.text].join(' ')} />
      </div>
      <span className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-1">
        Financial Health
      </span>
      <div className="flex items-baseline gap-2">
        <span className={['text-4xl font-black', toneStyles.text].join(' ')}>{score}</span>
        <span className="text-sm font-bold text-zinc-500">{label}</span>
      </div>
      <div className="mt-3 text-xs text-zinc-500">
        Savings rate: <span className="font-semibold text-zinc-700">{formatPercent(savingsRate)}</span>
      </div>
    </div>
  );
}

