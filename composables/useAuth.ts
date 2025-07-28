import {ref} from 'vue'

export function useAuth() {
    // const user = ref<any>(typeof localStorage !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {})
    const csrfToken = computed(() => localStorage.getItem('csrfToken') || '');
    const user = ref<any>(null)


    async function register(userData: { name: string, email: string, password: string, csrf_token:string|null }) {
        try {
            console.log('Registering user with data:', localStorage.getItem('csrfToken') );
            userData.csrf_token = localStorage.getItem('csrfToken') || '';
            const response = await fetch('/api/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error(`Failed to register user: ${response.statusText}`);
            }

            const data = await response.json();
            console.log(data);
            user.value = data.user; // Update user state with returned data
            localStorage.setItem('user', JSON.stringify(data.user));
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

    async function retrieveCsrfToken() {
        // if(localStorage.getItem('csrfToken')) {
        //     console.log('has already a csrf token')
        //    return localStorage.getItem('csrfToken');
        // }
        // console.log('create a new one')
        try {
            const response = await fetch('/api/user/retrieveCsrfToken/');
            const token = (await response.json()).csrf_token;
            localStorage.setItem('csrfToken',token);
        } catch (error) {
            console.error('Error retrieving CSRF token:', error);
        }
    }

    return {
        user,
        csrfToken,
        register,
        retrieveCsrfToken
    }
}