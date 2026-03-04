import React from 'react';
import { TrendingUp, Shield, Zap } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-zinc-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link
        to="/"
        className="flex items-center gap-2 cursor-pointer"
      >
        <div className="bg-emerald-600 p-1.5 rounded-lg">
          <TrendingUp className="text-white w-6 h-6" />
        </div>
        <span className="text-xl font-bold tracking-tight text-zinc-900">
          Future<span className="text-emerald-600">Me</span>
        </span>
      </Link>
      
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-4 text-sm font-medium text-zinc-500">
          <NavLink
            to="/simulation"
            className="hover:text-emerald-600 cursor-pointer transition-colors"
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/simulation"
            className="hover:text-emerald-600 cursor-pointer transition-colors"
          >
            Simulations
          </NavLink>
          <NavLink
            to="/how-it-works"
            className="hover:text-emerald-600 cursor-pointer transition-colors"
          >
            How it works
          </NavLink>
        </div>
        <Link
          to="/simulation"
          className="bg-zinc-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-zinc-800 transition-all shadow-sm"
        >
          New Simulation
        </Link>
      </div>
    </nav>
  );
}
