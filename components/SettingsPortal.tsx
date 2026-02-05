
import React, { useState } from 'react';
import { Settings, Globe, PlusCircle, Trash2, Hospital, CreditCard } from 'lucide-react';
import { MedicalService, Currency, CURRENCIES, UserRole } from '../types';

interface Props {
  role: UserRole;
  services: MedicalService[];
  addService: (name: string, cost: number) => void;
  removeService: (id: string) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
}

const SettingsPortal: React.FC<Props> = ({ role, services, addService, removeService, currency, setCurrency }) => {
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceCost, setNewServiceCost] = useState<number>(0);

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (newServiceName && newServiceCost >= 0) {
      addService(newServiceName, newServiceCost);
      setNewServiceName('');
      setNewServiceCost(0);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700">
        <header>
          <div className="flex items-center gap-4 mb-3 text-teal-600">
            <Settings className="w-8 h-8" />
            <span className="text-xs font-black uppercase tracking-[0.3em]">Institutional Settings</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">System Control</h1>
        </header>

        <section className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-teal-50 dark:bg-teal-900/30 rounded-2xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold dark:text-white">Financial Localization</h2>
              <p className="text-slate-500 text-sm">Select the primary currency for all billing operations</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {CURRENCIES.map((c) => (
              <button
                key={c.code}
                onClick={() => setCurrency(c)}
                className={`p-6 rounded-3xl border transition-all ${
                  currency.code === c.code
                    ? 'bg-teal-600 border-teal-600 text-white shadow-lg shadow-teal-500/20'
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-teal-300'
                }`}
              >
                <p className="text-xs font-black mb-1">{c.code}</p>
                <p className="text-3xl font-black">{c.symbol}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-teal-50 dark:bg-teal-900/30 rounded-2xl flex items-center justify-center">
              <Hospital className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold dark:text-white">Medical Services</h2>
              <p className="text-slate-500 text-sm">Manage clinical specialties and base costs</p>
            </div>
          </div>

          <div className="space-y-4 mb-10">
            {services.map(s => (
              <div key={s.id} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700 transition-all hover:border-teal-300">
                <div>
                  <p className="font-bold text-lg text-slate-900 dark:text-white">{s.name}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Base Rate</p>
                </div>
                <div className="flex items-center gap-6">
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

          <form onSubmit={handleCreateService} className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 space-y-6">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Add New Specialty</h3>
            <div className="flex flex-col md:flex-row gap-4">
              <input 
                required
                placeholder="Specialty Name (e.g. Neurology)"
                className="flex-1 px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-lg dark:text-white outline-none focus:ring-4 focus:ring-teal-500/10 shadow-sm"
                value={newServiceName}
                onChange={e => setNewServiceName(e.target.value)}
              />
              <input 
                required
                type="number"
                placeholder="Base Cost"
                className="w-full md:w-32 px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-lg dark:text-white outline-none focus:ring-4 focus:ring-teal-500/10 shadow-sm"
                value={newServiceCost}
                onChange={e => setNewServiceCost(Number(e.target.value))}
              />
            </div>
            <button type="submit" className="w-full py-5 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-teal-500/20 transition-all active:scale-95 flex items-center justify-center gap-3">
              <PlusCircle className="w-5 h-5" /> Register Institutional Service
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default SettingsPortal;
