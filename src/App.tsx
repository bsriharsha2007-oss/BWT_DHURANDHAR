import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Simulation from './pages/Simulation';
import HowItWorks from './pages/HowItWorks';

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />
      
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/simulation" element={<Simulation />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
        </Routes>
      </main>

      <footer className="bg-white border-t border-zinc-200 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-zinc-400 text-sm">
            &copy; {new Date().getFullYear()} FutureMe AI. For educational purposes only. 
            Always consult with a professional financial advisor.
          </p>
        </div>
      </footer>
    </div>
  );
}
