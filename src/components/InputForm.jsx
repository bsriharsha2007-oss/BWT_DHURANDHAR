import React, { useState } from 'react';
import { DollarSign, Calendar, Target, CreditCard, Loader2 } from 'lucide-react';
import { db } from '../firebase/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { calculateProjection } from '../utils/simulation';

const DEFAULT_FORM_DATA = {
  income: 5000,
  expenses: 3000,
  savings: 10000,
  goal: 100000,
  years: 10,
  emi: 500,
};

export default function InputForm({ initialData, onSimulationComplete }) {
  const [formData, setFormData] = useState(() => ({
    ...DEFAULT_FORM_DATA,
    ...(initialData ?? {}),
  }));
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 1) Run the financial simulation locally (deterministic engine).
      const projectionResults = calculateProjection(
        formData.income,
        formData.expenses,
        formData.savings,
        formData.goal,
        formData.years,
        formData.emi,
      );

      // 2) Always notify parent so charts/dashboard update.
      onSimulationComplete?.({ formData, projectionResults });

      // 3) Fire-and-forget save to Firestore so a slow or misconfigured backend
      // never blocks the UI or keeps the button spinning.
      addDoc(collection(db, "simulations"), {
        income: formData.income,
        expenses: formData.expenses,
        savings: formData.savings,
        goal: formData.goal,
        years: formData.years,
        emi: formData.emi,
        projectionResults,
        createdAt: serverTimestamp()
      }).catch((error) => {
        console.error("Error saving simulation:", error);
      });
    } catch (error) {
      console.error("Error running simulation:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl border border-zinc-100">
      <h2 className="text-2xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
        <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
        Financial Input Form
      </h2>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-600 flex items-center gap-2">
            <DollarSign className="w-4 h-4" /> Monthly Income
          </label>
          <input
            type="number"
            name="income"
            required
            value={formData.income}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            placeholder="e.g. 5000"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-600 flex items-center gap-2">
            <CreditCard className="w-4 h-4" /> Monthly Expenses
          </label>
          <input
            type="number"
            name="expenses"
            required
            value={formData.expenses}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            placeholder="e.g. 2000"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-600 flex items-center gap-2">
            <DollarSign className="w-4 h-4" /> Current Savings
          </label>
          <input
            type="number"
            name="savings"
            required
            value={formData.savings}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            placeholder="e.g. 10000"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-600 flex items-center gap-2">
            <Target className="w-4 h-4" /> Goal Amount
          </label>
          <input
            type="number"
            name="goal"
            required
            value={formData.goal}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            placeholder="e.g. 100000"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-600 flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Years to Goal
          </label>
          <input
            type="number"
            name="years"
            required
            value={formData.years}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            placeholder="e.g. 10"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-600 flex items-center gap-2">
            <CreditCard className="w-4 h-4" /> Monthly EMI
          </label>
          <input
            type="number"
            name="emi"
            value={formData.emi}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            placeholder="e.g. 500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full md:col-span-2 mt-4 bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Running Simulation...
            </>
          ) : (
            'Run Simulation'
          )}
        </button>
      </form>
    </div>
  );
}
