import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, LineChart, ShieldCheck, Database, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: <LineChart className="w-5 h-5 text-emerald-600" />,
      title: 'Enter your numbers',
      desc: 'Add income, expenses, savings, goal, years, and EMI to model your current financial situation.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-blue-600" />,
      title: 'We run projections',
      desc: 'We simulate Safe (5%), Balanced (10%), and Aggressive (18%) growth and adjust results for 6% inflation.',
    },
    {
      icon: <Sparkles className="w-5 h-5 text-purple-600" />,
      title: 'Get AI guidance',
      desc: 'Gemini reviews your inputs + projections and returns personalized suggestions and next steps.',
    },
    {
      icon: <Database className="w-5 h-5 text-zinc-600" />,
      title: 'Save simulations (optional)',
      desc: 'If Firebase is configured, your inputs + results are stored in Firestore so you can track runs over time.',
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="bg-white border border-zinc-100 shadow-xl rounded-3xl p-10 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-100 rounded-full blur-3xl opacity-60" />
          <div className="absolute -bottom-28 -left-28 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-60" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-50 border border-zinc-200 text-zinc-700 text-sm font-semibold">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              How it works
            </div>

            <h1 className="mt-6 text-4xl md:text-5xl font-black tracking-tight text-zinc-900">
              Your financial digital twin, explained.
            </h1>
            <p className="mt-4 text-lg text-zinc-600 max-w-2xl leading-relaxed">
              This app helps you understand how your savings could grow under different scenarios,
              and gives AI-guided suggestions to improve your plan.
            </p>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
              {steps.map((s, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center">
                      {s.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-extrabold text-zinc-900">
                        {idx + 1}. {s.title}
                      </div>
                      <p className="mt-1 text-sm text-zinc-600 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col sm:flex-row items-center gap-3">
              <Link
                to="/simulation"
                className="w-full sm:w-auto bg-zinc-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200 flex items-center justify-center gap-2"
              >
                Start Simulation <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-zinc-700 hover:bg-zinc-100 transition-all text-center"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 text-sm text-zinc-500">
          Note: Projections are simplified and for educational use only.
        </div>
      </div>
    </div>
  );
}

