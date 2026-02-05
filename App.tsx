
import React, { useState, useEffect } from 'react';
import { Appointment, UserRole, MedicalService, Currency, CURRENCIES } from './types';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import ReceptionistPortal from './components/ReceptionistPortal';
import DoctorPortal from './components/DoctorPortal';
import SettingsPortal from './components/SettingsPortal';
import { supabase } from './services/supabaseClient';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(() => {
    return (localStorage.getItem('zenith_role') as UserRole) || 'none';
  });
  const [currentView, setCurrentView] = useState<'dashboard' | 'settings'>('dashboard');
  const [showLogin, setShowLogin] = useState(false);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<MedicalService[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [currency, setCurrency] = useState<Currency>(CURRENCIES[0]);
  const [isWorkDayActive, setIsWorkDayActive] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      const { data: appts } = await supabase.from('appointments').select('*').order('created_at', { ascending: false });
      if (appts) setAppointments(appts as Appointment[]);

      const { data: svcs } = await supabase.from('services').select('*');
      if (svcs) setServices(svcs as MedicalService[]);

      const { data: state } = await supabase.from('clinic_state').select('*').eq('id', 'isWorkDayActive').single();
      if (state) setIsWorkDayActive(state.value === 'true');
    };
    fetchData();

    // Real-time subscriptions
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes' as any,
        {
          event: '*',
          schema: 'public',
        },
        (payload: any) => {
          if (payload.table === 'appointments') {
            if (payload.eventType === 'INSERT') {
              setAppointments(prev => [payload.new as Appointment, ...prev]);
            } else if (payload.eventType === 'UPDATE') {
              setAppointments(prev => prev.map(a => a.id === payload.new.id ? payload.new as Appointment : a));
            } else if (payload.eventType === 'DELETE') {
              setAppointments(prev => prev.filter(a => a.id !== payload.old.id));
            }
          } else if (payload.table === 'services') {
            if (payload.eventType === 'INSERT') {
              setServices(prev => [...prev, payload.new as MedicalService]);
            } else if (payload.eventType === 'UPDATE') {
              setServices(prev => prev.map(s => s.id === payload.new.id ? payload.new as MedicalService : s));
            } else if (payload.eventType === 'DELETE') {
              setServices(prev => prev.filter(s => s.id !== payload.old.id));
            }
          } else if (payload.table === 'clinic_state') {
            if (payload.new && payload.new.id === 'isWorkDayActive') {
              setIsWorkDayActive(payload.new.value === 'true');
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Database Mutations
  const updateIsWorkDayActive = async (active: boolean) => {
    const { error } = await supabase
      .from('clinic_state')
      .update({ value: String(active) })
      .eq('id', 'isWorkDayActive');
    if (error) console.error('Error updating shift status:', error);
  };

  // Database Mutations
  const addAppointment = async (app: Partial<Appointment>) => {
    const { error } = await supabase
      .from('appointments')
      .insert([{ ...app, patientId: `PAT-${Math.floor(1000 + Math.random() * 9000)}` }]);
    if (error) console.error('Error adding appointment:', error);
  };

  const updateAppointment = async (app: Appointment) => {
    const { error } = await supabase
      .from('appointments')
      .update(app)
      .eq('id', app.id);
    if (error) console.error('Error updating appointment:', error);
  };

  const removeAppointment = async (id: string) => {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);
    if (error) console.error('Error removing appointment:', error);
  };

  const addService = async (name: string, baseCost: number) => {
    const { error } = await supabase
      .from('services')
      .insert([{ name, baseCost }]);
    if (error) console.error('Error adding service:', error);
  };

  const removeService = async (id: string) => {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);
    if (error) console.error('Error removing service:', error);
  };

  // Theme Sync
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleLogin = (selectedRole: UserRole, staySignedIn: boolean) => {
    setRole(selectedRole);
    setShowLogin(false);
    if (staySignedIn) {
      localStorage.setItem('zenith_role', selectedRole);
    }
  };

  const handleLogout = () => {
    setRole('none');
    setCurrentView('dashboard');
    localStorage.removeItem('zenith_role');
  };

  if (role === 'none') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
        <LandingPage onSignInClick={() => setShowLogin(true)} />
        {showLogin && (
          <Login
            onClose={() => setShowLogin(false)}
            onLogin={handleLogin}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <Sidebar
        role={role}
        currentView={currentView}
        onViewChange={setCurrentView}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        toggleTheme={() => setIsDarkMode(!isDarkMode)}
      />

      <main className="flex-1 overflow-hidden flex flex-col">
        {currentView === 'settings' ? (
          <SettingsPortal
            role={role}
            services={services}
            addService={addService}
            removeService={removeService}
            currency={currency}
            setCurrency={setCurrency}
          />
        ) : (
          role === 'receptionist' ? (
            <ReceptionistPortal
              appointments={appointments}
              onAddAppointment={addAppointment}
              onUpdateAppointment={updateAppointment}
              onRemoveAppointment={removeAppointment}
              services={services}
              addService={addService}
              removeService={removeService}
              currency={currency}
              setCurrency={setCurrency}
            />
          ) : (
            <DoctorPortal
              appointments={appointments}
              onUpdateAppointment={updateAppointment}
              currency={currency}
              isWorkDayActive={isWorkDayActive}
              setIsWorkDayActive={updateIsWorkDayActive}
            />
          )
        )}
      </main>
    </div>
  );
};

export default App;
