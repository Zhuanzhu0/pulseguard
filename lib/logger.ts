/**
 * Production-safe logger utility
 * Logs are silenced in production to avoid leaking sensitive info to browser console
 */

const isDev = process.env.NODE_ENV === 'development';

export const logger = {
    error: (message: string, ...args: unknown[]) => {
        if (isDev) {
            console.error(`[ERROR] ${message}`, ...args);
        }
        // In production, you could send to an error tracking service like Sentry
        // if (typeof window !== 'undefined' && window.Sentry) {
        //     window.Sentry.captureMessage(message, { extra: { args } });
        // }
    },
    warn: (message: string, ...args: unknown[]) => {
        if (isDev) {
            console.warn(`[WARN] ${message}`, ...args);
        }
    },
    info: (message: string, ...args: unknown[]) => {
        if (isDev) {
            console.info(`[INFO] ${message}`, ...args);
        }
    },
    debug: (message: string, ...args: unknown[]) => {
        if (isDev) {
            console.debug(`[DEBUG] ${message}`, ...args);
        }
    },
};
