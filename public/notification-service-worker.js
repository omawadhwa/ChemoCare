// Service Worker for handling notifications
self.addEventListener('install', (event) => {
  console.log('Notification Service Worker installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Notification Service Worker activated');
  return self.clients.claim();
});

// Store scheduled notifications
const scheduledNotifications = new Map();

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  const notification = event.notification;
  const action = event.action;
  
  if (action === 'complete') {
    // Handle "Mark Complete" action
    const data = notification.data;
    
    // Post message to client to mark reminder as complete
    event.waitUntil(
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'COMPLETE_REMINDER',
            reminderId: data.reminderId
          });
        });
      })
    );
  } else if (action === 'snooze') {
    // Handle "Snooze" action - reschedule notification for 10 minutes later
    const data = notification.data;
    
    // Reschedule the notification for 10 minutes later
    event.waitUntil(
      self.registration.showNotification(notification.title, {
        ...notification.options,
        data: {
          ...data,
          snoozed: true
        },
        timestamp: Date.now() + 10 * 60 * 1000 // 10 minutes later
      })
    );
  } else {
    // Default action - open/focus the app
    event.waitUntil(
      self.clients.matchAll({ type: 'window' }).then(clientList => {
        // Check if there is already a window/tab open with the target URL
        for (const client of clientList) {
          if (client.url.includes('/reminders') && 'focus' in client) {
            return client.focus();
          }
        }
        
        // If no window/tab is open, open a new one
        if (self.clients.openWindow) {
          return self.clients.openWindow('/reminders');
        }
      })
    );
  }
  
  notification.close();
});

// Listen for push events (for future implementation with a backend)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/icons/reminder-icon.png',
        badge: '/icons/badge-icon.png',
        tag: data.id,
        actions: [
          { action: 'complete', title: 'Mark Complete' },
          { action: 'snooze', title: 'Snooze' }
        ],
        data: data
      })
    );
  }
});

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  console.log('Message received in service worker:', event.data);
  
  if (event.data.type === 'SCHEDULE_NOTIFICATION') {
    const reminder = event.data.reminder;
    const notificationTime = new Date(reminder.scheduledTime).getTime();
    const now = Date.now();
    const delay = Math.max(0, notificationTime - now);
    
    // For testing purposes, if delay is more than 1 day, use a shorter delay
    const testDelay = delay > 86400000 ? 10000 : delay;
    
    // Use waitUntil to keep the message channel open until we're done
    event.waitUntil(new Promise((resolve) => {
      // Store the timeout ID so we can cancel it if needed
      const timeoutId = setTimeout(() => {
        self.registration.showNotification(reminder.title, {
          body: reminder.notes || `Time for your ${reminder.type} reminder`,
          icon: '/icons/reminder-icon.png',
          badge: '/icons/badge-icon.png',
          vibrate: reminder.vibrate ? [200, 100, 200] : undefined,
          tag: reminder.id,
          requireInteraction: true,
          actions: [
            { action: 'complete', title: 'Mark Complete' },
            { action: 'snooze', title: 'Snooze' }
          ],
          data: reminder
        }).then(() => {
          // Remove from scheduled notifications map once shown
          scheduledNotifications.delete(reminder.id);
          resolve();
        });
      }, testDelay);
      
      // Store the notification info
      scheduledNotifications.set(reminder.id, {
        timeoutId,
        scheduledTime: new Date(now + testDelay).toISOString()
      });
      
      // Send confirmation back to the client (not using postMessage here to prevent the error)
      console.log(`Notification for "${reminder.title}" scheduled at ${new Date(now + testDelay).toLocaleString()}`);
    }));
  } else if (event.data.type === 'CANCEL_NOTIFICATION') {
    const reminderId = event.data.reminderId;
    // Use waitUntil to keep the message channel open until we're done
    event.waitUntil(new Promise((resolve) => {
      if (scheduledNotifications.has(reminderId)) {
        clearTimeout(scheduledNotifications.get(reminderId).timeoutId);
        scheduledNotifications.delete(reminderId);
        console.log(`Notification for ID ${reminderId} has been cancelled`);
      }
      resolve();
    }));
  }
});
