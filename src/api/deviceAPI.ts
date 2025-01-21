/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios from "axios";
import API_BASE_URL, { Status } from "../constants";
import { Device } from "../types";
import { AppDispatch } from "../app/store";
import { deregister, deviceError, deviceStatus, register } from "../features/deviceSlice";
import { UUID } from "crypto";

export const registerDevice = (deviceName: string, accessToken: string) => async (dispatch: AppDispatch) => {
    try {
        // ToDo - Handling access token using axios - Not required to be handled here as passed as parameter
        // Login and register user is publicly available api (runs without access token) only. Other than that 
        // every api requires access token
        dispatch(deviceStatus({status: Status.LOADING}))
        const url = `${API_BASE_URL}/v1/device/register`;
        const response = await axios.post(url, {
            deviceName
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });
        console.log(response);
        const data = response.data as Device;
        dispatch(register({deviceData : data}))
    } catch (error) {
        console.log("Register device error: ", error);
        dispatch(deviceError({errorData: error}))
    }
}

export const removeDevice = (deviceId: UUID, accessToken: string) => async (dispatch: AppDispatch) => {
    try {
        const url = `${API_BASE_URL}/v1/device/deregister`;
        const response = await axios.post(url, {
            deviceId
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });
        console.log(response);
        const data = response.data as Device;
        dispatch(deregister({deviceData : {deviceId}}))
    } catch (error) {
        console.log("Register device error: ", error);
        dispatch(deviceError({errorData: error}))
    }
}