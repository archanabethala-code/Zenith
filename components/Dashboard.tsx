
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Users, HeartPulse, Sparkles, BedDouble, Inbox } from 'lucide-react';
import { Appointment } from '../types';
import { getSmartSummary } from '../services/geminiService';

const Dashboard: React.FC<{ appointments: Appointment[], onEdit: (a: Appointment) => void, onDelete: (id: string) => void }> = ({ appointments }) => {
  const [aiSummary, setAiSummary] = useState<string>('Initializing analysis...');

  useEffect(() => {
    if (appointments.length > 0) {
      getSmartSummary(appointments).then(setAiSummary);
    } else {
      setAiSummary('Registry is currently empty. Use the intake form to begin tracking patient visits.');
    }
  }, [appointments]);

  const stats = [
    { label: 'Patient Visits', value: appointments.length, icon: Users, color: 'text-teal-600', bg: 'bg-teal-500/10' },
    { label: 'Active Care', value: appointments.filter(a => a.status === 'In Progress').length, icon: Activity, color: 'text-rose-600', bg: 'bg-rose-500/10' },
    { label: 'Rooms Utilized', value: new Set(appointments.map(a => a.room).filter(Boolean)).size, icon: BedDouble, color: 'text-sky-600', bg: 'bg-sky-500/10' },
    { label: 'Physicians', value: new Set(appointments.map(a => a.physician).filter(Boolean)).size, icon: HeartPulse, color: 'text-teal-500', bg: 'bg-teal-500/10' },
  ];

  const chartData = appointments.reduce((acc: any[], app) => {
    const existing = acc.find(d => d.date === app.date);
    if (existing) existing.count++;
    else acc.push({ date: app.date, count: 1 });
    return acc;
  }, []).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-transform hover:-translate-y-1">
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center mb-4`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{stat.label}</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="font-bold text-lg mb-8 flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-500" />
            Clinic Activity
          </h3>
          <div className="h-[300px] w-full flex items-center justify-center">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="count" fill="#0d9488" radius={[8, 8, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center text-slate-300 dark:text-slate-700">
                <Inbox className="w-12 h-12 mb-2" />
                <p className="text-sm">Insufficient data for trend analysis</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-teal-900 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Sparkles className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4 text-teal-300">
              <Sparkles className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Medical Intelligence</span>
            </div>
            <h3 className="text-xl font-bold mb-6">Operations Insight</h3>
            <p className="text-teal-50/90 leading-relaxed italic text-sm">
              "{aiSummary}"
            </p>
          </div>
          <div className="mt-auto pt-8 border-t border-teal-800/50">
            <p className="text-[10px] text-teal-400 font-bold uppercase tracking-widest">Real-time analysis active</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
