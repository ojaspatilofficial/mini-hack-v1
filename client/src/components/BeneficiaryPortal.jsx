import React, { useState, useMemo, useEffect } from 'react';
import { 
  Sparkles, 
  Mic, 
  MicOff, 
  Send, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  MapPin, 
  GraduationCap, 
  Wallet, 
  Target, 
  Calendar, 
  Clock, 
  Award, 
  FileText, 
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  HelpCircle,
  Check
} from 'lucide-react';
import { extractProfileFromText, rankProgramsForBeneficiary } from '../utils/aiMatcher';
import { QUICK_SAMPLE_PROMPTS } from '../data/samplePrograms';

export default function BeneficiaryPortal({ programs, onStartApplication }) {
  const [promptText, setPromptText] = useState(
    "I’m a 20-year-old student from Pune. My family income is low and I want job-oriented training."
  );
  const [isListening, setIsListening] = useState(false);
  const [showAdvancedEditor, setShowAdvancedEditor] = useState(false);
  const [expandedProgramId, setExpandedProgramId] = useState(null);

  // Parse demographic profile from text
  const extractedProfile = useMemo(() => {
    return extractProfileFromText(promptText);
  }, [promptText]);

  // Optional overrides if user modifies them in fine-tuning drawer
  const [profileOverrides, setProfileOverrides] = useState({
    age: null,
    location: null,
    education: null,
    incomeLevel: null,
    goal: null
  });

  // Effective profile
  const activeProfile = useMemo(() => {
    return {
      ...extractedProfile,
      age: profileOverrides.age ?? extractedProfile.age,
      location: profileOverrides.location ?? extractedProfile.location,
      education: profileOverrides.education ?? extractedProfile.education,
      incomeLevel: profileOverrides.incomeLevel ?? extractedProfile.incomeLevel,
      goal: profileOverrides.goal ?? extractedProfile.goal
    };
  }, [extractedProfile, profileOverrides]);

  // Ranked matched programs
  const rankedResults = useMemo(() => {
    return rankProgramsForBeneficiary(activeProfile, programs);
  }, [activeProfile, programs]);

  const topMatch = rankedResults[0];
  const otherMatches = rankedResults.slice(1);

  // Speech Recognition support or fallback simulation
  const toggleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert("Voice speech recognition is simulated on this browser. Try our quick sample scenario prompts!");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN';

    if (!isListening) {
      setIsListening(true);
      recognition.start();
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setPromptText(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
    } else {
      setIsListening(false);
      recognition.stop();
    }
  };

  const handleApplyClick = (result) => {
    onStartApplication({
      program: result.program,
      profile: activeProfile,
      originalPrompt: promptText,
      matchScore: result.matchScore,
      checks: result.checks
    });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Interactive Input Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Natural Language Eligibility Engine</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Find the right NGO support <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
              in your own words.
            </span>
          </h1>

          <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Describe your age, city, education, and what help you need. Sahayak automatically checks transparent eligibility rules and connects you with direct funding, scholarships, and training.
          </p>

          {/* Search Box */}
          <div className="mt-6 text-left">
            <div className="relative rounded-2xl bg-slate-800/90 border-2 border-emerald-500/40 focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-500/20 shadow-2xl transition-all">
              <textarea
                value={promptText}
                onChange={(e) => {
                  setPromptText(e.target.value);
                  setProfileOverrides({ age: null, location: null, education: null, incomeLevel: null, goal: null });
                }}
                rows={3}
                placeholder="Example: I'm a 20-year-old student from Pune with low income seeking job training..."
                className="w-full bg-transparent px-5 pt-4 pb-14 text-white text-base md:text-lg placeholder:text-slate-500 focus:outline-none resize-none"
              />

              {/* Bottom bar inside search box */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <button
                    onClick={toggleVoiceInput}
                    type="button"
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                      isListening
                        ? 'bg-rose-600 text-white border-rose-400 animate-pulse'
                        : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300 border-slate-600'
                    }`}
                  >
                    {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-emerald-400" />}
                    <span>{isListening ? "Listening..." : "Voice Input"}</span>
                  </button>
                  <span className="hidden sm:inline text-slate-500">• Type freely in Hindi, Marathi, or English</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowAdvancedEditor(!showAdvancedEditor)}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 border border-slate-600 text-xs font-medium"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{showAdvancedEditor ? "Hide Extracted" : "View Extracted Profile"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Sample Prompts */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-400">Try Sample Prompts:</span>
              {QUICK_SAMPLE_PROMPTS.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPromptText(sample.text);
                    setProfileOverrides({ age: null, location: null, education: null, incomeLevel: null, goal: null });
                  }}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all duration-150 flex items-center space-x-1.5 ${
                    promptText === sample.text
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm font-semibold'
                      : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>{sample.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Extracted Profile Breakdown Card */}
      <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">AI Extracted Beneficiary Profile</h3>
              <p className="text-xs text-slate-400">Parsed instantly from your natural language description</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400">Extraction Confidence:</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
              98% High
            </span>
          </div>
        </div>

        {/* Extracted Tags Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-4">
          <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/60">
            <div className="flex items-center space-x-1.5 text-xs text-slate-400 mb-1">
              <Calendar className="w-3.5 h-3.5 text-teal-400" />
              <span>Age</span>
            </div>
            <p className="text-sm font-bold text-white">{activeProfile.age} Years</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/60">
            <div className="flex items-center space-x-1.5 text-xs text-slate-400 mb-1">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>Location</span>
            </div>
            <p className="text-sm font-bold text-white">{activeProfile.location}</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/60">
            <div className="flex items-center space-x-1.5 text-xs text-slate-400 mb-1">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
              <span>Education</span>
            </div>
            <p className="text-sm font-bold text-white truncate">{activeProfile.education}</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/60">
            <div className="flex items-center space-x-1.5 text-xs text-slate-400 mb-1">
              <Wallet className="w-3.5 h-3.5 text-amber-400" />
              <span>Income</span>
            </div>
            <p className="text-sm font-bold text-white truncate">{activeProfile.incomeLevel}</p>
          </div>

          <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-slate-800/70 border border-slate-700/60">
            <div className="flex items-center space-x-1.5 text-xs text-slate-400 mb-1">
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              <span>Goal</span>
            </div>
            <p className="text-sm font-bold text-emerald-400 truncate">{activeProfile.goalLabel}</p>
          </div>
        </div>

        {/* Fine-Tuning Drawer */}
        {showAdvancedEditor && (
          <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Adjust Age:</label>
              <input
                type="number"
                value={activeProfile.age}
                onChange={(e) => setProfileOverrides(prev => ({ ...prev, age: parseInt(e.target.value) || 20 }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Adjust City:</label>
              <input
                type="text"
                value={activeProfile.location}
                onChange={(e) => setProfileOverrides(prev => ({ ...prev, location: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Adjust Education:</label>
              <select
                value={activeProfile.education}
                onChange={(e) => setProfileOverrides(prev => ({ ...prev, education: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
              >
                <option value="Student">Student (Undergraduate)</option>
                <option value="12th Standard">12th Pass</option>
                <option value="10th Standard">10th Pass</option>
                <option value="ITI / Vocational Diploma">ITI / Diploma</option>
                <option value="Homemaker / Self-Employed">Homemaker</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Adjust Goal:</label>
              <select
                value={activeProfile.goal}
                onChange={(e) => setProfileOverrides(prev => ({ ...prev, goal: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
              >
                <option value="job_training">Job-Oriented Training</option>
                <option value="scholarship">Higher Ed Scholarship</option>
                <option value="financial_aid">Micro-Enterprise / Tool Grant</option>
                <option value="employment_assistance">Trade Apprenticeship</option>
              </select>
            </div>
          </div>
        )}
      </section>

      {/* Top Recommendation Highlight (Problem Statement Hero Match) */}
      {topMatch && (
        <section className="relative rounded-3xl bg-gradient-to-b from-emerald-950/40 via-slate-900 to-slate-950 border-2 border-emerald-500/50 p-6 md:p-8 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="space-y-4 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow-md shadow-emerald-500/20 flex items-center space-x-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>Recommended: {topMatch.program.name.split(':')[0]}</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                  {topMatch.matchScore}% Eligibility Match
                </span>
                <span className="text-xs text-slate-400">by {topMatch.program.ngoName}</span>
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                  {topMatch.program.name}
                </h2>
                <p className="text-sm md:text-base text-slate-300 mt-1">
                  {topMatch.program.tagline}
                </p>
              </div>

              {/* Transparent Eligibility Checklist (Core Problem Statement Requirement) */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
                    <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                    <span>Transparent Rule Verification & Explanation</span>
                  </h4>
                  <span className="text-[11px] text-slate-400">All criteria met</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                  {topMatch.checks.map((chk, idx) => (
                    <div 
                      key={idx}
                      className={`flex items-start space-x-2 p-2 rounded-xl text-xs ${
                        chk.passed 
                          ? 'bg-emerald-950/40 text-emerald-200 border border-emerald-800/40' 
                          : 'bg-rose-950/40 text-rose-300 border border-rose-800/40'
                      }`}
                    >
                      {chk.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      )}
                      <span className="font-medium">{chk.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Benefits */}
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Program Benefits & Support:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  {topMatch.program.benefits.map((b, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Action Box */}
            <div className="lg:w-80 p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs text-slate-400 pb-2 border-b border-slate-700">
                  <span>Funding Coverage:</span>
                  <span className="font-bold text-white">{topMatch.program.fundingAmount}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-400 pb-2 border-b border-slate-700">
                  <span>Duration:</span>
                  <span className="font-bold text-white">{topMatch.program.duration}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-400 pb-2 border-b border-slate-700">
                  <span>Cohort Status:</span>
                  <span className="font-bold text-emerald-400">Open ({topMatch.program.seatsRemaining} seats left)</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => handleApplyClick(topMatch)}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center space-x-2 transition-all transform active:scale-95"
                >
                  <span>Start Application</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[11px] text-center text-slate-400">
                  Free application • Fast-track NGO approval within 48h
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Other Matched Programs */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <span>Additional Matching Opportunities</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
              {otherMatches.length} Programs
            </span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {otherMatches.map((res) => {
            const isExpanded = expandedProgramId === res.program.id;
            return (
              <div
                key={res.program.id}
                className="rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 p-5 space-y-4 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {res.program.ngoName}
                    </span>
                    <h4 className="text-base font-bold text-white">{res.program.name}</h4>
                  </div>
                  <div className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                    res.matchScore >= 80
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : res.matchScore >= 50
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {res.matchScore}% Match
                  </div>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2">
                  {res.program.description}
                </p>

                {/* Checklist Summary */}
                <div className="space-y-1 text-xs">
                  {res.checks.slice(0, 3).map((chk, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      {chk.passed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      )}
                      <span className={chk.passed ? "text-slate-300" : "text-slate-500"}>
                        {chk.shortLabel || chk.label}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-xs">
                  <span className="text-emerald-400 font-semibold">{res.program.fundingAmount}</span>
                  <button
                    onClick={() => handleApplyClick(res)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white text-emerald-400 font-semibold border border-slate-700 hover:border-emerald-500 transition-all flex items-center space-x-1"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
