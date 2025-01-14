import { useState, useEffect, useCallback, useRef } from 'react';

export function useWakeLock() {
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState(null);
  const wakeLockRef = useRef(null);

  useEffect(() => {
    setIsSupported('wakeLock' in navigator && 'request' in navigator.wakeLock);
  }, []);

  const requestWakeLock = useCallback(async () => {
    if (!isSupported) {
      setError('Wake Lock is not supported in this browser');
      return false;
    }

    if (wakeLockRef.current) {
      return true;
    }

    try {
      const lock = await navigator.wakeLock.request('screen');
      wakeLockRef.current = lock;
      
      lock.addEventListener('release', () => {
        wakeLockRef.current = null;
      });

      setError(null);
      return true;
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setError('Wake Lock request was denied');
      } else {
        setError(`Wake Lock error: ${err.message}`);
      }
      return false;
    }
  }, [isSupported]);

  const releaseWakeLock = useCallback(async () => {
    const lock = wakeLockRef.current;
    if (lock) {
      try {
        await lock.release();
        wakeLockRef.current = null;
        return true;
      } catch (err) {
        setError(`Failed to release wake lock: ${err.message}`);
        return false;
      }
    }
    return true;
  }, []);

  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && !wakeLockRef.current) {
        await requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [requestWakeLock]);

  useEffect(() => {
    return () => {
      if (wakeLockRef.current) {
        releaseWakeLock();
      }
    };
  }, [releaseWakeLock]);

  return {
    isSupported,
    isActive: !!wakeLockRef.current,
    error,
    requestWakeLock,
    releaseWakeLock
  };
}