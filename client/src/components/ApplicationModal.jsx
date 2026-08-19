import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Upload, 
  ShieldCheck, 
  FileCheck, 
  Copy, 
  ExternalLink,
  MessageSquare,
  Building2,
  Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ApplicationModal({ applicationContext, isOpen, onClose, onSubmitSuccess }) {
  if (!isOpen || !applicationContext) return null;

  const { program, profile, originalPrompt, matchScore, checks } = applicationContext;

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: profile.gender === 'female' ? 'Pooja Gaikwad' : 'Rohan Gaikwad',
    phoneNumber: '+91 98231 44520',
    email: 'rohan.gaikwad.pune@gmail.com',
    age: profile.age || 20,
    city: profile.location || 'Pune',
    education: profile.education || 'Student (Undergraduate)',
    incomeLevel: profile.incomeLevel || 'Low (< ₹2.5L/year)',
    bankAccountReady: true,
    agreeTerms: true
  });

  const [trackingId, setTrackingId] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Generate tracking ID on open
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setTrackingId(`SHK-2026-${randomNum}`);
  }, [isOpen]);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }

    if (step === 2) {
      // Finalize submission
      const newSubmission = {
        id: trackingId,
        beneficiaryName: formData.fullName,
        phone: formData.phoneNumber,
        originalPrompt: originalPrompt,
        programId: program.id,
        programName: program.name,
        ngoName: program.ngoName,
        extractedProfile: {
          age: formData.age,
          location: formData.city,
          education: formData.education,
          incomeLevel: formData.incomeLevel,
          goal: profile.goalLabel
        },
        matchScore: matchScore,
        verificationMatrix: {
          ageMatch: true,
          locationMatch: true,
          incomeMatch: true,
          goalMatch: true
        },
        status: "Pending Review",
        submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        documentsUploaded: ["Aadhaar Card (Verified)", "Income Certificate.pdf", "Education Marksheet.pdf"],
        staffNotes: "Application submitted via Sahayak Beneficiary AI Portal with 100% criteria validation."
      };

      onSubmitSuccess(newSubmission);
      setStep(3);
      triggerConfetti();
    }
  };

  const copyTrackingId = () => {
    navigator.clipboard.writeText(trackingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Apply for {program.name.split(':')[0]}</h3>
              <p className="text-xs text-slate-400">Sponsored by {program.ngoName}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Indicator */}
        <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center space-x-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              step >= 1 ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
            }`}>
              1
            </span>
            <span className={step >= 1 ? 'text-white' : 'text-slate-500'}>Auto-filled Profile</span>
          </div>

          <div className="w-8 h-0.5 bg-slate-800" />

          <div className="flex items-center space-x-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              step >= 2 ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
            }`}>
              2
            </span>
            <span className={step >= 2 ? 'text-white' : 'text-slate-500'}>Document Checklist</span>
          </div>

          <div className="w-8 h-0.5 bg-slate-800" />

          <div className="flex items-center space-x-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              step === 3 ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
            }`}>
              3
            </span>
            <span className={step === 3 ? 'text-emerald-400' : 'text-slate-500'}>Confirmation</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {step === 1 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-xs text-emerald-300 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>AI Match Verified ({matchScore}%):</strong> Your age ({formData.age} yrs), location ({formData.city}), and goal fulfill all program requirements.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Beneficiary Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">WhatsApp / Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">City / District</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-medium mb-1">Education Status</label>
                  <input
                    type="text"
                    value={formData.education}
                    onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center space-x-2 transition-all shadow-lg shadow-emerald-500/20"
                >
                  <span>Proceed to Documents</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white">Required Document Checklist</h4>
                <p className="text-xs text-slate-400">
                  The NGO team requires the following proofs for direct disbursement:
                </p>
              </div>

              <div className="space-y-2">
                {program.documentsRequired.map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center space-x-2.5">
                      <FileCheck className="w-4 h-4 text-emerald-400" />
                      <span className="font-medium text-slate-200">{doc}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>Ready for Instant KYC</span>
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-slate-800/40 border border-dashed border-slate-700 flex flex-col items-center justify-center text-center space-y-1 cursor-pointer hover:border-emerald-500/50 transition-colors">
                <Upload className="w-5 h-5 text-slate-400" />
                <p className="text-xs text-slate-300 font-medium">Optional: Upload additional marksheets / ID proof</p>
                <p className="text-[10px] text-slate-500">PDF, JPG, PNG up to 10MB</p>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="consent"
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500"
                />
                <label htmlFor="consent" className="text-xs text-slate-400">
                  I confirm that all details provided match my official records for verification.
                </label>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  disabled={!formData.agreeTerms}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-slate-950 font-black text-xs flex items-center space-x-2 transition-all shadow-lg shadow-emerald-500/20"
                >
                  <span>Submit Application</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="text-center space-y-5 py-3">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 animate-bounce" />
              </div>

              <div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Application Submitted Successfully
                </span>
                <h3 className="text-xl font-extrabold text-white mt-2">
                  You're all set, {formData.fullName.split(' ')[0]}!
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  Your request has been forwarded directly to <strong>{program.ngoName}</strong>'s verification desk.
                </p>
              </div>

              {/* Tracking ID Badge */}
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 max-w-sm mx-auto flex items-center justify-between">
                <div className="text-left">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Application Tracking ID</span>
                  <p className="text-base font-mono font-bold text-emerald-400">{trackingId}</p>
                </div>

                <button
                  onClick={copyTrackingId}
                  className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium flex items-center space-x-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </button>
              </div>

              {/* WhatsApp Notification simulated */}
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/50 max-w-md mx-auto flex items-center space-x-2.5 text-xs text-emerald-200 text-left">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  SMS & WhatsApp updates have been sent to <strong>{formData.phoneNumber}</strong>.
                </span>
              </div>

              <div className="pt-2 flex justify-center">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
                >
                  Done & Back to Portal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
