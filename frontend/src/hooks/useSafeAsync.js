import { useEffect, useRef, useCallback } from 'react';

export const useSafeAsync = () => {
    const isMountedRef = useRef(true);

    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const safeSetState = useCallback((callback) => {
        if (isMountedRef.current) {
            callback();
        }
    }, []);

    return safeSetState;
};
