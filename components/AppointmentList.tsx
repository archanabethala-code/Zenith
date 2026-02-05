
import React from 'react';
import { 
  Trash2, 
  Edit3, 
  Clock, 
  UserCheck,
  MapPin,
  ClipboardX
} from 'lucide-react';
import { Appointment, AppointmentStatus } from '../types';

interface ListProps {
  appointments: Appointment[];
  onEdit: (a: Appointment) => void;
  onDelete: (id: string) => void;
  onStatusUpdate: (id: string, status: AppointmentStatus) => void;
}

const AppointmentList: React.FC<ListProps> = ({ appointments, onEdit, onDelete, onStatusUpdate }) => {
  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      // Fix: 'Scheduled' replaced with 'Waiting' to match AppointmentStatus type
      case 'Waiting': return 'text-sky-600 bg-sky-50 dark:bg-sky-500/10 dark:text-sky-400';
      case 'Completed': return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400';
      case 'Cancelled': return 'text-rose-600 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-400';
      case 'In Progress': return 'text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  if (appointments.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-20 flex flex-col items-center justify-center text-slate-300 dark:text-slate-700 shadow-sm">
        <ClipboardX className="w-16 h-16 mb-4 opacity-50" />
        <h3 className="text-lg font-bold text-slate-400">No Patient Records</h3>
        <p className="text-sm text-slate-500 mt-2">The registry is empty or no matches were found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50">
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Patient</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Visit Info</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Practitioner</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {appointments.map((app) => (
              <tr key={app.id} className="group hover:bg-teal-50/20 dark:hover:bg-teal-900/10 transition-colors">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center font-bold text-teal-700 dark:text-teal-400 text-xs">
                      {app.patientName ? app.patientName.split(' ').map(n => n[0]).join('') : 'PT'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{app.patientName}</p>
                      <p className="text-[10px] font-mono text-slate-500">{app.patientId}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  {/* Fix: changed visitType to category as defined in Appointment type */}
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{app.category}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <p className="text-xs text-slate-500 font-mono">{app.time}</p>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <p className="text-xs text-slate-500">{app.room || 'Unassigned'}</p>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-teal-600/60" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">{app.physician || 'Staff'}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(app)} className="p-2 text-slate-400 hover:text-teal-500 hover:bg-teal-50 dark:hover:bg-teal-500/10 rounded-lg">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(app.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentList;
