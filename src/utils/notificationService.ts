import { Reminder } from '../types/reminder';

let serviceWorkerRegistration: ServiceWorkerRegistration | null = null;

// Interface for notification options
export interface NotificationOptions {
  sound?: string;
  vibrate?: boolean;
}

// Check if notifications are supported and permission is granted
export const checkNotificationPermission = async (): Promise<boolean> => {
  // Check if the browser supports notifications
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  // Check if permission is already granted
  if (Notification.permission === 'granted') {
    return true;
  }

  // Request permission
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

// Register service worker
export const registerNotificationServiceWorker = async (): Promise<boolean> => {
  try {
    if ('serviceWorker' in navigator) {
      // If we already have a registration, return true
      if (serviceWorkerRegistration) {
        return true;
      }
      
      // Check for existing service worker
      const registrations = await navigator.serviceWorker.getRegistrations();
      const existingRegistration = registrations.find(reg => 
        reg.scope.includes(window.location.origin));
      
      if (existingRegistration) {
        serviceWorkerRegistration = existingRegistration;
        console.log('Using existing Service Worker registration:', existingRegistration.scope);
        return true;
      }
      
      // Register new service worker
      serviceWorkerRegistration = await navigator.serviceWorker.register('/notification-service-worker.js');
      console.log('Service Worker registered with scope:', serviceWorkerRegistration.scope);
      
      // Wait for the service worker to be activated
      if (serviceWorkerRegistration.installing) {
        await new Promise<void>((resolve) => {
          serviceWorkerRegistration!.installing!.addEventListener('statechange', (event) => {
            if ((event.target as ServiceWorker).state === 'activated') {
              resolve();
            }
          });
        });
      }
      
      return true;
    }
    return false;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return false;
  }
};

// Initialize notification system
export const initializeNotifications = async (): Promise<boolean> => {
  try {
    const hasPermission = await checkNotificationPermission();
    if (!hasPermission) {
      console.log('Notification permission not granted');
      return false;
    }

    const registered = await registerNotificationServiceWorker();
    if (!registered) {
      console.log('Service worker registration failed');
      return false;
    }

    // Set up listener for messages from service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      console.log('Message from service worker:', event.data);
      
      // Handle completed reminders
      if (event.data.type === 'COMPLETE_REMINDER') {
        // The UI component will handle this separately
        // Just dispatch a custom event that the component can listen for
        const customEvent = new CustomEvent('reminderCompleted', {
          detail: { reminderId: event.data.reminderId }
        });
        window.dispatchEvent(customEvent);
      }
    });

    console.log('Notification system initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize notification system:', error);
    return false;
  }
};

// Schedule a notification for a reminder
export const scheduleNotification = async (
  reminder: Reminder, 
  options: NotificationOptions = {}
): Promise<boolean> => {
  try {
    // Make sure service worker is ready
    if (!serviceWorkerRegistration) {
      const registered = await registerNotificationServiceWorker();
      if (!registered) {
        console.error('Service worker not registered, cannot schedule notification');
        return false;
      }
    }

    // Ensure we have an active service worker
    if (!navigator.serviceWorker.controller) {
      console.log('Waiting for service worker to be ready...');
      await navigator.serviceWorker.ready;
      
      // Sometimes there can be a delay after 'ready' before the controller is actually available
      if (!navigator.serviceWorker.controller) {
        const timeout = 3000; // Wait 3 seconds max
        await new Promise<void>((resolve, reject) => {
          let elapsed = 0;
          const interval = setInterval(() => {
            elapsed += 200;
            if (navigator.serviceWorker.controller) {
              clearInterval(interval);
              resolve();
            } else if (elapsed >= timeout) {
              clearInterval(interval);
              reject(new Error('Service worker controller not available after timeout'));
            }
          }, 200);
        });
      }
      
      if (!navigator.serviceWorker.controller) {
        console.error('Service worker controller still not available, cannot schedule notification');
        return false;
      }
    }

    // Calculate the time when the notification should be shown
    const notificationTime = new Date();
    const [hours, minutes] = reminder.time.split(':').map(Number);
    notificationTime.setHours(hours, minutes, 0, 0);

    // If the time has already passed for today and it's not a recurring reminder,
    // schedule it for the next appropriate time
    if (notificationTime < new Date() && !reminder.recurring && reminder.date === new Date().toISOString().split('T')[0]) {
      console.log('Notification time has already passed for today');
      // For testing, let's schedule it for 10 seconds from now
      notificationTime.setTime(Date.now() + 10000);
    }

    // For recurring reminders, we need to calculate when the next occurrence is
    if (reminder.recurring) {
      const today = new Date();
      const dayOfWeek = today.getDay(); // 0-6, Sunday-Saturday

      if (reminder.recurringPattern === 'daily') {
        // If time has passed for today, schedule for tomorrow
        if (notificationTime < today) {
          notificationTime.setDate(notificationTime.getDate() + 1);
        }
      } else if (reminder.recurringPattern === 'weekly' && reminder.recurringDays) {
        // Find the next day in the week that matches
        let daysToAdd = 0;
        let found = false;

        // Check if today is in the recurring days and time hasn't passed
        if (reminder.recurringDays.includes(dayOfWeek) && notificationTime > today) {
          found = true;
        } else {
          // Find the next day that matches
          for (let i = 1; i <= 7; i++) {
            const nextDay = (dayOfWeek + i) % 7;
            if (reminder.recurringDays.includes(nextDay)) {
              daysToAdd = i;
              found = true;
              break;
            }
          }
        }

        if (found && daysToAdd > 0) {
          notificationTime.setDate(notificationTime.getDate() + daysToAdd);
        }
      } else if (reminder.recurringPattern === 'monthly' && reminder.date) {
        // For monthly reminders, use the day from the date
        const dayOfMonth = parseInt(reminder.date.split('-')[2], 10);
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        
        // Set the notification to the specified day of the current month
        notificationTime.setFullYear(currentYear, currentMonth, dayOfMonth);
        
        // If this date has already passed, move to next month
        if (notificationTime < today) {
          notificationTime.setMonth(currentMonth + 1);
        }
      }
    } else if (reminder.date) {
      // For non-recurring reminders with a specific date
      const [year, month, day] = reminder.date.split('-').map(Number);
      notificationTime.setFullYear(year, month - 1, day);
    }

    // Send the reminder to the service worker for scheduling
    navigator.serviceWorker.controller.postMessage({
      type: 'SCHEDULE_NOTIFICATION',
      reminder: {
        ...reminder,
        scheduledTime: notificationTime.toISOString(),
        sound: options.sound || '',
        vibrate: options.vibrate !== undefined ? options.vibrate : true
      }
    });

    console.log(`Notification scheduled for ${reminder.title} at ${notificationTime.toLocaleString()}`);
    return true;
  } catch (error) {
    console.error('Failed to schedule notification:', error);
    return false;
  }
};

// Cancel a scheduled notification
export const cancelNotification = (reminderId: string): void => {
  try {
    if (!navigator.serviceWorker.controller) {
      console.warn('Service worker controller not available, cannot cancel notification');
      return;
    }
    
    navigator.serviceWorker.controller.postMessage({
      type: 'CANCEL_NOTIFICATION',
      reminderId
    });
    
    console.log(`Requested cancellation of notification with ID: ${reminderId}`);
  } catch (error) {
    console.error('Failed to cancel notification:', error);
  }
};

// Schedule all active reminders
export const scheduleAllActiveReminders = (reminders: Reminder[]): void => {
  try {
    const activeReminders = reminders.filter(r => r.active && !r.completed);
    
    // Schedule with small delay between each to avoid overwhelming the service worker
    activeReminders.forEach((reminder, index) => {
      setTimeout(() => {
        scheduleNotification(reminder);
      }, index * 100);
    });
    
    console.log(`Scheduled ${activeReminders.length} active reminders`);
  } catch (error) {
    console.error('Failed to schedule active reminders:', error);
  }
};
