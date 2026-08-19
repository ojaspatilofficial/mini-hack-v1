import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BeneficiaryPortal from './components/BeneficiaryPortal';
import NgoDashboard from './components/NgoDashboard';
import ApplicationModal from './components/ApplicationModal';
import { 
  getPrograms, 
  getApplications, 
  submitApplication, 
  updateAppStatus, 
  createProgram 
} from './services/api';
import { SAMPLE_PROGRAMS, INITIAL_SUBMISSIONS } from './data/samplePrograms';
import { HeartHandshake, CheckCircle2 } from 'lucide-react';

function App() {
  const [activePortal, setActivePortal] = useState('beneficiary'); // 'beneficiary' | 'ngo'
  const [programs, setPrograms] = useState(SAMPLE_PROGRAMS);
  const [applications, setApplications] = useState(INITIAL_SUBMISSIONS);
  const [activeApplicationContext, setActiveApplicationContext] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Load programs & applications on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [progs, apps] = await Promise.all([
          getPrograms(),
          getApplications()
        ]);
        if (progs && progs.length) setPrograms(progs);
        if (apps && apps.length) setApplications(apps);
      } catch (err) {
        console.warn('Using local dataset:', err);
      }
    }
    loadData();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleStartApplication = (context) => {
    setActiveApplicationContext(context);
    setIsModalOpen(true);
  };

  const handleApplicationSubmitted = async (newSubmission) => {
    // Save to API / LocalStorage
    const saved = await submitApplication(newSubmission);
    setApplications(prev => [saved, ...prev.filter(a => a.id !== saved.id)]);
    showToast(`Application #${saved.id} submitted! Visible in NGO dashboard.`);
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    await updateAppStatus(appId, newStatus);
    setApplications(prev =>
      prev.map(app => (app.id === appId ? { ...app, status: newStatus } : app))
    );
    showToast(`Status updated to "${newStatus}" for #${appId}`);
  };

  const handleCreateProgram = async (newProgData) => {
    const created = await createProgram(newProgData);
    setPrograms(prev => [created, ...prev]);
    showToast(`New scheme "${created.name}" published!`);
  };

  const pendingCount = applications.filter(a => a.status === 'Pending Review').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 px-4 py-3 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-2xl shadow-emerald-500/30 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-slate-950" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        activePortal={activePortal}
        setActivePortal={setActivePortal}
        pendingCount={pendingCount}
        totalApplications={applications.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activePortal === 'beneficiary' ? (
          <BeneficiaryPortal
            programs={programs}
            onStartApplication={handleStartApplication}
          />
        ) : (
          <NgoDashboard
            applications={applications}
            programs={programs}
            onUpdateStatus={handleUpdateStatus}
            onCreateProgram={handleCreateProgram}
          />
        )}
      </main>

      {/* Application Multi-step Modal */}
      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        applicationContext={activeApplicationContext}
        onSubmitSuccess={handleApplicationSubmitted}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-950 py-8 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <HeartHandshake className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-white">Sahayak Platform</span>
            <span>— Bridging grassroots beneficiaries with verified NGO funding</span>
          </div>

          <div className="flex items-center space-x-4 text-slate-400">
            <span>Transparent Rules Engine</span>
            <span>•</span>
            <span>Privacy-First KYC</span>
            <span>•</span>
            <button 
              onClick={() => setActivePortal(activePortal === 'beneficiary' ? 'ngo' : 'beneficiary')}
              className="text-emerald-400 hover:underline font-semibold"
            >
              Switch to {activePortal === 'beneficiary' ? 'NGO Staff View' : 'Beneficiary View'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
