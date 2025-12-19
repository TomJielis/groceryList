import { useAuthStore } from '~/stores/auth';
import { useNotification } from '~/composables/useNotification';

// Flag to prevent multiple simultaneous logout calls
let isHandlingUnauthorized = false;
let lastUnauthorizedTime = 0;

/**
 * Global handler for 401 Unauthorized responses
 */
function handleUnauthorized() {
  const now = Date.now();

  // Prevent multiple calls within 2 seconds
  if (isHandlingUnauthorized && (now - lastUnauthorizedTime) < 2000) {
    return;
  }

  // Check if already on login/info pages to prevent loops
  const currentPath = window.location.pathname;
  const isOnAuthPage = currentPath.includes('/auth/') || currentPath === '/information';

  if (isOnAuthPage) {
    // Already on an auth page, just clear the auth without redirecting
    const authStore = useAuthStore();
    authStore.clearAuth();
    return;
  }

  isHandlingUnauthorized = true;
  lastUnauthorizedTime = now;

  const authStore = useAuthStore();
  const { showNotification } = useNotification();

  // Clear auth data immediately
  authStore.clearAuth();

  // Show notification
  showNotification('Session expired. Please log in again.', 'error');

  // Use navigateTo for smoother navigation
  try {
    navigateTo('/auth/login');
  } catch (e) {
    // Fallback to window.location if navigateTo fails
    window.location.href = '/auth/login';
  }

  // Reset the flag after a delay to allow future unauthorized handling
  setTimeout(() => {
    isHandlingUnauthorized = false;
  }, 3000);
}

export { handleUnauthorized };

