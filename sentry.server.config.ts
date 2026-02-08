// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://928901e1bbc9870e227fbc6369ec336c@o456904.ingest.us.sentry.io/4510835553730560',

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 0.1,

  // Enable logs to be sent to Sentry
  enableLogs: false,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: false,

  beforeBreadcrumb(breadcrumb) {
    if (breadcrumb.category === 'http') {
      const { data } = breadcrumb;
      if (data && data.url) {
        // Redact any auth or keys in server-side outbound requests
        breadcrumb.data!.url = data.url
          .replace(/key=[^&]+/gi, 'key=[REDACTED]')
          .replace(/api_key=[^&]+/gi, 'api_key=[REDACTED]')
          .replace(/token=[^&]+/gi, 'token=[REDACTED]');
      }
    }
    return breadcrumb;
  },
});
