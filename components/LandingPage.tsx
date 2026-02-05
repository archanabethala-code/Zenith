
import React from 'react';
import { Stethoscope, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

interface Props {
  onSignInClick: () => void;
}

const LandingPage: React.FC<Props> = ({ onSignInClick }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="h-20 flex items-center justify-between px-8 md:px-20 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center shadow-lg">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tighter text-slate-900 dark:text-white">Zenith</span>
        </div>
        <button 
          onClick={onSignInClick}
          className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-bold text-sm hover:scale-105 transition-transform shadow-xl"
        >
          Sign In to Portal
        </button>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <span className="px-4 py-1.5 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 rounded-full text-xs font-bold uppercase tracking-widest mb-6 inline-block">
            Next Generation Clinical Systems
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
            Streamlining Care, <br/><span className="text-teal-600">Saving Lives.</span>
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mb-10 leading-relaxed">
            A specialized terminal for modern clinics. Seamlessly coordinate between front-desk operations and medical consultations with real-time diagnostic synchronization.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={onSignInClick} className="flex items-center justify-center gap-2 px-8 py-4 bg-teal-600 text-white rounded-2xl font-bold hover:bg-teal-700 transition-all shadow-xl shadow-teal-500/20 group">
              Get Started <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-6xl w-full">
          <FeatureCard icon={<Zap className="text-amber-500"/>} title="Instant Sync" desc="Real-time data transfer between receptionist and doctor terminals." />
          <FeatureCard icon={<ShieldCheck className="text-teal-500"/>} title="HIPAA Compliant" desc="Military-grade encryption for all patient diagnostic reports." />
          <FeatureCard icon={<Stethoscope className="text-blue-500"/>} title="Clinician-First" desc="Optimized queue management for medical professionals." />
        </div>
      </section>

      <footer className="py-8 px-8 border-t border-slate-200 dark:border-slate-800 text-center text-slate-400 text-xs">
        &copy; 2024 Zenith. All professional rights reserved.
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: any) => (
  <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-left hover:shadow-2xl transition-all hover:-translate-y-2">
    <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
    <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
  </div>
);

export default LandingPage;