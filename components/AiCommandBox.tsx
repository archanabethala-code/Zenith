
import React, { useState } from 'react';
import { Sparkles, Send, Loader2 } from 'lucide-react';
import { parseNaturalLanguageAppointment } from '../services/geminiService';
import { Appointment } from '../types';

interface AiCommandBoxProps {
  onAppointmentParsed: (appointment: Partial<Appointment>) => void;
}

const AiCommandBox: React.FC<AiCommandBoxProps> = ({ onAppointmentParsed }) => {
  const [command, setCommand] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const result = await parseNaturalLanguageAppointment(command);
      if (result) {
        onAppointmentParsed(result);
        setCommand('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
      <form 
        onSubmit={handleProcess}
        className="relative bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 flex items-center gap-4 transition-all"
      >
        <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <input 
          type="text" 
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Try: 'Schedule consultation with Jane for tomorrow at 3pm'"
          className="flex-1 bg-transparent border-none focus:ring-0 text-sm dark:text-white placeholder:text-slate-400 outline-none"
        />
        <button 
          disabled={!command.trim() || isLoading}
          className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:bg-slate-400 text-white rounded-lg transition-all"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </button>
      </form>
    </div>
  );
};

export default AiCommandBox;
