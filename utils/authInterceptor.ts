import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router';
import { useNotification } from '~/composables/useNotification';

// Flag to prevent multiple simultaneous logout calls
let isHandlingUnauthorized = false;

/**
 * Global handler for 401 Unauthorized responses
 */
function handleUnauthorized() {
  // Prevent multiple simultaneous calls
  if (isHandlingUnauthorized) {
    return;
  }

  isHandlingUnauthorized = true;

  const authStore = useAuthStore();
  const router = useRouter();
  const { showNotification } = useNotification();


  // Clear auth data immediately
  authStore.clearAuth();

  // Show notification
  showNotification('Session expired. Please log in again.', 'error');

  // Force immediate redirect using window.location for reliability
  // This ensures the redirect happens even if router is in a weird state
  window.location.href = '/auth/login';
}

export { handleUnauthorized };

