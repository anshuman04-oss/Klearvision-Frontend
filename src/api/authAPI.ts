/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";
import API_BASE_URL from "../constants";

let expiresAt = Date.now();

function handleIdleness(access_token: string, expiry_time: string) {
    expiresAt = expiresAt + Number(expiry_time) * 1000;
    // Considering the exipry_time given is in miliseconds.

    localStorage.setItem('access_token', access_token)
    localStorage.setItem('Expires_at', expiresAt.toString())

    const currentTime = Date.now();

    if(currentTime > expiresAt) {
        alert('Your session has been expired. Please log in again');
        localStorage.removeItem('access_token')
        localStorage.removeItem('Expires_at')
        window.location.href = '/login';
    } 
}

// ToDo - Camel case for all the var names
// ToDo - If the user directly comes to some other page like stream, redirect to login.
// If already authorized, login route will always redirect to home.

export const validateUser = async (userId: string, password: string) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/v1/login`, {
            userId,
            password
        });

        console.log(response.data.access_token)
        console.log(response.data.expires_in)

        setInterval(() => {
            handleIdleness(response.data.access_token, response.data.expires_in)
        }, response.data.expires_in)

        return response.data;
    } catch(error) {
        console.error("API Error: ", error)
        throw error;
    }
}






































// import axios from "axios";
// import API_BASE_URL from "../constants/index";

// const api = axios.create({
//     baseURL: API_BASE_URL,
//     headers: {
//         "Content-Type": "application/json",
//     }
// })

// export default api;