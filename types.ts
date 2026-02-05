
export type UserRole = 'receptionist' | 'doctor' | 'none';

export type AppointmentStatus = 'Waiting' | 'In Progress' | 'Completed' | 'Cancelled';

export interface MedicalService {
  id: string;
  name: string;
  baseCost: number;
}

export type Currency = {
  code: string;
  symbol: string;
};

export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'JPY', symbol: '¥' },
  { code: 'INR', symbol: '₹' },
];

export interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  date: string;
  time: string;
  category: string;
  physician: string;
  room: string;
  status: AppointmentStatus;
  reports: string;
  cost: number;
  notes?: string;
  patientImage?: string; // Base64 encoded image string
}
