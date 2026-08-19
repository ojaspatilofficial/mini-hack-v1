import React from 'react';
import { Sparkles, ShieldCheck, Users, Building2, Globe2, BookOpenCheck } from 'lucide-react';

export default function Header({ activePortal, setActivePortal, pendingCount, totalApplications }) {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-400/30">
              <Sparkles className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent">
                  Sahayak
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  AI v2.4
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                सहायक • AI Beneficiary Discovery & Transparent NGO Matching
              </p>
            </div>
          </div>

          {/* Navigation Mode Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-slate-800/90 border border-slate-700/80 shadow-inner">
            <button
              onClick={() => setActivePortal('beneficiary')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activePortal === 'beneficiary'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Beneficiary Portal</span>
            </button>

            <button
              onClick={() => setActivePortal('ngo')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                activePortal === 'ngo'
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-900/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>NGO Staff Dashboard</span>
              {pendingCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 text-[11px] font-bold rounded-full bg-amber-500 text-slate-950 animate-bounce">
                  {pendingCount}
                </span>
              )}
            </button>
          </div>

          {/* Right Info & Language Selector */}
          <div className="hidden lg:flex items-center space-x-4 text-xs text-slate-300">
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700">
              <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
              <select className="bg-transparent border-none text-slate-200 text-xs focus:outline-none cursor-pointer">
                <option value="en" className="bg-slate-800">English</option>
                <option value="hi" className="bg-slate-800">हिंदी (Hindi)</option>
                <option value="mr" className="bg-slate-800">मराठी (Marathi)</option>
              </select>
            </div>

            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/50 text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold">{totalApplications} Applications Tracked</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
