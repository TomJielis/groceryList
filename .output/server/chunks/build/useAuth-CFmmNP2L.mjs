import { b as useAuthStore } from './server.mjs';

function useAuth() {
  const authStore = useAuthStore();
  async function register(userData) {
    try {
      const registerResponse = await fetch("/api/user/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
      });
      if (!registerResponse.ok) {
        throw new Error(`Failed to register user: ${registerResponse.statusText}`);
      }
      const data = await registerResponse.json();
      authStore.setUser(data.user);
    } catch (error) {
      console.error("Error registering user:", error);
    }
  }
  async function login(userData) {
    try {
      const loginResponse = await fetch("/api/user/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "withCredentials": "true"
          // Ensure cookies are sent with the request
        },
        body: JSON.stringify(userData)
      });
      if (!loginResponse.ok) {
        throw new Error(`Failed to register user: ${loginResponse.statusText}`);
      }
      return await loginResponse.json();
    } catch (error) {
      console.error("Error registering user:", error);
    }
  }
  return {
    login,
    register
  };
}

export { useAuth as u };
//# sourceMappingURL=useAuth-CFmmNP2L.mjs.map
