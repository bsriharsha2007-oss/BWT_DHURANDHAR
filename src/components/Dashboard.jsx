import React from 'react';
import { motion } from 'motion/react';
import { Wallet, Target, TrendingUp } from 'lucide-react';
import Charts from './Charts';
import AISuggestions from './AISuggestions';
import FinancialHealthCard from './FinancialHealthCard';

export default function Dashboard({ formData, projectionData, aiOpinion, aiRequestId }) {
  if (!projectionData) return null;

  const savingsRate = Math.round(((formData.income - formData.expenses) / formData.income) * 100);
  const finalBalanced = projectionData.balanced[projectionData.balanced.length - 1];
  const goalGap = formData.goal - finalBalanced;

  return (
    <div className="space-y-8">
      {/* Financial Results Dashboard */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
          <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
          Financial Results Dashboard
        </h2>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <FinancialHealthCard income={formData.income} expenses={formData.expenses} />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-3xl shadow-lg border border-zinc-100 flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
            <Wallet className="w-8 h-8 text-blue-600" />
          </div>
          <span className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-1">Savings Rate</span>
          <span className="text-4xl font-black text-blue-600">
            {savingsRate}%
          </span>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-3xl shadow-lg border border-zinc-100 flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center mb-4">
            <Target className="w-8 h-8 text-purple-600" />
          </div>
          <span className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-1">
            Goal Gap
          </span>
          <span className="text-4xl font-black text-purple-600">
            {goalGap <= 0
              ? 'Met'
              : `₹${Math.round(goalGap).toLocaleString('en-IN')}`}
          </span>
        </motion.div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-zinc-100">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
            <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
            Projection Chart
          </h2>
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest">
            <TrendingUp className="w-4 h-4" /> Real-time Simulation
          </div>
        </div>
        <Charts data={projectionData} />
      </div>

      {/* AI Suggestions */}
      <AISuggestions 
        formData={formData} 
        projectionData={projectionData}
        aiOpinion={aiOpinion}
        aiRequestId={aiRequestId}
      />
    </div>
  );
}
