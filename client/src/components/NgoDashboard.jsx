import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Users, 
  CheckCircle2, 
  Clock, 
  Filter, 
  Search, 
  Eye, 
  FileText, 
  Sparkles, 
  ShieldCheck, 
  Plus,
  X, 
  TrendingUp,
  FolderOpen,
  Calendar,
  DollarSign
} from 'lucide-react';

export default function NgoDashboard({ applications, onUpdateStatus, programs, onCreateProgram }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [programFilter, setProgramFilter] = useState('All');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [activeTab, setActiveTab] = useState('applications'); // 'applications' | 'programs'
  const [isAddProgramOpen, setIsAddProgramOpen] = useState(false);

  // New Program form state
  const [newProg, setNewProg] = useState({
    name: '',
    ngoName: '',
    category: 'job_training',
    badge: 'New Scheme',
    tagline: '',
    description: '',
    minAge: 18,
    maxAge: 35,
    maxAnnualIncome: 250000,
    locations: 'Pune, Mumbai, All Maharashtra',
    fundingAmount: '₹30,000 Support',
    seatsRemaining: 50,
    benefits: 'Tuition waiver, Mentorship, Certificate',
    documentsRequired: 'Aadhaar Card, Income Certificate'
  });

  // Metrics computation
  const metrics = useMemo(() => {
    const total = applications.length;
    const pending = applications.filter(a => a.status === 'Pending Review').length;
    const inReview = applications.filter(a => a.status === 'In Review').length;
    const approved = applications.filter(a => a.status === 'Approved' || a.status === 'Disbursed').length;
    const highMatch = applications.filter(a => a.matchScore >= 95).length;
    return { total, pending, inReview, approved, highMatch };
  }, [applications]);

  // Filtered applications list
  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const matchesSearch = 
        app.beneficiaryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (app.extractedProfile?.location || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.programName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
      const matchesProgram = programFilter === 'All' || app.programId === programFilter;

      return matchesSearch && matchesStatus && matchesProgram;
    });
  }, [applications, searchQuery, statusFilter, programFilter]);

  const handleStatusChange = (appId, newStatus) => {
    onUpdateStatus(appId, newStatus);
    if (selectedApplication && selectedApplication.id === appId) {
      setSelectedApplication(prev => ({ ...prev, status: newStatus }));
    }
  };

  const handleCreateProgramSubmit = (e) => {
    e.preventDefault();
    if (!newProg.name || !newProg.ngoName) return;

    const formatted = {
      id: `prog-${Date.now()}`,
      name: newProg.name,
      ngoName: newProg.ngoName,
      category: newProg.category,
      badge: newProg.badge,
      tagline: newProg.tagline || 'Empowering eligible beneficiaries',
      description: newProg.description || newProg.tagline,
      minAge: Number(newProg.minAge),
      maxAge: Number(newProg.maxAge),
      maxAnnualIncome: Number(newProg.maxAnnualIncome),
      locations: newProg.locations.split(',').map(s => s.trim()),
      allowedEducation: ['any'],
      targetGoals: [newProg.category, 'assistance', 'support'],
      benefits: newProg.benefits.split(',').map(s => s.trim()),
      documentsRequired: newProg.documentsRequired.split(',').map(s => s.trim()),
      duration: '3-6 Months',
      fundingAmount: newProg.fundingAmount,
      seatsRemaining: Number(newProg.seatsRemaining),
      deadline: 'Open Year-Round'
    };

    onCreateProgram(formatted);
    setIsAddProgramOpen(false);
    setNewProg({
      name: '',
      ngoName: '',
      category: 'job_training',
      badge: 'New Scheme',
      tagline: '',
      description: '',
      minAge: 18,
      maxAge: 35,
      maxAnnualIncome: 250000,
      locations: 'Pune, Mumbai, All Maharashtra',
      fundingAmount: '₹30,000 Support',
      seatsRemaining: 50,
      benefits: 'Tuition waiver, Mentorship, Certificate',
      documentsRequired: 'Aadhaar Card, Income Certificate'
    });
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner & Tab Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold text-white">NGO Staff Control Center</h2>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
                Partner Desk
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Automated beneficiary verification, eligibility audit trails, and 1-click disbursement queue.
            </p>
          </div>
        </div>

        {/* View mode switcher */}
        <div className="flex items-center space-x-2 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'applications'
                ? 'bg-indigo-600 text-white font-semibold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Applications Queue ({applications.length})
          </button>
          <button
            onClick={() => setActiveTab('programs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'programs'
                ? 'bg-indigo-600 text-white font-semibold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Active Schemes ({programs.length})
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Total Requests</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-black text-white">{metrics.total}</p>
          <div className="mt-2 text-[11px] text-emerald-400 flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>100% matched by Sahayak AI</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Needs Review</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-amber-400">{metrics.pending}</p>
          <div className="mt-2 text-[11px] text-slate-400">
            <span>Avg. triage time: ~4 mins</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Approved & Enrolled</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400">{metrics.approved}</p>
          <div className="mt-2 text-[11px] text-slate-400">
            <span>Direct beneficiary transfers</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>High-Confidence Matches</span>
            <ShieldCheck className="w-4 h-4 text-teal-400" />
          </div>
          <p className="text-2xl font-black text-teal-300">{metrics.highMatch}</p>
          <div className="mt-2 text-[11px] text-slate-400">
            <span>4/4 rules validated automatically</span>
          </div>
        </div>
      </div>

      {activeTab === 'applications' && (
        <div className="space-y-4">
          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search beneficiary, ID, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto overflow-x-auto">
              <div className="flex items-center space-x-1.5 text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending Review">Pending Review</option>
                  <option value="In Review">In Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Disbursed">Disbursed</option>
                </select>
              </div>

              <div className="flex items-center space-x-1.5 text-xs">
                <span className="text-slate-400">Scheme:</span>
                <select
                  value={programFilter}
                  onChange={(e) => setProgramFilter(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
                >
                  <option value="All">All Schemes</option>
                  {programs.map(p => (
                    <option key={p.id} value={p.id}>{p.name.split(':')[0]}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Applications Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Tracking ID</th>
                    <th className="px-4 py-3">Beneficiary</th>
                    <th className="px-4 py-3">Matched Scheme</th>
                    <th className="px-4 py-3">AI Verification</th>
                    <th className="px-4 py-3">Submitted</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3.5 font-mono font-bold text-indigo-400">
                        {app.id}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-white">{app.beneficiaryName}</div>
                        <div className="text-[11px] text-slate-400">
                          {app.extractedProfile?.age} yrs • {app.extractedProfile?.location}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-medium text-slate-200">{app.programName?.split(':')[0]}</div>
                        <div className="text-[10px] text-slate-500">{app.ngoName}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-semibold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>{app.matchScore}% (4/4 passed)</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-slate-400">
                        {app.submittedAt}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          app.status === 'Approved' || app.status === 'Disbursed'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : app.status === 'In Review'
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => setSelectedApplication(app)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 hover:text-white text-indigo-300 font-semibold border border-slate-700 hover:border-indigo-500 transition-all inline-flex items-center space-x-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Review</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredApplications.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-slate-500 text-xs">
                        No applications found matching your search or filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Programs Catalog Tab */}
      {activeTab === 'programs' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-white">Active NGO Support Schemes ({programs.length})</h3>
            <button
              onClick={() => setIsAddProgramOpen(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-indigo-600/30"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Scheme</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {programs.map(prog => (
              <div key={prog.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                      {prog.ngoName}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1">{prog.name}</h3>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                    Active Quota: {prog.seatsRemaining} seats
                  </span>
                </div>

                <p className="text-xs text-slate-300">{prog.tagline}</p>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5 text-xs text-slate-300">
                  <div className="font-bold text-indigo-400 uppercase text-[10px] tracking-wider">
                    Configured Eligibility Rules
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>• Age limit: <strong>{prog.minAge}–{prog.maxAge} yrs</strong></div>
                    <div>• Max Income: <strong>₹{(prog.maxAnnualIncome / 100000).toFixed(1)} Lakh/yr</strong></div>
                    <div>• Locations: <strong>{(prog.locations || []).slice(0, 2).join(', ')}...</strong></div>
                    <div>• Funding: <strong>{prog.fundingAmount}</strong></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Program Modal */}
      {isAddProgramOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-4 my-8">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Create New NGO Scheme</h3>
              <button onClick={() => setIsAddProgramOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProgramSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Scheme / Program Name *</label>
                <input
                  type="text"
                  required
                  value={newProg.name}
                  onChange={(e) => setNewProg({ ...newProg, name: e.target.value })}
                  placeholder="e.g. Medha Solar Technician Grant"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">NGO Organization Name *</label>
                <input
                  type="text"
                  required
                  value={newProg.ngoName}
                  onChange={(e) => setNewProg({ ...newProg, ngoName: e.target.value })}
                  placeholder="e.g. Green Energy Vikas Trust"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Min Age</label>
                  <input
                    type="number"
                    value={newProg.minAge}
                    onChange={(e) => setNewProg({ ...newProg, minAge: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Max Age</label>
                  <input
                    type="number"
                    value={newProg.maxAge}
                    onChange={(e) => setNewProg({ ...newProg, maxAge: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Max Annual Income Ceiling (₹)</label>
                <input
                  type="number"
                  value={newProg.maxAnnualIncome}
                  onChange={(e) => setNewProg({ ...newProg, maxAnnualIncome: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Funding / Benefit Details</label>
                <input
                  type="text"
                  value={newProg.fundingAmount}
                  onChange={(e) => setNewProg({ ...newProg, fundingAmount: e.target.value })}
                  placeholder="e.g. ₹25,000 stipend + kit"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddProgramOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  Publish Scheme
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Application Deep Inspection Drawer / Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-8">
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Application Audit & Review</h3>
                  <p className="text-xs text-slate-400 font-mono">{selectedApplication.id}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedApplication(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              {/* Original Beneficiary Voice / Natural Language Prompt */}
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-800/40 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Original Beneficiary Description</span>
                  </span>
                  <span className="text-[11px] text-slate-400">Natural Language Input</span>
                </div>
                <p className="text-sm font-medium text-white italic">
                  "{selectedApplication.originalPrompt}"
                </p>
              </div>

              {/* AI Extraction & Verification Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Beneficiary Profile</h4>
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Name:</span>
                      <span className="font-bold text-white">{selectedApplication.beneficiaryName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Phone:</span>
                      <span className="font-mono text-slate-300">{selectedApplication.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Age:</span>
                      <span className="text-white">{selectedApplication.extractedProfile?.age} Years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Location:</span>
                      <span className="text-white">{selectedApplication.extractedProfile?.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Education:</span>
                      <span className="text-white">{selectedApplication.extractedProfile?.education}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Income:</span>
                      <span className="text-emerald-400">{selectedApplication.extractedProfile?.incomeLevel}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center justify-between">
                    <span>AI Rule Verification</span>
                    <span>{selectedApplication.matchScore}% Match</span>
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center space-x-2 text-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Age matches program criteria</span>
                    </div>
                    <div className="flex items-center space-x-2 text-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Looking for employment-oriented training</span>
                    </div>
                    <div className="flex items-center space-x-2 text-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Meets the income criteria</span>
                    </div>
                    <div className="flex items-center space-x-2 text-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Program available in your location</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Update Application Status</h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleStatusChange(selectedApplication.id, 'Pending Review')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                      selectedApplication.status === 'Pending Review'
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    Pending Review
                  </button>

                  <button
                    onClick={() => handleStatusChange(selectedApplication.id, 'In Review')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                      selectedApplication.status === 'In Review'
                        ? 'bg-indigo-600 text-white border-indigo-400'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    In Review / Document Verification
                  </button>

                  <button
                    onClick={() => handleStatusChange(selectedApplication.id, 'Approved')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                      selectedApplication.status === 'Approved'
                        ? 'bg-emerald-600 text-white border-emerald-400'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    Approve Application
                  </button>

                  <button
                    onClick={() => handleStatusChange(selectedApplication.id, 'Disbursed')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                      selectedApplication.status === 'Disbursed'
                        ? 'bg-teal-500 text-slate-950 border-teal-400 font-bold'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    Mark Disbursed & Enrolled
                  </button>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedApplication(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
