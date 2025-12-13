import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router';
import { useNotification } from '~/composables/useNotification';

/**
 * Global handler for 401 Unauthorized responses
 */
function handleUnauthorized() {
  const authStore = useAuthStore();
  const router = useRouter();
  const { showNotification } = useNotification();

  // Clear auth data
  authStore.clearAuth();

  // Show notification
  showNotification('Session expired. Please log in again.', 'error');

  // Redirect to login
  router.push('/auth/login').catch(() => {
    // If navigation fails, reload the page
    window.location.href = '/auth/login';
  });
}

export { handleUnauthorized };

