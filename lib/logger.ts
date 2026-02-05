import * as Sentry from '@sentry/nextjs';

/**
 * Professional Logging Utility
 * Wraps console methods and integrates with Sentry for observability.
 */
class Logger {
    private isDevelopment = process.env.NODE_ENV === 'development';

    /**
     * Logs information to breadcrumbs and console (in dev).
     */
    info(message: string, data?: any) {
        if (this.isDevelopment) {
            console.log(`[INFO] ${message}`, data || '');
        }

        Sentry.addBreadcrumb({
            category: 'log',
            message,
            level: 'info',
            data,
        });
    }

    /**
     * Logs warnings to breadcrumbs and console (in dev).
     */
    warn(message: string, data?: any) {
        if (this.isDevelopment) {
            console.warn(`[WARN] ${message}`, data || '');
        }

        Sentry.addBreadcrumb({
            category: 'log',
            message,
            level: 'warning',
            data,
        });
    }

    /**
     * Logs errors to Sentry and console.
     * Professional error handling: captures exception with context.
     */
    error(message: string, error?: any, context?: Record<string, any>) {
        // Console output for visibility (professional format)
        console.error(`[ERROR] ${message}`, error || '');

        // Capture in Sentry
        Sentry.captureException(error || new Error(message), {
            extra: {
                message,
                ...context,
            },
        });
    }

    /**
     * Logs debug information only in development.
     */
    debug(message: string, data?: any) {
        if (this.isDevelopment) {
            console.debug(`[DEBUG] ${message}`, data || '');
        }
    }
}

export const logger = new Logger();
