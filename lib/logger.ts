import * as Sentry from '@sentry/nextjs';

/**
 * Professional Logging Utility
 * Wraps console methods and integrates with Sentry for observability.
 * Includes data redaction for security.
 */
class Logger {
    private isDevelopment = process.env.NODE_ENV === 'development';

    // Keys to redact from logs for security
    private sensitiveKeys = [
        'api_key', 'apikey', 'key', 'token', 'auth', 'password', 'secret',
        'private', 'credential', 'x-api-key', 'authorization', 'signature',
        'bold_api_key', 'epayco_private_key', 'stripe_secret_key', 'binance_pay_secret_key'
    ];

    /**
     * Recursively redacts sensitive information from objects/arrays.
     */
    private redact(data: any): any {
        if (!data || typeof data !== 'object') {
            return data;
        }

        if (Array.isArray(data)) {
            return data.map(item => this.redact(item));
        }

        const redacted: any = {};
        for (const [key, value] of Object.entries(data)) {
            const lowerKey = key.toLowerCase();
            if (this.sensitiveKeys.some(sKey => lowerKey.includes(sKey))) {
                redacted[key] = '[REDACTED]';
            } else if (typeof value === 'object') {
                redacted[key] = this.redact(value);
            } else {
                redacted[key] = value;
            }
        }
        return redacted;
    }

    /**
     * Logs information to breadcrumbs and console (in dev).
     */
    info(message: string, data?: any) {
        const cleanData = this.redact(data);
        if (this.isDevelopment) {
            console.log(`[INFO] ${message}`, cleanData || '');
        }

        Sentry.addBreadcrumb({
            category: 'log',
            message,
            level: 'info',
            data: cleanData,
        });
    }

    /**
     * Logs warnings to breadcrumbs and console (in dev).
     */
    warn(message: string, data?: any) {
        const cleanData = this.redact(data);
        if (this.isDevelopment) {
            console.warn(`[WARN] ${message}`, cleanData || '');
        }

        Sentry.addBreadcrumb({
            category: 'log',
            message,
            level: 'warning',
            data: cleanData,
        });
    }

    /**
     * Logs errors to Sentry and console.
     * Professional error handling: captures exception with context.
     */
    error(message: string, error?: any, context?: Record<string, any>) {
        const cleanContext = this.redact(context);
        const cleanError = error instanceof Error ? error : this.redact(error);

        // Console output for visibility (professional format)
        console.error(`[ERROR] ${message}`, cleanError || '');

        // Capture in Sentry
        Sentry.captureException(cleanError instanceof Error ? cleanError : new Error(message), {
            extra: {
                message,
                ...cleanContext,
            },
        });
    }

    /**
     * Logs debug information only in development.
     */
    debug(message: string, data?: any) {
        if (this.isDevelopment) {
            const cleanData = this.redact(data);
            console.debug(`[DEBUG] ${message}`, cleanData || '');
        }
    }
}

export const logger = new Logger();
