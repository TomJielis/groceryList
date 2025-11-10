import { useAuthStore } from '@/stores/auth'

export default defineNuxtRouteMiddleware((to) => {
  if (process.server) {
    return;
  }
  const authStore = useAuthStore();

  if (to.path === '/' && authStore.user) {
    return navigateTo('/dashboard');
  }

  const protectedPaths = ['/dashboard', '/cards', '/profile', '/list'];
  const requiresAuth = (to.meta as any)?.requiresAuth || protectedPaths.some(p => to.path === p || to.path.startsWith(p + '/'));

  if (requiresAuth && !authStore.user) {
    return navigateTo('/');
  }
});
