/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios from "axios";
import API_BASE_URL from "../constants";

export const registerDevice = async (deviceId: string, userId: string, password: string) => {
    try {
        // ToDo - Only device name is required in request body
        // ToDo - Handling access token using axios
        // Login and register user is publicly available api (runs without access token) only. Other than that 
        // every api requires access token
        const response = await axios.post(`${API_BASE_URL}/v1/device/register`, {
            deviceId,
            userId,
            password
        });
        console.log(response);
        return response;
    } catch (error) {
        console.log("Register device error: ", error);
        throw error;
    }
}

export const removeDevice = async (deviceId: string) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/v1/device/deregister`)
        console.log(response.data)
        return response.data
    } catch (error) {
        console.log("Remove device error: ", error);
        throw error
    }
}