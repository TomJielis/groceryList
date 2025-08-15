export default defineNuxtRouteMiddleware((to, from) => {
// jwt.value will be reactive
  const { jwt,user } = useAuth();
  console.log('hier is the middleware');
  console.log(jwt.value);
    if (!user.value) {
        return navigateTo('/auth/login');
    }
});