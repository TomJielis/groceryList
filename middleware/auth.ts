export default defineNuxtRouteMiddleware((to, from) => {
    const { user, retrieveJwtToken } = useAuth();
  console.log('hier is the middleware');
  console.log(retrieveJwtToken());
    if (!user.value) {
        return navigateTo('/auth/login');
    }
});