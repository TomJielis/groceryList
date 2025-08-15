import {ref} from 'vue'

let jwt = ref();
let user = ref();

export function useAuth() {

  async function register(userData: { name: string, email: string, password: string }) {
    try {
      const registerResponse = await fetch('/api/user/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!registerResponse.ok) {
        throw new Error(`Failed to register user: ${registerResponse.statusText}`);
      }

      const data = await registerResponse.json();
      user.value = data.user; // Update user state with returned data
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (error) {
      console.error('Error registering user:', error);
    }
  }

  async function login(userData: { email: string, password: string }) {
    try {
      const loginResponse = await fetch('/api/user/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!loginResponse.ok) {
        throw new Error(`Failed to register user: ${loginResponse.statusText}`);
      }

      const data = await loginResponse.json();
      user.value = data.user; // Update user state with returned data
      console.log(data.user.access_token);
      jwt.value = data.user.access_token; // Update user state with returned data

      jwt.value = 'strong';
      // localStorage.setItem('user', JSON.stringify(data.user.auth_user));
      // localStorage.setItem('jwt', data.user.access_token); // Store CSRF token
    } catch (error) {
      console.error('Error registering user:', error);
    }
  }


  async function fetchUser() {
    try {
      const response = await fetch('/api/user/');
      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.statusText}`);
      }
      user.value = await response.json();
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }

  function logout() {
    user.value = null;
    localStorage.removeItem('user');
    localStorage.removeItem('csrfToken');
    window.location.href = '/';
  }


  return {
    user,
    jwt,
    login,
    logout,
    register,
  }
}