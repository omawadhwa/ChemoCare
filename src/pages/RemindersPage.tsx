import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, Bell, Calendar, Clock, Plus, X, Save, Trash2, Edit, 
  AlertCircle, CheckCircle, PlusCircle, Pill, Stethoscope, 
  Dumbbell, RepeatIcon, ChevronDown, ChevronUp, AlarmClock,
  CalendarCheck, Filter, MoreVertical
} from 'lucide-react';
import { Reminder } from '../types/reminder';
import { 
  initializeNotifications, 
  scheduleNotification, 
  scheduleAllActiveReminders,
  cancelNotification 
} from '../utils/notificationService';

// Default colors for different reminder types
const typeColors = {
  medication: 'bg-blue-100 text-blue-800 border-blue-200',
  appointment: 'bg-purple-100 text-purple-800 border-purple-200',
  exercise: 'bg-green-100 text-green-800 border-green-200',
  other: 'bg-gray-100 text-gray-800 border-gray-200'
};

const typeIcons = {
  medication: <Pill className="h-5 w-5" />,
  appointment: <Stethoscope className="h-5 w-5" />,
  exercise: <Dumbbell className="h-5 w-5" />,
  other: <Bell className="h-5 w-5" />
};

const RemindersPage: React.FC = () => {
  const navigate = useNavigate();
  
  // State management
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem('reminders');
    const initialValue = saved ? JSON.parse(saved) : [];
    
    // Check for reminders that should be marked as due today
    return initialValue.map((reminder: Reminder) => {
      if (reminder.recurring && isReminderDueToday(reminder)) {
        return {
          ...reminder,
          completed: isReminderCompletedToday(reminder)
        };
      }
      return reminder;
    });
  });
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'today'>('today');
  const [typeFilter, setTypeFilter] = useState<'all' | 'medication' | 'appointment' | 'exercise' | 'other'>('all');
  const [expandedReminder, setExpandedReminder] = useState<string | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);
  const [notificationSettings, setNotificationSettings] = useState<{ sound: boolean; vibrate: boolean }>({
    sound: true,
    vibrate: true
  });
  
  // Form state
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'medication' | 'appointment' | 'exercise' | 'other'>('medication');
  const [time, setTime] = useState('08:00');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [recurring, setRecurring] = useState(false);
  const [recurringPattern, setRecurringPattern] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [recurringDays, setRecurringDays] = useState<number[]>([]);
  const [enableNotification, setEnableNotification] = useState(true);
  
  // Initialize notifications
  useEffect(() => {
    const initNotifications = async () => {
      try {
        const initialized = await initializeNotifications();
        setNotificationsEnabled(initialized);
        
        if (initialized) {
          // Set up listener for completed reminders from notification actions
          const handleReminderCompleted = (event: Event) => {
            const customEvent = event as CustomEvent;
            const reminderId = customEvent.detail?.reminderId;
            
            if (reminderId) {
              const reminderToComplete = reminders.find(r => r.id === reminderId);
              if (reminderToComplete) {
                handleToggleComplete(reminderToComplete);
              }
            }
          };
          
          window.addEventListener('reminderCompleted', handleReminderCompleted);
          
          // Initial scheduling of all active reminders with a small delay to ensure service worker is ready
          setTimeout(() => {
            scheduleAllActiveReminders(reminders);
          }, 1000);
          
          return () => {
            window.removeEventListener('reminderCompleted', handleReminderCompleted);
          };
        } else {
          console.warn('Failed to initialize notification system. Reminders will not show notifications.');
        }
      } catch (error) {
        console.error('Error initializing notifications:', error);
        setNotificationsEnabled(false);
      }
    };
    
    initNotifications();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Save reminders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('reminders', JSON.stringify(reminders));
    
    // If notifications are enabled, update scheduled notifications
    if (notificationsEnabled) {
      // Cancel all notifications first (in case of edits)
      reminders.forEach(reminder => {
        cancelNotification(reminder.id);
      });
      
      // Then reschedule active ones
      scheduleAllActiveReminders(reminders);
    }
  }, [reminders, notificationsEnabled]);
  
  // Initialize form for editing
  useEffect(() => {
    if (editingReminder) {
      setTitle(editingReminder.title);
      setType(editingReminder.type);
      setTime(editingReminder.time);
      setDate(editingReminder.date || '');
      setNotes(editingReminder.notes || '');
      setRecurring(editingReminder.recurring);
      setRecurringPattern(editingReminder.recurringPattern || 'daily');
      setRecurringDays(editingReminder.recurringDays || []);
      setEnableNotification(true); // Default to enabled for editing
    } else {
      resetForm();
    }
  }, [editingReminder]);
  
  // Set a default date when opening the add form
  useEffect(() => {
    if (showAddForm && !editingReminder) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDate(tomorrow.toISOString().split('T')[0]);
    }
  }, [showAddForm, editingReminder]);

  // Helper function to determine if a recurring reminder is due today
  function isReminderDueToday(reminder: Reminder): boolean {
    if (!reminder.recurring) return false;
    
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0-6, Sunday-Saturday
    
    if (reminder.recurringPattern === 'daily') {
      return true;
    } else if (reminder.recurringPattern === 'weekly' && reminder.recurringDays?.includes(dayOfWeek)) {
      return true;
    } else if (reminder.recurringPattern === 'monthly' && today.getDate().toString() === reminder.date?.split('-')[2]) {
      return true;
    }
    
    return false;
  }
  
  // Helper function to check if a recurring reminder was completed today
  function isReminderCompletedToday(reminder: Reminder): boolean {
    if (!reminder.completedDates) return false;
    
    const today = new Date().toISOString().split('T')[0];
    return reminder.completedDates.includes(today);
  }
  
  // Reset form inputs
  const resetForm = () => {
    setTitle('');
    setType('medication');
    setTime('08:00');
    setDate('');
    setNotes('');
    setRecurring(false);
    setRecurringPattern('daily');
    setRecurringDays([]);
    setEnableNotification(true);
  };
  
  // Handle adding a new reminder
  const handleAddReminder = () => {
    if (!title.trim()) return;
    
    const newReminder: Reminder = {
      id: Date.now().toString(),
      title: title.trim(),
      type,
      time,
      date: recurring && recurringPattern !== 'daily' ? date : undefined,
      notes: notes.trim() || undefined,
      recurring,
      recurringPattern: recurring ? recurringPattern : undefined,
      recurringDays: recurring && recurringPattern === 'weekly' ? recurringDays : undefined,
      active: true,
      completed: false,
      completedDates: []
    };
    
    setReminders(prev => [newReminder, ...prev]);
    
    // Schedule notification if enabled
    if (notificationsEnabled && enableNotification) {
      scheduleNotification(newReminder, {
        sound: notificationSettings.sound ? '/sounds/notification.mp3' : undefined,
        vibrate: notificationSettings.vibrate
      });
    }
    
    setShowAddForm(false);
    resetForm();
  };
  
  // Handle updating an existing reminder
  const handleUpdateReminder = () => {
    if (!editingReminder || !title.trim()) return;
    
    const updatedReminder: Reminder = {
      ...editingReminder,
      title: title.trim(),
      type,
      time,
      date: recurring && recurringPattern !== 'daily' ? date : undefined,
      notes: notes.trim() || undefined,
      recurring,
      recurringPattern: recurring ? recurringPattern : undefined,
      recurringDays: recurring && recurringPattern === 'weekly' ? recurringDays : undefined
    };
    
    setReminders(prev => prev.map(r => 
      r.id === editingReminder.id ? updatedReminder : r
    ));
    
    // Cancel previous notification and schedule a new one if enabled
    if (notificationsEnabled) {
      cancelNotification(editingReminder.id);
      
      if (enableNotification && updatedReminder.active && !updatedReminder.completed) {
        scheduleNotification(updatedReminder, {
          sound: notificationSettings.sound ? '/sounds/notification.mp3' : undefined,
          vibrate: notificationSettings.vibrate
        });
      }
    }
    
    setEditingReminder(null);
    resetForm();
  };
  
  // Handle deleting a reminder
  const handleDeleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
    if (editingReminder?.id === id) {
      setEditingReminder(null);
    }
  };
  
  // Toggle completion status of a reminder
  const handleToggleComplete = (reminder: Reminder) => {
    if (reminder.recurring) {
      // For recurring reminders, track completion dates
      const today = new Date().toISOString().split('T')[0];
      let newCompletedDates = [...(reminder.completedDates || [])];
      
      if (newCompletedDates.includes(today)) {
        // If already completed today, remove the completion
        newCompletedDates = newCompletedDates.filter(date => date !== today);
      } else {
        // Otherwise mark as completed today
        newCompletedDates.push(today);
      }
      
      setReminders(prev => prev.map(r => 
        r.id === reminder.id 
          ? {
              ...r,
              completedDates: newCompletedDates,
              completed: newCompletedDates.includes(today)
            }
          : r
      ));
    } else {
      // For non-recurring reminders, simply toggle completion
      setReminders(prev => prev.map(r => 
        r.id === reminder.id 
          ? { ...r, completed: !r.completed }
          : r
      ));
    }
  };
  
  // Toggle active status of a reminder
  const handleToggleActive = (id: string) => {
    setReminders(prev => prev.map(r => 
      r.id === id 
        ? { ...r, active: !r.active }
        : r
    ));
  };
  
  // Get filtered reminders based on current filters
  const getFilteredReminders = () => {
    return reminders.filter(reminder => {
      // Apply type filter
      if (typeFilter !== 'all' && reminder.type !== typeFilter) {
        return false;
      }
      
      // Apply status filter
      if (filter === 'active' && reminder.completed) {
        return false;
      } else if (filter === 'completed' && !reminder.completed) {
        return false;
      } else if (filter === 'today') {
        // For today filter, show only reminders due today
        if (reminder.recurring) {
          return isReminderDueToday(reminder);
        } else {
          const today = new Date().toISOString().split('T')[0];
          return reminder.date === today;
        }
      }
      
      return true;
    }).sort((a, b) => {
      // Sort by time
      const timeA = a.time;
      const timeB = b.time;
      return timeA.localeCompare(timeB);
    });
  };

  // Format time for display
  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Format date for display
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  // Get day of week name
  const getDayName = (day: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[day];
  };

  // Format recurring pattern for display
  const formatRecurring = (reminder: Reminder) => {
    if (!reminder.recurring) return '';
    
    if (reminder.recurringPattern === 'daily') {
      return 'Daily';
    } else if (reminder.recurringPattern === 'weekly' && reminder.recurringDays?.length) {
      if (reminder.recurringDays.length === 7) {
        return 'Every day';
      } else {
        return `Weekly on ${reminder.recurringDays.map(day => getDayName(day).substring(0, 3)).join(', ')}`;
      }
    } else if (reminder.recurringPattern === 'monthly' && reminder.date) {
      const day = reminder.date.split('-')[2];
      return `Monthly on day ${parseInt(day, 10)}`;
    }
    
    return 'Recurring';
  };

  // Toggle expanded view for a reminder
  const toggleExpandReminder = (id: string) => {
    setExpandedReminder(expandedReminder === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-sage-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-sage-600" />
              <span className="ml-2 text-xl font-semibold text-sage-900">ChemoCare</span>
            </div>
            <button onClick={() => navigate('/')} className="bg-sage-600 text-white px-4 py-2 rounded-md hover:bg-sage-700">
              Back Home
            </button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="pt-24 pb-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-sage-900 sm:text-5xl md:text-6xl">
              <span className="block">Daily Reminders</span>
              <span className="block text-sage-600">Stay On Track</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-warm-600 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Set up personalized reminders for medications, appointments, and exercises to help manage your care routine.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Controls */}
          <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex gap-2 flex-wrap">
              <select 
                className="border border-gray-300 rounded-md px-3 py-2 text-gray-700"
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
              >
                <option value="today">Due Today</option>
                <option value="all">All Reminders</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
              
              <select 
                className="border border-gray-300 rounded-md px-3 py-2 text-gray-700"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
              >
                <option value="all">All Types</option>
                <option value="medication">Medications</option>
                <option value="appointment">Appointments</option>
                <option value="exercise">Exercises</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <button 
              onClick={() => setShowAddForm(true)}
              className="bg-sage-600 text-white px-4 py-2 rounded-md hover:bg-sage-700 flex items-center whitespace-nowrap"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Reminder
            </button>
          </div>
          
          {/* Reminders List */}
          <div className="divide-y divide-gray-200">
            {getFilteredReminders().length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No reminders found</h3>
                <p className="mt-1 text-gray-500">
                  {filter === 'today' 
                    ? "You don't have any reminders scheduled for today." 
                    : "Start by adding a new reminder using the button above."}
                </p>
              </div>
            ) : (
              getFilteredReminders().map(reminder => (
                <div 
                  key={reminder.id} 
                  className={`p-6 hover:bg-gray-50 ${!reminder.active ? 'opacity-60' : ''}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start space-x-3">
                      <button
                        onClick={() => handleToggleComplete(reminder)}
                        className={`mt-0.5 flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center 
                          ${reminder.completed 
                            ? 'bg-sage-500 text-white hover:bg-sage-600' 
                            : 'border-2 border-gray-300 text-transparent hover:border-sage-500'}`}
                      >
                        {reminder.completed && <CheckCircle className="h-5 w-5" />}
                      </button>
                      
                      <div>
                        <div className="flex items-center">
                          <h3 className={`text-lg font-medium ${reminder.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                            {reminder.title}
                          </h3>
                          <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${typeColors[reminder.type]}`}>
                            {reminder.type.charAt(0).toUpperCase() + reminder.type.slice(1)}
                          </span>
                        </div>
                        
                        <div className="flex items-center flex-wrap text-sm text-gray-500 mt-1">
                          <div className="flex items-center mr-3">
                            <Clock className="h-4 w-4 mr-1" />
                            {formatTime(reminder.time)}
                          </div>
                          
                          {reminder.date && (
                            <div className="flex items-center mr-3">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatDate(reminder.date)}
                            </div>
                          )}
                          
                          {reminder.recurring && (
                            <div className="flex items-center text-sage-600">
                              <RepeatIcon className="h-4 w-4 mr-1" />
                              {formatRecurring(reminder)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mt-2 sm:mt-0">
                      <button 
                        onClick={() => setEditingReminder(reminder)}
                        className="text-sage-600 hover:text-sage-700"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteReminder(reminder.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleToggleActive(reminder.id)}
                        className={`${reminder.active ? 'text-sage-600 hover:text-sage-700' : 'text-gray-400 hover:text-gray-500'}`}
                      >
                        <Bell className="h-5 w-5" />
                      </button>
                      {reminder.notes && (
                        <button 
                          onClick={() => toggleExpandReminder(reminder.id)}
                          className="text-sage-600 hover:text-sage-700"
                        >
                          {expandedReminder === reminder.id ? 
                            <ChevronUp className="h-5 w-5" /> : 
                            <ChevronDown className="h-5 w-5" />
                          }
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {expandedReminder === reminder.id && reminder.notes && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Notes:</h4>
                      <p className="text-gray-600 whitespace-pre-line">{reminder.notes}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add/Edit Reminder Modal */}
        {(showAddForm || editingReminder) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-sage-900">
                  {editingReminder ? 'Edit Reminder' : 'Add New Reminder'}
                </h2>
                <button 
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingReminder(null);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700"
                    placeholder="Medication name, appointment description, etc."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                
                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reminder Type
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['medication', 'appointment', 'exercise', 'other'] as const).map(typeOption => (
                      <button
                        key={typeOption}
                        type="button"
                        onClick={() => setType(typeOption)}
                        className={`py-2 px-3 rounded-md flex items-center justify-center text-sm ${
                          type === typeOption
                            ? `ring-2 ring-offset-2 ring-sage-600 ${typeColors[typeOption]}`
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <span className="mr-2">{typeIcons[typeOption]}</span>
                        <span>{typeOption.charAt(0).toUpperCase() + typeOption.slice(1)}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time *
                  </label>
                  <input
                    type="time"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
                
                {/* Recurring Toggle */}
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="recurring"
                      type="checkbox"
                      className="focus:ring-sage-500 h-4 w-4 text-sage-600 border-gray-300 rounded"
                      checked={recurring}
                      onChange={(e) => setRecurring(e.target.checked)}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="recurring" className="font-medium text-gray-700">
                      Recurring Reminder
                    </label>
                    <p className="text-gray-500">Set this reminder to repeat on a schedule</p>
                  </div>
                </div>
                
                {/* Recurring Options */}
                {recurring && (
                  <div className="pl-4 border-l-2 border-sage-100 space-y-4">
                    {/* Recurring Pattern */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Repeats
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700"
                        value={recurringPattern}
                        onChange={(e) => setRecurringPattern(e.target.value as any)}
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                    
                    {/* Weekly Options - Days Selection */}
                    {recurringPattern === 'weekly' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          On which days?
                        </label>
                        <div className="grid grid-cols-7 gap-1">
                          {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                            <button
                              key={day}
                              type="button"
                              onClick={() => {
                                if (recurringDays.includes(day)) {
                                  setRecurringDays(recurringDays.filter(d => d !== day));
                                } else {
                                  setRecurringDays([...recurringDays, day]);
                                }
                              }}
                              className={`py-1 rounded-md text-center text-sm font-medium ${
                                recurringDays.includes(day)
                                  ? 'bg-sage-600 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {getDayName(day).substring(0, 1)}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Monthly Options - Date Selection */}
                    {recurringPattern === 'monthly' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          On which day of the month?
                        </label>
                        <input
                          type="date"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          The reminder will occur monthly on day {date ? parseInt(date.split('-')[2], 10) : ''}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Date for non-recurring or weekly/monthly */}
                {(!recurring || recurringPattern === 'weekly' || recurringPattern === 'monthly') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {recurring ? 'Start Date' : 'Date *'}
                    </label>
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                )}
                
                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (optional)
                  </label>
                  <textarea
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700"
                    placeholder="Additional details or instructions..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingReminder(null);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={editingReminder ? handleUpdateReminder : handleAddReminder}
                  disabled={!title.trim() || !time}
                  className={`px-4 py-2 rounded-md text-white flex items-center ${
                    title.trim() && time ? 'bg-sage-600 hover:bg-sage-700' : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingReminder ? 'Update' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RemindersPage;