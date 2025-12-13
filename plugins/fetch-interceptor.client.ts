import { handleUnauthorized } from '~/utils/authInterceptor';

export default defineNuxtPlugin(() => {
  if (process.server) return;

  // Create a custom $fetch instance that handles 401s
  const originalFetch = $fetch;

  // We need to intercept at the HTTP level by modifying fetch interceptors
  // Since $fetch internally uses fetch, our global fetch interceptor should catch it
  // But we also add a secondary layer for direct $fetch error handling

  return {
    provide: {
      safeFetch: async (url: string, options?: any) => {
        try {
          const result = await originalFetch(url, options);
          return result;
        } catch (error: any) {
          // Check if it's a 401 error from $fetch
          if (error?.status === 401 || error?.response?.status === 401) {
            handleUnauthorized();
            throw error;
          }
          throw error;
        }
      }
    }
  };
});

