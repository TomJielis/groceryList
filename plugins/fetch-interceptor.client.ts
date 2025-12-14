import { handleUnauthorized } from '~/utils/authInterceptor';
import { useAuthStore } from '~/stores/auth';

export default defineNuxtPlugin(() => {
  if (process.server) return;

  // Intercept all fetch requests to add Authorization header
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async (url: string | Request, options?: RequestInit): Promise<Response> => {
    const authStore = useAuthStore();
    const token = authStore.token;

    // Convert url to string if it's a Request object
    const urlString = typeof url === 'string' ? url : url.url;

    let finalOptions = options;

    // Only add Authorization header to our own API endpoints
    if (urlString && urlString.includes('/api/') && token) {
      const opts = { ...options } || {};
      if (!opts.headers) {
        opts.headers = {};
      }

      // Convert headers to object if it's a Headers instance
      const headersObj = opts.headers instanceof Headers
        ? Object.fromEntries(opts.headers)
        : { ...(opts.headers as Record<string, string>) };

      // Add Authorization header if not already present
      if (!headersObj['Authorization']) {
        headersObj['Authorization'] = `Bearer ${token}`;
      }

      opts.headers = headersObj;
      finalOptions = opts;
    }

    const response = await originalFetch(url, finalOptions);

    // Handle 401 errors
    if (response.status === 401) {
      handleUnauthorized();
    }

    return response;
  };

  return {
    provide: {
      safeFetch: async (url: string, options?: any) => {
        try {
          const result = await globalThis.fetch(url, options);
          return result;
        } catch (error: any) {
          throw error;
        }
      }
    }
  };
});

