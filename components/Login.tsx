
import React, { useState } from 'react';
import { X, User, Lock, CheckCircle2, Hospital, ShieldAlert, Zap } from 'lucide-react';
import { UserRole } from '../types';

interface Props {
  onClose: () => void;
  onLogin: (role: UserRole, staySignedIn: boolean) => void;
}

const Login: React.FC<Props> = ({ onClose, onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('receptionist');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (selectedRole === 'receptionist' && email === 'reception@zenith.com' && password === 'access123') {
      onLogin('receptionist', remember);
    } else if (selectedRole === 'doctor' && email === 'doctor@zenith.com' && password === 'med456') {
      onLogin('doctor', remember);
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  const fillDemo = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'receptionist') {
      setEmail('reception@zenith.com');
      setPassword('access123');
    } else {
      setEmail('doctor@zenith.com');
      setPassword('med456');
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-500" onClick={onClose}></div>
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200 dark:border-slate-800">
        <div className="p-12 bg-teal-600 dark:bg-teal-700 text-white relative">
          <button onClick={onClose} className="absolute top-10 right-10 p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all">
            <X className="w-5 h-5" />
          </button>
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-8 border border-white/30">
            <Hospital className="w-10 h-10" />
          </div>
          <h2 className="text-5xl font-black tracking-tighter">Login</h2>
          <p className="text-teal-100/80 text-lg mt-2 font-medium">Zenith Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="p-12 space-y-10">
          <div className="flex bg-slate-100 dark:bg-slate-800/50 p-2 rounded-2xl gap-2 shadow-inner border border-slate-200 dark:border-slate-700">
            <button 
              type="button"
              onClick={() => setSelectedRole('receptionist')}
              className={`flex-1 py-4 text-sm font-bold rounded-xl transition-all uppercase tracking-wider ${selectedRole === 'receptionist' ? 'bg-white dark:bg-slate-700 shadow-md text-teal-600' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
            >
              Receptionist
            </button>
            <button 
              type="button"
              onClick={() => setSelectedRole('doctor')}
              className={`flex-1 py-4 text-sm font-bold rounded-xl transition-all uppercase tracking-wider ${selectedRole === 'doctor' ? 'bg-white dark:bg-slate-700 shadow-md text-teal-600' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
            >
              Doctor
            </button>
          </div>

          <div className="space-y-6">
            <div className="relative group">
              <User className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
              <input 
                type="email" 
                placeholder="Email Address"
                required
                className="w-full pl-16 pr-8 py-6 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl focus:ring-4 focus:ring-teal-500/10 outline-none text-xl dark:text-white transition-all shadow-inner placeholder:text-slate-400"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
              <input 
                type="password" 
                placeholder="Password"
                required
                className="w-full pl-16 pr-8 py-6 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl focus:ring-4 focus:ring-teal-500/10 outline-none text-xl dark:text-white transition-all shadow-inner placeholder:text-slate-400"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-3 justify-center py-4 px-6 bg-rose-50 dark:bg-rose-900/20 rounded-2xl animate-pulse">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
              <p className="text-rose-600 dark:text-rose-400 text-sm font-bold">{error}</p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-4 cursor-pointer group">
              <input 
                type="checkbox" 
                className="hidden" 
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
              />
              <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${remember ? 'bg-teal-500 border-teal-500 shadow-lg shadow-teal-500/20' : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'}`}>
                {remember && <CheckCircle2 className="w-5 h-5 text-white" />}
              </div>
              <span className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Keep me signed in</span>
            </label>
          </div>

          <div className="space-y-6">
            <button className="w-full py-6 bg-teal-600 hover:bg-teal-700 text-white rounded-3xl font-black text-xl uppercase tracking-[0.2em] shadow-2xl shadow-teal-500/30 transition-all active:scale-[0.98]">
              Sign In
            </button>

            <div className="relative pt-6">
              <div className="absolute inset-0 flex items-center px-4" aria-hidden="true">
                <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white dark:bg-slate-900 px-4 text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.3em]">Demo Access</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                type="button"
                onClick={() => fillDemo('receptionist')}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-600 transition-all"
              >
                <Zap className="w-3 h-3" /> Reception
              </button>
              <button 
                type="button"
                onClick={() => fillDemo('doctor')}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-600 transition-all"
              >
                <Zap className="w-3 h-3" /> Doctor
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
