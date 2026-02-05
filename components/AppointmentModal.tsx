
import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar, Clock, User, Stethoscope, MapPin, FileText, ChevronDown, DollarSign, Camera, Image as ImageIcon, Trash2 } from 'lucide-react';
import { Appointment, MedicalService } from '../types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (appointment: Appointment) => void;
  initialData?: Appointment;
  services: MedicalService[];
}

const AppointmentModal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit, initialData, services }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<Partial<Appointment>>({
    patientName: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
    category: services[0]?.name || '',
    physician: '',
    room: '',
    reports: '',
    status: 'Waiting',
    cost: services[0]?.baseCost || 0,
    patientImage: '',
  });

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleCategoryChange = (catName: string) => {
    const service = services.find(s => s.name === catName);
    setFormData({
      ...formData,
      category: catName,
      cost: service ? service.baseCost : 0
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, patientImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientName || !formData.date || !formData.time) return;
    onSubmit({...formData, id: initialData?.id || ''} as Appointment);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md animate-in fade-in" onClick={onClose}></div>
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-[3.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-300">
        <div className="p-10 md:p-12 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {initialData ? 'Update Record' : 'New Appointment'}
            </h2>
            <p className="text-xs text-teal-600 font-bold uppercase tracking-[0.2em] mt-2">Clinic Intake Form</p>
          </div>
          <button onClick={onClose} className="p-4 text-slate-400 hover:bg-white dark:hover:bg-slate-800 rounded-full transition-all">
            <X className="w-8 h-8" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-8">
            {/* Image Provision Section */}
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block">Patient ID / Medical Image</label>
              <div className="flex flex-col items-center justify-center w-full">
                {formData.patientImage ? (
                  <div className="relative group w-full h-48 rounded-3xl overflow-hidden border-2 border-teal-500 shadow-lg">
                    <img src={formData.patientImage} alt="Patient" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                      <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-4 bg-white text-slate-900 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-transform"
                      >
                        <ImageIcon className="w-5 h-5" /> Replace
                      </button>
                      <button 
                        type="button"
                        onClick={() => setFormData({ ...formData, patientImage: '' })}
                        className="p-4 bg-rose-500 text-white rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-transform"
                      >
                        <Trash2 className="w-5 h-5" /> Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-48 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group"
                  >
                    <div className="w-16 h-16 bg-white dark:bg-slate-700 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <Camera className="w-8 h-8 text-teal-600" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">Click to upload document</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">PNG, JPG up to 10MB</p>
                    </div>
                  </button>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block">Patient Name</label>
              <div className="relative">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-teal-600" />
                <input 
                  required 
                  placeholder="Full name"
                  className="w-full pl-16 pr-8 py-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-3xl focus:ring-8 focus:ring-teal-500/5 outline-none text-xl dark:text-white transition-all shadow-inner" 
                  value={formData.patientName} 
                  onChange={e => setFormData({...formData, patientName: e.target.value})} 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block">Service Type</label>
                <div className="relative">
                  <Stethoscope className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-teal-600 pointer-events-none" />
                  <select 
                    className="w-full pl-16 pr-12 py-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-3xl focus:ring-8 focus:ring-teal-500/5 outline-none text-lg dark:text-white appearance-none cursor-pointer transition-all shadow-inner"
                    value={formData.category}
                    onChange={e => handleCategoryChange(e.target.value)}
                  >
                    {services.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block">Visit Cost</label>
                <div className="relative">
                  <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-teal-600" />
                  <input 
                    type="number"
                    required
                    className="w-full pl-16 pr-8 py-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-3xl focus:ring-8 focus:ring-teal-500/5 outline-none text-xl dark:text-white transition-all shadow-inner" 
                    value={formData.cost} 
                    onChange={e => setFormData({...formData, cost: Number(e.target.value)})} 
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block">Room</label>
                  <div className="relative">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-600" />
                    <input 
                      placeholder="Room #" 
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-3xl outline-none text-lg dark:text-white transition-all shadow-inner" 
                      value={formData.room} 
                      onChange={e => setFormData({...formData, room: e.target.value})} 
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block">Date</label>
                  <input type="date" required className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-3xl text-lg dark:text-white shadow-inner outline-none focus:ring-8 focus:ring-teal-500/5" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block">Time</label>
                  <input type="time" required className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-3xl text-lg dark:text-white shadow-inner outline-none focus:ring-8 focus:ring-teal-500/5" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
                </div>
            </div>

            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block">Initial Symptoms / Report</label>
              <div className="relative">
                <FileText className="absolute left-6 top-6 w-6 h-6 text-teal-600" />
                <textarea 
                  rows={4}
                  placeholder="Summarize the reason for visit..."
                  className="w-full pl-16 pr-8 py-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-[2.5rem] focus:ring-8 focus:ring-teal-500/5 outline-none text-lg dark:text-white transition-all resize-none shadow-inner"
                  value={formData.reports}
                  onChange={e => setFormData({...formData, reports: e.target.value})}
                />
              </div>
            </div>
          </div>

          <button type="submit" className="w-full py-6 bg-teal-600 hover:bg-teal-700 text-white rounded-[2.5rem] font-black text-xl uppercase tracking-[0.2em] shadow-2xl shadow-teal-500/30 transition-all transform active:scale-[0.98]">
            Save Appointment
          </button>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;
