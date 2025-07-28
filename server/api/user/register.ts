import {readBody} from "h3";
import {useAuth} from "~/composables/useAuth";
export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    // Simulate user registration logic (replace with actual DB logic)
    const {name, email, password, csrf_token} = body;
    const response = await fetch('http://grocerylistapi.test/register', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'csrf_token': csrf_token, // Include CSRF token
        },
        body: JSON.stringify({ name, email, password }),
    });

    console.log('hier');
    console.log( await response.text());
    console.log('einde hier');
    // const newUserData = await newUser.json();
    //
    // console.log(newUserData);


    // return {
    //     success: true,
    //     user: newUser,
    // };
});