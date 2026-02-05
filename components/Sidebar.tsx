
import React from 'react';
import { 
  LayoutDashboard, 
  Settings,
  Stethoscope,
  LogOut,
  Moon,
  Sun,
  ShieldCheck
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  role: UserRole;
  currentView: 'dashboard' | 'settings';
  onViewChange: (view: 'dashboard' | 'settings') => void;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, currentView, onViewChange, onLogout, isDarkMode, toggleTheme }) => {
  const roleName = role === 'doctor' ? 'Doctor' : 'Receptionist';

  return (
    <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-500 z-30">
      <div className="p-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-teal-600 rounded-2xl flex items-center justify-center shadow-xl shadow-teal-500/30">
            <Stethoscope className="w-7 h-7 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">Zenith</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-6 space-y-2">
        <div className="px-6 py-4 mb-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center gap-3 border border-slate-100 dark:border-slate-700">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400 tracking-wider truncate">
            {roleName} Portal
          </span>
        </div>

        <button 
          onClick={() => onViewChange('dashboard')}
          className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl font-bold text-sm transition-all ${
            currentView === 'dashboard' 
            ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20' 
            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          Main Dashboard
        </button>
        <button 
          onClick={() => onViewChange('settings')}
          className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl text-sm font-semibold transition-all ${
            currentView === 'settings' 
            ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20' 
            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Settings className="w-5 h-5" />
          Settings
        </button>
      </nav>

      <div className="p-8 mt-auto space-y-3">
        <button 
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-700"
        >
          <div className="flex items-center gap-3">
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            {isDarkMode ? 'LIGHT MODE' : 'DARK MODE'}
          </div>
          <div className={`w-10 h-5 rounded-full relative transition-colors ${isDarkMode ? 'bg-teal-500' : 'bg-slate-300'}`}>
             <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isDarkMode ? 'right-1' : 'left-1'}`}></div>
          </div>
        </button>
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-3 py-4 bg-rose-50 dark:bg-rose-900/10 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-bold hover:bg-rose-100 dark:hover:bg-rose-900/20 transition-all"
        >
          <LogOut className="w-4 h-4" />
          SIGN OUT
        </button>
      </div>

      <div className="p-10 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center text-teal-700 dark:text-teal-400 font-bold border border-teal-200 dark:border-teal-800">
            {role[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {roleName} Account
            </p>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Standard Access</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;