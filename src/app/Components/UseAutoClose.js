import { useEffect } from 'react';

export function useAutoClose(onClose, delay = 3000) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, delay);

        return () => clearTimeout(timer);
    }, [onClose, delay]);
}
