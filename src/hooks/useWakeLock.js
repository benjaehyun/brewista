import { useState, useEffect, useCallback, useRef } from 'react';

export function useWakeLock() {
    const [isSupported, setIsSupported] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [error, setError] = useState(null);
    const wakeLockRef = useRef(null);
    const shouldReacquireRef = useRef(false);

    // verify that it's supported when the hook is first called 
    useEffect(() => {
        setIsSupported('wakeLock' in navigator && 'request' in navigator.wakeLock);
    }, []);


    const requestWakeLock = useCallback(async () => {
        if (!isSupported) {
            setError('Wake Lock is not supported in this browser');
            return false;
        }

        try {
            setError(null);
            console.log('requesting wake lock ')
            
            // wake lock request with optional parameter for screen (unnecessary as this is the only supported request but may change so manually passing)
            const lock = await navigator.wakeLock.request('screen');
            wakeLockRef.current = lock;
            
            // listener for the release handler 
            lock.addEventListener('release', () => {
                console.log('Wake lock was released');
                if (wakeLockRef.current === lock) {
                    wakeLockRef.current = null;
                    
                    // If document is hidden, this is likely an auto-release due to visibility
                    // Set our ref to reacquire when document becomes visible again
                    if (document.visibilityState === 'hidden') {
                        shouldReacquireRef.current = true;
                    } else {
                        setIsActive(false);
                    }
                }
            });

            setIsActive(true);
            shouldReacquireRef.current = true;
            return true;
        } catch (err) {
            // specific not allowed error || could possibly add a specific error msg
            if (err.name === 'NotAllowedError') {
                setError('Wake Lock request was denied. Please ensure your device settings allow this.');
            } else {
                setError(`Wake Lock error: ${err.message}`);
            }
        
            console.error('Wake Lock request failed:', err);
            setIsActive(false);
            shouldReacquireRef.current = false;
            return false;
        }
    }, [isSupported]);

    // release the wake lock
    const releaseWakeLock = useCallback(async () => {
        if (wakeLockRef.current) {
            try {
                await wakeLockRef.current.release();
                wakeLockRef.current = null;
                setIsActive(false);
                shouldReacquireRef.current = false;
                return true;
            } catch (err) {
                console.error('Failed to release wake lock:', err);
                setError(`Failed to release wake lock: ${err.message}`);
                return false;
            }
        }
        return true;
    }, []);

    // visibility change handling
    useEffect(() => {
        const handleVisibilityChange = async () => {
        // Only try to reacquire wake lock if we previously had an active wake lock and we have returned to a visible state
            if (document.visibilityState === 'visible' && shouldReacquireRef.current && !wakeLockRef.current) {
                console.log('Page became visible again, reacquiring wake lock');
                await requestWakeLock();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [requestWakeLock]);

    // Clean up wake lock when the components using this hook unmounts
    useEffect(() => {
        return () => {
            if (wakeLockRef.current) {
                wakeLockRef.current.release().catch(console.error);
                wakeLockRef.current = null;
                shouldReacquireRef.current = false;
            }
        };
    }, []);

    return {
        isSupported,
        isActive,
        error,
        requestWakeLock,
        releaseWakeLock
    };
}