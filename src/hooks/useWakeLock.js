import { useState, useEffect, useCallback } from 'react';

export function useWakeLock() {
  const [wakeLock, setWakeLock] = useState(null);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsSupported('wakeLock' in navigator && 'request' in navigator.wakeLock);
  }, []);

  const requestWakeLock = useCallback(async () => {
    if (!isSupported) {
      setError('Wake Lock is not supported in this browser');
      return false;
    }

    try {
      const lock = await navigator.wakeLock.request('screen');
      setWakeLock(lock);
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

  // release lock
  const releaseWakeLock = useCallback(async () => {
    if (wakeLock) {
      try {
        await wakeLock.release();
        setWakeLock(null);
        return true;
      } catch (err) {
        setError(`Failed to release wake lock: ${err.message}`);
        return false;
      }
    }
    return true;
  }, [wakeLock]);

  // visibility change
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && !wakeLock) {
        await requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [wakeLock, requestWakeLock]);

  // cleanup 
  useEffect(() => {
    return () => {
      if (wakeLock) {
        releaseWakeLock();
      }
    };
  }, [wakeLock, releaseWakeLock]);

  return {
    isSupported,
    isActive: !!wakeLock,
    error,
    requestWakeLock,
    releaseWakeLock
  };
}