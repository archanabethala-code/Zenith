
import React, { useState } from 'react';
import {
  Activity,
  Clock,
  CheckCircle,
  UserCheck,
  FileText,
  Play,
  Power,
  TrendingUp,
  ArrowLeft,
  Sparkles,
  Inbox,
  ClipboardList
} from 'lucide-react';
import { Appointment, Currency } from '../types';
import { getSmartSummary } from '../services/geminiService';

interface Props {
  appointments: Appointment[];
  onUpdateAppointment: (app: Appointment) => Promise<void>;
  currency: Currency;
  isWorkDayActive: boolean;
  setIsWorkDayActive: (active: boolean) => void;
}

const DoctorPortal: React.FC<Props> = ({ appointments, onUpdateAppointment, currency, isWorkDayActive, setIsWorkDayActive }) => {
  const [selectedPatient, setSelectedPatient] = useState<Appointment | null>(null);
  const [viewTab, setViewTab] = useState<'queue' | 'history'>('queue');
  const [showShiftReport, setShowShiftReport] = useState(false);
  const [shiftSummary, setShiftSummary] = useState<string>('');

  const updateStatus = (id: string, status: any) => {
    const app = appointments.find(a => a.id === id);
    if (app) {
      onUpdateAppointment({ ...app, status });
    }

    // REQUIREMENT: If completed, remove the terminal and return to the registry list
    if (status === 'Completed') {
      setSelectedPatient(null);
    } else if (selectedPatient?.id === id) {
      setSelectedPatient(prev => prev ? { ...prev, status } : null);
    }
  };

  const handleEndShift = async () => {
    // Generate an AI-powered debrief based on the day's encounters
    const summary = await getSmartSummary(appointments.filter(a => a.status === 'Completed'));
    setShiftSummary(summary);
    setShowShiftReport(true);
  };

  const closeShiftReport = () => {
    setIsWorkDayActive(false);
    setShowShiftReport(false);
    setSelectedPatient(null);
  };

  const queue = appointments.filter(a => a.status !== 'Completed' && a.status !== 'Cancelled');
  const finished = appointments.filter(a => a.status === 'Completed');

  const totalPatients = finished.length;
  const totalRev = finished.reduce((sum, a) => sum + a.cost, 0);

  // SPLASH SCREEN: Require Work Day Start
  if (!isWorkDayActive) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-xl w-full text-center space-y-10 animate-in fade-in zoom-in-95 duration-700">
          <div className="w-24 h-24 bg-teal-100 dark:bg-teal-900/30 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-teal-500/10">
            <Activity className="w-12 h-12 text-teal-600" />
          </div>
          <div>
            <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Duty Terminal</h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg mt-4 font-medium">Session tracking must be initialized to access the clinical registry.</p>
          </div>
          <button
            onClick={() => setIsWorkDayActive(true)}
            className="w-full py-6 bg-teal-600 hover:bg-teal-700 text-white rounded-[2rem] font-black text-xl uppercase tracking-[0.2em] shadow-2xl shadow-teal-500/20 transition-all flex items-center justify-center gap-4 group"
          >
            <Play className="w-6 h-6 fill-current group-hover:scale-110 transition-transform" /> Start Work Day
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      {/* SHIFT CONTROLLER */}
      <div className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-10 z-20 shadow-sm">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Shift Active</span>
          </div>
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-800"></div>
          <div className="flex gap-10">
            <div>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">Encounters</p>
              <p className="text-sm font-black text-slate-900 dark:text-white">{totalPatients}</p>
            </div>
            <div>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">Live Revenue</p>
              <p className="text-sm font-black text-slate-900 dark:text-white">{currency.symbol}{totalRev.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <button
          onClick={handleEndShift}
          className="px-6 py-2.5 bg-rose-50 dark:bg-rose-900/10 text-rose-600 dark:text-rose-400 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 dark:hover:bg-rose-900/20 transition-all border border-rose-100 dark:border-rose-900/30 flex items-center gap-2"
        >
          <Power className="w-3 h-3" /> End Work Day
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Registry Selection Sidebar (Only if patient is active) */}
        <div className={`${selectedPatient ? 'w-96 border-r' : 'w-0 overflow-hidden opacity-0'} border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-full transition-all duration-500 ease-in-out`}>
          <div className="p-8 border-b border-slate-100 dark:border-slate-800">
            <button onClick={() => setSelectedPatient(null)} className="flex items-center gap-2 text-slate-400 hover:text-teal-600 transition-colors mb-4">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-teal-600">Back to List</span>
            </button>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Shift Queue</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {queue.map(app => (
              <button
                key={app.id}
                onClick={() => setSelectedPatient(app)}
                className={`w-full text-left p-6 rounded-[2.5rem] border transition-all duration-300 ${selectedPatient?.id === app.id
                    ? 'bg-teal-600 border-teal-600 text-white shadow-xl shadow-teal-500/20'
                    : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-800 hover:border-teal-300 shadow-sm'
                  }`}
              >
                <p className="font-bold text-lg leading-tight">{app.patientName}</p>
                <span className="text-[10px] opacity-60 font-mono mt-1 block">{app.time} • Room {app.room || 'N/A'}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Combined Space: Terminal or Registry List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50 dark:bg-slate-950/50 transition-all duration-500">
          {selectedPatient ? (
            /* DOCTOR TERMINAL MODE: Large focused workspace */
            <div className="p-12 animate-in slide-in-from-right duration-500 max-w-5xl mx-auto">
              <div className="space-y-10">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-teal-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-teal-500/20 border-4 border-white dark:border-slate-800">
                      <UserCheck className="w-10 h-10" />
                    </div>
                    <div>
                      <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter">{selectedPatient.patientName}</h1>
                      <p className="text-slate-500 text-lg font-medium">{selectedPatient.category} encounter • ID: {selectedPatient.patientId}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => updateStatus(selectedPatient.id, 'Completed')}
                    className="px-10 py-5 bg-teal-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-teal-500/30 hover:bg-teal-700 transition-all flex items-center gap-3 active:scale-95"
                  >
                    <CheckCircle className="w-6 h-6" /> Finish Visit
                  </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                      <ClipboardList className="w-4 h-4" /> Intake Context
                    </h3>
                    <p className="text-lg italic text-slate-700 dark:text-slate-300 leading-relaxed">
                      "{selectedPatient.reports || "Clinical intake notes pending."}"
                    </p>
                  </div>
                  <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-xl relative overflow-hidden group">
                    <TrendingUp className="absolute -right-8 -top-8 w-32 h-32 text-teal-500/10 group-hover:scale-110 transition-transform duration-1000" />
                    <h3 className="text-[10px] font-black text-teal-400 uppercase tracking-[0.2em] mb-4">Patient Billable</h3>
                    <p className="text-5xl font-black">{currency.symbol}{selectedPatient.cost}</p>
                    <p className="text-[10px] text-teal-400/60 font-black uppercase tracking-widest mt-2">Calculated base fee</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-12 rounded-[3.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-4">
                    <FileText className="w-8 h-8 text-teal-600" /> Medical Assessment
                  </h3>
                  <textarea
                    className="w-full h-80 p-10 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-[2.5rem] focus:ring-8 focus:ring-teal-500/5 outline-none dark:text-white text-lg transition-all resize-none shadow-inner"
                    placeholder="Document diagnosis, prescriptions, and findings here..."
                  ></textarea>
                </div>
              </div>
            </div>
          ) : (
            /* REGISTRY MODE: The terminal space is replaced by this full-screen registry list */
            <div className="p-12 animate-in fade-in duration-700 max-w-6xl mx-auto">
              <div className="space-y-12">
                <header className="flex justify-between items-end">
                  <div>
                    <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Clinical Registry</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-lg mt-2">Global shift records • Total coverage</p>
                  </div>
                  <div className="flex bg-white dark:bg-slate-900 p-2 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                    <button onClick={() => setViewTab('queue')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewTab === 'queue' ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20' : 'text-slate-400 hover:text-slate-600'}`}>Queue</button>
                    <button onClick={() => setViewTab('history')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewTab === 'history' ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20' : 'text-slate-400 hover:text-slate-600'}`}>Finished</button>
                  </div>
                </header>

                <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800/50">
                      <tr>
                        <th className="px-12 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient Details</th>
                        <th className="px-12 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Time/Location</th>
                        <th className="px-12 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Clinical Service</th>
                        <th className="px-12 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Visit State</th>
                        <th className="px-12 py-6 text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {(viewTab === 'queue' ? queue : finished).map(app => (
                        <tr key={app.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all">
                          <td className="px-12 py-10">
                            <p className="font-black text-xl text-slate-900 dark:text-white">{app.patientName}</p>
                            <p className="text-[10px] font-mono text-slate-400 mt-1">{app.patientId}</p>
                          </td>
                          <td className="px-12 py-10">
                            <p className="font-bold text-slate-700 dark:text-slate-300">{app.time}</p>
                            <p className="text-[10px] text-teal-600 font-black uppercase tracking-widest mt-1">Room {app.room || 'N/A'}</p>
                          </td>
                          <td className="px-12 py-10">
                            <span className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                              {app.category}
                            </span>
                          </td>
                          <td className="px-12 py-10">
                            <div className="flex items-center gap-2">
                              <div className={`w-2.5 h-2.5 rounded-full ${app.status === 'Completed' ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`}></div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">{app.status}</span>
                            </div>
                          </td>
                          <td className="px-12 py-10 text-right">
                            {app.status !== 'Completed' && (
                              <button
                                onClick={() => setSelectedPatient(app)}
                                className="px-8 py-3 bg-teal-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-teal-500/20 hover:scale-105 transition-all"
                              >
                                Enter Terminal
                              </button>
                            )}
                            {app.status === 'Completed' && (
                              <div className="flex items-center justify-end gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
                                <CheckCircle className="w-4 h-4" /> Visit Archived
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                      {(viewTab === 'queue' ? queue : finished).length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-40 text-center">
                            <Inbox className="w-16 h-16 text-slate-200 dark:text-slate-800 mx-auto mb-6" />
                            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No active clinical records</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SHIFT PERFORMANCE AUDIT (End of Day Modal) */}
      {showShiftReport && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl animate-in fade-in duration-500"></div>
          <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[4rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-300">
            <div className="p-16 text-center space-y-12">
              <div className="w-24 h-24 bg-teal-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-teal-500/30 animate-bounce">
                <Power className="w-12 h-12 text-white" />
              </div>
              <div>
                <h2 className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter">Clinical Concluded</h2>
                <p className="text-slate-500 text-xl font-medium mt-4">Automated shift performance audit</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-700">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Patients Finalized</p>
                  <p className="text-4xl font-black text-teal-600">{totalPatients}</p>
                </div>
                <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-700">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Shift Revenue</p>
                  <p className="text-4xl font-black text-teal-600">{currency.symbol}{totalRev.toLocaleString()}</p>
                </div>
                <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-700">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Service Quality</p>
                  <p className="text-4xl font-black text-teal-600">Optimum</p>
                </div>
              </div>

              <div className="p-12 bg-teal-900 text-white rounded-[3.5rem] text-left relative overflow-hidden group">
                <Sparkles className="absolute -right-8 -top-8 w-40 h-40 text-teal-500/10 group-hover:scale-110 transition-transform duration-1000" />
                <h4 className="text-[10px] font-black text-teal-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                  <Activity className="w-4 h-4" /> AI Operations Debrief
                </h4>
                <p className="text-xl italic font-medium leading-relaxed opacity-90">"{shiftSummary || "Clinical data processed successfully."}"</p>
              </div>

              <button
                onClick={closeShiftReport}
                className="w-full py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2.5rem] font-black text-xl uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl"
              >
                Acknowledge & Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorPortal;
