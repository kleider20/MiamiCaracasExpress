import { useEffect, useRef, useState } from 'react';

/**
 * Show a status message for a short period of time and hide it automatically.
 *
 * The timer is stored in a ref so every new message cancels the previous one
 * and the timeout is always cleared when the component unmounts.
 */
export function useAutoDismiss(
    message: string | undefined,
    duration = 2500,
): string | null {
    const [visibleMessage, setVisibleMessage] = useState<string | null>(
        message ?? null,
    );
    const timer = useRef<number | null>(null);

    useEffect(() => {
        setVisibleMessage(message ?? null);

        if (timer.current !== null) {
            window.clearTimeout(timer.current);
            timer.current = null;
        }

        if (!message) {
            return;
        }

        timer.current = window.setTimeout(() => {
            setVisibleMessage(null);
            timer.current = null;
        }, duration);

        return () => {
            if (timer.current !== null) {
                window.clearTimeout(timer.current);
                timer.current = null;
            }
        };
    }, [message, duration]);

    return visibleMessage;
}
