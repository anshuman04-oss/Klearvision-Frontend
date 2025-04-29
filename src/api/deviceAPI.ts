/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios from "axios";
import { API_BASE_URL, Status } from "../constants";
import { Device } from "../types";
import { AppDispatch } from "../app/store";
import { deregister, deviceError, deviceStatus, register, setPlaybackToken } from "../features/deviceSlice";
import { UUID } from "crypto";
import { PlaybackTokenContent } from "../types";

export const registerDevice = (deviceName: string, accessToken: string) => async (dispatch: AppDispatch) => {
    try {
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
        const response = await axios.delete(url, {
            data: { deviceId },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });
        console.log(response);
        dispatch(deregister({deviceData : {deviceId}}))
    } catch (error) {
        console.log("Register device error: ", error);
        dispatch(deviceError({errorData: error}))
    }
}

export const fetchPlaybackToken = (deviceId: string, accessToken: string) => async (dispatch: AppDispatch) => {
    try {
        dispatch(deviceStatus({status: Status.LOADING}))
        const url = `${API_BASE_URL}/v1/auth/playbackToken`;
        const response = await axios.post(url, {
            deviceId
          }, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            }
          });
        console.log(response);
        const data = response.data as PlaybackTokenContent;
        const tokenExpiry = Date.now()/1000 + parseInt(data.expiration.replace(/\D/g, ''), 10);	
        dispatch(setPlaybackToken({playBackToken : data.playbackAccessToken, deviceId, tokenExpiry}))
    } catch (error) {
        console.log("Error fetching Playback token (deviceAPI): ", error);
        dispatch(deviceError({errorData: error}))
    }
}

export const fetchDevices = (accessToken: string) => async (dispatch: AppDispatch) => {
    try {
        dispatch(deviceStatus({status: Status.LOADING}))
        const url = `${API_BASE_URL}/v1/device`;
        const response = await axios.get<{ [key: string]: Device }>(url,{
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            }
        });
        console.log(response);
        const devices = response.data as { [key: string]: Device };
        Object.keys(devices).forEach( (deviceId : string) => {
            dispatch(register({deviceData : devices[deviceId]}))
        });
    } catch (error) {
        console.log("Register device error: ", error);
        dispatch(deviceError({errorData: error}))
    }
}