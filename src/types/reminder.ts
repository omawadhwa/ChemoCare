export interface Reminder {
  id: string;
  title: string;
  type: 'medication' | 'appointment' | 'exercise' | 'other';
  time: string;
  date?: string; // Optional for recurring reminders
  notes?: string;
  recurring: boolean;
  recurringPattern?: 'daily' | 'weekly' | 'monthly';
  recurringDays?: number[]; // For weekly, days of week (0-6, Sunday-Saturday)
  active: boolean;
  completed: boolean;
  completedDates?: string[]; // Track completion for recurring reminders
  color?: string; // For visual categorization
}
