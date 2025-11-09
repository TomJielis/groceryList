import { useAuthStore } from '@/stores/auth'

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();

  // Redirect authenticated users from home to dashboard (client only to avoid SSR hydration flashes)
  if (process.client && to.path === '/' && authStore.user)
  {
    return navigateTo('/dashboard');
  }

  // Protected paths logic
  const protectedPaths = ['/dashboard', '/cards', '/profile', '/list'];
  const requiresAuth = (to.meta as any)?.requiresAuth || protectedPaths.some(p => to.path === p || to.path.startsWith(p + '/'));

  // Server + client: if route requires auth and no user, redirect to home
  if (requiresAuth && !authStore.user) {
    return navigateTo('/');
  }
});
