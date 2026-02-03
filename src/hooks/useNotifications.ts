import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Check if notifications are supported
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async (): Promise<NotificationPermission> => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    }
    return 'denied';
  };

  const sendNotification = (title: string, options?: NotificationOptions) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'lovebond-notification',
        ...options
      });
      
      // Trigger vibration separately if supported
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
      
      return notification;
    }
    return null;
  };

  const sendMessageNotification = (senderName: string, message: string) => {
    // Show toast notification
    toast.success(`💕 ${senderName}`, {
      description: message,
      duration: 5000
    });

    // Show browser notification if permission granted
    if (permission === 'granted') {
      sendNotification(`💕 ${senderName}`, {
        body: message,
        tag: 'message-notification'
      });
    }
  };

  const sendHugNotification = (senderName: string, message?: string) => {
    const body = message || "Sent you a warm virtual hug! 🤗";
    
    // Show toast notification
    toast.success(`🤗 ${senderName} hugged you!`, {
      description: body,
      duration: 5000
    });

    // Show browser notification if permission granted
    if (permission === 'granted') {
      sendNotification(`🤗 Hug from ${senderName}`, {
        body: body,
        tag: 'hug-notification'
      });
      
      // Longer vibration pattern for hugs
      if ('vibrate' in navigator) {
        navigator.vibrate([300, 100, 300, 100, 300]);
      }
    }
  };

  return {
    permission,
    requestPermission,
    sendNotification,
    sendMessageNotification,
    sendHugNotification,
    isSupported: 'Notification' in window
  };
};