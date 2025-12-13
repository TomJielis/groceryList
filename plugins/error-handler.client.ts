import { handleUnauthorized } from '~/utils/authInterceptor';

export default defineNuxtPlugin((nuxtApp) => {
  if (process.server) return;

  // Intercept global fetch
  const originalGlobalFetch = global.fetch;
  global.fetch = (async (resource: any, config: any = {}) => {
    try {
      const response = await originalGlobalFetch(resource, config);
      // Check for 401 status - handle immediately
      if (response.status === 401) {
        handleUnauthorized();
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
              handleUnauthorized();
            // Don't return, the page will redirect
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
      handleUnauthorized();
      event.preventDefault();
    }
  };

  window.addEventListener('unhandledrejection', handleUnhandledRejection);

  // Cleanup on app unmount
  nuxtApp.hook('app:unmounted', () => {
    window.removeEventListener('unhandledrejection', handleUnhandledRejection);
  });
});



