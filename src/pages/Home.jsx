import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, ArrowRight, ShieldCheck, PieChart, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-50 overflow-hidden">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-32 relative">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50"></div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-bold mb-8 border border-emerald-100">
              <Zap className="w-4 h-4" /> Powered by Financial AI
            </span>
            <h1 className="text-6xl md:text-7xl font-black text-zinc-900 leading-[1.1] tracking-tight mb-8">
              FutureMe – AI Financial <br />
              <span className="text-emerald-600">Digital Twin</span>
            </h1>
            <p className="text-xl text-zinc-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Predict your financial future before making life-changing decisions. 
              Simulate growth, adjust for inflation, and reach your goals faster.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/simulation')}
                className="group bg-zinc-900 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-zinc-800 transition-all flex items-center gap-3 shadow-xl shadow-zinc-200 active:scale-95"
              >
                Start Simulation
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/how-it-works')}
                className="px-10 py-5 rounded-2xl font-bold text-lg text-zinc-600 hover:bg-zinc-100 transition-all"
              >
                How it works
              </button>
            </div>
          </motion.div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32">
          {[
            {
              icon: <ShieldCheck className="w-8 h-8 text-emerald-600" />,
              title: "Risk Assessment",
              desc: "Compare safe, balanced, and aggressive growth scenarios tailored to your profile."
            },
            {
              icon: <TrendingUp className="w-8 h-8 text-blue-600" />,
              title: "Inflation Adjusted",
              desc: "See your future wealth in today's purchasing power with automatic inflation modeling."
            },
            {
              icon: <PieChart className="w-8 h-8 text-purple-600" />,
              title: "AI Insights",
              desc: "Get personalized suggestions based on your debt-to-income ratio and savings rate."
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * i, duration: 0.5 }}
              className="bg-white p-8 rounded-3xl shadow-lg border border-zinc-100 hover:shadow-xl transition-shadow"
            >
              <div className="mb-6">{feature.icon}</div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">{feature.title}</h3>
              <p className="text-zinc-500 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
