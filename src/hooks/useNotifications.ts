import { useCallback, useEffect, useState } from 'react';

type PermissionState = NotificationPermission | 'unsupported';

export const useNotifications = () => {
  const isSupported = typeof window !== 'undefined' && 'Notification' in window;
  const [permission, setPermission] = useState<PermissionState>(() =>
    isSupported ? Notification.permission : 'unsupported',
  );

  useEffect(() => {
    if (!isSupported) {
      setPermission('unsupported');
    }
  }, [isSupported]);

  const requestPermission = useCallback(async () => {
    if (!isSupported) return 'unsupported' as const;
    if (permission === 'granted' || permission === 'denied') return permission;

    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  }, [isSupported, permission]);

  const sendNotification = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (!isSupported) return;
      if (permission !== 'granted') return;

      try {
        new Notification(title, options);
      } catch (error) {
        console.error('Notification error', error);
      }
    },
    [isSupported, permission],
  );

  return {
    isSupported,
    permission,
    requestPermission,
    sendNotification,
  } as const;
};
