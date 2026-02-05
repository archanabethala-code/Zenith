
import React, { useState } from 'react';
import { Plus, Search, DollarSign, Activity, FileText, Settings, Globe, PlusCircle, Trash2, ImageIcon } from 'lucide-react';
import { Appointment, MedicalService, Currency, CURRENCIES } from '../types';
import AppointmentModal from './AppointmentModal';
import AiCommandBox from './AiCommandBox';

interface Props {
  appointments: Appointment[];
  onAddAppointment: (app: Partial<Appointment>) => Promise<void>;
  onUpdateAppointment: (app: Appointment) => Promise<void>;
  onRemoveAppointment: (id: string) => Promise<void>;
  services: MedicalService[];
  addService: (name: string, cost: number) => void;
  removeService: (id: string) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
}

const ReceptionistPortal: React.FC<Props> = ({
  appointments,
  onAddAppointment,
  onUpdateAppointment,
  onRemoveAppointment,
  services,
  addService,
  removeService,
  currency,
  setCurrency
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Appointment | undefined>();
  const [searchTerm, setSearchTerm] = useState('');

  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceCost, setNewServiceCost] = useState<number>(0);

  const handleAddOrEdit = (app: Appointment) => {
    if (editingApp) {
      onUpdateAppointment(app);
    } else {
      onAddAppointment({ ...app, status: 'Waiting' });
    }
    setIsModalOpen(false);
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (newServiceName && newServiceCost >= 0) {
      addService(newServiceName, newServiceCost);
      setNewServiceName('');
      setNewServiceCost(0);
      setIsServiceModalOpen(false);
    }
  };

  const filtered = appointments.filter(a => a.patientName.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Receptionist Portal</h1>
            <p className="text-slate-500 text-sm mt-1">Manage appointments and clinic logistics</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <button
              onClick={() => setIsServiceModalOpen(true)}
              className="flex-1 md:flex-none px-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
            >
              <Settings className="w-5 h-5 text-teal-600" /> Manage Services
            </button>
            <button
              onClick={() => { setEditingApp(undefined); setIsModalOpen(true); }}
              className="flex-1 md:flex-none px-8 py-4 bg-teal-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-teal-500/20 active:scale-95 transition-all"
            >
              <Plus className="w-5 h-5" /> New Appointment
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <AiCommandBox onAppointmentParsed={(parsed) => {
              const service = services.find(s => s.name.toLowerCase() === (parsed.category || '').toLowerCase());
              const finalParsed = {
                ...parsed,
                cost: parsed.cost || (service ? service.baseCost : 0)
              };
              setEditingApp(finalParsed as Appointment);
              setIsModalOpen(true);
            }} />

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-6">
                <div className="flex items-center gap-4 flex-1">
                  <Search className="w-6 h-6 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search patients..."
                    className="bg-transparent border-none focus:ring-0 text-lg flex-1 outline-none dark:text-white"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-inner">
                  <Globe className="w-5 h-5 text-teal-600" />
                  <select
                    className="bg-transparent border-none text-sm font-bold text-slate-600 dark:text-slate-300 outline-none cursor-pointer"
                    value={currency.code}
                    onChange={(e) => setCurrency(CURRENCIES.find(c => c.code === e.target.value)!)}
                  >
                    {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>)}
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/50">
                    <tr>
                      <th className="px-10 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Patient</th>
                      <th className="px-10 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Service Type</th>
                      <th className="px-10 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cost</th>
                      <th className="px-10 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filtered.map(app => (
                      <tr key={app.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-4">
                            {app.patientImage ? (
                              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-slate-200">
                                <img src={app.patientImage} alt="Patient" className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                <ImageIcon className="w-5 h-5" />
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-lg text-slate-900 dark:text-white">{app.patientName}</p>
                              <p className="text-xs text-slate-500 font-mono mt-0.5">{app.patientId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <span className="inline-flex items-center px-4 py-1.5 bg-teal-50 dark:bg-teal-900/20 text-teal-600 text-[10px] font-bold rounded-full uppercase tracking-widest">
                            {app.category}
                          </span>
                        </td>
                        <td className="px-10 py-8">
                          <div className="flex flex-col">
                            <span className="font-bold text-lg text-slate-800 dark:text-slate-200">{currency.symbol}{app.cost.toLocaleString()}</span>
                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Pending</span>
                          </div>
                        </td>
                        <td className="px-10 py-8 text-right">
                          <button
                            onClick={() => { setEditingApp(app); setIsModalOpen(true); }}
                            className="p-3 text-slate-400 hover:text-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/30 rounded-2xl transition-all"
                          >
                            <FileText className="w-6 h-6" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-32 text-center text-slate-400 italic">
                          No active records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-teal-600 text-white p-10 rounded-[3rem] shadow-xl shadow-teal-500/20 group hover:scale-[1.02] transition-transform">
              <h3 className="text-xs font-bold text-teal-200 uppercase tracking-widest mb-4">Total Patients</h3>
              <p className="text-5xl font-black">{appointments.length}</p>
              <p className="text-xs text-teal-100/70 font-bold mt-4 uppercase tracking-widest">Active records today</p>
            </div>

            <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl group hover:scale-[1.02] transition-transform">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Daily Revenue</h3>
              <p className="text-4xl font-bold">{currency.symbol}{appointments.reduce((sum, a) => sum + a.cost, 0).toLocaleString()}</p>
              <p className="text-xs text-slate-500 font-bold mt-4 uppercase tracking-widest">Gross estimate</p>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <AppointmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddOrEdit}
          initialData={editingApp}
          services={services}
        />
      )}

      {isServiceModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsServiceModalOpen(false)}></div>
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 border border-slate-200 dark:border-slate-800">
            <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Clinic Services</h2>
                <p className="text-[10px] text-teal-600 font-bold uppercase tracking-widest mt-1">Configure service costs</p>
              </div>
              <button onClick={() => setIsServiceModalOpen(false)} className="p-3 hover:bg-white dark:hover:bg-slate-800 rounded-full transition-all">
                <Plus className="w-6 h-6 rotate-45 text-slate-400" />
              </button>
            </div>
            <div className="p-10 space-y-8">
              <div className="max-h-80 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {services.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700 group hover:border-teal-300 dark:hover:border-teal-800 transition-all">
                    <div>
                      <p className="font-bold text-lg text-slate-900 dark:text-white">{s.name}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Base Fee</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-black text-2xl text-teal-600">{currency.symbol}{s.baseCost}</span>
                      <button
                        onClick={() => removeService(s.id)}
                        className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleCreateService} className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                <div className="flex gap-4">
                  <input
                    required
                    placeholder="Service Name"
                    className="flex-1 px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-lg dark:text-white outline-none focus:ring-4 focus:ring-teal-500/10 shadow-inner"
                    value={newServiceName}
                    onChange={e => setNewServiceName(e.target.value)}
                  />
                  <input
                    required
                    type="number"
                    placeholder="Cost"
                    className="w-32 px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-lg dark:text-white outline-none focus:ring-4 focus:ring-teal-500/10 shadow-inner"
                    value={newServiceCost}
                    onChange={e => setNewServiceCost(Number(e.target.value))}
                  />
                </div>
                <button type="submit" className="w-full py-5 bg-teal-600 hover:bg-teal-700 text-white rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl shadow-teal-500/20 transition-all active:scale-95">
                  Add New Service
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceptionistPortal;
