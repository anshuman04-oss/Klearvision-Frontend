/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios from "axios";
import API_BASE_URL, { Status } from "../constants";
import { Device } from "../types";
import { AppDispatch } from "../app/store";
import { deregister, deviceError, deviceStatus, register } from "../features/deviceSlice";
import { UUID } from "crypto";

const streamKey: string = "";

export const registerDevice = (deviceName: string, accessToken: string) => async (dispatch: AppDispatch) => {
    try {
        // ToDo - Only device name is required in request body
        // ToDo - Handling access token using axios
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
        const url = `${API_BASE_URL}/v1/device/register`;
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









// Response got on registering device
// {
//     "deviceId": "f8296422-735d-40c3-8616-36b02270a522",
//     "playBackUrl": "https://9f18fad97252.ap-south-1.playback.live-video.net/api/video/v1/ap-south-1.495846082945.channel.uFj1cNdVQebg.m3u8",
//     "playbackAccessToken": "eyJhbGciOiJFUzM4NCIsInR5cCI6IkpXVCJ9.eyJhd3M6Y2hhbm5lbC1hcm4iOiJhcm46YXdzOml2czphcC1zb3V0aC0xOjQ5NTg0NjA4Mjk0NTpjaGFubmVsL3VGajFjTmRWUWViZyIsImF3czphY2Nlc3MtY29udHJvbC1hbGxvdy1vcmlnaW4iOiIqIiwiYXdzOnN0cmljdC1vcmlnaW4tZW5mb3JjZW1lbnQiOnRydWUsImF3czpzaW5nbGUtdXNlLXV1aWQiOiIxMDVjMjI3My1hNTZkLTRiOTYtOGQ2MC1kNGExZWMwMDU1NDciLCJhd3M6dmlld2VyLWlkIjoiMDAzZmI4MzYtMjRlMi00OGFhLWI5ZGYtOTc1NzNmYjQ5NzI3IiwiaWF0IjoxNzM1ODA2NTI3LCJleHAiOjE3MzU4MDcxMjd9.3fxH9yX9WoWALFUnBp5UM0BipjxwiDAuqdNx-6RPTk33OIPSWdonIdXtjROQHAEvSNk4baejwBh-2I2t6Aq_vrpDXxAlMTwrldZE5eYi3MdiY7IU7aBmLyWUO1oFONaL",
//     "expiration": "600s"
// }