import { handleUnauthorized } from '~/utils/authInterceptor';

// Track last unauthorized call to prevent spam
let last401Time = 0;

export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.server) return;

  // Intercept global fetch
  const originalGlobalFetch = global.fetch;
  global.fetch = (async (resource: any, config: any = {}) => {
    try {
      const response = await originalGlobalFetch(resource, config);

      // Check for 401 status - handle with debouncing
      if (response.status === 401) {
        const now = Date.now();
        // Only handle if more than 2 seconds since last 401
        if (now - last401Time > 2000) {
          last401Time = now;
          handleUnauthorized();
        }
        return response;
      }

      // For 5xx errors, check if the response contains "Unauthorized" message
      if (response.status >= 500) {
        try {
          // Clone the response so we can read the body
          const clonedResponse = response.clone();
          const data = await clonedResponse.json();

          // Check if the error message contains "Unauthorized"
          if (data.message?.includes('Unauthorized') ||
              data.error?.includes('Unauthorized') ||
              JSON.stringify(data).includes('Unauthorized')) {
            const now = Date.now();
            // Only handle if more than 2 seconds since last 401
            if (now - last401Time > 2000) {
              last401Time = now;
              handleUnauthorized();
            }
          }
        } catch (parseError) {
          // If we can't parse the response, just continue
          // This prevents breaking on non-JSON responses
        }
      }

      return response;
    } catch (error) {
      throw error;
    }
  }) as any;

  // Handle unhandled promise rejections for Unauthorized errors
  const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    const message = event.reason?.message || '';
    if (message.includes('Unauthorized')) {
      const now = Date.now();
      // Only handle if more than 2 seconds since last 401
      if (now - last401Time > 2000) {
        last401Time = now;
        handleUnauthorized();
        event.preventDefault();
      }
    }
  };

  window.addEventListener('unhandledrejection', handleUnhandledRejection);

  // Cleanup on beforeunload
  if (import.meta.client) {
    window.addEventListener('beforeunload', () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    });
  }
});



